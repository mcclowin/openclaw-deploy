# Voice Generation

## Overview

BotsAndBrain generates unique robot voices for each bot. No fake human voices — we're honest about being AI.

Every bot gets a deterministic voice signature derived from its name and archetype, ensuring:
- 1B+ unique voice combinations
- Consistent voice across sessions
- Reproducible from config alone

## Voice Archetypes

| ID | Archetype | Inspiration | Base Parameters |
|----|-----------|-------------|-----------------|
| `BTL` | British Butler | JARVIS, C-3PO | warmth: 65, humanity: 55, formality: 85 |
| `SHP` | Ship Computer | HAL 9000, Auto | warmth: 30, humanity: 20, formality: 70 |
| `PLY` | Playful AI | TARS | warmth: 80, humanity: 60, formality: 30 |
| `ALG` | Algorithm | Hawking Synth | warmth: 20, humanity: 10, formality: 90 |
| `WRM` | Warm Synthetic | Samantha (Her) | warmth: 90, humanity: 75, formality: 50 |
| `RTR` | Retro Bot | 80s TTS | warmth: 40, humanity: 15, formality: 60 |
| `GLT` | Glitch | Corrupted AI | warmth: 50, humanity: 30, formality: 40 |

## Voice Parameters

| Parameter | Range | Description |
|-----------|-------|-------------|
| **Warmth** | 0-100 | cold/clinical (0) → warm/friendly (100) |
| **Humanity** | 0-100 | robotic/synthetic (0) → organic/natural (100) |
| **Formality** | 0-100 | casual (0) → British scientist (100) |
| **Era** | enum | "80s Synth", "HAL-9000", "Modern AI", "Hawking Synth", "Corrupted" |

## Derivation Formula

### Hash Function

```javascript
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}
```

### Auto-Archetype Selection

When user doesn't pick an archetype, derive from name:

```javascript
const archetypeList = ['butler', 'ship', 'playful', 'algorithm', 'warm', 'retro', 'glitch'];
const archetypeIndex = hashCode(botName) % archetypeList.length;
const selectedArchetype = archetypeList[archetypeIndex];
```

### Voice Parameter Derivation

```javascript
function deriveVoiceParams(botName, archetype) {
  const baseParams = archetypes[archetype];
  const hash = hashCode(botName + archetype);
  
  // Add ±10 variation based on name hash
  const warmth = clamp(baseParams.warmth + ((hash % 20) - 10), 0, 100);
  const humanity = clamp(baseParams.humanity + ((hash >> 4) % 20 - 10), 0, 100);
  const formality = clamp(baseParams.formality + ((hash >> 8) % 20 - 10), 0, 100);
  
  return { warmth, humanity, formality, era: baseParams.era };
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
```

### Voice ID Generation

```javascript
function generateVoiceId(botName, archetype) {
  const hash = hashCode(botName + archetype);
  const prefix = botName.substring(0, 3).toUpperCase();
  const code = archetypes[archetype].code;
  const suffix = (hash % 4096).toString(16).toUpperCase().padStart(3, '0');
  
  return `${prefix}-${code}-${suffix}`;
  // Example: "AXM-BTL-7F2"
}
```

## Unique Combinations

With 7 archetypes × 4096 hash suffixes × ~20 parameter variations each:
- 7 × 4096 × 20 × 20 × 20 = **~2.3 billion unique voices**

Even with same archetype, different names produce different voice signatures.

## TTS Provider Mapping

### ElevenLabs Voice Design API

```javascript
function toElevenLabsParams(voiceParams) {
  return {
    stability: 1 - (voiceParams.humanity / 100) * 0.3,
    similarity_boost: voiceParams.formality / 100,
    style: voiceParams.warmth / 100,
    use_speaker_boost: voiceParams.humanity > 50
  };
}
```

### OpenAI TTS (when available)

```javascript
function toOpenAIParams(voiceParams) {
  // Map to available voices based on closest match
  const voices = ['alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'];
  const index = Math.floor((voiceParams.warmth + voiceParams.humanity) / 40);
  return {
    voice: voices[index],
    speed: 0.9 + (voiceParams.formality / 500) // 0.9 - 1.1
  };
}
```

### Fallback: Vocoder Processing

For local/offline mode, apply vocoder effects to base TTS:

```javascript
function applyRobotEffect(audioBuffer, voiceParams) {
  const effects = [];
  
  // Lower humanity = more vocoder
  if (voiceParams.humanity < 30) {
    effects.push({ type: 'vocoder', intensity: 0.8 });
  }
  
  // Era affects filter
  if (voiceParams.era === '80s Synth') {
    effects.push({ type: 'bitcrush', bits: 8 });
    effects.push({ type: 'lowpass', freq: 4000 });
  }
  
  // Glitch effect
  if (voiceParams.era === 'Corrupted') {
    effects.push({ type: 'glitch', probability: 0.1 });
  }
  
  return processAudio(audioBuffer, effects);
}
```

## Configuration

In `openclaw.json`:

```json
{
  "bot": {
    "name": "Axiom",
    "voice": {
      "archetype": "butler",
      "provider": "elevenlabs",
      "voiceId": "AXM-BTL-7F2",
      "params": {
        "warmth": 67,
        "humanity": 42,
        "formality": 78,
        "era": "Modern AI"
      }
    }
  }
}
```

## Implementation Notes

- [ ] Integrate ElevenLabs Voice Design API
- [ ] Build vocoder fallback for offline mode
- [ ] Add "regenerate" button that uses timestamp for variation
- [ ] Cache generated voice params in config
- [ ] Consider voice cloning for advanced users
- [ ] Test with screen readers for accessibility

---

*Last updated: 2026-02-08*
