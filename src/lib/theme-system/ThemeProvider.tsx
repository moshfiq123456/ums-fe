'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  FC,
  ReactNode,
} from 'react';
import { DEFAULT_THEME_ID, getTheme, getThemeList, ThemeDefinition, ThemeMeta } from './themes';


// ─── Types ─────────────────────────────────────────────────

type ColorMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  /** Current theme id (e.g. 'arctic-blue') */
  themeId: string;
  /** Current theme definition with all colors */
  theme: ThemeDefinition;
  /** Current color mode */
  colorMode: ColorMode;
  /** Resolved mode (never 'system') */
  resolvedMode: 'light' | 'dark';
  /** Switch to a different theme */
  setThemeId: (id: string) => void;
  /** Switch color mode */
  setColorMode: (mode: ColorMode) => void;
  /** List of all available themes (for building pickers) */
  availableThemes: ThemeMeta[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────

interface ThemeProviderProps {
  children: ReactNode;
  /** Override default theme. Can be set from env:
   *  NEXT_PUBLIC_THEME_ID in .env.local */
  defaultThemeId?: string;
  /** Override default color mode */
  defaultColorMode?: ColorMode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  defaultThemeId,
  defaultColorMode = 'light',
}) => {
  // Resolve initial theme: prop > env > fallback
  const envThemeId = process.env.NEXT_PUBLIC_THEME_ID;
  const initialThemeId = defaultThemeId || envThemeId || DEFAULT_THEME_ID;

  const [themeId, setThemeId] = useState<string>(initialThemeId);
  const [colorMode, setColorMode] = useState<ColorMode>(defaultColorMode);
  const [systemDark, setSystemDark] = useState<boolean>(false);

  const theme = getTheme(themeId);
  const resolvedMode: 'light' | 'dark' =
    colorMode === 'system' ? (systemDark ? 'dark' : 'light') : colorMode;

  // Listen to system preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mq.matches);

    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Inject CSS custom properties into :root
  useEffect(() => {
    const colors = resolvedMode === 'dark' ? theme.dark : theme.light;
    const root = document.documentElement;

    // Set each CSS variable
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Set radius (consistent across themes)
    root.style.setProperty('--radius', '0.625rem');

    // Toggle .dark class for tailwind dark variant
    if (resolvedMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Set data attribute for easy CSS targeting
    root.setAttribute('data-theme', themeId);
    root.setAttribute('data-color-mode', resolvedMode);
  }, [themeId, resolvedMode, theme]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('app-theme-id', themeId);
      localStorage.setItem('app-color-mode', colorMode);
    } catch (_e: unknown) {
      // SSR or storage unavailable
    }
  }, [themeId, colorMode]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const savedTheme: string | null = localStorage.getItem('app-theme-id');
      const savedMode: string | null = localStorage.getItem('app-color-mode');
      if (savedTheme && typeof savedTheme === 'string') setThemeId(savedTheme);
      if (savedMode && ['light', 'dark', 'system'].includes(savedMode)) {
        setColorMode(savedMode as ColorMode);
      }
    } catch (_e: unknown) {
      // SSR or storage unavailable
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value: ThemeContextValue = {
    themeId,
    theme,
    colorMode,
    resolvedMode,
    setThemeId: useCallback((id: string) => {
      const resolved = getTheme(id);
      if (resolved) setThemeId(id);
    }, []),
    setColorMode: useCallback((mode: ColorMode) => setColorMode(mode), []),
    availableThemes: getThemeList(),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ─── Hook ──────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a <ThemeProvider>');
  }
  return ctx;
}