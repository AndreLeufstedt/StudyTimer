import React from 'react';
import { Timer, Maximize, Minimize, Palette, Volume2, Sparkles } from 'lucide-react';

export default function Navbar({
  theme,
  onOpenThemeModal,
  onOpenSoundModal,
  isFullscreen,
  onToggleFullscreen,
}) {
  return (
    <header
      className="w-full fixed top-0 left-0 right-0 z-40 backdrop-blur-md border-b transition-colors"
      style={{
        backgroundColor: `${theme.bg}cc`,
        borderColor: theme.border,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{
              backgroundColor: theme.surfaceHover,
              color: theme.primary,
              border: `1px solid ${theme.border}`,
            }}
          >
            <Timer className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-semibold text-base tracking-tight" style={{ color: theme.text }}>
              Studies
            </span>
            <span className="font-semibold text-base tracking-tight" style={{ color: theme.primary }}>
              Timer
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound settings */}
          <button
            onClick={onOpenSoundModal}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: theme.surface,
              color: theme.textSecondary,
              border: `1px solid ${theme.border}`,
            }}
            title="Sound Settings"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sound</span>
          </button>

          {/* Theme switcher */}
          <button
            onClick={onOpenThemeModal}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: theme.surface,
              color: theme.textSecondary,
              border: `1px solid ${theme.border}`,
            }}
            title="Select Theme"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Theme</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 sm:px-3 sm:py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: theme.surface,
              color: theme.textSecondary,
              border: `1px solid ${theme.border}`,
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize className="w-3.5 h-3.5" />
            ) : (
              <Maximize className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Full'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
