import { useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Document from "@tiptap/extension-document"
import Text from "@tiptap/extension-text"
import {
  NodeParagraph,
  NodeHeading,
  NodeBulletList,
  NodeListItem,
} from "./extensions/NodeBlockExtension"
import { nodesToTipTapJSON } from "@/lib/tiptap-sync"
import type { Node, NodeId } from "@/domain/types"

interface TipTapTransclusionEditorProps {
  /** Nodes to display (from semantic scope) */
  nodesById: Record<NodeId, Node>
  rootIds: NodeId[]
  /** Callback when ⌘+Enter is pressed (jump to source) */
  onJumpToSource?: () => void
  /** Show provenance indicator */
  showProvenance?: boolean
}

/**
 * TipTap editor for rendering transcluded content in Spec view.
 * 
 * Read-only view of lifted content from Exploration.
 * Press ⌘+Enter to jump to source for editing.
 */
export function TipTapTransclusionEditor({
  nodesById,
  rootIds,
  onJumpToSource,
  showProvenance = true,
}: TipTapTransclusionEditorProps) {
  const tiptapJSON = nodesToTipTapJSON(nodesById, rootIds)

  const editor = useEditor({
    extensions: [
      Document,
      Text,
      NodeParagraph,
      NodeHeading.configure({ levels: [1, 2, 3] }),
      NodeBulletList,
      NodeListItem,
      StarterKit.configure({
        document: false,
        paragraph: false,
        heading: false,
        bulletList: false,
        listItem: false,
        bold: {},
        italic: {},
        code: {},
        strike: {},
        hardBreak: {},
        horizontalRule: {},
        blockquote: {},
        codeBlock: {},
      }),
      Placeholder.configure({
        placeholder: "Transcluded content from Exploration...",
        showOnlyWhenEditable: true,
      }),
    ],

    content: tiptapJSON,
    editable: false, // Read-only: Use ⌘+Enter to jump to source for editing

    editorProps: {
      attributes: {
        // Lighter background to indicate read-only transclusion
        class: "prose max-w-none focus:outline-none px-6 py-4 min-h-full bg-blue-50/30 cursor-default",
      },

      handleKeyDown: (_view, event) => {
        // ⌘+Enter: Jump to source
        if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
          event.preventDefault()
          event.stopPropagation()
          
          if (onJumpToSource) {
            onJumpToSource()
          }
          
          return true
        }

        return false
      },
    },
    
    // No onUpdate - read-only transclusion
  })

  // Update content when source nodes change (read-only sync)
  useEffect(() => {
    if (!editor) return

    const newJSON = nodesToTipTapJSON(nodesById, rootIds)
    const currentJSON = editor.getJSON()

    if (JSON.stringify(newJSON) !== JSON.stringify(currentJSON)) {
      editor.commands.setContent(newJSON, { emitUpdate: false })
    }
  }, [editor, nodesById, rootIds])

  if (!editor) {
    return (
      <div className="px-6 py-4 text-gray-400 text-sm">
        Loading transcluded content...
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Provenance indicator */}
      {showProvenance && (
        <div className="absolute top-2 right-2 z-10">
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 border border-blue-300 rounded text-xs text-blue-700">
            <span>📎 Transcluded (read-only)</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-blue-300 rounded text-[10px]">
              ⌘↩ Edit at source
            </kbd>
          </div>
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
