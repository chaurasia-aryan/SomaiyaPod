#!/usr/bin/env bash
# Bash script to clone, generate, and install Antigravity plugins from wshobson/agents
set -euo pipefail

TARGET_DIR="${1:-$HOME/agents}"
FORCE_FLAG="${2:-}"

echo ">>> [1/3] Cloning or updating wshobson/agents repository..."
if [ -d "$TARGET_DIR/.git" ]; then
    echo "Repository exists at $TARGET_DIR. Pulling latest..."
    git -C "$TARGET_DIR" pull
else
    git clone https://github.com/wshobson/agents.git "$TARGET_DIR"
fi

cd "$TARGET_DIR"

echo ">>> [2/3] Generating Antigravity artifacts..."
if command -v make >/dev/null 2>&1; then
    make generate HARNESS=antigravity
elif command -v uv >/dev/null 2>&1; then
    uv run --project plugins/plugin-eval python tools/generate.py --harness antigravity
else
    python3 tools/generate.py --harness antigravity
fi

echo ">>> [3/3] Installing plugins into Antigravity global config..."
if command -v make >/dev/null 2>&1; then
    if [ "$FORCE_FLAG" = "--force" ] || [ "$FORCE_FLAG" = "-f" ]; then
        make install-antigravity FORCE=1
    else
        make install-antigravity
    fi
elif command -v uv >/dev/null 2>&1; then
    uv run --project plugins/plugin-eval python tools/install_antigravity.py ${FORCE_FLAG:+"$FORCE_FLAG"}
else
    python3 tools/install_antigravity.py ${FORCE_FLAG:+"$FORCE_FLAG"}
fi

echo ""
echo ">>> Done! Antigravity plugins from wshobson/agents successfully installed to ~/.gemini/config/plugins"
