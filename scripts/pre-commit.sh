#!/usr/bin/env bash
# Pre-commit hook: scan for secrets and enforce security checks.
# Install: cp scripts/pre-commit.sh .git/hooks/pre-commit && chmod +x .git/hooks/pre-commit

set -euo pipefail

echo "🔒 Running pre-commit security checks..."

# 1. Check for .env files being committed
STAGED_ENV=$(git diff --cached --name-only --diff-filter=ACM | grep -E '(\.env$|\.env\.local$|\.env\..*\.local$)' || true)
if [ -n "$STAGED_ENV" ]; then
  echo "❌ BLOCKED: .env files detected in commit:"
  echo "$STAGED_ENV"
  echo "These files contain secrets. Add them to .gitignore and run: git rm --cached <file>"
  exit 1
fi

# 2. Check for common secret patterns in staged changes
STAGED_DIFF=$(git diff --cached --name-only --diff-filter=ACM)

if [ -n "$STAGED_DIFF" ]; then
  # Check for service role keys, private keys, token patterns
  SECRET_PATTERNS=(
    'eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}'  # JWT tokens
    'sk-(?:ant|api)-[A-Za-z0-9_-]{10,}'  # API keys (Anthropic, etc.)
    're_[A-Za-z0-9]{10,}'  # Resend API keys
    'service_role'  # Supabase service role key indicator
    'PRIVATE KEY-----'  # SSH/PEM private keys
    'password\s*[:=]\s*["\x27][^"\x27]{8,}["\x27]'  # Hardcoded passwords
  )

  for file in $STAGED_DIFF; do
    if [ -f "$file" ]; then
      for pattern in "${SECRET_PATTERNS[@]}"; do
        if git diff --cached "$file" | grep -qE "$pattern" 2>/dev/null; then
          echo "⚠️  WARNING: Potential secret detected in $file"
          echo "   Pattern: $pattern"
          echo "   Please verify this is not a real secret before committing."
        fi
      done
    fi
  done
fi

# 3. Check for debug/test files that shouldn't be committed
for file in $STAGED_DIFF; do
  if echo "$file" | grep -qE '(curl_output|prod_output|debug.*route)'; then
    echo "⚠️  WARNING: Debug/test output file staged: $file"
    echo "   Consider removing it before committing."
  fi
done

echo "✅ Security checks passed."
exit 0
