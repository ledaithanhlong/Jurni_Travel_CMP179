/**
 * Jurni Travel - Color Palette & Theme
 * Thiết kế hiện đại, tươi sáng, phù hợp website du lịch
 * Đảm bảo contrast AA trở lên cho accessibility
 */

export const colors = {
  // Primary Colors - Xanh dương (chủ đạo)
  primary: {
    50: '#E3F2FD',   // Xanh rất nhạt - dùng cho nền section (mờ mờ)
    100: '#BBDEFB',  // Xanh nhạt - hover, border nhạt
    200: '#90CAF9',  // Xanh nhạt vừa
    300: '#64B5F6',  // Xanh trung bình nhạt
    400: '#42A5F5',  // Xanh trung bình
    500: '#2196F3',  // Xanh chính (Material Blue)
    600: '#1E88E5', // Xanh đậm vừa
    700: '#1976D2',  // Xanh đậm - chỉ dùng cho navbar, header, footer
    800: '#1565C0',  // Xanh rất đậm - hover cho primary
    900: '#0D47A1',  // Xanh cực đậm - primary button, text heading
    DEFAULT: '#E3F2FD', // Màu mặc định - xanh nhạt mờ
    dark: '#0D47A1',    // Màu đậm cho text, button
    light: '#E3F2FD',   // Màu nhạt mờ cho background
  },

  // Secondary Colors - Xanh nhạt cho nền
  secondary: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
    DEFAULT: '#BBDEFB',
  },

  // Accent Colors - Cam đậm (nổi bật, contrast tốt)
  accent: {
    50: '#FFF3E0',
    100: '#FFE0B2',
    200: '#FFCC80',
    300: '#FFB74D',
    400: '#FFA726',
    500: '#FF9800',  // Cam chuẩn
    600: '#FB8C00',  // Cam đậm vừa
    700: '#F57C00',  // Cam đậm - dùng cho hover
    800: '#EF6C00',  // Cam rất đậm
    900: '#E65100',  // Cam cực đậm
    DEFAULT: '#FF6B35', // Cam đậm - contrast tốt trên nền xanh
    hover: '#F57C00',   // Cam hover
    light: '#FFB74D',    // Cam nhạt
  },

  // Success Colors
  success: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    500: '#4CAF50',
    600: '#43A047',
    700: '#388E3C',
    DEFAULT: '#4CAF50',
  },

  // Warning Colors
  warning: {
    50: '#FFF8E1',
    100: '#FFECB3',
    500: '#FFC107',
    600: '#FFB300',
    700: '#FFA000',
    DEFAULT: '#FFC107',
  },

  // Error Colors
  error: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    500: '#F44336',
    600: '#E53935',
    700: '#D32F2F',
    DEFAULT: '#F44336',
  },

  // Neutral Colors
  neutral: {
    50: '#FAFAFA',   // Nền rất nhạt
    100: '#F5F5F5',  // Nền nhạt
    200: '#EEEEEE',  // Border nhạt
    300: '#E0E0E0',  // Border
    400: '#BDBDBD',  // Text muted
    500: '#9E9E9E',  // Text disabled
    600: '#757575',  // Text secondary
    700: '#616161',  // Text
    800: '#424242',  // Text đậm
    900: '#212121',  // Text rất đậm
    DEFAULT: '#F5F5F5',
  },

  // Text Colors
  text: {
    primary: '#212121',      // Text chính trên nền trắng
    secondary: '#757575',    // Text phụ
    muted: '#9E9E9E',        // Text muted
    inverse: '#FFFFFF',       // Text trên nền xanh
    onPrimary: '#FFFFFF',    // Text trên primary
    onAccent: '#FFFFFF',     // Text trên accent
    heading: '#0D47A1',      // Heading color
    body: '#212121',         // Body text
  },

  // Background Colors
  background: {
    default: '#FFFFFF',       // Nền trắng
    paper: '#FFFFFF',         // Nền card trắng
    light: '#F5F5F5',        // Nền xám nhạt
    section: '#E3F2FD',       // Nền section xanh nhạt mờ (mới)
    sectionAlt: '#BBDEFB',    // Nền section xanh nhạt (hover)
    primary: '#1976D2',      // Nền xanh trung bình (chỉ navbar, header)
    dark: '#0D47A1',         // Nền xanh đậm (chỉ footer)
  },

  // Border Colors
  border: {
    light: '#E3F2FD',        // Border xanh nhạt mờ (mới)
    default: '#E0E0E0',      // Border mặc định
    medium: '#BBDEFB',       // Border xanh nhạt (hover)
    dark: '#1976D2',         // Border xanh đậm
    accent: '#FF6B35',       // Border cam
  },
};

// Gradient Options
export const gradients = {
  primary: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)',
  accent: 'linear-gradient(135deg, #FF6B35 0%, #F57C00 100%)',
  hero: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #42A5F5 100%)',
  card: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
  overlay: 'linear-gradient(to bottom, rgba(13, 71, 161, 0.45), rgba(13, 71, 161, 0.15), rgba(13, 71, 161, 0.55))',
};

// Shadow Styles
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  accent: '0 4px 14px 0 rgba(255, 107, 53, 0.3)',
  primary: '0 4px 14px 0 rgba(13, 71, 161, 0.3)',
};

// Button Styles
export const buttonStyles = {
  primary: {
    backgroundColor: colors.primary[900], // #0D47A1
    color: colors.text.inverse,
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: 600,
    boxShadow: shadows.md,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[800], // #1565C0
      boxShadow: shadows.lg,
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: shadows.sm,
    },
  },
  secondary: {
    backgroundColor: colors.accent.DEFAULT, // #FF6B35
    color: colors.text.inverse,
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: 600,
    boxShadow: shadows.accent,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.accent.hover, // #F57C00
      boxShadow: shadows.lg,
      transform: 'translateY(-1px)',
    },
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: shadows.sm,
    },
  },
  outline: {
    backgroundColor: 'transparent',
    color: colors.primary[900],
    border: `2px solid ${colors.primary[900]}`,
    borderRadius: '8px',
    padding: '10px 22px',
    fontWeight: 600,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.primary[100],
      borderColor: colors.primary[700],
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.text.primary,
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: 500,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: colors.background.section,
      color: colors.accent.DEFAULT,
    },
  },
};

// Card Styles
export const cardStyles = {
  default: {
    backgroundColor: colors.background.paper,
    borderRadius: '8px',
    boxShadow: shadows.md,
    border: `1px solid ${colors.border.light}`,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: shadows.lg,
      transform: 'translateY(-2px)',
    },
  },
  primary: {
    backgroundColor: colors.primary[700], // #1976D2
    color: colors.text.inverse,
    borderRadius: '8px',
    boxShadow: shadows.lg,
    border: `1px solid ${colors.primary[600]}`,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: shadows.xl,
      transform: 'translateY(-2px)',
      borderColor: colors.accent.DEFAULT,
    },
  },
  accent: {
    backgroundColor: colors.background.paper,
    borderRadius: '8px',
    boxShadow: shadows.md,
    border: `2px solid ${colors.accent.DEFAULT}`,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: shadows.accent,
      transform: 'translateY(-2px)',
    },
  },
};

// Icon Colors
export const iconColors = {
  primary: colors.primary[900],
  secondary: colors.primary[700],
  accent: colors.accent.DEFAULT,
  success: colors.success.DEFAULT,
  warning: colors.warning.DEFAULT,
  error: colors.error.DEFAULT,
  muted: colors.neutral[500],
};

// Complete Theme Object
export const theme = {
  colors,
  gradients,
  shadows,
  buttonStyles,
  cardStyles,
  iconColors,
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  typography: {
    fontFamily: {
      sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '30px',
      '4xl': '36px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
};

export default theme;

