import React, { useRef, useState } from 'react';
import { Download, Upload, Trash2, CheckCircle2, AlertCircle, FileJson, X } from 'lucide-react';
import { exportBackupJson, importBackupJson, clearAllData } from '../../utils/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose, onDataChanged }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mergeMode, setMergeMode] = useState<'merge' | 'overwrite'>('merge');
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (!isOpen) return null;

  const handleExport = () => {
    try {
      exportBackupJson();
      setStatusMessage({ type: 'success', text: 'Backup downloaded successfully as JSON!' });
    } catch {
      setStatusMessage({ type: 'error', text: 'Failed to generate backup JSON.' });
    }
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusMessage(null);
    const result = await importBackupJson(file, mergeMode);
    if (result.success) {
      setStatusMessage({ type: 'success', text: result.message });
      onDataChanged();
    } else {
      setStatusMessage({ type: 'error', text: result.message });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    clearAllData();
    setShowClearConfirm(false);
    setStatusMessage({ type: 'success', text: 'All local records and progress have been cleared.' });
    onDataChanged();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-2xl theme-surface border theme-border p-6 shadow-2xl theme-text">
        <div className="flex items-center justify-between pb-4 border-b theme-border">
          <div className="flex items-center gap-2">
            <FileJson className="w-4 h-4 theme-accent" />
            <h2 className="text-sm font-semibold">Local Data Backup & JSON Sync</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg theme-text-muted hover:theme-text hover:theme-subtle transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {statusMessage && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2.5 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="mt-5 space-y-4">
          {/* Export section */}
          <div className="p-4 rounded-xl theme-subtle border theme-border">
            <h3 className="text-xs font-semibold mb-1">Export Data to JSON</h3>
            <p className="text-xs theme-text-muted leading-relaxed mb-3">
              Download your complete typing test history, academy progress, custom settings, and daily streaks as a JSON file.
            </p>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg theme-btn-accent text-xs font-semibold shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Backup (.json)</span>
            </button>
          </div>

          {/* Import section */}
          <div className="p-4 rounded-xl theme-subtle border theme-border">
            <h3 className="text-xs font-semibold mb-1">Restore / Sync from JSON</h3>
            <p className="text-xs theme-text-muted leading-relaxed mb-3">
              Restore previously exported data on this device or sync between multiple browsers.
            </p>

            <div className="flex items-center gap-4 mb-3 text-xs">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={mergeMode === 'merge'}
                  onChange={() => setMergeMode('merge')}
                  className="accent-current"
                />
                <span>Merge with existing</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  value="overwrite"
                  checked={mergeMode === 'overwrite'}
                  onChange={() => setMergeMode('overwrite')}
                  className="accent-current"
                />
                <span>Clean Overwrite</span>
              </label>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileSelected}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg border theme-border theme-surface theme-text text-xs font-medium hover:brightness-110 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 theme-accent" />
              <span>Select JSON File</span>
            </button>
          </div>

          {/* Reset data */}
          <div className="pt-2">
            {!showClearConfirm ? (
              <button
                onClick={() => setShowClearConfirm(true)}
                className="flex items-center gap-1.5 text-xs text-rose-400 opacity-70 hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset all local typing history</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs">
                <p className="text-rose-400 font-medium mb-2">Are you sure? This will delete all tests permanently.</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearAll}
                    className="px-3 py-1 rounded-lg bg-rose-600 text-white font-medium hover:bg-rose-500 transition-colors"
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1 rounded-lg theme-subtle theme-text-muted hover:theme-text transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
