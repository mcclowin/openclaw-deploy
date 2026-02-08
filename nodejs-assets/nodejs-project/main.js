/**
 * Brain and Hand - Mobile Node.js Entry Point
 * 
 * This runs inside nodejs-mobile on Android/iOS.
 * It starts a minimal OpenClaw-like gateway and bridges to React Native.
 */

// Get the bridge - either real (nodejs-mobile) or mock (testing)
let bridge;
try {
  bridge = require('rn-bridge');
} catch (e) {
  // Running standalone for testing
  bridge = global.__mockBridge;
  if (!bridge) {
    console.error('No bridge available. Run via test-standalone.js or nodejs-mobile.');
    process.exit(1);
  }
}

// State
let config = null;
let running = false;
let messageCount = 0;
const startTime = Date.now();

// Log helper that sends to React Native
function log(msg) {
  console.log(`[Node] ${msg}`);
  bridge.channel.send(JSON.stringify({
    type: 'log',
    message: msg,
    timestamp: Date.now(),
  }));
}

// Send status update to React Native
function sendStatus() {
  bridge.channel.send(JSON.stringify({
    type: 'status',
    running,
    uptime: Math.floor((Date.now() - startTime) / 1000),
    messageCount,
    config: config ? { name: config.soul?.name } : null,
  }));
}

// Handle messages from React Native
bridge.channel.on('message', (msg) => {
  try {
    const data = JSON.parse(msg);
    handleCommand(data);
  } catch (e) {
    log(`Error parsing message: ${e.message}`);
  }
});

// Command handler
async function handleCommand(data) {
  const { type, payload, requestId } = data;

  switch (type) {
    case 'ping':
      respond(requestId, { pong: true });
      break;

    case 'status':
      sendStatus();
      break;

    case 'configure':
      config = payload;
      log(`Configured: ${config.soul?.name || 'unnamed bot'}`);
      respond(requestId, { success: true });
      break;

    case 'start':
      await startGateway();
      respond(requestId, { success: true });
      break;

    case 'stop':
      await stopGateway();
      respond(requestId, { success: true });
      break;

    case 'chat':
      const response = await handleChat(payload.text);
      respond(requestId, { response });
      break;

    default:
      log(`Unknown command: ${type}`);
      respond(requestId, { error: `Unknown command: ${type}` });
  }
}

// Send response back to React Native
function respond(requestId, payload) {
  if (requestId) {
    bridge.channel.send(JSON.stringify({
      type: 'response',
      requestId,
      payload,
    }));
  }
}

// Start the gateway (connect to channels)
async function startGateway() {
  if (!config) {
    log('Cannot start: no config');
    return;
  }

  log('Starting gateway...');
  running = true;

  // TODO: Initialize actual channel connections here
  // For now, just log that we're "running"
  
  if (config.channels?.telegram?.enabled) {
    log(`Telegram: Would connect with token ${config.channels.telegram.token.slice(0, 10)}...`);
    // TODO: Actual Telegram connection
  }

  sendStatus();
  log('Gateway started!');
}

// Stop the gateway
async function stopGateway() {
  log('Stopping gateway...');
  running = false;
  // TODO: Disconnect channels
  sendStatus();
  log('Gateway stopped');
}

// Handle a chat message (direct chat with bot)
async function handleChat(text) {
  messageCount++;
  log(`Chat received: ${text}`);

  if (!config) {
    return "I'm not configured yet. Please set up my brain first.";
  }

  // TODO: Call actual LLM here
  // For now, echo back
  const botName = config.soul?.name || 'Bot';
  return `[${botName}] You said: "${text}"\n\n(LLM integration coming soon!)`;
}

// Startup
log('Node.js runtime initialized');
log(`Node version: ${process.version}`);
sendStatus();

// Keep alive (only in real environment, not tests)
if (!global.__mockBridge) {
  setInterval(() => {
    sendStatus();
  }, 30000);
}
