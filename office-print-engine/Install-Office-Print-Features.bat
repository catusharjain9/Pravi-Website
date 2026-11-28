@echo off
setlocal
cd /d "%~dp0"
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0Install-Office-Print-Features.ps1"
if errorlevel 1 (
  echo.
  echo Upgrade did not complete. Review the log in the MFP Print & Scan Server logs folder.
)
endlocal
