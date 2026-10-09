import React from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

export default function Controls({
  isRunning,
  isCompleted,
  secondsLeft,
  onStart,
  onPause,
  onReset,
  onTestSound,
  theme,
}) {
  const isZero = secondsLeft === 0 && !isCompleted;

  return (
    <div className="flex items-center justify-center gap-4 my-6">
      {/* Reset Button */}
      <button
        onClick={onReset}
        className="p-3.5 sm:p-4 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
        style={{
          backgroundColor: theme.surface,
          color: theme.textSecondary,
          border: `1px solid ${theme.border}`,
        }}
        title="Reset Timer"
        aria-label="Reset Timer"
      >
        <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Main Start / Pause Button */}
      {isRunning ? (
        <button
          onClick={onPause}
          className="px-8 py-3.5 sm:px-10 sm:py-4 rounded-full font-medium text-sm sm:text-base flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg"
          style={{
            backgroundColor: theme.surfaceHover,
            color: theme.primary,
            border: `1px solid ${theme.primary}60`,
            boxShadow: `0 4px 20px ${theme.primary}25`,
          }}
          aria-label="Pause Timer"
        >
          <Pause className="w-5 h-5 fill-current" />
          <span>Pause</span>
        </button>
      ) : (
        <button
          onClick={onStart}
          disabled={isZero}
          className={`px-8 py-3.5 sm:px-10 sm:py-4 rounded-full font-medium text-sm sm:text-base flex items-center gap-2.5 transition-all shadow-lg ${
            isZero
              ? 'opacity-40 cursor-not-allowed'
              : 'hover:scale-105 active:scale-95 cursor-pointer'
          }`}
          style={{
            backgroundColor: theme.primary,
            color: theme.bg,
            border: `1px solid ${theme.primary}`,
            boxShadow: isZero ? 'none' : `0 4px 25px ${theme.primary}40`,
          }}
          aria-label="Start Timer"
          title={isZero ? 'Set a time to start' : 'Start Timer'}
        >
          <Play className="w-5 h-5 fill-current" />
          <span>{isCompleted ? 'Restart' : 'Start Focus'}</span>
        </button>
      )}

      {/* Test Sound Button */}
      <button
        onClick={onTestSound}
        className="p-3.5 sm:p-4 rounded-full transition-all hover:scale-105 active:scale-95 cursor-pointer"
        style={{
          backgroundColor: theme.surface,
          color: theme.textSecondary,
          border: `1px solid ${theme.border}`,
        }}
        title="Test Alarm Sound"
        aria-label="Test Alarm Sound"
      >
        <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>
    </div>
  );
}
