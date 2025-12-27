# Style and Conventions for RISEN Prompt Engineering MCP Server

## Code Style
- **Language**: JavaScript (ES6+ modules)
- **File Naming**: Use camelCase for JavaScript files (e.g., server.js, security-config.js)
- **Module System**: ES6 modules with .js extension and explicit .js imports
- **Indentation**: 2 spaces
- **Line Length**: No strict limit, but aim for readability
- **Semicolons**: Used consistently

## Naming Conventions
- **Variables and Functions**: camelCase (e.g., validateRISEN, dbRun, initDatabase)
- **Constants**: UPPERCASE with underscores (e.g., MAX_TEMPLATE_NAME_LENGTH)
- **Classes**: PascalCase (though not heavily used in this project)
- **MCP Tools**: snake_case with 'risen_' prefix (e.g., risen_create, risen_validate)

## Code Structure
- **Main Server**: Single file architecture in server.js
- **Configuration**: Separate security-config.js file
- **Error Handling**: Try-catch blocks with proper logging to stderr
- **Database Operations**: Promisified for async/await usage
- **Logging**: Use console.error for server logs to avoid interfering with MCP protocol

## Database Conventions
- **Tables**: templates and experiments
- **Primary Keys**: TEXT type using UUIDs
- **JSON Storage**: Use JSON.stringify/JSON.parse for arrays and objects in TEXT fields
- **Parameterized Queries**: Always use parameterized queries to prevent SQL injection

## MCP Protocol Implementation
- **Tool Names**: Follow the pattern 'risen_{action}' (e.g., risen_create, risen_execute)
- **Input Schemas**: Define comprehensive JSON schemas for all tool parameters
- **Response Format**: Use MCP-compliant response format with content array containing text type
- **Error Responses**: Return appropriate error messages in MCP format

## Security Practices
- **Input Validation**: Validate all inputs with size limits and format checks
- **SQL Injection Prevention**: Use parameterized queries
- **Environment Variables**: Use environment variables for configuration with secure defaults
- **Error Details**: Avoid exposing sensitive information in error messages

## Documentation Style
- **Comments**: Use JSDoc-style comments for complex functions
- **Inline Comments**: Use for explaining complex logic or business rules
- **Console Logs**: Use format [RISEN] for all server logs to identify source

## Error Handling
- **Database Operations**: Wrap in try-catch with proper error propagation
- **MCP Tool Handlers**: Catch errors and return user-friendly messages
- **Server Startup**: Implement retry logic for database initialization
- **Logging**: Log errors to stderr for debugging while returning generic messages to users