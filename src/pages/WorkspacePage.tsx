import { useEffect, useState } from "react"
import { ExplorationView } from "@/app/ExplorationView"
import { SpecView } from "@/app/SpecView"
import { hydrateStoresFromIndexedDb } from "@/stores/hydrate"
import { ViewSwitcher } from "@/components/navigation/ViewSwitcher"
import { ToastContainer } from "@/components/ui/toast"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useNavigationStore } from "@/stores/navigation.store"
import { ThreadPanel } from "@/components/chat/ThreadPanel"

export function WorkspacePage() {
  const [isHydrated, setIsHydrated] = useState(false)
  const [isThreadPanelOpen, setIsThreadPanelOpen] = useState(false)
  const { currentView } = useNavigationStore()
  
  // Register global keyboard shortcuts
  useKeyboardShortcuts()

  useEffect(() => {
    hydrateStoresFromIndexedDb().then(() => {
      setIsHydrated(true)
    })
  }, [])

  // Thread panel keyboard shortcut (⌘+Shift+T)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey
      if (isMod && e.shiftKey && e.key === "T") {
        e.preventDefault()
        setIsThreadPanelOpen(!isThreadPanelOpen)
      }
      // Debug: Create test thread with ⌘+Shift+R
      if (isMod && e.shiftKey && e.key === "R") {
        e.preventDefault()
        console.log('Creating test thread...')
        // Import chat store manually for debugging
        import('@/stores/chat.store').then(({ useChatStore }) => {
          const { createThread } = useChatStore.getState()
          const threadId = createThread({
            nodeId: 'seed-1', // Assuming seed data has this
            title: 'Debug Test Thread'
          })
          console.log('Created debug thread:', threadId)
        })
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isThreadPanelOpen])

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  // M1.5: View-based layout (not split screen)
  // Show either Exploration or Spec based on navigation state
  const showSplitView = true // For now, keep split view during transition

  return (
    <>
      <div className="flex h-screen">
        {showSplitView ? (
          <>
            {/* Exploration (left) */}
            <div className="w-1/2 border-r border-gray-200">
              <ExplorationView />
            </div>

            {/* Spec (right) */}
            <div className="w-1/2">
              <SpecView />
            </div>
          </>
        ) : (
          // Single view based on navigation
          <div className="w-full">
            {currentView === "exploration" && <ExplorationView />}
            {currentView === "spec" && <SpecView />}
            {currentView === "tasks" && (
              <div className="flex h-full items-center justify-center text-gray-500">
                Tasks view coming soon
              </div>
            )}
            {currentView === "chats" && (
              <div className="flex h-full items-center justify-center text-gray-500">
                Conversations view coming soon
              </div>
            )}
          </div>
        )}
      </div>

      {/* Thread Panel */}
      <ThreadPanel 
        isOpen={isThreadPanelOpen} 
        onToggle={() => setIsThreadPanelOpen(!isThreadPanelOpen)} 
      />

      {/* View Switcher (⌘+K) */}
      <ViewSwitcher />

      {/* Toast notifications */}
      <ToastContainer />

      {/* Keyboard shortcut hints */}
      <div className="fixed bottom-4 right-4 text-xs text-gray-400 bg-white/90 px-3 py-2 rounded shadow-sm border border-gray-200">
        <div className="space-y-1">
          <div><kbd>⌘K</kbd> View switcher</div>
          <div><kbd>⌘=</kbd> Go to Spec</div>
          <div><kbd>⌘-</kbd> Go to Exploration</div>
          <div><kbd>⌘⇧L</kbd> Lift to Spec</div>
          <div><kbd>⌘⇧T</kbd> Toggle Chat Panel</div>
          <div><kbd>⌘⇧R</kbd> Create Debug Thread</div>
        </div>
      </div>
    </>
  )
}
