#!/bin/bash

echo "🚀 Setting up MCP-RISEN-Prompts..."

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16 or higher."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "🔧 Creating .env file..."
    cp .env.example .env
fi

# The database will be created automatically on first run
echo "✅ Setup complete!"
echo ""
echo "To configure with Claude Desktop, add this to your config:"
echo "  - macOS: ~/Library/Application Support/Claude/claude_desktop_config.json"
echo "  - Windows: %APPDATA%\\Claude\\claude_desktop_config.json"
echo ""
echo "Ready to start the server with: npm start"
