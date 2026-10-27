import React, { useState } from 'react';
import {
  Check,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Sliders,
  X,
  User,
  Palette,
  Sparkles,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { CustomThemePalette, ThemeId, ThemeOption, UserSettings } from '../../types';
import { DEFAULT_CUSTOM_THEME } from '../../utils/storage';

interface ThemeSelectorProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenBackup?: () => void;
}

const THEME_OPTIONS: ThemeOption[] = [
  // Dark themes
  {
    id: 'dark-slate',
    name: 'Charcoal & Sky',
    category: 'dark',
    previewBg: '#0b0f17',
    previewAccent: '#38bdf8',
    previewText: '#f8fafc',
  },
  {
    id: 'dark-amber',
    name: 'Hacker Amber',
    category: 'dark',
    previewBg: '#0f0d0b',
    previewAccent: '#f59e0b',
    previewText: '#fef3c7',
  },
  {
    id: 'dark-nord',
    name: 'Nordic Frost',
    category: 'dark',
    previewBg: '#1e222a',
    previewAccent: '#88c0d0',
    previewText: '#eceff4',
  },
  {
    id: 'dark-forest',
    name: 'Forest Emerald',
    category: 'dark',
    previewBg: '#081410',
    previewAccent: '#10b981',
    previewText: '#ecfdf5',
  },
  {
    id: 'dark-dracula',
    name: 'Cyber Dracula',
    category: 'dark',
    previewBg: '#12101c',
    previewAccent: '#c4a7e7',
    previewText: '#f0eef8',
  },
  // Light themes
  {
    id: 'light-paper',
    name: 'Minimal Paper',
    category: 'light',
    previewBg: '#ffffff',
    previewAccent: '#2563eb',
    previewText: '#0f172a',
  },
  {
    id: 'light-sepia',
    name: 'Vintage Sepia',
    category: 'light',
    previewBg: '#fbf0d9',
    previewAccent: '#b16286',
    previewText: '#282828',
  },
  {
    id: 'light-sand',
    name: 'Sandstone Soft',
    category: 'light',
    previewBg: '#f4f4f5',
    previewAccent: '#0284c7',
    previewText: '#18181b',
  },
];

const PRESET_CUSTOM_PALETTES: Record<string, CustomThemePalette> = {
  'dark-slate': {
    bg: '#0b0f17',
    surface: '#111827',
    subtle: '#1a2233',
    border: '#1f293d',
    accent: '#38bdf8',
    accentContrast: '#0b0f17',
    text: '#f8fafc',
    textMuted: '#94a3b8',
    caret: '#38bdf8',
    charCorrect: '#f8fafc',
    charWrong: '#f43f5e',
  },
  'dark-amber': {
    bg: '#0f0d0b',
    surface: '#191613',
    subtle: '#24201b',
    border: '#2e2822',
    accent: '#f59e0b',
    accentContrast: '#0f0d0b',
    text: '#fef3c7',
    textMuted: '#78716c',
    caret: '#f59e0b',
    charCorrect: '#fef3c7',
    charWrong: '#ef4444',
  },
  'dark-nord': {
    bg: '#1e222a',
    surface: '#242933',
    subtle: '#2e3440',
    border: '#3b4252',
    accent: '#88c0d0',
    accentContrast: '#1e222a',
    text: '#eceff4',
    textMuted: '#78859a',
    caret: '#88c0d0',
    charCorrect: '#eceff4',
    charWrong: '#bf616a',
  },
  'dark-forest': {
    bg: '#081410',
    surface: '#0f221c',
    subtle: '#16332a',
    border: '#1d4237',
    accent: '#10b981',
    accentContrast: '#041a13',
    text: '#ecfdf5',
    textMuted: '#45826c',
    caret: '#10b981',
    charCorrect: '#ecfdf5',
    charWrong: '#f87171',
  },
  'dark-dracula': {
    bg: '#12101c',
    surface: '#1a1729',
    subtle: '#25213b',
    border: '#332d52',
    accent: '#c4a7e7',
    accentContrast: '#12101c',
    text: '#f0eef8',
    textMuted: '#757091',
    caret: '#c4a7e7',
    charCorrect: '#f0eef8',
    charWrong: '#eb6f92',
  },
  'light-paper': {
    bg: '#f8fafc',
    surface: '#ffffff',
    subtle: '#f1f5f9',
    border: '#e2e8f0',
    accent: '#2563eb',
    accentContrast: '#ffffff',
    text: '#0f172a',
    textMuted: '#64748b',
    caret: '#2563eb',
    charCorrect: '#0f172a',
    charWrong: '#dc2626',
  },
  'light-sepia': {
    bg: '#fbf0d9',
    surface: '#f4e4c1',
    subtle: '#ead4a7',
    border: '#dfcd9f',
    accent: '#b16286',
    accentContrast: '#ffffff',
    text: '#282828',
    textMuted: '#7c6f64',
    caret: '#b16286',
    charCorrect: '#282828',
    charWrong: '#cc241d',
  },
  'light-sand': {
    bg: '#f4f4f5',
    surface: '#ffffff',
    subtle: '#e4e4e7',
    border: '#d4d4d8',
    accent: '#0284c7',
    accentContrast: '#ffffff',
    text: '#18181b',
    textMuted: '#71717a',
    caret: '#0284c7',
    charCorrect: '#18181b',
    charWrong: '#e11d48',
  },
};

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  settings,
  onUpdateSettings,
  isOpen,
  onClose,
  onOpenBackup,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom' | 'typing'>('presets');

  if (!isOpen) return null;

  const currentCustom: CustomThemePalette = settings.customTheme || DEFAULT_CUSTOM_THEME;

  const handleUpdateCustomBlock = (field: keyof CustomThemePalette, val: string) => {
    const updatedCustom = {
      ...currentCustom,
      [field]: val,
    };
    onUpdateSettings({
      customTheme: updatedCustom,
      theme: 'custom',
    });
  };

  const handleLoadPresetBase = (presetId: string) => {
    const preset = PRESET_CUSTOM_PALETTES[presetId];
    if (preset) {
      onUpdateSettings({
        customTheme: { ...preset },
        theme: 'custom',
      });
    }
  };

  const handleResetCustomToDefault = () => {
    onUpdateSettings({
      customTheme: { ...DEFAULT_CUSTOM_THEME },
      theme: 'custom',
    });
  };

  const colorBlocks: {
    key: keyof CustomThemePalette;
    label: string;
    description: string;
  }[] = [
    { key: 'bg', label: 'Background', description: 'Main background canvas' },
    { key: 'surface', label: 'Panel / Card', description: 'Arena card, header, panels' },
    { key: 'border', label: 'Borders & Lines', description: 'Outlines and dividers' },
    { key: 'accent', label: 'Primary Accent', description: 'Buttons, active tabs, highlights' },
    { key: 'text', label: 'Main Text', description: 'Primary headings and typed text' },
    { key: 'textMuted', label: 'Muted / Future Text', description: 'Secondary copy & untyped words' },
    { key: 'caret', label: 'Typing Caret', description: 'Blinking cursor marker' },
    { key: 'charCorrect', label: 'Correct Letter', description: 'Successfully typed glyphs' },
    { key: 'charWrong', label: 'Wrong Letter', description: 'Mistyped character color' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl rounded-2xl theme-surface border theme-border p-6 shadow-2xl theme-text max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b theme-border">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 theme-accent" />
            <h2 className="text-sm font-semibold tracking-wide">Settings & Customization</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg theme-text-muted hover:theme-text hover:theme-subtle transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-4 flex p-1 theme-subtle rounded-xl border theme-border text-xs">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'presets'
                ? 'theme-surface theme-accent font-semibold shadow-xs'
                : 'theme-text-muted hover:theme-text'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Theme Presets</span>
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'custom'
                ? 'theme-surface theme-accent font-semibold shadow-xs'
                : 'theme-text-muted hover:theme-text'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Custom Palette Studio</span>
            {settings.theme === 'custom' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('typing')}
            className={`flex-1 py-1.5 px-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'typing'
                ? 'theme-surface theme-accent font-semibold shadow-xs'
                : 'theme-text-muted hover:theme-text'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Sound & Typing</span>
          </button>
        </div>

        {/* TAB 1: PRESETS */}
        {activeTab === 'presets' && (
          <div className="mt-5 space-y-5">
            {/* Dark themes */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold theme-text-muted uppercase tracking-wider mb-2.5">
                <Moon className="w-3.5 h-3.5" />
                <span>Dark Themes</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {THEME_OPTIONS.filter((t) => t.category === 'dark').map((theme) => {
                  const isSelected = settings.theme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => onUpdateSettings({ theme: theme.id })}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-current theme-subtle font-bold shadow-xs'
                          : 'theme-border theme-subtle opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: theme.previewAccent }}
                        />
                        <span className="text-xs truncate">{theme.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 theme-accent shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Light themes */}
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold theme-text-muted uppercase tracking-wider mb-2.5">
                <Sun className="w-3.5 h-3.5" />
                <span>Light Themes</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {THEME_OPTIONS.filter((t) => t.category === 'light').map((theme) => {
                  const isSelected = settings.theme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => onUpdateSettings({ theme: theme.id })}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'border-current theme-subtle font-bold shadow-xs'
                          : 'theme-border theme-subtle opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                          style={{ backgroundColor: theme.previewAccent }}
                        />
                        <span className="text-xs truncate">{theme.name}</span>
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 theme-accent shrink-0 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick link to custom builder */}
            <div className="p-3 rounded-xl border theme-border theme-subtle flex items-center justify-between">
              <div className="text-xs">
                <div className="font-semibold theme-text">Design Your Own Palette</div>
                <div className="text-[11px] theme-text-muted">Configure color blocks for background, text, caret, and errors</div>
              </div>
              <button
                onClick={() => {
                  onUpdateSettings({ theme: 'custom' });
                  setActiveTab('custom');
                }}
                className="px-3 py-1.5 rounded-lg theme-btn-accent text-xs font-semibold shrink-0"
              >
                Open Studio
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CUSTOM COLOR BLOCKS STUDIO */}
        {activeTab === 'custom' && (
          <div className="mt-5 space-y-5">
            {/* Header controls: Activation status & Base loader */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl border theme-border theme-subtle">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{ backgroundColor: currentCustom.accent }}
                />
                <div>
                  <div className="text-xs font-semibold theme-text">
                    {settings.theme === 'custom' ? 'Custom Palette is Active' : 'Custom Palette Saved'}
                  </div>
                  <div className="text-[11px] theme-text-muted">
                    Changes apply live to the app instantly
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {settings.theme !== 'custom' ? (
                  <button
                    onClick={() => onUpdateSettings({ theme: 'custom' })}
                    className="px-3 py-1.5 rounded-lg theme-btn-accent text-xs font-semibold shadow-xs"
                  >
                    Activate Custom
                  </button>
                ) : (
                  <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                    Active
                  </span>
                )}
                <button
                  onClick={handleResetCustomToDefault}
                  className="p-1.5 rounded-lg border theme-border theme-surface theme-text-muted hover:theme-text"
                  title="Reset to default custom theme"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Clone from preset quick bar */}
            <div>
              <label className="text-[11px] font-semibold theme-text-muted uppercase tracking-wider block mb-1.5">
                Start from a Preset Baseline
              </label>
              <div className="flex flex-wrap gap-1.5">
                {THEME_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleLoadPresetBase(opt.id)}
                    className="px-2 py-1 rounded-lg border theme-border theme-subtle text-[11px] theme-text hover:brightness-110 flex items-center gap-1.5 transition-colors"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: opt.previewAccent }}
                    />
                    <span>{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div
              className="p-4 rounded-xl border transition-all"
              style={{
                backgroundColor: currentCustom.bg,
                borderColor: currentCustom.border,
                color: currentCustom.text,
              }}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b" style={{ borderColor: currentCustom.border }}>
                <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: currentCustom.accent }}>
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </div>
                <div
                  className="px-2.5 py-1 rounded text-[11px] font-semibold"
                  style={{
                    backgroundColor: currentCustom.accent,
                    color: currentCustom.accentContrast || '#ffffff',
                  }}
                >
                  Accent Button
                </div>
              </div>

              {/* Simulated mini typing arena */}
              <div
                className="p-3 rounded-lg border font-mono text-sm leading-relaxed"
                style={{
                  backgroundColor: currentCustom.surface,
                  borderColor: currentCustom.border,
                }}
              >
                <span style={{ color: currentCustom.charCorrect }}>the quick brown</span>
                <span className="relative inline-block w-[1ch] text-center">
                  <span
                    className="absolute left-0 top-0.5 bottom-0.5 w-[2px] caret-blink"
                    style={{ backgroundColor: currentCustom.caret }}
                  />
                  <span>&nbsp;</span>
                </span>
                <span
                  style={{
                    color: currentCustom.charWrong,
                    backgroundColor: `${currentCustom.charWrong}33`,
                    borderRadius: '2px',
                    textDecoration: 'underline',
                  }}
                >
                  x
                </span>
                <span style={{ color: currentCustom.textMuted }}> jumps over the lazy dog</span>
              </div>
            </div>

            {/* The 9 Configurable Color Blocks */}
            <div>
              <label className="text-[11px] font-semibold theme-text-muted uppercase tracking-wider block mb-2">
                Configure Color Blocks
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {colorBlocks.map((block) => {
                  const currentValue = currentCustom[block.key] || '#ffffff';
                  return (
                    <div
                      key={block.key}
                      className="p-2.5 rounded-xl border theme-border theme-subtle flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold theme-text truncate">{block.label}</div>
                        <div className="text-[10px] theme-text-muted truncate">{block.description}</div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* Hex text input */}
                        <input
                          type="text"
                          value={currentValue}
                          onChange={(e) => handleUpdateCustomBlock(block.key, e.target.value)}
                          className="w-20 px-2 py-1 rounded border theme-border theme-surface font-mono text-xs theme-text uppercase text-center focus:outline-none"
                          maxLength={7}
                        />

                        {/* Interactive Color Picker Swatch */}
                        <div className="relative w-7 h-7 rounded-lg border theme-border shadow-xs overflow-hidden shrink-0 cursor-pointer">
                          <div
                            className="w-full h-full"
                            style={{ backgroundColor: currentValue }}
                          />
                          <input
                            type="color"
                            value={currentValue.startsWith('#') && currentValue.length === 7 ? currentValue : '#ffffff'}
                            onChange={(e) => handleUpdateCustomBlock(block.key, e.target.value)}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            title={`Pick color for ${block.label}`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TYPING PREFERENCES & AUDIO */}
        {activeTab === 'typing' && (
          <div className="mt-5 space-y-5">
            {/* Profile Username */}
            <div className="pb-5 border-b theme-border">
              <label className="text-xs font-semibold theme-text-muted uppercase tracking-wider block mb-2">
                User Profile
              </label>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg theme-subtle flex items-center justify-center theme-accent border theme-border shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={settings.username}
                  onChange={(e) => onUpdateSettings({ username: e.target.value })}
                  className="flex-1 theme-subtle border theme-border rounded-lg px-3 py-1.5 text-xs theme-text focus:outline-none focus:border-current"
                  placeholder="Enter your typist name..."
                />
              </div>
            </div>

            {/* Tactile Audio Controls */}
            <div className="space-y-4">
              <div className="text-xs font-semibold theme-text-muted uppercase tracking-wider">
                Sound & Key Audio
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-4 h-4 theme-accent" />
                  ) : (
                    <VolumeX className="w-4 h-4 theme-text-muted" />
                  )}
                  <span className="text-xs">Mechanical Key Audio</span>
                </div>
                <button
                  onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    settings.soundEnabled
                      ? 'theme-btn-accent shadow-xs'
                      : 'theme-subtle border theme-border theme-text-muted'
                  }`}
                >
                  {settings.soundEnabled ? 'Enabled' : 'Muted'}
                </button>
              </div>

              {settings.soundEnabled && (
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] theme-text-muted block mb-1">Switch Acoustics</label>
                    <select
                      value={settings.soundType}
                      onChange={(e) =>
                        onUpdateSettings({ soundType: e.target.value as 'mechanical' | 'soft' | 'beep' })
                      }
                      className="w-full theme-subtle border theme-border rounded-lg px-2.5 py-1.5 text-xs theme-text focus:outline-none"
                    >
                      <option value="mechanical">Clicky Mechanical</option>
                      <option value="soft">Damped Linear</option>
                      <option value="beep">Subtle Tone</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] theme-text-muted block mb-1">
                      Volume: {Math.round(settings.soundVolume * 100)}%
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      value={settings.soundVolume}
                      onChange={(e) => onUpdateSettings({ soundVolume: parseFloat(e.target.value) })}
                      className="w-full accent-current mt-1 cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Typing Arena Customization */}
            <div className="pt-4 border-t theme-border space-y-4">
              <div className="text-xs font-semibold theme-text-muted uppercase tracking-wider">
                Typing Arena Preferences
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] theme-text-muted block mb-1">Caret Style</label>
                  <div className="flex gap-1.5 p-1 theme-subtle rounded-lg border theme-border">
                    {(['line', 'block', 'underline'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => onUpdateSettings({ caretStyle: style })}
                        className={`flex-1 py-1 text-xs capitalize rounded transition-colors ${
                          settings.caretStyle === style
                            ? 'theme-surface theme-accent font-semibold shadow-xs'
                            : 'theme-text-muted hover:theme-text'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] theme-text-muted block mb-1">Font Size</label>
                  <div className="flex gap-1.5 p-1 theme-subtle rounded-lg border theme-border">
                    {(['base', 'lg', 'xl'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => onUpdateSettings({ fontSize: size })}
                        className={`flex-1 py-1 text-xs uppercase rounded transition-colors ${
                          settings.fontSize === size
                            ? 'theme-surface theme-accent font-semibold shadow-xs'
                            : 'theme-text-muted hover:theme-text'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Restart Shortcut */}
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="theme-text">Quick Restart Shortcut</span>
                <div className="flex gap-2">
                  {(['Tab', 'Escape'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => onUpdateSettings({ quickRestartKey: key })}
                      className={`px-2.5 py-1 rounded border text-xs font-mono transition-colors ${
                        settings.quickRestartKey === key
                          ? 'theme-border theme-accent font-bold theme-subtle'
                          : 'theme-border opacity-60 hover:opacity-100'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t theme-border flex items-center justify-between">
          {onOpenBackup ? (
            <button
              onClick={() => {
                onClose();
                onOpenBackup();
              }}
              className="text-xs theme-accent hover:underline font-medium"
            >
              Backup & Sync JSON →
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg theme-btn-accent text-xs font-semibold shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
