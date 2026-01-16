import { useSpecStore } from "@/stores/spec.store"
import { useDocumentStore } from "@/stores/document.store"
import { SpecBlockRenderer } from "@/components/common/SpecBlockRenderer"
import { Button } from "@/components/ui/button"
import { Clipboard } from "lucide-react"
import { useEffect } from "react"

export function SpecView() {
  const spec = useSpecStore((s) => s.spec)
  const exploration = useDocumentStore((s) => s.exploration)
  const liftToSpec = useSpecStore((s) => s.liftToSpec)

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      const data = JSON.parse(text)
      
      if (data.action === 'copy' && data.nodeId) {
        liftToSpec({
          sourceNodeId: data.nodeId,
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
            <h1 className="text-2xl font-semibold">Spec</h1>
            <p className="text-sm text-muted-foreground">
              Derived source of truth, composed from Exploration
            </p>
          </div>
          {/* <Button onClick={handlePaste} size="sm" variant="outline">
            <Clipboard className="mr-2 h-4 w-4" />
            Paste
          </Button> */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {spec.rootIds.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">
                No content in Spec yet. Lift nodes from Exploration to build
                your spec.
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
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
