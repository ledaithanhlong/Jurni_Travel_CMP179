-- ========================================
-- JURNI DATABASE SETUP SCRIPT
-- ========================================
-- This script creates the database for Jurni project
-- Run this in MySQL Workbench or phpMyAdmin SQL tab

-- Drop database if exists (CAUTION: This will delete all data!)
-- Uncomment the line below if you want to reset everything
-- DROP DATABASE IF EXISTS Jurni_db;

-- Create database
CREATE DATABASE IF NOT EXISTS Jurni_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE Jurni_db;

-- Show success message
SELECT 'Database Jurni_db created successfully!' AS Status;

-- Show all databases to confirm
SHOW DATABASES;

-- ========================================
-- NEXT STEPS:
-- ========================================
-- After running this script:
-- 1. Go to backend folder: cd backend
-- 2. Install dependencies: npm install
-- 3. Configure .env file with database credentials
-- 4. Run migrations: npm run db:migrate
-- 5. Start server: npm run dev
-- ========================================
