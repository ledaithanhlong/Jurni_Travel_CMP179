require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'Jurni_db',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    charset: process.env.DB_CHARSET || 'utf8mb4',
    collate: process.env.DB_COLLATE || 'utf8mb4_unicode_ci',
    logging: true,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 5,
      min: parseInt(process.env.DB_POOL_MIN) || 0,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    },
    dialectOptions: {
      charset: process.env.DB_CHARSET || 'utf8mb4',
      collate: process.env.DB_COLLATE || 'utf8mb4_unicode_ci',
      supportBigNumbers: true,
      bigNumberStrings: true,
      dateStrings: true,
      typeCast: true
    },
    define: {
      charset: process.env.DB_CHARSET || 'utf8mb4',
      collate: process.env.DB_COLLATE || 'utf8mb4_unicode_ci'
    },
    timezone: '+07:00'
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME + '_test' || 'Jurni_db_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
    charset: process.env.DB_CHARSET || 'utf8mb4',
    collate: process.env.DB_COLLATE || 'utf8mb4_unicode_ci'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql',
    charset: process.env.DB_CHARSET || 'utf8mb4',
    collate: process.env.DB_COLLATE || 'utf8mb4_unicode_ci',
    logging: false,
    pool: {
      max: parseInt(process.env.DB_POOL_MAX) || 10,
      min: parseInt(process.env.DB_POOL_MIN) || 2,
      acquire: parseInt(process.env.DB_POOL_ACQUIRE) || 30000,
      idle: parseInt(process.env.DB_POOL_IDLE) || 10000
    },
    dialectOptions: {
      charset: process.env.DB_CHARSET || 'utf8mb4',
      collate: process.env.DB_COLLATE || 'utf8mb4_unicode_ci',
      ssl: {
        rejectUnauthorized: false
      }
    },
    timezone: '+07:00'
  }
};


