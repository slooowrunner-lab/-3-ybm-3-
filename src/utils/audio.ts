/**
 * Web Audio Synthesizer for Retro 8-bit BGM and crisp SFX,
 * plus Web Speech API for English vocabulary pronunciation.
 */

class RetroAudioEngine {
  private ctx: AudioContext | null = null;
  private bgmPlaying = false;
  private bgmInterval: number | null = null;
  private bgmStep = 0;
  private readonly melody = [
    261.63, 329.63, 392.00, 523.25, 392.00, 329.63,
    293.66, 349.23, 440.00, 349.23, 392.00, 523.25,
    659.25, 523.25, 440.00, 392.00
  ];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public isBgmActive(): boolean {
    return this.bgmPlaying;
  }

  public toggleBgm(onStateChange?: (playing: boolean) => void) {
    if (this.bgmPlaying) {
      this.stopBgm();
      onStateChange?.(false);
    } else {
      this.startBgm();
      onStateChange?.(true);
    }
  }

  public startBgm() {
    this.initCtx();
    if (!this.ctx) return;
    this.bgmPlaying = true;
    this.bgmStep = 0;

    if (this.bgmInterval) window.clearInterval(this.bgmInterval);

    this.bgmInterval = window.setInterval(() => {
      if (!this.bgmPlaying || !this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      const freq = this.melody[this.bgmStep % this.melody.length];
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.018, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
      this.bgmStep++;
    }, 200);
  }

  public stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmInterval) {
      window.clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public playClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(620, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio playback failsafe
    }
  }

  public playCorrect() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const start = this.ctx.currentTime + idx * 0.07;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.13);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.13);
      });
    } catch {
      // Audio playback failsafe
    }
  }

  public playCombo(combo: number) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const baseFreq = 523.25 * Math.pow(1.08, Math.min(combo, 10));
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const start = this.ctx.currentTime + idx * 0.06;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.18, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.11);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.11);
      });
    } catch {
      // Audio playback failsafe
    }
  }

  public playWrong() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [220, 175];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        const start = this.ctx.currentTime + idx * 0.11;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.18);
      });
    } catch {
      // Audio playback failsafe
    }
  }

  public playFanfare() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const chords = [523.25, 659.25, 783.99, 1046.50, 1318.51];
      chords.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const start = this.ctx.currentTime + idx * 0.09;
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.22, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.28);
      });
    } catch {
      // Audio playback failsafe
    }
  }

  public playEquipSound() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Audio playback failsafe
    }
  }

  public speak(text: string) {
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const clean = text.replace(/_+/g, 'blank');
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = 'en-US';
        utterance.rate = 0.85;
        window.speechSynthesis.speak(utterance);
      } catch {
        // Speech synthesis failsafe
      }
    }
  }
}

export const soundEngine = new RetroAudioEngine();
