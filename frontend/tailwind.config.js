/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // === 60% DOMINANT — Background Colors ===
        // Dùng: bg-dominant-white, bg-dominant-soft, bg-dominant-muted, ...
        dominant: {
          white: 'var(--color-bg-white)',
          soft: 'var(--color-bg-soft)',
          muted: 'var(--color-bg-muted)',
          subtle: 'var(--color-bg-subtle)',
          card: 'var(--color-bg-card)',
        },

        // === 30% SECONDARY — Brand Blue ===
        // Dùng: bg-brand, text-brand-dark, border-brand-light, ...
        brand: {
          DEFAULT: 'var(--color-primary)',
          dark: 'var(--color-primary-dark)',
          light: 'var(--color-primary-light)',
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
        },

        // === 30% SECONDARY — Text Colors ===
        // Dùng: text-content-heading, text-content-muted, ...
        content: {
          heading: 'var(--color-text-heading)',
          body: 'var(--color-text-body)',
          muted: 'var(--color-text-muted)',
          disabled: 'var(--color-text-disabled)',
          inverse: 'var(--color-text-inverse)',
        },

        // === 30% SECONDARY — Border Colors ===
        // Dùng: border-line-light, border-line-medium, ...
        line: {
          light: 'var(--color-border-light)',
          medium: 'var(--color-border-medium)',
          dark: 'var(--color-border-dark)',
        },

        // === 10% ACCENT — CTA only ===
        // Dùng: bg-cta, text-cta, hover:bg-cta-hover
        cta: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          soft: 'var(--color-accent-soft)',
          light: 'var(--color-accent-light)',
        },

        // --- Legacy support (giữ để không break code cũ) ---
        'primary': {
          50: '#E3F2FD', 100: '#BBDEFB', 200: '#90CAF9',
          300: '#64B5F6', 400: '#42A5F5', 500: '#2196F3',
          600: '#1E88E5', 700: '#1976D2', 800: '#1565C0',
          900: '#0D47A1', DEFAULT: '#1976D2',
          dark: '#0D47A1', light: '#BBDEFB',
        },
        'accent': {
          50: '#FFF3E0', 100: '#FFE0B2', 200: '#FFCC80',
          300: '#FFB74D', 400: '#FFA726', 500: '#FF9800',
          DEFAULT: '#FF6B35', hover: '#F57C00', light: '#FFB74D',
        },
        'success': { DEFAULT: '#4CAF50', 50: '#E8F5E9', 500: '#4CAF50', 700: '#388E3C' },
        'warning': { DEFAULT: '#FFC107', 50: '#FFF8E1', 500: '#FFC107' },
        'error': { DEFAULT: '#F44336', 50: '#FFEBEE', 500: '#F44336', 700: '#D32F2F' },
        'neutral': {
          50: '#FAFAFA', 100: '#F5F5F5', 200: '#EEEEEE',
          400: '#BDBDBD', 500: '#9E9E9E', 600: '#757575',
          700: '#616161', 800: '#424242', 900: '#212121',
        },
        'blue-dark': '#0D47A1',
        'blue-medium': '#1976D2',
        'blue-light': '#BBDEFB',
        'orange-accent': '#FF6B35',
        'orange-hover': '#F57C00',
        'text-dark': '#212121',
      },
      boxShadow: {
        'accent': 'var(--shadow-accent)',
        'primary': 'var(--shadow-primary)',
      },
      borderRadius: {
        'brand': 'var(--radius-md)',
        'card': '8px',
      },
    },
  },
  plugins: [],
};



