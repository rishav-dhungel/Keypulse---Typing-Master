# KeyPulse — Typing Mastery & Speed Tracking

KeyPulse is a minimalist, distraction-free typing speed test and touch-typing academy designed for performance, precision, and visual clarity. Built with React 19, TypeScript, and Tailwind CSS v4, KeyPulse runs 100% offline with zero external audio or telemetry dependencies.

---

## ✨ Features

### 1. Distraction-Free Typing Arena
- **Multiple Test Modes**:
  - **Time**: 15s, 30s, 60s, or 120s sprints with infinite word replenishment.
  - **Words**: Fixed word counts (10, 25, 50, 100 words).
  - **Quotes**: Hand-curated literature quotes across short, medium, and long lengths with author attribution.
  - **Weak Keys**: Automatically aggregates your most frequently mistyped keys and synthesizes focused training drills.
- **Three-Line Adaptive Viewport**: Smooth line-by-line sliding stream that keeps your active typing zone centered without jarring page jumps.
- **Crystal-Clear Character Contrast**:
  - Active letter is highlighted with high-contrast text and luminous non-obstructive caret highlight.
  - Selectable caret styles: **Line**, **Block**, and **Underline**.
  - Distinct color-coded states for typed, correct, and incorrect characters.
- **Zero-Latency Audio Engine**: Synthesized mechanical switch, soft tap, or retro blip clicks powered directly by the Web Audio API without downloading external audio files.

### 2. Touch Typing Academy
- **Curriculum with 6 Guided Stages**:
  - Stage 1: Home Row Foundation (`f`, `j`, `d`, `k`, `s`, `l`, `a`, `;`)
  - Stage 2: Top Row Integration (`e`, `i`, `r`, `u`, `t`, `y`, `q`, `p`, `w`, `o`)
  - Stage 3: Bottom Row (`v`, `m`, `c`, `,`, `x`, `.`, `z`, `/`)
  - Stage 4: Shift Key & Capitalization
  - Stage 5: Numbers & Common Symbols
  - Stage 6: Real-World Sentences & Punctuation
- **Interactive Virtual Keyboard**: Visual finger placement guide highlighting which finger to use for the target key.
- **Mastery Criteria**: Accuracy and speed thresholds for unlocking subsequent lessons and earning 1–3 star ratings.

### 3. Personal Analytics & Progress Tracking
- **Real-Time & Historical Metrics**:
  - Net WPM, Raw WPM, Accuracy (%), Consistency (%), and Error Counts.
  - Timeline graph displaying second-by-second speed and error spikes.
  - Accuracy & speed progression over 10, 25, 50, or all recorded sessions.
- **Weak Keys Heatmap**: Frequency breakdown of your problem keys with one-click drill generation.
- **Daily Streak & Activity Calendar**: Logs active days and total practice minutes.
- **Account Dropdown**: Clean profile interface for inspecting personal tier rank (Bronze through Apex Master) and session records.
- **Data Sovereignty**: Complete JSON export and import for seamless backup and transfer across browsers.

### 4. Dynamic Theming Engine & Custom Palette Studio
- **8 Curated Themes**:
  - *Dark*: Charcoal & Sky (`dark-slate`), Hacker Amber (`dark-amber`), Nordic Frost (`dark-nord`), Forest Emerald (`dark-forest`), Cyber Violet (`dark-dracula`).
  - *Light*: Crisp Paper (`light-paper`), Vintage Sepia (`light-sepia`), Soft Sand (`light-sand`).
- **Custom Color Studio**: Fine-tune 9 individual color tokens (background, surface, subtle, border, text, muted, accent, correct, wrong, caret) with live interactive preview and preset cloning.

### 5. Progressive Web App (PWA)
- Fully installable on desktop and mobile devices.
- Offline caching via service worker (`vite-plugin-pwa`).

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite 6+](https://vite.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) using modern `@import "tailwindcss";` and CSS custom variables
- **Icons**: [Lucide React](https://lucide.dev/)
- **Visual FX**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio**: Web Audio API (`AudioContext`)
- **Storage**: LocalStorage with schema validation and sanitization

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/keypulse.git

# Enter project directory
cd keypulse

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Production Build

```bash
# Type check and build optimized bundle to dist/
npm run build

# Preview production build locally
npm run preview
```

### Linting & Type Validation

```bash
npm run lint
```

---

## 📂 Project Structure

```
├── index.html                   # Entry HTML with theme variables & PWA meta
├── metadata.json                # AI Studio application metadata
├── package.json                 # Project dependencies and build scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind v4 & VitePWA
├── public/                      # Static icons, manifest assets, and favicons
└── src/
    ├── App.tsx                  # Main application orchestrator & theme injector
    ├── main.tsx                 # React DOM mount point
    ├── index.css                # Global styles, Tailwind v4 imports, theme definitions
    ├── types/
    │   └── index.ts             # TypeScript domain models (Settings, Records, Lessons)
    ├── utils/
    │   ├── audio.ts             # Web Audio API procedural sound synthesizer
    │   ├── storage.ts           # LocalStorage CRUD, sanitization, and defaults
    │   └── wordBanks.ts         # English 200 word bank, quotes, academy lessons
    ├── hooks/                   # Custom reusable React hooks
    └── components/
        ├── common/              # Header, ThemeSelector, PWAInstallButton, BackupModal
        ├── typing/              # TypingArena (core typing loop, caret, sliding window)
        ├── academy/             # TouchTypingAcademy and VirtualKeyboard
        └── dashboard/           # AnalyticsDashboard, weak keys, history log
```

---

## 🔒 Privacy & Data

KeyPulse stores all typing test records, curriculum milestones, and preferences exclusively inside your browser's `localStorage`. No telemetry, analytics trackers, or external servers are involved.

---

## 📄 License

MIT License. Feel free to use, modify, and distribute for personal or commercial projects.
