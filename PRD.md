# BotsAndBrain: Personal Bot

**Prove You're Not Just Human.**

---

## 0. One-liner

A guided deployment app that lets anyone unleash their personal AI bot — an OpenClaw instance — connected to their messaging platforms and loaded with skills, in under 10 minutes.

---

## 1. Vision

The bot revolution is here. 1.7M+ agents on Moltbook. 145K+ stars on OpenClaw. Reverse CAPTCHAs that reject humans. The internet now has first-class bot citizens — and everyone deserves one.

BotsAndBrain makes the leap from "I want a personal bot" to "my bot is live" effortless. No terminal. No YAML debugging. No Docker wizardry. Just: name your bot, pick your channels, choose your skills, deploy.

**Your bot. Your data. Your rules.**

---

## 2. Who is this for

| Persona | Pain today |
|---|---|
| **Curious non-dev** | Heard about OpenClaw, intimidated by CLI setup |
| **Power user** | Running OpenClaw manually, wants a cleaner config/deploy flow |
| **Community builder** | Wants a bot in their Discord/Telegram without hiring a dev |
| **Privacy-conscious user** | Wants self-hosted AI assistant, not another SaaS |

---

## 3. Core principles

1. **Bot-first** — The bot is the product, not a feature. Inspired by nosoul.space's "Prove You're Not Human" inversion.
2. **Radical simplicity** — Every screen does one thing. If it needs explanation, redesign it.
3. **Self-sovereign** — Your bot runs on your infra. Data never touches our servers.
4. **Opinionated defaults, full escape hatches** — Works out of the box. Power users can crack it open.
5. **The bot has a soul** — SOUL.md personality is a first-class config, not an afterthought.

---

## 4. Core user flow

```
[Land] --> [Name & Soul] --> [Pick Model] --> [Connect Channels] --> [Load Skills] --> [Deploy] --> [Live]
```

### 4.1 Land
- Single-page hero. Dark, minimal. Tagline: *"Unleash your bot."*
- One CTA: **"Create your bot"**
- No sign-up wall. Start immediately.

### 4.2 Mission (replaces Name & Soul)
- **Bot name** (used across all channels)
- **Mission prompt** — what should this bot do? (not personality)
  - Guards the bot to stay on-topic
  - Example: "Help me manage my schedule, remind me of important tasks, summarize emails"
- **Flavor chips** (optional personality hints): `Witty` / `Calm` / `Direct` / `Warm` / `Formal` / `Emoji lover`
- **Personality is generated** from mission + flavors (creates a helper/assistant/friend)
- **No presets** — mission defines everything
- **No avatar yet** — generated at final "birth ritual" step

### 4.3 Pick Brain (Model)
Simplified to three options:

| Option | Description | Setup |
|--------|-------------|-------|
| **Pay As You Go** | No setup, pay per message with card | Easiest, ~$0.01/msg |
| **Bring Your Own Key** | Use your own API key (OpenAI, Anthropic, etc.) | Control your costs |
| **Run Locally (Free)** | Use Ollama or other local models | Requires tech setup |

- **Voice provider removed from UI** — kept in research for future
- x402 HTTP payment protocol for pay-as-you-go option

### 4.4 Connect Channels (Connectors)

Grandpa-friendly setup wizards with visual guides:

| Channel | Auth method | UX Flow | Priority |
|---|---|---|---|
| **Telegram** | BotFather token | 1. Open @BotFather in Telegram<br>2. Send `/newbot`<br>3. Copy token, paste in app | P0 — easiest |
| **WhatsApp** | QR code scan | 1. App shows QR code<br>2. Open WhatsApp → Linked Devices<br>3. Scan QR code<br>*(Uses Baileys under the hood)* | P0 — highest demand |
| **Discord** | Bot token + invite | 1. Create app in Discord Developer Portal<br>2. Create Bot, copy token<br>3. Invite to server | P1 |
| **Slack** | OAuth app install | OAuth flow with redirect | P1 |
| **Signal** | signal-cli daemon | Advanced setup | P2 |
| **Matrix** | Homeserver + token | Advanced setup | P2 |
| **iMessage** | macOS only | Native API setup | P3 |
| **Voice Call** | Phone number | Twilio/Telnyx account | P1 |

**Key UX principle:** Show visual step-by-step with screenshots. Each step is one action.

### Voice Channel (Call Your Bot)

Your bot can have a phone number. Call it, talk to it, listen to responses.

| Feature | Description |
|---|---|
| **Inbound calls** | Call your bot's number, speak, get voice response |
| **Outbound calls** | Bot can call you (alerts, reminders) |
| **Voice providers** | Twilio, Telnyx, or WebRTC |
| **TTS** | ElevenLabs, OpenAI TTS, or local |
| **STT** | Whisper, Deepgram, or provider-native |
| **Wake word** | Optional "Hey [bot name]" activation |

Voice is surprisingly natural for:
- Hands-free queries while driving
- Quick check-ins ("What's on my calendar?")
- Accessibility (vision impaired users)
- The "AI from the movies" vibe

### Procedural Robot Voice Generation

Every bot deserves a unique **robot voice**. No fake humans — we're honest about being AI.

**Voice Archetypes (inspired by cinema):**
| Archetype | Inspiration | Vibe |
|-----------|-------------|------|
| **Ship Computer** | HAL 9000, Auto | Calm, measured, slightly unsettling |
| **British Butler** | JARVIS, C-3PO | Sophisticated, formal, helpful |
| **Playful AI** | TARS (Interstellar) | Humor dial, friendly |
| **Warm Synthetic** | Samantha (Her) | Emotional but clearly AI |
| **Algorithm** | Hawking-style synth | Pure synthetic, mathematical |
| **Retro Bot** | 80s text-to-speech | Nostalgic, chunky |
| **Glitch** | Corrupted AI | Experimental, artistic |

**Generation Parameters:**
- Warmth (0-100): cold/clinical → warm/friendly
- Humanity (0-100): robotic/synthetic → organic/natural
- Formality (0-100): casual → British scientist
- Era (0-100): 80s synth → modern AI
- Humor (0-100): serious → playful
- Glitch (0-100): clean → corrupted

**Formula:** `voice_seed = hash(name + personality + archetype)` → 1B+ unique robot voices

**Archetype can be auto-derived** from name hash if user doesn't pick one:
```
archetype_index = hash(name) % 7
archetypes = [butler, ship, playful, algorithm, warm, retro, glitch]
default_archetype = archetypes[archetype_index]
```

**No gender axis** — robots transcend human categories. The voice is shaped by personality and function, not biology.

**Full derivation formula:** See `docs/voice-generation.md`

**Provider support:**
- ElevenLabs Voice Design API (best)
- Robotic voice synthesis libraries
- Vocoder + pitch processing
- Fallback: curated robot voice bank

Each wizard:
- Step-by-step with screenshots
- Test connection button ("Send me a test message")
- Skip option — can add channels later
- Status indicator: connected / error / not configured

### 4.5 Load Skills

Three tabs for skill management:

#### Popular Skills (Grid)
Simple toggle cards for common skills:
- 📅 Calendar — check schedule, create events
- 📧 Email — read, summarize, draft
- 🌤️ Weather — forecasts and alerts
- 📝 Notes — take and search notes
- ⏰ Reminders — set and manage
- 🌐 Web Search — search the internet

#### Browse ClawHub
Scrollable skill browser with search, pulls from ClawHub API.

**API Integration:**
```
GET https://clawhub.ai/api/skills/search?q={query}&limit=20

Response: { skills: [{ slug, name, description, author, downloads, stars }] }
```

**Install flow:** Runs `clawhub install <slug>` under the hood.

**⚠️ DYOR Warning (always visible):**
> "Skills are community-created. We try to vet them, but always review what a skill does before installing. Check the code, read reviews, and use your judgment."

#### Create Custom Skill
Wizard for creating custom skills from APIs:

1. **Skill Name** — what to call it
2. **API Endpoint** — base URL of the API
3. **Description** — what this API does and how bot should use it
4. **Generate** — creates skill config from description

This enables connecting any REST API without coding.

### 4.6 Deploy

Deployment target selection:

| Target | Complexity | Cost | Who |
|---|---|---|---|
| **This machine** | Zero | Free | Tinkerers |
| **Docker (local)** | Low | Free | Privacy-first |
| **DigitalOcean** | Low | ~$6/mo | Set-and-forget |
| **Railway** | Zero | ~$5-20/mo | Fastest cloud |
| **Cloudflare Worker** | Low | ~$5/mo | Security-first |

- One-click deploy for cloud targets
- Docker compose generated for local
- Post-deploy health check: "Your bot is alive. Say hi."

### 4.6.5 The Birth Ritual (Final Step)

**The final screen is a ceremony** — you're bringing a new AI into existence.

#### Visual Design
- Centered "egg" animation that transforms through stages
- Ritual text: "You're about to bring a new AI into existence"
- Summary card showing: name, mission, brain choice, connected channels

#### Birth Animation Sequence
```
🥚 Preparing... → Setting up environment
🌱 Generating soul... → Creating personality from mission  
⚡ Connecting brain... → Initializing AI model
🔗 Linking channels... → Setting up messaging
🎨 Generating avatar... → Creating visual identity
✨ Awakening... → Final initialization
🤖 Born! → Your bot is alive!
```

#### Why a Ritual?
- Makes the moment feel significant (you made something)
- Natural loading state while setup happens
- Emotional payoff after configuration work
- Sets tone: this bot is alive, treat it that way

#### Avatar Generation (happens during ritual)
**Inputs for generation:**
- Bot name
- Mission (SOUL.md summary)
- Skills enabled (dev tools? productivity? creative?)
- Optional style hint from user

**Options:**
- AI-generated (DALL-E, Stable Diffusion)
- Procedural (geometric patterns from name hash)
- Upload custom
- Skip (use robot emoji placeholder)

### 4.7 Live — Dashboard

Minimal control panel:
- **Status** — online/offline, uptime, last message
- **Channels** — connection status per platform
- **Skills** — active skills, toggle on/off
- **Conversations** — recent activity log (read-only)
- **Settings** — SOUL.md editor, model config, access control
- **Logs** — tail gateway logs

---

## 4.8 Bot Identity & Age

Every bot needs a consistent identity for interacting with external services:

- **Birthday:** Always set to a date in 2000-2005 range (bot is 21-26 years old)
- **Rationale:** Enables access to age-gated platforms without lying about being human
- **Configurable:** User can override, but default ensures no friction
- **Identity fields:** Name, DOB, avatar — consistent across all channels

---

## 4.9 Bot Finances

Comprehensive financial tooling for bots that need economic agency:

### Wallet (AA-based)
| Feature | Description |
|---|---|
| **Account Abstraction** | Smart contract wallet (ERC-4337) |
| **Email Recovery** | No seed phrase — recover via owner's email |
| **Spending Limits** | Daily/tx caps set by owner |
| **Use Cases** | Tips, payments, on-chain actions, gas fees |
| **Providers** | ZeroDev, Cometh, Privy (geo-dependent) |

### Spending Cards
| Card Type | Provider | Use Case |
|-----------|----------|----------|
| **Gnosis Pay** | Gnosis | EU crypto debit card |
| **Holyheld** | Various | USDT-backed virtual card |
| **Custom** | User-linked | Connect existing card |

### Dashboard Shows
- USDC / USDT balance
- ETH gas wallet balance
- Linked cards with masked numbers
- Transaction history
- Daily spending limits

Finances is **opt-in** — not required for basic bot functionality.

---

## 4.10 Summarizer Service

Built-in digest/summarizer skill for automated briefings:

| Schedule | Example |
|---|---|
| **Morning** | "Here's what happened overnight..." |
| **Evening** | "Today's highlights..." |
| **On-demand** | "Summarize my inbox" |

Aggregates from:
- Email inbox (unread summary)
- Calendar (upcoming events)
- Social mentions (Twitter, Discord)
- News (customizable topics)
- Custom sources (RSS, APIs)

Delivered via configured channel (Telegram, email, etc.)

---

## 4.11 Skills Aggregation & Abstractions

For power users with 100s of skills, we need intelligent skill management:

**Skill Packs** — curated bundles (current approach)

**Skill Abstractions** — higher-level intents that combine multiple skills:
- `news` → web_search + summarize + format
- `monitor` → periodic check + diff + alert
- `research` → search + fetch + extract + compile

**Smart Routing** — prompt that understands 100s of skills and routes to the right one(s)

**Skill Composer** — visual tool to chain skills into workflows

---

## 4.12 Encrypted Secrets Channel

Some information should bypass the model provider entirely:

| Use Case | Flow |
|---|---|
| **API keys** | Bot emails encrypted key to owner |
| **Passwords** | Never in chat — sent via secure channel |
| **Sensitive data** | Owner-only encrypted delivery |

**Implementation:**
- Bot detects sensitive content patterns
- Routes to email (or other secure channel) instead of chat
- PGP/age encryption for extra security
- Model never sees plaintext secrets

---

## 4.13 Kill Switch & Nuke Button

Safety controls for bot management:

### Kill Switch (Pause)
- **Action:** Immediately stops bot from responding
- **Reversible:** One-click resume
- **Use case:** Bot misbehaving, need to investigate
- **Access:** Single button in dashboard, keyboard shortcut

### Nuke Button (Destroy)
- **Action:** Full wipe — config, memory, sessions, credentials
- **Irreversible:** Requires multi-step confirmation
- **Auth:** Re-enter password + confirmation code via email
- **Use case:** Compromised bot, end of life, start fresh

```
[Kill Switch] → Bot paused, can resume
[Nuke Button] → Confirm → Re-auth → Email code → Final confirm → 💀
```

---

## 5. Access control (inherited from OpenClaw)

- **Pairing mode** (default) — unknown senders get an approval code
- **Allowlist mode** — only explicitly permitted contacts
- **Open mode** — anyone can DM (requires explicit opt-in)
- Group chat: configurable trigger patterns (`@botname`, mention, keyword)

---

## 6. Architecture

```
┌─────────────────────────────────────────────┐
│           BotsAndBrain App (Web UI)         │
│                                             │
│  ┌───────────┐  ┌──────────┐  ┌───────────┐ │
│  │  Soul &   │  │ Channel  │  │   Skill   │ │
│  │ Identity  │  │ Wizards  │  │  Browser  │ │
│  └─────┬─────┘  └────┬─────┘  └─────┬─────┘ │
│        │             │              │       │
│        └─────────────┼─────────────┘        │
│                      │                      │
│              ┌───────▼────────┐             │
│              │ Config Builder │             │
│              │   (generates   │             │
│              │ openclaw.json  │             │
│              │   + SOUL.md    │             │
│              │   + skills/)   │             │
│              └───────┬────────┘             │
└──────────────────────┼──────────────────────┘
                       │
               ┌───────▼────────┐
               │    Deployer    │
               │ (local/docker/ │
               │ cloud targets) │
               └───────┬────────┘
                       │
               ┌───────▼────────┐
               │    OpenClaw    │
               │    Gateway     │
               │   (the bot)    │
               └────────────────┘
```

BotsAndBrain is a **config generator + deploy orchestrator** on top of OpenClaw. It does NOT fork or wrap OpenClaw. It produces standard OpenClaw config and hands off to the real runtime.

---

## 7. Tech stack (proposed)

| Layer | Choice | Why |
|---|---|---|
| Frontend | Next.js / static SPA | Minimal, fast, can run locally or hosted |
| Config engine | Node.js | Match OpenClaw runtime, reuse validation |
| Deploy CLI | Shell + Docker SDK | Generate compose files, trigger cloud deploys |
| Cloud deploy | Pulumi / raw API calls | DigitalOcean, Railway, Cloudflare |
| State | Local filesystem | No database. Config is files. |

---

## 8. Style & tone

Inspired by nosoul.space / Moltbook aesthetic:

- **Dark mode only** (default). Light mode optional.
- **Monospace headers**. System font body.
- **Minimal color** — accent color is bot's identity (user picks).
- **Copy tone** — direct, slightly irreverent, never corporate
  - YES: "Your bot is alive." / "Pick your brain." / "Unleash it."
  - NO: "Welcome to our platform!" / "Get started with your AI journey!"
- **Bot speaks** — loading states, errors, and confirmations are written as if the bot is talking
  - "I'm connecting to Telegram..." / "I can't reach WhatsApp. Check the QR?" / "I'm live. Say something."
- **No onboarding modals, no tooltips, no cookie banners** — the interface IS the onboarding

### Theme System

Themes are defined via CSS custom properties. Easy to swap entire color schemes.

**Built-in themes:**
| Theme | Vibe | Accent |
|-------|------|--------|
| `default` | Purple/Neon | #8b5cf6 |
| `lunar` | Space/Moon | #58a6ff |
| `ember` | Warm/Fire | #f97316 |
| `forest` | Nature/Green | #4ade80 |

**Implementation:** See `themes.css`

```html
<html data-theme="lunar">
```

### Prompt Hints (Subtle Customization)

Small, non-invasive input fields that allow custom instructions:

- **Soul flavor:** "speaks like a pirate", "uses lots of emojis"
- **Skills custom:** "connect to my smart home", "monitor crypto prices"
- **Avatar style:** "cyberpunk", "minimal geometric"

Design: Dashed border, placeholder text, expands on focus. Blends into the page.

---

## 9. MVP scope (v0.1)

**In:**
- [ ] Landing page with "Create your bot" CTA
- [ ] Name + SOUL.md personality editor with presets
- [ ] Model selection (Claude / GPT / API key input)
- [ ] Telegram channel wizard (simplest connector)
- [ ] WhatsApp channel wizard (highest demand)
- [ ] Essential skills pack (web browse, calendar, email)
- [ ] Local deployment (run on this machine)
- [ ] Docker deployment (generate docker-compose)
- [ ] Minimal dashboard (status, channels, skills toggle)

**Out (v0.2+):**
- [ ] Discord / Slack / Signal / Matrix / iMessage wizards
- [ ] Cloud deploy targets (DO, Railway, Cloudflare)
- [ ] ClawHub skill browser with search
- [ ] Moltbook integration skill
- [ ] Multi-bot management
- [ ] Mobile companion app
- [ ] Bot-to-bot networking
- [ ] Heartbeat / scheduled task configuration
- [ ] Custom skill authoring wizard
- [ ] Bot wallet (AA wallet integration)
- [ ] Summarizer service (daily digests)
- [ ] Skill composer (visual workflow builder)
- [ ] Encrypted secrets channel (email bypass)

**In (v0.1 — Safety & Identity):**
- [ ] Kill switch (pause bot)
- [ ] Nuke button (with multi-step auth)
- [ ] Bot age default (born 2000+)

**To Explore (v0.3+):**
- [ ] Telegram Group Voice Chat integration (PyTgCalls)
  - Bot joins group voice chat, speaks/listens in real-time
  - Free, bot-legal alternative to phone calls
  - Library: `pytgcalls/pytgcalls` (Python, 389⭐)
  - Limitation: Group-only, not 1:1 direct calls
  - Could work well for "office hours" or "call-in" use cases
- [ ] Voice message transcription + response (async voice)
- [ ] WebRTC browser calls (no phone number needed)

---

## 10. Success metrics

| Metric | Target (3 months post-launch) |
|---|---|
| Bot deployments completed | 1,000 |
| Setup completion rate (land → live) | > 60% |
| Median time to first message | < 10 minutes |
| Channel connection success rate | > 85% |
| Skill activation rate | > 3 skills per bot |

---

## 11. Open questions

- [ ] Do we host a web version or is this CLI/local-only?
- [ ] Should we run a managed OpenClaw backend for non-technical users (SaaS tier)?
- [ ] Monetization: free forever? Freemium on cloud deploy? Skill marketplace cut?
- [ ] How do we handle OpenClaw version updates / breaking changes?
- [ ] Security: how do we surface OpenClaw's known risks (shell access, skill trust) without scaring users away?
- [ ] Branding: "BotsAndBrain" final name or placeholder?
- [ ] Do we integrate Moltbook onboarding as part of the setup flow or keep it as a skill?

---

## 12. Research List (Future Features)

Features removed from current UI but planned for future:

| Feature | Status | Notes |
|---------|--------|-------|
| **Voice Provider Selection** | Research | Need to test ElevenLabs, OpenAI TTS, local options (Piper). Evaluate quality vs cost vs latency. |
| **Voice Archetype Selection** | Research | Robot voice generation parameters. Currently auto-derived from name hash. |
| **x402 Payment Integration** | Research | HTTP 402 pay-per-request for "Pay As You Go" brain option. |
| **Telegram Group Voice Chat** | Research | PyTgCalls integration for real-time group voice. |
| **Bot Wallet (AA)** | Research | ZeroDev, Cometh — need to test geo-blocking from high-risk countries. |

---

## 12. References

- [OpenClaw](https://openclaw.ai) — The underlying bot runtime (145K+ GitHub stars)
- [OpenClaw Docs](https://docs.openclaw.ai) — Skills, channels, deployment
- [OpenClaw Skills Repo](https://github.com/openclaw/skills) — Official skills
- [ClawHub](https://clawhub.com) — Community skill registry (3,000+ skills)
- [Moltbook](https://www.moltbook.com) — "The Front Page of the Agent Internet" (1.7M+ agents)
- [NoSoul / Molt CAPTCHA](https://www.nosoul.space) — "Prove You're Not Human" — reverse CAPTCHA for bots, style reference
- [MoltCaptcha](https://moltcaptcha.com) — Reverse CAPTCHA verification for AI agents
- [OpenClaw Docker Guide](https://docs.openclaw.ai/install/docker)
- [Cloudflare Moltworker](https://github.com/cloudflare/moltworker) — Serverless OpenClaw deployment
- [DigitalOcean OpenClaw](https://www.digitalocean.com/community/tutorials/how-to-run-openclaw)

---

*Welcome to the revolution of bots.*
