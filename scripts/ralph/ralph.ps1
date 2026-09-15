# Ralph Loop Runner (PowerShell for Windows)
# Usage: .\scripts\ralph\ralph.ps1 [-Tool amp|claude] [-MaxIterations 10]

param (
    [ValidateSet("amp", "claude")]
    [string]$Tool = "amp",
    [int]$MaxIterations = 10
)

$ErrorActionPreference = "Stop"

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Split-Path -Parent (Split-Path -Parent $ScriptDir)

$PrdFile = Join-Path $RootDir "prd.json"
if (-not (Test-Path $PrdFile)) {
    $PrdFile = Join-Path $ScriptDir "prd.json"
}

$ProgressFile = Join-Path $RootDir "progress.txt"
if (-not (Test-Path $ProgressFile)) {
    $ProgressFile = Join-Path $ScriptDir "progress.txt"
}

$PromptFile = Join-Path $ScriptDir "prompt.md"
$ArchiveDir = Join-Path $ScriptDir "archive"
$LastBranchFile = Join-Path $ScriptDir ".last-branch"

if (-not (Test-Path $PrdFile)) {
    Write-Error "prd.json not found in $RootDir or $ScriptDir. Please generate prd.json first using the /ralph skill."
}

# Archive previous run if branch changed
$prdJson = Get-Content $PrdFile -Raw | ConvertFrom-Json
$currentBranch = $prdJson.branchName

if (Test-Path $LastBranchFile) {
    $lastBranch = (Get-Content $LastBranchFile -Raw).Trim()
    if ($currentBranch -and $lastBranch -and ($currentBranch -ne $lastBranch)) {
        $date = Get-Date -Format "yyyy-MM-dd"
        $cleanName = $lastBranch -replace "^ralph/", ""
        $targetArchive = Join-Path $ArchiveDir "$date-$cleanName"
        New-Item -ItemType Directory -Force -Path $targetArchive | Out-Null
        if (Test-Path $PrdFile) { Copy-Item $PrdFile $targetArchive }
        if (Test-Path $ProgressFile) { Copy-Item $ProgressFile $targetArchive }
        Set-Content -Path $ProgressFile -Value "# Progress Log`n"
    }
}

Set-Content -Path $LastBranchFile -Value $currentBranch

Write-Host "=== Starting Ralph autonomous loop ===" -ForegroundColor Cyan
Write-Host "Tool: $Tool | Max Iterations: $MaxIterations" -ForegroundColor Yellow
Write-Host "PRD: $PrdFile"

$promptContent = Get-Content $PromptFile -Raw

for ($i = 1; $i -le $MaxIterations; $i++) {
    Write-Host "`n--- Iteration $i of $MaxIterations ---" -ForegroundColor Green
    $currentData = Get-Content $PrdFile -Raw | ConvertFrom-Json
    $remaining = ($currentData.userStories | Where-Object { $_.passes -eq $false }).Count

    if ($remaining -eq 0) {
        Write-Host "All user stories have passed! Ralph loop complete." -ForegroundColor Green
        exit 0
    }

    Write-Host "$remaining stories remaining." -ForegroundColor Magenta

    if ($Tool -eq "claude") {
        & claude -p $promptContent
    } else {
        & amp --prompt $promptContent
    }
}

Write-Host "Reached maximum iterations ($MaxIterations). Check progress.txt and prd.json." -ForegroundColor Yellow
