import { useEffect } from "react"
import { useChatStore } from "@/stores/chat.store"
import { useDocumentStore } from "@/stores/document.store"
import { resolveSemanticScope } from "@/lib/semantic-lift"
import type { NodeId } from "@/domain/types"

interface TipTapBlockMenuProps {
  editor: any // TipTap Editor instance
}

/**
 * TipTapBlockMenu - Hover actions for TipTap blocks
 * Attaches click handlers to the CSS-based hover buttons
 */
export function TipTapBlockMenu({ editor }: TipTapBlockMenuProps) {
  const { createThread } = useChatStore()
  const { exploration } = useDocumentStore()
  
  useEffect(() => {
    if (!editor) return

    const editorElement = editor.view.dom as HTMLElement
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const block = target.closest('.ProseMirror > *') as HTMLElement
      
      if (!block) return
      
      // Check if click was on the pseudo-element hover button area
      const rect = block.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top
      
      // Hover button is at left: 10px, top: 50%, size: 28x28
      const buttonX = 10
      const buttonY = rect.height / 2 - 14
      
      const isHoverButtonClick = 
        clickX >= buttonX && 
        clickX <= buttonX + 28 &&
        clickY >= buttonY && 
        clickY <= buttonY + 28
      
      if (isHoverButtonClick) {
        e.preventDefault()
        e.stopPropagation()
        
        // Get nodeId from the block
        const nodeId = block.getAttribute('data-node-id')
        console.log('[TipTapBlockMenu] Hover button clicked for node:', nodeId)
        
        if (nodeId) {
          handleCreateThread(nodeId)
        }
      }
    }
    
    editorElement.addEventListener('click', handleClick)
    return () => editorElement.removeEventListener('click', handleClick)
  }, [editor])
  
  const handleCreateThread = (nodeId: NodeId) => {
    try {
      const scope = resolveSemanticScope(
        nodeId,
        exploration.nodesById,
        exploration.rootIds
      )
      const headingNode = exploration.nodesById[scope.rootNodeId]
      
      console.log('[TipTapBlockMenu] Creating thread for:', {
        nodeId,
        scopeRootId: scope.rootNodeId,
        headingText: headingNode?.content.value
      })
      
      const threadId = createThread({
        nodeId: scope.rootNodeId,
        title: `Discussion: ${headingNode?.content.value?.slice(0, 30) || 'Untitled'}${
          (headingNode?.content.value?.length || 0) > 30 ? '...' : ''
        }`
      })
      
      console.log('[TipTapBlockMenu] Created thread:', threadId)
    } catch (error) {
      console.error('Failed to create thread:', error)
    }
  }
  
  return null // This component only handles events, no UI
}
