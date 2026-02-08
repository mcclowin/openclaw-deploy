/**
 * Wizard step definitions and validation
 */

export type WizardStep = 'identity' | 'brain' | 'channels' | 'skills' | 'birth';

export interface WizardState {
  currentStep: WizardStep;
  identity: {
    name: string;
    mission: string;
    flavors: string[];
  } | null;
  brain: {
    provider: 'anthropic' | 'openai' | 'x402' | 'ollama';
    apiKey?: string;
  } | null;
  channels: {
    telegram?: { token: string };
    whatsapp?: { enabled: boolean };
  } | null;
  skills: string[];
}

export const WIZARD_STEPS: WizardStep[] = [
  'identity',
  'brain', 
  'channels',
  'skills',
  'birth',
];

export const FLAVOR_OPTIONS = [
  'Witty',
  'Calm',
  'Direct',
  'Warm',
  'Formal',
  'Playful',
  'Technical',
  'Emoji lover',
] as const;

export function createInitialState(): WizardState {
  return {
    currentStep: 'identity',
    identity: null,
    brain: null,
    channels: null,
    skills: [],
  };
}

export function canProceed(state: WizardState): boolean {
  switch (state.currentStep) {
    case 'identity':
      return state.identity !== null && 
             state.identity.name.length > 0 && 
             state.identity.mission.length > 0;
    case 'brain':
      return state.brain !== null;
    case 'channels':
      // At least one channel or skip
      return true;
    case 'skills':
      // Skills are optional
      return true;
    case 'birth':
      return true;
    default:
      return false;
  }
}

export function nextStep(current: WizardStep): WizardStep | null {
  const idx = WIZARD_STEPS.indexOf(current);
  if (idx === -1 || idx >= WIZARD_STEPS.length - 1) return null;
  return WIZARD_STEPS[idx + 1];
}

export function prevStep(current: WizardStep): WizardStep | null {
  const idx = WIZARD_STEPS.indexOf(current);
  if (idx <= 0) return null;
  return WIZARD_STEPS[idx - 1];
}
