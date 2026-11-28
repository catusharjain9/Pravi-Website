#requires -Version 5.1
$ErrorActionPreference = 'Stop'
$root = Join-Path $env:LOCALAPPDATA 'MFP Print & Scan Server'
$logPath = Join-Path $root 'logs\engine-upgrade.log'
$tag = 'office-print-engine-latest'
$releaseBase = 'https://github.com/catusharjain9/Pravi-Website/releases/download/' + $tag
$zipUrl = $releaseBase + '/mfp-server-upgraded.zip'
$hashUrl = $releaseBase + '/mfp-server-upgraded.sha256'
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$temp = Join-Path $env:TEMP ('PRAVI-OfficePrint-Upgrade-' + $timestamp)
$backup = Join-Path $root ('backup\engine-' + $timestamp)
$powershell = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'

function Write-Log([string]$message) {
    New-Item -ItemType Directory -Path (Split-Path -Parent $logPath) -Force | Out-Null
    Add-Content -LiteralPath $logPath -Value ('{0} {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $message) -Encoding UTF8
}
function Test-LocalPortal {
    try {
        $response = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/login' -UseBasicParsing -TimeoutSec 4 -MaximumRedirection 3
        return ($response.StatusCode -eq 200)
    } catch { return $false }
}
function Start-PortalWatchdog {
    $task = Get-ScheduledTask -TaskName 'MFP Print & Scan Server - Watchdog' -ErrorAction SilentlyContinue
    if ($task) { Start-ScheduledTask -TaskName 'MFP Print & Scan Server - Watchdog' -ErrorAction SilentlyContinue; return }
    $exe = Join-Path $root 'mfp-server.exe'
    if (Test-Path $exe) {
        Start-Process -FilePath $exe -ArgumentList ('--log-file "{0}"' -f (Join-Path $root 'logs\server.log')) -WorkingDirectory $root -WindowStyle Hidden
    }
}

# Elevate so the running print engine and its scheduled task can be restarted safely.
$identity = [Security.Principal.WindowsIdentity]::GetCurrent()
$principal = New-Object Security.Principal.WindowsPrincipal($identity)
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    $args = '-NoProfile -ExecutionPolicy Bypass -File "{0}"' -f $PSCommandPath
    Start-Process -FilePath $powershell -Verb RunAs -ArgumentList $args -Wait
    exit
}

try {
    if (-not (Test-Path (Join-Path $root 'mfp-server.exe'))) { throw "Existing print engine was not found in $root." }
    if (-not (Test-Path (Join-Path $root 'config.ini'))) { throw 'config.ini was not found; refusing to modify an unexpected installation.' }
    if (-not (Test-Path (Join-Path $root '_internal'))) { throw 'Existing _internal folder was not found; refusing to replace an incomplete installation.' }
    if (-not (Test-LocalPortal)) { Write-Log 'NOTICE: Local portal was not responding before upgrade.' }

    New-Item -ItemType Directory -Path $temp -Force | Out-Null
    New-Item -ItemType Directory -Path $backup -Force | Out-Null
    Write-Host 'Downloading the verified PRAVI print engine upgrade...' -ForegroundColor Cyan
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $zipUrl -OutFile (Join-Path $temp 'mfp-server-upgraded.zip') -UseBasicParsing
    Invoke-WebRequest -Uri $hashUrl -OutFile (Join-Path $temp 'mfp-server-upgraded.sha256') -UseBasicParsing
    $expectedLine = (Get-Content -LiteralPath (Join-Path $temp 'mfp-server-upgraded.sha256') -Raw).Trim()
    if ($expectedLine -notmatch '^([a-fA-F0-9]{64})\s+') { throw 'The release checksum file has an invalid format.' }
    $expectedHash = $Matches[1].ToLowerInvariant()
    $actualHash = (Get-FileHash -LiteralPath (Join-Path $temp 'mfp-server-upgraded.zip') -Algorithm SHA256).Hash.ToLowerInvariant()
    if ($actualHash -ne $expectedHash) { throw 'The downloaded print-engine ZIP failed its SHA-256 verification.' }

    Expand-Archive -LiteralPath (Join-Path $temp 'mfp-server-upgraded.zip') -DestinationPath (Join-Path $temp 'new') -Force
    $newExe = Join-Path $temp 'new\mfp-server.exe'
    $newInternal = Join-Path $temp 'new\_internal'
    if (-not (Test-Path $newExe) -or -not (Test-Path $newInternal)) { throw 'The downloaded engine package is missing mfp-server.exe or _internal.' }

    Write-Log 'Starting print-engine replacement; existing config and data are preserved.'
    Stop-ScheduledTask -TaskName 'MFP Print & Scan Server - Watchdog' -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    $targetExe = Join-Path $root 'mfp-server.exe'
    Get-CimInstance Win32_Process -Filter "Name='mfp-server.exe'" -ErrorAction SilentlyContinue |
        Where-Object { $_.ExecutablePath -and ([IO.Path]::GetFullPath($_.ExecutablePath) -ieq [IO.Path]::GetFullPath($targetExe)) } |
        ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
    Start-Sleep -Seconds 2

    Copy-Item -LiteralPath $targetExe -Destination $backup -Force
    Copy-Item -LiteralPath (Join-Path $root '_internal') -Destination $backup -Recurse -Force
    Copy-Item -LiteralPath $newExe -Destination $targetExe -Force
    Remove-Item -LiteralPath (Join-Path $root '_internal') -Recurse -Force
    Copy-Item -LiteralPath $newInternal -Destination $root -Recurse -Force
    Write-Log 'New executable and _internal bundle installed.'

    Start-PortalWatchdog
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 3
        if (Test-LocalPortal) { $ready = $true; break }
    }
    if (-not $ready) { throw 'The upgraded print engine did not become healthy on http://127.0.0.1:8000/login.' }
    Write-Log 'Upgrade successful; local /login returned HTTP 200.'
    Write-Host ''
    Write-Host 'Advanced print settings installed successfully.' -ForegroundColor Green
    Write-Host 'PIN, config.ini, print history, uploads, Cloudflare and cleanup tasks were preserved.' -ForegroundColor Green
    Write-Host 'Test the new page range, pages-per-sheet and Epson manual duplex options from the portal.'
} catch {
    Write-Log ('ERROR: ' + $_.Exception.Message)
    Write-Host ('Upgrade failed: ' + $_.Exception.Message) -ForegroundColor Red
    if ((Test-Path (Join-Path $backup 'mfp-server.exe')) -and (Test-Path (Join-Path $backup '_internal'))) {
        try {
            Stop-ScheduledTask -TaskName 'MFP Print & Scan Server - Watchdog' -ErrorAction SilentlyContinue
            $targetExe = Join-Path $root 'mfp-server.exe'
            Get-CimInstance Win32_Process -Filter "Name='mfp-server.exe'" -ErrorAction SilentlyContinue |
                Where-Object { $_.ExecutablePath -and ([IO.Path]::GetFullPath($_.ExecutablePath) -ieq [IO.Path]::GetFullPath($targetExe)) } |
                ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
            Copy-Item -LiteralPath (Join-Path $backup 'mfp-server.exe') -Destination $targetExe -Force
            Remove-Item -LiteralPath (Join-Path $root '_internal') -Recurse -Force -ErrorAction SilentlyContinue
            Copy-Item -LiteralPath (Join-Path $backup '_internal') -Destination $root -Recurse -Force
            Start-PortalWatchdog
            Write-Log 'Previous engine restored from the local backup.'
            Write-Host 'The previous engine was restored.' -ForegroundColor Yellow
        } catch { Write-Log ('ROLLBACK ERROR: ' + $_.Exception.Message) }
    }
    exit 1
} finally {
    Remove-Item -LiteralPath $temp -Recurse -Force -ErrorAction SilentlyContinue
}

Read-Host 'Press Enter to close' | Out-Null
