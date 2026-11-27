// Plain data with no runtime dependencies, so the UI bundle can import it
// without pulling Elysia/TypeBox into the browser.
import type { StyleConfig } from './schema';

export interface StylePreset {
  id: string;
  name: string;
  description: string;
  previewGradient: string;
  config: Partial<StyleConfig>;
}

export const BUILT_IN_PRESETS: StylePreset[] = [
  {
    id: 'minimal-monochrome',
    name: '⚫ Minimal Monochrome',
    description: 'High-contrast luxury black and pure white aesthetic',
    previewGradient: 'from-black via-zinc-900 to-white',
    config: {
      presetName: '⚫ Minimal Monochrome',
      fontFamily: 'Prompt',
      fontSize: 34,
      translationFontSize: 28,
      textColor: '#ffffff',
      sourceTextColor: '#ffffff',
      secondaryTextColor: '#ffffff',
      thirdTextColor: '#cccccc',
      outlineColor: '#000000',
      outlineWidth: 4,
      glowColor: '#ffffff',
      glowBlur: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderRadius: 14,
      layoutPreset: 'stacked',
      alignment: 'center',
      prefixStyle: 'code',
      autoFadeSeconds: 6,
      showSourceText: true,
      showRomaji: false,
    }
  },
  {
    id: 'sakura-neon',
    name: '🌸 Sakura Neon',
    description: 'Vibrant sakura pink and cyber cyan with soft neon glow',
    previewGradient: 'from-pink-500 via-purple-500 to-cyan-400',
    config: {
      presetName: '🌸 Sakura Neon',
      fontFamily: 'M PLUS Rounded 1c',
      fontSize: 34,
      translationFontSize: 28,
      textColor: '#ffffff',
      sourceTextColor: '#ffea79',
      secondaryTextColor: '#ff79c6',
      thirdTextColor: '#8be9fd',
      outlineColor: '#0d1117',
      outlineWidth: 4,
      glowColor: '#ff79c6',
      glowBlur: 12,
      backgroundColor: 'rgba(15, 23, 42, 0.78)',
      borderRadius: 18,
      layoutPreset: 'stacked',
      alignment: 'center',
      prefixStyle: 'code',
      autoFadeSeconds: 6,
      showSourceText: true,
      showRomaji: false,
    }
  },
  {
    id: 'cyberpunk-cyan',
    name: '⚡ Cyberpunk 2077',
    description: 'High-contrast cyan & acid yellow with heavy dark outline',
    previewGradient: 'from-cyan-400 via-blue-500 to-yellow-400',
    config: {
      presetName: '⚡ Cyberpunk 2077',
      fontFamily: 'Outfit',
      fontSize: 36,
      translationFontSize: 28,
      textColor: '#00f0ff',
      sourceTextColor: '#ffe600',
      secondaryTextColor: '#ffe600',
      thirdTextColor: '#ffffff',
      outlineColor: '#050811',
      outlineWidth: 5,
      glowColor: '#00f0ff',
      glowBlur: 16,
      backgroundColor: 'rgba(5, 8, 17, 0.90)',
      borderRadius: 8,
      layoutPreset: 'stacked',
      alignment: 'center',
      prefixStyle: 'code',
      autoFadeSeconds: 5,
      showSourceText: true,
      showRomaji: false,
    }
  },
  {
    id: 'manga-bubble',
    name: '💬 Anime Manga Bubble',
    description: 'Clean comic book styling with rounded white speech box',
    previewGradient: 'from-amber-200 via-rose-300 to-indigo-400',
    config: {
      presetName: '💬 Anime Manga Bubble',
      fontFamily: 'Zen Maru Gothic',
      fontSize: 32,
      translationFontSize: 26,
      textColor: '#1a1a2e',
      sourceTextColor: '#e94560',
      secondaryTextColor: '#e94560',
      thirdTextColor: '#0f3460',
      outlineColor: '#ffffff',
      outlineWidth: 2,
      glowColor: '#ffffff',
      glowBlur: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: 24,
      layoutPreset: 'manga-bubble',
      alignment: 'center',
      prefixStyle: 'code',
      autoFadeSeconds: 7,
      showSourceText: true,
      showRomaji: false,
    }
  },
  {
    id: 'esports-minimal',
    name: '🏆 Esports Minimalist',
    description: 'Ultra-clean, distraction-free tournament bottom subtitle',
    previewGradient: 'from-slate-700 via-slate-800 to-slate-900',
    config: {
      presetName: '🏆 Esports Minimalist',
      fontFamily: 'Inter',
      fontSize: 30,
      translationFontSize: 24,
      textColor: '#ffffff',
      sourceTextColor: '#94a3b8',
      secondaryTextColor: '#38bdf8',
      thirdTextColor: '#4ade80',
      outlineColor: '#000000',
      outlineWidth: 4,
      glowColor: '#000000',
      glowBlur: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.65)',
      borderRadius: 6,
      layoutPreset: 'minimal-bottom',
      alignment: 'left',
      prefixStyle: 'code',
      autoFadeSeconds: 5,
      showSourceText: true,
      showRomaji: false,
    }
  }
];
