# PowerShell script to clone, generate, and install Antigravity plugins from wshobson/agents
[CmdletBinding()]
param(
    [string]$TargetDir = "$HOME\agents",
    [switch]$Force
)

$ErrorActionPreference = "Stop"

Write-Host ">>> [1/3] Cloning or updating wshobson/agents repository..." -ForegroundColor Cyan
if (Test-Path "$TargetDir\.git") {
    Write-Host "Repository already exists at $TargetDir. Pulling latest changes..." -ForegroundColor Yellow
    git -C "$TargetDir" pull
} else {
    git clone https://github.com/wshobson/agents.git "$TargetDir"
}

Set-Location "$TargetDir"

Write-Host ">>> [2/3] Generating Antigravity artifacts..." -ForegroundColor Cyan
if (Get-Command uv -ErrorAction SilentlyContinue) {
    Write-Host "Running generation with uv..." -ForegroundColor Green
    uv run --project plugins/plugin-eval python tools/generate.py --harness antigravity
} elseif (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "Running generation with python..." -ForegroundColor Green
    python tools/generate.py --harness antigravity
} else {
    throw "Neither 'uv' nor 'python' was found on PATH. Please install uv or python."
}

Write-Host ">>> [3/3] Installing plugins into Antigravity global config..." -ForegroundColor Cyan
$forceArg = if ($Force) { @("--force") } else { @() }
if (Get-Command uv -ErrorAction SilentlyContinue) {
    uv run --project plugins/plugin-eval python tools/install_antigravity.py @forceArg
} else {
    python tools/install_antigravity.py @forceArg
}

Write-Host "`n>>> Done! Antigravity plugins from wshobson/agents successfully installed to ~/.gemini/config/plugins" -ForegroundColor Green
