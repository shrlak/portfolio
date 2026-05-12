#!/usr/bin/env bash
# SessionStart hook — outputs project memory as context Claude reads at session open.
# Stdout is captured by Claude Code and injected as "SessionStart hook additional context".

MEM_DIR="/Users/shrla/.claude/projects/-Users-shrla-Library-Mobile-Documents-com-apple-CloudDocs-private-spencer-portfolio/memory"

# Bail silently if memory hasn't been written yet
[ -d "$MEM_DIR" ] || exit 0

echo "<project-memory>"
echo "The following is persistent memory from previous sessions on this project."
echo "Read it now so you have full context before responding to the user."
echo ""

for f in "$MEM_DIR/project_portfolio.md" "$MEM_DIR/feedback_style.md" "$MEM_DIR/git_state.md"; do
  [ -f "$f" ] || continue
  echo "---"
  cat "$f"
  echo ""
done

echo "</project-memory>"
