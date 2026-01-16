import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import type { Node, NodeId } from "@/domain/types"
import { useDocumentStore } from "@/stores/document.store"
import { useViewStore } from "@/stores/view.store"

interface SimpleBlockEditorProps {
  /** Root node IDs to display */
  rootIds: NodeId[]
  /** All nodes */
  nodesById: Record<NodeId, Node>
  /** Placeholder for empty state */
  placeholder?: string
}

/**
 * SimpleBlockEditor - A minimal block editor that syncs with the node graph.
 * 
 * Implements M1.5 writing behaviors:
 * - Enter creates new block below (continues type for bullets/headings)
 * - Backspace at start merges with previous
 * - Automatic block creation
 */
export function SimpleBlockEditor({
  rootIds,
  nodesById,
  placeholder = "Start writing...",
}: SimpleBlockEditorProps) {
  const { createNode, updateNodeContent, deleteNode } = useDocumentStore()
  const { view, selectNode } = useViewStore()
  const [editingNodeId, setEditingNodeId] = useState<NodeId | null>(null)

  // Global arrow key navigation when not editing
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
        const currentIndex = rootIds.indexOf(view.selectedNodeId)
        if (currentIndex < rootIds.length - 1) {
          const nextId = rootIds[currentIndex + 1]
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
        const currentIndex = rootIds.indexOf(view.selectedNodeId)
        if (currentIndex > 0) {
          const prevId = rootIds[currentIndex - 1]
          selectNode(prevId)
          // Scroll into view
          const element = document.querySelector(`[data-block-id="${prevId}"]`)
          element?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        }
        return
      }

      // Enter or any typing: Start editing the selected node
      if (view.selectedNodeId && !editingNodeId) {
        if (e.key === 'Enter' || (e.key.length === 1 && !e.metaKey && !e.ctrlKey)) {
          e.preventDefault()
          setEditingNodeId(view.selectedNodeId)
        }
      }
    }

    document.addEventListener('keydown', handleGlobalKeyDown)
    return () => document.removeEventListener('keydown', handleGlobalKeyDown)
  }, [view.selectedNodeId, editingNodeId, rootIds, selectNode])

  // Create first node if empty
  useEffect(() => {
    if (rootIds.length === 0) {
      const newId = crypto.randomUUID() as NodeId
      const now = new Date().toISOString()
      
      createNode({
        node: {
          id: newId,
          type: "block",
          content: {
            type: "text",
            value: "",
          },
          children: [],
          tags: [],
          meta: {
            createdAt: now,
            updatedAt: now,
          },
        },
      })
      setEditingNodeId(newId)
    }
  }, [rootIds.length, createNode])

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>, nodeId: NodeId) => {
    const node = nodesById[nodeId]
    if (!node) return

    const target = e.currentTarget
    const value = target.value
    const cursorPos = target.selectionStart

    // Detect markdown shortcuts at start of line
    if (e.key === " " && cursorPos > 0) {
      const beforeSpace = value.slice(0, cursorPos)
      
      // ## Header 2
      if (beforeSpace === "##") {
        e.preventDefault()
        updateNodeContent(nodeId, {
          type: "heading",
          value: "",
          metadata: { level: 2 },
        })
        return
      }
      
      // # Header 1
      if (beforeSpace === "#") {
        e.preventDefault()
        updateNodeContent(nodeId, {
          type: "heading",
          value: "",
          metadata: { level: 1 },
        })
        return
      }
      
      // ### Header 3
      if (beforeSpace === "###") {
        e.preventDefault()
        updateNodeContent(nodeId, {
          type: "heading",
          value: "",
          metadata: { level: 3 },
        })
        return
      }
      
      // - Bullet
      if (beforeSpace === "-") {
        e.preventDefault()
        updateNodeContent(nodeId, {
          type: "list",
          value: "",
        })
        return
      }
    }

    // ArrowUp: Move to previous block
    if (e.key === "ArrowUp" && cursorPos === 0) {
      e.preventDefault()
      const currentIndex = rootIds.indexOf(nodeId)
      if (currentIndex > 0) {
        const prevId = rootIds[currentIndex - 1]
        const prevTextarea = document.querySelector(
          `textarea[data-node-id="${prevId}"]`
        ) as HTMLTextAreaElement
        if (prevTextarea) {
          prevTextarea.focus()
          prevTextarea.setSelectionRange(prevTextarea.value.length, prevTextarea.value.length)
        }
      }
      return
    }

    // ArrowDown: Move to next block
    if (e.key === "ArrowDown" && cursorPos === value.length) {
      e.preventDefault()
      const currentIndex = rootIds.indexOf(nodeId)
      if (currentIndex < rootIds.length - 1) {
        const nextId = rootIds[currentIndex + 1]
        const nextTextarea = document.querySelector(
          `textarea[data-node-id="${nextId}"]`
        ) as HTMLTextAreaElement
        if (nextTextarea) {
          nextTextarea.focus()
          nextTextarea.setSelectionRange(0, 0)
        }
      }
      return
    }

    // Enter: Create new block below
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()

      // Split content at cursor
      const beforeCursor = value.slice(0, cursorPos)
      const afterCursor = value.slice(cursorPos)

      // Update current node with content before cursor
      updateNodeContent(nodeId, {
        ...node.content,
        value: beforeCursor,
      })

      // Create new node with content after cursor
      const newId = crypto.randomUUID() as NodeId
      const now = new Date().toISOString()
      
      // New blocks ALWAYS default to paragraph (M1.5 requirement)
      let newType: Node["content"]["type"] = "text"
      let newMetadata = undefined

      const newNode: Node = {
        id: newId,
        type: "block",
        content: {
          type: newType,
          value: afterCursor,
          metadata: newMetadata,
        },
        children: [],
        tags: [],
        meta: {
          createdAt: now,
          updatedAt: now,
        },
      }

      // Find index of current node in parent
      const currentIndex = rootIds.indexOf(nodeId)
      
      createNode({
        node: newNode,
        index: currentIndex + 1,
      })

      // Focus new node
      setTimeout(() => setEditingNodeId(newId), 0)
    }

    // Backspace at start: merge with previous
    if (e.key === "Backspace" && cursorPos === 0) {
      e.preventDefault()

      const currentIndex = rootIds.indexOf(nodeId)
      if (currentIndex <= 0) return

      const prevNodeId = rootIds[currentIndex - 1]
      const prevNode = nodesById[prevNodeId]
      if (!prevNode) return

      // If current is empty, delete it
      if (value.trim() === "") {
        deleteNode(nodeId)
        setEditingNodeId(prevNodeId)
        return
      }

      // Otherwise merge content
      updateNodeContent(prevNodeId, {
        ...prevNode.content,
        value: prevNode.content.value + value,
      })
      
      deleteNode(nodeId)
      setEditingNodeId(prevNodeId)
    }
  }

  const renderNode = (nodeId: NodeId) => {
    const node = nodesById[nodeId]
    if (!node) return null

    const isEditing = editingNodeId === nodeId
    const isSelected = view.selectedNodeId === nodeId

    return (
      <div
        key={nodeId}
        data-block-id={nodeId}
        className={`
          group relative px-6 py-2 cursor-text
          ${isSelected ? "bg-blue-50 border-l-2 border-blue-400" : "hover:bg-gray-50/50"}
        `}
        onClick={() => {
          selectNode(nodeId)
          setEditingNodeId(nodeId)
        }}
      >
        <NodeBlock
          node={node}
          isEditing={isEditing}
          onKeyDown={(e) => handleKeyDown(e, nodeId)}
          onChange={(value) => {
            updateNodeContent(nodeId, {
              ...node.content,
              value,
            })
          }}
        />
      </div>
    )
  }

  if (rootIds.length === 0) {
    return (
      <div className="px-6 py-4 text-gray-400 text-sm">
        {placeholder}
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      {rootIds.map(renderNode)}
    </div>
  )
}

interface NodeBlockProps {
  node: Node
  isEditing: boolean
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void
  onChange: (value: string) => void
}

function NodeBlock({ node, isEditing, onKeyDown, onChange }: NodeBlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      // Move cursor to end
      const len = textareaRef.current.value.length
      textareaRef.current.setSelectionRange(len, len)
    }
  }, [isEditing])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [node.content.value])

  const getStyles = () => {
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

  if (!isEditing) {
    return (
      <div className={`${getStyles()} cursor-text min-h-[1.5rem]`}>
        {node.content.value || <span className="text-gray-400 italic">Empty block</span>}
      </div>
    )
  }

  return (
    <textarea
      ref={textareaRef}
      data-node-id={node.id}
      value={node.content.value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onFocus={(e) => {
        // Ensure the node is selected when focused
        const nodeId = e.currentTarget.getAttribute('data-node-id') as NodeId
        if (nodeId) {
          const { selectNode } = useViewStore.getState()
          selectNode(nodeId)
        }
      }}
      className={`
        ${getStyles()}
        w-full resize-none border-none outline-none bg-transparent
        focus:ring-0 text-gray-900 placeholder-gray-400
      `}
      rows={1}
      placeholder="Type something..."
    />
  )
}
