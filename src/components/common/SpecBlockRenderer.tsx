import type { SpecBlockId, ExplorationDocument, Node, NodeId } from "@/domain/types"
import { useSpecStore } from "@/stores/spec.store"
import { useDocumentStore } from "@/stores/document.store"
import { useNavigationStore } from "@/stores/navigation.store"
import { useViewStore } from "@/stores/view.store"
import { cn } from "@/lib/utils"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCallback, useMemo } from "react"
import { resolveSemanticScope } from "@/lib/semantic-lift"
import { TipTapTransclusionEditor } from "@/components/editor/TipTapTransclusionEditor"
import { useToastStore } from "@/components/ui/toast"

interface SpecBlockRendererProps {
  blockId: SpecBlockId
  exploration: ExplorationDocument
}

export function SpecBlockRenderer({
  blockId,
  exploration,
}: SpecBlockRendererProps) {
  const block = useSpecStore((s) => s.spec.blocksById[blockId])
  const { removeBlock } = useSpecStore()
  const { goDown } = useNavigationStore()
  const { selectNode } = useViewStore()
  const { addToast } = useToastStore()

  // Get nodes to render for this transclusion
  const { nodesById, rootIds } = useMemo(() => {
    if (!block || block.kind !== "transclusion" || !block.sourceNodeId) {
      return { nodesById: {}, rootIds: [] }
    }

    const scope = block.includeSubtree
      ? resolveSemanticScope(block.sourceNodeId, exploration.nodesById, exploration.rootIds)
      : { includedNodeIds: [block.sourceNodeId] }

    const nodesById: Record<NodeId, Node> = {}
    const rootIds: NodeId[] = []

    scope.includedNodeIds.forEach(id => {
      const node = exploration.nodesById[id]
      if (node) {
        nodesById[id] = node
        rootIds.push(id)
      }
    })

    return { nodesById, rootIds }
  }, [block, exploration.nodesById, exploration.rootIds])

  // Handle jump to source
  const handleJumpToSource = useCallback(() => {
    if (!block || block.kind !== "transclusion" || !block.sourceNodeId) {
      console.warn("[Jump to source] No source node available")
      return
    }
    
    // Navigate to Exploration view
    goDown()
    
    // Select the source node
    selectNode(block.sourceNodeId)
    
    // Scroll to source node
    setTimeout(() => {
      const element = document.querySelector(`[data-node-id="${block.sourceNodeId}"]`)
      if (element) {
        element.scrollIntoView({ block: "center", behavior: "smooth" })
      }
    }, 100)

    addToast("Jumped to source in Exploration", "info", 2000)
  }, [block, goDown, selectNode, addToast])

  if (!block) return null

  // Heading block
  if (block.kind === "heading") {
    return (
      <div className="my-4">
        <div
          className={cn(
            "font-semibold text-gray-900",
            block.level === 1 && "text-3xl",
            block.level === 2 && "text-2xl",
            block.level === 3 && "text-xl"
          )}
        >
          {block.title}
        </div>
      </div>
    )
  }

  // Transclusion block
  if (block.kind === "transclusion" && block.sourceNodeId) {
    const sourceNode = exploration.nodesById[block.sourceNodeId]


    if (!sourceNode) {
      return (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Source node not found: {block.sourceNodeId}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This node may have been deleted from Exploration.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => removeBlock(blockId)}
          >
            Remove from Spec
          </Button>
        </div>
      )
    }

    return (
      <div className="group relative mb-8 border-l-4 border-blue-200 rounded-r-lg overflow-hidden bg-blue-50/20">
        {/* Delete button (visible on hover) */}
        <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 bg-white/90 hover:bg-white shadow-sm"
            onClick={() => removeBlock(blockId)}
            title="Remove transclusion from Spec"
          >
            <Trash2 className="h-4 w-4 text-gray-600" />
          </Button>
        </div>

        {/* Transcluded content (read-only with TipTap) */}
        <TipTapTransclusionEditor
          nodesById={nodesById}
          rootIds={rootIds}
          onJumpToSource={handleJumpToSource}
          showProvenance={true}
        />
      </div>
    )
  }

  return null
}
