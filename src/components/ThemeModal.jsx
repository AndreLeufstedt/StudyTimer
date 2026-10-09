import React from 'react';
import { X, Check } from 'lucide-react';
import { THEMES } from '../utils/themes';

export default function ThemeModal({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
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
          <h2 className="text-base font-semibold">Select Aesthetic Theme</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-colors hover:opacity-75 cursor-pointer"
            style={{ color: theme.textSecondary }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-5">
          {THEMES.map((t) => {
            const isSelected = currentThemeId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTheme(t.id);
                  onClose();
                }}
                className="flex items-center gap-3 p-3 rounded-xl border text-left transition-all hover:scale-[1.02] cursor-pointer"
                style={{
                  backgroundColor: t.bg,
                  borderColor: isSelected ? t.primary : t.border,
                  boxShadow: isSelected ? `0 0 12px ${t.primary}40` : 'none',
                }}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 border"
                  style={{
                    backgroundColor: t.primary,
                    borderColor: t.border,
                  }}
                >
                  {isSelected && <Check className="w-3 h-3 text-black" />}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium truncate" style={{ color: t.text }}>
                    {t.name}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
