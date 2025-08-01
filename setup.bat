@echo off
echo 🚀 Setting up MCP-RISEN-Prompts...

REM Check if node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16 or higher.
    exit /b 1
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Create .env if it doesn't exist
if not exist .env (
    echo 🔧 Creating .env file...
    copy .env.example .env
)

REM The database will be created automatically on first run
echo ✅ Setup complete!
echo.
echo To configure with Claude Desktop, add this to your config:
echo   %APPDATA%\Claude\claude_desktop_config.json
echo.
echo Ready to start the server with: npm start
