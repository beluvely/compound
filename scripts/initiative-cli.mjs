#!/usr/bin/env node

import fs from "fs";
import path from "path";

const INITIATIVES_DIR = path.join(process.cwd(), "docs", "INITIATIVES");
const DOCS_DIR = path.join(process.cwd(), "docs");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function getNextInitiativeNumber() {
  if (!fs.existsSync(INITIATIVES_DIR)) return 0;

  const dirs = fs.readdirSync(INITIATIVES_DIR);

  const nums = dirs
    .filter((d) => /^I\d+/.test(d))
    .map((d) => parseInt(d.slice(1)))
    .filter((n) => !isNaN(n));

  return nums.length ? Math.max(...nums) + 1 : 0;
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function slugifyUpper(name) {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

function createFile(filePath, content) {
  if (fs.existsSync(filePath)) {
    console.log(`Skipping existing file: ${path.relative(process.cwd(), filePath)}`);
    return false;
  }
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${path.relative(process.cwd(), filePath)}`);
  return true;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function parseArguments(args) {
  const flags = {};
  const positional = [];
  const DOC_TYPES = ['sot', 'prd', 'architecture', 'prompt', 'spike', 'report'];
  
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const flag = args[i].substring(2);
      if (i + 1 >= args.length || args[i + 1].startsWith('--')) {
        flags[flag] = true;
      } else {
        flags[flag] = args[i + 1];
        i++;
      }
    } else {
      positional.push(args[i]);
    }
  }
  
  // Convert positional doc types to flags for backward compatibility
  // e.g., "add sot" or "add i9 prompt 'name'" 
  for (let i = 0; i < positional.length; i++) {
    const arg = positional[i].toLowerCase();
    if (DOC_TYPES.includes(arg)) {
      // Check if next arg is a name/value
      const hasName = i + 1 < positional.length && !DOC_TYPES.includes(positional[i + 1].toLowerCase());
      if (hasName) {
        flags[arg] = positional[i + 1];
        positional.splice(i, 2); // Remove both doc type and name
        i--; // Adjust index after splice
      } else {
        flags[arg] = true;
        positional.splice(i, 1); // Remove doc type
        i--; // Adjust index after splice
      }
    }
  }
  
  return { flags, positional };
}

function findInitiativePath(initiativeId) {
  if (!fs.existsSync(INITIATIVES_DIR)) {
    console.log(`No initiatives directory found at: ${INITIATIVES_DIR}`);
    return null;
  }

  const dirs = fs.readdirSync(INITIATIVES_DIR);
  const targetId = initiativeId.toLowerCase().replace(/^i/, '');
  
  const matchingDir = dirs.find(dir => {
    const match = dir.match(/^I(\d+)/);
    return match && match[1] === targetId;
  });

  if (!matchingDir) {
    console.log(`Initiative ${initiativeId} not found. Available initiatives:`);
    dirs.filter(d => /^I\d+/.test(d)).forEach(d => console.log(`  ${d}`));
    return null;
  }

  return path.join(INITIATIVES_DIR, matchingDir);
}

// === TEMPLATES === //

function readmeTemplate(id) {
  return `# ${id} — [Initiative Name]

## Outcome
[Clear statement of what this initiative will deliver - the end state after completion]

## Scope
[What is included in this initiative]
- [Deliverable 1]
- [Deliverable 2]
- [Deliverable 3]

## Non-scope
[What is explicitly not included]
- [Thing we're not doing]
- [Feature deferred to later]

## Acceptance criteria
[Specific, measurable criteria that must be met for this initiative to be considered complete]
- [ ] [Criterion 1 - specific and testable]
- [ ] [Criterion 2 - specific and testable]  
- [ ] [Criterion 3 - specific and testable]
`;
}

function planTemplate(id) {
  return `# ${id} Plan

## Tasks
- [ ] [Specific implementation task 1]
- [ ] [Specific implementation task 2]
- [ ] [Specific implementation task 3]
- [ ] [Testing/validation task]
- [ ] [Documentation task]

## Decisions
[Record key technical and product decisions made during implementation]
- [Decision topic]: [Decision made and reasoning]

## Risks
[Identified risks and mitigation strategies]
- [Risk description]: [Mitigation approach]

## Progress notes
[Daily/weekly progress updates, blockers encountered, solutions found]

## Done when
[Clear completion criteria - when can we confidently say this initiative is finished]
- [Completion signal 1]  
- [Completion signal 2]
`;
}

function sotTemplate() {
  return `# Product Source of Truth (SOT)

**Last Updated:** ${today()}

## Product Vision

[One paragraph describing what this product will become and why it matters]

## Current Status

- **Stage:** [Planning / MVP / Beta / Production]
- **Version:** [0.1.0 / etc]
- **Users:** [0 / X active users]

## Core Features

### Feature 1: [Feature Name]
**Status:** [Not Started / In Progress / Completed]  
**Priority:** [High / Medium / Low]

[Brief description of what this feature does and why it exists]

## Tech Stack

- **Frontend:** [React, Vue, etc]
- **Backend:** [Node.js, Python, etc]
- **Database:** [PostgreSQL, MongoDB, etc]
- **Infrastructure:** [AWS, Vercel, etc]

## User Types

### [User Type 1]
- **Who they are:** [Description]
- **What they need:** [Core needs]
- **How we serve them:** [Our approach]

## Success Metrics

- **North Star Metric:** [The one metric that matters most]
- **Supporting Metrics:**
  - [Metric 1]: [Target]
  - [Metric 2]: [Target]

## Open Questions

- [ ] [Question that needs answering]

## Decisions Log

### ${today()} - [Decision Topic]
**Decision:** [What was decided]  
**Reasoning:** [Why this was the right choice]  
**Impact:** [What this affects]

---

*This is a living document. Update it as the product evolves.*
`;
}

function architectureTemplate() {
  return `# Architecture

**Last Updated:** ${today()}

## Overview

[High-level description of the system architecture and design philosophy]

## System Components

### Frontend
- **Technology:** [React, Vue, etc]
- **Key Responsibilities:**
  - [Responsibility 1]
  - [Responsibility 2]

### Backend
- **Technology:** [Node.js, Python, etc]
- **Key Responsibilities:**
  - [Responsibility 1]
  - [Responsibility 2]

### Database
- **Technology:** [PostgreSQL, MongoDB, etc]
- **Schema Design:**
  - [Key tables/collections and their purpose]

## Key Design Decisions

### Decision 1: [Topic]
**Choice:** [What we chose]  
**Alternatives Considered:** [What we didn't choose]  
**Reasoning:** [Why this was the right choice]  
**Tradeoffs:** [What we gave up]

## Data Flow

\`\`\`
[User Action] → [Frontend] → [API] → [Service Layer] → [Database]
\`\`\`

## Security Considerations

- **Authentication:** [Approach to auth]
- **Authorization:** [Role/permission system]
- **Data Protection:** [How sensitive data is handled]

## Performance Considerations

- **Caching Strategy:** [What and how we cache]
- **Database Optimization:** [Indexes, query optimization]

## Deployment Architecture

- **Environment:** [AWS, Vercel, etc]
- **CI/CD:** [Deployment pipeline]
- **Monitoring:** [How we track system health]

## Technical Debt & Future Improvements

- [ ] [Known issue or improvement needed]

---

*This document should be updated whenever significant architectural changes are made.*
`;
}

function prdTemplate() {
  return `# Product Requirements Document (PRD)

**Last Updated:** ${today()}  
**Status:** [Draft / In Review / Approved]  
**Owner:** [Product Owner Name]

## Problem Statement

[What problem are we solving? Why does this matter?]

### User Pain Points
- [Pain point 1]
- [Pain point 2]

## Goals & Success Criteria

### Primary Goal
[The main objective this product aims to achieve]

### Success Metrics
- **Metric 1:** [Target value]
- **Metric 2:** [Target value]

### Non-Goals
[What we explicitly are NOT trying to do in this version]

## Target Users

### Primary User Persona
- **Who:** [Description of the user]
- **Needs:** [What they need to accomplish]
- **Current Solution:** [How they solve this today]
- **Frustrations:** [What doesn't work well]

## Requirements

### Must Have (P0)
- [ ] [Critical feature 1]
- [ ] [Critical feature 2]

### Should Have (P1)
- [ ] [Important feature 1]
- [ ] [Important feature 2]

### Nice to Have (P2)
- [ ] [Optional feature 1]

## User Stories

### Story 1: [Title]
**As a** [user type]  
**I want to** [action]  
**So that** [benefit]

**Acceptance Criteria:**
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Technical Considerations

- **Performance:** [Any performance requirements]
- **Security:** [Security requirements]
- **Scalability:** [Expected scale and growth]

## Timeline & Milestones

- **[Date]:** [Milestone 1]
- **[Date]:** [Launch date]

## Open Questions

- [ ] [Question that needs answering]

---

*This PRD should be reviewed and updated throughout the development process.*
`;
}

function promptTemplate(name, context) {
  return `# PROMPT: ${name}

**Context**: ${context}  
**Created**: ${today()}

## System Prompt
\`\`\`
You are a [role description] working on [specific task].

Your objective is to [clear goal].

Guidelines:
- [Specific instruction 1]
- [Specific instruction 2]  

Output format:
[Describe expected output format]
\`\`\`

## Usage Notes
- When to use this prompt
- What to expect from responses

## Examples
[Include example usage if helpful]
`;
}

function spikeTemplate(name, context) {
  return `# SPIKE: ${name}

**Context**: ${context}  
**Created**: ${today()}  
**Time Box**: [Duration, e.g., 2-4 hours]

## Investigation Goal
What specific question or technical uncertainty are we trying to resolve?

## Success Criteria
- [ ] Question answered with evidence
- [ ] Recommendation documented 
- [ ] Implementation approach identified

## Research Questions
1. [Specific question 1]
2. [Specific question 2]

## Investigation Plan
- [ ] Research approach 1
- [ ] Research approach 2
- [ ] Document findings

## Findings
[Document findings here as you research]

## Recommendation
[Clear recommendation based on findings]

## Next Steps
[What actions should be taken based on this spike]
`;
}

function reportTemplate(name, context) {
  return `# REPORT: ${name}

**Context**: ${context}  
**Created**: ${today()}  
**Author**: [Name]

## Executive Summary
Brief overview of key findings and recommendations.

## Background
Context and motivation for this report.

## Key Findings
1. **Finding 1**: Description and evidence
2. **Finding 2**: Description and evidence

## Recommendations
1. **Recommendation 1**: Action and rationale
2. **Recommendation 2**: Action and rationale

## Next Steps
- [ ] Action item 1
- [ ] Action item 2
`;
}

// === COMMANDS === //

function createNewInitiative(name, flags) {
  ensureDir(INITIATIVES_DIR);

  const nextNum = getNextInitiativeNumber();
  const id = `I${nextNum}`;
  const folderName = `${id}-${slugify(name)}`;
  const initiativePath = path.join(INITIATIVES_DIR, folderName);

  if (fs.existsSync(initiativePath)) {
    console.log(`Initiative already exists: ${folderName}`);
    return;
  }

  fs.mkdirSync(initiativePath);
  createFile(path.join(initiativePath, "README.md"), readmeTemplate(id));
  createFile(path.join(initiativePath, "PLAN.md"), planTemplate(id));

  let documentsCreated = 2; // README + PLAN

  // Add optional docs
  if (flags.prompt) {
    const promptName = flags.prompt === true ? 'PROMPT' : flags.prompt;
    if (createFile(
      path.join(initiativePath, `PROMPT_${slugifyUpper(promptName)}.md`),
      promptTemplate(promptName, folderName)
    )) documentsCreated++;
  }

  if (flags.spike) {
    const spikeName = flags.spike === true ? 'SPIKE' : flags.spike;
    if (createFile(
      path.join(initiativePath, `SPIKE_${slugifyUpper(spikeName)}.md`),
      spikeTemplate(spikeName, folderName)
    )) documentsCreated++;
  }

  if (flags.report) {
    const reportName = flags.report === true ? 'REPORT' : flags.report;
    if (createFile(
      path.join(initiativePath, `REPORT_${slugifyUpper(reportName)}.md`),
      reportTemplate(reportName, folderName)
    )) documentsCreated++;
  }

  console.log(`\n🎉 Initiative created: ${folderName}`);
  console.log(`   Created ${documentsCreated} document(s)`);
  console.log(`\nNext steps:`);
  console.log(`  Edit docs/INITIATIVES/${folderName}/README.md with initiative details`);
  console.log(`  Track work in docs/INITIATIVES/${folderName}/PLAN.md`);
}

function addToDocsOrInitiative(targetId, flags) {
  let targetPath;
  let context;
  
  // If no targetId or targetId looks like a flag, add to /docs
  if (!targetId || targetId.startsWith('--')) {
    // Adding to /docs root
    ensureDir(DOCS_DIR);
    targetPath = DOCS_DIR;
    context = "docs";
    
    // If targetId was actually a flag, push it back
    if (targetId && targetId.startsWith('--')) {
      const flagName = targetId.substring(2);
      if (!flags[flagName]) {
        flags[flagName] = true;
      }
    }
  } else {
    // Adding to specific initiative
    targetPath = findInitiativePath(targetId);
    if (!targetPath) return;
    context = path.basename(targetPath);
  }

  let documentsCreated = 0;

  // Core docs (only for /docs root)
  if (context === "docs") {
    if (flags.sot) {
      if (createFile(path.join(targetPath, "PRODUCT_SOT.md"), sotTemplate())) {
        documentsCreated++;
      }
    }

    if (flags.architecture) {
      if (createFile(path.join(targetPath, "ARCHITECTURE.md"), architectureTemplate())) {
        documentsCreated++;
      }
    }

    if (flags.prd) {
      if (createFile(path.join(targetPath, "PRD.md"), prdTemplate())) {
        documentsCreated++;
      }
    }
  }

  // Initiative docs (for both /docs and initiative folders)
  if (flags.prompt) {
    const promptName = flags.prompt === true ? 'PROMPT' : flags.prompt;
    if (createFile(
      path.join(targetPath, `PROMPT_${slugifyUpper(promptName)}.md`),
      promptTemplate(promptName, context)
    )) documentsCreated++;
  }

  if (flags.spike) {
    const spikeName = flags.spike === true ? 'SPIKE' : flags.spike;
    if (createFile(
      path.join(targetPath, `SPIKE_${slugifyUpper(spikeName)}.md`),
      spikeTemplate(spikeName, context)
    )) documentsCreated++;
  }

  if (flags.report) {
    const reportName = flags.report === true ? 'REPORT' : flags.report;
    if (createFile(
      path.join(targetPath, `REPORT_${slugifyUpper(reportName)}.md`),
      reportTemplate(reportName, context)
    )) documentsCreated++;
  }

  if (documentsCreated === 0) {
    console.log('No valid document type provided. Available options:');
    if (context === "docs") {
      console.log('  sot               Add Product SOT');
      console.log('  architecture      Add Architecture doc');
      console.log('  prd               Add PRD');
    }
    console.log('  prompt [name]     Add prompt document');
    console.log('  spike [name]      Add spike document');
    console.log('  report [name]     Add report document');
    console.log('\nExamples:');
    console.log('  ./scripts/initiative-cli.mjs add sot');
    console.log('  npm run i:add -- sot');
    return;
  }

  console.log(`\n✅ Added ${documentsCreated} document(s) to ${context === "docs" ? "docs/" : context}`);
}

function showHelp(command) {
  if (command === 'new') {
    console.log(`Usage: ./scripts/initiative-cli.mjs new <name> [doc] [doc-name]
       npm run i:new "Initiative Name" [doc] [doc-name]

Create a new initiative with optional additional documents.

Document types:
  prompt [name]     Add prompt document
  spike [name]      Add spike document  
  report [name]     Add report document

Examples:
  ./scripts/initiative-cli.mjs new "User Authentication"
  ./scripts/initiative-cli.mjs new "API Design" prompt "Performance Analysis"
  npm run i:new "Frontend Refactor" spike report
`);
  } else if (command === 'add') {
    console.log(`Usage: ./scripts/initiative-cli.mjs add [initiative] <doc-type> [doc-name]
       npm run i:add [initiative] -- <doc-type> [doc-name]

Add documents to /docs root or to a specific initiative.

Arguments:
  initiative         Initiative ID (e.g., i9, I9, 9) - Optional, defaults to /docs

Document types (for /docs root):
  sot                Add Product SOT
  architecture       Add Architecture doc
  prd                Add PRD

Document types (for any location):
  prompt [name]      Add prompt document
  spike [name]       Add spike document
  report [name]      Add report document

Examples:
  ./scripts/initiative-cli.mjs add sot                     # Add SOT to docs/
  ./scripts/initiative-cli.mjs add architecture prd        # Add multiple to docs/
  ./scripts/initiative-cli.mjs add i9 prompt "Analysis"    # Add to initiative I9
  
  npm run i:add -- sot                                     # npm syntax
  npm run i:add i9 -- prompt "Analysis"                    # npm syntax with initiative
`);
  } else {
    console.log(`Initiative CLI

Commands:
  i:new <name> [doc-types]          Create new initiative
  i:add [initiative] <doc-types>    Add documents to docs/ or initiative

For detailed help:
  ./scripts/initiative-cli.mjs new --help
  ./scripts/initiative-cli.mjs add --help
  
  npm run i:new -- --help
  npm run i:add --
For detailed help:
  npm run i:new --help
  npm run i:add --help
`);
  }
}

function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    showHelp();
    return;
  }

  const { flags, positional } = parseArguments(args.slice(1));

  if (flags.help || flags.h) {
    showHelp(command);
    return;
  }

  if (command === 'new') {
    const name = positional.join(' ').trim();
    if (!name) {
      console.log('Error: Initiative name is required');
      console.log('Usage: npm run i:new <name> [flags]');
      return;
    }
    createNewInitiative(name, flags);
  } else if (command === 'add') {
    // First positional might be initiative ID or might be missing
    const targetId = positional[0];
    addToDocsOrInitiative(targetId, flags);
  } else {
    console.log(`Unknown command: ${command}`);
    showHelp();
  }
}

main();
