import { create } from "zustand"
import type {
  IsoDateString,
  NodeId,
  SpecBlock,
  SpecBlockId,
  SpecDocument,
  SpecDocumentId,
} from "../domain/types"

type SpecActions = {
  init: (spec: SpecDocument) => void

  /** Adds a heading block to the Spec structure. */
  addHeading: (input: {
    title: string
    level: 1 | 2 | 3
    parentBlockId?: SpecBlockId // undefined = root
    index?: number
  }) => SpecBlockId

  /**
   * Lift = create a transclusion block referencing a source node.
   * This must not copy content; it stores only sourceNodeId + includeSubtree.
   */
  liftTransclusion: (input: {
    sourceNodeId: NodeId
    includeSubtree: boolean
    parentBlockId?: SpecBlockId // undefined = root
    index?: number
  }) => SpecBlockId

  removeBlock: (blockId: SpecBlockId) => void

  moveBlock: (input: {
    blockId: SpecBlockId
    fromParentBlockId?: SpecBlockId
    toParentBlockId?: SpecBlockId
    toIndex: number
  }) => void

  getBlock: (id: SpecBlockId) => SpecBlock | undefined
}

export type SpecStore = {
  spec: SpecDocument
} & SpecActions

const nowIso = (): IsoDateString => new Date().toISOString()

const createEmptySpec = (): SpecDocument => ({
  schemaVersion: 0,
  id: "spec:local" as SpecDocumentId,
  rootIds: [],
  specBlocksById: {},
  meta: { createdAt: nowIso(), updatedAt: nowIso(), title: "Spec" },
})

const genId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id_${Math.random().toString(16).slice(2)}_${Date.now()}`

function removeFromArray<T>(arr: T[], item: T): T[] {
  const idx = arr.indexOf(item)
  if (idx === -1) return arr
  return [...arr.slice(0, idx), ...arr.slice(idx + 1)]
}
function insertIntoArray<T>(arr: T[], item: T, index: number): T[] {
  const i = Math.max(0, Math.min(index, arr.length))
  return [...arr.slice(0, i), item, ...arr.slice(i)]
}

export const useSpecStore = create<SpecStore>((set, get) => ({
  spec: createEmptySpec(),

  init: (spec) => set({ spec }),

  getBlock: (id) => get().spec.specBlocksById[id],

  addHeading: ({ title, level, parentBlockId, index }) => {
    const id = genId() as SpecBlockId
    set((state) => {
      const spec = state.spec
      const block: Extract<SpecBlock, { kind: "heading" }> = {
        id,
        kind: "heading",
        level,
        title,
        children: [],
        meta: { createdAt: nowIso(), updatedAt: nowIso() },
      }

      const specBlocksById = { ...spec.specBlocksById, [id]: block }

      if (!parentBlockId) {
        const rootIds =
          typeof index === "number"
            ? insertIntoArray(spec.rootIds, id, index)
            : [...spec.rootIds, id]

        return {
          spec: {
            ...spec,
            specBlocksById,
            rootIds,
            meta: { ...spec.meta, updatedAt: nowIso() },
          },
        }
      }

      const parent =
        specBlocksById[parentBlockId] ?? spec.specBlocksById[parentBlockId]
      if (!parent) return state

      specBlocksById[parentBlockId] = {
        ...parent,
        children:
          typeof index === "number"
            ? insertIntoArray(parent.children, id, index)
            : [...parent.children, id],
        meta: { ...parent.meta, updatedAt: nowIso() },
      } as SpecBlock

      return {
        spec: {
          ...spec,
          specBlocksById,
          meta: { ...spec.meta, updatedAt: nowIso() },
        },
      }
    })
    return id
  },

  liftTransclusion: ({
    sourceNodeId,
    includeSubtree,
    parentBlockId,
    index,
  }) => {
    const id = genId() as SpecBlockId
    set((state) => {
      const spec = state.spec

      const block: Extract<SpecBlock, { kind: "transclusion" }> = {
        id,
        kind: "transclusion",
        sourceNodeId,
        includeSubtree,
        children: [],
        meta: { createdAt: nowIso(), updatedAt: nowIso() },
      }

      const specBlocksById = { ...spec.specBlocksById, [id]: block }

      if (!parentBlockId) {
        const rootIds =
          typeof index === "number"
            ? insertIntoArray(spec.rootIds, id, index)
            : [...spec.rootIds, id]

        return {
          spec: {
            ...spec,
            specBlocksById,
            rootIds,
            meta: { ...spec.meta, updatedAt: nowIso() },
          },
        }
      }

      const parent =
        specBlocksById[parentBlockId] ?? spec.specBlocksById[parentBlockId]
      if (!parent) return state

      specBlocksById[parentBlockId] = {
        ...parent,
        children:
          typeof index === "number"
            ? insertIntoArray(parent.children, id, index)
            : [...parent.children, id],
        meta: { ...parent.meta, updatedAt: nowIso() },
      } as SpecBlock

      return {
        spec: {
          ...spec,
          specBlocksById,
          meta: { ...spec.meta, updatedAt: nowIso() },
        },
      }
    })

    return id
  },

  removeBlock: (blockId) => {
    set((state) => {
      const spec = state.spec
      const block = spec.specBlocksById[blockId]
      if (!block) return state

      // Remove from any parent's children or root
      const rootIds = removeFromArray(spec.rootIds, blockId)
      const specBlocksById = { ...spec.specBlocksById }

      // Remove from all parents (simple & safe; optimize later)
      for (const [id, b] of Object.entries(specBlocksById)) {
        if (b.children?.includes(blockId)) {
          specBlocksById[id as SpecBlockId] = {
            ...b,
            children: removeFromArray(b.children, blockId),
            meta: { ...b.meta, updatedAt: nowIso() },
          } as SpecBlock
        }
      }

      // NOTE: We do not cascade delete children here in v0. That’s a later policy decision.
      delete specBlocksById[blockId]

      return {
        spec: {
          ...spec,
          rootIds,
          specBlocksById,
          meta: { ...spec.meta, updatedAt: nowIso() },
        },
      }
    })
  },

  moveBlock: ({ blockId, fromParentBlockId, toParentBlockId, toIndex }) => {
    set((state) => {
      const spec = state.spec
      const block = spec.specBlocksById[blockId]
      if (!block) return state

      const specBlocksById = { ...spec.specBlocksById }

      // Remove from old container
      let rootIds = spec.rootIds
      if (!fromParentBlockId) {
        rootIds = removeFromArray(rootIds, blockId)
      } else {
        const fromParent = specBlocksById[fromParentBlockId]
        if (!fromParent) return state
        specBlocksById[fromParentBlockId] = {
          ...fromParent,
          children: removeFromArray(fromParent.children, blockId),
          meta: { ...fromParent.meta, updatedAt: nowIso() },
        } as SpecBlock
      }

      // Insert into new container
      if (!toParentBlockId) {
        rootIds = insertIntoArray(rootIds, blockId, toIndex)
      } else {
        const toParent = specBlocksById[toParentBlockId]
        if (!toParent) return state
        specBlocksById[toParentBlockId] = {
          ...toParent,
          children: insertIntoArray(toParent.children, blockId, toIndex),
          meta: { ...toParent.meta, updatedAt: nowIso() },
        } as SpecBlock
      }

      return {
        spec: {
          ...spec,
          rootIds,
          specBlocksById,
          meta: { ...spec.meta, updatedAt: nowIso() },
        },
      }
    })
  },
}))
