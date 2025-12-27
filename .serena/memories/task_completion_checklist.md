# Task Completion Checklist for RISEN Prompt Engineering MCP Server

## Before Marking Task Complete

### Code Quality Checks
- [ ] All code follows the project's style and conventions
- [ ] Proper error handling is implemented for all functions
- [ ] Input validation is in place for all user inputs
- [ ] Database queries use parameterized statements to prevent SQL injection
- [ ] Console logging follows the [RISEN] format for consistency
- [ ] Code is properly commented where complex logic exists

### Security Verification
- [ ] All inputs are validated against security limits defined in security-config.js
- [ ] No sensitive information is exposed in error messages
- [ ] Environment variables are properly handled
- [ ] Database operations follow security best practices
- [ ] MCP tool schemas are properly defined with appropriate validation

### Testing Requirements
- [ ] Changes don't break existing functionality
- [ ] Server starts successfully with `npm start`
- [ ] All existing tests pass with `npm test`
- [ ] New functionality is tested if applicable
- [ ] Database operations work as expected

### MCP Protocol Compliance
- [ ] All MCP tools follow the correct schema format
- [ ] Tool responses are in proper MCP format
- [ ] Error responses follow MCP protocol standards
- [ ] Tool names follow the 'risen_{action}' convention

### Performance Considerations
- [ ] Database queries are optimized
- [ ] Pagination is implemented where appropriate
- [ ] Response sizes are within defined limits
- [ ] Memory usage is reasonable

## After Implementation

### Verification Steps
1. **Server Startup Test**: Run `npm start` to ensure server starts without errors
2. **MCP Protocol Test**: Run `npm test` to verify all tests pass
3. **Database Verification**: Check that database operations work as expected
4. **Functionality Test**: Test the implemented feature manually if possible

### Documentation Updates
- [ ] Update README.md if new features are added
- [ ] Update any relevant documentation files
- [ ] Add comments to code if implementing complex logic
- [ ] Ensure all new MCP tools have proper descriptions in the tools list

### Final Checks
- [ ] Code is formatted consistently with the rest of the project
- [ ] No debugging code or console.log statements are left in production code
- [ ] All dependencies are properly declared in package.json if new ones were added
- [ ] Security configuration is respected in new code
- [ ] The server properly handles edge cases and error conditions

## Deployment Readiness
- [ ] Server runs in both development and production modes
- [ ] Environment variables are properly handled
- [ ] Database migrations (if any) are handled properly
- [ ] Error logging works correctly
- [ ] Performance is acceptable under expected load