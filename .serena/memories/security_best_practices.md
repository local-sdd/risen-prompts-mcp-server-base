# Security Best Practices for RISEN Prompt Engineering MCP Server

## Input Validation and Sanitization

### Size Limits
- Template name: MAX_TEMPLATE_NAME_LENGTH (default: 100 characters)
- Description: MAX_DESCRIPTION_LENGTH (default: 500 characters)
- Instructions: MAX_INSTRUCTIONS_LENGTH (default: 2000 characters)
- Expectations: MAX_EXPECTATIONS_LENGTH (default: 1000 characters)
- Narrowing: MAX_NARROWING_LENGTH (default: 1000 characters)
- Steps count: MAX_STEPS_COUNT (default: 50)
- Variables count: MAX_VARIABLES_COUNT (default: 20)
- Tags count: MAX_TAGS_COUNT (default: 10)

### Response Limits
- Template size: MAX_TEMPLATE_SIZE (default: 8000 characters)
- Individual field size: MAX_INDIVIDUAL_FIELD_SIZE (default: 2000 characters)
- Response size: MAX_RESPONSE_SIZE (default: 2000 characters)

## SQL Injection Prevention
- Always use parameterized queries with db.run(), db.get(), and db.all()
- Never concatenate user input directly into SQL strings
- Validate inputs before using in database operations
- Use JSON.parse() and JSON.stringify() with try-catch blocks

## MCP Protocol Security
- Validate all tool parameters against defined schemas
- Implement proper authentication if needed for production
- Sanitize all inputs before processing
- Never expose internal system information in MCP responses

## Environment Configuration
- Use environment variables for configuration (security-config.js)
- Set NODE_ENV=production for production deployments
- Secure database path outside the web root if applicable
- Enable only necessary debug features
- Monitor security limits and adjust based on usage

## Error Handling
- Log detailed errors to stderr for debugging
- Return generic error messages to users/MCP clients
- Never expose stack traces or internal information to clients
- Implement proper error boundaries in async operations

## Database Security
- Use UUIDs for primary keys to prevent enumeration attacks
- Implement proper access controls for database file
- Regularly backup database with secure storage
- Consider encryption for sensitive data if needed

## Variable Handling Security
- Validate variable declarations match usage
- Prevent injection through variable substitution
- Sanitize variable values before substitution
- Check for missing variables before execution

## API Security
- Implement rate limiting if needed for production
- Validate all MCP tool parameters
- Use proper authentication mechanisms if required
- Implement proper session management if needed

## Security Monitoring
- Monitor for unusual access patterns
- Log security-relevant events to stderr
- Implement health checks for security configuration
- Regular security reviews of code changes

## Production Security
- Disable debug logging in production
- Use secure database file permissions
- Implement proper backup and recovery procedures
- Regular security updates for dependencies
- Consider additional security layers for production deployment