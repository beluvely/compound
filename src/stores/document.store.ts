import { create } from "zustand"
import type {
  ExplorationDocument,
  Node,
  NodeContent,
  NodeId,
  Tag,
  IsoDateString,
  NodeProvenance,
  DuplicateMode,
} from "../domain/types"

type DocumentActions = {
  init: (doc: ExplorationDocument) => void

  getNode: (id: NodeId) => Node | undefined

  createNode: (input: { node: Node; parentId?: NodeId; index?: number }) => void

  /**
   * Intentional duplication with provenance.
   * This creates a NEW node (new ID) whose meta.provenance points to the source node.
   * This does NOT create a live link; use Spec transclusion for live references.
   */
  duplicateNode: (input: {
    sourceNodeId: NodeId
    mode?: DuplicateMode // default: "duplicate"
    includeSubtree?: boolean // default: false
    parentId?: NodeId
    index?: number
  }) => { newRootId: NodeId; newIds: NodeId[] }

  updateNodeContent: (nodeId: NodeId, content: NodeContent) => void
  updateNodeTags: (nodeId: NodeId, tags: Tag[]) => void

  /** Move node within the outline tree. Must preserve node identity. */
  moveNode: (input: {
    nodeId: NodeId
    fromParentId?: NodeId // undefined means root
    toParentId?: NodeId // undefined means root
    toIndex: number
  }) => void

  /** Remove node from parent/root ordering. Does not necessarily delete node record (safe default). */
  detachNode: (input: { nodeId: NodeId; parentId?: NodeId }) => void

  /** Delete node and all its children */
  deleteNode: (nodeId: NodeId) => void

  /** Hard delete (optional). Prefer detach + GC later. */
  deleteNodeHard?: (nodeId: NodeId) => void
}

export type DocumentStore = {
  exploration: ExplorationDocument
} & DocumentActions

const nowIso = (): IsoDateString => new Date().toISOString()

const genId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id_${Math.random().toString(16).slice(2)}_${Date.now()}`

const createEmptyExploration = (): ExplorationDocument => ({
  id: "exploration:local",
  rootIds: [],
  nodesById: {},
  meta: {
    createdAt: nowIso(),
    updatedAt: nowIso(),
    title: "Exploration",
  },
})

function removeFromArray<T>(arr: T[], item: T): T[] {
  const idx = arr.indexOf(item)
  if (idx === -1) return arr
  return [...arr.slice(0, idx), ...arr.slice(idx + 1)]
}

function insertIntoArray<T>(arr: T[], item: T, index: number): T[] {
  const i = Math.max(0, Math.min(index, arr.length))
  return [...arr.slice(0, i), item, ...arr.slice(i)]
}

/**
 * Deep-duplicate a node (and optionally its subtree) producing new nodes with provenance.
 * Returns the new root id plus a flat list of created ids.
 */
function duplicateNodeGraph(params: {
  sourceId: NodeId
  nodesById: Record<NodeId, Node>
  mode: DuplicateMode
  includeSubtree: boolean
  at: IsoDateString
}): { newRootId: NodeId; created: Record<NodeId, Node>; createdIds: NodeId[] } {
  const { sourceId, nodesById, includeSubtree, at } = params
  // mode param exists in signature but not used in implementation yet
  const source = nodesById[sourceId]
  if (!source) throw new Error(`Source node not found: ${sourceId}`)

  const created: Record<NodeId, Node> = {}
  const createdIds: NodeId[] = []

  const walk = (currentSourceId: NodeId): NodeId => {
    const s = nodesById[currentSourceId]
    if (!s)
      throw new Error(`Source node not found during walk: ${currentSourceId}`)

    const newId = genId() as NodeId
    createdIds.push(newId)

    const provenance: NodeProvenance = {
      kind: "derived",
      sourceNodeId: currentSourceId,
      createdAt: at,
    }

    const childIds = includeSubtree ? s.children.map(walk) : []

    const newNode: Node = {
      ...s,
      id: newId,
      children: childIds,
      // Keep tags/content as-is; caller can edit after.
      meta: {
        ...s.meta,
        createdAt: at,
        updatedAt: at,
        provenance,
      },
    }

    created[newId] = newNode
    return newId
  }

  const newRootId = walk(sourceId)
  return { newRootId, created, createdIds }
}

export const useDocumentStore = create<DocumentStore>((set, get) => ({
  exploration: createEmptyExploration(),

  init: (doc) => set({ exploration: doc }),

  getNode: (id) => get().exploration.nodesById[id],

  createNode: ({ node, parentId, index }) => {
    set((state) => {
      const doc = state.exploration
      if (doc.nodesById[node.id]) {
        // Stable IDs are invariant; do not overwrite.
        console.warn("Node already exists:", node.id)
        return state
      }

      const nodesById = { ...doc.nodesById, [node.id]: node }

      if (!parentId) {
        const rootIds =
          typeof index === "number"
            ? insertIntoArray(doc.rootIds, node.id, index)
            : [...doc.rootIds, node.id]

        return {
          exploration: {
            ...doc,
            nodesById,
            rootIds,
            meta: { ...doc.meta, updatedAt: nowIso() },
          },
        }
      }

      const parent = nodesById[parentId] ?? doc.nodesById[parentId]
      if (!parent) {
        console.warn("Parent not found:", parentId)
        return state
      }

      const newChildren =
        typeof index === "number"
          ? insertIntoArray(parent.children, node.id, index)
          : [...parent.children, node.id]

      const updatedParent: Node = {
        ...parent,
        children: newChildren,
        meta: { ...parent.meta, updatedAt: nowIso() },
      }

      nodesById[parentId] = updatedParent

      return {
        exploration: {
          ...doc,
          nodesById,
          meta: { ...doc.meta, updatedAt: nowIso() },
        },
      }
    })
  },

  duplicateNode: ({
    sourceNodeId,
    mode = "duplicate",
    includeSubtree = false,
    parentId,
    index,
  }) => {
    const at = nowIso()
    const { exploration } = get()

    const { newRootId, created, createdIds } = duplicateNodeGraph({
      sourceId: sourceNodeId,
      nodesById: exploration.nodesById,
      mode: mode as DuplicateMode,
      includeSubtree,
      at,
    })

    // Insert the new root into the tree at requested location.
    set((state) => {
      const doc = state.exploration
      const nodesById = { ...doc.nodesById, ...created }

      if (!parentId) {
        const rootIds =
          typeof index === "number"
            ? insertIntoArray(doc.rootIds, newRootId, index)
            : [...doc.rootIds, newRootId]

        return {
          exploration: {
            ...doc,
            nodesById,
            rootIds,
            meta: { ...doc.meta, updatedAt: at },
          },
        }
      }

      const parent = nodesById[parentId] ?? doc.nodesById[parentId]
      if (!parent) {
        console.warn("Parent not found for duplicate insert:", parentId)
        return state
      }

      const updatedParent: Node = {
        ...parent,
        children:
          typeof index === "number"
            ? insertIntoArray(parent.children, newRootId, index)
            : [...parent.children, newRootId],
        meta: { ...parent.meta, updatedAt: at },
      }

      nodesById[parentId] = updatedParent

      return {
        exploration: {
          ...doc,
          nodesById,
          meta: { ...doc.meta, updatedAt: at },
        },
      }
    })

    return { newRootId, newIds: createdIds }
  },

  updateNodeContent: (nodeId, content) => {
    set((state) => {
      const doc = state.exploration
      const node = doc.nodesById[nodeId]
      if (!node) return state

      const updated: Node = {
        ...node,
        content,
        meta: { ...node.meta, updatedAt: nowIso() },
      }

      return {
        exploration: {
          ...doc,
          nodesById: { ...doc.nodesById, [nodeId]: updated },
          meta: { ...doc.meta, updatedAt: nowIso() },
        },
      }
    })
  },

  updateNodeTags: (nodeId, tags) => {
    set((state) => {
      const doc = state.exploration
      const node = doc.nodesById[nodeId]
      if (!node) return state

      const updated: Node = {
        ...node,
        tags,
        meta: { ...node.meta, updatedAt: nowIso() },
      }

      return {
        exploration: {
          ...doc,
          nodesById: { ...doc.nodesById, [nodeId]: updated },
          meta: { ...doc.meta, updatedAt: nowIso() },
        },
      }
    })
  },

  moveNode: ({ nodeId, fromParentId, toParentId, toIndex }) => {
    set((state) => {
      const doc = state.exploration
      const node = doc.nodesById[nodeId]
      if (!node) return state

      const nodesById = { ...doc.nodesById }

      // 1) Remove from old parent/root ordering
      let rootIds = doc.rootIds
      if (!fromParentId) {
        rootIds = removeFromArray(rootIds, nodeId)
      } else {
        const fromParent = nodesById[fromParentId]
        if (!fromParent) return state
        nodesById[fromParentId] = {
          ...fromParent,
          children: removeFromArray(fromParent.children, nodeId),
          meta: { ...fromParent.meta, updatedAt: nowIso() },
        }
      }

      // 2) Insert into new parent/root ordering
      if (!toParentId) {
        rootIds = insertIntoArray(rootIds, nodeId, toIndex)
      } else {
        const toParent = nodesById[toParentId]
        if (!toParent) return state

        nodesById[toParentId] = {
          ...toParent,
          children: insertIntoArray(toParent.children, nodeId, toIndex),
          meta: { ...toParent.meta, updatedAt: nowIso() },
        }
      }

      return {
        exploration: {
          ...doc,
          nodesById,
          rootIds,
          meta: { ...doc.meta, updatedAt: nowIso() },
        },
      }
    })
  },

  detachNode: ({ nodeId, parentId }) => {
    set((state) => {
      const doc = state.exploration
      if (!doc.nodesById[nodeId]) return state

      if (!parentId) {
        return {
          exploration: {
            ...doc,
            rootIds: removeFromArray(doc.rootIds, nodeId),
            meta: { ...doc.meta, updatedAt: nowIso() },
          },
        }
      }

      const parent = doc.nodesById[parentId]
      if (!parent) return state

      const updatedParent: Node = {
        ...parent,
        children: removeFromArray(parent.children, nodeId),
        meta: { ...parent.meta, updatedAt: nowIso() },
      }

      return {
        exploration: {
          ...doc,
          nodesById: { ...doc.nodesById, [parentId]: updatedParent },
          meta: { ...doc.meta, updatedAt: nowIso() },
        },
      }
    })
  },

  deleteNode: (nodeId: NodeId) => {
    set((state) => {
      const doc = state.exploration
      const node = doc.nodesById[nodeId]
      if (!node) return state

      // Remove from root if it's there
      const rootIds = doc.rootIds.filter((id) => id !== nodeId)

      // Remove from any parent's children
      const nodesById = { ...doc.nodesById }
      Object.values(nodesById).forEach((n) => {
        if (n.children.includes(nodeId)) {
          nodesById[n.id] = {
            ...n,
            children: n.children.filter((id) => id !== nodeId),
            meta: { ...n.meta, updatedAt: nowIso() },
          }
        }
      })

      // Delete the node itself
      delete nodesById[nodeId]

      // Recursively delete children
      const deleteRecursive = (id: NodeId) => {
        const child = nodesById[id]
        if (child) {
          child.children.forEach(deleteRecursive)
          delete nodesById[id]
        }
      }
      node.children.forEach(deleteRecursive)

      return {
        exploration: {
          ...doc,
          nodesById,
          rootIds,
          meta: { ...doc.meta, updatedAt: nowIso() },
        },
      }
    })
  },
}))
