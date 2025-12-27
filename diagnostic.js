// Simple diagnostic to check if risen-prompts can start
console.error("[DIAGNOSTIC] Starting diagnostic...");
console.error("[DIAGNOSTIC] Node version:", process.version);
console.error("[DIAGNOSTIC] Current directory:", process.cwd());

// Test imports one by one
try {
	const { StdioServerTransport } = await import(
		"@modelcontextprotocol/sdk/server/stdio.js"
	);
	console.error("[DIAGNOSTIC] ✓ StdioServerTransport imported successfully");
} catch (error) {
	console.error(
		"[DIAGNOSTIC] ✗ Failed to import StdioServerTransport:",
		error.message,
	);
}

try {
	const { Server } = await import("@modelcontextprotocol/sdk/server/index.js");
	console.error("[DIAGNOSTIC] ✓ Server imported successfully");
} catch (error) {
	console.error("[DIAGNOSTIC] ✗ Failed to import Server:", error.message);
}

try {
	const sqlite3 = await import("sqlite3");
	console.error("[DIAGNOSTIC] ✓ sqlite3 imported successfully");
} catch (error) {
	console.error("[DIAGNOSTIC] ✗ Failed to import sqlite3:", error.message);
}

try {
	const { v4: uuidv4 } = await import("uuid");
	console.error("[DIAGNOSTIC] ✓ uuid imported successfully");
} catch (error) {
	console.error("[DIAGNOSTIC] ✗ Failed to import uuid:", error.message);
}

console.error(
	"[DIAGNOSTIC] All basic imports completed. Server should be able to start.",
);
