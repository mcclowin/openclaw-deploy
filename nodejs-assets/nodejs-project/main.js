/**
 * Brain and Hand - Just runs OpenClaw
 */

let bridge;
try {
  bridge = require('rn-bridge');
} catch (e) {
  bridge = global.bridge || {
    app: { datadir: () => process.env.HOME || '/tmp' },
    channel: { on: () => {}, send: (m) => console.log('[RN]', m) }
  };
}

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const DATA_DIR = bridge.app.datadir();
const OPENCLAW_HOME = path.join(DATA_DIR, '.openclaw');

// Ensure dirs
[OPENCLAW_HOME, path.join(OPENCLAW_HOME, 'workspace')].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function send(data) {
  bridge.channel.send(JSON.stringify(data));
}

function output(text) {
  send({ type: 'output', text });
}

let proc = null;

function run(args) {
  if (proc) {
    output('[Already running, stop first]');
    return;
  }

  const env = {
    ...process.env,
    HOME: DATA_DIR,
    OPENCLAW_HOME: OPENCLAW_HOME,
    FORCE_COLOR: '0',
  };

  // Find openclaw
  const localBin = path.join(__dirname, 'node_modules', '.bin', 'openclaw');
  const localMjs = path.join(__dirname, 'node_modules', 'openclaw', 'openclaw.mjs');
  
  let cmd, cmdArgs;
  if (fs.existsSync(localBin)) {
    cmd = localBin;
    cmdArgs = args;
  } else if (fs.existsSync(localMjs)) {
    cmd = process.execPath;
    cmdArgs = [localMjs, ...args];
  } else {
    cmd = 'openclaw';
    cmdArgs = args;
  }

  output(`[Running: ${cmd} ${cmdArgs.join(' ')}]`);

  proc = spawn(cmd, cmdArgs, {
    env,
    cwd: OPENCLAW_HOME,
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  proc.stdout.on('data', (data) => {
    data.toString().split('\n').forEach(line => {
      if (line) output(line);
    });
  });

  proc.stderr.on('data', (data) => {
    data.toString().split('\n').forEach(line => {
      if (line) output(line);
    });
  });

  proc.on('exit', (code) => {
    proc = null;
    send({ type: 'exited', code });
  });

  send({ type: 'started' });
}

function stop() {
  if (proc) {
    proc.kill('SIGTERM');
    setTimeout(() => { if (proc) proc.kill('SIGKILL'); }, 3000);
  }
}

function input(text) {
  if (proc) {
    proc.stdin.write(text + '\n');
  }
}

bridge.channel.on('message', (msg) => {
  try {
    const data = JSON.parse(msg);
    switch (data.cmd) {
      case 'run': run(data.args || ['--help']); break;
      case 'stop': stop(); break;
      case 'input': input(data.text); break;
    }
  } catch (e) {
    output(`[Error: ${e.message}]`);
  }
});

output(`[Node.js ${process.version}]`);
output(`[Data: ${DATA_DIR}]`);
send({ type: 'ready', node: process.version });
