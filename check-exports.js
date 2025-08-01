// Check what's actually exported from types.js
import * as types from '@modelcontextprotocol/sdk/types.js';
console.log('Available exports from types.js:', Object.keys(types));

// Try to find the correct import path
try {
  const sdk = await import('@modelcontextprotocol/sdk/index.js');
  console.log('\nAvailable exports from main SDK:', Object.keys(sdk));
} catch (e) {
  console.error('Error importing main SDK:', e.message);
}

// Check server exports
try {
  const server = await import('@modelcontextprotocol/sdk/server/index.js');
  console.log('\nAvailable exports from server:', Object.keys(server));
} catch (e) {
  console.error('Error importing server:', e.message);
}
