import React from 'react';

interface VirtualKeyboardProps {
  activeKey?: string;
  errorKey?: string;
  heatMap?: Record<string, number>;
  showFingerGuide?: boolean;
}

interface KeyConfig {
  key: string;
  label?: string;
  width?: string;
  finger: 'lp' | 'lr' | 'lm' | 'li' | 'th' | 'ri' | 'rm' | 'rr' | 'rp';
}

const FINGER_COLORS = {
  lp: { border: 'border-rose-500/50', bg: 'bg-rose-500/10', text: 'text-rose-400', name: 'Left Pinky' },
  lr: { border: 'border-amber-500/50', bg: 'bg-amber-500/10', text: 'text-amber-400', name: 'Left Ring' },
  lm: { border: 'border-emerald-500/50', bg: 'bg-emerald-500/10', text: 'text-emerald-400', name: 'Left Middle' },
  li: { border: 'border-sky-500/50', bg: 'bg-sky-500/10', text: 'text-sky-400', name: 'Left Index' },
  th: { border: 'border-indigo-500/50', bg: 'bg-indigo-500/10', text: 'text-indigo-400', name: 'Thumb' },
  ri: { border: 'border-cyan-500/50', bg: 'bg-cyan-500/10', text: 'text-cyan-400', name: 'Right Index' },
  rm: { border: 'border-emerald-500/50', bg: 'bg-emerald-500/10', text: 'text-emerald-400', name: 'Right Middle' },
  rr: { border: 'border-amber-500/50', bg: 'bg-amber-500/10', text: 'text-amber-400', name: 'Right Ring' },
  rp: { border: 'border-purple-500/50', bg: 'bg-purple-500/10', text: 'text-purple-400', name: 'Right Pinky' },
};

const KEYBOARD_ROWS: KeyConfig[][] = [
  // Number row
  [
    { key: '`', finger: 'lp' },
    { key: '1', finger: 'lp' },
    { key: '2', finger: 'lr' },
    { key: '3', finger: 'lm' },
    { key: '4', finger: 'li' },
    { key: '5', finger: 'li' },
    { key: '6', finger: 'ri' },
    { key: '7', finger: 'ri' },
    { key: '8', finger: 'rm' },
    { key: '9', finger: 'rr' },
    { key: '0', finger: 'rp' },
    { key: '-', finger: 'rp' },
    { key: '=', finger: 'rp' },
    { key: 'Backspace', label: 'Backspace', width: 'flex-1', finger: 'rp' },
  ],
  // Top row
  [
    { key: 'Tab', label: 'Tab', width: 'w-12 sm:w-14', finger: 'lp' },
    { key: 'q', finger: 'lp' },
    { key: 'w', finger: 'lr' },
    { key: 'e', finger: 'lm' },
    { key: 'r', finger: 'li' },
    { key: 't', finger: 'li' },
    { key: 'y', finger: 'ri' },
    { key: 'u', finger: 'ri' },
    { key: 'i', finger: 'rm' },
    { key: 'o', finger: 'rr' },
    { key: 'p', finger: 'rp' },
    { key: '[', finger: 'rp' },
    { key: ']', finger: 'rp' },
    { key: '\\', finger: 'rp' },
  ],
  // Home row
  [
    { key: 'CapsLock', label: 'Caps', width: 'w-14 sm:w-16', finger: 'lp' },
    { key: 'a', finger: 'lp' },
    { key: 's', finger: 'lr' },
    { key: 'd', finger: 'lm' },
    { key: 'f', finger: 'li' },
    { key: 'g', finger: 'li' },
    { key: 'h', finger: 'ri' },
    { key: 'j', finger: 'ri' },
    { key: 'k', finger: 'rm' },
    { key: 'l', finger: 'rr' },
    { key: ';', finger: 'rp' },
    { key: "'", finger: 'rp' },
    { key: 'Enter', label: 'Enter', width: 'flex-1', finger: 'rp' },
  ],
  // Bottom row
  [
    { key: 'ShiftLeft', label: 'Shift', width: 'w-16 sm:w-20', finger: 'lp' },
    { key: 'z', finger: 'lp' },
    { key: 'x', finger: 'lr' },
    { key: 'c', finger: 'lm' },
    { key: 'v', finger: 'li' },
    { key: 'b', finger: 'li' },
    { key: 'n', finger: 'ri' },
    { key: 'm', finger: 'ri' },
    { key: ',', finger: 'rm' },
    { key: '.', finger: 'rr' },
    { key: '/', finger: 'rp' },
    { key: 'ShiftRight', label: 'Shift', width: 'flex-1', finger: 'rp' },
  ],
  // Space row
  [
    { key: 'Control', label: 'Ctrl', width: 'w-12 sm:w-14', finger: 'lp' },
    { key: 'Alt', label: 'Alt', width: 'w-10 sm:w-12', finger: 'lp' },
    { key: ' ', label: 'Space', width: 'flex-1', finger: 'th' },
    { key: 'AltGraph', label: 'Alt', width: 'w-10 sm:w-12', finger: 'rp' },
    { key: 'ControlRight', label: 'Ctrl', width: 'w-12 sm:w-14', finger: 'rp' },
  ],
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeKey = '',
  errorKey = '',
  heatMap,
  showFingerGuide = true,
}) => {
  const normalizedActive = activeKey.toLowerCase();
  const normalizedError = errorKey.toLowerCase();

  let activeFingerInfo: { name: string; color: string } | null = null;
  if (activeKey) {
    for (const row of KEYBOARD_ROWS) {
      for (const k of row) {
        if (k.key.toLowerCase() === normalizedActive || (activeKey === ' ' && k.key === ' ')) {
          const fConfig = FINGER_COLORS[k.finger];
          activeFingerInfo = { name: fConfig.name, color: fConfig.text };
          break;
        }
      }
      if (activeFingerInfo) break;
    }
  }

  const maxHeat = heatMap ? Math.max(...Object.values(heatMap), 1) : 1;

  return (
    <div className="w-full flex flex-col items-center">
      {showFingerGuide && activeKey && activeFingerInfo && (
        <div className="mb-3 flex items-center gap-3 text-xs">
          <span className="theme-text-muted">Target:</span>
          <span className="font-mono px-2 py-0.5 rounded-md theme-subtle theme-accent font-bold uppercase text-sm border theme-border">
            {activeKey === ' ' ? 'Spacebar' : activeKey}
          </span>
          <span className="opacity-40">·</span>
          <span className="theme-text-muted">Use finger:</span>
          <span className={`font-semibold ${activeFingerInfo.color}`}>{activeFingerInfo.name}</span>
        </div>
      )}

      <div className="w-full max-w-3xl select-none p-3 rounded-2xl theme-surface border theme-border shadow-sm overflow-x-auto">
        <div className="flex flex-col gap-1.5 min-w-[580px]">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5 justify-center">
              {row.map((item) => {
                const isTarget =
                  normalizedActive === item.key.toLowerCase() ||
                  (activeKey === ' ' && item.key === ' ');

                const isError =
                  normalizedError === item.key.toLowerCase() ||
                  (errorKey === ' ' && item.key === ' ');

                const hasHomeBump = item.key === 'f' || item.key === 'j';
                const fingerCfg = FINGER_COLORS[item.finger];

                let heatBg = '';
                if (heatMap && heatMap[item.key.toLowerCase()]) {
                  const intensity = heatMap[item.key.toLowerCase()] / maxHeat;
                  if (intensity > 0.6) heatBg = 'bg-rose-500/30 border-rose-500 text-rose-400 font-bold';
                  else if (intensity > 0.3) heatBg = 'bg-amber-500/25 border-amber-500 text-amber-400 font-bold';
                  else heatBg = 'bg-yellow-500/20 border-yellow-500 text-yellow-300';
                }

                let stateClass = 'theme-subtle theme-text border theme-border-subtle';

                if (isTarget) {
                  stateClass = 'theme-btn-accent font-bold scale-[1.04] shadow-md z-10';
                } else if (isError) {
                  stateClass = 'bg-rose-600 text-white font-bold border-rose-500 animate-pulse';
                } else if (heatBg) {
                  stateClass = heatBg;
                } else if (showFingerGuide && !heatMap) {
                  stateClass = `theme-subtle theme-text border ${fingerCfg.border}`;
                }

                return (
                  <div
                    key={item.key}
                    className={`relative flex items-center justify-center text-xs font-mono font-medium rounded-lg border transition-all duration-100 h-9 sm:h-10 ${
                      item.width || 'w-8 sm:w-10'
                    } ${stateClass}`}
                  >
                    <span>{item.label || item.key.toUpperCase()}</span>

                    {hasHomeBump && !isTarget && (
                      <span className="absolute bottom-1 w-3 h-0.5 rounded-full bg-current opacity-60" />
                    )}

                    {heatMap && heatMap[item.key.toLowerCase()] && (
                      <span className="absolute -top-1.5 -right-1 px-1 rounded-full text-[9px] bg-rose-500 text-white font-bold leading-tight">
                        {heatMap[item.key.toLowerCase()]}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {showFingerGuide && !heatMap && (
          <div className="mt-3 pt-2.5 border-t theme-border flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] theme-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Pinky
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Ring
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Middle
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" /> Index
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" /> Thumbs (Space)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
