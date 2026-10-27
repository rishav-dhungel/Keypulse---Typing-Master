import React, { useMemo, useState } from 'react';
import {
  Trophy,
  Flame,
  Target,
  Zap,
  Clock,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Trash2,
  Download,
  Play,
  Filter,
} from 'lucide-react';
import { DailyActivity, TypingRecord, UserSettings } from '../../types';
import { VirtualKeyboard } from '../academy/VirtualKeyboard';

interface AnalyticsDashboardProps {
  records: TypingRecord[];
  dailyActivities: Record<string, DailyActivity>;
  settings: UserSettings;
  onDeleteRecord: (id: string) => void;
  onStartWeakDrill: (weakKeys: Record<string, number>) => void;
  onOpenBackup: () => void;
  onStartTest: () => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  records,
  dailyActivities,
  settings,
  onDeleteRecord,
  onStartWeakDrill,
  onOpenBackup,
  onStartTest,
}) => {
  const [historyFilter, setHistoryFilter] = useState<'all' | 'time' | 'words' | 'quote'>('all');
  const [graphWindow, setGraphWindow] = useState<'10' | '25' | '50' | 'all'>('25');

  // Compute key stats
  const stats = useMemo(() => {
    if (records.length === 0) {
      return {
        bestWpm: 0,
        recentAvgWpm: 0,
        allAvgWpm: 0,
        allAvgAccuracy: 0,
        totalTests: 0,
        totalMinutes: 0,
        avgConsistency: 0,
      };
    }

    const bestWpm = Math.max(...records.map((r) => r.wpm));
    const recent10 = records.slice(0, 10);
    const recentAvgWpm = Math.round(recent10.reduce((acc, r) => acc + r.wpm, 0) / recent10.length);
    const allAvgWpm = Math.round(records.reduce((acc, r) => acc + r.wpm, 0) / records.length);
    const allAvgAccuracy = Number(
      (records.reduce((acc, r) => acc + r.accuracy, 0) / records.length).toFixed(1)
    );
    const totalMinutes = +(records.reduce((acc, r) => acc + r.durationSeconds, 0) / 60).toFixed(1);
    const avgConsistency = Math.round(
      records.reduce((acc, r) => acc + (r.consistency || 85), 0) / records.length
    );

    return {
      bestWpm,
      recentAvgWpm,
      allAvgWpm,
      allAvgAccuracy,
      totalTests: records.length,
      totalMinutes,
      avgConsistency,
    };
  }, [records]);

  // Aggregate missed keys across all tests
  const aggregatedWeakKeys = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach((r) => {
      Object.entries(r.missTypedKeys || {}).forEach(([k, cnt]) => {
        map[k.toLowerCase()] = (map[k.toLowerCase()] || 0) + cnt;
      });
    });
    return map;
  }, [records]);

  // Top 5 worst keys
  const topWeakKeys = useMemo(() => {
    return Object.entries(aggregatedWeakKeys)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [aggregatedWeakKeys]);

  // Filtered records for table
  const filteredRecords = useMemo(() => {
    if (historyFilter === 'all') return records;
    return records.filter((r) => r.mode === historyFilter);
  }, [records, historyFilter]);

  // Graph data points
  const graphRecords = useMemo(() => {
    const list = [...records].reverse();
    if (graphWindow === 'all') return list;
    const count = parseInt(graphWindow, 10);
    return list.slice(Math.max(0, list.length - count));
  }, [records, graphWindow]);

  // Calculate practice streak
  const streakInfo = useMemo(() => {
    const today = new Date();
    let currentStreak = 0;
    const days: { dateStr: string; dayNum: number; minutes: number }[] = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const act = dailyActivities[dateStr];
      const minutes = act ? act.minutes : 0;
      days.push({
        dateStr,
        dayNum: d.getDate(),
        minutes,
      });
    }

    let checkDate = new Date(today);
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      const act = dailyActivities[dStr];
      if (act && act.minutes >= 1) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const todayStr = today.toISOString().split('T')[0];
    const todayMinutes = dailyActivities[todayStr]?.minutes || 0;

    return {
      currentStreak,
      todayMinutes,
      days,
    };
  }, [dailyActivities]);

  return (
    <div className="w-full max-w-5xl mx-auto py-4 px-4 space-y-6 select-none theme-text">
      {/* Top Header & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b theme-border">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 theme-accent" />
            <h1 className="text-xl font-bold tracking-tight theme-text">Performance Analytics & Insights</h1>
          </div>
          <p className="text-xs theme-text-muted mt-0.5">
            Personalized metrics, key weakness diagnostics, and historical speed progression.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenBackup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border theme-border theme-subtle hover:brightness-110 theme-text text-xs font-medium transition-colors"
          >
            <Download className="w-3.5 h-3.5 theme-accent" />
            <span>Sync / Backup JSON</span>
          </button>
          <button
            onClick={onStartTest}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl theme-btn-accent text-xs font-semibold shadow-xs"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Start Typing Test</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <div className="flex items-center justify-between theme-text-muted text-xs mb-1">
            <span>Peak Speed</span>
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight theme-text tabular-nums">
            {stats.bestWpm}
            <span className="text-xs font-normal theme-accent ml-1">WPM</span>
          </div>
          <div className="text-[11px] theme-text-muted mt-1">All-time record</div>
        </div>

        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <div className="flex items-center justify-between theme-text-muted text-xs mb-1">
            <span>Recent Average</span>
            <Zap className="w-3.5 h-3.5 theme-accent" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight theme-text tabular-nums">
            {stats.recentAvgWpm}
            <span className="text-xs font-normal theme-accent ml-1">WPM</span>
          </div>
          <div className="text-[11px] theme-text-muted mt-1">Last 10 tests</div>
        </div>

        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <div className="flex items-center justify-between theme-text-muted text-xs mb-1">
            <span>Accuracy</span>
            <Target className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-emerald-400 tabular-nums">
            {stats.allAvgAccuracy}%
          </div>
          <div className="text-[11px] theme-text-muted mt-1">Lifetime average</div>
        </div>

        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <div className="flex items-center justify-between theme-text-muted text-xs mb-1">
            <span>Tests Run</span>
            <Clock className="w-3.5 h-3.5 theme-accent" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight theme-text tabular-nums">
            {stats.totalTests}
          </div>
          <div className="text-[11px] theme-text-muted mt-1">{stats.totalMinutes} mins total</div>
        </div>

        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <div className="flex items-center justify-between theme-text-muted text-xs mb-1">
            <span>Consistency</span>
            <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight theme-text tabular-nums">
            {stats.avgConsistency}%
          </div>
          <div className="text-[11px] theme-text-muted mt-1">Rhythm variance</div>
        </div>

        <div className="p-4 rounded-2xl theme-surface border theme-border shadow-xs">
          <div className="flex items-center justify-between theme-text-muted text-xs mb-1">
            <span>Daily Streak</span>
            <Flame className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono tracking-tight text-amber-400 tabular-nums">
            {streakInfo.currentStreak}
            <span className="text-xs font-normal text-amber-400 ml-1">days</span>
          </div>
          <div className="text-[11px] theme-text-muted mt-1">
            Today: {streakInfo.todayMinutes}/{settings.targetDailyMinutes}m
          </div>
        </div>
      </div>

      {/* Historical Speed Progression Interactive Graph */}
      <div className="p-6 rounded-2xl theme-surface border theme-border shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-semibold theme-text">Speed & Accuracy Progression Timeline</h2>
            <p className="text-xs theme-text-muted mt-0.5">Chronological evolution of test results</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 theme-subtle rounded-lg border theme-border text-xs">
            {(['10', '25', '50', 'all'] as const).map((win) => (
              <button
                key={win}
                onClick={() => setGraphWindow(win)}
                className={`px-2.5 py-1 rounded capitalize font-mono transition-colors ${
                  graphWindow === win ? 'theme-surface theme-accent font-semibold shadow-xs' : 'theme-text-muted hover:theme-text'
                }`}
              >
                {win === 'all' ? 'All' : `Last ${win}`}
              </button>
            ))}
          </div>
        </div>

        {graphRecords.length > 1 ? (
          <div className="mt-2">
            <div className="h-48 w-full rounded-xl theme-subtle border theme-border p-3 flex flex-col justify-between">
              {/* SVG Line chart */}
              <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                {/* Horizontal guide lines */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="currentColor" opacity="0.1" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" opacity="0.1" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="0" y1="30" x2="100" y2="30" stroke="currentColor" opacity="0.1" strokeWidth="0.5" strokeDasharray="2,2" />

                {/* Average WPM guideline */}
                {(() => {
                  const maxWpm = Math.max(...graphRecords.map((r) => r.wpm), 70);
                  const avgY = 38 - (stats.allAvgWpm / maxWpm) * 34;
                  return (
                    <line x1="0" y1={avgY} x2="100" y2={avgY} stroke="#f59e0b" strokeWidth="0.6" strokeDasharray="3,3" opacity="0.6" />
                  );
                })()}

                {/* WPM line */}
                {(() => {
                  const maxWpm = Math.max(...graphRecords.map((r) => r.wpm), 70);
                  const points = graphRecords
                    .map((r, idx) => {
                      const x = (idx / (graphRecords.length - 1)) * 100;
                      const y = 38 - (r.wpm / maxWpm) * 34;
                      return `${x},${y}`;
                    })
                    .join(' ');

                  return (
                    <>
                      <polyline fill="none" stroke="var(--theme-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" points={points} />
                      {graphRecords.map((r, idx) => {
                        const x = (idx / (graphRecords.length - 1)) * 100;
                        const y = 38 - (r.wpm / maxWpm) * 34;
                        return (
                          <circle
                            key={idx}
                            cx={x}
                            cy={y}
                            r="1.6"
                            fill="var(--theme-accent)"
                            className="hover:r-2.5 transition-all cursor-pointer"
                          >
                            <title>{`${r.wpm} WPM · ${r.accuracy}% Acc (${new Date(r.timestamp).toLocaleDateString()})`}</title>
                          </circle>
                        );
                      })}
                    </>
                  );
                })()}
              </svg>
            </div>
            <div className="mt-2 flex items-center justify-between text-[11px] theme-text-muted font-mono">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 theme-accent" style={{ backgroundColor: 'var(--theme-accent)' }} /> WPM Curve
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-0.5 border-t border-dashed border-amber-400" /> Avg ({stats.allAvgWpm} WPM)
                </span>
              </div>
              <span>Oldest → Newest</span>
            </div>
          </div>
        ) : (
          <div className="h-40 rounded-xl theme-subtle border theme-border flex items-center justify-center text-xs theme-text-muted">
            Complete at least 2 typing tests to render progression trends.
          </div>
        )}
      </div>

      {/* Two-Column: Weak Keys Heatmap & 30-Day Activity Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weak Keys Heatmap & Diagnostic */}
        <div className="p-6 rounded-2xl theme-surface border theme-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b theme-border">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-semibold theme-text">Weak Keys Diagnostic</h3>
              </div>
              {topWeakKeys.length > 0 && (
                <button
                  onClick={() => onStartWeakDrill(aggregatedWeakKeys)}
                  className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition-colors"
                >
                  Start Weak Keys Drill
                </button>
              )}
            </div>

            <div className="mt-4">
              <p className="text-xs theme-text-muted mb-3">
                Keys with the highest historical error count. Highlighted in the keyboard below.
              </p>

              {topWeakKeys.length > 0 ? (
                <div className="flex flex-wrap gap-2 mb-4">
                  {topWeakKeys.map(([key, count]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-mono"
                    >
                      <span className="text-base font-bold uppercase">{key}</span>
                      <span className="text-[11px] theme-text-muted">{count} errors</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-emerald-400 py-2">
                  No recurring error patterns detected yet. Excellent finger precision!
                </div>
              )}

              {/* Render Heatmap Keyboard */}
              <div className="mt-2 overflow-hidden">
                <VirtualKeyboard heatMap={aggregatedWeakKeys} showFingerGuide={false} />
              </div>
            </div>
          </div>
        </div>

        {/* 30-Day Daily Activity Matrix & Practice Goal */}
        <div className="p-6 rounded-2xl theme-surface border theme-border shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b theme-border">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 theme-accent" />
                <h3 className="text-sm font-semibold theme-text">Daily Practice Consistency</h3>
              </div>
              <span className="text-xs theme-text-muted">Target: {settings.targetDailyMinutes}m / day</span>
            </div>

            <div className="mt-4">
              <p className="text-xs theme-text-muted mb-3">
                Last 30 days typing activity. Consistent daily touch sessions yield rapid WPM gains.
              </p>

              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 p-3 theme-subtle rounded-xl border theme-border">
                {streakInfo.days.map((day) => {
                  let bg = 'theme-surface border theme-border theme-text-muted';
                  if (day.minutes >= settings.targetDailyMinutes) {
                    bg = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold';
                  } else if (day.minutes > 0) {
                    bg = 'bg-sky-500/20 border-sky-500/40 theme-accent font-medium';
                  }

                  return (
                    <div
                      key={day.dateStr}
                      className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${bg}`}
                      title={`${day.dateStr}: ${day.minutes} min typed`}
                    >
                      <span className="text-[10px] font-mono leading-none">{day.dayNum}</span>
                      <span className="text-[9px] mt-0.5 opacity-80">{day.minutes > 0 ? `${day.minutes}m` : '—'}</span>
                    </div>
                  );
                })}
              </div>

              {/* Practice guidance card */}
              <div className="mt-4 p-3.5 rounded-xl border theme-border theme-subtle text-xs theme-text space-y-1.5">
                <div className="font-semibold theme-text">How to break plateaus:</div>
                <div className="theme-text-muted leading-relaxed">
                  1. Prioritize 97%+ accuracy before pushing raw speed.<br />
                  2. Keep hands relaxed without tensing wrists or pounding keys.<br />
                  3. Dedicate 10 minutes every day rather than 1 hour once a week.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Tests Log Table */}
      <div className="p-6 rounded-2xl theme-surface border theme-border shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-semibold theme-text">Detailed Test History Log</h2>
            <p className="text-xs theme-text-muted mt-0.5">Filter and review each individual test</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 theme-subtle rounded-lg border theme-border text-xs">
            <Filter className="w-3.5 h-3.5 theme-text-muted ml-1.5" />
            {(['all', 'time', 'words', 'quote'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                  historyFilter === f ? 'theme-surface theme-accent font-semibold shadow-xs' : 'theme-text-muted hover:theme-text'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b theme-border theme-text-muted font-medium">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Mode</th>
                  <th className="py-2.5 px-3 text-right">WPM</th>
                  <th className="py-2.5 px-3 text-right">Accuracy</th>
                  <th className="py-2.5 px-3 text-right">Raw WPM</th>
                  <th className="py-2.5 px-3 text-right">Consistency</th>
                  <th className="py-2.5 px-3 text-right">Duration</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border font-mono tabular-nums">
                {filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:theme-subtle transition-colors">
                    <td className="py-2.5 px-3 theme-text-muted font-sans">
                      {new Date(rec.timestamp).toLocaleDateString()} {new Date(rec.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 px-3 capitalize font-sans theme-text">
                      {rec.mode} <span className="theme-text-muted">({rec.modeParam})</span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold theme-text text-sm">
                      {rec.wpm}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400">
                      {rec.accuracy}%
                    </td>
                    <td className="py-2.5 px-3 text-right theme-text-muted">
                      {rec.rawWpm}
                    </td>
                    <td className="py-2.5 px-3 text-right theme-text-muted">
                      {rec.consistency || 88}%
                    </td>
                    <td className="py-2.5 px-3 text-right theme-text-muted">
                      {rec.durationSeconds}s
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onDeleteRecord(rec.id)}
                        className="p-1 rounded theme-text-muted hover:text-rose-400 hover:theme-subtle transition-colors"
                        title="Delete test record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs theme-text-muted">
            No typing records recorded yet. Start a test to begin tracking your progress!
          </div>
        )}
      </div>
    </div>
  );
};
