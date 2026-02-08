import { z } from 'zod';

/**
 * OpenClaw config schema (openclaw.json)
 */
export const ConfigSchema = z.object({
  model: z.object({
    provider: z.enum(['anthropic', 'openai', 'x402', 'ollama']),
    model: z.string().optional(),
    apiKey: z.string().optional(),
  }),
  channels: z.object({
    telegram: z.object({
      enabled: z.boolean(),
      token: z.string(),
    }).optional(),
    whatsapp: z.object({
      enabled: z.boolean(),
    }).optional(),
  }),
  soul: z.object({
    name: z.string(),
    mission: z.string(),
    flavors: z.array(z.string()).optional(),
  }),
  skills: z.array(z.string()).optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

/**
 * Generate OpenClaw config from wizard answers
 */
export function generateConfig(input: {
  name: string;
  mission: string;
  flavors?: string[];
  brain: {
    provider: 'anthropic' | 'openai' | 'x402' | 'ollama';
    apiKey?: string;
    model?: string;
  };
  channels: {
    telegram?: { token: string };
    whatsapp?: { enabled: boolean };
  };
  skills?: string[];
}): Config {
  return {
    model: {
      provider: input.brain.provider,
      model: input.brain.model,
      apiKey: input.brain.apiKey,
    },
    channels: {
      telegram: input.channels.telegram
        ? { enabled: true, token: input.channels.telegram.token }
        : undefined,
      whatsapp: input.channels.whatsapp,
    },
    soul: {
      name: input.name,
      mission: input.mission,
      flavors: input.flavors,
    },
    skills: input.skills,
  };
}

/**
 * Serialize config to JSON string
 */
export function serializeConfig(config: Config): string {
  return JSON.stringify(config, null, 2);
}

/**
 * Validate and parse config
 */
export function parseConfig(json: string): Config {
  return ConfigSchema.parse(JSON.parse(json));
}
