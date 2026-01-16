import type { SpecBlockId, ExplorationDocument, Node } from "@/domain/types"
import { useSpecStore } from "@/stores/spec.store"
import { useDocumentStore } from "@/stores/document.store"
import { useViewStore } from "@/stores/view.store"
import { cn } from "@/lib/utils"
import { Edit, ExternalLink, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import { resolveSemanticScope } from "@/lib/semantic-lift"

interface SpecBlockRendererProps {
  blockId: SpecBlockId
  exploration: ExplorationDocument
}

export function SpecBlockRenderer({
  blockId,
  exploration,
}: SpecBlockRendererProps) {
  const block = useSpecStore((s) => s.spec.blocksById[blockId])

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
        </div>
      )
    }

    // If includeSubtree is true, get all nodes in the semantic scope
    const nodesToRender = block.includeSubtree
      ? resolveSemanticScope(
          block.sourceNodeId,
          exploration.nodesById,
          exploration.rootIds
        ).includedNodeIds.map(id => exploration.nodesById[id]).filter(Boolean)
      : [sourceNode]

    return (
      <div className="mb-8 border-l-2 border-gray-200">
        {nodesToRender.map((node, index) => (
          <TranscludedNodeRenderer
            key={node.id}
            node={node}
            blockId={blockId}
            isRoot={index === 0}
            exploration={exploration}
          />
        ))}
      </div>
    )
  }

  return null
}

/**
 * Renders a single transcluded node from Exploration.
 * Each node is individually editable and updates the source.
 */
interface TranscludedNodeRendererProps {
  node: Node
  blockId: SpecBlockId
  isRoot: boolean
  exploration: ExplorationDocument
}

function TranscludedNodeRenderer({ 
  node, 
  blockId, 
  isRoot, 
  exploration 
}: TranscludedNodeRendererProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isMouseDownRef = useRef(false)
  
  const { updateNodeContent } = useDocumentStore()
  const { removeBlock } = useSpecStore()
  const { view, selectNode } = useViewStore()
  
  const isSelected = view.selectedNodeId === node.id

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isEditing])

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    setEditValue(node.content.value)
    setIsEditing(true)
  }

  const handleSave = () => {
    if (editValue !== node.content.value) {
      updateNodeContent(node.id, {
        ...node.content,
        value: editValue,
      })
    }
    setIsEditing(false)
  }

  const handleBlur = () => {
    if (isMouseDownRef.current) {
      return
    }
    handleSave()
  }

  const handleMouseDown = () => {
    isMouseDownRef.current = true
  }

  const handleMouseUp = () => {
    isMouseDownRef.current = false
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditValue(node.content.value)
      setIsEditing(false)
    }
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave()
    }

    // Arrow navigation between nodes
    const textarea = e.currentTarget as HTMLTextAreaElement
    const cursorPos = textarea.selectionStart

    // ArrowUp: Move to previous node when at start
    if (e.key === "ArrowUp" && cursorPos === 0) {
      e.preventDefault()
      const allTextareas = Array.from(
        document.querySelectorAll('textarea[data-node-id]')
      ) as HTMLTextAreaElement[]
      const currentIndex = allTextareas.findIndex(t => t === textarea)
      if (currentIndex > 0) {
        const prevTextarea = allTextareas[currentIndex - 1]
        prevTextarea.focus()
        prevTextarea.setSelectionRange(prevTextarea.value.length, prevTextarea.value.length)
      }
      return
    }

    // ArrowDown: Move to next node when at end
    if (e.key === "ArrowDown" && cursorPos === textarea.value.length) {
      e.preventDefault()
      const allTextareas = Array.from(
        document.querySelectorAll('textarea[data-node-id]')
      ) as HTMLTextAreaElement[]
      const currentIndex = allTextareas.findIndex(t => t === textarea)
      if (currentIndex < allTextareas.length - 1) {
        const nextTextarea = allTextareas[currentIndex + 1]
        nextTextarea.focus()
        nextTextarea.setSelectionRange(0, 0)
      }
      return
    }
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeBlock(blockId)
  }

  // Style based on node type
  const getTextStyle = () => {
    switch (node.content.type) {
      case "heading":
        const level = (node.content.metadata?.level as number) || 1
        if (level === 1) return "text-2xl font-bold text-gray-900"
        if (level === 2) return "text-xl font-semibold text-gray-900"
        if (level === 3) return "text-lg font-medium text-gray-900"
        return "text-gray-900"
      case "list":
        return "pl-4 before:content-['•'] before:mr-2 before:text-gray-400 text-gray-900"
      case "code":
        return "font-mono text-sm bg-gray-100 px-2 py-1 rounded text-gray-900"
      default:
        return "text-gray-900"
    }
  }

  return (
    <div 
      data-block-id={node.id}
      className={cn(
        "group relative px-6 py-2 hover:bg-gray-50 transition-colors cursor-pointer",
        node.content.type === "heading" && "mt-4 first:mt-0",
        isSelected && "bg-blue-50 border-l-2 border-blue-400"
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onClick={(e) => {
        selectNode(node.id)
        if (!isEditing && e.target === e.currentTarget) {
          handleStartEdit(e as any)
        }
      }}
    >
      {/* Provenance indicator - visible on hover for ALL nodes */}
      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleStartEdit}
          title="Edit source (updates Exploration)"
        >
          <Edit className="h-3 w-3" />
        </Button>
        {isRoot && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleDelete}
            title="Remove entire transclusion"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Content (editable inline) */}
      {isEditing ? (
        <div onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
          <textarea
            ref={textareaRef}
            data-node-id={node.id}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full resize-none rounded-md border border-gray-300 bg-white p-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              getTextStyle()
            )}
            rows={Math.max(2, editValue.split("\n").length)}
          />
          <p className="mt-1 text-xs text-gray-500">
            Editing source. Changes appear in Exploration. (⌘↩ save, Esc cancel)
          </p>
        </div>
      ) : (
        <div 
          className={cn("cursor-text min-h-[1.5rem]", getTextStyle())} 
          onClick={handleStartEdit}
        >
          {node.content.value || (
            <span className="text-gray-400 italic">Empty - click to edit</span>
          )}
        </div>
      )}
    </div>
  )
}
