#!/usr/bin/env node

import fs from "fs";
import path from "path";

const INITIATIVES_DIR = path.join(process.cwd(), "docs", "INITIATIVES");

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

function createFile(filePath, content) {
  if (fs.existsSync(filePath)) {
    console.log(`Skipping existing file: ${filePath}`);
    return;
  }
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
}

function today() {
  return new Date().toISOString().split("T")[0];
}

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
- [Risk description]: [Mitigation approach]

## Progress notes
[Daily/weekly progress updates, blockers encountered, solutions found]

## Done when
[Clear completion criteria - when can we confidently say this initiative is finished]
- [Completion signal 1]  
- [Completion signal 2]
`;
}

function main() {
  const args = process.argv.slice(2);
  const nameArg = args.join(" ").trim();

  if (!nameArg) {
    console.log("Usage: npm run initiative:new <initiative-name>");
    console.log("Example: npm run initiative:new user authentication");
    process.exit(1);
  }

  ensureDir(INITIATIVES_DIR);

  const nextNum = getNextInitiativeNumber();
  const id = `I${nextNum}`;

  const folderName = `${id}-${slugify(nameArg)}`;
  const initiativePath = path.join(INITIATIVES_DIR, folderName);

  if (fs.existsSync(initiativePath)) {
    console.log(`Initiative already exists: ${folderName}`);
    process.exit(0);
  }

  fs.mkdirSync(initiativePath);

  createFile(
    path.join(initiativePath, "README.md"),
    readmeTemplate(id)
  );

  createFile(
    path.join(initiativePath, "PLAN.md"),
    planTemplate(id)
  );

  console.log(`\n🎉 Initiative created: ${folderName}`);
  console.log(`\nNext steps:`);
  console.log(`1. Edit docs/INITIATIVES/${folderName}/README.md with your initiative details`);
  console.log(`2. Break down work in docs/INITIATIVES/${folderName}/PLAN.md`);
  console.log(`3. Start implementing and track progress in the PLAN`);
}

main();