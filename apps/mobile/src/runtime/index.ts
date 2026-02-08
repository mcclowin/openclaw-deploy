/**
 * Runtime bridge for nodejs-mobile
 * 
 * Handles communication between React Native UI and Node.js (OpenClaw)
 */

// This will be imported from nodejs-mobile-react-native when available
// For now, define types and mock for development

export interface BotStatus {
  running: boolean;
  uptime: number;
  messageCount: number;
  config: {
    name?: string;
  } | null;
}

export interface BotConfig {
  model: {
    provider: 'anthropic' | 'openai' | 'x402' | 'ollama';
    apiKey?: string;
    model?: string;
  };
  channels: {
    telegram?: {
      enabled: boolean;
      token: string;
    };
  };
  soul: {
    name: string;
    mission: string;
    flavors?: string[];
  };
  skills?: string[];
}

type NodeMessage = 
  | { type: 'log'; message: string; timestamp: number }
  | { type: 'status'; running: boolean; uptime: number; messageCount: number; config: any }
  | { type: 'response'; requestId: string; payload: any };

type EventHandler = (event: NodeMessage) => void;

class NodeBridge {
  private listeners: EventHandler[] = [];
  private pendingRequests: Map<string, (payload: any) => void> = new Map();
  private nodejs: any = null;
  private requestId = 0;

  /**
   * Initialize the bridge with nodejs-mobile
   */
  async init(): Promise<void> {
    try {
      // Try to import nodejs-mobile-react-native
      // This will fail in development but work in the actual app
      this.nodejs = require('nodejs-mobile-react-native');
      
      // Start Node.js runtime
      this.nodejs.start('main.js');
      
      // Listen for messages from Node
      this.nodejs.channel.addListener('message', (msg: string) => {
        this.handleMessage(msg);
      });
      
      console.log('[Bridge] Node.js runtime started');
    } catch (e) {
      console.log('[Bridge] Running in mock mode (nodejs-mobile not available)');
      this.nodejs = null;
    }
  }

  /**
   * Handle incoming message from Node.js
   */
  private handleMessage(msgStr: string): void {
    try {
      const msg: NodeMessage = JSON.parse(msgStr);
      
      // Check if it's a response to a pending request
      if (msg.type === 'response' && 'requestId' in msg) {
        const resolver = this.pendingRequests.get(msg.requestId);
        if (resolver) {
          resolver(msg.payload);
          this.pendingRequests.delete(msg.requestId);
        }
      }
      
      // Notify all listeners
      this.listeners.forEach(handler => handler(msg));
    } catch (e) {
      console.error('[Bridge] Error parsing message:', e);
    }
  }

  /**
   * Send a command to Node.js and wait for response
   */
  async send<T = any>(type: string, payload?: any): Promise<T> {
    const requestId = `req_${++this.requestId}`;
    
    return new Promise((resolve, reject) => {
      // Set timeout
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error('Request timeout'));
      }, 30000);

      // Store resolver
      this.pendingRequests.set(requestId, (response) => {
        clearTimeout(timeout);
        resolve(response);
      });

      // Send message
      const msg = JSON.stringify({ type, payload, requestId });
      
      if (this.nodejs) {
        this.nodejs.channel.send(msg);
      } else {
        // Mock mode - simulate response
        setTimeout(() => {
          this.handleMockResponse(type, payload, requestId);
        }, 100);
      }
    });
  }

  /**
   * Mock responses for development
   */
  private handleMockResponse(type: string, payload: any, requestId: string): void {
    let response: any = { success: true };

    switch (type) {
      case 'ping':
        response = { pong: true };
        break;
      case 'status':
        response = {
          running: false,
          uptime: 0,
          messageCount: 0,
          config: null,
        };
        break;
      case 'chat':
        response = {
          response: `[Mock] You said: "${payload?.text || ''}"`,
        };
        break;
    }

    this.handleMessage(JSON.stringify({
      type: 'response',
      requestId,
      payload: response,
    }));
  }

  /**
   * Subscribe to events from Node.js
   */
  onEvent(handler: EventHandler): () => void {
    this.listeners.push(handler);
    return () => {
      const idx = this.listeners.indexOf(handler);
      if (idx >= 0) this.listeners.splice(idx, 1);
    };
  }
}

// Singleton instance
export const nodeBridge = new NodeBridge();

/**
 * High-level bot runtime interface
 */
export const runtime = {
  /**
   * Initialize the runtime
   */
  async init(): Promise<void> {
    await nodeBridge.init();
  },

  /**
   * Configure the bot
   */
  async configure(config: BotConfig): Promise<void> {
    await nodeBridge.send('configure', config);
  },

  /**
   * Start the gateway
   */
  async start(): Promise<void> {
    await nodeBridge.send('start');
  },

  /**
   * Stop the gateway
   */
  async stop(): Promise<void> {
    await nodeBridge.send('stop');
  },

  /**
   * Get current status
   */
  async status(): Promise<BotStatus> {
    return await nodeBridge.send('status');
  },

  /**
   * Send a chat message
   */
  async chat(text: string): Promise<string> {
    const result = await nodeBridge.send<{ response: string }>('chat', { text });
    return result.response;
  },

  /**
   * Subscribe to events
   */
  onEvent: nodeBridge.onEvent.bind(nodeBridge),
};

export default runtime;
