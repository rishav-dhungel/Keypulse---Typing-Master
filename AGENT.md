# AGENT.md — Engineering Guidelines & System Architecture

This document provides system design specifications, engineering constraints, and guidelines for AI coding agents and human engineers contributing to the **KeyPulse** codebase.

---

## 1. Architectural Philosophy

1. **Zero Distraction & High Contrast**:
   - The typing experience must remain the central focus.
   - Character glyphs must never be obscured by carets, overlays, or muddy contrast.
   - Untyped text (`--char-future`) must be distinct but legible.
   - The active character being typed (`isCurrent`) must always be rendered in high contrast (`var(--theme-text-main)`) with font weight `600`.

2. **Zero Synthetic / Mock Data**:
   - Do NOT inject fake test records, mock leaderboard ranks, or simulated history logs by default.
   - If the user has 0 records, the dashboard and graphs must render a clean empty state with an invitation to take the first test.

3. **Privacy & Offline-First**:
   - All state resides in `localStorage`.
   - Audio effects are procedurally generated using the browser's `AudioContext` in `src/utils/audio.ts`. Do not import external `.mp3` or `.wav` files that could fail offline or introduce latency.
   - PWA caching is managed via `vite-plugin-pwa`.

---

## 2. Directory Structure & Key Files

```
├── src/
│   ├── App.tsx                      # Top-level state coordinator and theme CSS variable injector
│   ├── index.css                    # Tailwind v4 import & theme CSS custom variable definitions
│   ├── types/index.ts               # Domain interfaces (UserSettings, TypingRecord, LessonProgress, etc.)
│   ├── utils/
│   │   ├── audio.ts                 # Zero-latency procedural mechanical switch synthesizer
│   │   ├── storage.ts               # LocalStorage access, migration, export/import utilities
│   │   └── wordBanks.ts             # English 200 list, literature quotes, and academy stages
│   └── components/
│       ├── common/
│       │   ├── Header.tsx           # Minimal top navigation bar & Account profile dropdown
│       │   ├── ThemeSelector.tsx    # Theme modal & 9-color Custom Palette Studio
│       │   ├── BackupModal.tsx      # JSON data export and import
│       │   └── PWAInstallButton.tsx # Native PWA install trigger
│       ├── typing/
│       │   └── TypingArena.tsx      # Main typing engine, caret positioning, sliding viewport
│       ├── academy/
│       │   ├── TouchTypingAcademy.tsx # 6-stage curriculum drill engine
│       │   └── VirtualKeyboard.tsx    # Visual keyboard with real-time finger placement guides
│       └── dashboard/
│           └── AnalyticsDashboard.tsx # Metrics, timeline graph, weak keys, and test history
```

---

## 3. Theming & Color Token Discipline

The application uses dynamic CSS variables declared in `src/index.css` and injected onto `:root` / `html[data-theme]` in `src/App.tsx`.

### Core Token Reference:
- `--theme-bg`: Main application canvas background.
- `--theme-surface`: Elevated card and container background.
- `--theme-subtle`: Subtle secondary container background.
- `--theme-border`: Divider and component border color.
- `--theme-text-main`: Primary high-contrast text.
- `--theme-text-muted`: Secondary muted text.
- `--theme-accent`: Primary accent / highlight color.
- `--theme-accent-contrast`: Foreground text when sitting on `--theme-accent`.
- `--theme-accent-glow`: Translucent glow box-shadow for active elements.
- `--char-future`: Upcoming untyped characters (must maintain at least 4.5:1 contrast against surface).
- `--char-correct`: Successfully typed characters.
- `--char-wrong`: Mistyped characters.
- `--char-wrong-bg`: Subtle background tint applied to mistyped characters.
- `--caret`: Active cursor color.

### Rules for Editing Styles:
- **Never hardcode Tailwind dark utilities like `bg-neutral-900` or `text-white` directly on components** without semantic theme classes (`theme-surface`, `theme-text`, `theme-border`). Hardcoded dark colors break light themes (e.g. `light-paper`, `light-sepia`).
- Custom color palettes in `ThemeSelector.tsx` must support real-time preview and export cleanly to `UserSettings.customTheme`.

---

## 4. Typing Engine & Caret Specifications (`TypingArena.tsx`)

1. **Character Dimension**:
   - Every single character and trailing space must be rendered inside an inline element with width `w-[1ch] text-center` in a monospace font (`font-mono`).
   - Do NOT use word-level `tracking-wide` or horizontal margins on individual letters, as this creates unequal space between letters and makes reading confusing.

2. **Caret Rendering**:
   - `block` caret:
     - Rendered with `z-0` behind the character glyph.
     - Styled with `opacity: 0.22`, `boxShadow: 0 0 0 1px var(--caret), 0 0 8px var(--theme-accent-glow)`.
     - The character glyph itself sits on `relative z-10`, `font-semibold`, with `color: var(--theme-text-main)`.
   - `line` caret:
     - Rendered with `z-20` at `-left-[1.5px] top-[10%] bottom-[10%] w-[2.5px]`.
   - `underline` caret:
     - Rendered with `z-20` at `-bottom-0.5 inset-x-0 h-[2.5px]`.

3. **Three-Line Sliding Viewport**:
   - Lines are tracked via `parsedWords` mapping character indices.
   - When the user advances past Line 2, `scrollOffset` slides the wrapper vertically so the active typing line remains centered.

---

## 5. Storage Schema & Persistence (`src/utils/storage.ts`)

- `keypulse_records`: Array of `TypingRecord`.
- `keypulse_settings`: Serialized `UserSettings`.
- `keypulse_lessons`: Key-value map of `Record<string, LessonProgress>`.
- `keypulse_activities`: Key-value map of `Record<string, DailyActivity>` indexed by `YYYY-MM-DD`.

When introducing new fields to `UserSettings`, always provide a default fallback in `DEFAULT_SETTINGS` to prevent runtime `undefined` errors.

---

## 6. Build, Test & Verification Commands

- **Type Check**: `npm run lint` (`tsc --noEmit`).
- **Production Build**: `npm run build` (`vite build`).
- **Dev Server**: `npm run dev` (Runs on `http://localhost:3000`).
- **Vite Base Path**: Keep `base: '/'` in `vite.config.ts` to ensure PWA manifests and deep assets resolve properly.
- **Tailwind Version**: Tailwind CSS v4 via `@tailwindcss/vite`. Do not install `autoprefixer` or PostCSS config files.
