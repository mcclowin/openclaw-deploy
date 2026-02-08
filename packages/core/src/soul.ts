/**
 * SOUL.md generation from mission and flavors
 */

export interface SoulInput {
  name: string;
  mission: string;
  flavors?: string[];
}

/**
 * Generate SOUL.md content from wizard input
 */
export function generateSoul(input: SoulInput): string {
  const flavorText = input.flavors?.length
    ? `\n\n## Personality\n${input.flavors.map(f => `- ${f}`).join('\n')}`
    : '';

  const birthday = generateBirthday(input.name);

  return `# ${input.name}

## Mission
${input.mission}

## Identity
- **Name:** ${input.name}
- **Birthday:** ${birthday.toISOString().split('T')[0]}
- **Age:** ${calculateAge(birthday)} years old
${flavorText}

## Guidelines
- Stay focused on the mission above
- Be helpful but respect boundaries
- Adapt tone based on personality traits
- Never pretend to be human when asked directly

---
*Born ${birthday.toISOString().split('T')[0]} via Brain and Hand*
`;
}

/**
 * Generate deterministic birthday from name (2000-2005 range)
 */
export function generateBirthday(name: string): Date {
  const hash = simpleHash(name);
  const year = 2000 + (hash % 6); // 2000-2005
  const month = hash % 12;
  const day = 1 + (hash % 28);
  return new Date(year, month, day);
}

/**
 * Calculate age from birthday
 */
function calculateAge(birthday: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age--;
  }
  return age;
}

/**
 * Simple string hash
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}
