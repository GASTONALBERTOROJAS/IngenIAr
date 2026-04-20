# IngenIAr MCP Integration Guide

Date: 2026-04-20 (updated)

## Configured MCP Servers

| MCP | Package | What it does | Setup needed |
|---|---|---|---|
| **Context7** | remote | Framework/library documentation grounding | None — works out of the box |
| **GitHub** | `@modelcontextprotocol/server-github` | Create PRs, manage issues, read repos, reviews | Set `GITHUB_PERSONAL_ACCESS_TOKEN` system env var |
| **PostgreSQL** | `@modelcontextprotocol/server-postgres` | Query schemas, run debug queries, validate migrations | Connection string configured directly (local DB) |
| **Web Search** | `duckduckgo-mcp` | Free web search, crawl, research with AI ranking | Install bun (`irm bun.sh/install.ps1 \| iex`) then restart OpenCode |
| **Sequential Thinking** | `@modelcontextprotocol/server-sequential-thinking` | Structured step-by-step reasoning for complex problems | None — works out of the box |

## How to activate each MCP

### 1. GitHub MCP

**Set environment variable:**

```powershell
# Windows (PowerShell — persistent)
[System.Environment]::SetEnvironmentVariable('GITHUB_PERSONAL_ACCESS_TOKEN', 'ghp_YOUR_TOKEN', 'User')
```

**Get a token:**
1. Go to https://github.com/settings/tokens
2. Generate new token (classic) with scopes: `repo`, `read:org`, `read:project`
3. Copy the token and use it in the command above

**Restart OpenCode** after setting the variable.

### 2. PostgreSQL MCP

Already configured with the local connection string. No additional setup needed.

**Verify PostgreSQL is running:**

```powershell
Get-Service -Name 'postgresql*' | Select-Object Name, Status
```

**If you need to change the connection string**, edit `opencode.json` → `mcp.postgres.command` and update the connection string argument.

**Current config:**
- Host: `localhost`
- Port: `5432`
- User: `postgres`
- Database: `postgres`

### 3. Web Search (DuckDuckGo) MCP

**Requires bun** — install it first:

```powershell
# Windows (PowerShell)
irm bun.sh/install.ps1 | iex
# Restart your terminal after installation
```

No API key needed — 100% free, unlimited searches. Provides 3 tools:

| Tool | Description |
|------|-------------|
| `search` | Quick web search. Returns titles, URLs, and descriptions |
| `search_and_crawl` | Search + crawl all result pages in parallel. Get full content |
| `research` | Best for answering questions. Searches, crawls, ranks by relevance with AI scoring |

**Restart OpenCode** after installing bun.

### 4. Sequential Thinking

No setup needed — works immediately after restarting OpenCode.

## Configuration format

All MCP servers use the OpenCode standard format:

```json
{
  "type": "local",
  "command": ["npx", "-y", "package-name"],
  "enabled": true,
  "environment": {
    "SECRET_VAR": "{env:SYSTEM_ENV_VAR}"
  }
}
```

Key points:
- `command` is an **array of strings** — OpenCode spawns the process directly
- `environment` passes env vars to the MCP server process
- `{env:XXX}` substitutes from **system environment variables** — if the var is not set, it becomes empty
- No `cmd /c` wrapper needed — OpenCode handles Windows process spawning internally

## How MCP servers are used in the IngenIAr workflow

| Phase | MCP used | How |
|---|---|---|
| **Prompt Engineer** | Web Search | Research domain context when the request is unclear |
| **Architect** | Context7, Web Search | Look up framework docs and best practices |
| **Planner** | — | No MCP needed |
| **Developer** | Context7, GitHub, PostgreSQL | Look up API docs, create PRs, verify schemas |
| **QA** | PostgreSQL, GitHub | Run validation queries, check PR status |
| **Review** | GitHub | Verify PR completeness |

## Disabling an MCP

Set `"enabled": false` in `opencode.json` for any MCP you don't want active:

```json
"web-search": {
  "enabled": false
}
```

## Troubleshooting

### Web Search MCP error "Connection closed" or "bun not found"

1. Install bun: `irm bun.sh/install.ps1 | iex`
2. Restart your terminal/editor
3. Verify: `bun --version`
4. Restart OpenCode

### PostgreSQL MCP fails to connect

1. Check PostgreSQL is running: `Get-Service -Name 'postgresql*'`
2. Verify the connection string in opencode.json is correct
3. Test with psql: `$env:PGPASSWORD="YOUR_PASSWORD"; & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "SELECT 1;"`
4. Restart OpenCode

### GitHub MCP returns authentication errors

1. Verify token env var: `echo $env:GITHUB_PERSONAL_ACCESS_TOKEN`
2. Check token validity at https://github.com/settings/tokens
3. Ensure scopes include `repo`, `read:org`
4. Restart OpenCode — env vars are read at startup

### MCP server shows as unavailable in OpenCode

1. Verify env vars are set (OpenCode reads them at startup)
2. Restart OpenCode completely
3. Check opencode.json syntax is valid JSON
4. Try running the MCP command manually: `npx -y duckduckgo-mcp`

## Future MCP candidates (not yet configured)

| MCP | When to add it |
|---|---|
| **Tavily** (`tavily-mcp`) | When you want higher-quality search results (free tier: 1000 queries/month, requires API key) |
| **Puppeteer** (`@modelcontextprotocol/server-puppeteer`) | When you need the AI to visually test web apps |
| **Docker** (`@modelcontextprotocol/server-docker`) | When you need the AI to manage containers |
| **Engram** | When you have the Engram MCP endpoint configured |
