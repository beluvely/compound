import { create } from "zustand"

/**
 * Navigation Store
 * 
 * Handles abstraction-based navigation between Exploration and Spec.
 * Maintains cursor position per document and navigation history.
 */

export type DocumentView = "exploration" | "spec" | "tasks" | "chats"

interface CursorPosition {
  /** Character offset or block position */
  position: number
  /** Additional context for restoring cursor */
  context?: any
}

interface NavigationState {
  /** Current active view */
  currentView: DocumentView
  
  /** Cursor positions per view */
  cursorPositions: Record<DocumentView, CursorPosition | null>
  
  /** Navigation stack for "go back" behavior */
  navigationStack: Array<{
    view: DocumentView
    position: CursorPosition | null
  }>
  
  /** Whether view switcher is open */
  isViewSwitcherOpen: boolean
}

interface NavigationActions {
  /** Navigate to a view (abstraction navigation) */
  navigateTo: (view: DocumentView, saveCursor?: boolean) => void
  
  /** Go up in abstraction (to Spec) */
  goUp: () => void
  
  /** Go down in abstraction (to Exploration) */
  goDown: () => void
  
  /** Save current cursor position for active view */
  saveCursorPosition: (position: CursorPosition) => void
  
  /** Get cursor position for a view */
  getCursorPosition: (view: DocumentView) => CursorPosition | null
  
  /** Toggle view switcher */
  toggleViewSwitcher: () => void
  
  /** Open view switcher */
  openViewSwitcher: () => void
  
  /** Close view switcher */
  closeViewSwitcher: () => void
  
  /** Navigate back in history */
  goBack: () => void
}

export type NavigationStore = NavigationState & NavigationActions

const createInitialState = (): NavigationState => ({
  currentView: "exploration",
  cursorPositions: {
    exploration: null,
    spec: null,
    tasks: null,
    chats: null,
  },
  navigationStack: [],
  isViewSwitcherOpen: false,
})

export const useNavigationStore = create<NavigationStore>((set, get) => ({
  ...createInitialState(),

  navigateTo: (view, saveCursor = true) => {
    if (saveCursor) {
      // Push current view to navigation stack
      set((state) => ({
        navigationStack: [
          ...state.navigationStack,
          {
            view: state.currentView,
            position: state.cursorPositions[state.currentView],
          },
        ],
        currentView: view,
      }))
    } else {
      set({ currentView: view })
    }
  },

  goUp: () => {
    const current = get()
    if (current.currentView === "exploration") {
      get().navigateTo("spec", true)
    }
    // If already at Spec, do nothing (it's the top level)
  },

  goDown: () => {
    if (get().currentView === "spec") {
      get().navigateTo("exploration", true)
    }
    // If already at Exploration, do nothing (it's the bottom level)
  },

  saveCursorPosition: (position) => {
    set((state) => ({
      cursorPositions: {
        ...state.cursorPositions,
        [state.currentView]: position,
      },
    }))
  },

  getCursorPosition: (view) => {
    return get().cursorPositions[view]
  },

  toggleViewSwitcher: () => {
    set((state) => ({
      isViewSwitcherOpen: !state.isViewSwitcherOpen,
    }))
  },

  openViewSwitcher: () => {
    set({ isViewSwitcherOpen: true })
  },

  closeViewSwitcher: () => {
    set({ isViewSwitcherOpen: false })
  },

  goBack: () => {
    const { navigationStack } = get()
    
    if (navigationStack.length === 0) return

    const previous = navigationStack[navigationStack.length - 1]
    const newStack = navigationStack.slice(0, -1)

    set({
      currentView: previous.view,
      navigationStack: newStack,
    })
  },
}))
