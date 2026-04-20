#!/usr/bin/env python3
"""
IngenIAr Secret Leak Detector
==============================

Scans tracked files for common secret patterns (GitHub tokens, database
passwords, API keys, etc.) and reports findings. Designed to run as a
pre-commit hook to prevent accidental secret commits.

Usage:
  python scripts/detect_secrets.py [--strict]
  python scripts/detect_secrets.py --path <specific_file>

Exit codes:
  0 = no secrets detected
  1 = potential secrets found
"""

import re
import sys
import argparse
from pathlib import Path

# ---------------------------------------------------------------------------
# Secret patterns — each is a compiled regex with a description
# ---------------------------------------------------------------------------

SECRET_PATTERNS = [
    # GitHub Personal Access Tokens (classic and fine-grained)
    (re.compile(r'ghp_[A-Za-z0-9]{36}'), "GitHub PAT (classic)"),
    (re.compile(r'github_pat_[A-Za-z0-9_]{22}_[A-Za-z0-9]{59}'), "GitHub PAT (fine-grained)"),

    # GitHub OAuth tokens
    (re.compile(r'gho_[A-Za-z0-9]{36}'), "GitHub OAuth token"),
    (re.compile(r'ghu_[A-Za-z0-9]{36}'), "GitHub user-to-server token"),
    (re.compile(r'ghs_[A-Za-z0-9]{36}'), "GitHub server-to-server token"),

    # Database connection strings with real passwords (not placeholder words)
    (re.compile(r'postgresql://[^:]+:(?!password|PASSWORD|YOUR_PASSWORD|REEMPLAZAR|REPLACE|PLACEHOLDER|__SECRET|pass\b|xxxx|PROJECT_ID|admin|root|test|changeme|secret123)[^\@]+@'), "PostgreSQL connection string with password"),
    (re.compile(r'mysql://[^:]+:(?!password|PASSWORD|YOUR_PASSWORD|REEMPLAZAR|REPLACE|PLACEHOLDER|pass\b|xxxx|admin|root|test|changeme)[^\@]+@'), "MySQL connection string with password"),
    (re.compile(r'mongodb(\+srv)?://[^:]+:(?!password|PASSWORD|YOUR_PASSWORD|REEMPLAZAR|REPLACE|PLACEHOLDER|pass\b|xxxx|admin|root|test|changeme)[^\@]+@'), "MongoDB connection string with password"),

    # Generic API key patterns
    (re.compile(r'(?:api[_-]?key|apikey|API_KEY)\s*[=:]\s*["\']?[A-Za-z0-9]{20,}'), "Generic API key"),
    (re.compile(r'(?:secret|SECRET|auth[_-]?token)\s*[=:]\s*["\']?[A-Za-z0-9]{20,}'), "Generic secret/token"),

    # AWS keys
    (re.compile(r'AKIA[0-9A-Z]{16}'), "AWS Access Key ID"),
    (re.compile(r'(?:aws_secret_access_key)\s*[=:]\s*[A-Za-z0-9/+=]{40}'), "AWS Secret Access Key"),

    # Slack tokens
    (re.compile(r'xox[baprs]-[A-Za-z0-9-]{10,}'), "Slack token"),

    # Private keys (raw PEM content)
    (re.compile(r'-----BEGIN (?:RSA |EC |DSA )?PRIVATE KEY-----'), "Private key detected"),

    # Resend API keys (must have mixed chars, not just repeated x's like re_xxxxxxxxxxxx)
    (re.compile(r're_[A-Za-z0-9]{12,}(?<!xxxxxxxxxxxx)'), "Resend API key"),
]

# Files/patterns to skip (example files, docs, etc.)
SKIP_PATTERNS = [
    re.compile(r'\.env\.example$'),
    re.compile(r'\.env\.secrets\.example$'),
    re.compile(r'\.env\.local\.example$'),
    re.compile(r'\.env\.production\.example$'),
    re.compile(r'scripts/detect_secrets\.py$'),      # Don't scan ourselves
    re.compile(r'scripts/setup_secrets\.py$'),        # Contains placeholder references
    re.compile(r'shared/docs/security\.md$'),          # Don't flag the security docs
    re.compile(r'shared/docs/mcp_integration\.md$'),  # Contains example connection strings
    re.compile(r'\.pre-commit-config\.yaml$'),         # Don't flag hook config
    re.compile(r'\.gitignore$'),
    re.compile(r'node_modules/'),
    re.compile(r'\.venv/'),
    re.compile(r'__pycache__/'),
]


def _repo_root() -> Path:
    """Find the repository root by walking up from this script."""
    here = Path(__file__).resolve().parent
    for parent in [here, *here.parents]:
        if (parent / "AGENTS.md").is_file() and (parent / "opencode.json").is_file():
            return parent
    return here.parent


def should_skip(path: Path) -> bool:
    """Check if a file should be skipped."""
    path_str = path.as_posix()
    for pattern in SKIP_PATTERNS:
        if pattern.search(path_str):
            return True
    return False


def scan_file(filepath: Path) -> list[tuple[int, str, str]]:
    """Scan a single file for secrets. Returns list of (line_num, pattern_name, matched_text)."""
    findings = []

    try:
        with open(filepath, encoding="utf-8", errors="replace") as f:
            for line_num, line in enumerate(f, 1):
                for pattern, description in SECRET_PATTERNS:
                    match = pattern.search(line)
                    if match:
                        # Mask the actual secret in output
                        matched_text = match.group(0)
                        masked = matched_text[:8] + "..." + matched_text[-4:] if len(matched_text) > 12 else matched_text[:4] + "..."
                        findings.append((line_num, description, masked))
    except (OSError, UnicodeDecodeError):
        pass  # Skip files we can't read

    return findings


def scan_directory(root: Path, strict: bool = False, specific_path: str = None) -> bool:
    """Scan the repository for leaked secrets. Returns True if clean."""
    all_findings = []

    if specific_path:
        target = root / specific_path
        if target.is_file():
            findings = scan_file(target)
            for line_num, desc, masked in findings:
                all_findings.append((str(target), line_num, desc, masked))
    else:
        # Walk all text files in the repo
        for filepath in root.rglob("*"):
            if not filepath.is_file():
                continue
            if should_skip(filepath):
                continue
            # Skip binary files (heuristic)
            try:
                if filepath.stat().st_size > 1_000_000:  # Skip files > 1MB
                    continue
            except OSError:
                continue

            # Only scan common text file types
            suffix = filepath.suffix.lower()
            if suffix not in {
                '.py', '.js', '.ts', '.tsx', '.jsx', '.json', '.yaml', '.yml',
                '.md', '.txt', '.env', '.toml', '.cfg', '.ini', '.conf',
                '.sql', '.sh', '.bash', '.zsh', '.ps1', '.bat', '.cmd',
                '.html', '.css', '.scss', '.xml', '.csv',
            }:
                continue

            findings = scan_file(filepath)
            rel_path = filepath.relative_to(root)
            for line_num, desc, masked in findings:
                all_findings.append((str(rel_path), line_num, desc, masked))

    print("=== IngenIAr Secret Leak Detector ===\n")

    if not all_findings:
        print("No secrets detected — repository is clean.")
        return True

    print(f"FOUND {len(all_findings)} potential secret(s):\n")
    for filepath, line_num, desc, masked in all_findings:
        print(f"  [{desc}]")
        print(f"    File: {filepath}:{line_num}")
        print(f"    Match: {masked}")
        print()

    print("RECOMMENDED ACTIONS:")
    print("  1. Move the secret to .env.secrets (gitignored)")
    print("  2. Replace the value in the tracked file with a __SECRET_XXX__ placeholder")
    print("  3. Run: python scripts/setup_secrets.py")
    print("  4. Re-run this detector to verify: python scripts/detect_secrets.py")

    if strict:
        print("\nSTRICT MODE: Any finding is treated as a failure.")
        return False

    # In non-strict mode, still return failure for high-confidence findings
    high_confidence = ["GitHub PAT", "AWS", "Private key", "PostgreSQL connection string with password"]
    for _, _, desc, _ in all_findings:
        for hc in high_confidence:
            if hc in desc:
                print(f"\nHigh-confidence finding ({desc}) — treating as FAILURE.")
                return False

    print("\nNote: Some findings may be false positives (e.g., example values in docs).")
    print("Run with --strict to treat all findings as failures.")
    return False


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Detect leaked secrets in the IngenIAr repository"
    )
    parser.add_argument(
        "--strict",
        action="store_true",
        help="Treat all findings as failures (not just high-confidence ones)",
    )
    parser.add_argument(
        "--path",
        type=str,
        help="Scan a specific file instead of the whole repo",
    )
    args = parser.parse_args()

    root = _repo_root()
    clean = scan_directory(root, strict=args.strict, specific_path=args.path)
    sys.exit(0 if clean else 1)


if __name__ == "__main__":
    main()
