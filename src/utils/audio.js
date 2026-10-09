// Audio alarm synthesizer using Web Audio API

class SoundEngine {
  constructor() {
    this.audioCtx = null;
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  playZenBell(volume = 0.6) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const partials = [
      { freq: 440, gain: 0.6, decay: 3.5 },
      { freq: 880, gain: 0.3, decay: 2.5 },
      { freq: 1320, gain: 0.15, decay: 1.8 },
      { freq: 1760, gain: 0.08, decay: 1.2 },
    ];

    partials.forEach(({ freq, gain, decay }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gainNode.gain.setValueAtTime(gain * volume, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + decay);
    });
  }

  playCrystalChime(volume = 0.5) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6
    const startTime = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const noteTime = startTime + idx * 0.12;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gainNode.gain.setValueAtTime(0.0001, noteTime);
      gainNode.gain.exponentialRampToValueAtTime(volume * 0.4, noteTime + 0.03);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, noteTime + 2.0);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 2.0);
    });
  }

  playDigitalAlert(volume = 0.4) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const startTime = ctx.currentTime;
    const beeps = [0, 0.14, 0.28];

    beeps.forEach((delay) => {
      const time = startTime + delay;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, time);

      gainNode.gain.setValueAtTime(volume * 0.5, time);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(time);
      osc.stop(time + 0.1);
    });
  }

  playWarmGong(volume = 0.6) {
    const ctx = this.getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(196, now); // G3

    gainNode.gain.setValueAtTime(volume * 0.7, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 4.0);
  }

  play(soundType = 'crystal', volume = 0.6) {
    switch (soundType) {
      case 'zen':
        this.playZenBell(volume);
        break;
      case 'digital':
        this.playDigitalAlert(volume);
        break;
      case 'gong':
        this.playWarmGong(volume);
        break;
      case 'crystal':
      default:
        this.playCrystalChime(volume);
        break;
    }
  }
}

export const soundEngine = new SoundEngine();
