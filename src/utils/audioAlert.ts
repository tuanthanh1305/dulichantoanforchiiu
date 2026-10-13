// Synthesizes emergency warning sound using Web Audio API (works 100% offline)

let audioCtx: AudioContext | null = null;
let oscillator: OscillatorNode | null = null;
let gainNode: GainNode | null = null;
let sirenInterval: any = null;

export const EmergencyAudio = {
  playSiren() {
    if (oscillator) return; // already playing
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContextClass();
      oscillator = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();

      let high = false;
      sirenInterval = setInterval(() => {
        if (!oscillator || !audioCtx) return;
        high = !high;
        const targetFreq = high ? 950 : 550;
        oscillator.frequency.exponentialRampToValueAtTime(targetFreq, audioCtx.currentTime + 0.25);
      }, 350);
    } catch (e) {
      console.warn('Audio playback not supported or user gesture needed:', e);
    }
  },

  playWhistle() {
    this.stop();
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioCtx = new AudioContextClass();
      oscillator = audioCtx.createOscillator();
      gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(2400, audioCtx.currentTime);

      // Pulse whistle
      gainNode.gain.setValueAtTime(0.6, audioCtx.currentTime);
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.start();

      let on = true;
      sirenInterval = setInterval(() => {
        if (!gainNode || !audioCtx) return;
        on = !on;
        gainNode.gain.setValueAtTime(on ? 0.6 : 0.05, audioCtx.currentTime + 0.05);
      }, 200);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  },

  stop() {
    if (sirenInterval) {
      clearInterval(sirenInterval);
      sirenInterval = null;
    }
    if (oscillator) {
      try {
        oscillator.stop();
        oscillator.disconnect();
      } catch (e) {}
      oscillator = null;
    }
    if (audioCtx) {
      try {
        audioCtx.close();
      } catch (e) {}
      audioCtx = null;
    }
  },
};
