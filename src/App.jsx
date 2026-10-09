import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import TimerDisplay from './components/TimerDisplay';
import TimeSelector from './components/TimeSelector';
import Controls from './components/Controls';
import ThemeModal from './components/ThemeModal';
import SoundModal from './components/SoundModal';
import { THEMES } from './utils/themes';
import { soundEngine } from './utils/audio';

export default function App() {
  // Saved settings
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem('studytimer_theme') || 'cosmic';
  });

  const [soundId, setSoundId] = useState(() => {
    return localStorage.getItem('studytimer_sound') || 'crystal';
  });

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('studytimer_volume');
    return saved !== null ? parseFloat(saved) : 0.6;
  });

  const [totalSeconds, setTotalSeconds] = useState(() => {
    const saved = localStorage.getItem('studytimer_total_seconds');
    return saved !== null ? parseInt(saved, 10) : 25 * 60;
  });

  // Timer states
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Modals & View Modes
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isSoundModalOpen, setIsSoundModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // References for precise timing
  const endTimeRef = useRef(null);
  const intervalRef = useRef(null);

  const currentTheme = THEMES.find((t) => t.id === themeId) || THEMES[0];

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('studytimer_theme', themeId);
  }, [themeId]);

  useEffect(() => {
    localStorage.setItem('studytimer_sound', soundId);
  }, [soundId]);

  useEffect(() => {
    localStorage.setItem('studytimer_volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('studytimer_total_seconds', totalSeconds.toString());
  }, [totalSeconds]);

  // Sync document theme styles
  useEffect(() => {
    document.documentElement.style.setProperty('--theme-bg', currentTheme.bg);
    document.documentElement.style.setProperty('--theme-text', currentTheme.text);
    document.body.style.backgroundColor = currentTheme.bg;
  }, [currentTheme]);

  // Browser title updates
  useEffect(() => {
    if (isCompleted) {
      document.title = 'StudiesTimer - Session Complete';
      return;
    }
    if (isRunning) {
      const hours = Math.floor(secondsLeft / 3600);
      const minutes = Math.floor((secondsLeft % 3600) / 60);
      const seconds = secondsLeft % 60;
      const pad = (n) => String(n).padStart(2, '0');
      const timeStr = hours > 0
        ? `${hours}:${pad(minutes)}:${pad(seconds)}`
        : `${pad(minutes)}:${pad(seconds)}`;
      document.title = `(${timeStr}) StudiesTimer`;
      return;
    }
    document.title = 'StudiesTimer - Aesthetic Focus & Study Timer';
  }, [isRunning, secondsLeft, isCompleted]);

  // Precise timer interval using Date.now() delta
  useEffect(() => {
    if (isRunning) {
      endTimeRef.current = Date.now() + secondsLeft * 1000;

      intervalRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000));
        setSecondsLeft(remaining);

        if (remaining <= 0) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setIsCompleted(true);
          soundEngine.play(soundId, volume);
        }
      }, 250);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, soundId, volume]);

  // Timer controls
  const handleStart = () => {
    if (secondsLeft <= 0 && !isCompleted) {
      return;
    }
    soundEngine.getAudioContext(); // Unlock audio context on user interaction
    if (isCompleted) {
      const fallbackSec = totalSeconds > 0 ? totalSeconds : 25 * 60;
      setTotalSeconds(fallbackSec);
      setSecondsLeft(fallbackSec);
      setIsCompleted(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    if (isRunning) {
      // Active: stop running and restore session time
      setIsRunning(false);
      setIsCompleted(false);
      setSecondsLeft(totalSeconds);
    } else {
      // Not active: put initial values to 0:00:00
      setIsRunning(false);
      setIsCompleted(false);
      setTotalSeconds(0);
      setSecondsLeft(0);
    }
  };

  const handleTimeChange = (newSec) => {
    setIsRunning(false);
    setIsCompleted(false);
    setTotalSeconds(newSec);
    setSecondsLeft(newSec);
  };

  const handleTestSound = (sId = soundId) => {
    soundEngine.play(sId, volume);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Fullscreen change listener
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col justify-between selection:bg-white/20 transition-colors"
      style={{
        backgroundColor: currentTheme.bg,
        color: currentTheme.text,
      }}
    >
      {/* Top Navbar */}
      <Navbar
        theme={currentTheme}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        onOpenSoundModal={() => setIsSoundModalOpen(true)}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Main Timer Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-20 pb-12 px-4 max-w-4xl mx-auto w-full">
        {/* Preset Buttons & +/- 1m Fine Tuning */}
        <TimeSelector
          currentSeconds={totalSeconds}
          onSelectSeconds={handleTimeChange}
          disabled={isRunning}
          theme={currentTheme}
        />

        {/* Circular Display with Direct Typing */}
        <TimerDisplay
          secondsLeft={secondsLeft}
          totalSeconds={totalSeconds}
          isRunning={isRunning}
          isCompleted={isCompleted}
          theme={currentTheme}
          onTimeChange={handleTimeChange}
          onStart={handleStart}
        />

        {/* Controls */}
        <Controls
          isRunning={isRunning}
          isCompleted={isCompleted}
          secondsLeft={secondsLeft}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
          onTestSound={() => handleTestSound()}
          theme={currentTheme}
        />
      </main>

      {/* Minimal Footer 
      <footer
        className="py-4 text-center text-xs border-t transition-colors"
        style={{
          borderColor: currentTheme.border,
          color: currentTheme.textMuted,
        }}
      >
        <span>StudiesTimer replica. Focus on what matters.</span>
      </footer>*/}

      {/* Modals */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentThemeId={themeId}
        onSelectTheme={setThemeId}
        theme={currentTheme}
      />

      <SoundModal
        isOpen={isSoundModalOpen}
        onClose={() => setIsSoundModalOpen(false)}
        selectedSound={soundId}
        onSelectSound={setSoundId}
        volume={volume}
        onChangeVolume={setVolume}
        onPlayPreview={handleTestSound}
        theme={currentTheme}
      />
    </div>
  );
}
