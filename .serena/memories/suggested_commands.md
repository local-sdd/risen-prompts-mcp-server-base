# Suggested Commands for RISEN Prompt Engineering MCP Server

## Setup and Installation
```bash
# Install dependencies
npm install

# Run setup script (optional, but recommended)
./setup.sh  # On macOS/Linux
# or
setup.bat   # On Windows
```

## Running the Server
```bash
# Start the server directly
npm start
# or
node server.js

# Run with debug logging
DEBUG=true node server.js
```

## Testing Commands
```bash
# Run all tests
npm test

# Run specific test files
node test-mcp.js
node test-final.js
node diagnostic.js

# Test server startup
node test-standalone.js
```

## Configuration
```bash
# Set environment variables for security/performance tuning
export MAX_TEMPLATE_NAME_LENGTH=200
export MAX_DESCRIPTION_LENGTH=1000
export PAGINATION_LIMIT=50
export RISEN_DB_PATH=/custom/path/to/database.db
export DEBUG=true
```

## Development Utilities
```bash
# Check dependencies and imports
node diagnostic.js

# Run final server test
node test-final.js

# Run server with debugging
node debug-server.js
```

## MCP Protocol Testing
```bash
# Test MCP protocol compliance
node test-mcp.js

# Test server spawn
node test-server-spawn.js
node test-server-final.js
```

## System Commands (Darwin/macOS)
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# List project files
ls -la

# Check if server is running on a port (if applicable)
lsof -i :port_number

# View database directly (SQLite)
sqlite3 risen_prompts.db ".tables"
sqlite3 risen_prompts.db "SELECT * FROM templates LIMIT 5;"
```

## Git Commands
```bash
# Standard git operations
git add .
git commit -m "Your commit message"
git push origin main

# Run pre-push setup
./push-to-github.bat  # On Windows
```

## Database Management
```bash
# Check database file
ls -la risen_prompts.db

# View database schema
sqlite3 risen_prompts.db ".schema"

# Check template count
sqlite3 risen_prompts.db "SELECT COUNT(*) FROM templates;"

# Check experiment count
sqlite3 risen_prompts.db "SELECT COUNT(*) FROM experiments;"
```

## Environment Configuration
The server supports various environment variables for security and performance tuning:
- `MAX_TEMPLATE_NAME_LENGTH`: Maximum length for template names (default: 100)
- `MAX_DESCRIPTION_LENGTH`: Maximum length for descriptions (default: 500)
- `MAX_INSTRUCTIONS_LENGTH`: Maximum length for instructions (default: 2000)
- `PAGINATION_LIMIT`: Number of results per page (default: 20)
- `RISEN_DB_PATH`: Path to the SQLite database file
- `DEBUG`: Enable debug logging when set to 'true'