import type { Node, NodeId } from "@/domain/types"

/**
 * Semantic Scope Resolution
 * 
 * Rules:
 * - H1 lifts until next H1
 * - H2 lifts until next H2 within same H1
 * - H3 lifts until next H3 within same H2
 * - Bullet lifts its nested bullet subtree
 * - Paragraph lifts itself (and children if applicable)
 */

export interface SemanticScope {
  rootNodeId: NodeId
  includedNodeIds: NodeId[]
}

/**
 * Resolve the semantic scope for a given node.
 * Returns the root node ID and all node IDs that should be included.
 */
export function resolveSemanticScope(
  nodeId: NodeId,
  allNodes: Record<NodeId, Node>,
  rootIds: NodeId[]
): SemanticScope {
  const node = allNodes[nodeId]
  if (!node) {
    return { rootNodeId: nodeId, includedNodeIds: [nodeId] }
  }

  const contentType = node.content.type
  const level = node.content.metadata?.level as number | undefined

  // For headings, we need to find the scope based on level
  if (contentType === "heading" && level) {
    return resolveHeadingScope(nodeId, level, allNodes, rootIds)
  }

  // For lists, include the entire subtree
  if (contentType === "list") {
    return {
      rootNodeId: nodeId,
      includedNodeIds: [nodeId, ...collectAllDescendants(nodeId, allNodes)],
    }
  }

  // For paragraphs and other types, include self and direct children
  return {
    rootNodeId: nodeId,
    includedNodeIds: [nodeId, ...node.children],
  }
}

/**
 * Resolve heading scope based on heading level hierarchy.
 * H1 includes content until next H1
 * H2 includes content until next H2 (but stops at next H1)
 * H3 includes content until next H3 (but stops at next H1 or H2)
 */
function resolveHeadingScope(
  headingNodeId: NodeId,
  headingLevel: number,
  allNodes: Record<NodeId, Node>,
  rootIds: NodeId[]
): SemanticScope {
  const included: NodeId[] = [headingNodeId]
  
  // Find the position of this heading in the document
  const allRootAndChildren = flattenDocument(rootIds, allNodes)
  const startIndex = allRootAndChildren.indexOf(headingNodeId)
  
  if (startIndex === -1) {
    return { rootNodeId: headingNodeId, includedNodeIds: [headingNodeId] }
  }

  // Scan forward until we hit a heading of equal or higher level
  for (let i = startIndex + 1; i < allRootAndChildren.length; i++) {
    const currentId = allRootAndChildren[i]
    const currentNode = allNodes[currentId]
    
    if (!currentNode) continue

    // Stop if we hit a heading of equal or higher level (lower number = higher level)
    if (currentNode.content.type === "heading") {
      const currentLevel = currentNode.content.metadata?.level as number | undefined
      if (currentLevel && currentLevel <= headingLevel) {
        break
      }
    }

    included.push(currentId)
  }

  return {
    rootNodeId: headingNodeId,
    includedNodeIds: included,
  }
}

/**
 * Flatten the document into a linear array of node IDs (depth-first)
 */
function flattenDocument(
  rootIds: NodeId[],
  allNodes: Record<NodeId, Node>
): NodeId[] {
  const result: NodeId[] = []

  function visit(nodeId: NodeId) {
    result.push(nodeId)
    const node = allNodes[nodeId]
    if (node?.children) {
      node.children.forEach(visit)
    }
  }

  rootIds.forEach(visit)
  return result
}

/**
 * Collect all descendant node IDs recursively
 */
function collectAllDescendants(
  nodeId: NodeId,
  allNodes: Record<NodeId, Node>
): NodeId[] {
  const node = allNodes[nodeId]
  if (!node || !node.children.length) {
    return []
  }

  const descendants: NodeId[] = []
  function visit(id: NodeId) {
    descendants.push(id)
    const n = allNodes[id]
    if (n?.children) {
      n.children.forEach(visit)
    }
  }

  node.children.forEach(visit)
  return descendants
}

/**
 * Get the parent node ID for a given node
 */
export function findParentNode(
  nodeId: NodeId,
  allNodes: Record<NodeId, Node>,
  rootIds: NodeId[]
): NodeId | null {
  for (const [parentId, parentNode] of Object.entries(allNodes)) {
    if (parentNode.children.includes(nodeId)) {
      return parentId as NodeId
    }
  }
  
  // Check if it's a root node
  if (rootIds.includes(nodeId)) {
    return null
  }

  return null
}
