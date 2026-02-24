import { useChatStore } from "@/stores/chat.store"
import { useDocumentStore } from "@/stores/document.store"
import { resolveSemanticScope } from "@/lib/semantic-lift"
import type { NodeId } from "@/domain/types"

interface BlockActionMenuProps {
  nodeId: NodeId
  isVisible: boolean
  onCreateThread?: () => void
  className?: string
}

/**
 * BlockActionMenu - Notion-style hover actions for blocks.
 * Shows contextual actions like "Start Thread", "Copy Link", etc.
 */
export function BlockActionMenu({ 
  nodeId, 
  isVisible, 
  onCreateThread,
  className = ""
}: BlockActionMenuProps) {
  const { createThread, getThreadsByNode } = useChatStore()
  const { exploration } = useDocumentStore()
  
  const threads = getThreadsByNode(nodeId)
  const hasThreads = threads.length > 0
  
  const handleStartThread = () => {
    try {
      const scope = resolveSemanticScope(nodeId, exploration.nodesById, exploration.rootIds)
      const headingNode = exploration.nodesById[scope.rootNodeId]
      
      console.log('[BlockActionMenu] Creating thread for:', {
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
      
      console.log('[BlockActionMenu] Created thread:', threadId)
      onCreateThread?.()
    } catch (error) {
      console.error('Failed to create thread:', error)
    }
  }
  
  const handleCopyLink = () => {
    console.log('[BlockActionMenu] Copy link for node:', nodeId)
    // Future: implement block linking
  }
  
  // Debug: log when component renders
  console.log('[BlockActionMenu] Rendering for node:', nodeId, { hasThreads, threadsCount: threads.length })
  
  if (!isVisible) return null
  
  return (
    <>
      {/* Hover Debug Indicator - remove this later */}
      <div className="absolute left-[-80px] top-0 w-2 h-full bg-red-200 group-hover:bg-red-400 transition-colors opacity-20" 
           title="Hover Debug - should turn darker red on hover" />
      
      {/* Main Action Menu */}
      <div className={`
        absolute left-[-60px] top-1/2 -translate-y-1/2 z-30
        flex items-center gap-2 
        transition-all duration-300 ease-out
        opacity-100 translate-x-0 
        bg-red-100 border border-red-300 p-2 rounded
        ${className}
      `}>
        {/* Plus icon for actions */}
        <button
          className="w-8 h-8 rounded-md bg-white hover:bg-gray-50 border border-gray-300 shadow-md flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            console.log('[BlockActionMenu] Plus button clicked for node:', nodeId)
          }}
          title="Block Actions"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8.5 2.75a.75.75 0 0 0-1.5 0V7H2.75a.75.75 0 0 0 0 1.5H7v4.25a.75.75 0 0 0 1.5 0V8.5h4.25a.75.75 0 0 0 0-1.5H8.5V2.75Z"/>
          </svg>
        </button>
        
        {/* Quick action buttons */}
        <div className="flex items-center gap-1">
          {/* Start Thread */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              console.log('[BlockActionMenu] Thread button clicked')
              handleStartThread()
            }}
            className={`
              w-8 h-8 rounded-md bg-white hover:bg-blue-50 border shadow-md flex items-center justify-center
              transition-colors text-sm font-medium
              ${hasThreads ? 'text-blue-600 border-blue-300 bg-blue-50' : 'text-gray-500 border-gray-300'}
            `}
            title={hasThreads ? `${threads.length} thread${threads.length === 1 ? '' : 's'} - Click to add another` : "Start Thread (💬)"}
          >
            💬
          </button>
          
          {/* Copy Link */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              console.log('[BlockActionMenu] Link button clicked')
              handleCopyLink()
            }}
            className="w-8 h-8 rounded-md bg-white hover:bg-gray-50 border border-gray-300 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors text-sm"
            title="Copy Link to Block (🔗)"
          >
            🔗
          </button>
        </div>
      </div>
    </>
  )
}