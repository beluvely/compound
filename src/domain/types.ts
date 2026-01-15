// Domain types for Compound
// These are placeholder stubs to enable compilation
// TODO: Implement full type definitions per invariants in README.md

export type NodeId = string
export type SpecBlockId = string
export type SpecDocumentId = string
export type IsoDateString = string
export type Tag = string

export interface NodeContent {
  type: "text" | "heading" | "list" | "code"
  value: string
  metadata?: Record<string, unknown>
}

export interface NodeProvenance {
  createdAt: IsoDateString
  createdBy?: string
  source?: string
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
  }
  provenance?: NodeProvenance
}

export interface ExplorationDocument {
  id: string
  rootIds: NodeId[]
  nodesById: Record<NodeId, Node>
  meta: {
    createdAt: IsoDateString
    updatedAt: IsoDateString
  }
}

export interface SpecBlock {
  id: SpecBlockId
  type: "heading" | "reference"
  sourceNodeId?: NodeId
  includeSubtree?: boolean
  title?: string
  level?: number
  children: SpecBlockId[]
  meta: {
    createdAt: IsoDateString
    updatedAt: IsoDateString
  }
}

export interface SpecDocument {
  id: SpecDocumentId
  rootBlockIds: SpecBlockId[]
  specBlocksById: Record<SpecBlockId, SpecBlock>
  meta: {
    createdAt: IsoDateString
    updatedAt: IsoDateString
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

export interface PersistedStateV0 {
  version: 0
  exploration: ExplorationDocument
  spec: SpecDocument
  view: ViewState
}