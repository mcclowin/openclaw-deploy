/**
 * Skill bundles and definitions
 */

export interface Skill {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: SkillCategory;
}

export type SkillCategory = 
  | 'productivity'
  | 'communication'
  | 'research'
  | 'utility'
  | 'finance'
  | 'creative';

/**
 * Built-in popular skills
 */
export const POPULAR_SKILLS: Skill[] = [
  {
    id: 'calendar',
    name: 'Calendar',
    description: 'Check schedule, create events',
    icon: '📅',
    category: 'productivity',
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Read, summarize, draft emails',
    icon: '📧',
    category: 'communication',
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Forecasts and alerts',
    icon: '🌤️',
    category: 'utility',
  },
  {
    id: 'notes',
    name: 'Notes',
    description: 'Take and search notes',
    icon: '📝',
    category: 'productivity',
  },
  {
    id: 'reminders',
    name: 'Reminders',
    description: 'Set and manage reminders',
    icon: '⏰',
    category: 'productivity',
  },
  {
    id: 'web-search',
    name: 'Web Search',
    description: 'Search the internet',
    icon: '🌐',
    category: 'research',
  },
  {
    id: 'fact-checker',
    name: 'Fact Checker',
    description: 'Verify claims, check sources, detect misinformation',
    icon: '✅',
    category: 'research',
  },
];

/**
 * Skill bundles (curated packs)
 */
export const SKILL_BUNDLES = {
  essential: ['calendar', 'email', 'weather', 'reminders'],
  research: ['web-search', 'fact-checker', 'notes'],
  productivity: ['calendar', 'notes', 'reminders', 'email'],
} as const;

export type SkillBundleName = keyof typeof SKILL_BUNDLES;

/**
 * Get skills for a bundle
 */
export function getSkillBundle(name: SkillBundleName): Skill[] {
  const ids = SKILL_BUNDLES[name];
  return POPULAR_SKILLS.filter(s => ids.includes(s.id as any));
}
