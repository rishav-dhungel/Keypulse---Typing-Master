import React, { useEffect, useRef, useState } from 'react';
import {
  Keyboard,
  GraduationCap,
  BarChart2,
  Sliders,
  FileJson,
  User,
  ChevronDown,
} from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { UserSettings } from '../../types';

export type ActiveTab = 'test' | 'dashboard' | 'academy';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenSettings: () => void;
  onOpenBackup: () => void;
  settings: UserSettings;
  bestWpm: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenSettings,
  onOpenBackup,
  settings,
  bestWpm,
}) => {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountOpen(false);
      }
    };
    if (isAccountOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAccountOpen]);

  // Derive user tier badge from personal best
  const userTier =
    bestWpm >= 120
      ? 'Apex Master'
      : bestWpm >= 100
      ? 'Diamond'
      : bestWpm >= 80
      ? 'Platinum'
      : bestWpm >= 60
      ? 'Gold'
      : bestWpm >= 40
      ? 'Silver'
      : 'Bronze';

  return (
    <header className="sticky top-0 z-40 w-full border-b theme-border theme-surface">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 h-14">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => onTabChange('test')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 select-none"
        >
          <div className="w-8 h-8 rounded-lg theme-subtle flex items-center justify-center theme-accent border theme-border">
            <Keyboard className="w-4 h-4" />
          </div>
          <span className="text-base font-bold tracking-tight theme-text">
            Key<span className="theme-accent">Pulse</span>
          </span>
        </div>

        {/* Zone 2: Main Nav - ONLY core typing practice tabs */}
        <nav className="flex items-center gap-2 sm:gap-4 text-xs font-medium">
          <button
            onClick={() => onTabChange('test')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'test'
                ? 'theme-btn-accent shadow-xs'
                : 'theme-text-muted hover:theme-text'
            }`}
          >
            <Keyboard className="w-3.5 h-3.5" />
            <span>Typing Test</span>
          </button>

          <button
            onClick={() => onTabChange('academy')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'academy'
                ? 'theme-btn-accent shadow-xs'
                : 'theme-text-muted hover:theme-text'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Touch Academy</span>
          </button>
        </nav>

        {/* Zone 3: PWA Install & Account Dropdown */}
        <div className="flex items-center gap-2.5 shrink-0">
          <PWAInstallButton />

          {/* Account Dropdown Button */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsAccountOpen((prev) => !prev)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border theme-border transition-all select-none text-xs font-medium ${
                isAccountOpen || activeTab === 'dashboard'
                  ? 'theme-subtle border-current shadow-xs'
                  : 'theme-subtle theme-text hover:brightness-110'
              }`}
              aria-expanded={isAccountOpen}
              aria-haspopup="true"
            >
              <div className="w-5 h-5 rounded-full theme-surface border theme-border flex items-center justify-center theme-accent shrink-0">
                <User className="w-3 h-3" />
              </div>
              <span className="max-w-[100px] sm:max-w-[140px] truncate">
                {settings.username || 'Account'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 theme-text-muted transition-transform duration-200 ${
                  isAccountOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Account Dropdown Menu */}
            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border theme-border theme-surface shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Profile Card Header */}
                <div className="p-2.5 rounded-lg theme-subtle border theme-border mb-1.5">
                  <div className="flex items-center justify-between">
                    <div className="font-semibold text-xs theme-text truncate">
                      {settings.username || 'Anonymous Typist'}
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full border theme-border theme-surface theme-accent font-semibold">
                      {userTier}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] theme-text-muted">
                    <span>
                      Best: <strong className="theme-text font-mono">{bestWpm} WPM</strong>
                    </span>
                    <span>·</span>
                    <span className="capitalize">{settings.theme.replace('-', ' ')}</span>
                  </div>
                </div>

                {/* Dropdown Options */}
                <div className="space-y-0.5 text-xs">
                  {/* Option 1: Speed Analytics Dashboard */}
                  <button
                    onClick={() => {
                      onTabChange('dashboard');
                      setIsAccountOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg transition-colors text-left ${
                      activeTab === 'dashboard'
                        ? 'theme-subtle font-semibold theme-accent'
                        : 'theme-text hover:theme-subtle'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart2 className="w-4 h-4 theme-accent" />
                      <div>
                        <div>Speed Dashboard</div>
                        <div className="text-[10px] theme-text-muted">
                          Performance charts, streak & stats
                        </div>
                      </div>
                    </div>
                    {activeTab === 'dashboard' && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    )}
                  </button>

                  <div className="my-1 border-t theme-border" />

                  {/* Option 3: Settings & Customization */}
                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      onOpenSettings();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg theme-text hover:theme-subtle transition-colors text-left"
                  >
                    <Sliders className="w-4 h-4 theme-accent" />
                    <div>
                      <div>Settings</div>
                      <div className="text-[10px] theme-text-muted">
                        Themes, audio & caret style
                      </div>
                    </div>
                  </button>

                  {/* Option 4: Backup & JSON Sync */}
                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      onOpenBackup();
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg theme-text hover:theme-subtle transition-colors text-left"
                  >
                    <FileJson className="w-4 h-4 theme-accent" />
                    <div>
                      <div>JSON Backup & Sync</div>
                      <div className="text-[10px] theme-text-muted">
                        Export or restore history
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
