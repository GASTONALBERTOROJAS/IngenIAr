import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#135091',
          dark: '#0D3A6B',
          light: '#1A6BC4',
          tint: '#E8F0FB',
        },
        background: '#F5F7FA',
        surface: '#FFFFFF',
        'text-primary': '#2C2C2C',
        'text-muted': '#64748B',
        border: '#E0E4EB',
        success: {
          DEFAULT: '#1A7A44',
          bg: '#D1FAE5',
        },
        warning: {
          DEFAULT: '#C45A00',
          bg: '#FEF3C7',
        },
        danger: {
          DEFAULT: '#B91C1C',
          bg: '#FEE2E2',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        h1: ['28px', { lineHeight: '1.2', fontWeight: '600' }],
        h2: ['20px', { lineHeight: '1.3', fontWeight: '500' }],
        h3: ['15px', { lineHeight: '1.4', fontWeight: '500' }],
        body: ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        small: ['12px', { lineHeight: '1.5', fontWeight: '400' }],
        micro: ['11px', { lineHeight: '1.4', fontWeight: '400' }],
      },
    },
  },
  plugins: [],
};

export default config;