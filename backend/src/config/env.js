import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database Configuration
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    name: process.env.DB_NAME || 'Jurni_db',
    user: process.env.DB_USER || 'root',
    pass: process.env.DB_PASS || '',
    dialect: process.env.DB_DIALECT || 'mysql',
    charset: process.env.DB_CHARSET || 'utf8mb4',
    collate: process.env.DB_COLLATE || 'utf8mb4_unicode_ci',
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 5,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    }
  },

  // Authentication & Authorization
  clerk: {
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY || '',
    secretKey: process.env.CLERK_SECRET_KEY || ''
  },
  adminEmails: (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean),

  jwt: {
    secret: process.env.JWT_SECRET || 'jurni-travel-secret-key-2024',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },

  // Development & Testing
  dev: {
    authToken: process.env.DEV_AUTH_TOKEN || '',
    authUserId: process.env.DEV_AUTH_USER_ID || '',
    authEmail: process.env.DEV_AUTH_EMAIL || ''
  },

  // Cloud Services
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
    uploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || 'jurni_travel'
  },

  // AI & Chat Services
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
  },

  // Email Service
  email: {
    service: process.env.EMAIL_SERVICE || 'gmail',
    user: process.env.EMAIL_USER || '',
    pass: process.env.EMAIL_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@jurnitravel.com'
  },

  // Payment Gateway
  stripe: {
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
  },
  paypal: {
    clientId: process.env.PAYPAL_CLIENT_ID || '',
    clientSecret: process.env.PAYPAL_CLIENT_SECRET || '',
    mode: process.env.PAYPAL_MODE || 'sandbox'
  },

  // Networking & Tunneling
  tunnelUrl: process.env.TUNNEL_URL || '',
  frontendTunnelUrl: process.env.FRONTEND_TUNNEL_URL || '',
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3000')
    .split(',').map(origin => origin.trim()).filter(Boolean),

  // Security & Rate Limiting
  security: {
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
    rateLimitMaxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    sessionSecret: process.env.SESSION_SECRET || 'jurni-session-secret-2024'
  },

  // Features & Toggles
  features: {
    enableChat: process.env.ENABLE_CHAT === 'true',
    enableAiRecommendations: process.env.ENABLE_AI_RECOMMENDATIONS === 'true',
    enableEmailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true',
    enableSmsNotifications: process.env.ENABLE_SMS_NOTIFICATIONS === 'true',
    enablePaymentIntegration: process.env.ENABLE_PAYMENT_INTEGRATION === 'true',
    enableSoftDelete: process.env.ENABLE_SOFT_DELETE !== 'false' // Default true
  },

  // Logging & File Upload
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'false' // Default true
  },

  fileUpload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    maxFilesPerUpload: parseInt(process.env.MAX_FILES_PER_UPLOAD) || 10
  },

  // Third-party Integrations
  googleMaps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || ''
  },

  socialLogin: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
    },
    facebook: {
      appId: process.env.FACEBOOK_APP_ID || '',
      appSecret: process.env.FACEBOOK_APP_SECRET || ''
    }
  }
};


