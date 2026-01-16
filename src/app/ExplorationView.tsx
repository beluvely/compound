import { useDocumentStore } from "@/stores/document.store"
import { useViewStore } from "@/stores/view.store"
import { NodeEditor } from "@/components/common/NodeEditor"
import { Button } from "@/components/ui/button"
import { Plus, Clipboard } from "lucide-react"
import { useEffect } from "react"

export function ExplorationView() {
  const exploration = useDocumentStore((s) => s.exploration)
  const createNode = useDocumentStore((s) => s.createNode)
  const duplicateNode = useDocumentStore((s) => s.duplicateNode)
  const selectedNodeId = useViewStore((s) => s.view.selectedNodeId)

  const handleAddNode = () => {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    
    createNode({
      node: {
        id,
        type: "text",
        content: { type: "text", value: "" },
        children: [],
        tags: [],
        meta: {
          createdAt: now,
          updatedAt: now,
        },
      },
    })
    
    // Focus the new node
    useViewStore.getState().selectNode(id)
  }

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const data = JSON.parse(text)
      
      if (data.action === 'copy' && data.nodeId) {
        duplicateNode({
          sourceNodeId: data.nodeId,
          mode: "shallow",
          includeSubtree: false,
        })
      }
    } catch (err) {
      console.warn('Failed to paste', err)
    }
  }

  // Keyboard shortcut for paste (Cmd/Ctrl+V)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        // Only handle if not in an input/textarea
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          handlePaste()
        }
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Exploration</h1>
            <p className="text-sm text-muted-foreground">
              Workbench for thinking, alternatives, and rationale
            </p>
          </div>
          <div className="flex gap-2">
            {/* <Button onClick={handlePaste} size="sm" variant="outline">
              <Clipboard className="mr-2 h-4 w-4" />
              Paste
            </Button> */}
            <Button onClick={handleAddNode} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Node
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {exploration.rootIds.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="mb-4 text-muted-foreground">
                No nodes yet. Start by adding your first node.
              </p>
              <Button onClick={handleAddNode}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Node
              </Button>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-2">
            {exploration.rootIds.map((nodeId) => (
              <NodeEditor
                key={nodeId}
                nodeId={nodeId}
                isSelected={selectedNodeId === nodeId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
