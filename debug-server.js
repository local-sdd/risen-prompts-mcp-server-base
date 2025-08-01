#!/usr/bin/env node
console.error('[RISEN] Starting server...');

try {
  await import('./server.js');
  console.error('[RISEN] Server imported successfully');
} catch (error) {
  console.error('[RISEN] Failed to start server:', error);
  console.error('[RISEN] Stack trace:', error.stack);
  process.exit(1);
}
