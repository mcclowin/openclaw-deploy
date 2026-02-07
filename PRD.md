# Brain and Bot - Product Requirements Document

## Overview

**Brain and Bot** is a grandpa-friendly web app that lets anyone create their own personal AI assistant in minutes. No coding, no server setup, no technical knowledge required.

## Vision

"Everyone deserves a personal AI assistant. Brain and Bot makes it possible in 60 seconds."

## Problem Statement

Current AI assistant solutions require:
- Technical knowledge (API keys, hosting, configuration)
- Expensive subscriptions
- Complex setup processes

Most people are excluded from the AI assistant revolution because the barrier to entry is too high.

## Solution

A simple 6-step wizard that creates a fully functional AI assistant:

1. **Name & Avatar** - Personalize your bot
2. **Personality & Mission** - Define how it behaves
3. **Channel** - Choose where to chat (Telegram, WhatsApp, iMessage)
4. **Connections** - Link accounts (email, GitHub, Notion, etc.)
5. **Skills** - Enable capabilities (weather, news, smart home, etc.)
6. **Done** - Start chatting immediately

## Target Users

### Primary: Non-technical users
- Age 40+
- Comfortable with smartphones but not coding
- Want AI help but intimidated by setup
- "My grandpa could use this"

### Secondary: Power users who want quick setup
- Developers who want a personal assistant without the hassle
- Small business owners
- Content creators

## Core Features

### Must Have (MVP)
- [ ] 6-step wizard flow
- [ ] Name and avatar selection
- [ ] Personality presets (Friendly, Professional, Witty, Concise)
- [ ] Mission/purpose text input
- [ ] Channel selection (Telegram first)
- [ ] Automatic deployment (user doesn't see hosting)
- [ ] Success screen with direct link to start chatting

### Should Have (v1.1)
- [ ] WhatsApp channel support
- [ ] iMessage channel support
- [ ] Email connection setup
- [ ] GitHub connection setup
- [ ] Skills marketplace preview
- [ ] Progress saving (resume later)

### Could Have (v1.2)
- [ ] Custom avatar upload
- [ ] Voice personality preview
- [ ] Smart home integrations
- [ ] Multiple bots per account
- [ ] Bot sharing/templates

### Won't Have (for now)
- Self-hosting option (defeats simplicity goal)
- Advanced configuration
- White-label/enterprise features

## Technical Architecture

### Frontend
- Static HTML/CSS/JS (hosted on GitHub Pages for now)
- No framework needed - keep it simple
- Mobile-first responsive design

### Backend (to build)
- API endpoint to receive wizard data
- Provisions OpenClaw instance
- Manages Telegram bot creation
- Returns bot handle to user

### Hosting Infrastructure
- Fly.io or Railway for OpenClaw instances
- Automated provisioning via API
- Cost: ~$5/user/month (absorbed or passed through)

## Design Principles

1. **One thing at a time** - Never overwhelm with options
2. **Large touch targets** - 48px minimum for buttons
3. **Clear language** - No jargon, no technical terms
4. **Visual feedback** - Always show progress and state
5. **Skippable options** - Advanced features are optional
6. **Light mode default** - Easier on older eyes

## Success Metrics

- Time to complete wizard: < 3 minutes
- Completion rate: > 70%
- Day 1 retention (sent message to bot): > 50%
- NPS score: > 40

## Competitive Landscape

| Product | Pros | Cons |
|---------|------|------|
| ChatGPT | Known brand | No personal assistant, subscription |
| Replika | Easy setup | Limited capabilities |
| Custom GPTs | Powerful | Requires ChatGPT Plus, complex |
| Brain and Bot | Simple, integrated, your own | New, unproven |

## Roadmap

### Phase 1: Frontend Prototype (DONE)
- [x] Wizard UI
- [x] Avatar picker
- [x] Personality selection
- [x] Channel selection
- [x] Connections page
- [x] Skills page
- [x] Success state

### Phase 2: Backend MVP
- [ ] API design
- [ ] Telegram bot provisioning
- [ ] OpenClaw instance deployment
- [ ] User authentication (simple)

### Phase 3: Launch
- [ ] Landing page
- [ ] Pricing page (if not free)
- [ ] Documentation
- [ ] Support channel

## Open Questions

1. **Pricing model**: Free tier? Subscription? One-time?
2. **User accounts**: Email-based? Social login? None?
3. **Bot limits**: How many per user?
4. **Skill costs**: Pass through API costs or bundle?

## Team

- **Product/Design**: Mohammed (Boss)
- **Development**: McClowin (AI Agent)

---

*Last updated: 2026-02-07*
