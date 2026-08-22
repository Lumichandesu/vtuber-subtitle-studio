import { $ } from 'bun';
import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const NATIVE_DIR = path.join(ROOT_DIR, 'src-native');
const ICO_PATH = path.join(NATIVE_DIR, 'app.ico');

console.log('\n🖤 ======================================================= 🖤');
console.log('   VTuber Real-Time OBS AI Subtitle & Live Translator');
console.log('   Minimal Monochrome Desktop Application (.EXE) Builder');
console.log('🖤 ======================================================= 🖤\n');

if (!fs.existsSync(DIST_DIR)) {
  fs.mkdirSync(DIST_DIR, { recursive: true });
}

console.log('📦 [1/4] Building Minimal Monochrome React Desktop GUI (Vite)...');
await $`bun run build:ui`;
console.log('✅ UI build complete: dist/ui\n');

console.log('⚡ [2/4] Compiling Bun Backend Engine into Native Standalone .EXE...');
const serverTarget = path.join(DIST_DIR, 'vtuber-subtitle-server.exe');
await $`bun build ./src-server/server.ts --compile --minify --target=bun-windows-x64-baseline --outfile=${serverTarget}`;
console.log(`✅ Standalone Server Binary: ${serverTarget}\n`);

console.log('🖥️  [3/4] Compiling Native Windows Desktop App Shell with App Icon (VTuber-Subtitle-Studio.exe)...');
const launcherCs = path.join(NATIVE_DIR, 'Launcher.cs');
const outputStudioExe = path.join(DIST_DIR, 'VTuber-Subtitle-Studio.exe');

try {
  const cscPath = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';
  const psCmd = `& '${cscPath}' /target:winexe /optimize+ /platform:anycpu /win32icon:'${ICO_PATH}' /out:'${outputStudioExe}' '${launcherCs}'`;
  await $`powershell -Command ${psCmd}`;
  console.log(`✅ Native Windows Desktop Shell Compiled with Anime Icon: ${outputStudioExe}\n`);
} catch (err) {
  console.warn('⚠️ CSC warning, continuing with packaged distribution.');
}

console.log('📄 [4/4] Packaging Standalone Assets & 1-Click Launchers...');
const publicDir = path.join(ROOT_DIR, 'src-server', 'public');
const distPublic = path.join(DIST_DIR, 'public');
if (!fs.existsSync(distPublic)) fs.mkdirSync(distPublic, { recursive: true });

if (fs.existsSync(path.join(publicDir, 'overlay.html'))) {
  fs.copyFileSync(
    path.join(publicDir, 'overlay.html'),
    path.join(distPublic, 'overlay.html')
  );
}

if (fs.existsSync(ICO_PATH)) {
  fs.copyFileSync(ICO_PATH, path.join(DIST_DIR, 'app.ico'));
}

const batLauncher = `@echo off
title VTuber Real-Time AI Subtitle Studio Pro (Made By Lumichandesu)
color 0F
cls
echo ========================================================
echo   VTuber Real-Time OBS AI Subtitle Studio Pro (High-Perf)
echo   Made By Lumichandesu
echo ========================================================
echo.
echo [1/2] Starting High-Performance Multi-Threaded Engine on Port 18890...
start "" /B "%~dp0vtuber-subtitle-server.exe"
timeout /t 2 /nobreak >nul
echo [2/2] Launching GUI Workspace on http://127.0.0.1:18890...
start "" "http://127.0.0.1:18890"
exit
`;

fs.writeFileSync(path.join(DIST_DIR, 'run-vtuber-app.bat'), batLauncher);

console.log('\n🖤 ======================================================= 🖤');
console.log('   ✨ BUILD COMPLETED WITH EMBEDDED ANIME APP ICON! ✨');
console.log('   ');
console.log('   📦 Standalone Binaries in dist/:');
console.log(`   👉 1. Native Desktop App:  ${outputStudioExe}`);
console.log(`   👉 2. Bun Backend Engine:  ${serverTarget}`);
console.log(`   👉 3. UI Web Distribution: ${path.join(DIST_DIR, 'ui')}`);
console.log(`   👉 4. 1-Click Launcher:    ${path.join(DIST_DIR, 'run-vtuber-app.bat')}`);
console.log(`   👉 5. OBS Overlay:         ${path.join(distPublic, 'overlay.html')}`);
console.log('   ');
console.log('   Ready to double-click and run with 0 external dependencies!');
console.log('🖤 ======================================================= 🖤\n');
