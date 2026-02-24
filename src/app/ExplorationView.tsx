import { useState, useCallback, useEffect } from "react"
import { useDocumentStore } from "@/stores/document.store"
import { useViewStore } from "@/stores/view.store"
import { SimpleBlockEditor } from "@/components/editor/SimpleBlockEditor"
import { TipTapNodeEditor } from "@/components/editor/TipTapNodeEditor"
import { createSeedDocument } from "@/lib/seed-data"
import { persistStoresToIndexedDb } from "@/stores/hydrate"
import type { Node, NodeId } from "@/domain/types"
import type { Editor } from "@tiptap/react"

/**
 * ExplorationView - The messy workbench for thinking.
 * 
 * Phase 1: Testing TipTap read-only rendering alongside SimpleBlockEditor
 * Phase 2: Enable editing with bidirectional sync
 * Phase 4: Wire up TipTap editor for lifting
 */
export function ExplorationView() {
  const exploration = useDocumentStore((s) => s.exploration)
  const init = useDocumentStore((s) => s.init)
  const syncFromEditor = useDocumentStore((s) => s.syncFromEditor)
  const setTipTapEditor = useViewStore((s) => s.setTipTapEditor)
  const [useTipTap, setUseTipTap] = useState(true)
  const [enableEditing, setEnableEditing] = useState(false) // Phase 2: toggle editing
  
  const isEmpty = exploration.rootIds.length === 0
  
  const handleSeedData = () => {
    const seedDoc = createSeedDocument()
    init(seedDoc)
  }

  const handleEditorUpdate = useCallback((nodes: Node[], rootIds: NodeId[]) => {
    console.log("Syncing from TipTap to store:", { nodes, rootIds })
    syncFromEditor({ nodes, rootIds })
  }, [syncFromEditor])

  // Phase 4: Store editor instance for keyboard shortcuts
  const handleEditorReady = useCallback((editor: Editor) => {
    console.log("[Phase 4] TipTap editor ready, storing in viewStore")
    setTipTapEditor(editor)
  }, [setTipTapEditor])

  // Cleanup: Clear editor reference when switching away from TipTap
  useEffect(() => {
    if (!useTipTap) {
      setTipTapEditor(null)
    }
  }, [useTipTap, setTipTapEditor])

  // Auto-save to IndexedDB when exploration changes
  useEffect(() => {
    const timer = setTimeout(() => {
      persistStoresToIndexedDb().catch((err) => {
        console.error("Failed to persist:", err)
      })
    }, 1000) // Debounce 1s (increased to reduce frequency)

    return () => clearTimeout(timer)
  }, [exploration])

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Exploration</h1>
            <p className="text-sm text-gray-500">
              Workbench for thinking, alternatives, and rationale
            </p>
          </div>
          
          {/* Phase 2: Testing controls */}
          <div className="flex gap-2">
            {isEmpty && (
              <button
                onClick={handleSeedData}
                className="text-xs px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                🌱 Add Test Data
              </button>
            )}
            <button
              onClick={() => setEnableEditing(!enableEditing)}
              className={`text-xs px-3 py-1 rounded border ${
                enableEditing
                  ? "bg-green-100 hover:bg-green-200 border-green-300 text-green-700"
                  : "bg-gray-100 hover:bg-gray-200 border-gray-300"
              }`}
            >
              {enableEditing ? "✏️ Editing ON (Phase 2)" : "🔒 Read-only (Phase 1)"}
            </button>
            <button
              onClick={() => setUseTipTap(!useTipTap)}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded border border-gray-300"
            >
              {useTipTap ? "TipTap" : "SimpleBlockEditor (Old)"}
            </button>
          </div>
        </div>
      </div>

      {/* Block Editor */}
      <div className="flex-1 overflow-hidden">
        {useTipTap ? (
          <TipTapNodeEditor
            rootIds={exploration.rootIds}
            nodesById={exploration.nodesById}
            placeholder="Start writing your thoughts..."
            editable={enableEditing}
            onUpdate={handleEditorUpdate}
            onEditorReady={handleEditorReady}
          />
        ) : (
          <SimpleBlockEditor
            rootIds={exploration.rootIds}
            nodesById={exploration.nodesById}
            placeholder="Start writing your thoughts..."
          />
        )}
      </div>
    </div>
  )
}
