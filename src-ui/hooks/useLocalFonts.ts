import { useState, useEffect } from 'react';

export interface FontOption {
  family: string;
  category: 'Japanese' | 'Thai' | 'English / Latin' | 'Windows System';
  isLocal?: boolean;
}

export const EXPANDED_FONTS: FontOption[] = [
  // 🇹🇭 Thai Optimized (Top Google Fonts for Streams)
  { family: 'Prompt', category: 'Thai' },
  { family: 'Kanit', category: 'Thai' },
  { family: 'Sarabun', category: 'Thai' },
  { family: 'Mitr', category: 'Thai' },
  { family: 'Chakra Petch', category: 'Thai' },
  { family: 'Itim', category: 'Thai' },
  { family: 'Mali', category: 'Thai' },
  { family: 'Bai Jamjuree', category: 'Thai' },
  { family: 'Taviraj', category: 'Thai' },
  { family: 'Krub', category: 'Thai' },
  { family: 'Charm', category: 'Thai' },
  { family: 'Athiti', category: 'Thai' },
  { family: 'Pattaya', category: 'Thai' },
  { family: 'Pridi', category: 'Thai' },

  // 🇯🇵 Japanese & Anime Optimized (Top Google Fonts)
  { family: 'M PLUS Rounded 1c', category: 'Japanese' },
  { family: 'Noto Sans JP', category: 'Japanese' },
  { family: 'Zen Maru Gothic', category: 'Japanese' },
  { family: 'Dela Gothic One', category: 'Japanese' },
  { family: 'Kosugi Maru', category: 'Japanese' },
  { family: 'Kiwi Maru', category: 'Japanese' },
  { family: 'Yuji Boku', category: 'Japanese' },
  { family: 'Reggae One', category: 'Japanese' },
  { family: 'DotGothic16', category: 'Japanese' },
  { family: 'Hachi Maru Pop', category: 'Japanese' },
  { family: 'RocknRoll One', category: 'Japanese' },
  { family: 'Potta One', category: 'Japanese' },
  { family: 'Yusei Magic', category: 'Japanese' },
  { family: 'Kaisei Decol', category: 'Japanese' },

  // 🇺🇸 English & Modern Display (Top Google Fonts)
  { family: 'Outfit', category: 'English / Latin' },
  { family: 'Fredoka', category: 'English / Latin' },
  { family: 'Inter', category: 'English / Latin' },
  { family: 'Bungee', category: 'English / Latin' },
  { family: 'Montserrat', category: 'English / Latin' },
  { family: 'Righteous', category: 'English / Latin' },
  { family: 'Russo One', category: 'English / Latin' },
  { family: 'Black Han Sans', category: 'English / Latin' },
  { family: 'Titan One', category: 'English / Latin' },
  { family: 'Sniglet', category: 'English / Latin' },

  // 💻 Windows Local System Fonts
  { family: 'Meiryo', category: 'Windows System', isLocal: true },
  { family: 'Yu Gothic', category: 'Windows System', isLocal: true },
  { family: 'MS Gothic', category: 'Windows System', isLocal: true },
  { family: 'Tahoma', category: 'Windows System', isLocal: true },
  { family: 'Segoe UI', category: 'Windows System', isLocal: true },
  { family: 'Arial Rounded MT Bold', category: 'Windows System', isLocal: true },
  { family: 'Impact', category: 'Windows System', isLocal: true },
  { family: 'Leelawadee UI', category: 'Windows System', isLocal: true },
  { family: 'Cordia New', category: 'Windows System', isLocal: true },
];

/**
 * Hook to discover system fonts from Windows and curate multilingual stream fonts
 */
export function useLocalFonts() {
  const [fonts, setFonts] = useState<FontOption[]>(EXPANDED_FONTS);
  const [hasLocalAccess, setHasLocalAccess] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    async function discoverLocalFonts() {
      if ('queryLocalFonts' in window) {
        try {
          const availableFonts: any[] = await (window as any).queryLocalFonts();
          const uniqueFamilies = Array.from(new Set(availableFonts.map((f) => f.family))) as string[];

          const localOptions: FontOption[] = uniqueFamilies.map((fam) => ({
            family: fam,
            category: 'Windows System',
            isLocal: true,
          }));

          const combined = [
            ...EXPANDED_FONTS,
            ...localOptions.filter(
              (l) => !EXPANDED_FONTS.some((p) => p.family.toLowerCase() === l.family.toLowerCase())
            ),
          ];

          setFonts(combined);
          setHasLocalAccess(true);
        } catch (err) {
          console.log('[Fonts] Local font query skipped or denied, using curated stream fonts.');
        }
      }
    }

    discoverLocalFonts();
  }, []);

  const loadFontToDocument = (fontFamily: string) => {
    const isLocal = fonts.find((f) => f.family === fontFamily)?.isLocal;
    if (!isLocal) {
      const fontId = `font-link-${fontFamily.replace(/\s+/g, '+')}`;
      if (!document.getElementById(fontId)) {
        const link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;600;700;800;900&display=swap`;
        document.head.appendChild(link);
      }
    }
  };

  const filteredFonts = activeCategory === 'all'
    ? fonts
    : fonts.filter((f) => f.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return {
    fonts: filteredFonts,
    allFontsCount: fonts.length,
    hasLocalAccess,
    activeCategory,
    setActiveCategory,
    loadFontToDocument,
  };
}
