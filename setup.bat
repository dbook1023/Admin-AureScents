@echo off
TITLE AURE SCENTS - Project Setup
echo ------------------------------------------------
echo    AURE SCENTS EXECUTIVE PORTFOLIO SETUP   
echo ------------------------------------------------

echo [1/3] Installing dependencies...
call npm install

echo [2/3] Configuring environment variables...
if not exist .env (
    copy .env.example .env
    echo SUCCESS: .env file created.
    echo IMPORTANT: Open .env and add your Supabase credentials!
) else (
    echo NOTE: .env already exists.
)

echo [3/3] Finalizing...
echo Project setup complete.
echo.
echo To start the project, type: npm run dev
echo.
pause
npm run dev
