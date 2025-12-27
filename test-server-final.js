// Final test with proper logging
console.log("[FINAL TEST] Testing risen-prompts server...");

try {
	await import("./server.js");
	// Server should be running now
	console.log(
		"[FINAL TEST] Server started successfully! Check the logs above for [RISEN] messages.",
	);
} catch (error) {
	console.error("[FINAL TEST] Server failed to start:", error.message);
	console.error("[FINAL TEST] Full error:", error);
	process.exit(1);
}
