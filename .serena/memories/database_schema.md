# Database Schema for RISEN Prompt Engineering MCP Server

## Database System
- **Type**: SQLite3
- **File**: risen_prompts.db (created automatically on first run)
- **Connection**: Using sqlite3 npm package with promisified methods

## Tables

### 1. Templates Table
```sql
CREATE TABLE templates (
  id TEXT PRIMARY KEY,                    -- UUID for unique identification
  name TEXT NOT NULL,                     -- Template name
  description TEXT,                       -- Template description
  role TEXT,                             -- AI role/persona
  instructions TEXT,                      -- Clear directives
  steps TEXT,                            -- JSON string of steps array
  expectations TEXT,                      -- Desired outcome
  narrowing TEXT,                        -- Constraints or creative elements
  variables TEXT,                        -- JSON string of variables array
  tags TEXT,                             -- JSON string of tags array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Creation timestamp
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,  -- Last update timestamp
  uses INTEGER DEFAULT 0,                 -- Number of times template was used
  total_rating INTEGER DEFAULT 0,         -- Sum of all ratings
  rating_count INTEGER DEFAULT 0          -- Number of ratings received
);
```

### 2. Experiments Table
```sql
CREATE TABLE experiments (
  id TEXT PRIMARY KEY,                    -- UUID for unique identification
  template_id TEXT,                       -- Foreign key to templates table
  executed_prompt TEXT,                   -- The prompt that was executed
  variables_used TEXT,                    -- JSON string of variables used
  ai_model TEXT,                         -- Which AI model was used
  response TEXT,                         -- AI response (truncated if needed)
  rating INTEGER,                        -- Rating 1-5
  notes TEXT,                            -- Additional notes
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP  -- Creation timestamp
);
```

## Foreign Key Relationship
- experiments.template_id references templates.id
- No explicit foreign key constraint defined in the schema, but enforced in application logic

## Data Storage Format
- **JSON Arrays**: Stored as JSON strings in TEXT columns (steps, variables, tags)
- **Timestamps**: Use SQLite's CURRENT_TIMESTAMP function
- **Ratings**: Stored as integers (1-5) with aggregated values in templates table

## Database Operations

### Promisified Methods
- `dbRun`: For INSERT, UPDATE, DELETE operations
- `dbGet`: For single row SELECT operations
- `dbAll`: For multiple row SELECT operations

### Common Queries
1. **Template Creation**:
   - INSERT with UUID and JSON stringified arrays

2. **Template Retrieval**:
   - SELECT with potential JSON parsing for arrays

3. **Template Search**:
   - Parameterized queries with LIKE operations for text search
   - JSON queries for tag matching

4. **Rating Updates**:
   - UPDATE to increment total_rating and rating_count

5. **Usage Tracking**:
   - UPDATE to increment uses counter

## Security Considerations
- All queries use parameterized statements to prevent SQL injection
- Text searches use parameterized LIKE queries
- JSON parsing is wrapped in try-catch blocks
- Input validation occurs before database operations

## Performance Considerations
- Primary keys are UUIDs stored as TEXT (adequate for expected scale)
- No explicit indexes defined (SQLite uses primary key index automatically)
- JSON storage allows flexible schema within relational database
- Consider adding indexes if performance issues arise with large datasets