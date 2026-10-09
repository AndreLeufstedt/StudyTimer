import React from 'react';
import { X, Play, Volume2, Check } from 'lucide-react';

const SOUND_OPTIONS = [
  { id: 'crystal', name: 'Crystal Chime', description: 'Bright melodious arpeggio' },
  { id: 'zen', name: 'Zen Bell', description: 'Harmonic singing bell decay' },
  { id: 'digital', name: 'Digital Alert', description: 'Subtle clean electronic chime' },
  { id: 'gong', name: 'Warm Gong', description: 'Deep resonant ambient tone' },
];

export default function SoundModal({
  isOpen,
  onClose,
  selectedSound,
  onSelectSound,
  volume,
  onChangeVolume,
  onPlayPreview,
  theme,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/60">
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl transition-all border"
        style={{
          backgroundColor: theme.bg,
          borderColor: theme.border,
          color: theme.text,
        }}
      >
        <div className="flex items-center justify-between pb-4 border-b" style={{ borderColor: theme.border }}>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" style={{ color: theme.primary }} />
            <h2 className="text-base font-semibold">Alarm Sound Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:opacity-75 cursor-pointer"
            style={{ color: theme.textSecondary }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="mt-5 pb-4 border-b" style={{ borderColor: theme.border }}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span style={{ color: theme.textSecondary }}>Alarm Volume</span>
            <span className="font-timer font-medium" style={{ color: theme.primary }}>
              {Math.round(volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
        </div>

        {/* Sound List */}
        <div className="space-y-2 mt-4">
          <div className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: theme.textMuted }}>
            Choose Sound
          </div>
          {SOUND_OPTIONS.map((s) => {
            const isSelected = selectedSound === s.id;
            return (
              <div
                key={s.id}
                className="flex items-center justify-between p-3 rounded-xl border transition-all"
                style={{
                  backgroundColor: isSelected ? theme.surfaceHover : theme.surface,
                  borderColor: isSelected ? theme.primary : theme.border,
                }}
              >
                <button
                  onClick={() => onSelectSound(s.id)}
                  className="flex items-center gap-3 flex-1 text-left cursor-pointer"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: isSelected ? theme.primary : 'transparent',
                      borderColor: isSelected ? theme.primary : theme.border,
                    }}
                  >
                    {isSelected && <Check className="w-3 h-3 text-black" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold" style={{ color: theme.text }}>
                      {s.name}
                    </div>
                    <div className="text-[11px]" style={{ color: theme.textMuted }}>
                      {s.description}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => onPlayPreview(s.id)}
                  className="p-2 rounded-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: theme.surface,
                    color: theme.primary,
                    border: `1px solid ${theme.border}`,
                  }}
                  title="Test sound"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
