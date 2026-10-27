import React, { useEffect, useState } from 'react';
import { DailyActivity, LessonProgress, TestMode, TypingRecord, UserSettings } from './types';
import {
  deleteTypingRecord,
  getDailyActivities,
  getLessonProgress,
  getTypingRecords,
  getUserSettings,
  recordActivity,
  saveLessonProgress,
  saveTypingRecord,
  saveUserSettings,
} from './utils/storage';
import { ActiveTab, Header } from './components/common/Header';
import { TypingArena } from './components/typing/TypingArena';
import { TouchTypingAcademy } from './components/academy/TouchTypingAcademy';
import { AnalyticsDashboard } from './components/dashboard/AnalyticsDashboard';
import { ThemeSelector } from './components/common/ThemeSelector';
import { BackupModal } from './components/common/BackupModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('test');
  const [records, setRecords] = useState<TypingRecord[]>([]);
  const [settings, setSettings] = useState<UserSettings>(getUserSettings());
  const [lessonProgress, setLessonProgress] = useState<Record<string, LessonProgress>>({});
  const [dailyActivities, setDailyActivities] = useState<Record<string, DailyActivity>>({});

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Arena starting mode
  const [arenaInitialMode, setArenaInitialMode] = useState<TestMode>('time');

  // Load state on mount and sync
  const refreshLocalData = () => {
    setRecords(getTypingRecords());
    setSettings(getUserSettings());
    setLessonProgress(getLessonProgress());
    setDailyActivities(getDailyActivities());
  };

  useEffect(() => {
    refreshLocalData();
  }, []);

  // Update theme data attribute on documentElement and inject custom palette variables if custom theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
    const rootStyle = document.documentElement.style;

    if (settings.theme === 'custom' && settings.customTheme) {
      const ct = settings.customTheme;
      rootStyle.setProperty('--theme-bg', ct.bg);
      rootStyle.setProperty('--theme-surface', ct.surface);
      rootStyle.setProperty('--theme-subtle', ct.subtle || ct.surface);
      rootStyle.setProperty('--theme-border', ct.border);
      rootStyle.setProperty('--theme-border-subtle', ct.border);
      rootStyle.setProperty('--theme-text-main', ct.text);
      rootStyle.setProperty('--theme-text-muted', ct.textMuted);
      rootStyle.setProperty('--theme-text-faint', ct.textMuted);
      rootStyle.setProperty('--theme-accent', ct.accent);
      rootStyle.setProperty('--theme-accent-contrast', ct.accentContrast || '#ffffff');
      rootStyle.setProperty('--theme-accent-glow', `${ct.accent}25`);
      rootStyle.setProperty('--char-future', ct.textMuted);
      rootStyle.setProperty('--char-correct', ct.charCorrect);
      rootStyle.setProperty('--char-wrong', ct.charWrong);
      rootStyle.setProperty('--char-wrong-bg', `${ct.charWrong}33`);
      rootStyle.setProperty('--caret', ct.caret);
    } else {
      // Clear inline properties so data-theme CSS takes full effect
      const keys = [
        '--theme-bg',
        '--theme-surface',
        '--theme-subtle',
        '--theme-border',
        '--theme-border-subtle',
        '--theme-text-main',
        '--theme-text-muted',
        '--theme-text-faint',
        '--theme-accent',
        '--theme-accent-contrast',
        '--theme-accent-glow',
        '--char-future',
        '--char-correct',
        '--char-wrong',
        '--char-wrong-bg',
        '--caret',
      ];
      keys.forEach((k) => rootStyle.removeProperty(k));
    }
  }, [settings.theme, settings.customTheme]);

  // Handlers
  const handleTestComplete = (record: TypingRecord) => {
    const updated = saveTypingRecord(record);
    setRecords(updated);
    const updatedActivities = recordActivity(record.durationSeconds, record.wpm);
    setDailyActivities(updatedActivities);
  };

  const handleDeleteRecord = (id: string) => {
    const updated = deleteTypingRecord(id);
    setRecords(updated);
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = saveUserSettings(newSettings);
    setSettings(updated);
  };

  const handleSaveLessonProgress = (progress: LessonProgress) => {
    const updated = saveLessonProgress(progress);
    setLessonProgress(updated);
  };

  const handleLessonActivity = (durationSeconds: number, wpm: number) => {
    const updated = recordActivity(durationSeconds, wpm);
    setDailyActivities(updated);
  };

  const handleStartWeakDrill = () => {
    setArenaInitialMode('weak-keys');
    setActiveTab('test');
  };

  const bestWpm = records.length > 0 ? Math.max(...records.map((r) => r.wpm)) : 0;

  return (
    <div className="min-h-screen flex flex-col theme-bg theme-text selection:bg-[var(--theme-accent)] selection:text-[var(--theme-accent-contrast)] transition-colors duration-150">
      {/* Top Navigation Header */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'test' && arenaInitialMode === 'weak-keys') {
            setArenaInitialMode('time');
          }
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenBackup={() => setIsBackupOpen(true)}
        settings={settings}
        bestWpm={bestWpm}
      />

      {/* Main View Port */}
      <main className="flex-1 flex flex-col relative w-full">
        {activeTab === 'test' && (
          <TypingArena
            settings={settings}
            records={records}
            onTestComplete={handleTestComplete}
            onNavigateToDashboard={() => setActiveTab('dashboard')}
            initialMode={arenaInitialMode}
          />
        )}

        {activeTab === 'academy' && (
          <TouchTypingAcademy
            settings={settings}
            lessonProgress={lessonProgress}
            onSaveProgress={handleSaveLessonProgress}
            onActivityDone={handleLessonActivity}
          />
        )}

        {activeTab === 'dashboard' && (
          <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-6 space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setArenaInitialMode('time');
                  setActiveTab('test');
                }}
                className="text-xs theme-text-muted hover:theme-text flex items-center gap-1.5 transition-colors"
              >
                ← Back to Typing Test
              </button>
            </div>
            <AnalyticsDashboard
              records={records}
              dailyActivities={dailyActivities}
              settings={settings}
              onDeleteRecord={handleDeleteRecord}
              onStartWeakDrill={handleStartWeakDrill}
              onOpenBackup={() => setIsBackupOpen(true)}
              onStartTest={() => {
                setArenaInitialMode('time');
                setActiveTab('test');
              }}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t theme-border theme-surface py-3 px-4 sm:px-6 select-none shrink-0 text-xs theme-text-muted">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span>
              Tip: Press <kbd className="px-1.5 py-0.5 rounded border theme-border theme-subtle font-mono text-[11px] theme-text">{settings.quickRestartKey}</kbd> anytime to restart test
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsBackupOpen(true)}
              className="hover:theme-text transition-colors"
            >
              Export / Import JSON
            </button>
            <span>·</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:theme-text transition-colors"
            >
              Themes & Preferences
            </button>
            <span>·</span>
            <span className="opacity-75">100% Client-Side & Offline Ready</span>
          </div>
        </div>
      </footer>

      {/* Settings Modal (Themes, Sounds, Caret, Username) */}
      <ThemeSelector
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenBackup={() => {
          setIsSettingsOpen(false);
          setIsBackupOpen(true);
        }}
      />

      {/* Backup & JSON Sync Modal */}
      <BackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onDataChanged={refreshLocalData}
      />

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}
