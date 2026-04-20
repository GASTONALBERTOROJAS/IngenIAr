#!/usr/bin/env python3
"""
IngenIAr Secrets Setup
=====================

Reads real secret values from .env.secrets and injects them into opencode.json,
replacing the __SECRET_XXX__ placeholder tokens.

Usage:
  1. Copy .env.secrets.example to .env.secrets
  2. Fill in your real values
  3. Run: python scripts/setup_secrets.py

This script modifies opencode.json in-place. The original file in git
contains only placeholders — your real secrets never leave your machine.
"""

import json
import re
import sys
from pathlib import Path

SECRETS_FILE = ".env.secrets"
OPENCODE_FILE = "opencode.json"

# Maps .env.secrets keys to opencode.json placeholder tokens
SECRET_MAP = {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "__SECRET_GITHUB_PERSONAL_ACCESS_TOKEN__",
    "POSTGRES_CONNECTION_STRING": "__SECRET_POSTGRES_CONNECTION_STRING__",
    "BRAVE_API_KEY": "__SECRET_BRAVE_API_KEY__",
}


def _repo_root() -> Path:
    """Find the repository root by walking up from this script."""
    here = Path(__file__).resolve().parent
    for parent in [here, *here.parents]:
        if (parent / "AGENTS.md").is_file() and (parent / "opencode.json").is_file():
            return parent
    return here.parent


def read_secrets(secrets_path: Path) -> dict[str, str]:
    """Read key=value pairs from .env.secrets file."""
    secrets = {}
    if not secrets_path.is_file():
        return secrets

    with open(secrets_path, encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            # Skip comments and empty lines
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            key, _, value = line.partition("=")
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key in SECRET_MAP:
                secrets[key] = value

    return secrets


def inject_secrets(opencode_path: Path, secrets: dict[str, str]) -> bool:
    """Replace placeholder tokens in opencode.json with real values."""
    with open(opencode_path, encoding="utf-8") as f:
        content = f.read()

    changed = False
    missing = []

    for env_key, placeholder in SECRET_MAP.items():
        if placeholder not in content:
            # Placeholder not found — might already be replaced or not used
            continue

        if env_key not in secrets or not secrets[env_key]:
            missing.append(env_key)
            continue

        content = content.replace(placeholder, secrets[env_key])
        changed = True

    if not changed and not missing:
        print("No placeholders found — secrets may already be injected.")
        return True

    # Write back as valid JSON
    try:
        data = json.loads(content)
    except json.JSONDecodeError as e:
        print(f"ERROR: Result would not be valid JSON: {e}")
        return False

    with open(opencode_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
        f.write("\n")

    print(f"Injected {len([k for k in secrets if k in SECRET_MAP and secrets[k]])} secret(s) into opencode.json")

    if missing:
        print(f"\nWARNING: The following secrets were not provided in {SECRETS_FILE}:")
        for m in missing:
            print(f"  - {m}")
        print("MCP servers requiring these secrets will not work until you provide them.")

    return True


def restore_placeholders(opencode_path: Path) -> bool:
    """Restore placeholder tokens in opencode.json (for use before committing)."""
    with open(opencode_path, encoding="utf-8") as f:
        content = f.read()

    changed = False
    for env_key, placeholder in SECRET_MAP.items():
        if placeholder in content:
            continue  # Already a placeholder

    # We need to find real values and replace them back with placeholders
    # This is tricky — instead, we'll just warn the user
    print("To restore placeholders before committing, run:")
    print("  git checkout -- opencode.json")
    return True


def main() -> None:
    root = _repo_root()
    secrets_path = root / SECRETS_FILE
    opencode_path = root / OPENCODE_FILE

    print(f"=== IngenIAr Secrets Setup ===")
    print(f"Root: {root}\n")

    if not secrets_path.is_file():
        print(f"ERROR: {SECRETS_FILE} not found.")
        print(f"Create it from the template:")
        print(f"  cp .env.secrets.example .env.secrets")
        print(f"Then fill in your real values and run this script again.")
        sys.exit(1)

    if not opencode_path.is_file():
        print(f"ERROR: {OPENCODE_FILE} not found.")
        sys.exit(1)

    secrets = read_secrets(secrets_path)

    if not secrets:
        print(f"WARNING: No secrets found in {SECRETS_FILE}.")
        print("Make sure you've filled in at least one value.")
        sys.exit(1)

    success = inject_secrets(opencode_path, secrets)

    if success:
        print("\nIMPORTANT: opencode.json now contains real secrets.")
        print("Do NOT commit this file with real secrets.")
        print("Before committing, restore placeholders with:")
        print("  git checkout -- opencode.json")
        print("Or use the detect_secrets.py pre-commit hook (auto-configured).")
    else:
        print("\nFailed to inject secrets.")
        sys.exit(1)


if __name__ == "__main__":
    main()
