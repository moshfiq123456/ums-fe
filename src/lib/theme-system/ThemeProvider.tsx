'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  FC,
  ReactNode,
} from 'react';
import { DEFAULT_THEME_ID, getTheme, getThemeList, ThemeDefinition, ThemeMeta } from './themes';

// ─── Types ─────────────────────────────────────────────────

type ColorMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  themeId: string;
  theme: ThemeDefinition;
  colorMode: ColorMode;
  resolvedMode: 'light' | 'dark';
  setThemeId: (id: string) => void;
  setColorMode: (mode: ColorMode) => void;
  availableThemes: ThemeMeta[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────

interface ThemeProviderProps {
  children: ReactNode;
  defaultThemeId?: string;
  defaultColorMode?: ColorMode;
}

export const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  defaultThemeId,
  defaultColorMode = 'light',
}) => {
  const envThemeId = process.env.NEXT_PUBLIC_THEME_ID;
  const fallbackThemeId = defaultThemeId || envThemeId || DEFAULT_THEME_ID;

  const [themeId, setThemeId] = useState<string>(() => {
    // Env var always takes priority — never let localStorage override it
    if (envThemeId) return envThemeId;
    try { return localStorage.getItem('app-theme-id') || fallbackThemeId; }
    catch { return fallbackThemeId; }
  });
  // Server-safe init — no localStorage read here to avoid hydration mismatch.
  // localStorage is synced after mount in the useEffect below.
  const [colorMode, setColorMode] = useState<ColorMode>(defaultColorMode);
  const [systemDark, setSystemDark] = useState(false);

  const theme = getTheme(themeId);
  const resolvedMode: 'light' | 'dark' =
    colorMode === 'system' ? (systemDark ? 'dark' : 'light') : colorMode;

  // Hydrate colorMode from localStorage after mount (avoids SSR/client mismatch)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('app-color-mode');
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        setColorMode(saved as ColorMode);
      }
    } catch { /* storage unavailable */ }
  }, []);

  // Listen to system dark preference
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Switch data-theme attribute + .dark class — CSS handles the rest
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', themeId);
    root.setAttribute('data-color-mode', resolvedMode);
    root.classList.toggle('dark', resolvedMode === 'dark');
  }, [themeId, resolvedMode]);

  // Persist to localStorage — skip theme if env var is controlling it
  useEffect(() => {
    try {
      if (!envThemeId) localStorage.setItem('app-theme-id', themeId);
      localStorage.setItem('app-color-mode', colorMode);
    } catch { /* storage unavailable */ }
  }, [themeId, colorMode]); // envThemeId is a build-time constant, not a reactive dep

  const value: ThemeContextValue = {
    themeId,
    theme,
    colorMode,
    resolvedMode,
    setThemeId: useCallback((id: string) => {
      if (getTheme(id)) setThemeId(id);
    }, []),
    setColorMode: useCallback((mode: ColorMode) => setColorMode(mode), []),
    availableThemes: getThemeList(),
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// ─── Hook ──────────────────────────────────────────────────

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within a <ThemeProvider>');
  return ctx;
}
