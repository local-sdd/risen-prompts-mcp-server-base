#!/usr/bin/env node
// Test the server as Claude would run it
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('[TEST] Starting risen-prompts server test...');

// Spawn the server as Claude would
const serverPath = path.join(__dirname, 'server.js');
const child = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: { ...process.env }
});

// Capture stdout
child.stdout.on('data', (data) => {
  console.log('[SERVER STDOUT]:', data.toString());
});

// Capture stderr
child.stderr.on('data', (data) => {
  console.log('[SERVER STDERR]:', data.toString());
});

// Handle errors
child.on('error', (error) => {
  console.error('[SPAWN ERROR]:', error);
});

// Handle exit
child.on('exit', (code, signal) => {
  console.log(`[SERVER EXIT] Code: ${code}, Signal: ${signal}`);
});

// Send a test request after a moment
setTimeout(() => {
  console.log('[TEST] Sending test request...');
  
  // Send a tools/list request
  const request = {
    jsonrpc: '2.0',
    method: 'tools/list',
    params: {},
    id: 1
  };
  
  child.stdin.write(JSON.stringify(request) + '\n');
  
  // Give it time to respond
  setTimeout(() => {
    console.log('[TEST] Killing server...');
    child.kill();
  }, 2000);
}, 1000);
