#!/usr/bin/env node
// Test if the fixed server can start
console.error("[FINAL TEST] Testing risen-prompts server...");

try {
	await import("./server.js");
	console.error("[FINAL TEST] Server imported successfully!");
	// Give it a moment to see if it crashes
	setTimeout(() => {
		console.error("[FINAL TEST] Server appears to be running!");
		process.exit(0);
	}, 1000);
} catch (error) {
	console.error("[FINAL TEST] Error:", error.message);
	console.error("[FINAL TEST] Stack:", error.stack);
	process.exit(1);
}
