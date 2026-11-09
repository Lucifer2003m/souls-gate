$ErrorActionPreference = "Stop"

$projectRoot = (Get-Location).Path
$componentSource = Join-Path $PSScriptRoot "MusicArchive.tsx"
$heroSource = Join-Path $PSScriptRoot "music-hero.png"
$pagePath = Join-Path $projectRoot "app\games\dark-souls-3\page.tsx"
$componentTarget = Join-Path $projectRoot "app\games\dark-souls-3\MusicArchive.tsx"
$heroDirectory = Join-Path $projectRoot "public\images\ds3"
$heroTarget = Join-Path $heroDirectory "music-hero.png"

if (-not (Test-Path $pagePath)) { throw "Run this script from the Souls Gate project root. page.tsx was not found." }
if (-not (Test-Path $componentSource)) { throw "MusicArchive.tsx must be next to this installer." }
if (-not (Test-Path $heroSource)) { throw "music-hero.png must be next to this installer." }

$source = [System.IO.File]::ReadAllText($pagePath, [System.Text.Encoding]::UTF8)
$backup = "$pagePath.music-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
[System.IO.File]::Copy($pagePath, $backup, $false)

$importLine = 'import MusicArchive from "./MusicArchive";'
if (-not $source.Contains($importLine)) {
  $anchor = 'import LoreArchive from "./LoreArchive";'
  if (-not $source.Contains($anchor)) { throw "Could not find the LoreArchive import anchor. Backup created at $backup" }
  $source = $source.Replace($anchor, $anchor + "`r`n" + $importLine)
}

$sectionAnchor = '    description: "تاریخ جهان، شخصیت‌ها، رازها و ارتباطات داستانی",' + "`r`n" + '  },' + "`r`n" + '];'
if (-not $source.Contains($sectionAnchor)) {
  $sectionAnchor = '    description: "تاریخ جهان، شخصیت‌ها، رازها و ارتباطات داستانی",' + "`n" + '  },' + "`n" + '];'
}
if (-not $source.Contains($sectionAnchor)) {
  if (-not $source.Contains('id: "music"')) { throw "Could not find the end of the Lore section. Backup created at $backup" }
} else {
  $musicSection = @'
    description: "تاریخ جهان، شخصیت‌ها، رازها و ارتباطات داستانی",
  },
  {
    id: "music",
    title: "SOUNDTRACK ARCHIVE",
    fa: "موسیقی‌های بازی",
    icon: "♫",
    number: "18",
    description: "موسیقی باس‌ها، مناطق و دو بسته الحاقی Dark Souls III",
  },
];
'@
  $source = $source.Replace($sectionAnchor, $musicSection.TrimEnd())
}

$source = $source.Replace("LOTHRIC DATABASE / 17", "LOTHRIC DATABASE / 18")
$source = $source.Replace('<span>17</span>', '<span>18</span>')

$oldDescription = ': "آرشیو اختصاصی " + current.fa + " در دنیای Dark Souls III.";'
$newDescription = ': active === "music" ? "آرشیو موسیقی Dark Souls III، باس‌ها، مناطق و دو DLC." : "آرشیو اختصاصی " + current.fa + " در دنیای Dark Souls III.";'
if ($source.Contains($oldDescription)) { $source = $source.Replace($oldDescription, $newDescription) }

$renderAnchor = ') : active === "lore" ? (<LoreArchive />) : ('
$renderReplacement = ') : active === "lore" ? (<LoreArchive />) : active === "music" ? (<MusicArchive />) : ('
if ($source.Contains($renderAnchor)) {
  $source = $source.Replace($renderAnchor, $renderReplacement)
} elseif (-not $source.Contains('active === "music" ? (<MusicArchive />)')) {
  throw "Could not find the Lore render branch. Backup created at $backup"
}

[System.IO.File]::WriteAllText($pagePath, $source, (New-Object System.Text.UTF8Encoding($false)))
[System.IO.File]::Copy($componentSource, $componentTarget, $true)
New-Item -ItemType Directory -Force -Path $heroDirectory | Out-Null
[System.IO.File]::Copy($heroSource, $heroTarget, $true)

Write-Host "Music Archive installed. Backup: $backup" -ForegroundColor Green
Write-Host "Next: upload the 45 audio files to Supabase Storage bucket game-assets, folder ds3/music." -ForegroundColor Yellow
