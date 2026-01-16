import type { SpecBlockId, ExplorationDocument } from "@/domain/types"
import { useSpecStore } from "@/stores/spec.store"
import { useDocumentStore } from "@/stores/document.store"
import { cn } from "@/lib/utils"
import { Edit, ExternalLink, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"

interface SpecBlockRendererProps {
  blockId: SpecBlockId
  exploration: ExplorationDocument
}

export function SpecBlockRenderer({
  blockId,
  exploration,
}: SpecBlockRendererProps) {
  const block = useSpecStore((s) => s.spec.blocksById[blockId])
  const updateNodeContent = useDocumentStore((s) => s.updateNodeContent)
  const removeBlock = useSpecStore((s) => s.removeBlock)

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  if (!block) return null

  // Heading block
  if (block.kind === "heading") {
    const HeadingTag = `h${block.level || 2}` as keyof JSX.IntrinsicElements
    return (
      <div className="my-4">
        <HeadingTag
          className={cn(
            "font-semibold",
            block.level === 1 && "text-3xl",
            block.level === 2 && "text-2xl",
            block.level === 3 && "text-xl"
          )}
        >
          {block.title}
        </HeadingTag>
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

    const handleStartEdit = (e: React.MouseEvent) => {
      e.stopPropagation()
      setEditValue(sourceNode.content.value)
      setIsEditing(true)
    }

    const handleSave = () => {
      if (editValue !== sourceNode.content.value) {
        updateNodeContent(sourceNode.id, {
          ...sourceNode.content,
          value: editValue,
        })
      }
      setIsEditing(false)
    }

    const handleBlur = (e: React.FocusEvent) => {
      // Only save if we're not clicking within the same component
      const relatedTarget = e.relatedTarget as HTMLElement
      if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
        handleSave()
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditValue(sourceNode.content.value)
        setIsEditing(false)
      }
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        handleSave()
      }
    }

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation()
      removeBlock(blockId)
    }

    return (
      <div className="group relative rounded-md border border-border bg-card p-4">
        {/* Provenance indicator */}
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            <span>
              Referenced from Exploration • {sourceNode.id.slice(0, 8)}...
            </span>
          </div>
          {!isEditing && (
            <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleStartEdit}
                title="Edit source"
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={handleDelete}
                title="Remove from Spec"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Content (editable inline) */}
        {isEditing ? (
          <div>
            <textarea
              ref={textareaRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="w-full resize-none rounded-md border border-input bg-background p-2 text-sm outline-none focus:ring-1 focus:ring-ring"
              rows={Math.max(3, editValue.split("\n").length)}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Editing source node. Changes appear in Exploration too. (Cmd+Enter
              to save, Esc to cancel)
            </p>
          </div>
        ) : (
          <div className="text-sm">
            {sourceNode.content.value || (
              <span className="text-muted-foreground">Empty node</span>
            )}
          </div>
        )}

        {/* Render children if any */}
        {block.children.length > 0 && (
          <div className="mt-4 space-y-2">
            {block.children.map((childBlockId) => (
              <SpecBlockRenderer
                key={childBlockId}
                blockId={childBlockId}
                exploration={exploration}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return null
}
