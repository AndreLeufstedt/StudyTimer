import React from 'react';
import { Plus, Minus } from 'lucide-react';

const PRESETS = [
  { label: '15m', minutes: 15 },
  { label: '25m', minutes: 25 },
  { label: '45m', minutes: 45 },
  { label: '60m', minutes: 60 },
  { label: '90m', minutes: 90 },
];

export default function TimeSelector({
  currentSeconds,
  onSelectSeconds,
  disabled,
  theme,
}) {
  const currentMinutes = Math.round(currentSeconds / 60);

  const adjustMinutes = (delta) => {
    const nextSeconds = Math.max(0, Math.min(86400, currentSeconds + delta * 60));
    onSelectSeconds(nextSeconds);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-md mx-auto px-4">
      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {PRESETS.map((p) => {
          const isActive = currentSeconds === p.minutes * 60;
          return (
            <button
              key={p.minutes}
              onClick={() => onSelectSeconds(p.minutes * 60)}
              disabled={disabled}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
              }`}
              style={{
                backgroundColor: isActive ? theme.primary : theme.surface,
                color: isActive ? theme.bg : theme.textSecondary,
                border: `1px solid ${isActive ? theme.primary : theme.border}`,
                boxShadow: isActive ? `0 2px 10px ${theme.primary}33` : 'none',
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
