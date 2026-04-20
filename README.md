
# IngenIAr

IngenIAr is a complete AI Developer system built on top of the original OpenCode-first repository you provided, extended to support:

- **OpenCode** as runtime
- **Claude Code** as alternate runtime
- **multi-agent execution** with shared core behavior
- **mandatory QA before closing work**
- **structured project state** in `.ai-dev/`
- **MCP-ready architecture** for Context7, Engram and n8n

## What changed from the original base

This version keeps the original strengths:

- OpenCode skills catalog
- AGENTS.md-driven workflow
- versioned memory under `memory/`
- existing projects under `projects/`

And adds the missing layers required for IngenIAr:

- root `CLAUDE.md`
- root `opencode.json`
- root `.claude/agents/` with base agents
- root `.ai-dev/` for requirements, plans, loops, QA and artifacts
- `shared/agent_core/` as the canonical system core
- `templates/base_project/` for future projects
- QA gate policy: **no project closes without QA = OK**

## Repository layout

```text
IngenIAr/
├── .ai-dev/                # system-level state and audit trail
├── .claude/                # Claude runtime support
├── .opencode/              # OpenCode runtime support + skills
├── memory/                 # versioned long-term repo memory
├── projects/               # real projects
├── runtimes/               # runtime docs and templates
├── shared/                 # canonical core, schemas, policies, docs
├── templates/              # new project template
└── vendor/                 # reviewed external assets / future imports
```

## Runtime selection

Use **OpenCode** when you want the repo to work with `AGENTS.md`, `opencode.json`, `.opencode/skills/` and MCP through OpenCode.

Use **Claude Code** when you want project and system behavior through `CLAUDE.md`, `.claude/agents/` and future hook-based QA / audit enforcement.

The intended behavior is the same in both runtimes:

```text
request → prompt engineering → architecture → planning → implementation → QA → close
```

## Operational maturity

IngenIAr is operational as a dual-runtime AI-developer base, but its governance is enforced mainly through repository contracts, runtime prompts, starter agents, templates, and `.ai-dev/` traceability rather than external hook automation.

Current operational state:

- the canonical flow is explicit in root runtime files, the shared core, and base templates
- Prompt Engineer, Architect, Planner, Developer, QA, and Reviewer roles are represented in the active runtime assets
- meaningful work is expected to leave plan, review, and QA evidence in `.ai-dev/`
- Context7 is wired in the base config, while Engram and n8n remain optional environment-specific integrations by design

## QA gate

IngenIAr must not mark work as complete unless QA passes.

Minimum expected checks before closure:

- implementation exists and matches the request
- code or deliverable is internally coherent
- basic validation/tests have been run when applicable
- major issues are documented if they block completion

## MCP strategy

The repo uses MCP servers for external tool access. All are configured in `opencode.json`.

- **Context7**: framework/library documentation grounding — works out of the box
- **GitHub**: PR management, issues, repo access — requires `GITHUB_PERSONAL_ACCESS_TOKEN`
- **PostgreSQL**: schema inspection, query debugging — requires connection string
- **Brave Search**: web search when Context7 doesn't cover the topic — requires `BRAVE_API_KEY`
- **Sequential Thinking**: structured step-by-step reasoning — works out of the box
- **Engram**: memory continuity — optional, requires endpoint
- **n8n**: external automations — optional, requires endpoint

Setup guide: `shared/docs/mcp_integration.md`

## Notes

- Generated folders such as `node_modules/` and `.next/` were intentionally excluded from this cleaned deliverable.
- local secret files such as `.env` and `.env.local` were excluded from the deliverable.
- the original project content was kept and reorganized around the IngenIAr system.
