# IngenIAr — Security Guide

## Overview

This document describes how IngenIAr handles secrets and sensitive configuration to prevent accidental leaks when pushing to GitHub or any remote repository.

## Architecture

IngenIAr uses **environment variable substitution** — the `{env:XXX}` syntax supported by OpenCode:

```
Tracked files (git)              System environment
─────────────────              ───────────────────
opencode.json                   Windows User Env Vars
  {env:GITHUB_TOKEN}  ◄────────  GITHUB_PERSONAL_ACCESS_TOKEN=ghp_real...
  {env:POSTGRES_CONN} ◄────────  POSTGRES_CONNECTION_STRING=postgresql://...
  {env:BRAVE_API_KEY} ◄────────  BRAVE_API_KEY=BSA_real...

┌──────────────────────────────────┐
│ OpenCode reads {env:XXX} and    │
│ substitutes from system env vars │
│ before launching MCP servers     │
└──────────────────────────────────┘
```

- **opencode.json** is tracked in git but contains only `{env:XXX}` references — **no real secrets**
- **System environment variables** hold the real values — set once, persist across sessions
- **scripts/detect_secrets.py** scans for leaked tokens and blocks commits (safety net)
- **No injection/restore cycle needed** — opencode.json never contains real secrets, so no `git checkout` before committing

## Setup (first time)

After cloning the repository, set the required environment variables:

### Windows (PowerShell — persistent, user-level)

```powershell
# GitHub Personal Access Token
[System.Environment]::SetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN', 'ghp_YOUR_TOKEN', 'User')

# PostgreSQL connection string
[System.Environment]::SetEnvironmentVariable('POSTGRES_CONNECTION_STRING', 'postgresql://postgres:YOUR_PASSWORD@localhost:5432/postgres', 'User')

# Brave Search API key (optional — only if you have one)
[System.Environment]::SetEnvironmentVariable('BRAVE_API_KEY', 'YOUR_KEY', 'User')
```

### Linux/macOS (bash — persistent)

```bash
# Add to ~/.bashrc or ~/.zshrc
export GITHUB_PERSONAL_ACCESS_TOKEN="ghp_YOUR_TOKEN"
export POSTGRES_CONNECTION_STRING="postgresql://postgres:YOUR_PASSWORD@localhost:5432/postgres"
export BRAVE_API_KEY="YOUR_KEY"
```

### Verify

```bash
# Check that the variables are set
echo $env:GITHUB_PERSONAL_ACCESS_TOKEN       # Windows
echo $GITHUB_PERSONAL_ACCESS_TOKEN            # Linux/macOS
```

**Important**: After setting environment variables, **restart OpenCode** so it picks up the new values.

## Secrets managed

| Secret | opencode.json reference | System env var |
|--------|------------------------|----------------|
| GitHub PAT | `{env:GITHUB_PERSONAL_ACCESS_TOKEN}` | `GITHUB_PERSONAL_ACCESS_TOKEN` |
| PostgreSQL connection string | `{env:POSTGRES_CONNECTION_STRING}` | `POSTGRES_CONNECTION_STRING` |
| Brave Search API key | `{env:BRAVE_API_KEY}` | `BRAVE_API_KEY` |

## No commit cycle needed

Unlike a placeholder-injection model, the `{env:XXX}` approach means:

- `opencode.json` **never contains real secrets** — safe to commit at any time
- No `setup_secrets.py` injection step before using OpenCode
- No `git checkout -- opencode.json` before committing
- The pre-commit hook (`detect_secrets.py`) is a safety net, not the primary defense

## Legacy: .env.secrets (still supported)

For users who prefer file-based secrets, `.env.secrets` is still available:

```bash
# Create from template
cp .env.secrets.example .env.secrets
# Edit with real values
notepad .env.secrets
# Inject into opencode.json
python scripts/setup_secrets.py
# Before committing, restore placeholders
git checkout -- opencode.json
```

**Recommended**: Use system environment variables instead — simpler and safer.

## Automated protection

### Pre-commit hook

The `ingeniar-detect-secrets` hook runs `scripts/detect_secrets.py` before every commit. If it detects:

- GitHub tokens (`ghp_*`, `github_pat_*`)
- Database passwords in connection strings
- AWS keys, Slack tokens, private keys
- Generic API key patterns

...the commit is **blocked**.

### CI pipeline

The GitHub Actions workflow (`.github/workflows/validate.yml`) can optionally include secret detection for PRs.

### Manual scan

```bash
# Scan the whole repo
python scripts/detect_secrets.py

# Scan a specific file
python scripts/detect_secrets.py --path opencode.json

# Strict mode (all findings are failures)
python scripts/detect_secrets.py --strict
```

## Project-level secrets

Individual projects under `projects/` may have their own `.env.example` files with placeholder values. These are safe to commit because they use obvious placeholder strings like `your_password`, `YOUR_PASSWORD`, etc.

**Rules for project .env files:**
- `.env.example` — tracked, contains placeholders only (SAFE)
- `.env.local` — gitignored, contains real values (SAFE via .gitignore)
- `.env` — gitignored, contains real values (SAFE via .gitignore)
- `.env.production` — gitignored, contains real values (SAFE via .gitignore)

## Adding new secrets

If you need to add a new MCP server or configuration that requires a secret:

1. Use `{env:YOUR_VAR_NAME}` in `opencode.json` (in `environment` object or `command` array)
2. Set the environment variable on your system
3. If the secret is a token pattern, add a detection rule in `scripts/detect_secrets.py` → `SECRET_PATTERNS`
4. Restart OpenCode

## Security checklist before pushing to GitHub

- [ ] `opencode.json` contains `{env:XXX}` references (no real tokens)
- [ ] `python scripts/detect_secrets.py` returns clean
- [ ] System environment variables are set (OpenCode can read them)
- [ ] `git status` does not show `.env.secrets` or any `.env` without `.example`
- [ ] Project `.env.example` files contain only placeholder values
