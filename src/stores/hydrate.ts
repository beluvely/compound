import { useDocumentStore } from "./document.store"
import { useSpecStore } from "./spec.store"
import { useViewStore } from "./view.store"
import { loadPersistedState, savePersistedState } from "./persistence"
import type { PersistedStateV0 } from "../domain/types"

export async function hydrateStoresFromIndexedDb(): Promise<void> {
  const persisted = await loadPersistedState()
  if (!persisted) return

  useDocumentStore.getState().init(persisted.exploration)
  useSpecStore.getState().init(persisted.spec)
  useViewStore.getState().init(persisted.view)
}

/** Call this after meaningful state changes (debounce in UI). */
export async function persistStoresToIndexedDb(): Promise<void> {
  const state: PersistedStateV0 = {
    version: 0,
    exploration: useDocumentStore.getState().exploration,
    spec: useSpecStore.getState().spec,
    view: useViewStore.getState().view,
    // ops: ... optional later
  }
  await savePersistedState(state)
}
