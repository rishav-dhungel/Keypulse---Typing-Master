import React, { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  Star,
  CheckCircle2,
  Lock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Play,
  Award,
} from 'lucide-react';
import { AcademyLesson, LessonProgress, UserSettings } from '../../types';
import { playErrorSound, playKeySound } from '../../utils/audio';
import { ACADEMY_LESSONS } from '../../utils/wordBanks';
import { VirtualKeyboard } from './VirtualKeyboard';

interface TouchTypingAcademyProps {
  settings: UserSettings;
  lessonProgress: Record<string, LessonProgress>;
  onSaveProgress: (progress: LessonProgress) => void;
  onActivityDone: (durationSeconds: number, wpm: number) => void;
}

export const TouchTypingAcademy: React.FC<TouchTypingAcademyProps> = ({
  settings,
  lessonProgress,
  onSaveProgress,
  onActivityDone,
}) => {
  const [selectedLesson, setSelectedLesson] = useState<AcademyLesson | null>(null);

  // Lesson interactive typing state
  const [typedChars, setTypedChars] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isLessonFinished, setIsLessonFinished] = useState(false);
  const [lastLessonResult, setLastLessonResult] = useState<{
    wpm: number;
    accuracy: number;
    stars: number;
    passed: boolean;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Completed lesson count
  const completedCount = Object.values(lessonProgress).filter((p) => p.completed).length;

  const startLesson = (lesson: AcademyLesson) => {
    setSelectedLesson(lesson);
    setTypedChars('');
    setStartTime(null);
    setIsLessonFinished(false);
    setLastLessonResult(null);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedLesson || isLessonFinished) return;
    const value = e.target.value;

    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }

    const prevLength = typedChars.length;
    const isForward = value.length > prevLength;

    if (isForward) {
      const newChar = value[value.length - 1];
      const targetChar = selectedLesson.text[value.length - 1];

      if (newChar === targetChar) {
        if (settings.soundEnabled) playKeySound(settings.soundType, settings.soundVolume);
      } else {
        if (settings.soundEnabled) playErrorSound(settings.soundVolume);
      }
    }

    setTypedChars(value);

    // Check completion
    if (value.length >= selectedLesson.text.length) {
      finishLesson(value);
    }
  };

  const finishLesson = useCallback(
    (finalTyped: string) => {
      if (!selectedLesson) return;
      setIsLessonFinished(true);

      const elapsed = startTime ? Math.max(1, (Date.now() - startTime) / 1000) : 1;
      let correct = 0;
      for (let i = 0; i < finalTyped.length; i++) {
        if (finalTyped[i] === selectedLesson.text[i]) {
          correct++;
        }
      }

      const accuracy = Number(((correct / finalTyped.length) * 100).toFixed(1));
      const wpm = Math.round((correct / 5) / (elapsed / 60));

      const passed = accuracy >= selectedLesson.targetAccuracy;
      let stars = 1;
      if (accuracy >= 98 && wpm >= selectedLesson.minWpm + 5) {
        stars = 3;
      } else if (accuracy >= selectedLesson.targetAccuracy && wpm >= selectedLesson.minWpm) {
        stars = 2;
      }

      const progress: LessonProgress = {
        lessonId: selectedLesson.id,
        completed: passed,
        bestWpm: wpm,
        bestAccuracy: accuracy,
        stars,
      };

      if (passed) {
        onSaveProgress(progress);
        onActivityDone(Math.round(elapsed), wpm);
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      }

      setLastLessonResult({ wpm, accuracy, stars, passed });
    },
    [selectedLesson, startTime, onSaveProgress, onActivityDone]
  );

  // Group lessons by stage
  const stages = [1, 2, 3, 4, 5, 6].map((stageId) => {
    const stageLessons = ACADEMY_LESSONS.filter((l) => l.stageId === stageId);
    const stageTitle = stageLessons[0]?.stageTitle || `Stage ${stageId}`;
    return {
      stageId,
      stageTitle,
      lessons: stageLessons,
    };
  });

  const nextLesson = () => {
    if (!selectedLesson) return;
    const currentIdx = ACADEMY_LESSONS.findIndex((l) => l.id === selectedLesson.id);
    if (currentIdx < ACADEMY_LESSONS.length - 1) {
      startLesson(ACADEMY_LESSONS[currentIdx + 1]);
    }
  };

  const currentTargetChar = selectedLesson && typedChars.length < selectedLesson.text.length
    ? selectedLesson.text[typedChars.length]
    : '';

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 space-y-8 select-none">
      {/* Academy Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b theme-border">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 theme-accent" />
            <h1 className="text-xl font-bold tracking-tight theme-text">Touch Typing Academy</h1>
          </div>
          <p className="text-xs theme-text-muted mt-0.5">
            Learn blind touch typing from scratch. Master the home row, finger placement, and build lasting speed.
          </p>
        </div>

        {/* Progress pill */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl theme-surface border theme-border text-xs theme-text">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Curriculum Progress:</span>
          <span className="font-mono font-bold theme-text tabular-nums">
            {completedCount} / {ACADEMY_LESSONS.length}
          </span>
          <span className="theme-text-muted">
            ({Math.round((completedCount / ACADEMY_LESSONS.length) * 100)}%)
          </span>
        </div>
      </div>

      {/* If a lesson is currently open */}
      {selectedLesson ? (
        <div className="p-6 sm:p-8 rounded-2xl theme-surface border theme-border shadow-md space-y-6 animate-in fade-in duration-150">
          {/* Lesson Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b theme-border">
            <div>
              <div className="text-[11px] uppercase tracking-wider theme-accent font-semibold">
                {selectedLesson.stageTitle}
              </div>
              <h2 className="text-lg font-bold theme-text mt-0.5">{selectedLesson.title}</h2>
              <p className="text-xs theme-text-muted mt-1">{selectedLesson.description}</p>
            </div>

            <button
              onClick={() => setSelectedLesson(null)}
              className="px-3 py-1.5 rounded-xl border theme-border theme-subtle theme-text hover:brightness-110 text-xs font-medium transition-colors"
            >
              Exit Lesson
            </button>
          </div>

          {!isLessonFinished ? (
            <div className="space-y-6">
              {/* Finger placement coaching alert */}
              <div className="p-3.5 rounded-xl border theme-border theme-subtle text-xs theme-text flex items-center justify-between">
                <span>{selectedLesson.fingerHints}</span>
                <span className="font-mono theme-text-muted">
                  Target: {selectedLesson.targetAccuracy}% Acc · {selectedLesson.minWpm} WPM
                </span>
              </div>

              {/* Typing Arena Box */}
              <div
                onClick={() => inputRef.current?.focus()}
                className="p-6 rounded-xl border theme-border theme-surface font-mono text-xl sm:text-2xl leading-relaxed tracking-wider cursor-text relative min-h-[110px]"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={typedChars}
                  onChange={handleInputChange}
                  className="absolute inset-0 opacity-0 pointer-events-none"
                  autoFocus
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  spellCheck="false"
                />

                {selectedLesson.text.split('').map((char, idx) => {
                  const isTyped = idx < typedChars.length;
                  const isCurrent = idx === typedChars.length;
                  const isCorrect = isTyped && typedChars[idx] === char;

                  let charStyle: React.CSSProperties = {
                    color: isCurrent ? 'var(--theme-text-main)' : 'var(--char-future)',
                    fontWeight: isCurrent ? 600 : 400,
                  };
                  if (isTyped) {
                    charStyle = isCorrect
                      ? { color: 'var(--char-correct)' }
                      : { color: 'var(--char-wrong)', backgroundColor: 'var(--char-wrong-bg)', borderRadius: '3px' };
                  }

                  return (
                    <span key={idx} className="relative inline-block w-[1ch] text-center">
                      {isCurrent && (
                        <span
                          className="absolute -left-[1px] top-1 bottom-1 w-[2px] rounded-full pointer-events-none caret-blink z-20"
                          style={{ backgroundColor: 'var(--caret)', boxShadow: '0 0 8px var(--caret)' }}
                        />
                      )}
                      <span className="relative z-10" style={charStyle}>{char}</span>
                    </span>
                  );
                })}
              </div>

              {/* Interactive Virtual Keyboard showing finger guidance */}
              <div className="pt-2">
                <VirtualKeyboard activeKey={currentTargetChar} showFingerGuide={true} />
              </div>
            </div>
          ) : (
            /* Lesson Finished Card */
            lastLessonResult && (
              <div className="p-6 rounded-2xl border theme-border theme-surface text-center space-y-5 shadow-md">
                <div className="flex justify-center gap-1.5">
                  {[1, 2, 3].map((star) => (
                    <Star
                      key={star}
                      className={`w-7 h-7 ${
                        star <= lastLessonResult.stars
                          ? 'text-amber-400 fill-amber-400 animate-bounce'
                          : 'theme-text-muted opacity-30'
                      }`}
                    />
                  ))}
                </div>

                <div>
                  <h3 className="text-xl font-bold theme-text">
                    {lastLessonResult.passed ? 'Lesson Mastered!' : 'Target Accuracy Not Met'}
                  </h3>
                  <p className="text-xs theme-text-muted mt-1">
                    {lastLessonResult.passed
                      ? 'Solid finger rhythm! You have successfully mastered this touch drill.'
                      : `Keep practicing! You achieved ${lastLessonResult.accuracy}% (Required: ${selectedLesson.targetAccuracy}%).`}
                  </p>
                </div>

                <div className="flex justify-center gap-8 font-mono text-center">
                  <div>
                    <div className="text-[11px] theme-text-muted">ACCURACY</div>
                    <div className="text-2xl font-bold text-emerald-400">{lastLessonResult.accuracy}%</div>
                  </div>
                  <div>
                    <div className="text-[11px] theme-text-muted">SPEED</div>
                    <div className="text-2xl font-bold theme-text">{lastLessonResult.wpm} WPM</div>
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-center gap-3">
                  <button
                    onClick={() => startLesson(selectedLesson)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border theme-border theme-subtle theme-text text-xs font-medium hover:brightness-110 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>

                  {lastLessonResult.passed && (
                    <button
                      onClick={nextLesson}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg theme-btn-accent text-xs font-semibold transition-colors shadow-sm"
                    >
                      <span>Next Lesson</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        /* Stages & Curriculum Overview */
        <div className="space-y-6">
          {stages.map((stage) => (
            <div
              key={stage.stageId}
              className="p-6 rounded-2xl theme-surface border theme-border shadow-xs"
            >
              <div className="flex items-center justify-between pb-3 border-b theme-border mb-4">
                <h2 className="text-sm font-semibold theme-text tracking-wide">{stage.stageTitle}</h2>
                <span className="text-xs theme-text-muted">
                  {stage.lessons.filter((l) => lessonProgress[l.id]?.completed).length} / {stage.lessons.length} Completed
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {stage.lessons.map((lesson) => {
                  const progress = lessonProgress[lesson.id];
                  const isCompleted = progress?.completed;

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => startLesson(lesson)}
                      className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                        isCompleted
                          ? 'theme-border theme-subtle opacity-90 hover:opacity-100'
                          : 'theme-border theme-surface hover:theme-subtle hover:border-current'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-xs font-semibold theme-text truncate">{lesson.title}</h3>
                          <p className="text-[11px] theme-text-muted mt-1 line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>

                        {isCompleted ? (
                          <div className="flex items-center gap-1 shrink-0 text-amber-400">
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= (progress.stars || 1) ? 'fill-amber-400' : 'theme-text-muted opacity-30'
                                }`}
                              />
                            ))}
                          </div>
                        ) : (
                          <Play className="w-4 h-4 theme-accent shrink-0 opacity-80" />
                        )}
                      </div>

                      <div className="mt-3 pt-2.5 border-t theme-border flex items-center justify-between text-[11px] theme-text-muted font-mono">
                        <div className="flex items-center gap-1.5">
                          <span>Focus:</span>
                          <span className="theme-accent font-medium">
                            {lesson.newKeys.join(' ') || 'Mixed'}
                          </span>
                        </div>

                        {isCompleted && (
                          <span className="text-emerald-400">
                            Best: {progress.bestWpm} WPM · {progress.bestAccuracy}%
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
