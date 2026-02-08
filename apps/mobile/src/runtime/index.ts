/**
 * Runtime bridge for nodejs-mobile
 * 
 * Handles communication between React Native UI and Node.js (OpenClaw)
 */

// This will be implemented when nodejs-mobile is integrated
// For now, define the interface

export interface BotStatus {
  running: boolean;
  uptime: number;
  messagesHandled: number;
  channels: {
    name: string;
    connected: boolean;
    messageCount: number;
  }[];
}

export interface BotRuntime {
  /**
   * Start the OpenClaw gateway
   */
  start(): Promise<void>;

  /**
   * Stop the gateway
   */
  stop(): Promise<void>;

  /**
   * Get current status
   */
  status(): Promise<BotStatus>;

  /**
   * Send a chat message directly to the bot
   */
  chat(message: string): Promise<string>;

  /**
   * Subscribe to events from the bot
   */
  onEvent(handler: (event: BotEvent) => void): () => void;
}

export type BotEvent =
  | { type: 'started' }
  | { type: 'stopped' }
  | { type: 'message'; channel: string; from: string; text: string }
  | { type: 'error'; error: string };

/**
 * Create the runtime (will use nodejs-mobile when integrated)
 */
export function createRuntime(): BotRuntime {
  // Placeholder implementation
  return {
    async start() {
      console.log('[Runtime] Start called');
    },
    async stop() {
      console.log('[Runtime] Stop called');
    },
    async status() {
      return {
        running: false,
        uptime: 0,
        messagesHandled: 0,
        channels: [],
      };
    },
    async chat(message: string) {
      return `[Placeholder] You said: ${message}`;
    },
    onEvent(handler) {
      // No-op for now
      return () => {};
    },
  };
}
