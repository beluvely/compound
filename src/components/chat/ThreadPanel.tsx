import { useState } from "react"
import { useChatStore } from "@/stores/chat.store"
import { useDocumentStore } from "@/stores/document.store"
import { useViewStore } from "@/stores/view.store"
import { resolveSemanticScope } from "@/lib/semantic-lift"
import type { NodeId, ChatThread } from "@/domain/types"

interface ThreadPanelProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

/**
 * ThreadPanel provides a sidebar for managing chat threads.
 * Threads are scoped to the current semantic context (heading + content).
 */
export function ThreadPanel({ isOpen, onToggle, className = "" }: ThreadPanelProps) {
  const { threads, activeThreadId, createThread, setActiveThread, getThreadsByNode } = useChatStore()
  const { exploration } = useDocumentStore()
  const { view } = useViewStore()
  const [isCreating, setIsCreating] = useState(false)
  
  // Get current semantic scope for creating new threads
  const getCurrentScope = (): { nodeId: NodeId; title: string } | null => {
    if (!view.selectedNodeId) return null
    
    try {
      const scope = resolveSemanticScope(
        view.selectedNodeId,
        exploration.nodesById,
        exploration.rootIds
      )
      const headingNode = exploration.nodesById[scope.rootNodeId]
      return {
        nodeId: scope.rootNodeId,
        title: headingNode?.content.value || "Untitled Section"
      }
    } catch {
      return null
    }
  }
  
  const handleCreateThread = () => {
    const scope = getCurrentScope()
    if (!scope) return
    
    const threadId = createThread({
      nodeId: scope.nodeId,
      title: `Discussion: ${scope.title.slice(0, 30)}${
        scope.title.length > 30 ? '...' : ''
      }`
    })
    
    setActiveThread(threadId)
    setIsCreating(false)
  }
  
  const currentScope = getCurrentScope()
  const currentThreads = currentScope ? getThreadsByNode(currentScope.nodeId) : []
  const allThreads = Object.values(threads).filter(t => !t.isArchived)
  
  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-4 top-20 z-10 p-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        title="Open Chat Panel (⌘⇧T)"
      >
        💬
      </button>
    )
  }
  
  return (
    <div className={`fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 shadow-lg z-20 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Chat Threads</h2>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600"
          title="Close Panel"
        >
          ✕
        </button>
      </div>
      
      {/* Current Scope */}
      {currentScope && (
        <div className="p-4 bg-blue-50 border-b border-gray-200">
          <div className="text-sm text-blue-800 font-medium mb-2">
            Current Section
          </div>
          <div className="text-sm text-blue-700">
            {currentScope.title}
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="mt-2 text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
          >
            + New Thread Here
          </button>
        </div>
      )}
      
      {/* Thread Creation Modal */}
      {isCreating && (
        <div className="p-4 border-b border-gray-200 bg-yellow-50">
          <div className="text-sm font-medium text-gray-900 mb-2">
            Create thread for: {currentScope?.title}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCreateThread}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Create
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      
      {/* Threads List */}
      <div className="flex-1 overflow-y-auto">
        {currentThreads.length > 0 && (
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              This Section ({currentThreads.length})
            </h3>
            {currentThreads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isActive={activeThreadId === thread.id}
                onClick={() => setActiveThread(thread.id)}
              />
            ))}
          </div>
        )}
        
        {allThreads.length > currentThreads.length && (
          <div className="p-4 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              All Threads ({allThreads.length})
            </h3>
            {allThreads.map((thread) => (
              <ThreadItem
                key={thread.id}
                thread={thread}
                isActive={activeThreadId === thread.id}
                onClick={() => setActiveThread(thread.id)}
              />
            ))}
          </div>
        )}
        
        {allThreads.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm">
            No threads yet. Select a section and create your first thread!
          </div>
        )}
      </div>
    </div>
  )
}

interface ThreadItemProps {
  thread: ChatThread
  isActive: boolean
  onClick: () => void
}

function ThreadItem({ thread, isActive, onClick }: ThreadItemProps) {
  return (
    <div
      onClick={onClick}
      className={`
        p-3 rounded-lg cursor-pointer mb-2 border transition-colors
        ${isActive 
          ? 'bg-blue-100 border-blue-300' 
          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
        }
      `}
    >
      <div className="font-medium text-sm text-gray-900 truncate">
        {thread.title}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {thread.messages.length} messages
      </div>
    </div>
  )
}