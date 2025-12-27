# MCP Protocol Implementation Details for RISEN Prompt Engineering Server

## MCP Tools Overview
The server implements 8 core MCP tools following MCP protocol standards:

1. **risen_create**: Create new RISEN templates
2. **risen_validate**: Validate structure and get suggestions
3. **risen_execute**: Execute templates with variables
4. **risen_track**: Track performance metrics
5. **risen_search**: Search templates with pagination
6. **risen_analyze**: Get performance insights
7. **risen_suggest**: AI-powered improvement recommendations
8. **risen_convert**: Convert natural language to RISEN format

## MCP Implementation Structure
- **Server**: Uses @modelcontextprotocol/sdk Server class
- **Transport**: StdioServerTransport for communication
- **Request Handlers**: Implement ListToolsRequestSchema and CallToolRequestSchema
- **Response Format**: MCP-compliant with content array containing text type

## Tool Schema Definition
Each MCP tool follows this structure:
- **name**: Snake-case name with 'risen_' prefix
- **description**: Clear, concise description of the tool's purpose
- **inputSchema**: JSON schema defining expected parameters
- **required**: Array of required parameters

## Request Handling Pattern
1. Parse the tool name and arguments from the request
2. Validate inputs according to the tool's schema
3. Execute the appropriate business logic
4. Format the response in MCP-compliant format
5. Handle errors gracefully without exposing sensitive information

## Response Format
All MCP tool responses follow this format:
```
{
  content: [{
    type: 'text',
    text: 'Response content here'
  }]
}
```

## Error Handling in MCP Context
- Never expose internal error details to MCP clients
- Log detailed errors to stderr for debugging
- Return user-friendly error messages in MCP responses
- Handle database errors gracefully
- Implement proper fallbacks for external dependencies

## MCP-Specific Considerations
- The server communicates via stdin/stdout for MCP protocol
- Console output must follow MCP protocol format
- Error logging should go to stderr to avoid interfering with MCP communication
- All responses must be properly formatted JSON
- Tool parameters must match exactly what's defined in the schema

## Security in MCP Context
- Validate all tool parameters received from MCP clients
- Implement rate limiting if necessary
- Sanitize all inputs before using in database queries
- Never return sensitive system information in responses
- Follow security best practices for all MCP endpoints