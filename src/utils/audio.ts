/**
 * Client-side Web Audio API synthesizer for tactile mechanical switch sounds
 * Works completely offline with zero latency and zero external audio file dependencies.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playKeySound(type: 'mechanical' | 'soft' | 'beep' = 'mechanical', volume: number = 0.5) {
  if (volume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const gain = ctx.createGain();
    const effectiveVol = Math.max(0.01, Math.min(volume, 1)) * 0.25;

    if (type === 'mechanical') {
      // Create a crisp mechanical switch click
      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();

      // Sharp initial transient click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.setValueAtTime(2.5, now);

      gain.gain.setValueAtTime(effectiveVol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);

      // Add a subtle second tiny tactile bottom-out tap
      const tapOsc = ctx.createOscillator();
      const tapGain = ctx.createGain();
      tapOsc.type = 'sine';
      tapOsc.frequency.setValueAtTime(80, now + 0.015);
      tapGain.gain.setValueAtTime(effectiveVol * 0.4, now + 0.015);
      tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      tapOsc.connect(tapGain);
      tapGain.connect(ctx.destination);
      tapOsc.start(now + 0.015);
      tapOsc.stop(now + 0.05);

    } else if (type === 'soft') {
      // Subtle muffled keypress
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.03);

      gain.gain.setValueAtTime(effectiveVol * 0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);

    } else {
      // Subtle retro blip
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(780, now);

      gain.gain.setValueAtTime(effectiveVol * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    }
  } catch {
    // Audio context may be restricted by autoplay policy until user interacts
  }
}

export function playErrorSound(volume: number = 0.5) {
  if (volume <= 0) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(95, now + 0.06);

    const effectiveVol = Math.max(0.01, Math.min(volume, 1)) * 0.18;
    gain.gain.setValueAtTime(effectiveVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch {
    // Ignore error
  }
}
