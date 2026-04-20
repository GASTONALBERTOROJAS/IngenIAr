# Caveman Token Optimization Integration Plan

Date: 2026-04-21

## Goal

Integrate caveman (`juliusbrussee/caveman`) token optimization into IngenIAr for both Claude Code and OpenCode runtimes.

## Architecture / Approach

### Solution Overview
- Type of change: feature integration (token optimization layer)
- General approach: compose caveman rules with existing IngenIAr contract, install skills in both runtimes, install Claude Code hooks for auto-activation, compress existing .md files for input token savings

### Components
1. Caveman activation rules appended to CLAUDE.md + AGENTS.md (composed, not replacing)
2. Skills installed in both `.opencode/skills/` and `.claude/skills/` (5 skills each)
3. Compress scripts (Python) installed alongside compress skill in both runtimes
4. Template updates for new project inheritance
5. Claude Code hooks installed in `~/.claude/` (user-local, not committed)
6. Existing .md files compressed with .original.md backups

## Tasks

| # | Task | Status | Dependencies |
|---|------|--------|--------------|
| 1 | Add caveman activation rules to root CLAUDE.md | ✅ Done | None |
| 2 | Add token efficiency reference to root AGENTS.md | ✅ Done | None |
| 3 | Install caveman skills for OpenCode + Claude Code runtimes | ✅ Done | None |
| 4 | Update templates for new project inheritance | ✅ Done | 1, 3 |
| 5 | Install caveman hooks for Claude Code | ✅ Done | None |
| 6 | Compress existing .md files for input token savings | ✅ Done | 1, 2, 4 |
| 7 | Run governance validator | ✅ Done (52/52 PASS) | 1-4, 6 |
| 8 | Write QA record | ✅ Done | 7 |
| 9 | Commit and push | Pending | 8 |

## Key decisions
- Default intensity: `full` (not ultra — too terse for complex projects)
- Composition, not replacement: caveman rules appended to existing contract files
- Auto-clarity rule preserved: drops caveman for security, irreversible actions, user confused
- Boundary rule: code/commits/PRs written normally
- Hooks are user-local: other users must run install.ps1 themselves
