/**
 * TipTap ↔ Node Graph Bidirectional Sync
 * 
 * Converts between our Node graph structure and TipTap's JSON format.
 * Preserves node IDs for stable references (lift, transclusion).
 */

import type { Node, NodeId } from "@/domain/types"

/**
 * TipTap JSON node structure (simplified)
 */
interface TipTapNode {
  type: string
  attrs?: Record<string, unknown>
  content?: TipTapNode[]
  text?: string
}

interface TipTapDocument {
  type: "doc"
  content: TipTapNode[]
}

/**
 * Convert our node graph to TipTap JSON format
 * 
 * Groups consecutive list nodes into unified bulletList elements
 * 
 * @param nodesById - Map of all nodes
 * @param rootIds - Top-level node IDs to render
 * @returns TipTap JSON document
 */
export function nodesToTipTapJSON(
  nodesById: Record<NodeId, Node>,
  rootIds: NodeId[]
): TipTapDocument {
  const content: TipTapNode[] = []
  let i = 0

  while (i < rootIds.length) {
    const nodeId = rootIds[i]
    const node = nodesById[nodeId]
    
    if (!node) {
      i++
      continue
    }

    // Check if this is a list node - if so, group consecutive lists
    if (node.content.type === "list") {
      const listItems: TipTapNode[] = []
      const listNodeIds: NodeId[] = []

      // Collect all consecutive list nodes
      while (i < rootIds.length) {
        const currentId = rootIds[i]
        const currentNode = nodesById[currentId]
        
        if (!currentNode || currentNode.content.type !== "list") {
          break
        }

        // Add this node as a list item
        listItems.push({
          type: "listItem",
          content: [
            {
              type: "paragraph",
              attrs: { nodeId: currentId },
              content: currentNode.content.value
                ? [{ type: "text", text: currentNode.content.value }]
                : [],
            },
          ],
        })
        listNodeIds.push(currentId)
        i++
      }

      // Create a single bulletList with all items
      content.push({
        type: "bulletList",
        attrs: {
          // Store all nodeIds in the list for tracking
          nodeIds: listNodeIds,
        },
        content: listItems,
      })
    } else {
      // Non-list node: convert normally
      const tiptapNode = nodeToTipTapNode(node, nodesById)
      if (tiptapNode) {
        content.push(tiptapNode)
      }
      i++
    }
  }

  // If no content, add empty paragraph (TipTap requires at least one block)
  if (content.length === 0) {
    content.push({
      type: "paragraph",
      attrs: { nodeId: null },
    })
  }

  return {
    type: "doc",
    content,
  }
}

/**
 * Convert a single Node to TipTap JSON format
 * 
 * Note: List nodes are handled specially in nodesToTipTapJSON() to group consecutive items
 */
function nodeToTipTapNode(
  node: Node,
  _nodesById: Record<NodeId, Node>
): TipTapNode | null {
  const { id: nodeId, content } = node
  const text = content.value

  switch (content.type) {
    case "heading": {
      const level = (content.metadata?.level as number) || 1
      return {
        type: "heading",
        attrs: {
          level: Math.max(1, Math.min(3, level)), // Clamp to 1-3
          nodeId,
        },
        content: text ? [{ type: "text", text }] : [],
      }
    }

    case "list": {
      // This should not be called for list nodes (handled in nodesToTipTapJSON)
      // but keeping as fallback
      return {
        type: "bulletList",
        attrs: { nodeIds: [nodeId] },
        content: [
          {
            type: "listItem",
            content: [
              {
                type: "paragraph",
                attrs: { nodeId },
                content: text ? [{ type: "text", text }] : [],
              },
            ],
          },
        ],
      }
    }

    case "code": {
      return {
        type: "codeBlock",
        attrs: { nodeId },
        content: text ? [{ type: "text", text }] : [],
      }
    }

    case "text":
    default: {
      return {
        type: "paragraph",
        attrs: { nodeId },
        content: text ? [{ type: "text", text }] : [],
      }
    }
  }
}

/**
 * Convert TipTap JSON back to our Node structure
 * 
 * Handles both individual nodes and grouped lists
 * 
 * @param tiptapJSON - TipTap document JSON
 * @returns Array of Nodes with IDs
 */
export function tiptapJSONToNodes(
  tiptapJSON: TipTapDocument
): { nodes: Node[]; rootIds: NodeId[] } {
  const nodes: Node[] = []
  const rootIds: NodeId[] = []
  const now = new Date().toISOString()

  for (const tiptapNode of tiptapJSON.content) {
    const converted = tiptapNodeToNodes(tiptapNode, now)
    nodes.push(...converted.nodes)
    rootIds.push(...converted.rootIds)
  }

  return { nodes, rootIds }
}

/**
 * Convert a single TipTap node to our Node structure
 * Handles special case of bulletList with multiple items
 */
function tiptapNodeToNodes(
  tiptapNode: TipTapNode,
  timestamp: string
): { nodes: Node[]; rootIds: NodeId[] } {
  const nodes: Node[] = []
  const rootIds: NodeId[] = []

  switch (tiptapNode.type) {
    case "heading": {
      const nodeId = (tiptapNode.attrs?.nodeId as NodeId) || generateNodeId()
      const level = (tiptapNode.attrs?.level as number) || 1
      const text = extractText(tiptapNode)

      nodes.push({
        id: nodeId,
        type: "block",
        content: {
          type: "heading",
          value: text,
          metadata: { level },
        },
        children: [],
        tags: [],
        meta: {
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      })
      rootIds.push(nodeId)
      break
    }

    case "paragraph": {
      const nodeId = (tiptapNode.attrs?.nodeId as NodeId) || generateNodeId()
      const text = extractText(tiptapNode)

      nodes.push({
        id: nodeId,
        type: "block",
        content: {
          type: "text",
          value: text,
        },
        children: [],
        tags: [],
        meta: {
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      })
      rootIds.push(nodeId)
      break
    }

    case "bulletList": {
      // Handle grouped list: extract nodeIds from list or individual items
      const listNodeIds = (tiptapNode.attrs?.nodeIds as NodeId[]) || []
      const listItems = tiptapNode.content || []

      listItems.forEach((listItem, index) => {
        if (listItem.type !== "listItem") return

        // Each listItem contains a paragraph with nodeId
        const itemParagraph = listItem.content?.[0]
        if (!itemParagraph) return

        // PRIORITIZE paragraph attrs over index mapping for robustness during edits
        const nodeId =
          (itemParagraph.attrs?.nodeId as NodeId) ||
          listNodeIds[index] ||
          generateNodeId()
        const text = extractText(itemParagraph)

        nodes.push({
          id: nodeId,
          type: "block",
          content: {
            type: "list",
            value: text,
          },
          children: [],
          tags: [],
          meta: {
            createdAt: timestamp,
            updatedAt: timestamp,
          },
        })
        rootIds.push(nodeId)
      })
      break
    }

    case "codeBlock": {
      const nodeId = (tiptapNode.attrs?.nodeId as NodeId) || generateNodeId()
      const text = extractText(tiptapNode)

      nodes.push({
        id: nodeId,
        type: "block",
        content: {
          type: "code",
          value: text,
        },
        children: [],
        tags: [],
        meta: {
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      })
      rootIds.push(nodeId)
      break
    }

    default:
      console.warn("Unknown TipTap node type:", tiptapNode.type)
  }

  return { nodes, rootIds }
}

/**
 * Extract plain text from TipTap node content
 */
function extractText(node: TipTapNode): string {
  if (node.text) return node.text

  if (node.content) {
    return node.content.map((child) => extractText(child)).join("")
  }

  return ""
}

/**
 * Generate a unique node ID
 */
function generateNodeId(): NodeId {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID() as NodeId
  }
  return `node_${Math.random().toString(16).slice(2)}_${Date.now()}` as NodeId
}

/**
 * Diff two node structures and return changes
 * 
 * Phase 2: This will identify what changed between TipTap and Store
 */
export function diffNodes(
  _oldNodes: Record<NodeId, Node>,
  _newNodes: Record<NodeId, Node>
): {
  created: NodeId[]
  updated: NodeId[]
  deleted: NodeId[]
} {
  // TODO: Implement in Phase 2
  return { created: [], updated: [], deleted: [] }
}
