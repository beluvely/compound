# Technical Roadmap: Scoped AI Exploration

## Overview
This roadmap details the technical implementation path for I3, building on the solid foundation established in I2 (TipTap editor + semantic scope lifting).

## Phase Breakdown

### Phase 1: Chat Infrastructure 🏗️
**Duration:** 5-7 days  
**Goal:** Basic thread system with scope binding

#### Day 1-2: Data Layer & Store Architecture
- [ ] **Chat store**: Thread management, message persistence
- [ ] **Thread-to-node binding**: Link threads to semantic scopes
- [ ] **Message model**: User/AI content with metadata
- [ ] **IndexedDB persistence**: Thread history survival across sessions
- [ ] **Thread queries**: Get threads by scope, search functionality

**Key Files:**
- `src/stores/chat.store.ts` - Zustand store for chat state
- `src/domain/types.ts` - ChatThread, Message, LiftSource types
- `src/stores/persistence.ts` - IndexedDB chat persistence

#### Day 3-4: Core UI Components  
- [ ] **ThreadPanel**: Collapsible sidebar for threads
- [ ] **MessageList**: Chat conversation display
- [ ] **MessageInput**: Text input with send functionality
- [ ] **ThreadIndicator**: Badge on headings showing thread count
- [ ] **Thread management**: Create, archive, delete operations

**Key Files:**
- `src/components/chat/ThreadPanel.tsx`
- `src/components/chat/MessageList.tsx`
- `src/components/chat/MessageInput.tsx` 
- `src/components/chat/ThreadIndicator.tsx`

#### Day 5-6: Scope Integration
- [ ] **Current scope detection**: Use existing `resolveSemanticScope`
- [ ] **Auto-thread creation**: ⌘+K shortcut to start contextual thread
- [ ] **Scope display**: Show current context in thread header
- [ ] **Scope switching**: Update thread scope when cursor moves
- [ ] **Thread filtering**: Show only threads relevant to current scope

#### Day 7: UX Polish & Testing
- [ ] **Keyboard shortcuts**: ⌘+K for new thread, Esc to close
- [ ] **Visual design**: Thread styling, animations, responsive layout
- [ ] **Error states**: Handle empty threads, connection issues
- [ ] **Loading states**: Thread creation, message sending feedback
- [ ] **Manual testing**: Core thread workflows work end-to-end

---

### Phase 2: AI Integration 🤖
**Duration:** 4-5 days  
**Goal:** Contextual AI conversations with streaming

#### Day 8-9: Context Assembly & API Integration
- [ ] **Context builder**: Convert semantic scope to AI prompt context
- [ ] **OpenAI integration**: GPT-4 API with proper error handling
- [ ] **Anthropic integration**: Claude as fallback option
- [ ] **Token management**: Context window optimization and truncation
- [ ] **Prompt engineering**: System prompts for contextual assistance

**Key Files:**
- `src/lib/ai-context.ts` - Context assembly utilities
- `src/lib/ai-client.ts` - OpenAI/Anthropic API clients
- `src/api/chat.ts` - Backend chat API endpoints (if needed)

#### Day 10-11: Streaming Responses & Real-time Updates
- [ ] **Streaming implementation**: Real-time AI response rendering
- [ ] **Message state management**: Pending, streaming, complete states
- [ ] **Response parsing**: Handle AI response formatting
- [ ] **Error recovery**: Retry failed messages, fallback providers
- [ ] **Rate limiting**: Respectful API usage with user feedback

#### Day 12: Conversation UX Polish
- [ ] **Message threading**: Clear user/AI conversation flow
- [ ] **Timestamps**: Message timing and metadata display  
- [ ] **Copy/share**: Message content interaction
- [ ] **Conversation search**: Find messages within threads
- [ ] **Thread history**: Navigate previous conversations

---

### Phase 3: Lens System 🔄  
**Duration:** 5-6 days
**Goal:** Smart content transformation and lifting

#### Day 13-14: Lens Infrastructure & Built-ins
- [ ] **Lens store**: Transformation lens management  
- [ ] **Built-in lenses**: Extract Decisions, Executive Summary, Action Items, Expand Detail
- [ ] **Lens execution**: Apply AI transformation to content
- [ ] **Transformation API**: Convert content through lens prompts
- [ ] **Lens metadata**: Track transformation provenance

**Key Files:**
- `src/stores/lens.store.ts` - Lens management store
- `src/lib/lens-transforms.ts` - Lens application logic
- `src/data/built-in-lenses.ts` - Default lens library

#### Day 15-16: Lift Dialog & Content Integration
- [ ] **Lift dialog**: Lens selection interface for content lifting
- [ ] **Lift modes**: Selection, message, turn, thread lifting options
- [ ] **Preview functionality**: Show transformation preview before lifting
- [ ] **Document integration**: Create nodes with lens-transformed content
- [ ] **Provenance tracking**: Link lifted content to source thread + lens

**Key Files:**
- `src/components/lift/LiftDialog.tsx`
- `src/components/lift/LensSelector.tsx`
- `src/lib/lift-operations.ts`

#### Day 17-18: Custom Lens Creator & Advanced Features
- [ ] **Lens creator UI**: Build custom transformation lenses
- [ ] **Prompt templates**: Common lens patterns and examples  
- [ ] **Lens sharing**: Export/import custom lenses
- [ ] **Lens testing**: Preview custom lens outputs
- [ ] **Lens library**: User's collection of custom + built-in lenses

---

### Phase 4: Polish & Validation 🎯
**Duration:** 3-4 days
**Goal:** Production-ready experience with user validation

#### Day 19-20: Advanced Features & Shortcuts
- [ ] **Multi-lift operations**: Batch lift multiple messages/turns
- [ ] **Keyboard shortcuts**: Quick lens application (⌘+1, ⌘+2, etc.)
- [ ] **Lift history**: Track what content was lifted when
- [ ] **Thread organization**: Categories, favorites, search
- [ ] **Performance optimization**: Large document handling

#### Day 21-22: User Testing & Iteration
- [ ] **User acceptance testing**: 5 early users complete full workflow
- [ ] **Feedback collection**: Document pain points and suggestions
- [ ] **Bug fixes**: Address critical issues found in testing
- [ ] **UX refinement**: Polish based on user feedback  
- [ ] **Documentation**: User guides and keyboard shortcut reference

---

## Technical Dependencies & Setup

### Required Infrastructure
- **API Keys**: OpenAI GPT-4, Anthropic Claude (backup)
- **Environment variables**: Secure API key management
- **CORS configuration**: Frontend → AI API communication
- **Rate limiting**: Built-in request throttling

### Integration Points with Existing Code
- **Semantic scope**: Leverage `resolveSemanticScope` from lifting system
- **Node creation**: Use existing `createNode` for lifted content
- **Provenance system**: Extend existing provenance model
- **Toast notifications**: Use existing toast system for feedback
- **Keyboard shortcuts**: Integrate with existing shortcut system

### Performance Considerations
- **Context size**: Smart truncation for large semantic scopes
- **Streaming optimization**: Efficient real-time UI updates
- **Memory management**: Clean up old thread data
- **IndexedDB optimization**: Efficient thread/message queries

## Risk Mitigation Strategies

### Technical Risks
1. **AI API reliability**: Implement fallback providers + offline graceful degradation
2. **Context window limits**: Smart truncation algorithm + scope refinement
3. **Streaming failures**: Non-streaming fallback mode  
4. **Performance with large documents**: Lazy loading + pagination

### Implementation Risks  
1. **Scope detection accuracy**: Extensive testing with complex document structures
2. **Lens transformation quality**: Curate and test built-in lens prompts
3. **User adoption**: Make lifting frictionless with clear value demonstration
4. **Integration complexity**: Maintain clean separation between phases

## Success Validation Criteria

### Phase 1 Complete ✅
- [ ] Create thread under any heading (⌘+K)
- [ ] Thread indicator shows on headings with conversations  
- [ ] Scope context displays correctly in thread panel
- [ ] Thread persistence survives browser refresh

### Phase 2 Complete ✅  
- [ ] AI responds with relevant context from document section
- [ ] Streaming responses work smoothly without lag
- [ ] Error handling gracefully manages API failures
- [ ] Context assembly works for documents with 50+ nodes

### Phase 3 Complete ✅
- [ ] Built-in lenses transform content correctly
- [ ] Custom lens creator produces working transformations
- [ ] Lift dialog supports all content selection modes
- [ ] Lifted content maintains provenance to source thread

### Phase 4 Complete ✅
- [ ] 5 users complete thread → AI → lift → lens workflow
- [ ] Performance remains responsive with 10+ active threads  
- [ ] Keyboard shortcuts work reliably for power users
- [ ] User feedback indicates preference over traditional AI tools

---

## Post-I3 Extension Opportunities

### Advanced AI Capabilities
- **Function calling**: AI can interact with document structure
- **Multi-turn reasoning**: Complex analysis across multiple interactions  
- **Code generation**: AI assistance for technical documentation
- **Research synthesis**: Cross-reference multiple document sections

### Collaboration Features
- **Shared threads**: Team discussions on document sections
- **AI as team member**: Persistent AI participants in ongoing threads
- **Review workflows**: AI-assisted document review and feedback
- **Async collaboration**: Thread-based async team communication

### Workflow Automation
- **Lens sequences**: Chain multiple transformations automatically
- **Saved AI routines**: Reusable AI assistant configurations
- **Template generation**: AI-powered document scaffolding
- **Content quality scoring**: AI analysis of document completeness

This roadmap provides a clear, executable path from the current stable foundation to a revolutionary document-scoped AI experience. Each phase builds incrementally while delivering user value, reducing risk of over-engineering while maintaining architectural quality.