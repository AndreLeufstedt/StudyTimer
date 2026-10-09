# StudiesTimer Replica

A clean, aesthetic focus and Pomodoro timer replica inspired by studiestimer.com.

## Features

- Time Selection: Quick presets (15m, 25m, 45m, 60m, 90m), custom duration inputs.
- Visual Countdown: Circular SVG progress ring and large monospace digits.
- Alarm Audio System: Web Audio API sound synthesis with multiple sound profiles (Crystal Chime, Zen Bell, Digital Alert, Warm Gong) and volume controls.
- Aesthetic Themes: Switch between multiple visual styles (Cosmic Violet, Mono Dark, Sepia Warm, Deep Ocean, Forest Mist, Sunset Glow).
- Tab Synchronization: Browser tab title countdown updates in real time.
- Precise Timing: Timestamp delta calculation to prevent timer drift when tabs are backgrounded.
- Fullscreen Mode: Distraction-free study view.
- Zero Emojis: Strictly clean, minimal typography and vector icons.

## Quick Start

To install dependencies (if needed) and run the local development server:

```bash
make run
```

Then open http://localhost:3000 in your browser.

## Other Make Commands

- `make install` - Installs npm dependencies.
- `make build` - Generates an optimized production build in `dist/`.
- `make preview` - Previews the production build locally.
- `make clean` - Removes build artifacts and `node_modules`.
