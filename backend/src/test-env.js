import dotenv from 'dotenv';
import { env } from './config/env.js';
import db from './models/index.js';

// Load environment variables
dotenv.config();

console.log('=== MySQL Database Configuration Test ===');
console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS ? 'Set' : 'Empty');
console.log('DB_DIALECT:', process.env.DB_DIALECT);
console.log('DB_CHARSET:', process.env.DB_CHARSET);

console.log('\n=== Parsed Database Config ===');
console.log('Host:', env.db.host);
console.log('Port:', env.db.port);
console.log('Database:', env.db.name);
console.log('User:', env.db.user);
console.log('Password:', env.db.pass ? 'Set' : 'Empty');
console.log('Dialect:', env.db.dialect);
console.log('Charset:', env.db.charset);
console.log('Collate:', env.db.collate);
console.log('Pool config:', env.db.pool);

console.log('\n=== Testing Database Connection ===');
try {
  await db.sequelize.authenticate();
  console.log('✅ Database connection successful!');
  
  console.log('\n=== Database Info ===');
  const queryInterface = db.sequelize.getQueryInterface();
  const tables = await queryInterface.showAllTables();
  console.log('Existing tables:', tables.length > 0 ? tables : 'No tables found');
  
} catch (error) {
  console.error('❌ Database connection failed:');
  console.error('Error:', error.message);
  console.error('Code:', error.original?.code);
  console.error('SQL State:', error.original?.sqlState);
  
  if (error.original?.code === 'ER_BAD_DB_ERROR') {
    console.log('\n💡 Database does not exist. Create it with:');
    console.log(`CREATE DATABASE ${env.db.name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  }
  
  if (error.original?.code === 'ER_ACCESS_DENIED_ERROR') {
    console.log('\n💡 Check your MySQL credentials in .env file');
  }
}

process.exit(0);