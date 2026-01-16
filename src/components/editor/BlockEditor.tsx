// @ts-nocheck
/**
 * UNUSED: This is a Tiptap-based editor kept for reference.
 * The app uses SimpleBlockEditor.tsx instead (textarea-based blocks).
 */
import { useEditor, EditorContent, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import Heading from "@tiptap/extension-heading"
import BulletList from "@tiptap/extension-bullet-list"
import ListItem from "@tiptap/extension-list-item"
import { useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from "react"
import type { Node, NodeId, NodeContent } from "@/domain/types"
import { useDocumentStore } from "@/stores/document.store"

interface BlockEditorProps {
  /** Document type */
  documentType: "exploration" | "spec"
  /** Placeholder text */
  placeholder?: string
}

export interface BlockEditorHandle {
  focus: () => void
  blur: () => void
  getEditor: () => Editor | null
}

/**
 * BlockEditor provides a Tiptap-based continuous writing surface.
 * 
 * Key behaviors:
 * - Enter creates new block below (continues block type for lists/headings)
 * - Backspace at start merges with previous
 * - Paste creates multiple blocks
 * - Block-aware undo/redo
 * 
 * This editor syncs bidirectionally with the document store.
 */
export const BlockEditor = forwardRef<BlockEditorHandle, BlockEditorProps>(
  ({ documentType, placeholder = "Start writing..." }, ref) => {
    const { exploration, updateNodeContent, createNode } = useDocumentStore()
    const syncingRef = useRef(false)

    // Convert nodes to Tiptap JSON format
    const nodesToJSON = useCallback(
      (ids: NodeId[]): any => {
        const content: any[] = []

        for (const nodeId of ids) {
          const node = nodesById[nodeId]
          if (!node) continue

          const blockContent = nodeToTiptapNode(node, nodesById)
          if (blockContent) {
            content.push(blockContent)
          }

          // Recursively add children
          if (node.children.length > 0) {
            content.push(...nodesToJSON(node.children).content)
          }
        }

        return {
          type: "doc",
          content,
        }
      },
      [nodesById]
    )

    // Convert a single node to Tiptap format
    const nodeToTiptapNode = (node: Node, nodesMap: Record<NodeId, Node>): any => {
      const text = node.content.value

      switch (node.content.type) {
        case "heading":
          return {
            type: "heading",
            attrs: { level: node.content.metadata?.level || 1 },
            content: text ? [{ type: "text", text }] : [],
          }
        case "list":
          return {
            type: "bulletList",
            content: [
              {
                type: "listItem",
                content: [
                  {
                    type: "paragraph",
                    content: text ? [{ type: "text", text }] : [],
                  },
                ],
              },
            ],
          }
        case "code":
          return {
            type: "codeBlock",
            content: text ? [{ type: "text", text }] : [],
          }
        case "text":
        default:
          return {
            type: "paragraph",
            content: text ? [{ type: "text", text }] : [],
          }
      }
    }

    // Convert Tiptap JSON back to nodes and update store
    const syncEditorToStore = useCallback(
      (editor: Editor) => {
        const json = editor.getJSON()
        // TODO: Implement full bidirectional sync
        // For M1.5, we'll handle this through manual update hooks
        onUpdate?.()
      },
      [onUpdate]
    )

    const editor = useEditor({
      extensions: [
        StarterKit.configure({
          // Disable default heading levels, we'll configure manually
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Placeholder.configure({
          placeholder,
        }),
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
      ],
      content: nodesToJSON(rootIds),
      editorProps: {
        attributes: {
          class: "prose prose-sm max-w-none focus:outline-none px-6 py-4",
        },
      },
      onUpdate: ({ editor }) => {
        syncEditorToStore(editor)
      },
    })

    // Expose editor methods via ref
    useImperativeHandle(ref, () => ({
      focus: () => editor?.commands.focus(),
      blur: () => editor?.commands.blur(),
      getEditor: () => editor,
    }))

    // Update editor when nodes change externally
    useEffect(() => {
      if (editor && !editor.isFocused) {
        const newContent = nodesToJSON(rootIds)
        editor.commands.setContent(newContent, false)
      }
    }, [editor, rootIds, nodesById, nodesToJSON])

    return (
      <div className="h-full overflow-auto">
        <EditorContent editor={editor} />
      </div>
    )
  }
)

BlockEditor.displayName = "BlockEditor"
