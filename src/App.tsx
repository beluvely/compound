import { useEffect, useState } from "react"
import { ExplorationView } from "@/app/ExplorationView"
import { SpecView } from "@/app/SpecView"
import { hydrateStoresFromIndexedDb } from "@/stores/hydrate"

function App() {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    hydrateStoresFromIndexedDb().then(() => {
      setIsHydrated(true)
    })
  }, [])

  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Exploration (left) */}
      <div className="w-1/2 border-r border-border">
        <ExplorationView />
      </div>

      {/* Spec (right) */}
      <div className="w-1/2">
        <SpecView />
      </div>
    </div>
  )
}

export default App
