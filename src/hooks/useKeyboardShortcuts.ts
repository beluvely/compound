import { useEffect } from "react"
import { useNavigationStore } from "@/stores/navigation.store"
import { useViewStore } from "@/stores/view.store"
import { useSpecStore } from "@/stores/spec.store"
import { useDocumentStore } from "@/stores/document.store"
import { resolveSemanticScope } from "@/lib/semantic-lift"
import { useToastStore } from "@/components/ui/toast"

/**
 * Global keyboard shortcuts for M1.5
 * 
 * Shortcuts:
 * - ⌘+K: Open view switcher
 * - ⌘+=: Go up to Spec
 * - ⌘+-: Go down to Exploration
 * - ⌘+⇧+L: Lift semantic scope to Spec
 * - ⌘+↩: Jump to source (from Spec)
 */
export function useKeyboardShortcuts() {
  const {
    openViewSwitcher,
    goUp,
    goDown,
    currentView,
  } = useNavigationStore()

  const { view, selectNode } = useViewStore()
  const { liftTransclusion } = useSpecStore()
  const { exploration } = useDocumentStore()
  const { addToast } = useToastStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey
      
      // Don't trigger shortcuts when typing in input/textarea
      // EXCEPT for global navigation shortcuts (⌘+K, ⌘+=, ⌘+-, ⌘+⇧+L)
      const target = e.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Allow these shortcuts even in editor
        const isGlobalShortcut = isMod && (
          e.key === "k" || 
          e.key === "=" || 
          e.key === "-" || 
          (e.shiftKey && (e.key === "L" || e.key === "l"))
        )
        if (!isGlobalShortcut) {
          return
        }
      }

      // ⌘+K: Open view switcher
      if (isMod && e.key === "k") {
        e.preventDefault()
        openViewSwitcher()
        return
      }

      // ⌘+=: Go up to Spec
      if (isMod && e.key === "=") {
        e.preventDefault()
        goUp()
        addToast("Navigated to Spec", "info", 2000)
        return
      }

      // ⌘+-: Go down to Exploration
      if (isMod && e.key === "-") {
        e.preventDefault()
        goDown()
        addToast("Navigated to Exploration", "info", 2000)
        return
      }

      // ⌘+⇧+L: Lift semantic scope to Spec
      if (isMod && e.shiftKey && (e.key === "L" || e.key === "l")) {
        e.preventDefault()
        
        console.log("[Lift] Command triggered", {
          currentView,
          selectedNodeId: view.selectedNodeId,
          hasExploration: !!exploration.nodesById,
        })
        
        if (currentView === "exploration" && view.selectedNodeId) {
          const scope = resolveSemanticScope(
            view.selectedNodeId,
            exploration.nodesById,
            exploration.rootIds
          )

          console.log("[Lift] Resolved scope:", scope)

          // Lift the entire semantic scope
          liftTransclusion({
            sourceNodeId: scope.rootNodeId,
            includeSubtree: true, // Include all nodes in scope
          })

          const nodeCount = scope.includedNodeIds.length
          addToast(
            `Lifted ${nodeCount} block${nodeCount > 1 ? "s" : ""} to Spec`,
            "success",
            3000
          )
        } else if (!view.selectedNodeId) {
          addToast("No block selected", "error", 2000)
        } else {
          addToast("Must be in Exploration view to lift", "error", 2000)
        }
        return
      }

      // ⌘+↩: Jump to source (from Spec)
      if (isMod && e.key === "Enter") {
        e.preventDefault()
        
        if (currentView === "spec") {
          // TODO: Implement jump to source
          // Need to track which transclusion block is focused
          // and navigate to its sourceNodeId in Exploration
          addToast("Jump to source (coming soon)", "info", 2000)
        }
        return
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [
    openViewSwitcher,
    goUp,
    goDown,
    currentView,
    view.selectedNodeId,
    exploration,
    liftTransclusion,
    addToast,
    selectNode,
  ])
}
