# Brain and Hand: Android App Specification

**Version:** 0.1 (Draft)
**Date:** 2026-02-08
**Status:** Proposal

---

## 1. Executive Summary

A native Android application that runs OpenClaw directly on the user's phone. No server required. The bot lives in your pocket, runs in the background, and responds to messages even when the app is closed.

**Core principle:** Your bot, your phone, your data. Zero infrastructure.

---

## 2. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Brain and Hand APK                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    UI Layer (React Native)                 │ │
│  │                                                            │ │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────┐ │ │
│  │  │   Onboard  │ │    Chat    │ │  Channels  │ │ Settings│ │ │
│  │  │   Wizard   │ │    View    │ │   Status   │ │         │ │ │
│  │  └────────────┘ └────────────┘ └────────────┘ └─────────┘ │ │
│  │                                                            │ │
│  └────────────────────────────┬──────────────────────────────┘ │
│                               │                                 │
│                               │ React Native Bridge             │
│                               ▼                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                  nodejs-mobile Runtime                     │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │                    OpenClaw Core                      │ │ │
│  │  │                                                       │ │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │ │ │
│  │  │  │   Gateway   │  │   Channels  │  │    Skills    │  │ │ │
│  │  │  │   Engine    │  │   Manager   │  │    Loader    │  │ │ │
│  │  │  └─────────────┘  └─────────────┘  └──────────────┘  │ │ │
│  │  │                                                       │ │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │ │ │
│  │  │  │   Memory    │  │     LLM     │  │    Cron      │  │ │ │
│  │  │  │   Store     │  │   Router    │  │   Scheduler  │  │ │ │
│  │  │  └─────────────┘  └─────────────┘  └──────────────┘  │ │ │
│  │  │                                                       │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                               │                                 │
│                               ▼                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Android Foreground Service                    │ │
│  │                                                            │ │
│  │  - Keeps Node.js alive when app backgrounded              │ │
│  │  - Shows persistent notification                          │ │
│  │  - Handles boot auto-start                                │ │
│  │  - Manages wake locks for network                         │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │        External Services       │
              │                                │
              │  ┌──────────┐  ┌────────────┐ │
              │  │ Telegram │  │  Anthropic │ │
              │  │   API    │  │  /OpenAI   │ │
              │  └──────────┘  └────────────┘ │
              │                                │
              │  ┌──────────┐  ┌────────────┐ │
              │  │ WhatsApp │  │   x402     │ │
              │  │ (Baileys)│  │  Gateway   │ │
              │  └──────────┘  └────────────┘ │
              │                                │
              └────────────────────────────────┘
```

---

## 3. Technology Stack

### 3.1 Core Technologies

| Layer | Technology | Rationale |
|-------|------------|-----------|
| **UI Framework** | React Native | Cross-platform, large ecosystem, hot reload |
| **Node Runtime** | nodejs-mobile | Embeds V8 + Node.js in mobile apps |
| **State Management** | Zustand | Lightweight, works well with RN |
| **Navigation** | React Navigation | Standard for RN apps |
| **Styling** | NativeWind (Tailwind) | Consistent with web version |
| **Storage** | AsyncStorage + SQLite | Persistent bot memory |
| **Background** | Android Foreground Service | Keep bot alive |

### 3.2 Key Dependencies

```json
{
  "dependencies": {
    "react-native": "^0.73.x",
    "nodejs-mobile-react-native": "^0.9.x",
    "react-navigation": "^6.x",
    "zustand": "^4.x",
    "nativewind": "^4.x",
    "@notifee/react-native": "^7.x",
    "react-native-background-fetch": "^4.x"
  }
}
```

### 3.3 OpenClaw Modifications

OpenClaw core needs minimal changes to run inside nodejs-mobile:

| Component | Change Required |
|-----------|-----------------|
| Gateway | None - pure Node.js |
| Channels | None - HTTP/WebSocket work |
| Skills | None - JS execution works |
| Memory | Swap filesystem for SQLite |
| Config | Read from app's data directory |
| Exec tool | Disable or sandbox |

---

## 4. User Interface Specification

### 4.1 Screen Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         App Screens                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  First Launch:                                                  │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐    │
│  │  Splash  │──▶│  Welcome │──▶│  Setup   │──▶│   Home   │    │
│  │          │   │          │   │  Wizard  │   │          │    │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘    │
│                                                                 │
│  Main App:                                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                      Bottom Tabs                          │  │
│  │                                                           │  │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐     │  │
│  │  │  Home   │  │  Chat   │  │ Channels│  │Settings │     │  │
│  │  │         │  │         │  │         │  │         │     │  │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘     │  │
│  │                                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Screen Specifications

#### 4.2.1 Splash Screen
- App logo animation
- Check if bot already configured
- Route to Welcome (first run) or Home (returning)

#### 4.2.2 Welcome Screen
- Hero: "Your AI assistant lives here"
- Bot-first messaging: "I'm about to be born"
- Single CTA: "Create Your Bot"

#### 4.2.3 Setup Wizard
Multi-step form matching web PRD:

```
Step 1: Identity
├── Bot name (required)
├── Mission prompt (what should I do?)
└── Flavor chips (optional personality hints)

Step 2: Brain
├── Pay As You Go (x402) [Recommended]
├── Bring Your Own Key
│   ├── Provider: Anthropic / OpenAI / Other
│   └── API Key input
└── Local (Ollama) [Advanced]

Step 3: Channels
├── Telegram (recommended first)
│   └── Token from BotFather
├── WhatsApp
│   └── QR code scan
└── Skip (add later)

Step 4: Birth Ritual
├── Summary of choices
├── "Spawn" button
├── Birth animation
└── Success → Home
```

#### 4.2.4 Home Screen
```
┌─────────────────────────────────────┐
│  ┌─────────────────────────────┐   │
│  │      Bot Avatar + Name      │   │
│  │         "Jarvis"            │   │
│  │                             │   │
│  │    ● Online (Telegram)      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │        Quick Stats          │   │
│  │  Messages today: 42         │   │
│  │  Uptime: 3h 24m             │   │
│  │  Cost today: $0.12          │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      Channel Status         │   │
│  │  ✓ Telegram  ● Connected    │   │
│  │  ○ WhatsApp  ○ Not setup    │   │
│  │  ○ Discord   ○ Not setup    │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │      [  Kill Switch  ]      │   │
│  │       Pause your bot        │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

#### 4.2.5 Chat Screen
Direct chat with your bot (local, doesn't go through Telegram):

```
┌─────────────────────────────────────┐
│  ← Chat with Jarvis                 │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  You: What's on my calendar │   │
│  │       today?                │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🤖 Jarvis:                 │   │
│  │  You have 3 events:         │   │
│  │  • 10am Team standup        │   │
│  │  • 2pm Client call          │   │
│  │  • 5pm Gym                  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ...                                │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │  Type a message...      [→] │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

#### 4.2.6 Channels Screen
Manage connected channels:

```
┌─────────────────────────────────────┐
│  Channels                           │
├─────────────────────────────────────┤
│                                     │
│  ┌─────────────────────────────┐   │
│  │  📱 Telegram        [Edit]  │   │
│  │  @jarvis_bot                │   │
│  │  ● Connected • 127 messages │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  💬 WhatsApp       [Setup]  │   │
│  │  Not connected              │   │
│  │  Tap to scan QR code        │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  🎮 Discord        [Setup]  │   │
│  │  Not connected              │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  + Add Channel              │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

#### 4.2.7 Settings Screen
```
┌─────────────────────────────────────┐
│  Settings                           │
├─────────────────────────────────────┤
│                                     │
│  Identity                           │
│  ├── Name: Jarvis                   │
│  ├── Birthday: March 15, 2003       │
│  └── Voice: British Butler          │
│                                     │
│  Soul                               │
│  ├── Mission: [Edit]                │
│  └── Personality: [Edit]            │
│                                     │
│  Brain                              │
│  ├── Provider: Anthropic            │
│  ├── Model: claude-sonnet-4-...     │
│  └── API Key: ••••••••sk-abc        │
│                                     │
│  Background                         │
│  ├── Run on startup: [Toggle]       │
│  ├── Battery optimization: [?]      │
│  └── Notification: [Toggle]         │
│                                     │
│  Danger Zone                        │
│  ├── Export Data                    │
│  ├── Kill Switch (Pause)            │
│  └── Nuke Button (Delete All)       │
│                                     │
└─────────────────────────────────────┘
```

---

## 5. Background Service Specification

### 5.1 Foreground Service

Android requires a visible notification for long-running background tasks.

```kotlin
// Pseudo-code for Android Foreground Service
class OpenClawService : Service() {
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        // Create persistent notification
        val notification = createNotification(
            title = "Jarvis is running",
            text = "Listening on Telegram",
            icon = R.drawable.ic_bot
        )
        
        // Start as foreground service
        startForeground(NOTIFICATION_ID, notification)
        
        // Start Node.js runtime
        NodeJS.start("openclaw-gateway.js")
        
        return START_STICKY // Restart if killed
    }
}
```

### 5.2 Notification Design

```
┌─────────────────────────────────────────────┐
│ 🤖 Jarvis is running                        │
│ Listening on Telegram • 42 messages today   │
│                                             │
│ [Pause]                              [Open] │
└─────────────────────────────────────────────┘
```

### 5.3 Boot Auto-Start

```xml
<!-- AndroidManifest.xml -->
<receiver android:name=".BootReceiver">
    <intent-filter>
        <action android:name="android.intent.action.BOOT_COMPLETED" />
    </intent-filter>
</receiver>
```

### 5.4 Battery Optimization

Users must disable battery optimization for reliable background operation:

```
Settings → Apps → Brain and Hand → Battery → Unrestricted
```

The app should:
1. Detect if optimization is enabled
2. Show prompt to disable
3. Provide one-tap navigation to settings

---

## 6. Data Storage

### 6.1 Directory Structure

```
/data/data/com.brainandhand.app/
├── files/
│   ├── nodejs-project/          # Node.js bundle
│   │   └── openclaw/
│   │       ├── gateway.js
│   │       └── node_modules/
│   ├── bot-data/                # Bot's workspace
│   │   ├── openclaw.json        # Config
│   │   ├── SOUL.md
│   │   ├── MEMORY.md
│   │   └── memory/
│   │       └── 2026-02-08.md
│   └── skills/                  # Installed skills
│       ├── weather/
│       └── calendar/
├── databases/
│   └── openclaw.db              # SQLite for structured data
└── shared_prefs/
    └── settings.xml             # App preferences
```

### 6.2 Config File (openclaw.json)

```json
{
  "model": {
    "provider": "anthropic",
    "model": "claude-sonnet-4-20250514",
    "apiKey": "ENCRYPTED:..."
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "token": "ENCRYPTED:..."
    }
  },
  "soul": {
    "name": "Jarvis",
    "mission": "Help me manage my schedule and tasks"
  },
  "background": {
    "autoStart": true,
    "keepAlive": true
  }
}
```

### 6.3 Encryption

Sensitive data (API keys, tokens) encrypted at rest using Android Keystore:

```javascript
// Encrypt before storing
const encrypted = await AndroidKeystore.encrypt(apiKey);
config.model.apiKey = `ENCRYPTED:${encrypted}`;

// Decrypt when needed
const decrypted = await AndroidKeystore.decrypt(encrypted);
```

---

## 7. Communication Bridge

### 7.1 React Native ↔ Node.js

```
┌─────────────────────────────────────────────────────────────┐
│                    Bridge Architecture                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   React Native (UI)              Node.js (OpenClaw)         │
│        │                              │                     │
│        │    nodejs.channel.send()     │                     │
│        │─────────────────────────────▶│                     │
│        │                              │                     │
│        │    nodejs.channel.on()       │                     │
│        │◀─────────────────────────────│                     │
│        │                              │                     │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Message Protocol

```typescript
// UI → Node.js
interface UIToNodeMessage {
  type: 'start' | 'stop' | 'chat' | 'config' | 'status';
  payload: any;
  requestId: string;
}

// Node.js → UI
interface NodeToUIMessage {
  type: 'status' | 'message' | 'error' | 'log' | 'response';
  payload: any;
  requestId?: string;
}
```

### 7.3 Example: Chat Message

```javascript
// React Native side
const sendChat = async (text: string) => {
  const requestId = uuid();
  
  nodejs.channel.send({
    type: 'chat',
    payload: { text },
    requestId
  });
  
  return new Promise((resolve) => {
    nodejs.channel.once(`response:${requestId}`, resolve);
  });
};

// Node.js side (inside OpenClaw)
channel.on('message', async (msg) => {
  if (msg.type === 'chat') {
    const response = await openclaw.chat(msg.payload.text);
    channel.send({
      type: 'response',
      payload: response,
      requestId: msg.requestId
    });
  }
});
```

---

## 8. Security Considerations

### 8.1 Threat Model

| Threat | Mitigation |
|--------|------------|
| API key theft | Android Keystore encryption |
| Man-in-the-middle | TLS for all network calls |
| Malicious skills | Skill sandboxing, no exec tool |
| Physical device access | Optional app lock (PIN/biometric) |
| Data exfiltration | No analytics, no telemetry |

### 8.2 Disabled Features

These OpenClaw features are disabled in mobile:

| Feature | Reason | Alternative |
|---------|--------|-------------|
| `exec` tool | Security risk | None (mobile is sandboxed) |
| `browser` tool | Resource heavy | Limited web_fetch |
| Shell access | No terminal | None |
| File system | Sandboxed | App data directory only |

### 8.3 Skill Sandboxing

Skills run in restricted context:
- No filesystem access outside app directory
- No native module loading
- Network calls go through proxy for logging
- Resource limits (CPU, memory, timeout)

---

## 9. Build & Distribution

### 9.1 Build Environment

**Constraint:** Android SDK only provides x86_64 Linux binaries. Our dev server (rock-5a) is arm64.

**Primary Strategy:** GitHub Actions for CI/CD builds
**Fallback:** Local laptop (Mac/Windows/Linux x86_64) if debugging becomes painful

```
┌─────────────────────────────────────────────────────────────┐
│                     Build Strategy                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PRIMARY: GitHub Actions                                    │
│  ─────────────────────────────────────────────────────────  │
│  rock-5a (arm64)    GitHub (x86_64)      Your Phone        │
│       │                   │                   │             │
│  Write code ──► git push ──► Build APK ──► Install          │
│       │                   │                   │             │
│  [Edit]        [~5 min]    [Artifact]     [Test]           │
│                                                             │
│  FALLBACK: Local Laptop                                     │
│  ─────────────────────────────────────────────────────────  │
│  If CI debugging is too slow:                               │
│  - Clone to laptop with Android Studio                      │
│  - USB debugging + hot reload                               │
│  - Faster iteration cycle                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9.2 GitHub Actions Workflow

Located at `.github/workflows/build-android.yml`:

```yaml
name: Build Android APK

on:
  push:
    branches: [main]
  workflow_dispatch:  # Manual trigger button

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build Android Release APK
        run: cd android && ./gradlew assembleRelease
      
      - name: Upload APK artifact
        uses: actions/upload-artifact@v4
        with:
          name: brain-and-hand-${{ github.sha }}
          path: android/app/build/outputs/apk/release/app-release.apk
```

### 9.3 Build Pipeline Details

```
┌─────────────────────────────────────────────────────────────┐
│                     Build Steps                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Install dependencies                                    │
│     npm install                                             │
│                                                             │
│  2. Bundle OpenClaw for nodejs-mobile                       │
│     npm run bundle:mobile                                   │
│     └── Produces nodejs-assets/openclaw.bundle.js           │
│                                                             │
│  3. Build Android APK                                       │
│     cd android && ./gradlew assembleRelease                 │
│     └── Produces app-release.apk (~50MB)                    │
│                                                             │
│  4. Sign with release key (for distribution)                │
│     jarsigner -keystore release.keystore ...                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 9.4 Distribution Channels

| Channel | Timeline | Notes |
|---------|----------|-------|
| **Direct APK** | Day 1 | brainandhand.ai/download |
| **GitHub Releases** | Day 1 | For sideloading |
| **F-Droid** | Week 2 | Open source requirement ✓ |
| **Google Play** | Week 4+ | Review process |

### 9.3 Update Mechanism

```
┌─────────────────────────────────────────────────────────────┐
│                     Update Strategy                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  App Shell: Update via Play Store / APK download            │
│                                                             │
│  OpenClaw Core: Hot-update via in-app download              │
│  └── Download new bundle                                    │
│  └── Verify signature                                       │
│  └── Replace openclaw-mobile.bundle.js                      │
│  └── Restart Node.js runtime                                │
│                                                             │
│  Skills: Install/update via ClawHub                         │
│  └── clawhub install skill-name                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 10. Development Phases

### Phase 1: Foundation (Week 1)
- [ ] React Native project setup
- [ ] nodejs-mobile integration
- [ ] Basic OpenClaw running in Node.js
- [ ] Foreground service implementation
- [ ] Simple chat UI

### Phase 2: Core Features (Week 2)
- [ ] Setup wizard UI
- [ ] Telegram channel working
- [ ] Config persistence
- [ ] Boot auto-start
- [ ] Kill switch

### Phase 3: Polish (Week 3)
- [ ] WhatsApp channel
- [ ] Settings screen
- [ ] Notification improvements
- [ ] Battery optimization prompts
- [ ] Error handling & recovery

### Phase 4: Release (Week 4)
- [ ] Security audit
- [ ] Performance optimization
- [ ] APK signing & distribution
- [ ] Documentation
- [ ] F-Droid submission

---

## 11. Success Metrics

| Metric | Target |
|--------|--------|
| Install → First message | < 10 minutes |
| APK size | < 50 MB |
| RAM usage (idle) | < 100 MB |
| Battery drain (24h) | < 5% |
| Crash-free rate | > 99% |
| Background survival | > 95% (survive 24h) |

---

## 12. Open Questions

1. **WhatsApp QR**: Can we render QR code for Baileys in React Native?
2. **iOS port**: How much can we reuse? nodejs-mobile supports iOS.
3. **Skill marketplace**: In-app skill browser or external?
4. **Voice calls**: Twilio/WebRTC feasible on mobile?
5. **Widget**: Android home screen widget for quick actions?
6. **Wear OS**: Bot on your watch?

---

## 13. References

- [nodejs-mobile](https://github.com/nicknisi/nodejs-mobile)
- [React Native](https://reactnative.dev/)
- [Android Foreground Services](https://developer.android.com/guide/components/foreground-services)
- [OpenClaw Documentation](https://docs.openclaw.ai)
- [Brain and Hand PRD](./PRD.md)

---

*Your bot. Your phone. Your pocket.*
