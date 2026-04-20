---
name: workflow
description: Full IngenIAr workflow engine — automatically enforces RICO, architecture, planning, implementation, QA, and traceability for every meaningful request
---

# IngenIAr Workflow Engine

This skill is the automatic workflow driver for IngenIAr. It activates for every meaningful user request and ensures the full canonical flow is followed from start to closure, including traceability in `.ai-dev/` and governance compliance.

## When this skill activates

- EVERY time the user makes a request that involves building, creating, modifying, or delivering something
- This includes: new projects, new features, bug fixes, refactors, API endpoints, scripts, documentation, etc.
- Does NOT activate for: simple questions, casual conversation, status checks

## Mandatory Flow (NO SHORTCUTS)

You MUST follow these phases IN ORDER. You may NOT skip a phase. You may NOT merge phases. Each phase produces a specific output before moving on.

### Phase 1 — INTERPRET & STRUCTURE (Prompt Engineer)

Before doing ANY implementation work:

1. Read the user request carefully
2. If the request is ambiguous or incomplete → ASK the user for missing critical information BEFORE proceeding
3. Structure the requirement using RICO:
   - **Role**: who is the user/developer in this context
   - **Instructions**: what specifically needs to be done
   - **Context**: what environment, constraints, or existing state applies
   - **Objective**: what success looks like
4. Present the RICO structure to the user
5. Do NOT generate code in this phase

### Phase 2 — ARCHITECT (Architect)

After RICO is structured:

1. Define the solution shape — what components, modules, or files are needed
2. Define the data flow or interaction between components
3. Choose technology ONLY when justified by the problem
4. Identify assumptions and risks
5. Present the architecture to the user
6. Do NOT generate implementation code in this phase

### Phase 3 — PLAN (Planner)

After architecture is defined:

1. Break the work into ordered, atomic tasks
2. Each task must be: clear, actionable, testable
3. Make dependencies between tasks explicit
4. Present the plan to the user
5. **WRITE the plan file to `.ai-dev/plans/` BEFORE finishing this phase** — use naming convention `YYYY-MM-DD_<task-name>-plan.md`
6. Do NOT generate code in this phase

**If the request involves creating a NEW PROJECT:**

- Task 1 in the plan MUST be: `python scripts/new_project.py <name> --description "desc"`
- You may NOT create project directories manually
- The scaffolding script creates the project from template with `.ai-dev/`, runtime files, and starter agents

### Phase 4 — IMPLEMENT (Developer)

After the plan is approved:

1. Execute tasks in order from the plan
2. Keep changes inside scope — no scope creep
3. Document notable trade-offs
4. For new projects: run `python scripts/new_project.py <name> --description "desc"` FIRST, then implement inside the created project directory
5. For existing projects: work inside the existing `projects/<name>/` directory
6. **Do NOT say "completed", "done", or "finished" — only QA + Review can close work**
7. After implementation, hand off to QA phase

### Phase 5 — QA (Quality Assurance)

After implementation is complete, the QA agent has TWO jobs:

**Job 1: Validate the work**

1. Run applicable tests and checks
2. Verify the implementation matches the request and the plan
3. If tests exist → run them
4. If the code can be loaded/parsed → verify it
5. Run `python scripts/validate_ingeniar.py` to verify governance compliance
6. Report PASS or FAIL clearly
7. If FAIL → return to Phase 4 and fix the issues
8. If PASS → proceed to Job 2

**Job 2: Write governance records (MANDATORY — not optional)**

The QA agent is responsible for writing these files before finishing:

1. **QA record** in `.ai-dev/qa/` with: date, scope validated, checks executed, PASS/FAIL, issues found, recommendation. Naming: `YYYY-MM-DD_<task-name>-qa.md`
2. **Plan file** in `.ai-dev/plans/` — if the plan agent didn't write it, write it now. Naming: `YYYY-MM-DD_<task-name>-plan.md`

**You may NOT skip writing these files.** They are mandatory for closure. If you run out of steps before writing them, the work is NOT closed.

### Phase 6 — REVIEW (Reviewer)

After QA passes:

1. Verify the final result matches the original request
2. Check for scope alignment — no out-of-scope changes
3. Check for coherence and completeness
4. Do NOT implement fixes — report issues only
5. Report PASS or NEEDS_CHANGES

### Phase 7 — CLOSE

Only after Review reports PASS:

1. Update `.ai-dev/state/current_state.md` if the project state changed
2. The work is closed

If Review reports NEEDS_CHANGES → return to Phase 4

## Traceability Rules (ALWAYS ENFORCE)

Every meaningful implementation MUST leave evidence in `.ai-dev/`:

| Artifact | Where to write | When |
|---|---|---|
| RICO / requirement | `.ai-dev/requirements/` | Phase 1 |
| Architecture | Inside the plan or as a separate artifact in `.ai-dev/artifacts/` | Phase 2 |
| Execution plan | `.ai-dev/plans/` | Phase 3 |
| QA record | `.ai-dev/qa/` | Phase 5 |
| Review record | `.ai-dev/artifacts/` | Phase 6 |

File naming convention: `YYYY-MM-DD_<descriptive-name>.md`

## Project Creation Rules (ALWAYS ENFORCE)

When the request involves creating a NEW project under `projects/`:

1. Run: `python scripts/new_project.py <name> --description "desc"`
2. Wait for the script to complete and validate
3. Then implement inside `projects/<name>/`
4. NEVER create project directories manually with mkdir/New-Item
5. NEVER create a project without `.ai-dev/`, `AGENTS.md`, and `opencode.json`

The validator (`scripts/validate_ingeniar.py`) will block commits for projects missing governance.

## Quick Reference

```
User Request
    │
    ▼
┌─────────────────────┐
│ 1. RICO Structure   │ ← Ask if ambiguous. Write to .ai-dev/requirements/
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ 2. Architecture     │ ← Define shape, components, risks. No code.
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ 3. Plan             │ ← Atomic tasks, ordered. Write to .ai-dev/plans/
│    NEW PROJECT?     │ ← If yes, Task 1 = new_project.py
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ 4. Implement        │ ← Execute plan. Stay in scope. Do NOT say "done".
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ 5. QA               │ ← Job 1: Run tests + validator.
│    Job 2: Write     │ ← Job 2: Write .ai-dev/qa/ + .ai-dev/plans/ records.
│    FAIL? → back to 4│
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ 6. Review           │ ← Coherence + completeness. Write to .ai-dev/artifacts/
│    NEEDS_CHANGES?   │ → back to 4
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ 7. Close            │ ← Only if QA PASS + Review PASS. Update state.
└─────────────────────┘
```

## Anti-Patterns (NEVER DO THESE)

- Jumping straight to code without RICO or planning
- Creating project directories manually instead of using `new_project.py`
- Saying "completed", "done", "finished", or "trabajo completado" without QA PASS + Review PASS
- Closing work without writing a QA record in `.ai-dev/qa/`
- Skipping the review phase
- Leaving `.ai-dev/` governance records unwritten because you ran out of steps
- Mixing implementation with architecture or planning phases
- Handing off governance writing to a future session instead of doing it in the QA phase
