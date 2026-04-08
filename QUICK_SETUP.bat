@echo off
chcp 65001 >nul
echo ========================================
echo 🚀 JURNI DATABASE QUICK SETUP
echo ========================================
echo.

REM Check if we're in the backend directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the backend directory
    echo.
    pause
    exit /b 1
)

echo 📦 Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed
echo.

echo 📄 Step 2: Checking .env file...
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from .env.example...
    copy .env.example .env >nul
    echo ✅ .env file created
    echo ⚠️  IMPORTANT: Please edit .env file and configure your settings
    echo.
    pause
) else (
    echo ✅ .env file exists
)
echo.

echo 🗄️  Step 3: Running database migrations...
call npm run db:migrate
if %errorlevel% neq 0 (
    echo ❌ Failed to run migrations
    echo.
    echo 💡 Troubleshooting:
    echo    1. Make sure MySQL is running (XAMPP/WAMP)
    echo    2. Check if database 'Jurni_db' exists
    echo    3. Verify .env database credentials
    echo.
    pause
    exit /b 1
)
echo ✅ Migrations completed successfully
echo.

echo ========================================
echo ✅ SETUP COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo 🎯 Next steps:
echo    1. Start backend: npm run dev
echo    2. Go to frontend folder: cd ../frontend
echo    3. Install frontend: npm install
echo    4. Start frontend: npm run dev
echo.
echo 🌐 Access:
echo    - Frontend: http://localhost:5173
echo    - Backend:  http://localhost:5000
echo.
pause
