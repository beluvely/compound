import { useDocumentStore } from "@/stores/document.store"
import { SimpleBlockEditor } from "@/components/editor/SimpleBlockEditor"

/**
 * ExplorationView - The messy workbench for thinking.
 * 
 * M1.5: No explicit "Add Node" button - just start typing.
 * Editor handles block creation automatically.
 */
export function ExplorationView() {
  const exploration = useDocumentStore((s) => s.exploration)

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
        </div>
      </div>

      {/* Block Editor */}
      <div className="flex-1 overflow-hidden">
        <SimpleBlockEditor
          rootIds={exploration.rootIds}
          nodesById={exploration.nodesById}
          placeholder="Start writing your thoughts..."
        />
      </div>
    </div>
  )
}
