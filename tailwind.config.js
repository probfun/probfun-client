import typography from '@tailwindcss/typography';
import daisyui from 'daisyui';
import animate from 'tailwindcss-animate';

function round(num) {
  return num
    .toFixed(7)
    .replace(/(\.\d*[1-9])0+$/, '$1')
    .replace(/\.0$/, '');
}
const em = (px, base) => `${round(px / base)}em`;
/** @type {import('tailwindcss').Config} */

export default {
  darkMode: ['class'],
  safelist: ['dark'],
  prefix: '',

  content: [
    './pages/**/*.{ts,tsx,vue}',
    './components/**/*.{ts,tsx,vue}',
    './app/**/*.{ts,tsx,vue}',
    './src/**/*.{ts,tsx,vue}',
  ],

  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['NotoSansSC', 'sans-serif'], // 默认字体
        noto: ['NotoSansSC', 'sans-serif'], // 自定义字体
      },
      fontWeight: {
        thin: 100,
        extralight: 200,
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900,
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 4px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'collapsible-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-in-out',
        'collapsible-up': 'collapsible-up 0.2s ease-in-out',
      },
      typography: () => ({
        DEFAULT: {
          css: {
            'color': 'inherit', // 禁用默认颜色，使用继承的颜色
            'a': {
              'color': 'inherit', // 链接颜色也继承
              '&:hover': {
                color: 'inherit', // 禁用 hover 的颜色
              },
            },
            'h1': { color: 'inherit' },
            'h2': { color: 'inherit' },
            'h3': { color: 'inherit' },
            'h4': { color: 'inherit' },
            'h5': { color: 'inherit' },
            'h6': { color: 'inherit' },
            'strong': { color: 'inherit' },
            'code': { color: 'inherit' },
            'p': {
              marginTop: em(5, 16),
              marginBottom: em(5, 16),
            },
            'ol > li::marker': {
              color: 'inherit',
            },
            'ul > li::marker': {
              color: 'inherit',
            },
          },
        },
      }),
    },
  },
  plugins: [animate, typography, daisyui],
  daisyui: {
    themes: [
      {
        mytheme: {
          'primary': '#2148C0',
          'secondary': '#93c5fd',
          'accent': '#00ffff',
          'neutral': '#e5e7eb',
          'base-100': '#ffffff',
          'info': '#0000ff',
          'success': '#4ade80',
          'warning': '#facc15',
          'error': '#ef4444',
        },
      },
      'light',
      'dark',
    ],
  },
};
