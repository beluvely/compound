import { useDocumentStore } from "./document.store"
import { useSpecStore } from "./spec.store"
import { useViewStore } from "./view.store"
import { useChatStore } from "./chat.store"
import { loadPersistedState, savePersistedState } from "./persistence"
import { createSeedDocument } from "@/lib/seed-data"
import type { PersistedStateV0 } from "../domain/types"

export async function hydrateStoresFromIndexedDb(): Promise<void> {
  const persisted = await loadPersistedState()
  
  if (persisted) {
    // Load from IndexedDB
    useDocumentStore.getState().init(persisted.exploration)
    useSpecStore.getState().init(persisted.spec)
    useViewStore.getState().init(persisted.view)
    
    // Initialize chat store with persisted data or empty state
    const chatData = persisted.chat || { threads: {}, activeThreadId: null }
    useChatStore.getState().init(chatData.threads, chatData.activeThreadId)
  } else {
    // First time: seed with sample data
    console.log("🌱 No saved data found. Seeding with sample document...")
    const seedDoc = createSeedDocument()
    useDocumentStore.getState().init(seedDoc)
    
    // Initialize empty chat state
    useChatStore.getState().init({}, null)
    
    // Save seed data to IndexedDB for persistence
    await persistStoresToIndexedDb()
  }
}

/** Call this after meaningful state changes (debounce in UI). */
export async function persistStoresToIndexedDb(): Promise<void> {
  const chatState = useChatStore.getState()
  const state: PersistedStateV0 = {
    version: 0,
    exploration: useDocumentStore.getState().exploration,
    spec: useSpecStore.getState().spec,
    view: useViewStore.getState().view,
    chat: {
      threads: chatState.threads,
      activeThreadId: chatState.activeThreadId,
    },
    // ops: ... optional later
  }
  await savePersistedState(state)
}
