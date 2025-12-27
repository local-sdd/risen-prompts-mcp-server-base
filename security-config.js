// ============================================================================
// SECURITY CONFIGURATION
// ============================================================================

// Security limits - can be overridden by environment variables
export const SECURITY_CONFIG = {
	// Input size limits
	MAX_TEMPLATE_NAME_LENGTH:
		parseInt(process.env.MAX_TEMPLATE_NAME_LENGTH) || 100,
	MAX_DESCRIPTION_LENGTH: parseInt(process.env.MAX_DESCRIPTION_LENGTH) || 500,
	MAX_INSTRUCTIONS_LENGTH:
		parseInt(process.env.MAX_INSTRUCTIONS_LENGTH) || 2000,
	MAX_EXPECTATIONS_LENGTH:
		parseInt(process.env.MAX_EXPECTATIONS_LENGTH) || 1000,
	MAX_NARROWING_LENGTH: parseInt(process.env.MAX_NARROWING_LENGTH) || 1000,
	MAX_STEPS_COUNT: parseInt(process.env.MAX_STEPS_COUNT) || 50,
	MAX_VARIABLES_COUNT: parseInt(process.env.MAX_VARIABLES_COUNT) || 20,
	MAX_TAGS_COUNT: parseInt(process.env.MAX_TAGS_COUNT) || 10,

	// Response limits
	MAX_TEMPLATE_SIZE: parseInt(process.env.MAX_TEMPLATE_SIZE) || 8000,
	MAX_INDIVIDUAL_FIELD_SIZE:
		parseInt(process.env.MAX_INDIVIDUAL_FIELD_SIZE) || 2000,
	MAX_RESPONSE_SIZE: parseInt(process.env.MAX_RESPONSE_SIZE) || 2000,

	// Database configuration
	DB_PATH: process.env.RISEN_DB_PATH || "risen_prompts.db",

	// Security features
	ENABLE_DEBUG_LOGGING:
		process.env.DEBUG === "true" || process.env.NODE_ENV === "development",
	ENABLE_ERROR_DETAILS: process.env.ENABLE_ERROR_DETAILS === "true",

	// Performance limits
	PAGINATION_LIMIT: parseInt(process.env.PAGINATION_LIMIT) || 20,
	MAX_SEARCH_RESULTS: parseInt(process.env.MAX_SEARCH_RESULTS) || 10,

	// Cleanup configuration
	CLEANUP_RETENTION_DAYS: parseInt(process.env.CLEANUP_RETENTION_DAYS) || 90,
	UNUSED_TEMPLATE_DAYS: parseInt(process.env.UNUSED_TEMPLATE_DAYS) || 30,

	// Health monitoring
	MAX_HEALTHY_DB_SIZE_KB: parseInt(process.env.MAX_HEALTHY_DB_SIZE_KB) || 50000,
	MAX_HEALTHY_MEMORY_MB: parseInt(process.env.MAX_HEALTHY_MEMORY_MB) || 500,
	MAX_HEALTHY_RESPONSE_TIME_MS:
		parseInt(process.env.MAX_HEALTHY_RESPONSE_TIME_MS) || 5000,
	MAX_ERROR_RATE_PERCENT: parseInt(process.env.MAX_ERROR_RATE_PERCENT) || 5,
};

// Security validation functions
export function validateSecurityLimits() {
	const issues = [];

	if (SECURITY_CONFIG.MAX_TEMPLATE_SIZE > 50000) {
		issues.push("MAX_TEMPLATE_SIZE is dangerously large (>50KB)");
	}

	if (SECURITY_CONFIG.MAX_RESPONSE_SIZE > 10000) {
		issues.push("MAX_RESPONSE_SIZE is dangerously large (>10KB)");
	}

	if (
		SECURITY_CONFIG.ENABLE_ERROR_DETAILS &&
		process.env.NODE_ENV === "production"
	) {
		issues.push("Error details should not be enabled in production");
	}

	return issues;
}

// Environment setup recommendations
export function getSecurityRecommendations() {
	return [
		"Set NODE_ENV=production for production deployments",
		"Use a secure database path outside the web root",
		"Enable only necessary debug features",
		"Monitor security limits and adjust based on usage",
		"Regularly review and update security configuration",
	];
}
