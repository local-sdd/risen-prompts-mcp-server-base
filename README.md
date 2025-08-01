# RISEN Prompt Engineering MCP Tool

A powerful Model Context Protocol (MCP) server that helps you create, validate, manage, and optimize prompts using the RISEN framework.

## What is RISEN?

RISEN is a structured prompt engineering framework with 5 components:
- **R**ole: Define the AI's persona/expertise
- **I**nstructions: Clear directives for the task
- **S**teps: Breakdown of the process
- **E**xpectations: Desired outcome/format
- **N**arrowing: Constraints or creative elements

## Features

### 🎯 Core Functionality
- **Template Management**: Create, store, and organize RISEN prompt templates
- **Variable Support**: Use `{{variables}}` for dynamic, reusable prompts
- **Validation Engine**: Real-time structure checking and quality rating
- **Performance Tracking**: Monitor prompt effectiveness with ratings and analytics
- **AI Suggestions**: Get improvement recommendations based on best practices

### 🚀 Advanced Features
- **A/B Testing**: Compare different prompt variations
- **Cross-AI Integration**: Works with your Cross-AI tool to test prompts on multiple models
- **Knowledge Base Integration**: Save successful prompts for future reference
- **Natural Language Conversion**: Transform regular requests into RISEN format
- **Template Library**: Pre-built templates for common tasks

## Installation

1. **Clone or download** this repository
2. **Install dependencies**:
```bash
npm install
```

3. **Test the server**:
```bash
npm test
```

4. The server is now ready to be configured in Claude Desktop

## Configuration

Add to your Claude Desktop config file:

### Windows
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

### macOS/Linux  
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

**Replace** `/path/to/mcp-risen-prompts` with your actual installation path.

## Usage Examples

### Creating a Template
```
Use risen_create to make a new template:
- Name: "Code Review"
- Role: "Senior software engineer with 15+ years experience"
- Instructions: "Review the provided code for quality and security"
- Steps: ["Analyze structure", "Check for bugs", "Suggest improvements"]
- Expectations: "Detailed line-by-line feedback with examples"
- Narrowing: "Focus on critical issues first"
```

### Executing a Template
```
Use risen_execute with variables:
- Template ID: [your-template-id]
- Variables: {"language": "Python", "framework": "Django"}
```

### Tracking Performance
```
After using a prompt, track its effectiveness:
- Use risen_track
- Rate 1-5 stars
- Add notes about what worked/didn't work
```

## MCP Tools Available

1. **risen_create** - Create new RISEN templates
2. **risen_validate** - Check structure and get suggestions
3. **risen_execute** - Run templates with variables
4. **risen_track** - Record performance metrics
5. **risen_search** - Find templates by tags/rating
6. **risen_analyze** - Get insights on template performance
7. **risen_suggest** - AI-powered improvement recommendations
8. **risen_convert** - Transform natural language to RISEN

## Template Examples

### Blog Post Writer
```
Role: Content strategist and SEO expert
Instructions: Write an engaging blog post about {{topic}}
Steps: 
  1. Research keywords and trends
  2. Create compelling headline
  3. Develop main points with examples
  4. Include statistics and sources
  5. Write conclusion with CTA
Expectations: 1500-2000 words, SEO-optimized, engaging tone
Narrowing: Use conversational tone, include 3-5 keywords naturally
```

### Data Analysis
```
Role: Data scientist specializing in {{domain}}
Instructions: Analyze {{dataset}} to uncover insights
Steps:
  1. Perform exploratory data analysis
  2. Identify key trends and patterns
  3. Run statistical tests
  4. Create visualizations
  5. Provide recommendations
Expectations: Clear insights with statistical backing
Narrowing: Focus on {{specific_metrics}} and business impact
```

## Quality Rating

Templates are rated out of 100 based on:
- Role specificity (20 points)
- Instruction clarity (20 points)
- Step detail (20 points)
- Expectation metrics (20 points)
- Narrowing focus (20 points)

## Best Practices

1. **Be Specific**: Vague roles like "assistant" rate lower than "Senior Python developer with AWS expertise"
2. **Use Variables**: Make templates reusable with `{{variables}}`
3. **Measurable Expectations**: Include numbers (word count, examples needed, etc.)
4. **Clear Steps**: Each step should be actionable and specific
5. **Test & Iterate**: Use tracking to refine templates over time

## Integration with Other MCP Tools

### With Cross-AI Tool
Execute the same RISEN prompt across multiple AI models:
1. Create/select a RISEN template
2. Use Cross-AI to run it on ChatGPT, Gemini, and Claude
3. Compare results and track which model performs best

### With Knowledge Base
Save successful prompts for future reference:
1. Create and test a RISEN prompt
2. Once proven effective, save to Knowledge Base
3. Search and retrieve proven prompts by topic

## Troubleshooting

**Template not validating?**
- Ensure all required fields are filled
- Check that steps is an array, not a string
- Verify variables are properly declared

**Variables not replacing?**
- Use exact syntax: `{{variable_name}}`
- Ensure variable names match in declaration and usage
- Check that all variables have values when executing

**Low quality ratings?**
- Add more detail to each component
- Include specific metrics in expectations
- Use domain-specific language in role

## Future Roadmap

- [ ] Visual template builder UI
- [ ] Community template marketplace
- [ ] Advanced analytics dashboard
- [ ] Prompt chaining workflows
- [ ] Export/import template packs
- [ ] Team collaboration features

## Contributing

Found a bug or have a feature request? Contributions are welcome!

## License

MIT License - feel free to use and modify as needed.