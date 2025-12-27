#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
	CallToolRequestSchema,
	ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import sqlite3 from "sqlite3";
import { v4 as uuidv4 } from "uuid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Log to stderr
console.error("[RISEN] Starting RISEN Prompts MCP Server...");

// Database setup with error handling
const dbPath = path.join(__dirname, "risen_prompts.db");
const db = new sqlite3.Database(dbPath, (err) => {
	if (err) {
		console.error("[RISEN] Failed to connect to the database:", err.message);
		process.exit(1);
	}
	console.error("[RISEN] Database connected successfully");
});

// Promisify database methods
const dbRun = promisify(db.run.bind(db));
const dbGet = promisify(db.get.bind(db));
const dbAll = promisify(db.all.bind(db));

// Initialize database with error handling
async function initDatabase() {
	try {
		console.error("[RISEN] Initializing database...");

		await dbRun(`
      CREATE TABLE IF NOT EXISTS templates (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        role TEXT,
        instructions TEXT,
        steps TEXT,
        expectations TEXT,
        narrowing TEXT,
        variables TEXT,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        uses INTEGER DEFAULT 0,
        total_rating INTEGER DEFAULT 0,
        rating_count INTEGER DEFAULT 0
      )
    `);
		console.error("[RISEN] Templates table created/verified");

		await dbRun(`
      CREATE TABLE IF NOT EXISTS experiments (
        id TEXT PRIMARY KEY,
        template_id TEXT,
        executed_prompt TEXT,
        variables_used TEXT,
        ai_model TEXT,
        response TEXT,
        rating INTEGER,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(template_id) REFERENCES templates(id)
      )
    `);
		console.error("[RISEN] Experiments table created/verified");

		// Create default templates
		await createDefaultTemplates();
		console.error("[RISEN] Database initialization completed successfully");
	} catch (error) {
		console.error("[RISEN] Database initialization failed:", error.message);
		console.error("[RISEN] Full error details:", error);
		throw new Error(`Database initialization failed: ${error.message}`);
	}
}

async function createDefaultTemplates() {
	try {
		const defaultTemplates = [
			{
				name: "Code Review",
				description: "Comprehensive code review template",
				role: "Senior software engineer with 15+ years of experience in code quality and best practices",
				instructions:
					"Review the provided code for quality, performance, security, and maintainability",
				steps: JSON.stringify([
					"Analyze code structure and organization",
					"Check for potential bugs and edge cases",
					"Evaluate performance implications",
					"Review security vulnerabilities",
					"Suggest improvements and best practices",
				]),
				expectations:
					"Detailed review with specific line-by-line feedback and actionable suggestions",
				narrowing:
					"Focus on critical issues first, then style and minor improvements",
				variables: JSON.stringify([
					"code_snippet",
					"programming_language",
					"context",
				]),
				tags: JSON.stringify(["development", "code-review", "quality"]),
			},
			{
				name: "Blog Post Writer",
				description: "SEO-optimized blog post creation",
				role: "Content strategist and SEO expert with proven track record in {{industry}}",
				instructions:
					"Write an engaging blog post about {{topic}} targeting {{audience}}",
				steps: JSON.stringify([
					"Research keywords and current trends",
					"Create compelling headline and introduction",
					"Develop main points with examples",
					"Include relevant statistics and sources",
					"Write conclusion with call-to-action",
				]),
				expectations:
					"1500-2000 word blog post, SEO-optimized, engaging tone, well-researched",
				narrowing:
					"Use conversational tone, include 3-5 keywords naturally, target readability score of 60+",
				variables: JSON.stringify([
					"topic",
					"audience",
					"industry",
					"keywords",
				]),
				tags: JSON.stringify(["content", "blog", "seo", "writing"]),
			},
			{
				name: "Data Analysis",
				description: "Comprehensive data analysis and insights",
				role: "Data scientist specializing in {{domain}} with expertise in statistical analysis",
				instructions:
					"Analyze the {{dataset_description}} to uncover insights and patterns",
				steps: JSON.stringify([
					"Perform exploratory data analysis",
					"Identify key trends and patterns",
					"Run statistical significance tests",
					"Create visualizations for findings",
					"Provide actionable recommendations",
				]),
				expectations:
					"Clear insights with statistical backing, visualization suggestions, business recommendations",
				narrowing: "Focus on {{specific_metrics}} and their business impact",
				variables: JSON.stringify([
					"domain",
					"dataset_description",
					"specific_metrics",
				]),
				tags: JSON.stringify(["data", "analysis", "insights", "statistics"]),
			},
		];

		console.error(
			`[RISEN] Creating ${defaultTemplates.length} default templates...`,
		);
		let created = 0;
		let skipped = 0;

		for (const template of defaultTemplates) {
			try {
				const existing = await dbGet(
					"SELECT id FROM templates WHERE name = ?",
					template.name,
				);
				if (!existing) {
					await dbRun(
						`INSERT INTO templates (id, name, description, role, instructions, steps, expectations, narrowing, variables, tags)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
						uuidv4(),
						template.name,
						template.description,
						template.role,
						template.instructions,
						template.steps,
						template.expectations,
						template.narrowing,
						template.variables,
						template.tags,
					);
					created++;
					console.error(`[RISEN] Created default template: ${template.name}`);
				} else {
					skipped++;
					console.error(`[RISEN] Skipped existing template: ${template.name}`);
				}
			} catch (templateError) {
				console.error(
					`[RISEN] Failed to create template "${template.name}":`,
					templateError.message,
				);
				// Continue with other templates instead of failing completely
			}
		}

		console.error(
			`[RISEN] Default templates processed: ${created} created, ${skipped} skipped`,
		);
	} catch (error) {
		console.error("[RISEN] Error in createDefaultTemplates:", error.message);
		throw new Error(`Failed to create default templates: ${error.message}`);
	}
}

// RISEN Validation
function validateRISEN(template) {
	const errors = [];
	const warnings = [];

	// Check required components
	if (!template.role || template.role.trim().length < 10) {
		errors.push(
			"Role must be at least 10 characters and clearly define the AI's persona",
		);
	}

	if (!template.instructions || template.instructions.trim().length < 20) {
		errors.push(
			"Instructions must be at least 20 characters and provide clear directives",
		);
	}

	// Check steps
	let steps = [];
	try {
		steps = JSON.parse(template.steps || "[]");
	} catch (e) {
		errors.push("Steps must be a valid JSON array");
	}

	if (steps.length < 2) {
		warnings.push("Consider adding more steps for better task breakdown");
	}

	if (!template.expectations || template.expectations.trim().length < 15) {
		errors.push(
			"Expectations must clearly define the desired outcome (min 15 chars)",
		);
	}

	if (!template.narrowing || template.narrowing.trim().length < 10) {
		warnings.push(
			"Narrowing/Novelty helps focus or expand the task - consider adding constraints or creative elements",
		);
	}

	// Check for variable usage
	const variableRegex = /\{\{(\w+)\}\}/g;
	const usedVars = new Set();

	[
		template.role,
		template.instructions,
		template.expectations,
		template.narrowing,
	].forEach((text) => {
		if (text) {
			const matches = text.matchAll(variableRegex);
			for (const match of matches) {
				usedVars.add(match[1]);
			}
		}
	});

	// Check if steps use variables
	steps.forEach((step) => {
		const matches = step.matchAll(variableRegex);
		for (const match of matches) {
			usedVars.add(match[1]);
		}
	});

	// Validate declared variables match used variables
	let declaredVars = [];
	try {
		declaredVars = JSON.parse(template.variables || "[]");
	} catch (e) {
		if (usedVars.size > 0) {
			errors.push("Variables must be a valid JSON array");
		}
	}

	const declaredSet = new Set(declaredVars);

	usedVars.forEach((v) => {
		if (!declaredSet.has(v)) {
			warnings.push(`Variable {{${v}}} is used but not declared`);
		}
	});

	declaredSet.forEach((v) => {
		if (!usedVars.has(v)) {
			warnings.push(`Variable {{${v}}} is declared but not used`);
		}
	});

	return {
		valid: errors.length === 0,
		errors,
		warnings,
		score: calculateQualityScore(template),
	};
}

function calculateQualityScore(template) {
	let score = 0;

	if (template.role) {
		// Role quality (20 points)
		if (template.role.length > 30) {
			score += 10;
		}
		if (template.role.length > 50) {
			score += 10;
		}
	}

	if (template.instructions) {
		// Instructions clarity (20 points)
		if (template.instructions.length > 50) {
			score += 10;
		}
		if (template.instructions.includes("{{")) {
			score += 10; // Uses variables
		}
	}

	// Steps detail (20 points)
	try {
		const steps = JSON.parse(template.steps || "[]");
		if (steps.length >= 3) score += 10;
		if (steps.length >= 5) score += 10;
	} catch (e) {
		throw new Error(`Invalid steps JSON: ${e.message}`);
	}

	if (template.expectations) {
		// Expectations specificity (20 points)
		if (template.expectations.length > 40) {
			score += 10;
		}
		if (/\d+/.test(template.expectations)) {
			score += 10; // Contains numbers/metrics
		}
	}

	if (template.narrowing) {
		// Narrowing focus (20 points)
		if (template.narrowing.length > 30) {
			score += 10;
		}
		if (
			template.narrowing.includes("avoid") ||
			template.narrowing.includes("focus")
		) {
			score += 10;
		}
	}

	return score;
}

// Enhanced prompt suggestions using AI analysis
function generateSuggestions(template) {
	const suggestions = [];

	// Role suggestions
	if (template.role && template.role.length < 30) {
		suggestions.push({
			component: "role",
			suggestion:
				"Consider adding more specific expertise, years of experience, or domain knowledge to the role",
		});
	}

	// Instructions suggestions
	if (template.instructions && !template.instructions.includes("{{")) {
		suggestions.push({
			component: "instructions",
			suggestion:
				"Consider using variables (e.g., {{topic}}) to make this template reusable",
		});
	}

	// Steps suggestions
	try {
		const steps = JSON.parse(template.steps || "[]");
		if (steps.length < 3) {
			suggestions.push({
				component: "steps",
				suggestion:
					"Break down the task into more detailed steps for better AI guidance",
			});
		}

		if (steps.some((step) => step.length < 20)) {
			suggestions.push({
				component: "steps",
				suggestion: "Some steps are too brief - add more detail for clarity",
			});
		}
	} catch (e) {
		throw new Error(`Invalid steps format: ${e.message}`);
	}

	// Expectations suggestions
	if (template.expectations && !/\d+/.test(template.expectations)) {
		suggestions.push({
			component: "expectations",
			suggestion:
				"Consider adding specific metrics or measurable outcomes (e.g., word count, number of examples)",
		});
	}

	// Narrowing suggestions
	if (!template.narrowing || template.narrowing.length < 20) {
		suggestions.push({
			component: "narrowing",
			suggestion:
				"Add constraints to focus the output or creative elements to encourage innovation",
		});
	}

	return suggestions;
}

// Replace variables in template
function applyVariables(template, variables) {
	const result = {
		role: template.role,
		instructions: template.instructions,
		steps: template.steps,
		expectations: template.expectations,
		narrowing: template.narrowing,
	};

	// Replace variables in all fields
	Object.keys(variables).forEach((key) => {
		const value = variables[key];
		const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");

		result.role = result.role.replace(regex, value);
		result.instructions = result.instructions.replace(regex, value);
		result.expectations = result.expectations.replace(regex, value);
		result.narrowing = result.narrowing.replace(regex, value);

		// Handle steps array
		try {
			const steps = JSON.parse(result.steps);
			const updatedSteps = steps.map((step) => step.replace(regex, value));
			result.steps = JSON.stringify(updatedSteps);
		} catch (e) {
			throw new Error(`Invalid steps format: ${e.message}`);
		}
	});

	return result;
}

// Format RISEN prompt for execution
function formatRISENPrompt(template) {
	const steps = JSON.parse(template.steps || "[]");

	return `Role: ${template.role}

Instructions: ${template.instructions}

Steps:
${steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}

Expectations: ${template.expectations}

Narrowing: ${template.narrowing}`;
}

// MCP Server Setup
const server = new Server(
	{
		name: "mcp-risen-prompts",
		version: "1.0.0",
	},
	{
		capabilities: {
			tools: {},
		},
	},
);

// Tool handlers
server.setRequestHandler(ListToolsRequestSchema, async () => {
	console.error("[RISEN] Handling tools/list request");
	return {
		tools: [
			{
				name: "risen_create",
				description: "Create a new RISEN prompt template",
				inputSchema: {
					type: "object",
					properties: {
						name: { type: "string", description: "Template name" },
						description: {
							type: "string",
							description: "Template description",
						},
						role: { type: "string", description: "AI role/persona" },
						instructions: { type: "string", description: "Clear directives" },
						steps: {
							type: "array",
							items: { type: "string" },
							description: "Task breakdown",
						},
						expectations: { type: "string", description: "Desired outcome" },
						narrowing: {
							type: "string",
							description: "Constraints or creative elements",
						},
						variables: {
							type: "array",
							items: { type: "string" },
							description: "Template variables",
						},
						tags: {
							type: "array",
							items: { type: "string" },
							description: "Tags for organization",
						},
					},
					required: ["name", "role", "instructions", "steps", "expectations"],
				},
			},
			{
				name: "risen_validate",
				description:
					"Validate a RISEN prompt structure and get improvement suggestions",
				inputSchema: {
					type: "object",
					properties: {
						template_id: {
							type: "string",
							description: "Template ID to validate",
						},
						template: {
							type: "object",
							description: "Or provide template directly",
							properties: {
								role: { type: "string" },
								instructions: { type: "string" },
								steps: { type: "array", items: { type: "string" } },
								expectations: { type: "string" },
								narrowing: { type: "string" },
							},
						},
					},
				},
			},
			{
				name: "risen_execute",
				description: "Execute a RISEN prompt template with variables",
				inputSchema: {
					type: "object",
					properties: {
						template_id: { type: "string", description: "Template ID" },
						variables: {
							type: "object",
							description: "Variables to fill in template",
						},
					},
					required: ["template_id"],
				},
			},
			{
				name: "risen_track",
				description: "Track the results of a RISEN prompt execution",
				inputSchema: {
					type: "object",
					properties: {
						template_id: { type: "string", description: "Template ID" },
						executed_prompt: {
							type: "string",
							description: "The executed prompt",
						},
						variables_used: {
							type: "object",
							description: "Variables that were used",
						},
						ai_model: {
							type: "string",
							description: "Which AI model was used",
						},
						response: {
							type: "string",
							description: "AI response (truncated if needed)",
						},
						rating: {
							type: "integer",
							minimum: 1,
							maximum: 5,
							description: "Rating 1-5",
						},
						notes: { type: "string", description: "Additional notes" },
					},
					required: ["template_id", "rating"],
				},
			},
			{
				name: "risen_search",
				description: "Search for RISEN templates with pagination support",
				inputSchema: {
					type: "object",
					properties: {
						query: { type: "string", description: "Search query" },
						tags: {
							type: "array",
							items: { type: "string" },
							description: "Filter by tags",
						},
						min_rating: {
							type: "number",
							description: "Minimum average rating",
						},
						offset: {
							type: "integer",
							minimum: 0,
							default: 0,
							description: "Pagination offset (starting record)",
						},
						limit: {
							type: "integer",
							minimum: 1,
							maximum: 100,
							default: 20,
							description: "Number of results per page (max 100)",
						},
					},
				},
			},
			{
				name: "risen_analyze",
				description:
					"Analyze template performance and get insights with pagination",
				inputSchema: {
					type: "object",
					properties: {
						template_id: {
							type: "string",
							description: "Template ID to analyze",
						},
						offset: {
							type: "integer",
							minimum: 0,
							default: 0,
							description: "Pagination offset for experiments",
						},
						limit: {
							type: "integer",
							minimum: 1,
							maximum: 50,
							default: 10,
							description: "Number of experiments per page (max 50)",
						},
					},
					required: ["template_id"],
				},
			},
			{
				name: "risen_suggest",
				description: "Get AI-powered suggestions to improve a RISEN prompt",
				inputSchema: {
					type: "object",
					properties: {
						template_id: { type: "string", description: "Template ID" },
					},
					required: ["template_id"],
				},
			},
			{
				name: "risen_convert",
				description: "Convert a natural language request into RISEN format",
				inputSchema: {
					type: "object",
					properties: {
						request: {
							type: "string",
							description: "Natural language request",
						},
						context: { type: "string", description: "Additional context" },
					},
					required: ["request"],
				},
			},
		],
	};
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
	console.error("[RISEN] Handling tools/call request:", request.params.name);
	const { name, arguments: args } = request.params;

	try {
		switch (name) {
			case "risen_create": {
				const validation = validateRISEN({
					role: args.role,
					instructions: args.instructions,
					steps: JSON.stringify(args.steps),
					expectations: args.expectations,
					narrowing: args.narrowing || "",
					variables: JSON.stringify(args.variables || []),
				});

				if (!validation.valid) {
					return {
						content: [
							{
								type: "text",
								text: `❌ Validation failed:\n${validation.errors.join("\n")}\n\n⚠️ Warnings:\n${validation.warnings.join("\n")}`,
							},
						],
					};
				}

				const id = uuidv4();
				await dbRun(
					`INSERT INTO templates (id, name, description, role, instructions, steps, expectations, narrowing, variables, tags)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
					id,
					args.name,
					args.description || "",
					args.role,
					args.instructions,
					JSON.stringify(args.steps),
					args.expectations,
					args.narrowing || "",
					JSON.stringify(args.variables || []),
					JSON.stringify(args.tags || []),
				);

				return {
					content: [
						{
							type: "text",
							text: `✅ RISEN template created successfully!

ID: ${id}
Name: ${args.name}
Quality Score: ${validation.score}/100
${validation.warnings.length > 0 ? "\n⚠️ Suggestions:\n" + validation.warnings.join("\n") : ""}`,
						},
					],
				};
			}

			case "risen_validate": {
				let template;
				if (args.template_id) {
					template = await dbGet(
						"SELECT * FROM templates WHERE id = ?",
						args.template_id,
					);
					if (!template) {
						return {
							content: [{ type: "text", text: "❌ Template not found" }],
						};
					}
				} else if (args.template) {
					template = {
						role: args.template.role,
						instructions: args.template.instructions,
						steps: JSON.stringify(args.template.steps || []),
						expectations: args.template.expectations,
						narrowing: args.template.narrowing || "",
					};
				} else {
					return {
						content: [
							{
								type: "text",
								text: "❌ Provide either template_id or template object",
							},
						],
					};
				}

				const validation = validateRISEN(template);
				const suggestions = generateSuggestions(template);

				return {
					content: [
						{
							type: "text",
							text: `🔍 RISEN Validation Report

✅ Valid: ${validation.valid ? "Yes" : "No"}
📊 Quality Score: ${validation.score}/100

${validation.errors.length > 0 ? "❌ Errors:\n" + validation.errors.map((e) => `• ${e}`).join("\n") : ""}

${validation.warnings.length > 0 ? "⚠️ Warnings:\n" + validation.warnings.map((w) => `• ${w}`).join("\n") : ""}

💡 Improvement Suggestions:
${suggestions.map((s) => `• [${s.component.toUpperCase()}] ${s.suggestion}`).join("\n")}`,
						},
					],
				};
			}

			case "risen_execute": {
				const template = await dbGet(
					"SELECT * FROM templates WHERE id = ?",
					args.template_id,
				);
				if (!template) {
					return { content: [{ type: "text", text: "❌ Template not found" }] };
				}

				// Apply variables if provided
				let finalTemplate = template;
				if (args.variables) {
					finalTemplate = applyVariables(template, args.variables);
				}

				// Check for missing variables
				const variableRegex = /\{\{(\w+)\}\}/g;
				const remainingVars = [];
				const allText = `${finalTemplate.role} ${finalTemplate.instructions} ${finalTemplate.expectations} ${finalTemplate.narrowing} ${finalTemplate.steps}`;
				const matches = allText.matchAll(variableRegex);
				for (const match of matches) {
					remainingVars.push(match[1]);
				}

				if (remainingVars.length > 0) {
					return {
						content: [
							{
								type: "text",
								text: `⚠️ Missing variables: ${[...new Set(remainingVars)].join(", ")}\n\nPlease provide values for all variables.`,
							},
						],
					};
				}

				// Format the prompt
				const prompt = formatRISENPrompt(finalTemplate);

				// Update usage count
				await dbRun(
					"UPDATE templates SET uses = uses + 1 WHERE id = ?",
					args.template_id,
				);

				return {
					content: [
						{
							type: "text",
							text: `📝 RISEN Prompt Ready:\n\n${prompt}\n\n✅ Template "${template.name}" executed (${template.uses + 1} total uses)`,
						},
					],
				};
			}

			case "risen_track": {
				const id = uuidv4();
				const template = await dbGet(
					"SELECT * FROM templates WHERE id = ?",
					args.template_id,
				);
				if (!template) {
					return { content: [{ type: "text", text: "❌ Template not found" }] };
				}

				// Store experiment
				await dbRun(
					`INSERT INTO experiments (id, template_id, executed_prompt, variables_used, ai_model, response, rating, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
					id,
					args.template_id,
					args.executed_prompt || "",
					JSON.stringify(args.variables_used || {}),
					args.ai_model || "claude",
					args.response ? args.response.substring(0, 1000) : "", // Truncate long responses
					args.rating,
					args.notes || "",
				);

				// Update template rating
				await dbRun(
					`UPDATE templates
           SET total_rating = total_rating + ?, rating_count = rating_count + 1
           WHERE id = ?`,
					args.rating,
					args.template_id,
				);

				const updatedTemplate = await dbGet(
					"SELECT * FROM templates WHERE id = ?",
					args.template_id,
				);
				const avgRating =
					updatedTemplate.total_rating / updatedTemplate.rating_count;

				return {
					content: [
						{
							type: "text",
							text: `📊 Experiment tracked!

Template: ${template.name}
Rating: ${"⭐".repeat(args.rating)}
Average Rating: ${avgRating.toFixed(1)} (${updatedTemplate.rating_count} ratings)
AI Model: ${args.ai_model || "claude"}
${args.notes ? `Notes: ${args.notes}` : ""}`,
						},
					],
				};
			}

			case "risen_search": {
				// Pagination parameters with validation
				const offset = Math.max(0, parseInt(args.offset) || 0);
				const limit = Math.min(100, Math.max(1, parseInt(args.limit) || 20));

				// Build the main query
				let query = "SELECT * FROM templates WHERE 1=1";
				const params = [];

				if (args.query) {
					query += " AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)";
					const searchTerm = `%${args.query}%`;
					params.push(searchTerm, searchTerm, searchTerm);
				}

				if (args.tags && args.tags.length > 0) {
					// Secure parameterized query for tags - prevent SQL injection
					const placeholders = args.tags.map(() => "tags LIKE ?").join(" OR ");
					query += ` AND (${placeholders})`;
					args.tags.forEach((tag) => params.push(`%"${tag}"%`));
				}

				if (args.min_rating) {
					query += " AND (total_rating / NULLIF(rating_count, 0)) >= ?";
					params.push(args.min_rating);
				}

				// Build count query for pagination metadata
				const countQuery = query.replace(
					"SELECT * FROM",
					"SELECT COUNT(*) as total FROM",
				);
				const countResult = await dbGet(countQuery, ...params);
				const totalCount = countResult ? countResult.total : 0;

				// Add pagination to main query
				query += " ORDER BY uses DESC, rating_count DESC LIMIT ? OFFSET ?";
				params.push(limit, offset);

				const templates = await dbAll(query, ...params);

				if (templates.length === 0 && totalCount === 0) {
					return {
						content: [
							{
								type: "text",
								text: "❌ No templates found matching your criteria",
							},
						],
					};
				}

				// Format results with pagination metadata
				const results = templates
					.map((t) => {
						const avgRating =
							t.rating_count > 0
								? (t.total_rating / t.rating_count).toFixed(1)
								: "N/A";
						const tags = JSON.parse(t.tags || "[]").join(", ");
						return `📝 ${t.name} (ID: ${t.id})
   ${t.description}
   ⭐ Rating: ${avgRating} | 🔧 Uses: ${t.uses} | 🏷️ Tags: ${tags}`;
					})
					.join("\n\n");

				// Calculate pagination info
				const hasMore = offset + limit < totalCount;
				const currentPage = Math.floor(offset / limit) + 1;
				const totalPages = Math.ceil(totalCount / limit);

				return {
					content: [
						{
							type: "text",
							text: `🔍 Found ${totalCount} templates (showing ${templates.length}):

${results}

📄 Page ${currentPage} of ${totalPages} | Showing ${offset + 1}-${offset + templates.length} of ${totalCount} results${hasMore ? `\n\n➡️ Use offset: ${offset + limit} for next page` : ""}`,
						},
					],
				};
			}

			case "risen_analyze": {
				const template = await dbGet(
					"SELECT * FROM templates WHERE id = ?",
					args.template_id,
				);
				if (!template) {
					return { content: [{ type: "text", text: "❌ Template not found" }] };
				}

				// Pagination parameters for experiments
				const offset = Math.max(0, parseInt(args.offset) || 0);
				const limit = Math.min(50, Math.max(1, parseInt(args.limit) || 10));

				// Get total count of experiments
				const experimentCountResult = await dbGet(
					"SELECT COUNT(*) as total FROM experiments WHERE template_id = ?",
					args.template_id,
				);
				const totalExperiments = experimentCountResult
					? experimentCountResult.total
					: 0;

				// Get paginated experiments
				const experiments = await dbAll(
					"SELECT * FROM experiments WHERE template_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?",
					args.template_id,
					limit,
					offset,
				);

				const avgRating =
					template.rating_count > 0
						? (template.total_rating / template.rating_count).toFixed(1)
						: "N/A";

				// Analyze performance by AI model
				const modelStats = {};
				experiments.forEach((exp) => {
					const model = exp.ai_model || "claude";
					if (!modelStats[model]) {
						modelStats[model] = { count: 0, totalRating: 0 };
					}
					modelStats[model].count++;
					modelStats[model].totalRating += exp.rating;
				});

				const modelAnalysis = Object.entries(modelStats)
					.map(([model, stats]) => {
						const avg = (stats.totalRating / stats.count).toFixed(1);
						return `${model}: ${avg} avg (${stats.count} uses)`;
					})
					.join("\n   ");

				// Get common feedback themes from current page
				const notes = experiments.filter((e) => e.notes).map((e) => e.notes);

				// Pagination info for experiments
				const hasMoreExperiments = offset + limit < totalExperiments;
				const currentPage = Math.floor(offset / limit) + 1;
				const totalPages = Math.ceil(totalExperiments / limit);

				return {
					content: [
						{
							type: "text",
							text: `📊 Template Analysis: ${template.name}

📈 Overall Performance:
   Total Uses: ${template.uses}
   Average Rating: ${avgRating} ⭐
   Total Ratings: ${template.rating_count}
   Total Experiments: ${totalExperiments}

🤖 Performance by AI Model:
   ${modelAnalysis || "No model-specific data yet"}

💬 Recent Feedback (Page ${currentPage} of ${totalPages}):
${
	notes.length > 0
		? notes
				.slice(0, 3)
				.map((n) => `   • ${n}`)
				.join("\n")
		: "   No feedback notes yet"
}

🎯 Quality Score: ${calculateQualityScore(template)}/100

💡 Recommendations:
${avgRating < 3 ? "   • Consider refining the prompt structure\n" : ""}${template.uses < 5 ? "   • Need more usage data for reliable insights\n" : ""}${notes.length < 3 ? "   • Encourage users to leave feedback notes\n" : ""}${hasMoreExperiments ? `\n➡️ Use offset: ${offset + limit} to see more experiments` : ""}`,
						},
					],
				};
			}

			case "risen_suggest": {
				const template = await dbGet(
					"SELECT * FROM templates WHERE id = ?",
					args.template_id,
				);
				if (!template) {
					return { content: [{ type: "text", text: "❌ Template not found" }] };
				}

				const validation = validateRISEN(template);
				const suggestions = generateSuggestions(template);

				// Get performance data
				const avgRating =
					template.rating_count > 0
						? (template.total_rating / template.rating_count).toFixed(1)
						: null;

				// Generate enhanced suggestions based on performance
				const enhancedSuggestions = [];

				if (avgRating && parseFloat(avgRating) < 3) {
					enhancedSuggestions.push(
						"Low ratings suggest the prompt may be too vague or complex. Consider simplifying.",
					);
				}

				if (template.uses > 10 && (!avgRating || parseFloat(avgRating) < 4)) {
					enhancedSuggestions.push(
						"With many uses but moderate ratings, gather user feedback to identify specific issues.",
					);
				}

				// Component-specific enhanced suggestions
				const roleWords = template.role.split(" ").length;
				if (roleWords < 8) {
					enhancedSuggestions.push(
						"Role is very brief. Try: 'Expert [domain] professional with [X] years experience in [specific areas], specialized in [unique skills]'",
					);
				}

				try {
					const steps = JSON.parse(template.steps);
					if (steps.some((s) => s.split(" ").length < 5)) {
						enhancedSuggestions.push(
							"Some steps are too brief. Each step should be a complete, actionable instruction.",
						);
					}
				} catch (e) {}

				return {
					content: [
						{
							type: "text",
							text: `🎯 AI-Powered Suggestions for "${template.name}"

📊 Current Performance:
   Quality Score: ${validation.score}/100
   Average Rating: ${avgRating || "N/A"} ⭐
   Total Uses: ${template.uses}

💡 Component Improvements:
${suggestions.map((s) => `• [${s.component.toUpperCase()}] ${s.suggestion}`).join("\n")}

🚀 Enhanced Suggestions:
${enhancedSuggestions.map((s) => `• ${s}`).join("\n")}

📝 Example Improvements:

        BEFORE: "${template.role.substring(0, 50)}..."
        AFTER: "Senior ${template.role.includes("expert") ? "" : "expert "}${template.role} with deep knowledge of industry best practices and proven track record"

🎨 Pro Tips:
• Use specific numbers in expectations (e.g., "5-7 actionable insights")
• Include examples in narrowing (e.g., "Avoid jargon, write at 8th grade level")
• Test with different variable combinations to find what works best`,
						},
					],
				};
			}

			case "risen_convert": {
				// Simple conversion logic - in real implementation, this could use AI
				const { request, context } = args;

				// Extract potential components from the request
				const keywords = {
					role: ["as a", "act as", "you are", "expert", "specialist"],
					instructions: ["create", "write", "analyze", "generate", "help me"],
					expectations: [
						"should be",
						"must include",
						"make sure",
						"i want",
						"need",
					],
					narrowing: ["focus on", "avoid", "don't", "specifically", "only"],
				};

				// Simple extraction logic
				let role = "Expert assistant";
				const instructions = request;
				let expectations = "Clear, comprehensive, and actionable output";
				const narrowing = "Focus on practical solutions";

				// Try to extract role
				for (const keyword of keywords.role) {
					if (request.toLowerCase().includes(keyword)) {
						const startIdx = request.toLowerCase().indexOf(keyword);
						const endIdx = request.indexOf(".", startIdx);
						if (endIdx > startIdx) {
							role = request
								.substring(startIdx, endIdx)
								.replace(keyword, "")
								.trim();
							break;
						}
					}
				}

				// Generate steps based on request type
				const steps = [];
				if (request.includes("analyze")) {
					steps.push("Examine the provided information thoroughly");
					steps.push("Identify key patterns and insights");
					steps.push("Draw conclusions based on analysis");
				} else if (request.includes("write") || request.includes("create")) {
					steps.push("Plan the structure and key points");
					steps.push("Develop the main content");
					steps.push("Review and refine for clarity");
				} else {
					steps.push("Understand the requirement");
					steps.push("Process the information");
					steps.push("Provide comprehensive response");
				}

				// Extract any specific requirements
				if (context) {
					expectations += `. ${context}`;
				}

				const convertedTemplate = {
					role: role.charAt(0).toUpperCase() + role.slice(1),
					instructions: instructions,
					steps: steps,
					expectations: expectations,
					narrowing: narrowing,
				};

				return {
					content: [
						{
							type: "text",
							text: `🔄 Converted to RISEN format:

**Role**: ${convertedTemplate.role}

**Instructions**: ${convertedTemplate.instructions}

**Steps**:
${convertedTemplate.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

**Expectations**: ${convertedTemplate.expectations}

**Narrowing**: ${convertedTemplate.narrowing}

💡 Tips for improvement:
• Refine the role to be more specific to your domain
• Add more detailed steps based on your workflow
• Include measurable expectations (e.g., word count, format)
• Adjust narrowing to focus on your priorities

Would you like to save this as a template?`,
						},
					],
				};
			}

			default:
				return {
					content: [
						{
							type: "text",
							text: `Unknown tool: ${name}`,
						},
					],
				};
		}
	} catch (error) {
		console.error("[RISEN] Tool handler error:", error); // Log full error for debugging
		return {
			content: [
				{
					type: "text",
					text: "An unexpected error occurred. Please try again later.",
				},
			],
		};
	}
});

// Start server with retry logic
async function main() {
	const maxRetries = 3;
	let retries = 0;

	while (retries < maxRetries) {
		try {
			await initDatabase();
			break; // Exit loop if successful
		} catch (error) {
			console.error(
				`[RISEN] Database initialization failed (attempt ${retries + 1}/${maxRetries}):`,
				error.message,
			);
			retries++;

			if (retries < maxRetries) {
				console.error(`[RISEN] Retrying in 2 seconds...`);
				await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
			}
		}
	}

	if (retries === maxRetries) {
		console.error(
			"[RISEN] Database initialization failed after multiple retries. Exiting.",
		);
		process.exit(1); // Exit with an error code
	}

	const transport = new StdioServerTransport();
	await server.connect(transport);

	console.error("[RISEN] RISEN Prompts MCP Server is running!");
	console.error(`[RISEN] Database path: ${dbPath}`);
}

main().catch((error) => {
	console.error("[RISEN] Fatal error:", error);
	process.exit(1);
});

// Handle graceful shutdown
process.on("SIGINT", () => {
	console.error("[RISEN] Shutting down...");
	try {
		db.close((err) => {
			if (err) {
				console.error("[RISEN] Error closing database:", err.message);
			} else {
				console.error("[RISEN] Database closed successfully");
			}
			process.exit(0);
		});
	} catch (error) {
		console.error("[RISEN] Error during shutdown:", error.message);
		process.exit(1);
	}
});
