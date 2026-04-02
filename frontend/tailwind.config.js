/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary - Xanh dương (chủ đạo)
        'primary': {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
          DEFAULT: '#1976D2',
          dark: '#0D47A1',
          light: '#BBDEFB',
        },
        // Accent - Cam đậm (nổi bật, contrast tốt)
        'accent': {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF9800',
          600: '#FB8C00',
          700: '#F57C00',
          800: '#EF6C00',
          900: '#E65100',
          DEFAULT: '#FF6B35', // Cam đậm - contrast tốt trên nền xanh
          hover: '#F57C00',
          light: '#FFB74D',
        },
        // Success, Warning, Error
        'success': {
          50: '#E8F5E9',
          100: '#C8E6C9',
          500: '#4CAF50',
          600: '#43A047',
          700: '#388E3C',
          DEFAULT: '#4CAF50',
        },
        'warning': {
          50: '#FFF8E1',
          100: '#FFECB3',
          500: '#FFC107',
          600: '#FFB300',
          700: '#FFA000',
          DEFAULT: '#FFC107',
        },
        'error': {
          50: '#FFEBEE',
          100: '#FFCDD2',
          500: '#F44336',
          600: '#E53935',
          700: '#D32F2F',
          DEFAULT: '#F44336',
        },
        // Neutral
        'neutral': {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
          DEFAULT: '#F5F5F5',
        },
        // Legacy support (giữ để không break code cũ)
        'blue-dark': '#0D47A1',
        'blue-medium': '#1976D2',
        'blue-light': '#BBDEFB',
        'orange-accent': '#FF6B35',
        'orange-hover': '#F57C00',
        'gray-light': '#F5F5F5',
        'text-dark': '#212121',
      },
      boxShadow: {
        'accent': '0 4px 14px 0 rgba(255, 107, 53, 0.3)',
        'primary': '0 4px 14px 0 rgba(13, 71, 161, 0.3)',
      },
      borderRadius: {
        'card': '8px',
      }
    }
  },
  plugins: []
};


