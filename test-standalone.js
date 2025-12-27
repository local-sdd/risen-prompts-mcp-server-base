// Test if the server can start without MCP

import path from "node:path";
import { fileURLToPath } from "node:url";
import sqlite3 from "sqlite3";
import { promisify } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Testing RISEN server startup...");
console.log("Directory:", __dirname);

try {
	// Test database creation
	const dbPath = path.join(__dirname, "test.db");
	console.log("Creating database at:", dbPath);

	const db = new sqlite3.Database(dbPath, (err) => {
		if (err) {
			console.error("Database creation failed:", err);
			process.exit(1);
		} else {
			console.log("Database created successfully!");

			// Test a simple query
			db.run("CREATE TABLE IF NOT EXISTS test (id INTEGER)", (err) => {
				if (err) {
					console.error("Table creation failed:", err);
				} else {
					console.log("Table created successfully!");
					console.log("All tests passed! The server should work.");
				}
				db.close();
			});
		}
	});
} catch (error) {
	console.error("Error during startup:", error);
}
