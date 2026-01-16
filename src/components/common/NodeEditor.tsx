import { useDocumentStore } from "@/stores/document.store"
import { useViewStore } from "@/stores/view.store"
import { useSpecStore } from "@/stores/spec.store"
import type { NodeId } from "@/domain/types"
import { Button } from "@/components/ui/button"
import { ArrowUp, Copy, Trash2, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useRef, useEffect } from "react"

interface NodeEditorProps {
  nodeId: NodeId
  isSelected: boolean
  depth?: number
}

export function NodeEditor({ nodeId, isSelected, depth = 0 }: NodeEditorProps) {
  const node = useDocumentStore((s) => s.exploration.nodesById[nodeId])
  const updateNodeContent = useDocumentStore((s) => s.updateNodeContent)
  const deleteNode = useDocumentStore((s) => s.deleteNode)
  const duplicateNode = useDocumentStore((s) => s.duplicateNode)
  const createNode = useDocumentStore((s) => s.createNode)
  const selectNode = useViewStore((s) => s.selectNode)
  const liftToSpec = useSpecStore((s) => s.liftToSpec)

  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(node.content.value)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const hasChildren = node.children.length > 0

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(editValue.length, editValue.length)
    }
  }, [isEditing, editValue.length])

  useEffect(() => {
    setEditValue(node.content.value)
  }, [node.content.value])

  // Auto-edit empty nodes when they become selected
  useEffect(() => {
    if (isSelected && !isEditing && node.content.value === "") {
      setIsEditing(true)
    }
  }, [isSelected, isEditing, node.content.value])

  if (!node) return null

  const handleClick = () => {
    selectNode(nodeId)
  }

  const handleDoubleClick = () => {
    if (!isEditing) {
      setIsEditing(true)
    }
  }

  const handleBlur = () => {
    if (editValue !== node.content.value) {
      updateNodeContent(nodeId, {
        ...node.content,
        value: editValue,
      })
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditValue(node.content.value)
      setIsEditing(false)
      textareaRef.current?.blur()
    }
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      // If editing, save
      handleBlur()
    }
    // Cmd/Ctrl + Delete/Backspace: delete entire node
    if ((e.key === "Delete" || e.key === "Backspace") && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      deleteNode(nodeId)
    }
  }

  const handleAddNewNode = () => {
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
    
    // Focus the new node - it will auto-edit because it's empty
    selectNode(id)
  }

  // Keyboard shortcuts when selected but not editing
  useEffect(() => {
    if (isSelected && !isEditing) {
      const handleKeyPress = (e: KeyboardEvent) => {
        // Enter: start editing current node
        if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
          setIsEditing(true)
        }
        // Cmd/Ctrl + Enter: create new node
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          handleAddNewNode()
        }
        // Cmd/Ctrl + Delete/Backspace: delete node
        if ((e.key === "Delete" || e.key === "Backspace") && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          deleteNode(nodeId)
        }
      }
      document.addEventListener("keydown", handleKeyPress)
      return () => document.removeEventListener("keydown", handleKeyPress)
    }
  }, [isSelected, isEditing])

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteNode(nodeId)
  }

  const handleDuplicate = async (e: React.MouseEvent) => {
    e.stopPropagation()
    
    // Copy node ID to clipboard for paste functionality
    try {
      await navigator.clipboard.writeText(JSON.stringify({ nodeId, action: 'copy' }))
    } catch (err) {
      console.warn('Failed to copy to clipboard', err)
    }
    
    // Also create immediate duplicate
    duplicateNode({
      sourceNodeId: nodeId,
      mode: "shallow",
      includeSubtree: false,
    })
  }

  const handleLift = (e: React.MouseEvent) => {
    e.stopPropagation()
    liftToSpec({ sourceNodeId: nodeId, includeSubtree: false })
  }

  const provenance = node.meta.provenance
  const isDerived = provenance?.kind === "derived"

  // Content is visible when selected or editing
  const showContent = isSelected || isEditing

  return (
    <div className="group" style={{ marginLeft: `${depth * 24}px` }} data-node-id={nodeId}>
      <div
        className={cn(
          "rounded-md border border-transparent px-4 py-3 transition-colors cursor-pointer",
          isSelected && "border-border bg-accent",
          !isSelected && "hover:bg-accent/50"
        )}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
      >
        {/* Node header */}
        <div className="mb-2 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {node.type}
              {isDerived && " • derived"}
              {hasChildren && ` • ${node.children.length} child${node.children.length !== 1 ? 'ren' : ''}`}
            </span>
          </div>

          {/* Actions */}
          <div
            className={cn(
              "flex gap-1 opacity-0 transition-opacity group-hover:opacity-100",
              isSelected && "opacity-100"
            )}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleLift}
              title="Lift to Spec"
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleDuplicate}
              title="Duplicate"
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full resize-none border-none bg-transparent p-0 text-sm outline-none"
            rows={Math.max(2, editValue.split("\n").length)}
            placeholder="Enter content..."
          />
        ) : (
          <div className={cn(
            "text-sm",
            !showContent && "overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground"
          )}>
            {node.content.value || (
              <span className="text-muted-foreground">Empty node</span>
            )}
          </div>
        )}

        {/* Provenance hint - only show when expanded */}
        {showContent && isDerived && provenance.sourceNodeId && (
          <div className="mt-2 text-xs text-muted-foreground">
            Derived from {provenance.sourceNodeId.slice(0, 8)}...
          </div>
        )}

        {/* Tags - only show when expanded */}
        {showContent && node.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {node.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Render children */}
      {hasChildren && showContent && (
        <div className="mt-1">
          {node.children.map((childId) => (
            <NodeEditor
              key={childId}
              nodeId={childId}
              isSelected={false}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
