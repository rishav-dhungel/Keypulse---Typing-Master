import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 rounded-lg border theme-border theme-subtle hover:brightness-110 px-2.5 py-1.5 text-xs font-medium theme-text transition-colors shadow-xs whitespace-nowrap shrink-0"
        title="Install KeyPulse as a Progressive Web App"
      >
        <Download className="w-3.5 h-3.5 theme-accent" />
        <span>Install PWA</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-lg border theme-border theme-subtle hover:brightness-110 px-2.5 py-1.5 text-xs font-medium theme-text transition-colors shadow-xs whitespace-nowrap shrink-0"
        >
          <Smartphone className="w-3.5 h-3.5 theme-accent" />
          <span>Install App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-xl border theme-border theme-surface p-5 shadow-2xl theme-text">
              <div className="flex items-center justify-between pb-3 border-b theme-border">
                <h3 className="text-sm font-semibold theme-text">Install KeyPulse on iOS</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="theme-text-muted hover:theme-text p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-3 text-xs leading-relaxed theme-text-muted space-y-2">
                <p>1. Tap the <strong className="theme-text">Share</strong> button in Safari toolbar.</p>
                <p>2. Scroll down and tap <strong className="theme-text">Add to Home Screen</strong>.</p>
                <p>3. Enjoy offline typing drills and speed testing anytime without internet connection.</p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-lg theme-btn-accent py-2 text-xs font-semibold shadow-xs"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
