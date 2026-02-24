# REPORT Template Guide

This is a template and guide for writing effective initiative REPORT.example.md files.

## Purpose of REPORT files

REPORT.example.md captures what actually happened during an initiative execution. It should be:
- **Factual:** Focus on what was done, decisions made, and outcomes achieved
- **Concise:** Include essential information without excessive detail  
- **Useful:** Help future readers understand the journey and current state

## Required sections

### Initiative
**What this section should contain:**
- Full initiative name and number
- Brief context if needed

**Template:**
I[N] — [Initiative Title]

### Date
**What this section should contain:**
- Date when initiative was completed
- Use YYYY-MM-DD format

### Summary
**What this section should contain:**
- High-level overview of what was accomplished
- 1-3 sentences covering major outcomes
- Should align with the initiative's original outcome statement

**Example:**
> The project was stabilized to run locally, a backend adapter seam was introduced, and Supabase Auth was connected successfully.

### Initial state
**What this section should contain:**
- Starting condition before the initiative began
- Key problems or gaps that needed to be addressed
- Context for why this work was needed

**Example:**
- Project from Figma Make export
- App did not run locally due to missing env vars
- UI relied on hardcoded mock data  
- No backend integration present

### Changes made
**What this section should contain:**
- List of meaningful changes implemented
- Focus on significant modifications, not every small tweak
- Include both code changes and configuration changes

**Example:**
- Installed missing dependencies
- Added `.env.local` configuration
- Created `src/lib/backend/adapter.ts`
- Added Supabase client setup
- Implemented session detection on app load

### Decisions
**What this section should contain:**
- Important decisions made during execution
- Key trade-offs or alternatives considered
- Architectural or approach decisions with lasting impact

**Example:**
- Use backend adapter pattern instead of direct Supabase calls
- Keep existing routing structure  
- Limit scope to auth + profiles table for this milestone

### Current system state
**What this section should contain:**
- Description of the system after initiative completion
- What now works that didn't work before
- Current capabilities and limitations

**Example:**
- App runs locally with `npm run dev`
- Supabase connected and configured
- Authentication flow works end-to-end
- Profiles table exists with basic RLS  
- Dummy data still used for feature entities

### Known issues
**What this section should contain:**
- Problems that remain unresolved
- Technical debt or temporary workarounds introduced
- Items that need attention in future work

**Example:**
- Logout redirect not implemented
- Org switching not yet supported
- RLS policies are minimal and need refinement

### Next steps
**What this section should contain:**
- Logical follow-on work
- Priority recommendations for subsequent initiatives
- Dependencies for future work

**Example:**
- Replace dummy data for Project entity
- Define Project table schema and RLS policies
- Implement read path via Supabase

### Risks
**What this section should contain:**
- Ongoing risks that future work should be aware of
- Risks introduced by this initiative
- Mitigation recommendations

## Best practices

**Writing effective summaries:**
- Focus on business value delivered, not just technical tasks completed
- Should be understandable to non-technical stakeholders
- Align with the original initiative outcome

**Documenting changes:**
- Group related changes together
- Use clear, specific language
- Focus on "what" rather than "how" (save implementation details for code comments)

**Recording decisions:**
- Capture the reasoning, not just the decision
- Note alternatives that were considered
- Help future readers understand the trade-offs

**Describing current state:**
- Be honest about what works and what doesn't
- Include both capabilities and limitations
- Help readers quickly assess the current situation

**Identifying next steps:**
- Be specific about what should happen next
- Consider dependencies and priorities
- Make it easier for follow-on initiatives to be planned

## Common mistakes to avoid

**Too much detail:**
- Don't document every small change or fix
- Focus on meaningful, lasting changes
- Save implementation details for code comments

**Missing context:**
- Don't assume future readers know the background
- Include enough context to understand why changes were made
- Explain the problem that was being solved

**Incomplete current state:**
- Don't just list what was added - describe what works now
- Include limitations and known issues
- Help readers understand what they're working with

**Vague next steps:**
- Avoid generic recommendations like "improve the system"
- Be specific about what should be done next
- Consider priority and dependencies

**Overly optimistic outcomes:**
- Be honest about what still needs work
- Don't oversell what was accomplished
- Include known issues and limitations