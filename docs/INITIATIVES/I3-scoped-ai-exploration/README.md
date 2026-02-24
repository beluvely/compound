# I3 — Scoped AI Exploration with Contextual Threads & Transformation Lenses

## Outcome
Enable document-scoped AI conversations that feel like having an expert collaborator embedded in your thinking process. Users can open contextual chat threads anywhere in their document, each automatically scoped to the relevant semantic section, then lift and transform AI insights back into the document using reusable transformation lenses.

## Context & Strategic Rationale
**Core Problem:** Current AI tools (Notion AI, ChatGPT, Cursor) treat documents as static uploads rather than living, structured knowledge. You copy/paste context, lose provenance, and insights become disconnected from source material.

**Compound's Advantage:** Our node-based document model enables AI to be **contextually aware of semantic scope** (headings, sections) and maintain **bidirectional references** between conversations and document content.

**Product Differentiation:**
- **Notion AI:** Chat bolted onto documents, no scope awareness
- **Cursor:** Code-focused, not knowledge management  
- **Obsidian:** No native AI integration with semantic binding
- **Compound:** Document nodes ARE the unit of AI context

## Vision: The Experience We're Building

```
# Market Research

## Competitor Analysis ← [cursor here]
- Company X: Direct competitor, $50M ARR
- Company Y: Adjacent space, different ICP
- Current market gap: No solution for SMB segment

💬 [3 threads] ← Badge shows active threads
│
├─ 💬 "Competitive positioning"
│   User: "How do we differentiate from Company X?"
│   AI: "Based on your analysis above, Company X targets enterprise 
│        while you could own the SMB segment. Key differentiators..."
│   [↑ Extract Decisions] [↑ Action Items] [↑ Executive Summary]
│
├─ 💬 "Pricing strategy" 
│   User: "What price point makes sense for SMBs?"
│   AI: "Considering your competitor data and SMB segment..."
│   [↑ Expand Detail] [↑ Executive Summary] [↑ Raw Lift]
│
└─ 💬 "Market sizing"
    User: "Help me calculate TAM/SAM"
    AI: "From your research data points above..."
    
## Go-to-Market Strategy ← [lifted AI insights appear here]
- **Key Insight:** SMB segment underserved (from AI analysis)
- **Pricing Strategy:** $99/month positions below enterprise competitors
- **Action Items:**
  - [ ] Research SMB buying behaviors
  - [ ] Validate pricing with 10 prospects
```

## Scope & Components

### Phase 1: Chat Infrastructure (Week 1)
**Build the foundational thread system**
- Chat store with thread-to-node binding
- Basic thread UI (collapsible panels)
- Scope detection using existing `resolveSemanticScope`
- Thread indicators on headings (💬 badge with count)

### Phase 2: Contextual AI Integration (Week 2)  
**Make AI aware of document context**
- Context assembly from semantic scope
- OpenAI/Anthropic integration with streaming
- Message persistence and thread history
- Scope snapshot at thread creation time

### Phase 3: Transformation Lenses System (Week 2-3)
**Enable lifting AI insights with smart transformation**
- Built-in lens library (Extract Decisions, Executive Summary, Action Items, etc.)
- Custom lens creator with system prompts
- Lift dialog with lens selection
- Provenance tracking (AI + lens + source thread)

### Phase 4: Advanced Lifting & UX Polish (Week 3)
**Multiple lift modes and polished experience**  
- Lift selected text, single message, turns, or entire thread
- Lens preview before lifting  
- Keyboard shortcuts for common lenses
- Thread management (archive, delete, search)

## Technical Architecture

### Data Model
```typescript
// Chat Threads
type ChatThread = {
  id: string
  scopeNodeId: NodeId      // Heading/section it's bound to
  title?: string           // "Competitive positioning"  
  messages: Message[]
  createdAt: string
  meta: {
    scopeSnapshot: NodeId[] // Context nodes at creation
  }
}

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
  metadata?: {
    tokens?: number
    model?: string
    contextNodeIds?: NodeId[]
  }
}

// Transformation Lenses
type LiftLens = {
  id: string
  name: string              // "Extract Decisions"
  description: string       // "Pull out key decisions made"
  systemPrompt: string      // AI transformation instruction
  category: "summary" | "analysis" | "action" | "custom"
  icon: string             // "✓"
}

// Lift Operations
type LiftSource = 
  | { type: "selection"; text: string; messageId: string }
  | { type: "message"; messageId: string }
  | { type: "turn"; messageIds: [string, string] }
  | { type: "thread"; threadId: string }
```

### Context Assembly Strategy
```typescript
function buildAIContext(scopeNodeId: NodeId): string {
  const scope = resolveSemanticScope(scopeNodeId, nodesById, rootIds)
  
  return scope.includedNodeIds
    .map(id => nodesById[id])
    .filter(Boolean)
    .map(formatNodeAsContext)
    .join('\n\n')
}

function formatNodeAsContext(node: Node): string {
  const formatters = {
    heading: (n) => `# ${n.content.value}`,
    list: (n) => `- ${n.content.value}`,
    text: (n) => n.content.value,
  }
  return formatters[node.content.type]?.(node) || node.content.value
}
```

### AI Integration Points
- **OpenAI GPT-4/GPT-4-turbo**: Primary reasoning engine
- **Anthropic Claude**: Alternative/fallback option  
- **Streaming responses**: Real-time conversation feel
- **Token management**: Context window optimization
- **Rate limiting**: Respectful API usage

## Success Metrics & Acceptance Criteria

### User Experience Metrics
- **Context accuracy**: AI responses reflect document scope (95%+ relevance)  
- **Lift success rate**: Users lift 60%+ of AI responses to document
- **Thread engagement**: Average 3+ messages per thread
- **Lens adoption**: 40%+ of lifts use transformation lenses

### Technical Acceptance Criteria
- [ ] Semantic scope detection works for H1/H2/H3 hierarchies
- [ ] Thread creation takes <500ms from ⌘+K shortcut  
- [ ] AI responses stream naturally (like ChatGPT)
- [ ] Context assembly handles 50+ node documents
- [ ] Lift operations preserve formatting and provenance
- [ ] Custom lens creation works end-to-end
- [ ] Thread indicators update in real-time
- [ ] Keyboard shortcuts work reliably

### Product Validation Goals
- [ ] 5 early users complete full workflow (thread → lift → lenses)
- [ ] Users prefer Compound chat vs copy/paste to ChatGPT
- [ ] Document quality improves with AI integration
- [ ] Users create custom lenses for their workflows

## Non-Scope (Explicitly Out)
- Multi-user chat/collaboration (M4+)
- Voice/audio messages (future)
- Image/file uploads in chat (future)
- Thread sharing between users (future)
- Advanced AI models (GPT-5, etc.) - can add later
- Plugin/extension system for AI providers

## Dependencies & Prerequisites
**Completed (I2):**
- ✅ TipTap editor with semantic scope resolution
- ✅ Lifting system (⌘+Shift+L) with provenance  
- ✅ Read-only transclusions in Spec view
- ✅ Stable node ID system

**Required for I3:**
- API keys for OpenAI/Anthropic
- Streaming response handling
- Toast notification system (exists)

## Risk Mitigation
**Technical Risks:**
- *Context window limits*: Implement smart truncation/summarization
- *API rate limiting*: Queue system with user feedback
- *Streaming reliability*: Fallback to non-streaming mode

**Product Risks:**  
- *Users don't lift AI content*: Make lifting frictionless with one-click lenses
- *Context too narrow/broad*: Allow manual scope adjustment
- *AI responses irrelevant*: Improve context assembly and prompt engineering

## Phases & Timeline

### 🏗️ Phase 1: Infrastructure (5-7 days)
**Goal:** Basic thread system working
```
Day 1-2: Chat store + data model
Day 3-4: Thread UI components  
Day 5-6: Scope detection integration
Day 7: Thread indicators & basic UX
```

### 🤖 Phase 2: AI Integration (4-5 days)  
**Goal:** Contextual AI conversations
```
Day 8-9: Context assembly + OpenAI integration
Day 10-11: Streaming responses + message persistence
Day 12: Polish conversation UX
```

### 🔄 Phase 3: Lens System (5-6 days)
**Goal:** Smart lifting with transformations  
```
Day 13-14: Lens store + built-in lenses
Day 15-16: Lift dialog + lens application  
Day 17-18: Custom lens creator
```

### 🎯 Phase 4: Polish & Validation (3-4 days)
**Goal:** Production-ready experience
```
Day 19-20: Advanced lift modes + keyboard shortcuts
Day 21-22: User testing + feedback iteration
```

**Total Estimated Timeline: 17-22 days (~3-4 weeks)**

## Future Extensions (Post-I3)
- **Advanced AI**: Function calling, tool usage, code generation
- **Multi-modal**: Image analysis, voice to text
- **Collaboration**: Shared threads, AI as team member
- **Workflows**: Automated lens sequences, saved AI routines
- **Analytics**: AI insight tracking, content quality metrics

---

## Getting Started
**Next Actions:**
1. ✅ Create initiative structure  
2. 🏗️ Implement chat store + thread data model
3. 🎨 Build basic thread UI components
4. 🔍 Integrate scope detection with existing system