# 🤖 Agent-Powered Development Guide

This project is set up to work seamlessly with AI development agents and the `core` CLI intelligence system.

## 📋 Planning Documents Structure

Your project includes three key planning documents that agents can parse and use:

### 1. **docs/PRD.md** - Product Requirements Document  
- Define user stories, functional requirements, tech preferences
- Structured for automatic feature extraction and tech stack detection
- **Usage**: `core create project --parse-prd docs/PRD.md`

### 2. **docs/ARCHITECTURE.md** - Technical Architecture
- Specify exact tech stack: frameworks, databases, deployment platforms
- List environment variables and external API requirements  
- **Usage**: `core create project --parse-architecture docs/ARCHITECTURE.md`

### 3. **docs/PRODUCT_SOT.md** - Single Source of Truth
- Product vision, goals, success metrics, strategic priorities
- Converts strategic phases into actionable initiative structures
- **Usage**: `core create project --parse-sot docs/PRODUCT_SOT.md`

---

## 🚀 Intelligent Project Creation Workflow

### Starting Fresh (Recommended)
If you're creating a new project with existing planning documents:

```bash
# Create intelligent project from your planning docs
core create my-new-project \
  --parse-prd path/to/PRD.md \\
  --parse-architecture path/to/ARCHITECTURE.md \\
  --parse-sot path/to/PRODUCT_SOT.md

# The CLI will:
# ✅ Auto-detect optimal tech stack from ARCHITECTURE.md
# ✅ Extract user stories and features from PRD.md
# ✅ Generate strategic initiatives from PRODUCT_SOT.md
# ✅ Create contextual .env.example with detected variables
# ✅ Set up complete development environment
```

### Enhancing Existing Project
If you already have a project and want to add intelligent structure:

```bash
# Add intelligence to current project (Phase 3 - coming soon)
core --docs --parse-architecture docs/ARCHITECTURE.md

# This will:
# ✅ Analyze your existing codebase
# ✅ Generate appropriate documentation
# ✅ Create I00 investigation initiative
# ✅ Suggest improvements based on detected patterns
```

---

## 🔧 Agent Collaboration Patterns

### 1. **Planning Phase**
```
Agent: "I need to understand the product requirements"
You: "Review docs/PRD.md and docs/PRODUCT_SOT.md for full context"

Agent: "What's the technical architecture?"  
You: "Check docs/ARCHITECTURE.md for all tech stack decisions"
```

### 2. **Development Phase**
```
Agent: "What should I build first?"
You: "Check docs/INITIATIVES/ - start with I0_START_HERE"

Agent: "What are the environment requirements?"
You: "See .env.example - all variables are documented there"
```

### 3. **Feature Implementation**
```
Agent: "What are the acceptance criteria?"
You: "Each feature in the generated initiatives has specific acceptance criteria"

Agent: "How should I structure the components?"
You: "Follow the architecture patterns in docs/ARCHITECTURE.md"
```

---

## 📊 Initiative Management

Your project uses the core initiative system for task management:

### Create New Initiatives
```bash
npm run i:new "Feature Name" --tags

npm run i:add i1 --milestone "Feature Complete"  
npm run i:add i1 --spike "Technical Investigation"
npm run i:add i1 --report "Implementation Results"
```

### Track Progress
- **README.md** in each initiative: High-level overview and success criteria
- **PLAN.md** in each initiative: Detailed implementation plan with milestones
- **M#_MILESTONE_NAME.md**: Specific milestone tracking

---

## 🎯 Success Metrics Integration

Your planning documents define success metrics that should guide development:

1. **Product Metrics** (from PRODUCT_SOT.md): User engagement, business impact  
2. **Technical Metrics** (from ARCHITECTURE.md): Performance, reliability
3. **Feature Metrics** (from PRD.md): Acceptance criteria, user story completion

**Agent Integration**: Reference these metrics when making implementation decisions or validating feature completeness.

---

## 🔄 Document Evolution Workflow

As your projects evolves:

### 1. **Update Planning Documents**
- Modify docs/PRD.md when requirements change
- Update docs/ARCHITECTURE.md when making tech decisions
- Evolve docs/PRODUCT_SOT.md as product strategy shifts

### 2. **Regenerate Intelligence** (Future)
```bash
# Re-analyze updated documents and suggest changes
core --analyze --parse-all docs/

# This will suggest:
# - New initiatives based on updated roadmaps
# - Tech stack changes based on new architecture decisions  
# - Environment updates based on new integrations
```

### 3. **Sync with Development**
- Share updated documents with your development agent
- Use the generated initiatives to break down new work
- Reference success metrics to validate changes

---

## 🛠️ CLI Commands Reference

### Project Creation
```bash
# Basic project (uses templates)
core create project-name

# Intelligent project (parses documents)  
core create project-name --parse-prd PRD.md --parse-architecture ARCH.md

# Preview before creation
core create project-name --dry-run --parse-prd PRD.md
```

### Initiative Management  
```bash
# Create new initiative
npm run i:new "Initiative Name" --prompt --spike

# Add to existing initiative
npm run i:add i1 --milestone "Milestone Name"
npm run i:add i2 --report "Analysis Results"
```

### Project Analysis (Phase 3)
```bash
# Analyze existing codebase (coming soon)
core --docs --investigate
core --analyze --parse-architecture docs/ARCHITECTURE.md
```

---

## 💡 Best Practices

### For Agent Collaboration
1. **Always share planning documents first** before asking for implementation
2. **Reference specific sections** when asking questions ("see ARCHITECTURE.md tech stack")
3. **Use initiative structure** for breaking down complex features
4. **Update documents** when requirements or decisions change

### For Documentation
1. **Be specific with tech choices** (use exact package names in ARCHITECTURE.md)
2. **Write clear user stories** (follow "As a X, I want Y, so that Z" format)
3. **Define measurable success metrics** (numbers, percentages, specific outcomes)
4. **Structure roadmaps as phases** for automatic initiative generation

### For Development
1. **Follow generated project structure** - it's optimized for your requirements
2. **Use .env.example** as your configuration guide
3. **Reference initiative acceptance criteria** for definition of done
4. **Update planning docs** as you learn and requirements evolve

---

## 🎉 Getting Started

1. **Fill out your planning documents** (PRD.md, ARCHITECTURE.md, PRODUCT_SOT.md)
2. **Share them with your development agent** for full context  
3. **Use the generated initiative structure** to break down work
4. **Reference success metrics** to validate implementation decisions
5. **Update documents** as your project evolves

**Questions?** The core CLI and planning documents work together to create an intelligent, agent-friendly development environment. Update the documents as needed and regenerate project intelligence when requirements change.