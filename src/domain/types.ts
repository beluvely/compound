// Domain types for Compound
// These are placeholder stubs to enable compilation
// TODO: Implement full type definitions per invariants in README.md

export type NodeId = string
export type SpecBlockId = string
export type SpecDocumentId = string
export type IsoDateString = string
export type Tag = string
export type DuplicateMode = "shallow" | "deep"

export interface NodeContent {
  type: "text" | "heading" | "list" | "code"
  value: string
  metadata?: Record<string, unknown>
}

export interface NodeProvenance {
  kind: "user" | "derived"
  sourceNodeId?: NodeId
  createdAt: IsoDateString
  createdBy?: string
  derivedFrom?: string
}

export interface Node {
  id: NodeId
  type: string
  content: NodeContent
  children: NodeId[]
  tags: Tag[]
  meta: {
    createdAt: IsoDateString
    updatedAt: IsoDateString
    provenance?: NodeProvenance
  }
}

export interface ExplorationDocument {
  id: string
  rootIds: NodeId[]
  nodesById: Record<NodeId, Node>
  meta: {
    title?: string
    createdAt: IsoDateString
    updatedAt: IsoDateString
  }
}

export interface SpecBlock {
  id: SpecBlockId
  kind: "heading" | "transclusion"
  sourceNodeId?: NodeId
  includeSubtree?: boolean
  title?: string
  level?: 1 | 2 | 3
  children: SpecBlockId[]
  meta: {
    createdAt: IsoDateString
    updatedAt: IsoDateString
  }
}

export interface SpecDocument {
  id: SpecDocumentId
  rootIds: SpecBlockId[]
  blocksById: Record<SpecBlockId, SpecBlock>
  meta: {
    createdAt: IsoDateString
    updatedAt: IsoDateString
    title?: string
  }
}

export interface ViewState {
  selectedNodeId: NodeId | null
  focusedRootId: NodeId | null
  collapsedNodeIds: Record<NodeId, boolean>
  collapsedSpecBlockIds: Record<SpecBlockId, boolean>
  filters: {
    tags?: Tag[]
    searchQuery?: string
  }
}

// Chat & AI types
export type MessageRole = "user" | "assistant"
export type ChatThreadId = string
export type MessageId = string

export interface LiftSource {
  type: "selection" | "message" | "turn" | "thread"
  messageId?: MessageId
  content: string
  context?: string
}

export interface Message {
  id: MessageId
  threadId: ChatThreadId
  role: MessageRole
  content: string
  timestamp: IsoDateString
  metadata?: {
    tokens?: number
    model?: string
    liftSource?: LiftSource
  }
}

export interface ChatThread {
  id: ChatThreadId
  nodeId: NodeId // The heading/scope this thread is bound to
  title: string // Auto-generated from context or user-set
  messages: Message[]
  createdAt: IsoDateString
  updatedAt: IsoDateString
  isArchived: boolean
  metadata?: {
    scopeContext?: string // Snapshot of the semantic scope when created
    model?: string // Default model for this thread
  }
}

export interface PersistedStateV0 {
  version: 0
  exploration: ExplorationDocument
  spec: SpecDocument
  view: ViewState
  chat: {
    threads: Record<ChatThreadId, ChatThread>
    activeThreadId: ChatThreadId | null
  }
}
