'use client';

import { FC, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Check, Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const ThemeSwitcher: FC = () => {
  const { themeId, setThemeId, colorMode, setColorMode, availableThemes } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentTheme = availableThemes.find((t) => t.id === themeId);

  const colorModes: { mode: 'light' | 'dark' | 'system'; icon: typeof Sun; label: string }[] = [
    { mode: 'light', icon: Sun, label: 'Light' },
    { mode: 'dark', icon: Moon, label: 'Dark' },
    { mode: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-accent transition-colors text-sm font-medium text-foreground/80 hover:text-foreground"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline">{currentTheme?.name ?? 'Theme'}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 bg-card rounded-2xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.15)] border border-border overflow-hidden z-50"
          >
            {/* Color Mode Toggle */}
            <div className="p-3 border-b border-border">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2 px-1">
                Appearance
              </p>
              <div className="flex gap-1.5 bg-muted rounded-xl p-1">
                {colorModes.map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setColorMode(mode)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                      colorMode === mode
                        ? 'bg-card text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme List */}
            <div className="max-h-[400px] overflow-y-auto p-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2 px-2 pt-1">
                Themes
              </p>
              <div className="space-y-0.5">
                {availableThemes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setThemeId(t.id);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left group ${
                      themeId === t.id ? 'bg-accent' : 'hover:bg-accent/50'
                    }`}
                  >
                    {/* Color preview dots */}
                    <div className="flex -space-x-1 flex-shrink-0">
                      <div
                        className="w-5 h-5 rounded-full border-2 border-card shadow-sm"
                        style={{ background: t.previewBg }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border-2 border-card shadow-sm"
                        style={{ background: t.previewAccent }}
                      />
                      <div
                        className="w-5 h-5 rounded-full border-2 border-card shadow-sm"
                        style={{ background: t.previewAccentLight }}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium text-foreground/85 group-hover:text-foreground block truncate">
                        {t.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground/60 block truncate">
                        {t.description}
                      </span>
                    </div>

                    {themeId === t.id && (
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;