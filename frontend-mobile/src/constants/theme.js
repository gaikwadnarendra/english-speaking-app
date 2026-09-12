// Mobile Theme Design Tokens (Optimized for performance & budget Android screens)

export const COLORS = {
  primary: '#f97316',
  primaryHover: '#ea580c',
  primaryLight: '#ffedd5',
  primaryDark: '#c2410c',

  secondary: '#4f46e5',
  secondaryHover: '#4338ca',
  secondaryLight: '#e0e7ff',

  accentGreen: '#10b981',
  accentGreenLight: '#d1fae5',
  accentGreenDark: '#065f46',

  accentRed: '#ef4444',
  accentRedLight: '#fee2e2',
  accentRedDark: '#991b1b',

  accentAmber: '#f59e0b',
  accentAmberLight: '#fef3c7',
  accentAmberDark: '#92400e',

  bgMain: '#f8fafc',
  bgCard: '#ffffff',
  bgDark: '#0f172a',
  bgDarkCard: '#1e293b',

  textMain: '#0f172a',
  textMuted: '#64748b',
  textLight: '#94a3b8',
  white: '#ffffff',

  borderColor: '#e2e8f0',
  borderHover: '#cbd5e1',
  borderAmber: '#fed7aa',
  borderGreen: '#bbf7d0'
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  xxl: 36
};

export const RADIUS = {
  sm: 8,
  md: 14,
  lg: 20,
  full: 9999
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3
  },
  lg: {
    shadowColor: '#f97316',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  }
};
