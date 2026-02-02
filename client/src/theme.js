export const colors = {
  primary: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
  },
  secondary: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  accent: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  earth: {
    50: '#faf5f0',
    100: '#f0e6d9',
    200: '#e6d4b8',
    300: '#d9b896',
    400: '#c99a71',
    500: '#b8864e',
    600: '#a3723b',
    700: '#8a5d32',
    800: '#6f4a2d',
    900: '#5a3e27',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    700: '#047857',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    700: '#b91c1c',
  },
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  '3xl': '0 35px 60px -15px rgb(0 0 0 / 0.3)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
};

export const typography = {
  h1: 'text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl',
  h2: 'text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl',
  h3: 'text-2xl font-semibold text-gray-900',
  h4: 'text-xl font-semibold text-gray-900',
  h5: 'text-lg font-medium text-gray-900',
  body: 'text-base text-gray-700',
  small: 'text-sm text-gray-500',
  xs: 'text-xs text-gray-500',
};

export const transitions = {
  DEFAULT: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
  slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
};

export const borderRadius = {
  sm: '0.25rem',
  DEFAULT: '0.5rem',
  md: '0.75rem',
  lg: '1rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
};

export const gradients = {
  hero: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)',
  heroOverlay: 'linear-gradient(135deg, rgba(5, 150, 105, 0.95) 0%, rgba(5, 105, 70, 0.98) 100%)',
  card: 'linear-gradient(180deg, #ffffff 0%, #f9fafb 100%)',
  accent: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  earth: 'linear-gradient(135deg, #b8864e 0%, #8a5d32 100%)',
};

export const backdropBlur = {
  none: 'blur(0)',
  sm: 'blur(4px)',
  md: 'blur(8px)',
  lg: 'blur(12px)',
  xl: 'blur(16px)',
};
