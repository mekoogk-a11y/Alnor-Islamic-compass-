/**
 * Audio synthesis and helper utilities for Al-Noor Islamic Voice Studio
 */

let sharedAudioCtx: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (!sharedAudioCtx || sharedAudioCtx.state === 'closed') {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    sharedAudioCtx = new AudioContextClass();
  }
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

/**
 * Plays an authentic studio stinger / Islamic chime to open or conclude an advertisement
 */
export function playStudioStinger(type: 'intro' | 'outro' | 'click') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
      return;
    }

    if (type === 'intro') {
      // Warm spiritual chord arpeggio
      const notes = [293.66, 369.99, 440.0, 587.33]; // D, F#, A, D
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.3);
      });
    } else if (type === 'outro') {
      // Deep resonant bell chord
      const notes = [220.0, 277.18, 329.63, 440.0]; // A, C#, E, A
      notes.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 2.5);
      });
    }
  } catch (err) {
    console.warn('Could not play stinger:', err);
  }
}

/**
 * Background Ambient Islamic Pad generator class
 */
export class AmbientAtmosphere {
  private ctx: AudioContext | null = null;
  private oscillators: OscillatorNode[] = [];
  private masterGain: GainNode | null = null;
  private isPlaying = false;

  start(volume = 0.15) {
    if (this.isPlaying) return;
    try {
      this.ctx = getAudioContext();
      const now = this.ctx.currentTime;
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, now);
      this.masterGain.gain.linearRampToValueAtTime(volume, now + 1.5);
      this.masterGain.connect(this.ctx.destination);

      // Low peaceful ambient frequencies
      const frequencies = [110, 164.81, 220, 329.63]; // A2, E3, A3, E4
      this.oscillators = frequencies.map((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const filter = this.ctx!.createBiquadFilter();
        const gain = this.ctx!.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);

        gain.gain.setValueAtTime(0.12, now);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now);
        return osc;
      });

      this.isPlaying = true;
    } catch (e) {
      console.warn('Atmosphere start failed', e);
    }
  }

  setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.linearRampToValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime + 0.1);
    }
  }

  stop() {
    if (!this.isPlaying || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.masterGain) {
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
      }
      setTimeout(() => {
        this.oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
        this.oscillators = [];
        this.isPlaying = false;
      }, 850);
    } catch {
      this.isPlaying = false;
    }
  }

  get running() {
    return this.isPlaying;
  }
}

/**
 * Downloads base64 audio data as a WAV file
 */
export function downloadBase64Audio(base64Data: string, filename = 'AlNoor-Ad-Audio.wav') {
  const binaryString = window.atob(base64Data);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: 'audio/wav' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Format time in seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
