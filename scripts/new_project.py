#!/usr/bin/env python3
"""
IngenIAr Project Scaffolding Script

Creates a new IngenIAr project from the base template, ensuring
every new project inherits the governance layer automatically.

Usage:
  python scripts/new_project.py <project-name> [--description DESC]

This script:
  1. Copies templates/base_project/ → projects/<project-name>/
  2. Updates the project .ai-dev/state/current_state.md with real context
  3. Creates an initial requirement record
  4. Validates the result

Governance rules enforced:
  - Projects MUST be created inside projects/
  - Projects MUST inherit the base template
  - Projects MUST have .ai-dev/ with governance structure
"""

import argparse
import shutil
import sys
from datetime import datetime
from pathlib import Path


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _repo_root() -> Path:
    """Find the repository root by walking up from this script."""
    here = Path(__file__).resolve().parent
    for parent in [here, *here.parents]:
        if (parent / "AGENTS.md").is_file() and (parent / "opencode.json").is_file():
            return parent
    return here.parent


def _copy_template(template: Path, dest: Path) -> None:
    """Copy template tree to destination, preserving structure."""
    # Directories to skip entirely
    skip_dirs = {"__pycache__", "node_modules", ".git"}

    for item in template.iterdir():
        if item.name in skip_dirs:
            continue
        target = dest / item.name
        if item.is_dir():
            shutil.copytree(item, target, dirs_exist_ok=True)
        else:
            dest.mkdir(parents=True, exist_ok=True)
            shutil.copy2(item, target)


# ---------------------------------------------------------------------------
# Main scaffolding
# ---------------------------------------------------------------------------

def scaffold_project(name: str, description: str = "") -> bool:
    root = _repo_root()
    template = root / "templates" / "base_project"
    project_dir = root / "projects" / name

    # Validate preconditions
    if not template.is_dir():
        print(f"ERROR: Template not found at {template}")
        return False

    if project_dir.exists():
        print(f"ERROR: Project already exists at {project_dir}")
        return False

    projects_dir = root / "projects"
    if not projects_dir.is_dir():
        print(f"ERROR: projects/ directory not found at {projects_dir}")
        return False

    # Validate name
    if not name or any(c in name for c in r'\/:*?"<>|'):
        print(f'ERROR: Invalid project name "{name}"')
        return False

    print(f"Creating project: {name}")
    print(f"  Template: {template}")
    print(f"  Destination: {project_dir}\n")

    # Step 1: Copy template
    print("  [1/4] Copying template...")
    _copy_template(template, project_dir)

    # Step 2: Update project state
    print("  [2/4] Updating project state...")
    state_file = project_dir / ".ai-dev" / "state" / "current_state.md"
    if state_file.is_file():
        now = datetime.now().strftime("%Y-%m-%d %H:%M")
        desc_line = f"\n- Description: {description}" if description else ""
        state_content = f"""# Current State — {name}

- Project created from IngenIAr base template on {now}.{desc_line}
- Local runtime files are present for Claude and OpenCode.
- Local starter agents cover Prompt Engineer, Architect, Planner, Developer, QA, and Reviewer.
- New or ambiguous requests should start with RICO-based requirement structuring before architecture or implementation.
- `.ai-dev/` is ready to capture requirements, plans, decisions, QA, and artifacts for this project.
- Replace this state with real project context as work begins.
"""
        state_file.write_text(state_content, encoding="utf-8")

    # Step 3: Create initial requirement record
    print("  [3/4] Creating initial requirement record...")
    req_dir = project_dir / ".ai-dev" / "requirements"
    req_dir.mkdir(parents=True, exist_ok=True)
    now_date = datetime.now().strftime("%Y-%m-%d")
    req_file = req_dir / f"{now_date}_project-initialization.md"
    req_content = f"""# Project Initialization — {name}

Date: {now_date}

## Role
Developer

## Instructions
Create and initialize a new IngenIAr project from the base template.

## Context
New project scaffolded via `python scripts/new_project.py`.

## Objective
Have a working project with governance layer (.ai-dev/), runtime files, and starter agents ready for development.

## Acceptance Criteria
- Project directory exists under projects/
- .ai-dev/ structure is present with requirements, plans, state, qa, artifacts
- At least one runtime file (AGENTS.md, CLAUDE.md, or opencode.json) is present
- Validate with `python scripts/validate_ingeniar.py`
"""
    if description:
        req_content += f"\n## Project Description\n{description}\n"
    req_file.write_text(req_content, encoding="utf-8")

    # Step 4: Validate
    print("  [4/4] Validating new project...\n")
    # Import and run validation inline
    sys.path.insert(0, str(root / "scripts"))
    from validate_ingeniar import run_validation

    success = run_validation(root)

    if success:
        print(f"\n  Project {name} created and validated successfully!")
        print(f"  Location: {project_dir}")
        print(f"\n  Next steps:")
        print(f"    1. cd projects/{name}")
        print(f"    2. Start working with OpenCode or Claude Code")
        print(f"    3. Record plans in .ai-dev/plans/")
        print(f"    4. Record QA evidence in .ai-dev/qa/ before closing work")
    else:
        print(f"\n  WARNING: Project created but validation has issues.")
        print(f"  Run `python scripts/validate_ingeniar.py` to see details.")

    return success


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Create a new IngenIAr project from the base template"
    )
    parser.add_argument(
        "name",
        help="Project name (will be created as projects/<name>/)",
    )
    parser.add_argument(
        "--description",
        default="",
        help="Short project description for the state file",
    )
    args = parser.parse_args()

    success = scaffold_project(args.name, args.description)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
