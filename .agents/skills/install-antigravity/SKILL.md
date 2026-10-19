---
name: install-antigravity
description: >-
  Clone, generate, and install multi-harness plugins, agents, and skills from
  wshobson/agents (https://github.com/wshobson/agents.git) into Google Antigravity
  using `make install-antigravity` or cross-platform Python/PowerShell automation.
---

# Install Antigravity Plugins from wshobson/agents

This skill provides procedures and automated scripts to clone, generate, and install agents, skills, and plugins from the [`wshobson/agents`](https://github.com/wshobson/agents.git) repository into Google Antigravity.

---

## Overview

The `wshobson/agents` repository is a multi-harness marketplace containing 90+ plugins, 200+ agents, and 180+ skills designed for coding tools like Antigravity, Claude Code, OpenAI Codex, and Cursor.

Because Antigravity uses its own plugin structure (`plugin.json`, `agents/`, `skills/`, and MCP configurations), the repository uses a generation step (`tools/generate.py`) followed by an installation step (`tools/install_antigravity.py`) that links the generated plugins directly into Antigravity's global plugin directory:
`~/.gemini/config/plugins/` (or `%USERPROFILE%\.gemini\config\plugins\` on Windows).

---

## Quick Workflow (Automated)

### On Windows (PowerShell)

Run the bundled installation script from the skill directory:
```powershell
powershell -ExecutionPolicy Bypass -File .agents/skills/install-antigravity/scripts/install-antigravity.ps1
```

### On Linux / macOS / Git Bash

Run the bundled shell script:
```bash
bash .agents/skills/install-antigravity/scripts/install-antigravity.sh
```

---

## Manual Step-by-Step Procedure

### Step 1: Clone the Repository

Clone `wshobson/agents` into a local directory (e.g., in your user profile or cache folder):

```bash
git clone https://github.com/wshobson/agents.git ~/agents
cd ~/agents
```

On Windows PowerShell:
```powershell
git clone https://github.com/wshobson/agents.git "$HOME\agents"
Set-Location "$HOME\agents"
```

### Step 2: Generate Antigravity Artifacts

The generation step compiles universal Markdown manifests into Antigravity-specific plugins under `.antigravity/plugins/`.

**If `make` and `uv` are available:**
```bash
make generate HARNESS=antigravity
```

**If running directly with `uv` on Windows / PowerShell:**
```powershell
uv run --project plugins/plugin-eval python tools/generate.py --harness antigravity
```

**If running directly with standard `python`:**
```bash
python tools/generate.py --harness antigravity
```

### Step 3: Install Plugins into Antigravity

This step symlinks or copies the generated plugins into `~/.gemini/config/plugins/`:

**If `make` is available:**
```bash
make install-antigravity
```

**If running directly with Python:**
```bash
python tools/install_antigravity.py
```

To force-overwrite or update existing symlinks:
```bash
make install-antigravity FORCE=1
# or
python tools/install_antigravity.py --force
```

---

## Verification

After installation, verify that the plugins are available in Antigravity:

1. Inspect the global plugin directory:
   - **Windows**: `dir "$HOME\.gemini\config\plugins"`
   - **Linux/macOS**: `ls -l ~/.gemini/config/plugins`
2. Check that the desired plugins appear (such as `python-development`, `javascript-typescript`, `developer-essentials`, `security-scanning`).
3. In your next Antigravity prompt, the newly installed skills and plugins will be automatically discovered and listed under available plugins and skills.

---

## Uninstalling or Updating

### Update Plugins
```bash
cd ~/agents
git pull
make generate HARNESS=antigravity
make install-antigravity FORCE=1
```

### Uninstall Plugins
```bash
cd ~/agents
make uninstall-antigravity
# or
python tools/install_antigravity.py --uninstall
```
