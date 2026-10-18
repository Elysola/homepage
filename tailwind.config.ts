import type { Config } from 'tailwindcss'

declare function require(name: string): unknown

/**
 * Maps the Elysola Studio Token contract (assets/css/tailwind.css) onto
 * semantic Tailwind utilities. See https://docs.elysola.org/design-system/tokens
 *
 *   bg-canvas | bg-surface | bg-muted | bg-elevated | bg-accent | bg-action
 *   text-primary | text-secondary | text-muted | text-action | text-on-action
 *   text-success | text-warning | text-danger
 *   border-default | border-action | border-focus
 *   rounded-control | rounded-surface | rounded-overlay | rounded-badge
 *   h-control-sm | h-control-md | h-control-lg
 *   shadow-surface | shadow-overlay | shadow-dialog
 */
const v = (name: string) => `var(--studio-${name})`

export default <Config>{
  darkMode: 'class',
  plugins: [require('@tailwindcss/typography')],
  content: [
    'app.vue',
    'error.vue',
    'components/**/*.vue',
    'pages/**/*.vue',
    'assets/css/**/*.css',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [v('font-sans')],
        mono: [v('font-mono')],
      },
      // Type scale per tokens: size / line-height pairs
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      colors: {
        brand: {
          50: 'var(--brand-50)',
          100: 'var(--brand-100)',
          200: 'var(--brand-200)',
          300: 'var(--brand-300)',
          600: 'var(--brand-600)',
          700: 'var(--brand-700)',
        },
      },
      backgroundColor: {
        canvas: v('color-bg-canvas'),
        surface: v('color-bg-surface'),
        muted: v('color-bg-muted'),
        elevated: v('color-bg-elevated'),
        accent: v('color-bg-accent'),
        action: v('color-action-primary'),
        'action-hover': v('color-action-primary-hover'),
      },
      textColor: {
        primary: v('color-text-primary'),
        secondary: v('color-text-secondary'),
        muted: v('color-text-muted'),
        action: v('color-action-primary'),
        'action-hover': v('color-action-primary-hover'),
        'on-action': v('color-on-action'),
        success: v('color-status-success'),
        warning: v('color-status-warning'),
        danger: v('color-status-danger'),
      },
      borderColor: {
        DEFAULT: v('color-border-default'),
        default: v('color-border-default'),
        action: v('color-action-primary'),
        focus: v('color-focus-ring'),
      },
      divideColor: {
        default: v('color-border-default'),
      },
      borderRadius: {
        control: v('radius-control'),
        surface: v('radius-surface'),
        overlay: v('radius-overlay'),
        badge: v('radius-badge'),
      },
      height: {
        'control-sm': v('control-height-sm'),
        'control-md': v('control-height-md'),
        'control-lg': v('control-height-lg'),
      },
      width: {
        'control-sm': v('control-height-sm'),
        'control-md': v('control-height-md'),
        'control-lg': v('control-height-lg'),
      },
      boxShadow: {
        surface: v('shadow-surface'),
        overlay: v('shadow-overlay'),
        dialog: v('shadow-dialog'),
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
    },
  },
}
