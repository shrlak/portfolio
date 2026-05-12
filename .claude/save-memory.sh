#!/usr/bin/env bash
# Auto-saves technical project state to Claude memory on session end / pre-compact.
# Intelligent summarization is handled by Claude (behavioral rule in CLAUDE.md).
# This script captures raw git facts that would otherwise be lost between sessions.

set -euo pipefail

PROJ_DIR="/Users/shrla/Library/Mobile Documents/com~apple~CloudDocs/private/spencer-portfolio"
MEM_DIR="/Users/shrla/.claude/projects/-Users-shrla-Library-Mobile-Documents-com-apple-CloudDocs-private-spencer-portfolio/memory"

mkdir -p "$MEM_DIR"

# Write a snapshot of current git state into memory
cat > "$MEM_DIR/git_state.md" << HEREDOC
---
name: Git state snapshot
description: Auto-saved on session end — latest commits, branch, and dirty files
type: project
---

Captured: $(date -u +"%Y-%m-%dT%H:%M:%SZ")
Branch: $(cd "$PROJ_DIR" && git branch --show-current 2>/dev/null || echo "unknown")

## Recent commits
$(cd "$PROJ_DIR" && git log --oneline -8 2>/dev/null || echo "unavailable")

## Working tree status
$(cd "$PROJ_DIR" && git status --short 2>/dev/null || echo "unavailable")
HEREDOC

# Ensure git_state.md is listed in the index
MEMORY_INDEX="$MEM_DIR/MEMORY.md"
if ! grep -q "git_state" "$MEMORY_INDEX" 2>/dev/null; then
  echo "- [Git state snapshot](git_state.md) — latest commits + dirty files, auto-updated each session" >> "$MEMORY_INDEX"
fi
