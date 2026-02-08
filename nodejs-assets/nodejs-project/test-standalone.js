/**
 * Test script to verify Node.js code works standalone
 * Run with: node test-standalone.js
 * 
 * This simulates what nodejs-mobile will do.
 */

const EventEmitter = require('events');

// Create mock bridge before loading main.js
const mockChannel = new EventEmitter();
mockChannel.send = (msg) => {
  const data = JSON.parse(msg);
  console.log(`[RN Bridge OUT] ${data.type}:`, JSON.stringify(data, null, 2));
};

global.__mockBridge = { channel: mockChannel };

console.log('=== Testing Brain and Hand Node.js Runtime ===\n');

// Load main.js
require('./main.js');

// Simulate React Native sending messages
setTimeout(() => {
  console.log('\n--- Simulating: ping ---');
  mockChannel.emit('message', JSON.stringify({
    type: 'ping',
    requestId: 'test-1',
  }));
}, 500);

setTimeout(() => {
  console.log('\n--- Simulating: configure ---');
  mockChannel.emit('message', JSON.stringify({
    type: 'configure',
    requestId: 'test-2',
    payload: {
      model: { provider: 'anthropic' },
      channels: { telegram: { enabled: true, token: 'test-token-12345' } },
      soul: { name: 'TestBot', mission: 'Help with testing' },
    },
  }));
}, 1000);

setTimeout(() => {
  console.log('\n--- Simulating: start ---');
  mockChannel.emit('message', JSON.stringify({
    type: 'start',
    requestId: 'test-3',
  }));
}, 1500);

setTimeout(() => {
  console.log('\n--- Simulating: chat ---');
  mockChannel.emit('message', JSON.stringify({
    type: 'chat',
    requestId: 'test-4',
    payload: { text: 'Hello, bot!' },
  }));
}, 2000);

setTimeout(() => {
  console.log('\n--- Simulating: status ---');
  mockChannel.emit('message', JSON.stringify({
    type: 'status',
    requestId: 'test-5',
  }));
}, 2500);

setTimeout(() => {
  console.log('\n=== Test Complete ===');
  process.exit(0);
}, 3000);
