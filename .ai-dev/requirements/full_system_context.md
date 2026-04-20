
# IngenIAr — Full System Context

## Objective

IngenIAr is a complete AI Developer system built from the original OpenCode-first repository and extended to support both OpenCode and Claude Code.

## What the system must do

- transform user requests into structured requirements
- plan before implementing
- implement with specialist roles
- validate with QA before closure
- preserve project state and traceability
- support MCP-driven documentation, memory and automation

## Shared workflow

request → prompt engineering → architecture → planning → implementation → QA → close

## Runtime support

- OpenCode: `AGENTS.md`, `opencode.json`, `.opencode/skills/`
- Claude Code: `CLAUDE.md`, `.claude/agents/`

## Critical rules

- no closure without QA
- no direct coding when planning is still missing
- no silent invention of critical requirements
- prefer minimal necessary context
- new projects MUST be created using `python scripts/new_project.py`
- governance is enforced via pre-commit hooks, CI, and `scripts/validate_ingeniar.py`
- secrets must NEVER be committed — use `{env:XXX}` references in tracked files (OpenCode substitutes from system env vars)
- secret leak detection runs via `scripts/detect_secrets.py` (pre-commit hook)

## Security

- **opencode.json** uses `{env:XXX}` references instead of real values — OpenCode substitutes from system environment variables
- **System environment variables** hold real secrets — set once on your machine
- **No injection/restore cycle** — opencode.json never contains real secrets, so it's always safe to commit
- **Detection**: `scripts/detect_secrets.py` scans for leaked tokens and blocks commits
- **Full guide**: `shared/docs/security.md`

## Main integrations

- Context7 for external documentation grounding
- GitHub MCP for PR management, issues, and repo access
- PostgreSQL MCP for schema inspection and query debugging
- Brave Search MCP for web search when Context7 doesn't cover the topic
- Sequential Thinking MCP for structured complex reasoning
- Engram for optional memory continuity
- n8n for optional external workflows

MCP setup guide: `shared/docs/mcp_integration.md`

## State model

Use `.ai-dev/` for requirements, plans, loops, decisions, runs, state, QA and artifacts.
Use `memory/` for versioned long-term repo memory.
