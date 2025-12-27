# RISEN Prompt Engineering MCP Server - Project Context

## Project Overview

The RISEN Prompt Engineering MCP Server is a Model Context Protocol (MCP) server that implements the RISEN framework for structured prompt engineering. It provides a systematic approach to creating, validating, managing, and optimizing AI prompts using the RISEN methodology (Role, Instructions, Steps, Expectations, Narrowing).

### Core Purpose
- **Structured Prompt Engineering**: Implements the RISEN framework for creating high-quality prompts
- **Template Management**: Create, store, and organize RISEN prompt templates with variables
- **Performance Tracking**: Monitor prompt effectiveness with ratings and analytics
- **MCP Integration**: Integrates with Claude Desktop and other MCP-compatible tools

### Architecture
- **Server Type**: Node.js MCP server using the Model Context Protocol SDK
- **Database**: SQLite3 for persistent storage of templates and experiment data
- **Data Model**: Two main tables (templates, experiments) with relationships
- **API**: MCP-compliant tool interface with 8 core tools

### RISEN Framework Components
1. **Role**: Define the AI's persona/expertise
2. **Instructions**: Clear directives for the task
3. **Steps**: Breakdown of the process
4. **Expectations**: Desired outcome/format
5. **Narrowing**: Constraints or creative elements

## Building and Running

### Prerequisites
- Node.js 16.0.0 or higher
- npm package manager

### Installation
```bash
# Clone or download the repository
# Install dependencies
npm install

# Run setup script (optional, but recommended)
./setup.sh  # On macOS/Linux
# or
setup.bat   # On Windows
```

### Running the Server
```bash
# Start the server directly
npm start
# or
node server.js

# Test the server
npm test
# or run specific test files
node test-mcp.js
node test-final.js
```

### Configuration for Claude Desktop
Add the following to your Claude Desktop config file:

**macOS/Linux:**
```json
{
  "mcpServers": {
    "risen-prompts": {
      "command": "node",
      "args": ["/path/to/mcp-risen-prompts/server.js"],
      "cwd": "/path/to/mcp-risen-prompts"
    }
  }
}
```

**Windows:**
```json
{
  "mcpServers": {
    "risen-prompts": {
      "command": "node",
      "args": ["C:\\path\\to\\mcp-risen-prompts\\server.js"],
      "cwd": "C:\\path\\to\\mcp-risen-prompts"
    }
  }
}
```

### Environment Configuration
The server supports various environment variables for security and performance tuning:
- `MAX_TEMPLATE_NAME_LENGTH`: Maximum length for template names (default: 100)
- `MAX_DESCRIPTION_LENGTH`: Maximum length for descriptions (default: 500)
- `MAX_INSTRUCTIONS_LENGTH`: Maximum length for instructions (default: 2000)
- `PAGINATION_LIMIT`: Number of results per page (default: 20)
- `RISEN_DB_PATH`: Path to the SQLite database file
- `DEBUG`: Enable debug logging when set to 'true'

## Development Conventions

### Code Structure
- **server.js**: Main server implementation with all MCP tool handlers
- **security-config.js**: Security limits and configuration
- **package.json**: Dependencies and scripts
- **README.md**: User documentation
- **CONTRIBUTING.md**: Contribution guidelines

### MCP Tool Implementation
The server implements 8 core MCP tools following MCP protocol standards:
1. `risen_create`: Create new RISEN templates
2. `risen_validate`: Validate structure and get suggestions
3. `risen_execute`: Execute templates with variables
4. `risen_track`: Track performance metrics
5. `risen_search`: Search templates with pagination
6. `risen_analyze`: Get performance insights
7. `risen_suggest`: AI-powered improvement recommendations
8. `risen_convert`: Convert natural language to RISEN format

### Security Practices
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- Size limits on all inputs
- Environment-based configuration
- Secure database handling
- Proper error handling without sensitive information exposure

### Data Storage
- SQLite database with two main tables:
  - `templates`: Stores RISEN prompt templates with metadata
  - `experiments`: Tracks prompt execution results and ratings
- JSON fields for flexible data storage (steps, variables, tags)
- Automatic database initialization with default templates

### Testing Approach
- Diagnostic scripts for dependency validation
- MCP protocol compliance testing
- Server startup validation
- Integration testing through MCP protocol

### Quality Assurance
- Built-in validation for RISEN components
- Quality scoring system (0-100 points)
- Variable usage validation
- Template performance tracking
- AI-powered suggestions for improvements

## Key Features

### Template Management
- Create, store, and organize RISEN prompt templates
- Support for variables using `{{variable_name}}` syntax
- Tagging system for organization
- Default templates provided for common use cases

### Validation Engine
- Real-time structure checking
- Quality scoring based on RISEN components
- Variable declaration and usage validation
- Improvement suggestions

### Performance Tracking
- Rating system (1-5 stars)
- Usage statistics
- AI model-specific performance analysis
- Feedback notes storage

### Advanced Features
- Pagination support for search and analysis tools
- Natural language to RISEN conversion
- Performance analytics by AI model
- Cross-AI integration capability