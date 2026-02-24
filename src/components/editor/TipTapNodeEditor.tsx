import { useEffect, useRef } from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
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
import { nodesToTipTapJSON, tiptapJSONToNodes } from "@/lib/tiptap-sync"
import { TipTapBlockMenu } from "@/components/chat/TipTapBlockMenu"
import type { Node, NodeId } from "@/domain/types"

interface TipTapNodeEditorProps {
  /** All nodes by ID */
  nodesById: Record<NodeId, Node>
  /** Root-level node IDs to display */
  rootIds: NodeId[]
  /** Placeholder text for empty editor */
  placeholder?: string
  /** Read-only mode (Phase 1: read-only, Phase 2: editable) */
  editable?: boolean
  /** Callback when editor content changes (Phase 2) */
  onUpdate?: (nodes: Node[], rootIds: NodeId[]) => void
  /** Callback when editor is ready (Phase 4: for lifting) */
  onEditorReady?: (editor: Editor) => void
}

/**
 * TipTap-based Node Editor
 * 
 * Phase 1: Read-only rendering
 * - Displays nodes from store in TipTap
 * - Custom extensions with nodeId attributes
 * - No editing yet (coming in Phase 2)
 * 
 * Phase 2: Bidirectional sync
 * - Enable editing
 * - Sync changes back to store (debounced)
 * - Handle create/update/delete operations
 */
export function TipTapNodeEditor({
  nodesById,
  rootIds,
  placeholder = "Start writing...",
  editable = false,
  onUpdate,
  onEditorReady,
}: TipTapNodeEditorProps) {
  // Track if we're syncing from store to prevent loops
  const isSyncingFromStore = useRef(false)
  // Track when we last synced TO store to prevent immediate sync back
  const lastSyncToStoreTime = useRef(0)
  // Debounce timer for sync
  const syncTimerRef = useRef<number | null>(null)
  
  // Convert our nodes to TipTap JSON
  const tiptapJSON = nodesToTipTapJSON(nodesById, rootIds)
  
  console.log("TipTapNodeEditor render:", {
    nodeCount: rootIds.length,
    rootIds,
    editable,
    tiptapJSON,
  })

  const editor = useEditor({
    extensions: [
      // Core extensions
      Document,
      Text,
      
      // Custom block extensions with nodeId support
      NodeParagraph,
      NodeHeading.configure({ levels: [1, 2, 3] }),
      NodeBulletList,
      NodeListItem,
      
      // Standard extensions from StarterKit (selective)
      StarterKit.configure({
        // Disable defaults that we're replacing with custom versions
        document: false, // Using custom Document
        paragraph: false, // Using NodeParagraph
        heading: false, // Using NodeHeading
        bulletList: false, // Using NodeBulletList
        listItem: false, // Using NodeListItem
        
        // Keep these standard extensions (use empty object to enable with defaults)
        bold: {},
        italic: {},
        code: {},
        strike: {},
        hardBreak: {},
        horizontalRule: {},
        blockquote: {},
        codeBlock: {},
      }),
      
      // Placeholder
      Placeholder.configure({
        placeholder,
        showOnlyWhenEditable: true,
      }),
    ],
    
    content: tiptapJSON,
    editable,
    
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none px-6 py-4 min-h-full",
      },
    },
    
    onUpdate: ({ editor }) => {
      // Don't sync back if this update came from store
      if (isSyncingFromStore.current) {
        return
      }

      // Clear existing timer
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current)
      }

      // Debounce sync to avoid re-renders while typing
      syncTimerRef.current = setTimeout(() => {
        if (onUpdate) {
          const json = editor.getJSON()
          const { nodes, rootIds: newRootIds } = tiptapJSONToNodes(json)
          
          console.log("TipTap update (debounced):", {
            json,
            convertedNodes: nodes,
            convertedRootIds: newRootIds,
          })
          
          // Mark that we just synced TO store
          lastSyncToStoreTime.current = Date.now()
          
          onUpdate(nodes, newRootIds)
        }
      }, 800) // 800ms debounce to package up consecutive edits
    },
  })

  // Update editor content when nodes change (keeping editor in sync with store)
  useEffect(() => {
    if (!editor) return
    if (isSyncingFromStore.current) return // Skip if already syncing
    
    // Skip sync if we just synced TO store (within last 1500ms)
    // This prevents feedback loops when Enter creates new blocks
    const timeSinceLastSync = Date.now() - lastSyncToStoreTime.current
    if (timeSinceLastSync < 1500) {
      console.log("Skipping store→editor sync (just synced to store)")
      return
    }
    
    const newJSON = nodesToTipTapJSON(nodesById, rootIds)
    const currentJSON = editor.getJSON()
    
    // Only update if content actually changed (avoid infinite loops)
    if (JSON.stringify(newJSON) !== JSON.stringify(currentJSON)) {
      console.log("Store→Editor sync: Content changed, updating editor")
      isSyncingFromStore.current = true
      
      // Save cursor position
      const { from, to } = editor.state.selection
      
      editor.commands.setContent(newJSON, { emitUpdate: false })
      
      // Try to restore cursor position (may not be exact if structure changed)
      try {
        editor.commands.setTextSelection({ from, to })
      } catch {
        // Selection restoration failed, that's ok
      }
      
      isSyncingFromStore.current = false
    }
  }, [editor, nodesById, rootIds])

  // Update editor editability when prop changes
  useEffect(() => {
    if (!editor) return
    editor.setEditable(editable)
  }, [editor, editable])

  // Notify parent when editor is ready (Phase 4: for lifting)
  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor)
    }
  }, [editor, onEditorReady])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current)
      }
    }
  }, [])

  if (!editor) {
    return (
      <div className="px-6 py-4 text-gray-400 text-sm">
        Loading editor...
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      <EditorContent editor={editor} />
      <TipTapBlockMenu editor={editor} />
      
      {/* Phase indicator */}
      <div className="fixed bottom-20 right-4 text-xs text-gray-400 bg-white/90 px-3 py-2 rounded shadow-sm border border-gray-200">
        <div className="font-semibold text-blue-600">
          TipTap Phase 2-4 ✅
        </div>
        <div>{editable ? "Editing enabled" : "Read-only rendering"}</div>
        <div className="text-[10px] mt-1">
          {rootIds.length} blocks displayed
        </div>
      </div>
    </div>
  )
}
