@echo off
setlocal
cd /d "%~dp0\.."
title Building VTuber AI Subtitle & Live Translator .EXE

echo ========================================================
echo   VTuber Real-Time AI Subtitle & Live Translator (.EXE)
echo   1-Click Build Automation Script
echo ========================================================
echo.

where bun >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Bun is not installed or not in PATH!
    echo Please install Bun from https://bun.sh
    pause
    exit /b 1
)

echo [1/3] Installing dependencies...
call bun install
if %errorlevel% neq 0 (
    echo [ERROR] bun install failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Compiling standalone .EXE and assets...
call bun run scripts/build-exe.ts
if %errorlevel% neq 0 (
    echo [ERROR] Compilation failed!
    pause
    exit /b 1
)

echo.
echo ========================================================
echo   BUILD SUCCESSFUL!
echo   Output located in: dist\vtuber-subtitle-server.exe
echo ========================================================
echo.
pause
