import { get, set } from "idb-keyval"
import type { PersistedStateV0 } from "../domain/types"

const STORAGE_KEY = "compound.persistedState.v0"

export async function loadPersistedState(): Promise<PersistedStateV0 | null> {
  try {
    const data = await get<PersistedStateV0>(STORAGE_KEY)
    return data ?? null
  } catch (err) {
    console.error("Failed to load persisted state:", err)
    return null
  }
}

export async function savePersistedState(
  state: PersistedStateV0
): Promise<void> {
  try {
    await set(STORAGE_KEY, state)
  } catch (err) {
    console.error("Failed to save persisted state:", err)
  }
}
