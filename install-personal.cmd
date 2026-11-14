@echo off
setlocal
cd /d "%~dp0"

call pnpm install --frozen-lockfile
if errorlevel 1 exit /b %errorlevel%
pushd mobile
call pnpm install --frozen-lockfile
if errorlevel 1 (
  popd
  exit /b 1
)
popd

call pnpm build:release
if errorlevel 1 exit /b %errorlevel%
call pnpm ensure:electron-runtime
if errorlevel 1 exit /b %errorlevel%
call pnpm exec electron-builder --config config/electron-builder.config.cjs --win --publish never
if errorlevel 1 exit /b %errorlevel%

if not exist "dist\orca-windows-setup.exe" (
  echo Installer not found in dist.
  exit /b 1
)
echo Installer built at %CD%\dist\orca-windows-setup.exe
if /i "%~1"=="--install" start "" /wait "dist\orca-windows-setup.exe"
exit /b %errorlevel%
