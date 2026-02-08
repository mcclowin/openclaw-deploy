# Brain and Hand: Implementation Plan

**Last Updated:** 2026-02-08
**Status:** Phase 0 - Setup

---

## Build Environment

| Environment | Role | Status |
|-------------|------|--------|
| **rock-5a (arm64)** | Code editing, git operations | ✅ Ready |
| **GitHub Actions** | Build APKs (x86_64 required) | ✅ Workflow created |
| **Local laptop** | Fallback for debugging | 📋 Standby |

**Why this setup:** Android SDK only provides x86_64 binaries. rock-5a is arm64.

---

## Phase 0: Hello World

**Goal:** APK on your phone that shows welcome screen

| # | Task | Status | Notes |
|---|------|--------|-------|
| 1 | ~~Create repo structure~~ | ✅ Done | packages/core, apps/mobile |
| 2 | ~~Add GitHub Actions workflow~~ | ✅ Done | .github/workflows/build-android.yml |
| 3 | Init React Native project properly | 🔲 TODO | Need RN boilerplate files |
| 4 | Push to GitHub | 🔲 TODO | mcclowin/brain-and-hand |
| 5 | First CI build | 🔲 TODO | Verify workflow runs |
| 6 | Download APK, install on phone | 🔲 TODO | Test on real device |

### Step 3 Details: React Native Init

We have our custom code but need the React Native boilerplate. Options:

**Option A: Generate on laptop, push**
```bash
# On laptop with Node.js
npx react-native init BrainAndHand --template react-native-template-typescript
# Copy in our code
# Push to GitHub
```

**Option B: Use a starter template**
- Fork a minimal RN template repo
- Add our code on top

**Option C: Manual boilerplate**
- Create android/ folder structure manually
- Add gradle files, AndroidManifest.xml
- More control, more work

**Recommended:** Option A - cleanest path

---

## Phase 1: Brain Alive

**Goal:** Node.js running inside the app

| # | Task | Status | Notes |
|---|------|--------|-------|
| 7 | Install nodejs-mobile-react-native | 🔲 TODO | Bridge package |
| 8 | Create minimal Node.js "hello" script | 🔲 TODO | nodejs-assets/main.js |
| 9 | Bridge working: RN ↔ Node.js | 🔲 TODO | Verify communication |
| 10 | Bundle OpenClaw gateway | 🔲 TODO | Minimal viable bundle |
| 11 | Gateway boots inside app | 🔲 TODO | See logs in app |

---

## Phase 2: First Message

**Goal:** Bot responds on Telegram

| # | Task | Status | Notes |
|---|------|--------|-------|
| 12 | Wire up Telegram token input | 🔲 TODO | Wizard step |
| 13 | Pass config to OpenClaw | 🔲 TODO | Generate openclaw.json |
| 14 | Save config to storage | 🔲 TODO | AsyncStorage |
| 15 | Gateway connects to Telegram | 🔲 TODO | Bot online |
| 16 | Send message → get response | 🔲 TODO | 🎉 Works! |

---

## Phase 3: Background Life

**Goal:** Bot runs when app closed

| # | Task | Status | Notes |
|---|------|--------|-------|
| 17 | Android foreground service | 🔲 TODO | Native module |
| 18 | Move Node.js to service | 🔲 TODO | Survives app close |
| 19 | Persistent notification | 🔲 TODO | "Bot running" |
| 20 | Test background operation | 🔲 TODO | Close app, send msg |
| 21 | Kill switch in notification | 🔲 TODO | Pause action |

---

## Immediate Next Steps

### Right Now:
1. **You (Boss):** Init React Native on your laptop
   ```bash
   npx react-native init BrainAndHand --template react-native-template-typescript
   cd BrainAndHand
   # Test it builds
   npx react-native run-android
   ```

2. **Me:** Prepare the code to merge in once RN is initialized

### After RN Init:
1. Copy our packages/core into the project
2. Copy our screens into src/
3. Push to GitHub (new repo or existing brain-and-bot)
4. Watch GitHub Actions build
5. Download APK, install, celebrate

---

## Repository Decision

**Option A: New repo `brain-and-hand`**
- Clean start
- Separate from current prototype

**Option B: Rename `openclaw-deploy` → `brain-and-hand`**
- Keep history
- Already has GitHub Pages for web prototype

**Recommendation:** New repo. Keep web prototype separate for now.

---

## Files Ready

| File | Location | Status |
|------|----------|--------|
| Core logic | packages/core/src/*.ts | ✅ Ready |
| Welcome screen | apps/mobile/src/screens/WelcomeScreen.tsx | ✅ Ready |
| Wizard screen | apps/mobile/src/screens/WizardScreen.tsx | ✅ Ready |
| Home screen | apps/mobile/src/screens/HomeScreen.tsx | ✅ Ready |
| Runtime bridge | apps/mobile/src/runtime/index.ts | ✅ Interface ready |
| GitHub Actions | .github/workflows/build-android.yml | ✅ Ready |

---

## When to Switch to Local Laptop

Switch from GitHub Actions to local development if:
- [ ] More than 3 failed CI builds in a row
- [ ] Need to debug native Android code
- [ ] Need USB debugging / hot reload
- [ ] Build times too slow (>10 min)

Local setup requires:
- Android Studio (or just SDK command line tools)
- JDK 17
- USB cable + Android phone in dev mode
