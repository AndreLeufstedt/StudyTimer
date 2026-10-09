import React, { useState, useEffect, useRef } from 'react';
import { BellRing, CheckCircle2 } from 'lucide-react';

export default function TimerDisplay({
  secondsLeft,
  totalSeconds,
  isRunning,
  isCompleted,
  theme,
  onTimeChange,
  onStart,
}) {
  const [hoursInput, setHoursInput] = useState('0');
  const [minutesInput, setMinutesInput] = useState('25');
  const [secondsInput, setSecondsInput] = useState('00');

  const isTypingRef = useRef(false);

  // Sync inputs with secondsLeft when timer is not running and user is not actively typing
  useEffect(() => {
    if (isTypingRef.current) return;

    if (!isRunning) {
      if (secondsLeft === 0 && totalSeconds === 0) {
        setHoursInput('0');
        setMinutesInput('00');
        setSecondsInput('00');
        return;
      }

      const h = Math.floor(secondsLeft / 3600);
      const m = Math.floor((secondsLeft % 3600) / 60);
      const s = secondsLeft % 60;

      setHoursInput(h > 0 ? String(h) : '');
      setMinutesInput(m > 0 || h > 0 ? String(m) : (s > 0 ? '00' : ''));
      setSecondsInput(s > 0 ? String(s) : '');
    }
  }, [secondsLeft, totalSeconds, isRunning]);

  const updateTime = (hStr, mStr, sStr) => {
    const h = parseInt(hStr || '0', 10);
    const m = parseInt(mStr || '0', 10);
    const s = parseInt(sStr || '0', 10);
    const total = h * 3600 + m * 60 + s;
    if (onTimeChange) {
      onTimeChange(total);
    }
  };

  const handleHoursChange = (e) => {
    isTypingRef.current = true;
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setHoursInput(val);
    updateTime(val, minutesInput, secondsInput);
  };

  const handleMinutesChange = (e) => {
    isTypingRef.current = true;
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setMinutesInput(val);
    updateTime(hoursInput, val, secondsInput);
  };

  const handleSecondsChange = (e) => {
    isTypingRef.current = true;
    const val = e.target.value.replace(/\D/g, '').slice(0, 2);
    setSecondsInput(val);
    updateTime(hoursInput, minutesInput, val);
  };

  const handleBlur = () => {
    isTypingRef.current = false;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      isTypingRef.current = false;
      e.target.blur();
      if (onStart) onStart();
    }
  };

  const formatTime = (totalSec) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    const seconds = totalSec % 60;

    const pad = (n) => String(n).padStart(2, '0');

    // If no hours remain, format down to MM:SS
    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  const hasHours = secondsLeft >= 3600;

  // SVG circular progress calculation: inverted so it moves clockwise like a clock
  const radius = 185;
  const circumference = 2 * Math.PI * radius;
  const elapsedSeconds = totalSeconds > 0 ? totalSeconds - secondsLeft : 0;
  const progressRatio = totalSeconds > 0 ? Math.max(0, Math.min(1, elapsedSeconds / totalSeconds)) : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  const formatSessionLabel = (sec) => {
    if (sec === 0) return '0 Minute Session';
    const mins = Math.round(sec / 60);
    if (mins >= 60) {
      const hrs = (mins / 60).toFixed(1).replace('.0', '');
      return `${hrs} Hour Session`;
    }
    return `${mins} Minute Session`;
  };

  return (
    <div className="relative flex flex-col items-center justify-center my-4 sm:my-6 select-none">
      {/* Outer Circular Ring */}
      <div className="relative w-80 h-80 sm:w-[380px] sm:h-[380px] md:w-[460px] md:h-[460px] lg:w-[500px] lg:h-[500px] flex items-center justify-center">
        <svg
          className="w-full h-full -rotate-90 transform pointer-events-none"
          viewBox="0 0 400 400"
        >
          {/* Background circle track */}
          <circle
            cx="200"
            cy="200"
            r={radius}
            stroke={theme.border}
            strokeWidth="5"
            fill="transparent"
            className="transition-colors duration-300"
          />

          {/* Active progress stroke moving clockwise like a clock */}
          <circle
            cx="200"
            cy="200"
            r={radius}
            stroke={theme.primary}
            strokeWidth={progressRatio > 0 ? 7 : 0}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              filter: isRunning && progressRatio > 0 ? `drop-shadow(0 0 10px ${theme.primary}60)` : 'none',
              transition: 'stroke-dashoffset 0.8s ease, stroke 0.3s ease',
            }}
          />
        </svg>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          {/* Status Badge */}
          <div
            className="mb-3 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase transition-all"
            style={{
              backgroundColor: isCompleted
                ? `${theme.primary}22`
                : isRunning
                ? theme.surfaceHover
                : theme.surface,
              color: isCompleted ? theme.primary : theme.textSecondary,
              border: `1px solid ${theme.border}`,
            }}
          >
            {isCompleted ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Session Complete
              </span>
            ) : isRunning ? (
              <span className="flex items-center gap-1.5">
                <span
                  className="w-2 h-2 rounded-full animate-ping inline-block"
                  style={{ backgroundColor: theme.primary }}
                />
                Focusing
              </span>
            ) : secondsLeft < totalSeconds && totalSeconds > 0 ? (
              'Paused'
            ) : totalSeconds === 0 ? (
              'Ready to Study'
            ) : (
              'Type to Set Time'
            )}
          </div>

          {/* Time Display Area */}
          {isRunning ? (
            /* Active running countdown digits */
            <div
              className={`font-timer font-light tracking-tight transition-all leading-none ${
                hasHours
                  ? 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl'
                  : 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl'
              }`}
              style={{
                color: theme.text,
                textShadow: `0 0 28px ${theme.primary}25`,
              }}
            >
              {formatTime(secondsLeft)}
            </div>
          ) : (
            /* Direct typing clock: h : mm : ss */
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center font-timer font-light leading-none">
                {/* Hours Tab */}
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={hoursInput}
                    onChange={handleHoursChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onFocus={(e) => {
                      isTypingRef.current = true;
                      e.target.select();
                    }}
                    placeholder="0"
                    maxLength={2}
                    className="w-14 sm:w-18 md:w-22 lg:w-26 text-center bg-transparent focus:outline-none transition-all rounded-lg focus:ring-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl cursor-text"
                    style={{
                      color: hoursInput ? theme.text : theme.textMuted,
                      borderColor: theme.border,
                    }}
                    title="Hours"
                  />
                  <span
                    className="text-[10px] sm:text-xs uppercase tracking-widest mt-1 select-none"
                    style={{ color: theme.textMuted }}
                  >
                    h
                  </span>
                </div>

                {/* Colon */}
                <span
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mx-0.5 sm:mx-1 select-none pb-4"
                  style={{ color: theme.textMuted }}
                >
                  :
                </span>

                {/* Minutes Tab */}
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={minutesInput}
                    onChange={handleMinutesChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onFocus={(e) => {
                      isTypingRef.current = true;
                      e.target.select();
                    }}
                    placeholder="00"
                    maxLength={2}
                    className="w-16 sm:w-20 md:w-24 lg:w-28 text-center bg-transparent focus:outline-none transition-all rounded-lg focus:ring-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl cursor-text"
                    style={{
                      color: theme.text,
                      borderColor: theme.border,
                    }}
                    title="Minutes"
                  />
                  <span
                    className="text-[10px] sm:text-xs uppercase tracking-widest mt-1 select-none"
                    style={{ color: theme.textMuted }}
                  >
                    m
                  </span>
                </div>

                {/* Colon */}
                <span
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mx-0.5 sm:mx-1 select-none pb-4"
                  style={{ color: theme.textMuted }}
                >
                  :
                </span>

                {/* Seconds Tab */}
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={secondsInput}
                    onChange={handleSecondsChange}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onFocus={(e) => {
                      isTypingRef.current = true;
                      e.target.select();
                    }}
                    placeholder="00"
                    maxLength={2}
                    className="w-16 sm:w-20 md:w-24 lg:w-28 text-center bg-transparent focus:outline-none transition-all rounded-lg focus:ring-1 text-4xl sm:text-5xl md:text-6xl lg:text-7xl cursor-text"
                    style={{
                      color: secondsInput ? theme.text : theme.textMuted,
                      borderColor: theme.border,
                    }}
                    title="Seconds"
                  />
                  <span
                    className="text-[10px] sm:text-xs uppercase tracking-widest mt-1 select-none"
                    style={{ color: theme.textMuted }}
                  >
                    s
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Subtext info */}
          <div
            className="mt-4 text-xs tracking-wide uppercase transition-colors"
            style={{ color: theme.textMuted }}
          >
            {formatSessionLabel(totalSeconds)}
          </div>

          {/* Completion notice */}
          {isCompleted && (
            <div
              className="mt-4 px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 text-xs animate-bounce"
              style={{
                backgroundColor: theme.surfaceHover,
                color: theme.primary,
                border: `1px solid ${theme.primary}40`,
              }}
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Alarm sounded. Press Reset or choose a new time.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
