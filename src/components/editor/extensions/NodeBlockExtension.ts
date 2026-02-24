/**
 * Custom TipTap extensions for our node-based blocks
 * 
 * Adds `nodeId` attribute to all block types to maintain stable references
 * for lifting and transclusion.
 * 
 * Phase 6 fix: Auto-generate nodeIds when blocks are created via markdown shortcuts
 */

import Paragraph from "@tiptap/extension-paragraph"
import Heading from "@tiptap/extension-heading"
import BulletList from "@tiptap/extension-bullet-list"
import ListItem from "@tiptap/extension-list-item"
import { Plugin, PluginKey } from "@tiptap/pm/state"

/**
 * Generate a unique node ID
 */
function generateNodeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `node_${Math.random().toString(36).slice(2)}_${Date.now()}`
}

/**
 * Plugin that auto-generates nodeIds for blocks without them
 */
const autoNodeIdKey = new PluginKey("autoNodeId")

const autoNodeIdPlugin = new Plugin({
  key: autoNodeIdKey,
  appendTransaction: (transactions, _oldState, newState) => {
    // Only process user edits, not programmatic changes
    if (!transactions.some(tr => tr.docChanged)) {
      return null
    }

    const tr = newState.tr
    let modified = false

    newState.doc.descendants((node, pos) => {
      // Auto-assign nodeIds to paragraphs and headings without them
      if ((node.type.name === "paragraph" || node.type.name === "heading") && !node.attrs.nodeId) {
        const nodeId = generateNodeId()
        tr.setNodeMarkup(pos, undefined, { ...node.attrs, nodeId })
        modified = true
      }
    })

    return modified ? tr : null
  },
})

/**
 * Custom Paragraph with nodeId attribute
 */
export const NodeParagraph = Paragraph.extend({
  name: "paragraph",
  
  addAttributes() {
    return {
      ...this.parent?.(),
      nodeId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-node-id"),
        renderHTML: (attributes) => {
          if (!attributes.nodeId) return {}
          return {
            "data-node-id": attributes.nodeId,
          }
        },
      },
    }
  },

  addProseMirrorPlugins() {
    return [autoNodeIdPlugin]
  },
})

/**
 * Custom Heading with nodeId attribute
 */
export const NodeHeading = Heading.extend({
  name: "heading",
  
  addAttributes() {
    return {
      ...this.parent?.(),
      nodeId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-node-id"),
        renderHTML: (attributes) => {
          if (!attributes.nodeId) return {}
          return {
            "data-node-id": attributes.nodeId,
          }
        },
      },
    }
  },
})

/**
 * Custom BulletList with nodeIds attribute
 * 
 * nodeIds (array): List of node IDs for grouped list items
 */
export const NodeBulletList = BulletList.extend({
  name: "bulletList",
  
  addAttributes() {
    return {
      ...this.parent?.(),
      nodeIds: {
        default: [],
        parseHTML: (element) => {
          const attr = element.getAttribute("data-node-ids")
          if (!attr) return []
          try {
            return JSON.parse(attr)
          } catch {
            return []
          }
        },
        renderHTML: (attributes) => {
          if (!attributes.nodeIds || attributes.nodeIds.length === 0) return {}
          return {
            "data-node-ids": JSON.stringify(attributes.nodeIds),
          }
        },
      },
    }
  },
})

/**
 * Custom ListItem (no nodeId needed, parent bulletList has it)
 */
export const NodeListItem = ListItem.extend({
  name: "listItem",
})
