@echo off
setlocal
cd /d "%~dp0"

for /f "delims=" %%V in ('node -p "process.versions.node.split('.')[0]" 2^>nul') do set "NODE_MAJOR=%%V"
if not "%NODE_MAJOR%"=="24" (
  echo Node.js 24 is required. Add its bin directory to PATH and retry.
  exit /b 1
)
where cargo >nul 2>nul
if errorlevel 1 (
  echo Rust and Cargo are required to build the Windows launchers.
  exit /b 1
)
for /f "delims=" %%V in (config\.bun-version) do set "BUN_VERSION=%%V"
if not defined BUN_VERSION exit /b 1
set "BUN_BOOTSTRAP=%CD%\.build\personal-bun"
call npm install --prefix "%BUN_BOOTSTRAP%" --no-save --ignore-scripts "@oven/bun-windows-x64@%BUN_VERSION%"
if errorlevel 1 exit /b %errorlevel%
set "NODE_PATH=%BUN_BOOTSTRAP%\node_modules;%NODE_PATH%"

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
if not exist "out\orcad-template\orcad-template.json" (
  echo Remote deployment template is missing from out\orcad-template.
  echo Download the orcad-template artifact from the matching personal-template-build workflow run.
  exit /b 1
)
set "ORCA_REQUIRE_ORCAD_TEMPLATE=1"
call pnpm exec electron-builder --config config/electron-builder.config.cjs --win --publish never
if errorlevel 1 exit /b %errorlevel%

if not exist "dist\orca-windows-setup.exe" (
  echo Installer not found in dist.
  exit /b 1
)
echo Installer built at %CD%\dist\orca-windows-setup.exe
if /i "%~1"=="--install" start "" /wait "dist\orca-windows-setup.exe"
exit /b %errorlevel%
