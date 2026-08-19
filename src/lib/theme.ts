export type ThemeColor = 'blue' | 'emerald' | 'red' | 'violet' | 'amber' | 'cyan';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  color: ThemeColor;
  mode: ThemeMode;
}

export interface ThemeOption {
  id: ThemeColor;
  name: string;
  badge: string;
  primaryClass: string;
  gradientFrom: string;
  gradientTo: string;
  accentBg: string;
  accentText: string;
  accentBorder: string;
  dotColor: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'blue',
    name: 'Xanh Chuẩn Sư Phạm',
    badge: 'Mặc định',
    primaryClass: 'bg-blue-700 hover:bg-blue-800 text-white',
    gradientFrom: 'from-blue-800',
    gradientTo: 'to-blue-600',
    accentBg: 'bg-blue-50 dark:bg-blue-950/60',
    accentText: 'text-blue-700 dark:text-blue-300',
    accentBorder: 'border-blue-300 dark:border-blue-700',
    dotColor: '#1d4ed8'
  },
  {
    id: 'emerald',
    name: 'Xanh Rừng Trà My',
    badge: 'Tươi mới',
    primaryClass: 'bg-emerald-700 hover:bg-emerald-800 text-white',
    gradientFrom: 'from-emerald-800',
    gradientTo: 'to-teal-700',
    accentBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    accentText: 'text-emerald-700 dark:text-emerald-300',
    accentBorder: 'border-emerald-300 dark:border-emerald-700',
    dotColor: '#047857'
  },
  {
    id: 'red',
    name: 'Đỏ Thi Đua Cờ Đỏ',
    badge: 'Truyền thống',
    primaryClass: 'bg-rose-700 hover:bg-rose-800 text-white',
    gradientFrom: 'from-rose-800',
    gradientTo: 'to-red-700',
    accentBg: 'bg-rose-50 dark:bg-rose-950/60',
    accentText: 'text-rose-700 dark:text-rose-300',
    accentBorder: 'border-rose-300 dark:border-rose-700',
    dotColor: '#be123c'
  },
  {
    id: 'violet',
    name: 'Tím Hoàng Gia',
    badge: 'Sang trọng',
    primaryClass: 'bg-violet-700 hover:bg-violet-800 text-white',
    gradientFrom: 'from-violet-800',
    gradientTo: 'to-purple-700',
    accentBg: 'bg-violet-50 dark:bg-violet-950/60',
    accentText: 'text-violet-700 dark:text-violet-300',
    accentBorder: 'border-violet-300 dark:border-violet-700',
    dotColor: '#6d28d9'
  },
  {
    id: 'amber',
    name: 'Vàng Cam Nước Oa',
    badge: 'Ấm áp',
    primaryClass: 'bg-amber-700 hover:bg-amber-800 text-white',
    gradientFrom: 'from-amber-800',
    gradientTo: 'to-orange-700',
    accentBg: 'bg-amber-50 dark:bg-amber-950/60',
    accentText: 'text-amber-700 dark:text-amber-300',
    accentBorder: 'border-amber-300 dark:border-amber-700',
    dotColor: '#b45309'
  },
  {
    id: 'cyan',
    name: 'Xanh Biển Hiện Đại',
    badge: 'Công nghệ',
    primaryClass: 'bg-cyan-700 hover:bg-cyan-800 text-white',
    gradientFrom: 'from-cyan-800',
    gradientTo: 'to-blue-700',
    accentBg: 'bg-cyan-50 dark:bg-cyan-950/60',
    accentText: 'text-cyan-700 dark:text-cyan-300',
    accentBorder: 'border-cyan-300 dark:border-cyan-700',
    dotColor: '#0e7490'
  }
];

export const getSavedTheme = (): ThemeConfig => {
  try {
    const savedColor = (localStorage.getItem('nuocoa_theme_color') as ThemeColor) || 'blue';
    const savedMode = (localStorage.getItem('nuocoa_theme_mode') as ThemeMode) || 'light';
    return {
      color: THEME_OPTIONS.some(t => t.id === savedColor) ? savedColor : 'blue',
      mode: ['light', 'dark', 'system'].includes(savedMode) ? savedMode : 'light'
    };
  } catch {
    return { color: 'blue', mode: 'light' };
  }
};

export const applyThemeToDocument = (theme: ThemeConfig) => {
  const root = document.documentElement;
  
  // Apply dark mode
  const isDark = theme.mode === 'dark' || (theme.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Set theme data attribute for CSS variable mapping
  root.setAttribute('data-theme-color', theme.color);

  // Save to localStorage
  try {
    localStorage.setItem('nuocoa_theme_color', theme.color);
    localStorage.setItem('nuocoa_theme_mode', theme.mode);
  } catch (e) {
    console.warn('Cannot save theme to localStorage:', e);
  }
};
