import { useEffect } from "react"
import { useNavigationStore, type DocumentView } from "@/stores/navigation.store"
import { Command } from "lucide-react"

const VIEWS: Array<{ id: DocumentView; label: string; description: string }> = [
  {
    id: "exploration",
    label: "Exploration",
    description: "Messy workspace for thinking",
  },
  {
    id: "spec",
    label: "Spec",
    description: "Curated source of truth",
  },
  {
    id: "tasks",
    label: "Tasks",
    description: "Action items (coming soon)",
  },
  {
    id: "chats",
    label: "Conversations",
    description: "AI discussions (coming soon)",
  },
]

export function ViewSwitcher() {
  const {
    isViewSwitcherOpen,
    currentView,
    navigateTo,
    closeViewSwitcher,
  } = useNavigationStore()

  useEffect(() => {
    if (!isViewSwitcherOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        closeViewSwitcher()
      }

      // TODO: Add up/down navigation and Enter to select
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isViewSwitcherOpen, closeViewSwitcher])

  if (!isViewSwitcherOpen) return null

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-start justify-center pt-32 z-50"
      onClick={closeViewSwitcher}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-3 py-2 text-sm text-gray-500 flex items-center gap-2">
          <Command className="w-4 h-4" />
          <span>Switch View</span>
        </div>
        
        <div className="space-y-1">
          {VIEWS.map((view) => {
            const isActive = currentView === view.id
            const isDisabled = view.id === "tasks" || view.id === "chats"

            return (
              <button
                key={view.id}
                onClick={() => {
                  if (!isDisabled) {
                    navigateTo(view.id, true)
                    closeViewSwitcher()
                  }
                }}
                disabled={isDisabled}
                className={`
                  w-full text-left px-3 py-2 rounded
                  transition-colors
                  ${isActive ? "bg-gray-100 font-medium text-gray-900" : "hover:bg-gray-50 text-gray-900"}
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                `}
              >
                <div className="font-medium text-sm text-gray-900">{view.label}</div>
                <div className="text-xs text-gray-600">{view.description}</div>
              </button>
            )
          })}
        </div>

        <div className="px-3 py-2 text-xs text-gray-400 border-t mt-2">
          Press <kbd className="px-1 py-0.5 bg-gray-100 rounded">Esc</kbd> to
          close
        </div>
      </div>
    </div>
  )
}
