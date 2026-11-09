$ErrorActionPreference = "Stop"

$projectRoot = Get-Location
$pagePath = Join-Path $projectRoot "app\games\dark-souls-3\page.tsx"
$componentSource = Join-Path $PSScriptRoot "LoreArchive.tsx"
$componentTarget = Join-Path $projectRoot "app\games\dark-souls-3\LoreArchive.tsx"

if (-not (Test-Path $pagePath)) {
  throw "page.tsx پیدا نشد. این اسکریپت را از ریشه پروژه Souls Gate اجرا کن."
}
if (-not (Test-Path $componentSource)) {
  throw "فایل LoreArchive.tsx کنار اسکریپت پیدا نشد. ZIP را کامل استخراج کن."
}

$source = Get-Content -Raw -Encoding UTF8 $pagePath
$backup = "$pagePath.backup-lore-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item $pagePath $backup

if ($source -notmatch 'import LoreArchive from "\./LoreArchive";') {
  $marker = 'import EndingsArchive from "\./EndingsArchive";'
  if (-not $source.Contains('import EndingsArchive from "./EndingsArchive";')) {
    throw "خط import مربوط به EndingsArchive پیدا نشد؛ فایل اصلی تغییر کرده است."
  }
  $source = $source.Replace(
    'import EndingsArchive from "./EndingsArchive";',
    "import EndingsArchive from `"./EndingsArchive`";`r`nimport LoreArchive from `"./LoreArchive`";"
  )
}

if ($source -notmatch 'id:\s*"lore"') {
  $pattern = '(?s)(\{\s*id:\s*"endings",\s*title:\s*"ENDINGS",\s*fa:\s*"پایان‌های بازی",\s*icon:\s*"☼",\s*number:\s*"16",\s*description:\s*"چهار سرنوشت آتش و راه رسیدن به هر پایان",\s*\},)'
  $replacement = '$1' + "`r`n  {`r`n    id: `"lore`",`r`n    title: `"LORE ARCHIVE`",`r`n    fa: `"دانشنامه داستان و جهان`",`r`n    icon: `"☼`",`r`n    number: `"17`",`r`n    description: `"تاریخ جهان، شخصیت‌ها، رازها و ارتباطات داستانی`",`r`n  },"
  $updated = [regex]::Replace($source, $pattern, $replacement, 1)
  if ($updated -eq $source) { throw "جایگاه افزودن بخش جدید پیدا نشد؛ فایل page.tsx با نسخه ارسالی متفاوت است." }
  $source = $updated
}

$source = $source.Replace("LOTHRIC DATABASE / 16", "LOTHRIC DATABASE / 17")
$source = $source.Replace("<span>16</span>", "<span>17</span>")

if ($source -notmatch 'active\s*===\s*"lore"') {
  $oldDescription = ': "آرشیو اختصاصی " + current.fa + " در دنیای Dark Souls III.";'
  $newDescription = ": active === `"lore`"`r`n                            ? `"دانشنامه جامع داستان Dark Souls III و دو DLC؛ تاریخ جهان، شخصیت‌ها، مکان‌ها، مفاهیم، خط زمانی و ارتباطات داستانی.`"`r`n                            : `"آرشیو اختصاصی `" + current.fa + `" در دنیای Dark Souls III.`";"
  if (-not $source.Contains($oldDescription)) { throw "محل توضیحات آرشیو پیدا نشد." }
  $source = $source.Replace($oldDescription, $newDescription)
}

if ($source -notmatch 'active\s*===\s*"lore"\s*\?\s*\r?\n?\s*<LoreArchive') {
  $oldRender = 'active === "endings" ? (' + "`r`n" + '              <EndingsArchive />' + "`r`n" + '            ) : ('
  if ($source.Contains($oldRender)) {
    $source = $source.Replace($oldRender, 'active === "endings" ? (' + "`r`n" + '              <EndingsArchive />' + "`r`n" + '            ) : active === "lore" ? (' + "`r`n" + '              <LoreArchive />' + "`r`n" + '            ) : (')
  } else {
    $oldRenderCompact = 'active === "endings" ? (' + "`n" + '              <EndingsArchive />' + "`n" + '            ) : ('
    if ($source.Contains($oldRenderCompact)) {
      $source = $source.Replace($oldRenderCompact, 'active === "endings" ? (' + "`n" + '              <EndingsArchive />' + "`n" + '            ) : active === "lore" ? (' + "`n" + '              <LoreArchive />' + "`n" + '            ) : (')
    } else {
      $oldRenderSimple = 'active === "endings" ? <EndingsArchive /> :'
      if ($source.Contains($oldRenderSimple)) {
        $source = $source.Replace($oldRenderSimple, 'active === "endings" ? <EndingsArchive /> : active === "lore" ? <LoreArchive /> :')
      } else {
        throw "محل نمایش EndingsArchive پیدا نشد؛ فایل page.tsx را بررسی کن."
      }
    }
  }
}

Copy-Item $componentSource $componentTarget -Force
Set-Content -Path $pagePath -Value $source -Encoding UTF8
Write-Host ""
Write-Host "LORE ARCHIVE با موفقیت به صفحه DS3 اضافه شد." -ForegroundColor Green
Write-Host "Backup: $backup"
Write-Host "Component: $componentTarget"
Write-Host "حالا اجرا کن: npm.cmd run build"
