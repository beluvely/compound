import { useSpecStore } from "@/stores/spec.store"
import { useDocumentStore } from "@/stores/document.store"
import { SpecBlockRenderer } from "@/components/common/SpecBlockRenderer"
import { ArrowUp } from "lucide-react"
import { useEffect } from "react"
import { useViewStore } from "@/stores/view.store"
import type { NodeId } from "@/domain/types"

/**
 * SpecView - The curated source of truth.
 * 
 * M1.5: Composed of lifted/transcluded blocks from Exploration.
 * Users lift content via ⌘⇧L shortcut.
 */
export function SpecView() {
  const spec = useSpecStore((s) => s.spec)
  const exploration = useDocumentStore((s) => s.exploration)
  const { view, selectNode } = useViewStore()

  // Build flat list of all transcluded node IDs for navigation
  const allNodeIds: NodeId[] = []
  spec.rootIds.forEach(blockId => {
    const block = spec.blocksById[blockId]
    if (block?.kind === "transclusion" && block.sourceNodeId) {
      // Get all nodes in this transclusion
      const { resolveSemanticScope } = require("@/lib/semantic-lift")
      const scope = block.includeSubtree
        ? resolveSemanticScope(block.sourceNodeId, exploration.nodesById, exploration.rootIds)
        : { includedNodeIds: [block.sourceNodeId] }
      allNodeIds.push(...scope.includedNodeIds)
    }
  })

  // Global arrow key navigation
  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      // Only handle if not in textarea/input
      const target = e.target as HTMLElement
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
        return
      }

      // ArrowDown: Move to next node
      if (e.key === 'ArrowDown' && view.selectedNodeId) {
        e.preventDefault()
        const currentIndex = allNodeIds.indexOf(view.selectedNodeId)
        if (currentIndex < allNodeIds.length - 1) {
          const nextId = allNodeIds[currentIndex + 1]
          selectNode(nextId)
          // Scroll into view
          const element = document.querySelector(`[data-block-id="${nextId}"]`)
          element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
        return
      }

      // ArrowUp: Move to previous node
      if (e.key === 'ArrowUp' && view.selectedNodeId) {
        e.preventDefault()
        const currentIndex = allNodeIds.indexOf(view.selectedNodeId)
        if (currentIndex > 0) {
          const prevId = allNodeIds[currentIndex - 1]
          selectNode(prevId)
          // Scroll into view
          const element = document.querySelector(`[data-block-id="${prevId}"]`)
          element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
        return
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [view.selectedNodeId, allNodeIds, selectNode])

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Spec</h1>
            <p className="text-sm text-gray-500">
              Curated source of truth, composed from Exploration
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {spec.rootIds.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center max-w-md space-y-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-gray-100 p-4">
                  <ArrowUp className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  No content in Spec yet
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                  Lift nodes from Exploration to build your spec document.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 text-left">
                  <p className="text-xs text-gray-600 font-medium mb-2">Quick tip:</p>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div>1. Select a block in Exploration</div>
                    <div>2. Press <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-gray-700">⌘⇧L</kbd></div>
                    <div>3. The block and its semantic scope appears here</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl py-6">
            {spec.rootIds.map((blockId) => (
              <SpecBlockRenderer
                key={blockId}
                blockId={blockId}
                exploration={exploration}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
