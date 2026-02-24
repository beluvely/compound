import { useChatStore } from "@/stores/chat.store"
import type { NodeId } from "@/domain/types"

interface ThreadIndicatorProps {
  nodeId: NodeId
  className?: string
}

/**
 * ThreadIndicator shows a small badge with thread count for a given node.
 * Clicking it will focus the thread panel on threads for this section.
 */
export function ThreadIndicator({ nodeId, className = "" }: ThreadIndicatorProps) {
  const { getThreadsByNode, setActiveThread } = useChatStore()
  const threads = getThreadsByNode(nodeId)
  
  if (threads.length === 0) {
    return null
  }
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Focus on the first thread for this node
    if (threads[0]) {
      setActiveThread(threads[0].id)
    }
  }
  
  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium
        bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors
        ml-2 opacity-75 hover:opacity-100
        ${className}
      `}
      title={`${threads.length} thread${threads.length === 1 ? '' : 's'}`}
    >
      💬 {threads.length}
    </button>
  )
}