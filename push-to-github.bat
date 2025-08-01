@echo off
echo ======================================
echo  Pushing MCP-RISEN-Prompts to GitHub
echo ======================================
echo.

echo First, you need to create a new repository on GitHub:
echo 1. Go to: https://github.com/new
echo 2. Repository name: mcp-risen-prompts
echo 3. Description: RISEN Prompt Engineering MCP Server - A structured approach to prompt engineering
echo 4. Public repository
echo 5. DO NOT initialize with README, .gitignore, or License
echo 6. Click "Create repository"
echo.
pause

echo.
echo Now let's push your project...
echo.

REM Add all files
git add .

REM Commit
git commit -m "Initial commit: RISEN Prompt Engineering MCP Server"

REM Add remote origin
git remote add origin https://github.com/doritoman90000/mcp-risen-prompts.git

REM Push to main branch
git branch -M main
git push -u origin main

echo.
echo ✅ Done! Your project should now be live at:
echo https://github.com/doritoman90000/mcp-risen-prompts
echo.
pause
