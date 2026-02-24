/**
 * Seed test data for development
 * Creates sample nodes to test TipTap rendering
 */

import type { Node, ExplorationDocument, IsoDateString } from "@/domain/types"

const now = (): IsoDateString => new Date().toISOString()

export function createSeedDocument(): ExplorationDocument {
  const timestamp = now()
  
  // Create test nodes
  const nodes: Node[] = [
    {
      id: "seed-1",
      type: "block",
      content: {
        type: "heading",
        value: "Testing TipTap Integration",
        metadata: { level: 1 },
      },
      children: [],
      tags: [],
      meta: {
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    },
    {
      id: "seed-2",
      type: "block",
      content: {
        type: "text",
        value: "This is a paragraph block to test basic text rendering in TipTap.",
      },
      children: [],
      tags: [],
      meta: {
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    },
    {
      id: "seed-3",
      type: "block",
      content: {
        type: "heading",
        value: "Heading 2 Test",
        metadata: { level: 2 },
      },
      children: [],
      tags: [],
      meta: {
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    },
    {
      id: "seed-4",
      type: "block",
      content: {
        type: "list",
        value: "First bullet point",
      },
      children: [],
      tags: [],
      meta: {
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    },
    {
      id: "seed-5",
      type: "block",
      content: {
        type: "list",
        value: "Second bullet point",
      },
      children: [],
      tags: [],
      meta: {
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    },
    {
      id: "seed-6",
      type: "block",
      content: {
        type: "heading",
        value: "Heading 3 Test",
        metadata: { level: 3 },
      },
      children: [],
      tags: [],
      meta: {
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    },
    {
      id: "seed-7",
      type: "block",
      content: {
        type: "text",
        value: "Another paragraph to test continuous reading flow. This should render as normal text with proper spacing.",
      },
      children: [],
      tags: [],
      meta: {
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    },
  ]

  // Build nodesById map
  const nodesById: Record<string, Node> = {}
  const rootIds: string[] = []
  
  for (const node of nodes) {
    nodesById[node.id] = node
    rootIds.push(node.id)
  }

  return {
    id: "exploration:local",
    rootIds,
    nodesById,
    meta: {
      title: "Exploration (Seeded)",
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  }
}
