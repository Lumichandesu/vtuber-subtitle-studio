import { $ } from 'bun';
import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const PRO_DIR = path.join(ROOT_DIR, 'dist-pro');
const NATIVE_DIR = path.join(ROOT_DIR, 'src-native');
const ICO_PATH = path.join(NATIVE_DIR, 'app.ico');

console.log('\n🌸 ======================================================= 🌸');
console.log('   VTUBER SUBTITLE STUDIO PRO - GUMROAD PACKAGER');
console.log('   Made By Lumichandesu 💖');
console.log('🌸 ======================================================= 🌸\n');

// Clean and prepare dist-pro
if (fs.existsSync(PRO_DIR)) {
  fs.rmSync(PRO_DIR, { recursive: true, force: true });
}
fs.mkdirSync(PRO_DIR, { recursive: true });

// 1. Build UI
console.log('📦 [1/5] Compiling Production UI Web Distribution...');
await $`bun run build:ui`;

// 2. Compile Server EXE
console.log('⚡ [2/5] Compiling Secured Standalone Server Binary...');
const serverTarget = path.join(PRO_DIR, 'vtuber-subtitle-server.exe');
await $`bun build ./src-server/server.ts --compile --minify --target=bun-windows-x64-baseline --outfile=${serverTarget}`;

// 3. Compile Native Launcher EXE with Anime Icon
console.log('🖥️  [3/5] Compiling Native Windows Desktop Shell (VTuber-Subtitle-Studio.exe)...');
const launcherCs = path.join(NATIVE_DIR, 'Launcher.cs');
const outputStudioExe = path.join(PRO_DIR, 'VTuber-Subtitle-Studio.exe');

try {
  const cscPath = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';
  const psCmd = `& '${cscPath}' /target:winexe /optimize+ /platform:anycpu /win32icon:'${ICO_PATH}' /out:'${outputStudioExe}' '${launcherCs}'`;
  await $`powershell -Command ${psCmd}`;
  console.log(`✅ Native Studio Executable: ${outputStudioExe}\n`);
} catch (err) {
  console.warn('⚠️ CSC warning, continuing.');
}

// 4. Copy Assets & Guides
console.log('📄 [4/5] Copying Assets, Public Overlays & Manuals...');
const distUi = path.join(ROOT_DIR, 'dist', 'ui');
const proUi = path.join(PRO_DIR, 'ui');
if (fs.existsSync(distUi)) {
  fs.cpSync(distUi, proUi, { recursive: true });
}

const publicSrc = path.join(ROOT_DIR, 'src-server', 'public');
const proPublic = path.join(PRO_DIR, 'public');
fs.mkdirSync(proPublic, { recursive: true });
if (fs.existsSync(path.join(publicSrc, 'overlay.html'))) {
  fs.copyFileSync(path.join(publicSrc, 'overlay.html'), path.join(proPublic, 'overlay.html'));
}
if (fs.existsSync(ICO_PATH)) {
  fs.copyFileSync(ICO_PATH, path.join(PRO_DIR, 'app.ico'));
}

// 1-Click Bat Launcher
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
fs.writeFileSync(path.join(PRO_DIR, 'run-vtuber-app.bat'), batLauncher);

// Comprehensive User Manual
const readmeContent = `================================================================================
   🌸 VTUBER REAL-TIME OBS AI SUBTITLE STUDIO PRO (COMMERCIAL EDITION) 🌸
   Made with Love By Lumichandesu 💖
   Store: https://lumichandesu.gumroad.com/l/VTuber-Subtitle-Studio
================================================================================

ขอบคุณที่สนับสนุน VTuber Real-Time OBS AI Subtitle Studio Pro!
Thank you for supporting VTuber Real-Time OBS AI Subtitle Studio Pro!

--------------------------------------------------------------------------------
📁 1. วิธีเปิดใช้งาน (QUICK START GUIDE)
--------------------------------------------------------------------------------
1. แตกไฟล์ .ZIP ทั้งหมดลงในโฟลเดอร์บนเครื่องของคุณ (เช่น C:\\VTuberStudio\\)
2. ดับเบิลคลิกไฟล์ "VTuber-Subtitle-Studio.exe" (หรือ "run-vtuber-app.bat")
3. หน้าต่างแอปพลิเคชันสตูดิโอขนาด 1920x1080 จะเปิดขึ้นมาพร้อมใช้งานทันที
4. ไมค์ของคุณจะ Standby พร้อมฟังเสียงทันที ลองพูดเพื่อดูระดับเสียงและคำแปล!

--------------------------------------------------------------------------------
📺 2. วิธีใส่ใน OBS STUDIO (OBS OVERLAY SETUP)
--------------------------------------------------------------------------------
1. เปิดโปรแกรม OBS Studio
2. ในช่อง Sources กดเครื่องหมายบวก (+) ➔ เลือก "Browser" (เบราว์เซอร์)
3. ตั้งชื่อ Source เช่น "Live Subtitles" แล้วกด OK
4. ในช่อง URL ให้ใส่:
   http://127.0.0.1:18890/overlay
5. กำหนดขนาด:
   - Width (ความกว้าง): 1920
   - Height (ความสูง): 1080 (หรือ 300 สำหรับวางล่างจอ)
6. ติ๊กถูกที่:
   [✓] Shutdown source when not visible
   [✓] Refresh browser when scene becomes active
7. กด OK แล้วจัดตำแหน่งซับไตเติลบนหน้าจอสตรีมตามใจชอบ!

--------------------------------------------------------------------------------
🌟 3. ฟีเจอร์เด่นระดับ PRO (PRO FEATURES INCLUDED)
--------------------------------------------------------------------------------
✨ Simultaneous Dual Translation: พูดไทย 1 ประโยค ➔ ออกทั้ง ญี่ปุ่น [JP] + อังกฤษ [EN] พร้อมกัน
✨ Dual-Worker Ping-Pong STT Engine: จับเสียงต่อเนื่องยาวนานตลอดสตรีม ไม่มีหยุดนิ่ง ไม่มีค้าง
✨ 48kHz Studio Audio DSP Mastering: Highpass 80Hz + 3.8kHz Presence EQ บูสต์เสียงพยัญชนะ
✨ VOD Subtitle Export (.SRT / .VTT): กดปุ่ม Export ไทม์ไลน์ไปตัดต่อคลิปลง YouTube ได้ทันที
✨ Stream Slang & Glossary Dictionary: พจนานุกรมคำสแลงเฉพาะช่องของ VTuber
✨ Stream Soundboard Hotkeys: ปุ่มลัดกดพูดคำฮิตยิงคำแปลขึ้น OBS ทันที
✨ Dynamic Anime Font Picker: ดึงฟอนต์จาก Windows ในเครื่อง และ Google Fonts กว่า 20+ แบบ

--------------------------------------------------------------------------------
📜 4. ข้อกำหนดสิทธิ์การใช้งาน (LICENSE)
--------------------------------------------------------------------------------
- คุณได้รับสิทธิ์ใช้งานสำหรับสตรีมมิ่งเชิงพาณิชย์ (Commercial VTuber / YouTube / Twitch Stream)
- ไม่อนุญาตให้นำไฟล์ตัวโปรแกรม (.exe หรือ Source Code) ไปแจกจ่าย ขายต่อ หรือดัดแปลงเพื่อจำหน่ายต่อโดยไม่ได้รับอนุญาต

ขอให้สนุกและมีความสุขกับการสตรีมครับ! 🌸💖⚡
`;
fs.writeFileSync(path.join(PRO_DIR, 'README_PRO.txt'), readmeContent);

const licenseContent = `COMMERCIAL END USER LICENSE AGREEMENT (EULA)
VTuber Real-Time OBS AI Subtitle Studio Pro
Created by Lumichandesu
Store: https://lumichandesu.gumroad.com/l/VTuber-Subtitle-Studio

1. GRANT OF LICENSE:
This license grants you the non-exclusive, non-transferable right to use VTuber Real-Time OBS AI Subtitle Studio Pro for personal, commercial broadcasting, content creation, and live streaming on YouTube, Twitch, TikTok, Kick, Facebook, and any other streaming platform.

2. RESTRICTIONS:
- You may NOT resell, distribute, sublicense, or share the binary package or executable files with unauthorized third parties.
- You may NOT reverse-engineer or repackage this software for commercial sale.

3. DISCLAIMER OF WARRANTY:
The software is provided "AS IS", without warranty of any kind, express or implied.

Copyright (c) Lumichandesu. All rights reserved.
`;
fs.writeFileSync(path.join(PRO_DIR, 'COMMERCIAL_LICENSE.txt'), licenseContent);

// 5. Compress into ZIP Package
console.log('🗜️  [5/5] Compressing into Commercial Gumroad ZIP Distribution...');
const zipOutput = path.join(ROOT_DIR, 'VTuber-Subtitle-Studio-PRO.zip');

const psZipCmd = `Compress-Archive -Path '${PRO_DIR}\\*' -DestinationPath '${zipOutput}' -Force`;
await $`powershell -Command ${psZipCmd}`;

console.log('\n🌸 ======================================================= 🌸');
console.log('   ✨ GUMROAD PRO ZIP PACKAGE CREATED SUCCESSFULLY! ✨');
console.log('   ');
console.log(`   📦 Gumroad Release ZIP: ${zipOutput}`);
console.log(`   📂 Extracted PRO Folder: ${PRO_DIR}`);
console.log(`   🔗 Store Link: https://lumichandesu.gumroad.com/l/VTuber-Subtitle-Studio`);
console.log('   ');
console.log('   Ready for upload and sale on Gumroad! 💖');
console.log('🌸 ======================================================= 🌸\n');
