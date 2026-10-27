export type TestMode = 'time' | 'words' | 'quote' | 'weak-keys' | 'lesson';

export type TimeDuration = 15 | 30 | 60 | 120;
export type WordCount = 10 | 25 | 50 | 100;
export type QuoteLength = 'all' | 'short' | 'medium' | 'long';

export interface TypingRecord {
  id: string;
  timestamp: number;
  wpm: number;
  netWpm: number;
  rawWpm: number;
  accuracy: number;
  durationSeconds: number;
  mode: TestMode;
  modeParam: string | number;
  errorCount: number;
  correctCount: number;
  totalChars: number;
  consistency: number; // percentage 0-100
  missTypedKeys: Record<string, number>;
  speedTimeline: { second: number; wpm: number; rawWpm: number; errors: number }[];
}

export type ThemeId =
  | 'dark-slate'
  | 'dark-amber'
  | 'dark-nord'
  | 'dark-forest'
  | 'dark-dracula'
  | 'light-paper'
  | 'light-sepia'
  | 'light-sand'
  | 'custom';

export interface CustomThemePalette {
  bg: string;
  surface: string;
  subtle?: string;
  border: string;
  accent: string;
  accentContrast?: string;
  text: string;
  textMuted: string;
  caret: string;
  charCorrect: string;
  charWrong: string;
}

export interface ThemeOption {
  id: ThemeId;
  name: string;
  category: 'dark' | 'light' | 'custom';
  previewBg: string;
  previewAccent: string;
  previewText: string;
}

export interface UserSettings {
  theme: ThemeId;
  customTheme?: CustomThemePalette;
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  soundType: 'mechanical' | 'soft' | 'beep';
  caretStyle: 'line' | 'block' | 'underline';
  smoothCaret: boolean;
  quickRestartKey: 'Tab' | 'Escape';
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  username: string;
  targetDailyMinutes: number;
  showLiveWpm: boolean;
  showLiveAccuracy: boolean;
}

export interface AcademyLesson {
  id: string;
  stageId: number;
  stageTitle: string;
  title: string;
  description: string;
  newKeys: string[];
  targetAccuracy: number;
  minWpm: number;
  text: string;
  fingerHints: string;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  bestWpm: number;
  bestAccuracy: number;
  stars: number; // 1 to 3
  completedAt?: number;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  minutes: number;
  testsCompleted: number;
  avgWpm: number;
}

export interface BackupData {
  version: number;
  exportedAt: string;
  records: TypingRecord[];
  settings: UserSettings;
  lessonProgress: Record<string, LessonProgress>;
  dailyActivities: Record<string, DailyActivity>;
}
