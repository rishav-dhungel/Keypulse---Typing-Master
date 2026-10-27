import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Flame,
  Target,
  Zap,
  Clock,
  Type,
  Quote,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import {
  QuoteLength,
  TestMode,
  TimeDuration,
  TypingRecord,
  UserSettings,
  WordCount,
} from '../../types';
import { playErrorSound, playKeySound } from '../../utils/audio';
import { getRandomWords, getRandomQuote, generateWeakKeysText, ENGLISH_200 } from '../../utils/wordBanks';

interface TypingArenaProps {
  settings: UserSettings;
  records: TypingRecord[];
  onTestComplete: (record: TypingRecord) => void;
  onNavigateToDashboard: () => void;
  initialMode?: TestMode;
}

export const TypingArena: React.FC<TypingArenaProps> = ({
  settings,
  records,
  onTestComplete,
  onNavigateToDashboard,
  initialMode = 'time',
}) => {
  // Mode configuration
  const [mode, setMode] = useState<TestMode>(initialMode);
  const [timeDuration, setTimeDuration] = useState<TimeDuration>(30);
  const [wordCount, setWordCount] = useState<WordCount>(25);
  const [quoteLength, setQuoteLength] = useState<QuoteLength>('medium');
  const [quoteAuthor, setQuoteAuthor] = useState<string>('');

  // Typing test state
  const [targetText, setTargetText] = useState<string>('');
  const [typedChars, setTypedChars] = useState<string>('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(true);

  // Tracking mistakes and speed samples for timeline graph
  const [missedKeys, setMissedKeys] = useState<Record<string, number>>({});
  const [speedSamples, setSpeedSamples] = useState<{ second: number; wpm: number; rawWpm: number; errors: number }[]>([]);
  const [lastFinishedRecord, setLastFinishedRecord] = useState<TypingRecord | null>(null);

  // References & Window Scrolling
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsWrapperRef = useRef<HTMLDivElement>(null);
  const activeWordRef = useRef<HTMLSpanElement>(null);
  const timerIntervalRef = useRef<number | null>(null);

  const [scrollOffset, setScrollOffset] = useState<number>(0);

  // Initialize or reset test text
  const setupNewTest = useCallback(
    (customText?: string) => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      let text = '';
      if (customText) {
        text = customText;
      } else if (mode === 'time') {
        const count = Math.max(70, timeDuration * 3.5);
        text = getRandomWords(count, ENGLISH_200).join(' ');
      } else if (mode === 'words') {
        text = getRandomWords(wordCount, ENGLISH_200).join(' ');
      } else if (mode === 'quote') {
        const q = getRandomQuote(quoteLength);
        text = q.text;
        setQuoteAuthor(q.author);
      } else if (mode === 'weak-keys') {
        const aggWeak: Record<string, number> = {};
        records.forEach((r) => {
          Object.entries(r.missTypedKeys || {}).forEach(([k, cnt]) => {
            aggWeak[k] = (aggWeak[k] || 0) + cnt;
          });
        });
        text = generateWeakKeysText(aggWeak, 30);
      }

      setTargetText(text);
      setTypedChars('');
      setStartTime(null);
      setTimeLeft(mode === 'time' ? timeDuration : 0);
      setIsFinished(false);
      setMissedKeys({});
      setSpeedSamples([]);
      setLastFinishedRecord(null);
      setScrollOffset(0);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    },
    [mode, timeDuration, wordCount, quoteLength, records]
  );

  useEffect(() => {
    setupNewTest();
  }, [mode, timeDuration, wordCount, quoteLength]);

  const personalBest = records.length > 0 ? Math.max(...records.map((r) => r.wpm)) : 0;

  // Real-time calculation helpers
  const calculateLiveStats = useCallback(() => {
    if (!startTime) return { liveWpm: 0, liveRawWpm: 0, liveAccuracy: 100, correctChars: 0, errorCount: 0 };

    const elapsedSeconds = Math.max(0.5, (Date.now() - startTime) / 1000);
    let correctChars = 0;
    let errorCount = 0;

    for (let i = 0; i < typedChars.length; i++) {
      if (i < targetText.length) {
        if (typedChars[i] === targetText[i]) {
          correctChars++;
        } else {
          errorCount++;
        }
      } else {
        errorCount++;
      }
    }

    const liveRawWpm = Math.round((typedChars.length / 5) / (elapsedSeconds / 60));
    const liveWpm = Math.max(0, Math.round((correctChars / 5) / (elapsedSeconds / 60)));
    const liveAccuracy = typedChars.length > 0 ? Math.round((correctChars / typedChars.length) * 100) : 100;

    return { liveWpm, liveRawWpm, liveAccuracy, correctChars, errorCount };
  }, [startTime, typedChars, targetText]);

  // Finalize test and record metrics
  const finishTest = useCallback(
    (durationSec: number) => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setIsFinished(true);

      const elapsed = Math.max(1, durationSec);
      let correctCount = 0;
      let errorCount = 0;

      for (let i = 0; i < typedChars.length; i++) {
        if (i < targetText.length && typedChars[i] === targetText[i]) {
          correctCount++;
        } else {
          errorCount++;
        }
      }

      const rawWpm = Math.round((typedChars.length / 5) / (elapsed / 60));
      const wpm = Math.max(0, Math.round((correctCount / 5) / (elapsed / 60)));
      const accuracy = typedChars.length > 0 ? Number(((correctCount / typedChars.length) * 100).toFixed(1)) : 100;

      let consistency = 88;
      if (speedSamples.length > 3) {
        const wpms = speedSamples.map((s) => s.wpm);
        const mean = wpms.reduce((a, b) => a + b, 0) / wpms.length;
        const variance = wpms.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / wpms.length;
        const stdDev = Math.sqrt(variance);
        consistency = Math.max(40, Math.min(99, Math.round(100 - (stdDev / (mean || 1)) * 100)));
      }

      const record: TypingRecord = {
        id: `rec-${Date.now()}`,
        timestamp: Date.now(),
        wpm,
        netWpm: wpm,
        rawWpm,
        accuracy,
        durationSeconds: Math.round(elapsed),
        mode,
        modeParam: mode === 'time' ? timeDuration : mode === 'words' ? wordCount : quoteLength,
        errorCount,
        correctCount,
        totalChars: typedChars.length,
        consistency,
        missTypedKeys: missedKeys,
        speedTimeline: speedSamples,
      };

      setLastFinishedRecord(record);
      onTestComplete(record);

      if (wpm > personalBest && personalBest > 0) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } else if (accuracy >= 98 && wpm > 40) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      }
    },
    [typedChars, targetText, mode, timeDuration, wordCount, quoteLength, missedKeys, speedSamples, onTestComplete, personalBest]
  );

  // Timer loop for time mode & timeline sampling
  useEffect(() => {
    if (!startTime || isFinished) return;

    timerIntervalRef.current = window.setInterval(() => {
      const elapsedSec = (Date.now() - startTime) / 1000;
      const currentStats = calculateLiveStats();
      setSpeedSamples((prev) => [
        ...prev,
        {
          second: Math.round(elapsedSec),
          wpm: currentStats.liveWpm,
          rawWpm: currentStats.liveRawWpm,
          errors: currentStats.errorCount,
        },
      ]);

      if (mode === 'time') {
        const remaining = Math.max(0, Math.ceil(timeDuration - elapsedSec));
        setTimeLeft(remaining);
        if (remaining <= 0) {
          finishTest(timeDuration);
        }
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [startTime, isFinished, mode, timeDuration, finishTest, calculateLiveStats]);

  // Handle typing input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const value = e.target.value;

    if (!startTime && value.length > 0) {
      setStartTime(Date.now());
    }

    const prevLength = typedChars.length;
    const isForward = value.length > prevLength;

    if (isForward) {
      const newChar = value[value.length - 1];
      const targetChar = targetText[value.length - 1];

      if (newChar === targetChar) {
        if (settings.soundEnabled) {
          playKeySound(settings.soundType, settings.soundVolume);
        }
      } else {
        if (settings.soundEnabled) {
          playErrorSound(settings.soundVolume);
        }
        if (targetChar) {
          setMissedKeys((prev) => ({
            ...prev,
            [targetChar.toLowerCase()]: (prev[targetChar.toLowerCase()] || 0) + 1,
          }));
        }
      }
    }

    setTypedChars(value);

    // Continuous word replenishment for time mode so user never runs out of words
    if (mode === 'time' && targetText.length - value.length < 140) {
      const extraWords = getRandomWords(35, ENGLISH_200).join(' ');
      setTargetText((prev) => prev + ' ' + extraWords);
    }

    if ((mode === 'words' || mode === 'quote' || mode === 'weak-keys') && value.length >= targetText.length) {
      const elapsed = startTime ? (Date.now() - startTime) / 1000 : 1;
      finishTest(elapsed);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === settings.quickRestartKey) {
        e.preventDefault();
        setupNewTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.quickRestartKey, setupNewTest]);

  const { liveWpm, liveAccuracy } = calculateLiveStats();

  // Structured words mapping with exact char indices
  const parsedWords = useMemo(() => {
    const list: {
      wordIndex: number;
      chars: { char: string; index: number }[];
      hasTrailingSpace: boolean;
      spaceIndex?: number;
      startIndex: number;
      endIndex: number;
    }[] = [];

    const rawWords = targetText.split(' ');
    let curIndex = 0;
    for (let i = 0; i < rawWords.length; i++) {
      const w = rawWords[i];
      const chars: { char: string; index: number }[] = [];
      const startIndex = curIndex;
      for (let c = 0; c < w.length; c++) {
        chars.push({ char: w[c], index: curIndex });
        curIndex++;
      }
      const endIndex = curIndex;
      const hasTrailingSpace = i < rawWords.length - 1;
      const spaceIndex = hasTrailingSpace ? curIndex : undefined;
      if (hasTrailingSpace) {
        curIndex++;
      }
      list.push({
        wordIndex: i,
        chars,
        hasTrailingSpace,
        spaceIndex,
        startIndex,
        endIndex,
      });
    }
    return list;
  }, [targetText]);

  // Find active word index based on typed length
  const activeWordIndex = useMemo(() => {
    const typedLen = typedChars.length;
    for (let i = 0; i < parsedWords.length; i++) {
      const pw = parsedWords[i];
      const maxWordIndex = pw.hasTrailingSpace && pw.spaceIndex !== undefined ? pw.spaceIndex : pw.endIndex;
      if (typedLen <= maxWordIndex) {
        return i;
      }
    }
    return Math.max(0, parsedWords.length - 1);
  }, [parsedWords, typedChars.length]);

  // Smooth line-by-line scrolling to maintain a pristine 3-line focus area
  useEffect(() => {
    if (!activeWordRef.current || !wordsWrapperRef.current) return;

    const wrapper = wordsWrapperRef.current;
    const activeWord = activeWordRef.current;

    const firstWord = wrapper.querySelector('.word') as HTMLElement | null;
    if (!firstWord) return;

    const firstLineTop = firstWord.offsetTop;
    const currentWordTop = activeWord.offsetTop;
    const lineDiff = currentWordTop - firstLineTop;

    // Single line height: measure from active word height or fallback
    const singleLineHeight = activeWord.offsetHeight > 20 ? activeWord.offsetHeight : 38;

    if (lineDiff > singleLineHeight * 1.3) {
      // Current word is on Line 3 or deeper: scroll so it sits cleanly on Line 2
      const targetOffset = lineDiff - singleLineHeight;
      setScrollOffset(targetOffset);
    } else {
      // Line 1 or Line 2: keep at top
      setScrollOffset(0);
    }
  }, [typedChars, targetText, activeWordIndex]);

  // Window resize handler to maintain line scroll alignment
  useEffect(() => {
    const handleResize = () => {
      if (!activeWordRef.current || !wordsWrapperRef.current) return;
      const wrapper = wordsWrapperRef.current;
      const activeWord = activeWordRef.current;
      const firstWord = wrapper.querySelector('.word') as HTMLElement | null;
      if (!firstWord) return;
      const firstLineTop = firstWord.offsetTop;
      const lineDiff = activeWord.offsetTop - firstLineTop;
      const singleLineHeight = activeWord.offsetHeight > 20 ? activeWord.offsetHeight : 38;
      if (lineDiff > singleLineHeight * 1.3) {
        setScrollOffset(lineDiff - singleLineHeight);
      } else {
        setScrollOffset(0);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCaretClass = () => {
    switch (settings.caretStyle) {
      case 'block':
        return 'absolute inset-0 rounded-[3px] pointer-events-none caret-blink z-0';
      case 'underline':
        return 'absolute -bottom-0.5 inset-x-0 h-[2.5px] rounded-full pointer-events-none caret-blink z-20';
      case 'line':
      default:
        return 'absolute -left-[1.5px] top-[10%] bottom-[10%] w-[2.5px] rounded-full pointer-events-none caret-blink z-20';
    }
  };

  const getCaretStyle = (): React.CSSProperties => {
    if (settings.caretStyle === 'block') {
      return {
        backgroundColor: 'var(--caret)',
        opacity: 0.22,
        boxShadow: '0 0 0 1px var(--caret), 0 0 8px var(--theme-accent-glow)',
      };
    }
    return {
      backgroundColor: 'var(--caret)',
      boxShadow: '0 0 8px var(--caret)',
    };
  };

  const containerHeightClass = {
    sm: 'h-[110px]',
    base: 'h-[135px]',
    lg: 'h-[160px]',
    xl: 'h-[190px]',
  }[settings.fontSize || 'base'];

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center py-6 px-4 select-none">
      {/* Top Test Configuration Bar */}
      {!isFinished && (
        <div className="w-full max-w-3xl mb-8 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Mode Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl theme-surface border theme-border shadow-xs">
            <button
              onClick={() => setMode('time')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                mode === 'time'
                  ? 'theme-btn-accent shadow-xs'
                  : 'theme-text-muted hover:theme-text'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Time</span>
            </button>
            <button
              onClick={() => setMode('words')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                mode === 'words'
                  ? 'theme-btn-accent shadow-xs'
                  : 'theme-text-muted hover:theme-text'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Words</span>
            </button>
            <button
              onClick={() => setMode('quote')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                mode === 'quote'
                  ? 'theme-btn-accent shadow-xs'
                  : 'theme-text-muted hover:theme-text'
              }`}
            >
              <Quote className="w-3.5 h-3.5" />
              <span>Quote</span>
            </button>
            <button
              onClick={() => setMode('weak-keys')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors ${
                mode === 'weak-keys'
                  ? 'theme-btn-accent shadow-xs'
                  : 'theme-text-muted hover:theme-text'
              }`}
              title="Practice words targeting your most frequently missed keys"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Weak Drill</span>
            </button>
          </div>

          {/* Mode Sub-Parameters */}
          <div className="flex items-center gap-1 p-1 rounded-xl theme-surface border theme-border shadow-xs">
            {mode === 'time' && (
              <>
                {([15, 30, 60, 120] as TimeDuration[]).map((dur) => (
                  <button
                    key={dur}
                    onClick={() => setTimeDuration(dur)}
                    className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                      timeDuration === dur
                        ? 'theme-accent font-bold theme-subtle'
                        : 'theme-text-muted hover:theme-text'
                    }`}
                  >
                    {dur}s
                  </button>
                ))}
              </>
            )}

            {mode === 'words' && (
              <>
                {([10, 25, 50, 100] as WordCount[]).map((count) => (
                  <button
                    key={count}
                    onClick={() => setWordCount(count)}
                    className={`px-2.5 py-1 rounded-lg font-mono transition-colors ${
                      wordCount === count
                        ? 'theme-accent font-bold theme-subtle'
                        : 'theme-text-muted hover:theme-text'
                    }`}
                  >
                    {count}
                  </button>
                ))}
              </>
            )}

            {mode === 'quote' && (
              <>
                {(['all', 'short', 'medium', 'long'] as QuoteLength[]).map((len) => (
                  <button
                    key={len}
                    onClick={() => setQuoteLength(len)}
                    className={`px-2.5 py-1 rounded-lg capitalize transition-colors ${
                      quoteLength === len
                        ? 'theme-accent font-bold theme-subtle'
                        : 'theme-text-muted hover:theme-text'
                    }`}
                  >
                    {len}
                  </button>
                ))}
              </>
            )}

            {mode === 'weak-keys' && (
              <span className="px-2.5 py-1 text-[11px] theme-accent font-medium">Adaptive Drill</span>
            )}
          </div>
        </div>
      )}

      {/* Main Focus Typing Arena */}
      {!isFinished ? (
        <div
          ref={containerRef}
          onClick={() => inputRef.current?.focus()}
          className="relative w-full max-w-4xl p-6 sm:p-8 rounded-2xl theme-surface border theme-border shadow-sm cursor-text transition-all"
        >
          {/* Subtle Live Stats Indicator */}
          {startTime && (
            <div className="flex items-center gap-6 mb-4 text-sm font-mono theme-text-muted tabular-nums">
              {mode === 'time' && (
                <div className="flex items-center gap-1.5 theme-accent font-bold text-lg">
                  <Clock className="w-4 h-4" />
                  <span>{timeLeft}s</span>
                </div>
              )}
              {mode !== 'time' && (
                <div className="flex items-center gap-1.5">
                  <span>{typedChars.length}</span>
                  <span className="opacity-50">/</span>
                  <span>{targetText.length}</span>
                </div>
              )}
              {settings.showLiveWpm && (
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 theme-accent" />
                  <span>{liveWpm} WPM</span>
                </div>
              )}
              {settings.showLiveAccuracy && (
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{liveAccuracy}% ACC</span>
                </div>
              )}
            </div>
          )}

          {/* Hidden Input */}
          <input
            ref={inputRef}
            type="text"
            value={typedChars}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="absolute inset-0 opacity-0 cursor-default pointer-events-none"
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            spellCheck="false"
          />

          {/* Focus Notification */}
          {!isFocused && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-xs rounded-2xl">
              <div className="px-4 py-2 rounded-xl theme-surface border theme-border text-xs theme-accent font-medium shadow-lg">
                Click anywhere or press any key to focus
              </div>
            </div>
          )}

          {/* Focused 3-Line Text Stream Viewport */}
          <div className={`relative w-full ${containerHeightClass} overflow-hidden select-none`}>
            {/* Top fade mask when scrolled */}
            {scrollOffset > 0 && (
              <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[var(--theme-surface)] to-transparent z-10 opacity-80 transition-opacity duration-200" />
            )}
            {/* Bottom fade mask */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[var(--theme-surface)] to-transparent z-10 opacity-80" />

            {/* Sliding Words Wrapper */}
            <div
              ref={wordsWrapperRef}
              style={{
                transform: `translateY(-${scrollOffset}px)`,
                transition: 'transform 0.18s cubic-bezier(0.2, 0, 0, 1)',
              }}
              className={`font-mono leading-relaxed tracking-normal flex flex-wrap content-start ${
                settings.fontSize === 'sm'
                  ? 'text-lg sm:text-xl'
                  : settings.fontSize === 'lg'
                  ? 'text-2xl sm:text-3xl'
                  : settings.fontSize === 'xl'
                  ? 'text-3xl sm:text-4xl'
                  : 'text-xl sm:text-2xl'
              }`}
            >
              {parsedWords.map((word) => {
                const isActive = word.wordIndex === activeWordIndex;
                return (
                  <span
                    key={word.wordIndex}
                    ref={isActive ? activeWordRef : null}
                    className="word inline-flex items-center my-0.5"
                  >
                    {word.chars.map(({ char, index }) => {
                      const isTyped = index < typedChars.length;
                      const isCurrent = index === typedChars.length;
                      const isCorrect = isTyped && typedChars[index] === char;

                      let charStyle: React.CSSProperties = {
                        color: isCurrent ? 'var(--theme-text-main)' : 'var(--char-future)',
                        fontWeight: isCurrent ? 600 : 400,
                        transition: 'color 0.05s ease',
                      };

                      if (isTyped) {
                        if (isCorrect) {
                          charStyle = { color: 'var(--char-correct)' };
                        } else {
                          charStyle = {
                            color: 'var(--char-wrong)',
                            backgroundColor: 'var(--char-wrong-bg)',
                            borderRadius: '2px',
                            textDecoration: 'underline',
                          };
                        }
                      }

                      return (
                        <span key={index} className="relative inline-block w-[1ch] text-center">
                          {isCurrent && (
                            <span
                              className={getCaretClass()}
                              style={getCaretStyle()}
                            />
                          )}
                          <span
                            className={`relative z-10 transition-colors duration-75 ${
                              isCurrent ? 'drop-shadow-xs font-semibold' : ''
                            }`}
                            style={charStyle}
                          >
                            {char}
                          </span>
                        </span>
                      );
                    })}

                    {/* Trailing space between words */}
                    {word.hasTrailingSpace && word.spaceIndex !== undefined && (
                      <span className="relative inline-block w-[1ch] text-center">
                        {typedChars.length === word.spaceIndex && (
                          <span
                            className={getCaretClass()}
                            style={getCaretStyle()}
                          />
                        )}
                        <span
                          style={{
                            color:
                              typedChars.length > word.spaceIndex
                                ? typedChars[word.spaceIndex] === ' '
                                  ? 'transparent'
                                  : 'var(--char-wrong)'
                                : 'transparent',
                            backgroundColor:
                              typedChars.length > word.spaceIndex && typedChars[word.spaceIndex] !== ' '
                                ? 'var(--char-wrong-bg)'
                                : 'transparent',
                            borderRadius: '2px',
                            textDecoration:
                              typedChars.length > word.spaceIndex && typedChars[word.spaceIndex] !== ' '
                                ? 'underline'
                                : 'none',
                          }}
                          className="relative z-10 inline-block w-[1ch] text-center"
                        >
                          {typedChars.length > word.spaceIndex && typedChars[word.spaceIndex] !== ' '
                            ? typedChars[word.spaceIndex]
                            : '\u00A0'}
                        </span>
                      </span>
                    )}
                  </span>
                );
              })}

              {/* Extra trailing mistyped characters if user types past text length */}
              {typedChars.length > targetText.length && (
                <span
                  style={{
                    color: 'var(--char-wrong)',
                    backgroundColor: 'var(--char-wrong-bg)',
                    borderRadius: '3px',
                  }}
                  className="my-0.5 inline-block"
                >
                  {typedChars.slice(targetText.length)}
                </span>
              )}
            </div>
          </div>

          {/* Quote attribution */}
          {mode === 'quote' && quoteAuthor && (
            <div className="mt-6 text-right text-xs italic theme-text-muted font-sans">
              — {quoteAuthor}
            </div>
          )}

          {/* Quick Restart Hint */}
          <div className="mt-10 flex items-center justify-center gap-4 text-xs theme-text-muted select-none">
            <button
              onClick={() => setupNewTest()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border theme-border theme-subtle hover:brightness-110 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Test</span>
            </button>
            <span className="opacity-50">·</span>
            <span>
              Press <kbd className="px-1.5 py-0.5 rounded theme-subtle border theme-border theme-text font-mono text-[11px]">{settings.quickRestartKey}</kbd> to quick restart
            </span>
          </div>
        </div>
      ) : (
        /* Results Summary Screen */
        lastFinishedRecord && (
          <div className="w-full max-w-3xl p-6 sm:p-8 rounded-2xl theme-surface border theme-border shadow-md animate-in fade-in duration-200">
            {/* Header score strip */}
            <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b theme-border">
              <div>
                <div className="text-xs uppercase tracking-wider theme-accent font-semibold">Test Complete</div>
                <div className="mt-1 flex items-baseline gap-3">
                  <span className="text-5xl sm:text-6xl font-bold font-mono tracking-tight theme-text tabular-nums">
                    {lastFinishedRecord.wpm}
                  </span>
                  <span className="text-sm font-semibold theme-accent uppercase">WPM</span>
                  {lastFinishedRecord.wpm > personalBest && personalBest > 0 && (
                    <span className="ml-2 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/40">
                      <Flame className="w-3.5 h-3.5" /> New Personal Best!
                    </span>
                  )}
                </div>
              </div>

              {/* Secondary stats */}
              <div className="grid grid-cols-3 gap-6 text-right font-mono tabular-nums">
                <div>
                  <div className="text-[11px] theme-text-muted uppercase tracking-wide">Accuracy</div>
                  <div className="text-2xl font-bold text-emerald-400 mt-0.5">{lastFinishedRecord.accuracy}%</div>
                </div>
                <div>
                  <div className="text-[11px] theme-text-muted uppercase tracking-wide">Raw WPM</div>
                  <div className="text-2xl font-bold theme-text mt-0.5">{lastFinishedRecord.rawWpm}</div>
                </div>
                <div>
                  <div className="text-[11px] theme-text-muted uppercase tracking-wide">Consistency</div>
                  <div className="text-2xl font-bold theme-accent mt-0.5">{lastFinishedRecord.consistency}%</div>
                </div>
              </div>
            </div>

            {/* Performance Sparkline SVG */}
            {lastFinishedRecord.speedTimeline.length > 2 && (
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs theme-text-muted mb-2">
                  <span>Speed Progression Over Time</span>
                  <span className="font-mono text-[11px]">Duration: {lastFinishedRecord.durationSeconds}s</span>
                </div>
                <div className="h-28 w-full rounded-xl theme-subtle border theme-border p-2 flex items-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <line x1="0" y1="10" x2="100" y2="10" stroke="currentColor" opacity="0.1" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1="20" x2="100" y2="20" stroke="currentColor" opacity="0.1" strokeWidth="0.5" strokeDasharray="2,2" />
                    <line x1="0" y1="30" x2="100" y2="30" stroke="currentColor" opacity="0.1" strokeWidth="0.5" strokeDasharray="2,2" />

                    {(() => {
                      const timeline = lastFinishedRecord.speedTimeline;
                      const maxWpm = Math.max(...timeline.map((t) => t.wpm), 60);
                      const points = timeline
                        .map((t, idx) => {
                          const x = (idx / (timeline.length - 1)) * 100;
                          const y = 38 - (t.wpm / maxWpm) * 34;
                          return `${x},${y}`;
                        })
                        .join(' ');

                      return (
                        <>
                          <polyline fill="none" stroke="var(--theme-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" points={points} />
                          {timeline.map((t, idx) => {
                            const x = (idx / (timeline.length - 1)) * 100;
                            const y = 38 - (t.wpm / maxWpm) * 34;
                            return <circle key={idx} cx={x} cy={y} r="1.5" fill="var(--theme-accent)" />;
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            )}

            {/* Keystrokes & Weak Keys Diagnostic */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl theme-subtle border theme-border text-xs">
                <span className="theme-text-muted font-medium block mb-2">Keystroke Breakdown</span>
                <div className="grid grid-cols-3 gap-2 font-mono tabular-nums">
                  <div>
                    <span className="theme-text-faint block text-[10px]">CORRECT</span>
                    <span className="text-sm font-semibold text-emerald-400">{lastFinishedRecord.correctCount}</span>
                  </div>
                  <div>
                    <span className="theme-text-faint block text-[10px]">ERRORS</span>
                    <span className="text-sm font-semibold text-rose-400">{lastFinishedRecord.errorCount}</span>
                  </div>
                  <div>
                    <span className="theme-text-faint block text-[10px]">TOTAL</span>
                    <span className="text-sm font-semibold theme-text">{lastFinishedRecord.totalChars}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl theme-subtle border theme-border text-xs">
                <span className="theme-text-muted font-medium block mb-2">Missed Keys in This Test</span>
                {Object.keys(lastFinishedRecord.missTypedKeys).length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(lastFinishedRecord.missTypedKeys).map(([k, cnt]) => (
                      <span
                        key={k}
                        className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-mono text-xs flex items-center gap-1"
                      >
                        <span className="font-bold">{k.toUpperCase()}</span>
                        <span className="text-[10px] opacity-80">({cnt})</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-emerald-400 font-medium">Flawless precision! Zero missed keys.</span>
                )}
              </div>
            </div>

            {/* Actions footer */}
            <div className="mt-8 pt-5 border-t theme-border flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setupNewTest()}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg theme-btn-accent text-xs font-semibold shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Next Test</span>
                </button>
                <button
                  onClick={() => setupNewTest(targetText)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg border theme-border theme-subtle theme-text text-xs font-medium hover:brightness-110 transition-colors"
                >
                  <span>Repeat Same Text</span>
                </button>
                {Object.keys(lastFinishedRecord.missTypedKeys).length > 0 && (
                  <button
                    onClick={() => {
                      setMode('weak-keys');
                      setupNewTest(generateWeakKeysText(lastFinishedRecord.missTypedKeys, 25));
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium transition-colors"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Drill Weak Keys</span>
                  </button>
                )}
              </div>

              <button
                onClick={onNavigateToDashboard}
                className="flex items-center gap-1.5 text-xs theme-accent hover:underline transition-colors font-medium"
              >
                <span>View Full Speed Analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};
