# Review — Enforcement Layer Implementation

Date: 2026-04-20

## Overall status

**PASS**

## Scope reviewed

- `scripts/validate_ingeniar.py`
- `scripts/new_project.py`
- `.pre-commit-config.yaml`
- `.github/workflows/validate.yml`
- `AGENTS.md` (root)
- `CLAUDE.md` (root)
- `opencode.json` (root)
- `templates/base_project/AGENTS.md`
- `templates/base_project/CLAUDE.md`
- `.ai-dev/requirements/full_system_context.md`
- `.gitignore`
- Legacy projects retrofitted with governance layer

## Key findings

1. The validation script correctly checks root runtime files, root `.ai-dev/`, all projects under `projects/`, and the base template — with clear PASS/FAIL output.
2. The scaffolding script correctly copies the template, updates state, creates an initial requirement record, and runs the validator — confirmed working via `test-demo` (52/52 PASS).
3. Pre-commit config wires the validator as a local hook that blocks non-compliant commits.
4. GitHub Actions CI runs the same validator on push/PR with `--strict`.
5. `AGENTS.md`, `CLAUDE.md`, and `opencode.json` now explicitly reference the enforcement scripts and `.ai-dev/` write obligations.
6. Legacy projects (`BDD-Compras-Internos`, `FORECAST_ANALISIS_DECISION_MATRIX`) were retrofitted with `.ai-dev/` and `AGENTS.md` so they pass validation.
7. The non-compliant `health-check-api` project was removed.
8. Git repo was initialized with a proper `.gitignore`.

## Required fixes

- None.

## Risks

- Pre-commit hooks require `pre-commit` pip package installed and `pre-commit install` run locally — this is a one-time setup step per developer machine.
- The validator checks structural presence, not content quality — a project could have an empty `.ai-dev/qa/` and still pass. Future versions could add content-level checks.
- Legacy projects got minimal governance layer retroactively — their `.ai-dev/` trees are mostly empty placeholder.
