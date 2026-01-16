import { create } from "zustand"
import type { NodeId, SpecBlockId, ViewState } from "../domain/types"

type ViewActions = {
  init: (view: ViewState) => void

  selectNode: (nodeId?: NodeId) => void

  /** Focus mode scopes rendering; it does not mutate document structure. */
  setFocusedRoot: (nodeId?: NodeId) => void

  isCollapsed: (nodeId: NodeId) => boolean
  toggleCollapsed: (nodeId: NodeId) => void
  collapse: (nodeId: NodeId) => void
  expand: (nodeId: NodeId) => void
  expandAll: () => void

  toggleSpecCollapsed?: (blockId: SpecBlockId) => void

  setFilters: (filters: ViewState["filters"]) => void
}

export type ViewStore = {
  view: ViewState
} & ViewActions

const createEmptyView = (): ViewState => ({
  selectedNodeId: null,
  focusedRootId: null,
  collapsedNodeIds: {},
  collapsedSpecBlockIds: {},
  filters: {},
})

export const useViewStore = create<ViewStore>((set, get) => ({
  view: createEmptyView(),

  init: (view) => set({ view }),

  selectNode: (selectedNodeId) =>
    set((state) => ({
      view: { ...state.view, selectedNodeId: selectedNodeId ?? null },
    })),

  setFocusedRoot: (focusedRootId) =>
    set((state) => ({
      view: { ...state.view, focusedRootId: focusedRootId ?? null },
    })),

  isCollapsed: (nodeId) => !!get().view.collapsedNodeIds[nodeId],

  toggleCollapsed: (nodeId) =>
    set((state) => {
      const collapsed = { ...state.view.collapsedNodeIds }
      if (collapsed[nodeId]) delete collapsed[nodeId]
      else collapsed[nodeId] = true

      return { view: { ...state.view, collapsedNodeIds: collapsed } }
    }),

  collapse: (nodeId) =>
    set((state) => ({
      view: {
        ...state.view,
        collapsedNodeIds: { ...state.view.collapsedNodeIds, [nodeId]: true },
      },
    })),

  expand: (nodeId) =>
    set((state) => {
      const collapsed = { ...state.view.collapsedNodeIds }
      delete collapsed[nodeId]
      return { view: { ...state.view, collapsedNodeIds: collapsed } }
    }),

  expandAll: () =>
    set((state) => ({
      view: { ...state.view, collapsedNodeIds: {} },
    })),

  toggleSpecCollapsed: (blockId) =>
    set((state) => {
      const prev = state.view.collapsedSpecBlockIds ?? {}
      const next = { ...prev }
      if (next[blockId]) delete next[blockId]
      else next[blockId] = true

      return {
        view: { ...state.view, collapsedSpecBlockIds: next },
      }
    }),

  setFilters: (filters) =>
    set((state) => ({ view: { ...state.view, filters } })),
}))
