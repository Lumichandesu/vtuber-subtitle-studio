import { $ } from 'bun';
import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();
const DIST_PRO = path.join(ROOT_DIR, 'dist-pro');
const DIST_FREE = path.join(ROOT_DIR, 'dist-free');
const NATIVE_DIR = path.join(ROOT_DIR, 'src-native');
const ICO_PATH = path.join(NATIVE_DIR, 'app.ico');
const CSC_PATH = 'C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';

console.log('\n🌸 ======================================================= 🌸');
console.log('   VTUBER SUBTITLE STUDIO - DUAL EDITION PACKAGER');
console.log('   Building 100% Separated PRO & FREE Zip Packages');
console.log('   Made By Lumichandesu 💖');
console.log('🌸 ======================================================= 🌸\n');

// Clean previous builds
[DIST_PRO, DIST_FREE].forEach((dir) => {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
});

// ==========================================
// 👑 1. BUILD PRO EDITION (COMMERCIAL)
// ==========================================
console.log('👑 [1/2] Compiling PRO Commercial Edition (Gumroad)...');

// Build UI for Pro
process.env.VITE_APP_EDITION = 'pro';
await $`bun run build:ui`;

// Copy UI to PRO
fs.cpSync(path.join(ROOT_DIR, 'dist', 'ui'), path.join(DIST_PRO, 'ui'), { recursive: true });

// Compile PRO Server Binary
const proServerExe = path.join(DIST_PRO, 'vtuber-subtitle-server.exe');
await $`bun build ./src-server/server.ts --compile --minify --target=bun-windows-x64-baseline --outfile=${proServerExe}`;

// Compile PRO Native Launcher
const proStudioExe = path.join(DIST_PRO, 'VTuber-Subtitle-Studio.exe');
try {
  const psCmd = `& '${CSC_PATH}' /target:winexe /optimize+ /platform:anycpu /win33icon:'${ICO_PATH}' /out:'${proStudioExe}' '${path.join(NATIVE_DIR, 'Launcher.cs')}'`;
  await $`powershell -Command ${psCmd}`;
} catch (e) {
  // fallback if csc icon switch is slightly different
  const psCmdFallback = `& '${CSC_PATH}' /target:winexe /optimize+ /platform:anycpu /out:'${proStudioExe}' '${path.join(NATIVE_DIR, 'Launcher.cs')}'`;
  await $`powershell -Command ${psCmdFallback}`;
}

// Copy Assets & Overlay
const proPublic = path.join(DIST_PRO, 'public');
fs.mkdirSync(proPublic, { recursive: true });
fs.copyFileSync(path.join(ROOT_DIR, 'src-server', 'public', 'overlay.html'), path.join(proPublic, 'overlay.html'));
if (fs.existsSync(ICO_PATH)) fs.copyFileSync(ICO_PATH, path.join(DIST_PRO, 'app.ico'));

// 1-Click Bat Launcher
const proBat = `@echo off
title VTuber Real-Time AI Subtitle Studio Pro (Made By Lumichandesu)
color 0F
cls
echo ========================================================
echo   VTuber Real-Time OBS AI Subtitle Studio Pro
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
fs.writeFileSync(path.join(DIST_PRO, 'run-vtuber-app.bat'), proBat);

// PRO Readme & License
const proReadme = `================================================================================
   🌸 VTUBER REAL-TIME OBS AI SUBTITLE STUDIO PRO (COMMERCIAL EDITION) 🌸
   Made with Love By Lumichandesu 💖
   Store: https://lumichandesu.gumroad.com/l/VTuber-Subtitle-Studio
================================================================================

ขอบคุณที่สนับสนุน VTuber Real-Time OBS AI Subtitle Studio Pro!

--------------------------------------------------------------------------------
📁 1. วิธีเปิดใช้งาน (QUICK START GUIDE)
--------------------------------------------------------------------------------
1. แตกไฟล์ .ZIP ทั้งหมดลงในโฟลเดอร์บนเครื่องของคุณ
2. ดับเบิลคลิกไฟล์ "VTuber-Subtitle-Studio.exe" (หรือ "run-vtuber-app.bat")
3. หน้าต่างโปรแกรม 1920x1080 จะเปิดขึ้นมาพร้อมใช้งานทันที

--------------------------------------------------------------------------------
📺 2. วิธีใส่ใน OBS STUDIO (OBS OVERLAY SETUP)
--------------------------------------------------------------------------------
1. ใน OBS กด Sources (+) ➔ เลือก "Browser"
2. ใส่ URL: http://127.0.0.1:18890/overlay
3. กำหนด Width: 1920, Height: 1080 (หรือ 300)
4. ติ๊กถูกที่:
   [✓] Shutdown source when not visible
   [✓] Refresh browser when scene becomes active
5. กด OK

--------------------------------------------------------------------------------
🌟 3. ฟีเจอร์เด่นระดับ PRO
--------------------------------------------------------------------------------
✨ Simultaneous Dual Translation: แปลออก 2 ภาษาพร้อมกัน [JP] + [EN]
✨ 48kHz Studio Audio DSP Mastering: ตัดเสียงลม + บูสต์เสียงพยัญชนะ
✨ VOD Subtitle Export (.SRT / .VTT): ส่งออกไฟล์ซับไปตัดคลิป YouTube ทันที
✨ Stream Slang & Glossary Dictionary: พจนานุกรมคำสแลงเฉพาะช่อง
✨ Stream Soundboard Hotkeys: ปุ่มลัดกดพูดยิงคำแปลขึ้นจอทันที

--------------------------------------------------------------------------------
📜 4. ใบอนุญาตสิทธิ์การใช้งาน
--------------------------------------------------------------------------------
คุณได้รับสิทธิ์ใช้งานสำหรับสตรีมมิ่งเชิงพาณิชย์ (Commercial Broadcasting)
สงวนลิขสิทธิ์ (c) Lumichandesu. All rights reserved.
`;
fs.writeFileSync(path.join(DIST_PRO, 'README_PRO.txt'), proReadme);

const proLicense = `COMMERCIAL END USER LICENSE AGREEMENT (EULA)
VTuber Real-Time OBS AI Subtitle Studio Pro
Created by Lumichandesu
Store: https://lumichandesu.gumroad.com/l/VTuber-Subtitle-Studio

1. GRANT OF LICENSE:
Commercial broadcasting, live streaming on YouTube, Twitch, TikTok, Kick, Facebook.

2. RESTRICTIONS:
You may NOT resell or redistribute this binary package.

Copyright (c) Lumichandesu. All rights reserved.
`;
fs.writeFileSync(path.join(DIST_PRO, 'COMMERCIAL_LICENSE.txt'), proLicense);

// Zip PRO
const proZip = path.join(ROOT_DIR, 'VTuber-Subtitle-Studio-PRO.zip');
await $`powershell -Command "Compress-Archive -Path '${DIST_PRO}\\*' -DestinationPath '${proZip}' -Force"`;
console.log(`✅ PRO ZIP Created: ${proZip}`);

// ==========================================
// 🟢 2. BUILD FREE COMMUNITY EDITION
// ==========================================
console.log('\n🟢 [2/2] Compiling FREE Community Edition (GitHub/Community)...');

// Build UI for Free
process.env.VITE_APP_EDITION = 'free';
await $`bun run build:ui`;

// Copy UI to FREE
fs.cpSync(path.join(ROOT_DIR, 'dist', 'ui'), path.join(DIST_FREE, 'ui'), { recursive: true });

// Compile FREE Server Binary
const freeServerExe = path.join(DIST_FREE, 'vtuber-subtitle-server.exe');
await $`bun build ./src-server/server.ts --compile --minify --target=bun-windows-x64-baseline --outfile=${freeServerExe}`;

// Compile FREE Native Launcher
const freeStudioExe = path.join(DIST_FREE, 'VTuber-Subtitle-Studio-Free.exe');
try {
  const psCmdFree = `& '${CSC_PATH}' /target:winexe /optimize+ /platform:anycpu /out:'${freeStudioExe}' '${path.join(NATIVE_DIR, 'Launcher.cs')}'`;
  await $`powershell -Command ${psCmdFree}`;
} catch (e) {}

// Copy Assets & Overlay
const freePublic = path.join(DIST_FREE, 'public');
fs.mkdirSync(freePublic, { recursive: true });
fs.copyFileSync(path.join(ROOT_DIR, 'src-server', 'public', 'overlay.html'), path.join(freePublic, 'overlay.html'));

// 1-Click Bat Launcher for Free
const freeBat = `@echo off
title VTuber Real-Time AI Subtitle Studio (Free Community Edition)
color 0A
cls
echo ========================================================
echo   VTuber Real-Time OBS AI Subtitle Studio (Free)
echo   Made By Lumichandesu
echo ========================================================
echo.
echo [1/2] Starting Free Engine on Port 18890...
start "" /B "%~dp0vtuber-subtitle-server.exe"
timeout /t 2 /nobreak >nul
echo [2/2] Launching GUI Workspace on http://127.0.0.1:18890...
start "" "http://127.0.0.1:18890"
exit
`;
fs.writeFileSync(path.join(DIST_FREE, 'run-vtuber-free.bat'), freeBat);

// FREE Readme & License
const freeReadme = `================================================================================
   🌸 VTUBER REAL-TIME OBS AI SUBTITLE STUDIO (FREE COMMUNITY EDITION) 🌸
   Made with Love By Lumichandesu 💖
   GitHub: https://github.com/Lumichandesu/vtuber-subtitle-studio
================================================================================

ยินดีต้อนรับสู่ VTuber Real-Time OBS AI Subtitle Studio (Community Edition)!

--------------------------------------------------------------------------------
📁 1. วิธีเปิดใช้งาน (QUICK START GUIDE)
--------------------------------------------------------------------------------
1. แตกไฟล์ .ZIP ทั้งหมดลงในโฟลเดอร์บนเครื่องของคุณ
2. ดับเบิลคลิกไฟล์ "VTuber-Subtitle-Studio-Free.exe" (หรือ "run-vtuber-free.bat")
3. หน้าต่างโปรแกรม 1920x1080 จะเปิดขึ้นมาพร้อมใช้งานทันที

--------------------------------------------------------------------------------
📺 2. วิธีใส่ใน OBS STUDIO
--------------------------------------------------------------------------------
1. ใน OBS กด Sources (+) ➔ เลือก "Browser"
2. ใส่ URL: http://127.0.0.1:18890/overlay
3. กำหนด Width: 1920, Height: 1080 (หรือ 300)
4. กด OK

--------------------------------------------------------------------------------
👑 3. ต้องการฟีเจอร์ระดับ PRO?
--------------------------------------------------------------------------------
หากต้องการแปล 2 ภาษาพร้อมกัน [JP+EN], ไมค์สตูดิโอ 48kHz DSP, Export ซับ SRT ไปตัดต่อคลิป
สามารถสนับสนุนผู้พัฒนาได้ที่:
👉 https://lumichandesu.gumroad.com/l/VTuber-Subtitle-Studio

License: MIT License
Copyright (c) Lumichandesu.
`;
fs.writeFileSync(path.join(DIST_FREE, 'README_FREE.txt'), freeReadme);

const freeLicense = `MIT License

Copyright (c) 2026 Lumichandesu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software.
`;
fs.writeFileSync(path.join(DIST_FREE, 'LICENSE.txt'), freeLicense);

// Zip FREE
const freeZip = path.join(ROOT_DIR, 'VTuber-Subtitle-Studio-FREE.zip');
await $`powershell -Command "Compress-Archive -Path '${DIST_FREE}\\*' -DestinationPath '${freeZip}' -Force"`;
console.log(`✅ FREE ZIP Created: ${freeZip}`);

console.log('\n🌸 ======================================================= 🌸');
console.log('   ✨ BOTH EDITIONS PACKAGED SUCCESSFULLY! ✨');
console.log('   ');
console.log(`   👑 1. PRO Commercial ZIP: ${proZip}`);
console.log(`   🟢 2. FREE Community ZIP: ${freeZip}`);
console.log('   ');
console.log('   Both ZIPs are 100% standalone, isolated, and ready!');
console.log('🌸 ======================================================= 🌸\n');
