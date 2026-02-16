// ─── Theme Definitions ─────────────────────────────────────
// Subtle 3-tier depth — all surfaces accent-tinted:
//   Sidebar  → slightly darker shade of accent (1-2 steps)
//   Background → medium tinted
//   Card/Nav → slightly lighter tinted
// NO dark sidebars — just gentle layering.
// ────────────────────────────────────────────────────────────

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  'card-foreground': string;
  popover: string;
  'popover-foreground': string;
  primary: string;
  'primary-foreground': string;
  secondary: string;
  'secondary-foreground': string;
  muted: string;
  'muted-foreground': string;
  accent: string;
  'accent-foreground': string;
  destructive: string;
  border: string;
  input: string;
  ring: string;
  sidebar: string;
  'sidebar-foreground': string;
  'sidebar-primary': string;
  'sidebar-primary-foreground': string;
  'sidebar-accent': string;
  'sidebar-accent-foreground': string;
  'sidebar-border': string;
  'sidebar-ring': string;
  'chart-1': string;
  'chart-2': string;
  'chart-3': string;
  'chart-4': string;
  'chart-5': string;
}

export interface ThemeMeta {
  id: string;
  name: string;
  description: string;
  tag: string;
  categories: string[];
  previewAccent: string;
  previewAccentLight: string;
  previewBg: string;
}

export interface ThemeDefinition {
  meta: ThemeMeta;
  light: ThemeColors;
  dark: ThemeColors;
}

function makeDark(o: Partial<ThemeColors> & {
  background: string; foreground: string; card: string;
  accent: string; 'accent-foreground': string;
  border: string; 'muted-foreground': string;
  sidebar: string; 'sidebar-foreground': string;
  'sidebar-primary': string; 'sidebar-border': string;
  'chart-1': string;
}): ThemeColors {
  return {
    background: o.background, foreground: o.foreground,
    card: o.card, 'card-foreground': o.foreground,
    popover: o.card, 'popover-foreground': o.foreground,
    primary: o.foreground, 'primary-foreground': o.card,
    secondary: o.accent, 'secondary-foreground': o['accent-foreground'],
    muted: o.accent, 'muted-foreground': o['muted-foreground'],
    accent: o.accent, 'accent-foreground': o['accent-foreground'],
    destructive: '#ef4444',
    border: o.border, input: o.border, ring: o['sidebar-primary'],
    sidebar: o.sidebar, 'sidebar-foreground': o['sidebar-foreground'],
    'sidebar-primary': o['sidebar-primary'],
    'sidebar-primary-foreground': o.foreground,
    'sidebar-accent': o.accent,
    'sidebar-accent-foreground': o['accent-foreground'],
    'sidebar-border': o['sidebar-border'],
    'sidebar-ring': o['sidebar-primary'],
    'chart-1': o['chart-1'],
    'chart-2': o['chart-2'] ?? '#8ab88a',
    'chart-3': o['chart-3'] ?? '#e0a080',
    'chart-4': o['chart-4'] ?? '#9ab0d4',
    'chart-5': o['chart-5'] ?? '#c898ba',
  };
}

// ─── Depth guide (using arctic-blue as example) ────────────
//   Card/Nav:    #ebf0f9  ← lightest (navbar, cards, popovers)
//   Background:  #dfe7f3  ← mid tone (page body)
//   Sidebar:     #d0daea  ← slightly deeper (just a shade darker)
//   Border:      #b8c8de  ← visible separation

export const themes: Record<string, ThemeDefinition> = {

  'pearl-navy': {
    meta: {
      id: 'pearl-navy', name: 'Pearl White + Deep Navy',
      description: 'Apple-like minimalism with deep navy accents',
      tag: 'Premium', categories: ['security', 'enterprise', 'ecommerce'],
      previewAccent: '#1e3a5f', previewAccentLight: '#2d5a8e', previewBg: '#dfe7f2',
    },
    light: {
      card: '#edf1f8', 'card-foreground': '#0f172a',
      popover: '#edf1f8', 'popover-foreground': '#0f172a',
      background: '#dfe7f2', foreground: '#0f172a',
      primary: '#1e3a5f', 'primary-foreground': '#edf1f8',
      secondary: '#d2dceb', 'secondary-foreground': '#1e3a5f',
      muted: '#d6deec', 'muted-foreground': '#42536e',
      accent: '#d2dceb', 'accent-foreground': '#1e3a5f',
      destructive: '#dc2626', border: '#bccadc', input: '#bccadc', ring: '#2d5a8e',
      sidebar: '#ced8e8', 'sidebar-foreground': '#0f172a',
      'sidebar-primary': '#1e3a5f', 'sidebar-primary-foreground': '#edf1f8',
      'sidebar-accent': '#c2cedf', 'sidebar-accent-foreground': '#1e3a5f',
      'sidebar-border': '#b4c2d6', 'sidebar-ring': '#2d5a8e',
      'chart-1': '#1e3a5f', 'chart-2': '#2d5a8e', 'chart-3': '#4a90d9', 'chart-4': '#42536e', 'chart-5': '#94a3b8',
    },
    dark: makeDark({
      background: '#0c1222', foreground: '#e2e8f0', card: '#162032',
      accent: '#1e3048', 'accent-foreground': '#e2e8f0',
      border: 'rgba(226,232,240,0.1)', 'muted-foreground': '#94a3b8',
      sidebar: '#080e1a', 'sidebar-foreground': '#e2e8f0',
      'sidebar-primary': '#3b82f6', 'sidebar-border': 'rgba(226,232,240,0.08)',
      'chart-1': '#3b82f6',
    }),
  },

  'ice-teal': {
    meta: {
      id: 'ice-teal', name: 'Ice Gray + Teal',
      description: 'Notion/Linear energy with vibrant teal',
      tag: 'Modern SaaS', categories: ['user-mgmt', 'saas', 'ecommerce'],
      previewAccent: '#0d9488', previewAccentLight: '#14b8a6', previewBg: '#dbe9e7',
    },
    light: {
      card: '#eaf4f2', 'card-foreground': '#111827',
      popover: '#eaf4f2', 'popover-foreground': '#111827',
      background: '#dbe9e7', foreground: '#111827',
      primary: '#0d9488', 'primary-foreground': '#eaf4f2',
      secondary: '#cddeda', 'secondary-foreground': '#0d9488',
      muted: '#d0e2de', 'muted-foreground': '#3a5c56',
      accent: '#cddeda', 'accent-foreground': '#0d9488',
      destructive: '#dc2626', border: '#b6d0ca', input: '#b6d0ca', ring: '#14b8a6',
      sidebar: '#c6d8d4', 'sidebar-foreground': '#111827',
      'sidebar-primary': '#0d9488', 'sidebar-primary-foreground': '#eaf4f2',
      'sidebar-accent': '#bacdca', 'sidebar-accent-foreground': '#0d9488',
      'sidebar-border': '#acc2bc', 'sidebar-ring': '#14b8a6',
      'chart-1': '#0d9488', 'chart-2': '#14b8a6', 'chart-3': '#5eead4', 'chart-4': '#3a5c56', 'chart-5': '#99f6e4',
    },
    dark: makeDark({
      background: '#0a1a18', foreground: '#e0f7f5', card: '#12272a',
      accent: '#163a38', 'accent-foreground': '#e0f7f5',
      border: 'rgba(229,231,235,0.1)', 'muted-foreground': '#94a3b8',
      sidebar: '#06100e', 'sidebar-foreground': '#e0f7f5',
      'sidebar-primary': '#14b8a6', 'sidebar-border': 'rgba(229,231,235,0.08)',
      'chart-1': '#14b8a6',
    }),
  },

  'snow-violet': {
    meta: {
      id: 'snow-violet', name: 'Snow + Violet/Indigo',
      description: 'Clerk/Vercel-inspired with indigo-violet accents',
      tag: 'Distinctive', categories: ['security', 'ecommerce', 'saas'],
      previewAccent: '#6d28d9', previewAccentLight: '#8b5cf6', previewBg: '#e0dcee',
    },
    light: {
      card: '#efedf7', 'card-foreground': '#1e1b4b',
      popover: '#efedf7', 'popover-foreground': '#1e1b4b',
      background: '#e0dcee', foreground: '#1e1b4b',
      primary: '#6d28d9', 'primary-foreground': '#efedf7',
      secondary: '#d4cee4', 'secondary-foreground': '#6d28d9',
      muted: '#d8d2e8', 'muted-foreground': '#4a4568',
      accent: '#d4cee4', 'accent-foreground': '#6d28d9',
      destructive: '#dc2626', border: '#c0b8d6', input: '#c0b8d6', ring: '#8b5cf6',
      sidebar: '#cec6e0', 'sidebar-foreground': '#1e1b4b',
      'sidebar-primary': '#6d28d9', 'sidebar-primary-foreground': '#efedf7',
      'sidebar-accent': '#c2bad6', 'sidebar-accent-foreground': '#6d28d9',
      'sidebar-border': '#b4accc', 'sidebar-ring': '#8b5cf6',
      'chart-1': '#6d28d9', 'chart-2': '#8b5cf6', 'chart-3': '#a78bfa', 'chart-4': '#c4b5fd', 'chart-5': '#7c3aed',
    },
    dark: makeDark({
      background: '#110e24', foreground: '#ede9fe', card: '#1e1840',
      accent: '#2d2458', 'accent-foreground': '#ede9fe',
      border: 'rgba(233,229,245,0.1)', 'muted-foreground': '#a78bfa',
      sidebar: '#0a0818', 'sidebar-foreground': '#ede9fe',
      'sidebar-primary': '#8b5cf6', 'sidebar-border': 'rgba(233,229,245,0.08)',
      'chart-1': '#8b5cf6',
    }),
  },

  'lavender-slate': {
    meta: {
      id: 'lavender-slate', name: 'Soft Lavender + Slate-Blue',
      description: 'Calming lavender-gray with muted slate-blue',
      tag: 'Unique', categories: ['security', 'enterprise'],
      previewAccent: '#4f5d9a', previewAccentLight: '#6874b4', previewBg: '#dddaea',
    },
    light: {
      card: '#eceaf4', 'card-foreground': '#1a1632',
      popover: '#eceaf4', 'popover-foreground': '#1a1632',
      background: '#dddaea', foreground: '#1a1632',
      primary: '#4f5d9a', 'primary-foreground': '#eceaf4',
      secondary: '#d0cce0', 'secondary-foreground': '#4f5d9a',
      muted: '#d4d0e4', 'muted-foreground': '#484468',
      accent: '#d0cce0', 'accent-foreground': '#4f5d9a',
      destructive: '#dc2626', border: '#bab5d0', input: '#bab5d0', ring: '#6874b4',
      sidebar: '#ccc8dc', 'sidebar-foreground': '#1a1632',
      'sidebar-primary': '#4f5d9a', 'sidebar-primary-foreground': '#eceaf4',
      'sidebar-accent': '#c0bcd2', 'sidebar-accent-foreground': '#4f5d9a',
      'sidebar-border': '#b0acc6', 'sidebar-ring': '#6874b4',
      'chart-1': '#4f5d9a', 'chart-2': '#6874b4', 'chart-3': '#8b94c8', 'chart-4': '#484468', 'chart-5': '#a5acd4',
    },
    dark: makeDark({
      background: '#100e1e', foreground: '#eef0f8', card: '#1c1934',
      accent: '#2a264a', 'accent-foreground': '#eef0f8',
      border: 'rgba(228,224,240,0.1)', 'muted-foreground': '#8b94c8',
      sidebar: '#08071a', 'sidebar-foreground': '#eef0f8',
      'sidebar-primary': '#6874b4', 'sidebar-border': 'rgba(228,224,240,0.08)',
      'chart-1': '#6874b4',
    }),
  },

  'ivory-emerald': {
    meta: {
      id: 'ivory-emerald', name: 'Warm Ivory + Deep Emerald',
      description: 'Warm ivory with rich emerald for trust and growth',
      tag: 'Refined', categories: ['ecommerce', 'security', 'enterprise'],
      previewAccent: '#065f46', previewAccentLight: '#059669', previewBg: '#dae8dc',
    },
    light: {
      card: '#eaf4ec', 'card-foreground': '#1a2e1a',
      popover: '#eaf4ec', 'popover-foreground': '#1a2e1a',
      background: '#dae8dc', foreground: '#1a2e1a',
      primary: '#065f46', 'primary-foreground': '#eaf4ec',
      secondary: '#ccdccf', 'secondary-foreground': '#065f46',
      muted: '#d0e0d4', 'muted-foreground': '#3a5840',
      accent: '#ccdccf', 'accent-foreground': '#065f46',
      destructive: '#dc2626', border: '#b6cab8', input: '#b6cab8', ring: '#059669',
      sidebar: '#c6d6c8', 'sidebar-foreground': '#1a2e1a',
      'sidebar-primary': '#065f46', 'sidebar-primary-foreground': '#eaf4ec',
      'sidebar-accent': '#bacdbd', 'sidebar-accent-foreground': '#065f46',
      'sidebar-border': '#acc0ae', 'sidebar-ring': '#059669',
      'chart-1': '#065f46', 'chart-2': '#059669', 'chart-3': '#34d399', 'chart-4': '#3a5840', 'chart-5': '#6ee7b7',
    },
    dark: makeDark({
      background: '#0a1a12', foreground: '#e8f5ef', card: '#14291e',
      accent: '#1e3a2c', 'accent-foreground': '#e8f5ef',
      border: 'rgba(232,228,217,0.1)', 'muted-foreground': '#6ee7b7',
      sidebar: '#06120c', 'sidebar-foreground': '#e8f5ef',
      'sidebar-primary': '#34d399', 'sidebar-border': 'rgba(232,228,217,0.08)',
      'chart-1': '#34d399',
    }),
  },

  'cloud-coral': {
    meta: {
      id: 'cloud-coral', name: 'Cloud White + Coral/Rose',
      description: 'Warm and inviting with coral-rose accents',
      tag: 'Friendly', categories: ['ecommerce', 'user-mgmt', 'saas'],
      previewAccent: '#e11d48', previewAccentLight: '#f43f5e', previewBg: '#ebdee1',
    },
    light: {
      card: '#f6eff1', 'card-foreground': '#1c1017',
      popover: '#f6eff1', 'popover-foreground': '#1c1017',
      background: '#ebdee1', foreground: '#1c1017',
      primary: '#e11d48', 'primary-foreground': '#f6eff1',
      secondary: '#e0ced3', 'secondary-foreground': '#e11d48',
      muted: '#e2d4d8', 'muted-foreground': '#6a4450',
      accent: '#e0ced3', 'accent-foreground': '#e11d48',
      destructive: '#dc2626', border: '#d0b8c0', input: '#d0b8c0', ring: '#f43f5e',
      sidebar: '#dcccd0', 'sidebar-foreground': '#1c1017',
      'sidebar-primary': '#e11d48', 'sidebar-primary-foreground': '#f6eff1',
      'sidebar-accent': '#d2c0c6', 'sidebar-accent-foreground': '#e11d48',
      'sidebar-border': '#c6b0b8', 'sidebar-ring': '#f43f5e',
      'chart-1': '#e11d48', 'chart-2': '#f43f5e', 'chart-3': '#fb7185', 'chart-4': '#6a4450', 'chart-5': '#fda4af',
    },
    dark: makeDark({
      background: '#1a0a10', foreground: '#fff1f2', card: '#2a1520',
      accent: '#3a1a28', 'accent-foreground': '#fff1f2',
      border: 'rgba(240,226,226,0.1)', 'muted-foreground': '#fb7185',
      sidebar: '#120610', 'sidebar-foreground': '#fff1f2',
      'sidebar-primary': '#f43f5e', 'sidebar-border': 'rgba(240,226,226,0.08)',
      'chart-1': '#f43f5e',
    }),
  },

  'arctic-blue': {
    meta: {
      id: 'arctic-blue', name: 'Arctic + Electric Blue',
      description: 'Crisp arctic with bold electric blue throughout',
      tag: 'Bold Tech', categories: ['security', 'saas', 'enterprise'],
      previewAccent: '#2563eb', previewAccentLight: '#3b82f6', previewBg: '#dfe7f3',
    },
    light: {
      card: '#ebf0f9', 'card-foreground': '#0f172a',
      popover: '#ebf0f9', 'popover-foreground': '#0f172a',
      background: '#dfe7f3', foreground: '#0f172a',
      primary: '#2563eb', 'primary-foreground': '#ebf0f9',
      secondary: '#ccd8ec', 'secondary-foreground': '#2563eb',
      muted: '#d2dcee', 'muted-foreground': '#3a4e6e',
      accent: '#ccd8ec', 'accent-foreground': '#2563eb',
      destructive: '#dc2626', border: '#b8c8de', input: '#b8c8de', ring: '#3b82f6',
      sidebar: '#d0daea', 'sidebar-foreground': '#0f172a',
      'sidebar-primary': '#2563eb', 'sidebar-primary-foreground': '#ebf0f9',
      'sidebar-accent': '#c4cedf', 'sidebar-accent-foreground': '#2563eb',
      'sidebar-border': '#b0c0d6', 'sidebar-ring': '#3b82f6',
      'chart-1': '#2563eb', 'chart-2': '#3b82f6', 'chart-3': '#60a5fa', 'chart-4': '#3a4e6e', 'chart-5': '#93c5fd',
    },
    dark: makeDark({
      background: '#0a1628', foreground: '#e2e8f0', card: '#142240',
      accent: '#1e3058', 'accent-foreground': '#e2e8f0',
      border: 'rgba(226,232,240,0.1)', 'muted-foreground': '#93c5fd',
      sidebar: '#060e1e', 'sidebar-foreground': '#e2e8f0',
      'sidebar-primary': '#3b82f6', 'sidebar-border': 'rgba(226,232,240,0.08)',
      'chart-1': '#3b82f6',
    }),
  },

  'milk-charcoal': {
    meta: {
      id: 'milk-charcoal', name: 'Milk + Warm Charcoal',
      description: 'Monochrome sophistication, timeless and universal',
      tag: 'Swiss Minimal', categories: ['enterprise', 'ecommerce', 'security'],
      previewAccent: '#292524', previewAccentLight: '#44403c', previewBg: '#e0ddd9',
    },
    light: {
      card: '#efedea', 'card-foreground': '#1c1917',
      popover: '#efedea', 'popover-foreground': '#1c1917',
      background: '#e0ddd9', foreground: '#1c1917',
      primary: '#292524', 'primary-foreground': '#efedea',
      secondary: '#d2cec8', 'secondary-foreground': '#292524',
      muted: '#d6d2cc', 'muted-foreground': '#504a44',
      accent: '#d2cec8', 'accent-foreground': '#292524',
      destructive: '#dc2626', border: '#beb8b0', input: '#beb8b0', ring: '#44403c',
      sidebar: '#ccc8c2', 'sidebar-foreground': '#1c1917',
      'sidebar-primary': '#292524', 'sidebar-primary-foreground': '#efedea',
      'sidebar-accent': '#c0bab4', 'sidebar-accent-foreground': '#292524',
      'sidebar-border': '#b2aca6', 'sidebar-ring': '#44403c',
      'chart-1': '#292524', 'chart-2': '#44403c', 'chart-3': '#78716c', 'chart-4': '#a8a29e', 'chart-5': '#d6d3d1',
    },
    dark: makeDark({
      background: '#0c0a09', foreground: '#e7e5e4', card: '#1c1917',
      accent: '#292524', 'accent-foreground': '#e7e5e4',
      border: 'rgba(231,229,228,0.1)', 'muted-foreground': '#a8a29e',
      sidebar: '#060504', 'sidebar-foreground': '#e7e5e4',
      'sidebar-primary': '#d6d3d1', 'sidebar-border': 'rgba(231,229,228,0.08)',
      'chart-1': '#d6d3d1',
    }),
  },

  'frost-ocean': {
    meta: {
      id: 'frost-ocean', name: 'Frost + Ocean Blue',
      description: 'Icy frost base with deep ocean blue accents',
      tag: 'Fresh', categories: ['saas', 'user-mgmt', 'ecommerce'],
      previewAccent: '#0369a1', previewAccentLight: '#0284c7', previewBg: '#d8e5ee',
    },
    light: {
      card: '#e8f0f6', 'card-foreground': '#082f49',
      popover: '#e8f0f6', 'popover-foreground': '#082f49',
      background: '#d8e5ee', foreground: '#082f49',
      primary: '#0369a1', 'primary-foreground': '#e8f0f6',
      secondary: '#c8d8e4', 'secondary-foreground': '#0369a1',
      muted: '#ccdce6', 'muted-foreground': '#345a72',
      accent: '#c8d8e4', 'accent-foreground': '#0369a1',
      destructive: '#dc2626', border: '#b2c6d4', input: '#b2c6d4', ring: '#0284c7',
      sidebar: '#c4d4e0', 'sidebar-foreground': '#082f49',
      'sidebar-primary': '#0369a1', 'sidebar-primary-foreground': '#e8f0f6',
      'sidebar-accent': '#b8cad6', 'sidebar-accent-foreground': '#0369a1',
      'sidebar-border': '#a8bcc8', 'sidebar-ring': '#0284c7',
      'chart-1': '#0369a1', 'chart-2': '#0284c7', 'chart-3': '#38bdf8', 'chart-4': '#345a72', 'chart-5': '#7dd3fc',
    },
    dark: makeDark({
      background: '#051525', foreground: '#e0f2fe', card: '#0c2440',
      accent: '#163654', 'accent-foreground': '#e0f2fe',
      border: 'rgba(221,230,237,0.1)', 'muted-foreground': '#7dd3fc',
      sidebar: '#030c18', 'sidebar-foreground': '#e0f2fe',
      'sidebar-primary': '#38bdf8', 'sidebar-border': 'rgba(221,230,237,0.08)',
      'chart-1': '#38bdf8',
    }),
  },

  'sand-sienna': {
    meta: {
      id: 'sand-sienna', name: 'Cream Sand + Burnt Sienna',
      description: 'Sandy cream with rich burnt sienna, handcrafted feel',
      tag: 'Earthy', categories: ['ecommerce', 'enterprise'],
      previewAccent: '#9a3412', previewAccentLight: '#c2410c', previewBg: '#e8ddd0',
    },
    light: {
      card: '#f4ede4', 'card-foreground': '#291a0f',
      popover: '#f4ede4', 'popover-foreground': '#291a0f',
      background: '#e8ddd0', foreground: '#291a0f',
      primary: '#9a3412', 'primary-foreground': '#f4ede4',
      secondary: '#daccba', 'secondary-foreground': '#9a3412',
      muted: '#ded0c0', 'muted-foreground': '#624834',
      accent: '#daccba', 'accent-foreground': '#9a3412',
      destructive: '#dc2626', border: '#c8b8a2', input: '#c8b8a2', ring: '#c2410c',
      sidebar: '#d6c8b4', 'sidebar-foreground': '#291a0f',
      'sidebar-primary': '#9a3412', 'sidebar-primary-foreground': '#f4ede4',
      'sidebar-accent': '#cabaa6', 'sidebar-accent-foreground': '#9a3412',
      'sidebar-border': '#bead96', 'sidebar-ring': '#c2410c',
      'chart-1': '#9a3412', 'chart-2': '#c2410c', 'chart-3': '#ea580c', 'chart-4': '#624834', 'chart-5': '#fb923c',
    },
    dark: makeDark({
      background: '#1a100a', foreground: '#fef3e2', card: '#2a1a10',
      accent: '#3a2418', 'accent-foreground': '#fef3e2',
      border: 'rgba(232,225,212,0.1)', 'muted-foreground': '#fb923c',
      sidebar: '#120a06', 'sidebar-foreground': '#fef3e2',
      'sidebar-primary': '#ea580c', 'sidebar-border': 'rgba(232,225,212,0.08)',
      'chart-1': '#ea580c',
    }),
  },

  'mist-forest': {
    meta: {
      id: 'mist-forest', name: 'Mist + Forest Green',
      description: 'Soft misty green with deep forest green authority',
      tag: 'Natural', categories: ['security', 'enterprise', 'saas'],
      previewAccent: '#166534', previewAccentLight: '#22c55e', previewBg: '#d8e6da',
    },
    light: {
      card: '#e8f2ea', 'card-foreground': '#14261a',
      popover: '#e8f2ea', 'popover-foreground': '#14261a',
      background: '#d8e6da', foreground: '#14261a',
      primary: '#166534', 'primary-foreground': '#e8f2ea',
      secondary: '#c8d8cc', 'secondary-foreground': '#166534',
      muted: '#cddcd0', 'muted-foreground': '#385240',
      accent: '#c8d8cc', 'accent-foreground': '#166534',
      destructive: '#dc2626', border: '#b2c6b6', input: '#b2c6b6', ring: '#22c55e',
      sidebar: '#c2d2c6', 'sidebar-foreground': '#14261a',
      'sidebar-primary': '#166534', 'sidebar-primary-foreground': '#e8f2ea',
      'sidebar-accent': '#b6c8ba', 'sidebar-accent-foreground': '#166534',
      'sidebar-border': '#a8bab0', 'sidebar-ring': '#22c55e',
      'chart-1': '#166534', 'chart-2': '#22c55e', 'chart-3': '#4ade80', 'chart-4': '#385240', 'chart-5': '#86efac',
    },
    dark: makeDark({
      background: '#0a1610', foreground: '#ecfdf5', card: '#14261a',
      accent: '#1e3828', 'accent-foreground': '#ecfdf5',
      border: 'rgba(220,229,223,0.1)', 'muted-foreground': '#86efac',
      sidebar: '#060e0a', 'sidebar-foreground': '#ecfdf5',
      'sidebar-primary': '#4ade80', 'sidebar-border': 'rgba(220,229,223,0.08)',
      'chart-1': '#4ade80',
    }),
  },

  'porcelain-burgundy': {
    meta: {
      id: 'porcelain-burgundy', name: 'Porcelain + Burgundy',
      description: 'High-end luxury with deep burgundy accents',
      tag: 'Luxury', categories: ['ecommerce', 'enterprise'],
      previewAccent: '#881337', previewAccentLight: '#be185d', previewBg: '#e8dce0',
    },
    light: {
      card: '#f5edf0', 'card-foreground': '#1a0e13',
      popover: '#f5edf0', 'popover-foreground': '#1a0e13',
      background: '#e8dce0', foreground: '#1a0e13',
      primary: '#881337', 'primary-foreground': '#f5edf0',
      secondary: '#dac8cf', 'secondary-foreground': '#881337',
      muted: '#ded0d6', 'muted-foreground': '#603e4c',
      accent: '#dac8cf', 'accent-foreground': '#881337',
      destructive: '#dc2626', border: '#c8b2ba', input: '#c8b2ba', ring: '#be185d',
      sidebar: '#d4c2c8', 'sidebar-foreground': '#1a0e13',
      'sidebar-primary': '#881337', 'sidebar-primary-foreground': '#f5edf0',
      'sidebar-accent': '#c8b6be', 'sidebar-accent-foreground': '#881337',
      'sidebar-border': '#bca8b2', 'sidebar-ring': '#be185d',
      'chart-1': '#881337', 'chart-2': '#be185d', 'chart-3': '#ec4899', 'chart-4': '#603e4c', 'chart-5': '#f9a8d4',
    },
    dark: makeDark({
      background: '#1a0a10', foreground: '#fdf2f8', card: '#2a1420',
      accent: '#3a1c2c', 'accent-foreground': '#fdf2f8',
      border: 'rgba(237,228,231,0.1)', 'muted-foreground': '#f9a8d4',
      sidebar: '#100610', 'sidebar-foreground': '#fdf2f8',
      'sidebar-primary': '#ec4899', 'sidebar-border': 'rgba(237,228,231,0.08)',
      'chart-1': '#ec4899',
    }),
  },

  'bone-copper': {
    meta: {
      id: 'bone-copper', name: 'Bone + Copper',
      description: 'Warm bone with metallic copper accents',
      tag: 'Artisan', categories: ['ecommerce', 'enterprise'],
      previewAccent: '#b45309', previewAccentLight: '#d97706', previewBg: '#e8dccc',
    },
    light: {
      card: '#f4ece0', 'card-foreground': '#27200f',
      popover: '#f4ece0', 'popover-foreground': '#27200f',
      background: '#e8dccc', foreground: '#27200f',
      primary: '#b45309', 'primary-foreground': '#f4ece0',
      secondary: '#dac8b0', 'secondary-foreground': '#b45309',
      muted: '#ded0b8', 'muted-foreground': '#605030',
      accent: '#dac8b0', 'accent-foreground': '#b45309',
      destructive: '#dc2626', border: '#c8b498', input: '#c8b498', ring: '#d97706',
      sidebar: '#d4c4ac', 'sidebar-foreground': '#27200f',
      'sidebar-primary': '#b45309', 'sidebar-primary-foreground': '#f4ece0',
      'sidebar-accent': '#c8b8a0', 'sidebar-accent-foreground': '#b45309',
      'sidebar-border': '#bcaa92', 'sidebar-ring': '#d97706',
      'chart-1': '#b45309', 'chart-2': '#d97706', 'chart-3': '#f59e0b', 'chart-4': '#605030', 'chart-5': '#fbbf24',
    },
    dark: makeDark({
      background: '#1a140a', foreground: '#fefce8', card: '#2a2010',
      accent: '#3a2c18', 'accent-foreground': '#fefce8',
      border: 'rgba(233,227,214,0.1)', 'muted-foreground': '#fbbf24',
      sidebar: '#120c06', 'sidebar-foreground': '#fefce8',
      'sidebar-primary': '#f59e0b', 'sidebar-border': 'rgba(233,227,214,0.08)',
      'chart-1': '#f59e0b',
    }),
  },

  'silver-purple': {
    meta: {
      id: 'silver-purple', name: 'Silver + Deep Purple',
      description: 'Cool silver with rich deep purple, Stripe-esque',
      tag: 'Premium Tech', categories: ['security', 'saas', 'user-mgmt'],
      previewAccent: '#7c3aed', previewAccentLight: '#a78bfa', previewBg: '#dfd8ec',
    },
    light: {
      card: '#eeeaf6', 'card-foreground': '#1a1530',
      popover: '#eeeaf6', 'popover-foreground': '#1a1530',
      background: '#dfd8ec', foreground: '#1a1530',
      primary: '#7c3aed', 'primary-foreground': '#eeeaf6',
      secondary: '#d0c8e2', 'secondary-foreground': '#7c3aed',
      muted: '#d6cee6', 'muted-foreground': '#484060',
      accent: '#d0c8e2', 'accent-foreground': '#7c3aed',
      destructive: '#dc2626', border: '#bab2d4', input: '#bab2d4', ring: '#a78bfa',
      sidebar: '#cac0de', 'sidebar-foreground': '#1a1530',
      'sidebar-primary': '#7c3aed', 'sidebar-primary-foreground': '#eeeaf6',
      'sidebar-accent': '#beb4d4', 'sidebar-accent-foreground': '#7c3aed',
      'sidebar-border': '#b0a6c8', 'sidebar-ring': '#a78bfa',
      'chart-1': '#7c3aed', 'chart-2': '#a78bfa', 'chart-3': '#c4b5fd', 'chart-4': '#484060', 'chart-5': '#ddd6fe',
    },
    dark: makeDark({
      background: '#0e0c1a', foreground: '#f5f3ff', card: '#1a1530',
      accent: '#2a2448', 'accent-foreground': '#f5f3ff',
      border: 'rgba(227,225,237,0.1)', 'muted-foreground': '#c4b5fd',
      sidebar: '#080614', 'sidebar-foreground': '#f5f3ff',
      'sidebar-primary': '#a78bfa', 'sidebar-border': 'rgba(227,225,237,0.08)',
      'chart-1': '#a78bfa',
    }),
  },

  'paper-ink': {
    meta: {
      id: 'paper-ink', name: 'Paper + Ink Black',
      description: 'Editorial, typographic, content-first design',
      tag: 'Editorial', categories: ['enterprise', 'ecommerce', 'saas'],
      previewAccent: '#18181b', previewAccentLight: '#3f3f46', previewBg: '#dddde0',
    },
    light: {
      card: '#ebebed', 'card-foreground': '#09090b',
      popover: '#ebebed', 'popover-foreground': '#09090b',
      background: '#dddde0', foreground: '#09090b',
      primary: '#18181b', 'primary-foreground': '#ebebed',
      secondary: '#cdcdd2', 'secondary-foreground': '#18181b',
      muted: '#d2d2d6', 'muted-foreground': '#46464c',
      accent: '#cdcdd2', 'accent-foreground': '#18181b',
      destructive: '#dc2626', border: '#b8b8be', input: '#b8b8be', ring: '#3f3f46',
      sidebar: '#c8c8cc', 'sidebar-foreground': '#09090b',
      'sidebar-primary': '#18181b', 'sidebar-primary-foreground': '#ebebed',
      'sidebar-accent': '#bcbcc2', 'sidebar-accent-foreground': '#18181b',
      'sidebar-border': '#aeaeb6', 'sidebar-ring': '#3f3f46',
      'chart-1': '#18181b', 'chart-2': '#3f3f46', 'chart-3': '#71717a', 'chart-4': '#a1a1aa', 'chart-5': '#d4d4d8',
    },
    dark: makeDark({
      background: '#09090b', foreground: '#fafafa', card: '#18181b',
      accent: '#27272a', 'accent-foreground': '#fafafa',
      border: 'rgba(228,228,227,0.1)', 'muted-foreground': '#a1a1aa',
      sidebar: '#050506', 'sidebar-foreground': '#fafafa',
      'sidebar-primary': '#d4d4d8', 'sidebar-border': 'rgba(228,228,227,0.08)',
      'chart-1': '#d4d4d8',
    }),
  },

  'dew-mint': {
    meta: {
      id: 'dew-mint', name: 'Dew + Mint Green',
      description: 'Dewy fresh with soft mint, calming wellness vibes',
      tag: 'Calm', categories: ['user-mgmt', 'saas'],
      previewAccent: '#047857', previewAccentLight: '#10b981', previewBg: '#d6e6dc',
    },
    light: {
      card: '#e6f2ea', 'card-foreground': '#0a2618',
      popover: '#e6f2ea', 'popover-foreground': '#0a2618',
      background: '#d6e6dc', foreground: '#0a2618',
      primary: '#047857', 'primary-foreground': '#e6f2ea',
      secondary: '#c4d8ca', 'secondary-foreground': '#047857',
      muted: '#c8dace', 'muted-foreground': '#325240',
      accent: '#c4d8ca', 'accent-foreground': '#047857',
      destructive: '#dc2626', border: '#aec6b6', input: '#aec6b6', ring: '#10b981',
      sidebar: '#bfd0c4', 'sidebar-foreground': '#0a2618',
      'sidebar-primary': '#047857', 'sidebar-primary-foreground': '#e6f2ea',
      'sidebar-accent': '#b4c6ba', 'sidebar-accent-foreground': '#047857',
      'sidebar-border': '#a6b8ae', 'sidebar-ring': '#10b981',
      'chart-1': '#047857', 'chart-2': '#10b981', 'chart-3': '#34d399', 'chart-4': '#325240', 'chart-5': '#6ee7b7',
    },
    dark: makeDark({
      background: '#051510', foreground: '#ecfdf5', card: '#0e261a',
      accent: '#163a28', 'accent-foreground': '#ecfdf5',
      border: 'rgba(216,235,224,0.1)', 'muted-foreground': '#6ee7b7',
      sidebar: '#030e0a', 'sidebar-foreground': '#ecfdf5',
      'sidebar-primary': '#34d399', 'sidebar-border': 'rgba(216,235,224,0.08)',
      'chart-1': '#34d399',
    }),
  },

  'chalk-crimson': {
    meta: {
      id: 'chalk-crimson', name: 'Chalk + Crimson',
      description: 'Chalky base with bold crimson, command-center energy',
      tag: 'Bold', categories: ['security', 'enterprise'],
      previewAccent: '#dc2626', previewAccentLight: '#ef4444', previewBg: '#e6dad8',
    },
    light: {
      card: '#f4eceb', 'card-foreground': '#1a1110',
      popover: '#f4eceb', 'popover-foreground': '#1a1110',
      background: '#e6dad8', foreground: '#1a1110',
      primary: '#dc2626', 'primary-foreground': '#f4eceb',
      secondary: '#d8c8c4', 'secondary-foreground': '#dc2626',
      muted: '#dcccc8', 'muted-foreground': '#5c3e3a',
      accent: '#d8c8c4', 'accent-foreground': '#dc2626',
      destructive: '#dc2626', border: '#c8b0ac', input: '#c8b0ac', ring: '#ef4444',
      sidebar: '#d2c0bc', 'sidebar-foreground': '#1a1110',
      'sidebar-primary': '#dc2626', 'sidebar-primary-foreground': '#f4eceb',
      'sidebar-accent': '#c8b4b0', 'sidebar-accent-foreground': '#dc2626',
      'sidebar-border': '#bca6a2', 'sidebar-ring': '#ef4444',
      'chart-1': '#dc2626', 'chart-2': '#ef4444', 'chart-3': '#f87171', 'chart-4': '#5c3e3a', 'chart-5': '#fca5a5',
    },
    dark: makeDark({
      background: '#1a0c0a', foreground: '#fef2f2', card: '#2a1412',
      accent: '#3a1c18', 'accent-foreground': '#fef2f2',
      border: 'rgba(229,227,225,0.1)', 'muted-foreground': '#fca5a5',
      sidebar: '#120806', 'sidebar-foreground': '#fef2f2',
      'sidebar-primary': '#f87171', 'sidebar-border': 'rgba(229,227,225,0.08)',
      'chart-1': '#f87171',
    }),
  },

  'linen-oak': {
    meta: {
      id: 'linen-oak', name: 'Linen + Golden Oak',
      description: 'Soft linen with golden oak, warm professionalism',
      tag: 'Warm Pro', categories: ['ecommerce', 'enterprise', 'user-mgmt'],
      previewAccent: '#92400e', previewAccentLight: '#b45309', previewBg: '#e6daca',
    },
    light: {
      card: '#f4ece0', 'card-foreground': '#261e0f',
      popover: '#f4ece0', 'popover-foreground': '#261e0f',
      background: '#e6daca', foreground: '#261e0f',
      primary: '#92400e', 'primary-foreground': '#f4ece0',
      secondary: '#d8c8ae', 'secondary-foreground': '#92400e',
      muted: '#dcceb6', 'muted-foreground': '#5e4c2e',
      accent: '#d8c8ae', 'accent-foreground': '#92400e',
      destructive: '#dc2626', border: '#c6b498', input: '#c6b498', ring: '#b45309',
      sidebar: '#d2c0a4', 'sidebar-foreground': '#261e0f',
      'sidebar-primary': '#92400e', 'sidebar-primary-foreground': '#f4ece0',
      'sidebar-accent': '#c6b498', 'sidebar-accent-foreground': '#92400e',
      'sidebar-border': '#baa88c', 'sidebar-ring': '#b45309',
      'chart-1': '#92400e', 'chart-2': '#b45309', 'chart-3': '#d97706', 'chart-4': '#5e4c2e', 'chart-5': '#f59e0b',
    },
    dark: makeDark({
      background: '#16120a', foreground: '#fffbeb', card: '#261e0f',
      accent: '#362a16', 'accent-foreground': '#fffbeb',
      border: 'rgba(231,226,213,0.1)', 'muted-foreground': '#f59e0b',
      sidebar: '#0e0c06', 'sidebar-foreground': '#fffbeb',
      'sidebar-primary': '#d97706', 'sidebar-border': 'rgba(231,226,213,0.08)',
      'chart-1': '#d97706',
    }),
  },
};

export const themeIds = Object.keys(themes) as string[];
export const DEFAULT_THEME_ID = 'arctic-blue';

export function getTheme(id: string): ThemeDefinition {
  return themes[id] ?? themes[DEFAULT_THEME_ID];
}

export function getThemeList(): ThemeMeta[] {
  return Object.values(themes).map((t) => t.meta);
}