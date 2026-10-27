import { BackupData, CustomThemePalette, DailyActivity, LessonProgress, TypingRecord, UserSettings } from '../types';

const STORAGE_KEYS = {
  RECORDS: 'keypulse_typing_records_v1',
  SETTINGS: 'keypulse_user_settings_v1',
  LESSONS: 'keypulse_lesson_progress_v1',
  ACTIVITY: 'keypulse_daily_activity_v1',
};

export const DEFAULT_CUSTOM_THEME: CustomThemePalette = {
  bg: '#0f172a',
  surface: '#1e293b',
  subtle: '#293548',
  border: '#334155',
  accent: '#38bdf8',
  accentContrast: '#0f172a',
  text: '#f8fafc',
  textMuted: '#94a3b8',
  caret: '#38bdf8',
  charCorrect: '#f8fafc',
  charWrong: '#f43f5e',
};

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'dark-slate',
  customTheme: DEFAULT_CUSTOM_THEME,
  soundEnabled: true,
  soundVolume: 0.5,
  soundType: 'mechanical',
  caretStyle: 'line',
  smoothCaret: true,
  quickRestartKey: 'Tab',
  fontSize: 'lg',
  username: 'KeyMaster',
  targetDailyMinutes: 15,
  showLiveWpm: true,
  showLiveAccuracy: true,
};

export function getTypingRecords(): TypingRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!raw) return [];
    const parsed: TypingRecord[] = JSON.parse(raw);
    // Remove synthetic seed records if present from previous sessions
    const genuine = parsed.filter((r) => !r.id.startsWith('seed-'));
    if (genuine.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(genuine));
    }
    return genuine;
  } catch {
    return [];
  }
}

export function saveTypingRecord(record: TypingRecord): TypingRecord[] {
  const current = getTypingRecords();
  const updated = [record, ...current];
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save typing record to localStorage:', err);
  }
  return updated;
}

export function deleteTypingRecord(id: string): TypingRecord[] {
  const current = getTypingRecords();
  const updated = current.filter((r) => r.id !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update records:', err);
  }
  return updated;
}

export function getUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: Partial<UserSettings>): UserSettings {
  const current = getUserSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
  return updated;
}

export function getLessonProgress(): Record<string, LessonProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LESSONS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveLessonProgress(progress: LessonProgress): Record<string, LessonProgress> {
  const current = getLessonProgress();
  const existing = current[progress.lessonId];
  const bestWpm = Math.max(progress.bestWpm, existing?.bestWpm || 0);
  const bestAccuracy = Math.max(progress.bestAccuracy, existing?.bestAccuracy || 0);
  const stars = Math.max(progress.stars, existing?.stars || 0);

  current[progress.lessonId] = {
    ...progress,
    bestWpm,
    bestAccuracy,
    stars,
    completed: true,
    completedAt: Date.now(),
  };

  try {
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save lesson progress:', err);
  }
  return { ...current };
}

export function getDailyActivities(): Record<string, DailyActivity> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function recordActivity(secondsDuration: number, wpm: number): Record<string, DailyActivity> {
  const activities = getDailyActivities();
  const todayStr = new Date().toISOString().split('T')[0];
  const current = activities[todayStr] || {
    date: todayStr,
    minutes: 0,
    testsCompleted: 0,
    avgWpm: wpm,
  };

  const newTests = current.testsCompleted + 1;
  const newAvgWpm = Math.round((current.avgWpm * current.testsCompleted + wpm) / newTests);
  const newMinutes = +(current.minutes + secondsDuration / 60).toFixed(1);

  activities[todayStr] = {
    date: todayStr,
    minutes: newMinutes,
    testsCompleted: newTests,
    avgWpm: newAvgWpm,
  };

  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(activities));
  } catch (err) {
    console.error('Failed to save daily activity:', err);
  }
  return activities;
}

export function exportBackupJson(): void {
  const data: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    records: getTypingRecords(),
    settings: getUserSettings(),
    lessonProgress: getLessonProgress(),
    dailyActivities: getDailyActivities(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  a.href = url;
  a.download = `keypulse-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importBackupJson(
  file: File,
  mergeMode: 'merge' | 'overwrite' = 'merge'
): Promise<{ success: boolean; message: string; recordCount?: number }> {
  try {
    const text = await file.text();
    const data = JSON.parse(text) as Partial<BackupData>;

    if (!data.records || !Array.isArray(data.records)) {
      throw new Error('Invalid backup file: missing records array');
    }

    if (mergeMode === 'overwrite') {
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(data.records));
      if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
      if (data.lessonProgress) localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(data.lessonProgress));
      if (data.dailyActivities) localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(data.dailyActivities));
    } else {
      // Merge records by id
      const existingRecords = getTypingRecords();
      const existingIds = new Set(existingRecords.map((r) => r.id));
      const mergedRecords = [...existingRecords];

      data.records.forEach((r) => {
        if (!existingIds.has(r.id)) {
          mergedRecords.push(r);
        }
      });
      localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(mergedRecords));

      // Merge lessons
      if (data.lessonProgress) {
        const existingLessons = getLessonProgress();
        const mergedLessons = { ...existingLessons, ...data.lessonProgress };
        localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(mergedLessons));
      }

      // Merge activities
      if (data.dailyActivities) {
        const existingActivity = getDailyActivities();
        const mergedActivity = { ...existingActivity, ...data.dailyActivities };
        localStorage.setItem(STORAGE_KEYS.ACTIVITY, JSON.stringify(mergedActivity));
      }
    }

    return {
      success: true,
      message: `Successfully restored ${data.records.length} typing records!`,
      recordCount: data.records.length,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown parsing error';
    return {
      success: false,
      message: `Failed to restore backup: ${message}`,
    };
  }
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEYS.RECORDS);
  localStorage.removeItem(STORAGE_KEYS.LESSONS);
  localStorage.removeItem(STORAGE_KEYS.ACTIVITY);
}
