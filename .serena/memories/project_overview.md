# RISEN Prompt Engineering MCP Server - Project Overview

## Project Purpose
The RISEN Prompt Engineering MCP Server is a Model Context Protocol (MCP) server that implements the RISEN framework for structured prompt engineering. It provides a systematic approach to creating, validating, managing, and optimizing AI prompts using the RISEN methodology (Role, Instructions, Steps, Expectations, Narrowing).

## Core Features
- **Structured Prompt Engineering**: Implements the RISEN framework for creating high-quality prompts
- **Template Management**: Create, store, and organize RISEN prompt templates with variables
- **Performance Tracking**: Monitor prompt effectiveness with ratings and analytics
- **MCP Integration**: Integrates with Claude Desktop and other MCP-compatible tools

## Tech Stack
- **Runtime**: Node.js (version 16.0.0 or higher)
- **Framework**: Model Context Protocol (MCP) SDK
- **Database**: SQLite3 for persistent storage
- **Dependencies**: 
  - @modelcontextprotocol/sdk (MCP server implementation)
  - sqlite3 (database)
  - uuid (for generating unique IDs)

## Architecture
- **Server Type**: Node.js MCP server using the Model Context Protocol SDK
- **Database**: SQLite3 for persistent storage of templates and experiment data
- **Data Model**: Two main tables (templates, experiments) with relationships
- **API**: MCP-compliant tool interface with 8 core tools

## RISEN Framework Components
1. **Role**: Define the AI's persona/expertise
2. **Instructions**: Clear directives for the task
3. **Steps**: Breakdown of the process
4. **Expectations**: Desired outcome/format
5. **Narrowing**: Constraints or creative elements

## Key Files
- **server.js**: Main server implementation with all MCP tool handlers
- **security-config.js**: Security limits and configuration
- **package.json**: Dependencies and scripts
- **README.md**: User documentation
- **CONTRIBUTING.md**: Contribution guidelines