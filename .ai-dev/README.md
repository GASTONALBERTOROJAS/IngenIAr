# `.ai-dev/` Operating Convention

Use `.ai-dev/` to keep IngenIAr work traceable, reviewable, and recoverable.

## Minimum write policy

### `requirements/`
Create or update a record when:
- a new user request becomes a scoped requirement
- acceptance criteria or constraints are clarified

### `plans/`
Create a plan before meaningful implementation.

### `loops/`
Record important development/QA loops when a task required rework after validation or review.

### `decisions/`
Record architecture, runtime, configuration, or scope decisions that affect future work.

### `runs/`
Use for execution logs, run summaries, or notable command outcomes when they matter to future sessions.

### `state/`
Keep `current_state.md` updated with the latest operational reality, active limitations, and links to active backlog/QA artifacts.

### `qa/`
Every meaningful implementation pass should end with a QA record containing:
- scope validated
- checks executed
- PASS or FAIL
- blocking issues or recommendation

### `artifacts/`
Store review summaries, gap reports, remediation summaries, or other durable deliverables.

## Operating rule

If the work would be hard to recover in a future session without context, write it into `.ai-dev/`.
