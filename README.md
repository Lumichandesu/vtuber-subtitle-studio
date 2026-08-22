# 🌸 VTuber Real-Time OBS AI Subtitle & Live Translator (Community Edition)

<p align="center">
  <img src="src-ui/app-icon.png" width="130" height="130" alt="VTuber Subtitle Studio Icon" />
</p>

<p align="center">
  <b>Ultra Low-Latency (< 40ms) AI Subtitles & Live Simultaneous Translator for VTubers & Streamers</b><br>
  <i>Supports Simultaneous Thai (TH) ✦ Japanese (JP) ✦ English (EN)</i>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License: MIT" /></a>
  <img src="https://img.shields.io/badge/Bun-1.3+-black.svg" alt="Bun" />
  <img src="https://img.shields.io/badge/React-19-cyan.svg" alt="React 19" />
  <img src="https://img.shields.io/badge/OBS-Browser_Source_100%25-purple.svg" alt="OBS" />
  <a href="https://github.com/Lumichandesu"><img src="https://img.shields.io/badge/Made%20With%20%E2%99%A5%20By-Lumichandesu-pink.svg" alt="Lumichandesu" /></a>
</p>

---

## 🌟 Overview

**VTuber Subtitle Studio** is a standalone, ultra-low-latency real-time AI subtitle generator and live translator tailored specifically for VTubers and live streamers. It connects seamlessly to **OBS Studio** via a 100% transparent browser overlay with zero watermarks.

---

## ✨ Free Community Edition Features

- 🎙️ **Dual-Worker Ping-Pong STT Engine**: Continuous speech recognition that never stalls or freezes mid-stream.
- ⚡ **Neural AI Translation (< 40ms)**: Fast, free neural translation with zero memory buffer locks.
- 🌸 **Anime Font & Styling Studio**: Real-time customizable neon glow, stroke outlines, and Google Fonts.
- 📺 **1-Click OBS Browser Source Overlay**: 100% transparent, zero watermarks, zero ghosting, and auto-fade.
- 🛡️ **Hardened Loopback Security**: Binds strictly to `127.0.0.1` with active path traversal protections.
- 🎌 **Full Trilingual UI Localization**: Instant 1-click switching between Thai (TH), Japanese (JP), and English (EN).

---

## 👑 Want the PRO Version?

Support **Lumichandesu** and get the **Full PRO Edition on Gumroad**:

- 🌟 **Simultaneous Dual-Target Translation** (Speak Thai ➔ Output Japanese & English simultaneously on screen)
- 🎯 **48kHz Studio Vocal DSP Mastering** (80Hz Highpass + 3.8kHz Presence EQ + Dynamic Compressor)
- 🤖 **Custom AI Translation Models** (Connect your personal Google Gemini 2.5 Flash / GPT-4o-mini API keys)
- 🎬 **VOD Subtitle Export (.SRT / .VTT)** (Export complete stream transcripts in 1 click for YouTube clips)
- 📖 **Custom VTuber Slang & Glossary Dictionary**
- 🎹 **Stream Soundboard Hotkeys** (1-Click trigger for common stream phrases)
- 📦 **1-Click Standalone Windows `.EXE`** (Zero installation required)

👉 **[Get VTuber Subtitle Studio PRO on Gumroad](https://lumichandesu.gumroad.com/l/VTuber-Subtitle-Studio)** 💖

---

## 🚀 Quick Start (Developers / Free Edition)

### Prerequisites
- [Bun](https://bun.sh) (v1.1+)
- Windows 10 / 11

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/Lumichandesu/vtuber-subtitle-studio.git
cd vtuber-subtitle-studio

# 2. Install dependencies
bun install

# 3. Start development mode
bun run dev
```

The app will open on `http://127.0.0.1:18890` with the OBS Overlay ready at `http://127.0.0.1:18890/overlay`.

---

## 📜 License

This Community Edition is open-sourced under the [MIT License](LICENSE).  
Created with love by [Lumichandesu](https://github.com/Lumichandesu) 💖
