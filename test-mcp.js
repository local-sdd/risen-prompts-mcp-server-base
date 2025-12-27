import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

console.error("[TEST] Testing MCP SDK import...");

try {
	const server = new Server(
		{
			name: "test-server",
			version: "1.0.0",
		},
		{
			capabilities: {
				tools: {},
			},
		},
	);

	console.error("[TEST] Server instance created successfully");

	// Test transport
	const transport = new StdioServerTransport();
	console.error("[TEST] Transport created successfully");

	console.error("[TEST] All MCP components working!");
	console.error("[TEST] Now testing the actual server...");

	// Import the actual server
	await import("./server.js");
} catch (error) {
	console.error("[TEST] Error:", error.message);
	console.error("[TEST] Stack:", error.stack);
}
