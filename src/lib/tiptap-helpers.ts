import type { Editor } from "@tiptap/react"
import type { NodeId } from "@/domain/types"

/**
 * Get the nodeId of the block at the current cursor position in TipTap.
 * 
 * Phase 4: Used for semantic lifting (⌘+Shift+L)
 * 
 * TipTap selection gives us the current position.
 * We traverse up the node tree to find the nearest block-level node
 * with a nodeId attribute (heading, paragraph, list item, etc.)
 */
export function getCurrentNodeId(editor: Editor | null): NodeId | null {
  if (!editor) return null

  const { state } = editor
  const { selection } = state
  const { $from } = selection

  console.log("[TipTap] Getting current nodeId", {
    pos: $from.pos,
    depth: $from.depth,
  })

  // Traverse up from cursor position to find block with nodeId
  for (let depth = $from.depth; depth >= 0; depth--) {
    const node = $from.node(depth)
    const nodeId = node.attrs?.nodeId as NodeId | undefined

    console.log(`[TipTap] Depth ${depth}:`, {
      type: node.type.name,
      nodeId,
      attrs: node.attrs,
    })

    if (nodeId) {
      console.log(`[TipTap] Found nodeId at depth ${depth}:`, nodeId)
      return nodeId
    }
  }

  console.warn("[TipTap] No nodeId found in selection hierarchy")
  return null
}

/**
 * Get all nodeIds from a bulletList node
 * (for grouped lists that have multiple nodeIds)
 */
export function getNodeIdsFromList(editor: Editor | null): NodeId[] | null {
  if (!editor) return null

  const { state } = editor
  const { selection } = state
  const { $from } = selection

  // Find the bulletList node
  for (let depth = $from.depth; depth >= 0; depth--) {
    const node = $from.node(depth)
    
    if (node.type.name === "bulletList") {
      const nodeIds = node.attrs?.nodeIds as NodeId[] | undefined
      if (nodeIds && Array.isArray(nodeIds)) {
        return nodeIds
      }
    }
  }

  return null
}
