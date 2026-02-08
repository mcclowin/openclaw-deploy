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

### 4.2 Name & Soul
- Bot name (used across all channels)
- SOUL.md editor — personality prompt
- Presets: `chill philosopher` / `sharp assistant` / `chaos agent` / `custom`
- Live preview: show sample bot response for each personality
- Avatar upload or generate

### 4.3 Pick Model
- Select LLM provider + model
- Claude (recommended) / GPT / DeepSeek / Ollama (local)
- API key input with validation
- Cost estimator: "~$X/month at casual usage"

### 4.4 Connect Channels (Connectors)

Guided per-channel setup wizards:

| Channel | Auth method | Priority |
|---|---|---|
| **Telegram** | BotFather token | P0 — easiest onramp |
| **WhatsApp** | QR code scan (Baileys) | P0 — highest demand |
| **Discord** | Bot token + server invite | P1 |
| **Slack** | OAuth app install | P1 |
| **Signal** | signal-cli daemon | P2 |
| **Matrix** | Homeserver + token | P2 |
| **iMessage** | macOS only, native API | P3 |

Each wizard:
- Step-by-step with screenshots
- Test connection button ("Send me a test message")
- Skip option — can add channels later
- Status indicator: connected / error / not configured

### 4.5 Load Skills

- **Curated skill packs** (one-click bundles):
  - `Essentials` — web browse, file read, calendar, email
  - `Productivity` — todo, notes, reminders, scheduling
  - `Social` — Moltbook posting, social monitoring
  - `Dev Tools` — git, shell, code review
  - `Custom` — browse ClawHub registry

- Per-skill config:
  - Required API keys / env vars (prompted inline)
  - Permission scope explanation (what this skill can access)
  - Enable/disable toggle

- **ClawHub integration** — search and install community skills directly

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

### 4.7 Live — Dashboard

Minimal control panel:
- **Status** — online/offline, uptime, last message
- **Channels** — connection status per platform
- **Skills** — active skills, toggle on/off
- **Conversations** — recent activity log (read-only)
- **Settings** — SOUL.md editor, model config, access control
- **Logs** — tail gateway logs

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
