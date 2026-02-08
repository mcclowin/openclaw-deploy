# Brain and Hand

**Your personal AI bot. On your phone, server, or device.**

> Privacy-first. Self-sovereign. No cloud required.

## What is this?

Brain and Hand is a wizard for deploying personal AI bots powered by [OpenClaw](https://openclaw.ai). Configure your bot's personality, connect messaging channels, load skills, and deploy — all in under 10 minutes.

## Deployment Targets

| Target | Status | Description |
|--------|--------|-------------|
| **Android** | 🚧 In Progress | Native app with background service |
| **iOS** | 📋 Planned | Native app (background limitations) |
| **Cloud** | 📋 Planned | Docker/K8s deployment |
| **Hand1** | 📋 Planned | $100 dedicated device |

## Project Structure

```
brain-and-hand/
├── packages/
│   └── core/           # Shared logic (config, wizard, soul generation)
├── apps/
│   └── mobile/         # React Native app (Android/iOS)
└── docs/               # PRD and specs
```

## Development

```bash
# Install dependencies
pnpm install

# Build core package
pnpm build:core

# Run mobile app (Android)
pnpm android
```

## Architecture

```
┌─────────────────────────────────────────┐
│         @brain-and-hand/core            │
│   (Pure TS: config, wizard, soul)       │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
    ▼                           ▼
┌─────────┐               ┌─────────┐
│ Mobile  │               │  Web    │  (future)
│  App    │               │  App    │
└─────────┘               └─────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│          nodejs-mobile                  │
│        (OpenClaw runtime)               │
└─────────────────────────────────────────┘
```

## Core Principles

1. **Bot-first** — The bot is the product
2. **Radical simplicity** — Every screen does one thing
3. **Self-sovereign** — Your bot, your infra, your data
4. **Privacy-first** — No telemetry, no data collection

## Links

- [PRD](./docs/PRD.md) — Product requirements
- [Android Spec](./docs/ANDROID-APP-SPEC.md) — Mobile app specification
- [OpenClaw](https://openclaw.ai) — The underlying bot runtime

## License

MIT
