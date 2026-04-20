#!/usr/bin/env python3
"""
IngenIAr Repository Validator

Validates that the IngenIAr repository and all projects comply with
the governance rules defined in AGENTS.md:

  1. Root runtime files exist and are valid
  2. Root .ai-dev/ structure is intact
  3. Every project under projects/ has .ai-dev/ and runtime files
  4. No project is missing its governance layer

Usage:
  python scripts/validate_ingeniar.py [--fix] [--strict]

Exit codes:
  0 = all checks pass
  1 = one or more checks fail
"""

import json
import sys
import argparse
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

ROOT_RUNTIME_FILES = [
    "AGENTS.md",
    "CLAUDE.md",
    "opencode.json",
    "shared/agent_core/core.md",
]

ROOT_AIDEV_SUBFOLDERS = [
    "requirements",
    "plans",
    "loops",
    "decisions",
    "runs",
    "state",
    "qa",
    "artifacts",
]

PROJECT_RUNTIME_REQUIRED = [
    # At least one of these must exist per project
    ["AGENTS.md"],
    ["CLAUDE.md"],
    ["opencode.json"],
]

PROJECT_AIDEV_SUBFOLDERS = [
    "requirements",
    "plans",
    "state",
    "qa",
    "artifacts",
]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _repo_root() -> Path:
    """Find the repository root by walking up from this script."""
    here = Path(__file__).resolve().parent
    for parent in [here, *here.parents]:
        if (parent / "AGENTS.md").is_file() and (parent / "opencode.json").is_file():
            return parent
    # Fallback: assume the script is in scripts/ under the repo root
    return here.parent


def _print_result(name: str, passed: bool, detail: str = "") -> None:
    icon = "PASS" if passed else "FAIL"
    suffix = f"  ({detail})" if detail else ""
    print(f"  [{icon}] {name}{suffix}")


# ---------------------------------------------------------------------------
# Checks
# ---------------------------------------------------------------------------

class CheckResult:
    def __init__(self, name: str, passed: bool, detail: str = ""):
        self.name = name
        self.passed = passed
        self.detail = detail


def check_root_runtime(root: Path) -> list[CheckResult]:
    """Verify root runtime contract files exist and are valid."""
    results = []

    for f in ROOT_RUNTIME_FILES:
        p = root / f
        exists = p.is_file()
        results.append(CheckResult(
            f"root/{f} exists",
            exists,
            "" if exists else "missing",
        ))

    # Validate opencode.json syntax
    json_path = root / "opencode.json"
    if json_path.is_file():
        try:
            with open(json_path, encoding="utf-8") as fh:
                data = json.load(fh)
            has_instructions = "instructions" in data and len(data["instructions"]) > 0
            results.append(CheckResult(
                "root/opencode.json has instructions",
                has_instructions,
                f"{len(data.get('instructions', []))} instruction(s)" if has_instructions else "empty or missing",
            ))
            has_agents = "agent" in data and len(data["agent"]) > 0
            results.append(CheckResult(
                "root/opencode.json has agents",
                has_agents,
                f"{len(data.get('agent', {}))} agent(s)" if has_agents else "empty or missing",
            ))
        except json.JSONDecodeError as e:
            results.append(CheckResult(
                "root/opencode.json valid JSON",
                False,
                str(e),
            ))
    else:
        results.append(CheckResult(
            "root/opencode.json valid JSON",
            False,
            "file not found",
        ))

    return results


def check_root_aidev(root: Path) -> list[CheckResult]:
    """Verify root .ai-dev/ structure."""
    results = []
    aidev = root / ".ai-dev"

    results.append(CheckResult(
        "root/.ai-dev/ exists",
        aidev.is_dir(),
        "" if aidev.is_dir() else "missing",
    ))

    if aidev.is_dir():
        for sub in ROOT_AIDEV_SUBFOLDERS:
            p = aidev / sub
            results.append(CheckResult(
                f"root/.ai-dev/{sub}/ exists",
                p.is_dir(),
                "" if p.is_dir() else "missing",
            ))

        readme = aidev / "README.md"
        results.append(CheckResult(
            "root/.ai-dev/README.md exists",
            readme.is_file(),
            "" if readme.is_file() else "missing",
        ))

    return results


def check_projects(root: Path, strict: bool = False) -> list[CheckResult]:
    """Verify every project under projects/ has governance layer."""
    results = []
    projects_dir = root / "projects"

    if not projects_dir.is_dir():
        results.append(CheckResult(
            "projects/ directory exists",
            False,
            "missing",
        ))
        return results

    results.append(CheckResult(
        "projects/ directory exists",
        True,
    ))

    project_dirs = [p for p in projects_dir.iterdir() if p.is_dir()]

    if not project_dirs:
        results.append(CheckResult(
            "projects/ has at least one project",
            not strict,
            "no projects found" if not strict else "expected at least one project",
        ))
        return results

    for proj in sorted(project_dirs):
        name = proj.name

        # Skip common non-project directories
        if name.startswith(".") or name == "__pycache__" or name == "node_modules":
            continue

        # Check .ai-dev/
        aidev = proj / ".ai-dev"
        has_aidev = aidev.is_dir()
        results.append(CheckResult(
            f"projects/{name}/.ai-dev/ exists",
            has_aidev,
            "" if has_aidev else "MISSING — project has no governance layer",
        ))

        if has_aidev:
            for sub in PROJECT_AIDEV_SUBFOLDERS:
                p = aidev / sub
                results.append(CheckResult(
                    f"projects/{name}/.ai-dev/{sub}/ exists",
                    p.is_dir(),
                    "" if p.is_dir() else "missing",
                ))

        # Check at least one runtime file group
        has_runtime = False
        for group in PROJECT_RUNTIME_REQUIRED:
            if all((proj / f).is_file() for f in group):
                has_runtime = True
                break

        results.append(CheckResult(
            f"projects/{name}/ has runtime files",
            has_runtime,
            "" if has_runtime else "MISSING — no AGENTS.md, CLAUDE.md, or opencode.json",
        ))

    return results


def check_template(root: Path) -> list[CheckResult]:
    """Verify base project template is intact."""
    results = []
    template = root / "templates" / "base_project"

    results.append(CheckResult(
        "templates/base_project/ exists",
        template.is_dir(),
        "" if template.is_dir() else "missing",
    ))

    if not template.is_dir():
        return results

    template_must_have = [
        "AGENTS.md",
        "CLAUDE.md",
        "opencode.json",
        "README.md",
        ".ai-dev/README.md",
    ]

    for f in template_must_have:
        p = template / f
        results.append(CheckResult(
            f"template/{f} exists",
            p.exists(),
            "" if p.exists() else "missing",
        ))

    # Check template Claude agents
    agents_dir = template / ".claude" / "agents"
    if agents_dir.is_dir():
        agent_files = list(agents_dir.glob("*.md"))
        results.append(CheckResult(
            "template/.claude/agents/ has role agents",
            len(agent_files) >= 6,
            f"{len(agent_files)} agent(s) found, need >= 6",
        ))
    else:
        results.append(CheckResult(
            "template/.claude/agents/ exists",
            False,
            "missing",
        ))

    return results


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def run_validation(root: Path, strict: bool = False) -> bool:
    """Run all validation checks. Returns True if all pass."""
    all_results: list[CheckResult] = []

    print(f"\n=== IngenIAr Repository Validation ===")
    print(f"Root: {root}\n")

    print("--- Root Runtime ---")
    all_results.extend(check_root_runtime(root))

    print("\n--- Root .ai-dev/ ---")
    all_results.extend(check_root_aidev(root))

    print("\n--- Projects ---")
    all_results.extend(check_projects(root, strict))

    print("\n--- Template ---")
    all_results.extend(check_template(root))

    # Print results
    print("\n=== Results ===")
    failures = 0
    for r in all_results:
        _print_result(r.name, r.passed, r.detail)
        if not r.passed:
            failures += 1

    total = len(all_results)
    passed = total - failures
    print(f"\n  {passed}/{total} checks passed, {failures} failed")

    if failures > 0:
        print("\n  Validation FAILED — fix the issues above before closing work.")
        return False
    else:
        print("\n  Validation PASSED — repository governance is intact.")
        return True


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Validate IngenIAr repository governance compliance"
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Treat warnings as failures (e.g. empty projects/)",
    )
    args = parser.parse_args()

    root = _repo_root()
    success = run_validation(root, strict=args.strict)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
