import { create } from "zustand"
import type {
  ChatThread,
  ChatThreadId,
  Message,
  MessageId,
  MessageRole,
  NodeId,
  IsoDateString,
} from "../domain/types"

// Utilities
const nowIso = (): IsoDateString => new Date().toISOString()
const generateId = (): string =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id_${Math.random().toString(16).slice(2)}_${Date.now()}`

type ChatActions = {
  // Thread management
  createThread: (input: { nodeId: NodeId; title?: string }) => ChatThreadId
  getThread: (id: ChatThreadId) => ChatThread | undefined
  getThreadsByNode: (nodeId: NodeId) => ChatThread[]
  updateThread: (id: ChatThreadId, updates: Partial<Pick<ChatThread, 'title' | 'isArchived'>>) => void
  deleteThread: (id: ChatThreadId) => void
  
  // Message management  
  addMessage: (input: {
    threadId: ChatThreadId
    role: MessageRole
    content: string
    metadata?: Message['metadata']
  }) => MessageId
  updateMessage: (messageId: MessageId, content: string) => void
  deleteMessage: (messageId: MessageId) => void
  
  // Thread state
  setActiveThread: (threadId: ChatThreadId | null) => void
  
  // Bulk operations
  init: (threads: Record<ChatThreadId, ChatThread>, activeThreadId?: ChatThreadId | null) => void
  clear: () => void
  
  // Query helpers
  getActiveThread: () => ChatThread | undefined
  getAllThreads: () => ChatThread[]
  getArchivedThreads: () => ChatThread[]
  searchThreads: (query: string) => ChatThread[]
}

type ChatState = {
  threads: Record<ChatThreadId, ChatThread>
  activeThreadId: ChatThreadId | null
}

type ChatStore = ChatState & ChatActions

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  threads: {},
  activeThreadId: null,

  // Thread management
  createThread: (input) => {
    const id = generateId() as ChatThreadId
    const thread: ChatThread = {
      id,
      nodeId: input.nodeId,
      title: input.title || `Thread ${Object.keys(get().threads).length + 1}`,
      messages: [],
      createdAt: nowIso(),
      updatedAt: nowIso(),
      isArchived: false,
    }

    set((state) => ({
      threads: { ...state.threads, [id]: thread },
      activeThreadId: id, // Auto-focus new thread
    }))

    return id
  },

  getThread: (id) => {
    return get().threads[id]
  },

  getThreadsByNode: (nodeId) => {
    const threads = Object.values(get().threads)
    return threads.filter((thread) => thread.nodeId === nodeId && !thread.isArchived)
  },

  updateThread: (id, updates) => {
    set((state) => {
      const thread = state.threads[id]
      if (!thread) return state

      return {
        threads: {
          ...state.threads,
          [id]: {
            ...thread,
            ...updates,
            updatedAt: nowIso(),
          },
        },
      }
    })
  },

  deleteThread: (id) => {
    set((state) => {
      const newThreads = { ...state.threads }
      delete newThreads[id]
      
      return {
        threads: newThreads,
        activeThreadId: state.activeThreadId === id ? null : state.activeThreadId,
      }
    })
  },

  // Message management
  addMessage: (input) => {
    const messageId = generateId() as MessageId
    const message: Message = {
      id: messageId,
      threadId: input.threadId,
      role: input.role,
      content: input.content,
      timestamp: nowIso(),
      metadata: input.metadata,
    }

    set((state) => {
      const thread = state.threads[input.threadId]
      if (!thread) return state

      return {
        threads: {
          ...state.threads,
          [input.threadId]: {
            ...thread,
            messages: [...thread.messages, message],
            updatedAt: nowIso(),
          },
        },
      }
    })

    return messageId
  },

  updateMessage: (messageId, content) => {
    set((state) => {
      const newThreads = { ...state.threads }
      
      for (const threadId in newThreads) {
        const thread = newThreads[threadId]
        const messageIndex = thread.messages.findIndex((m) => m.id === messageId)
        
        if (messageIndex !== -1) {
          const updatedMessages = [...thread.messages]
          updatedMessages[messageIndex] = {
            ...updatedMessages[messageIndex],
            content,
          }
          
          newThreads[threadId] = {
            ...thread,
            messages: updatedMessages,
            updatedAt: nowIso(),
          }
          break
        }
      }
      
      return { threads: newThreads }
    })
  },

  deleteMessage: (messageId) => {
    set((state) => {
      const newThreads = { ...state.threads }
      
      for (const threadId in newThreads) {
        const thread = newThreads[threadId]
        const filteredMessages = thread.messages.filter((m) => m.id !== messageId)
        
        if (filteredMessages.length !== thread.messages.length) {
          newThreads[threadId] = {
            ...thread,
            messages: filteredMessages,
            updatedAt: nowIso(),
          }
          break
        }
      }
      
      return { threads: newThreads }
    })
  },

  // Thread state
  setActiveThread: (threadId) => {
    set({ activeThreadId: threadId })
  },

  // Bulk operations
  init: (threads, activeThreadId = null) => {
    set({ threads, activeThreadId })
  },

  clear: () => {
    set({ threads: {}, activeThreadId: null })
  },

  // Query helpers
  getActiveThread: () => {
    const { threads, activeThreadId } = get()
    return activeThreadId ? threads[activeThreadId] : undefined
  },

  getAllThreads: () => {
    return Object.values(get().threads)
  },

  getArchivedThreads: () => {
    return Object.values(get().threads).filter((thread) => thread.isArchived)
  },

  searchThreads: (query) => {
    const threads = Object.values(get().threads)
    const lowerQuery = query.toLowerCase()
    
    return threads.filter((thread) =>
      thread.title.toLowerCase().includes(lowerQuery) ||
      thread.messages.some((message) =>
        message.content.toLowerCase().includes(lowerQuery)
      )
    )
  },
}))