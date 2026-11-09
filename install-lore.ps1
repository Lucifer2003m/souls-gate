$ErrorActionPreference = "Stop"

$projectRoot = (Get-Location).Path
$pagePath = Join-Path $projectRoot "app\games\dark-souls-3\page.tsx"
$componentSource = Join-Path $PSScriptRoot "LoreArchive.tsx"
$componentTarget = Join-Path $projectRoot "app\games\dark-souls-3\LoreArchive.tsx"

if (-not (Test-Path $pagePath)) {
  throw "Could not find app\games\dark-souls-3\page.tsx. Run this script from the Souls Gate project root."
}
if (-not (Test-Path $componentSource)) {
  throw "Could not find LoreArchive.tsx beside this script. Extract the complete ZIP first."
}

$source = Get-Content -Raw -Encoding UTF8 $pagePath
$backup = "$pagePath.backup-lore-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

if ($source -notmatch 'import LoreArchive from "\./LoreArchive";') {
  $importMarker = 'import EndingsArchive from "./EndingsArchive";'
  if (-not $source.Contains($importMarker)) {
    throw "Could not find the EndingsArchive import. No project files were changed."
  }
  $source = $source.Replace($importMarker, $importMarker + "`r`n" + 'import LoreArchive from "./LoreArchive";')
}

if ($source -notmatch 'id:\s*"lore"') {
  $pattern = '(?s)(\{\s*id:\s*"endings".*?number:\s*"16".*?\},)'
  $sectionMatch = [regex]::Match($source, $pattern)
  if (-not $sectionMatch.Success) {
    throw "Could not find the Endings section (section 16). No project files were changed."
  }
  $faLabel = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('2K/Yp9mG2LTZhtin2YXZhyDYr9in2LPYqtin2YYg2Ygg2KzZh9in2YY='))
  $faDescription = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('2KrYp9ix24zYriDYrNmH2KfZhtiMINi02K7YtduM2KrigIzZh9in2Iwg2LHYp9iy2YfYpyDZiCDYp9ix2KrYqNin2LfYp9iqINiv2KfYs9iq2KfZhtuM'))
  $newSection = $sectionMatch.Groups[1].Value + @"

  {
    id: "lore",
    title: "LORE ARCHIVE",
    fa: "$faLabel",
    icon: "☼",
    number: "17",
    description: "$faDescription",
  },
"@
  $source = $source.Remove($sectionMatch.Index, $sectionMatch.Length).Insert($sectionMatch.Index, $newSection)
}

$source = $source.Replace('LOTHRIC DATABASE / 16', 'LOTHRIC DATABASE / 17')
$source = $source.Replace('<span>16</span>', '<span>17</span>')

if ($source -notmatch 'active\s*===\s*"lore"\s*\?') {
  $renderPattern = '(?s)(active\s*===\s*"endings"\s*\?\s*\(\s*<EndingsArchive\s*/>\s*\)\s*:)'
  if ([regex]::IsMatch($source, $renderPattern)) {
    $source = [regex]::Replace($source, $renderPattern, '$1 active === "lore" ? (<LoreArchive />) :', 1)
  } else {
    $simplePattern = 'active\s*===\s*"endings"\s*\?\s*<EndingsArchive\s*/>\s*:'
    if ([regex]::IsMatch($source, $simplePattern)) {
      $source = [regex]::Replace($source, $simplePattern, 'active === "endings" ? <EndingsArchive /> : active === "lore" ? <LoreArchive /> :', 1)
    } else {
      throw "Could not find the EndingsArchive render branch. No project files were changed."
    }
  }
}

Copy-Item $pagePath $backup
Copy-Item $componentSource $componentTarget -Force
Set-Content -Path $pagePath -Value $source -Encoding UTF8

Write-Host ""
Write-Host "LORE archive has been added to the DS3 page." -ForegroundColor Green
Write-Host "Backup: $backup"
Write-Host "Component: $componentTarget"
Write-Host "Next command: npm.cmd run build"
