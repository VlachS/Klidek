/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Calming sound synthesis using Web Audio API
// High-fidelity natural modeling: Zero video game blips, authentic acoustics

let audioCtx: AudioContext | null = null;
let isMuted = false;

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

export function setMuted(muted: boolean) {
  isMuted = muted;
  if (isMuted) {
    stopAllContinuousSounds();
  }
}

export function getIsMuted(): boolean {
  return isMuted;
}

// Pentatonic scale for soothing chimes (GENTLE & VERY QUIET as requested!)
const PENTATONIC = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];

export function playChime(index = 0) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const freq = PENTATONIC[Math.abs(index) % PENTATONIC.length];
  const now = ctx.currentTime;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  // Whisper-quiet level (user specifically requested to lower button sound significantly!)
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.016, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.8);
}

export function playBubblePop(freqVariation = 1) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const baseFreq = 420 * freqVariation;
  osc.type = 'sine';
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.06);

  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

export function playStoneThud() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(140, now);
  osc.frequency.exponentialRampToValueAtTime(70, now + 0.16);

  gain.gain.setValueAtTime(0.045, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.21);
}

// Squishy stress ball compression and elastic release sounds (gentle ASMR acoustics)
export function playSquishPress(intensity = 1) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  // Soft low sine dropping from ~170Hz to ~65Hz (viscous squish deformation)
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150 + Math.min(intensity, 2) * 20, now);
  osc.frequency.exponentialRampToValueAtTime(65, now + 0.15);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(300, now);

  const vol = Math.min(0.045, 0.024 * intensity);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(vol, now + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

  osc.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.18);
}

export function playSquishRelease() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Gentle upward rebound chirp
  osc.type = 'sine';
  osc.frequency.setValueAtTime(90, now);
  osc.frequency.exponentialRampToValueAtTime(180, now + 0.09);

  gain.gain.setValueAtTime(0.018, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.12);
}

// Deep, resonant Tibetan singing bowl & grounding anchor resonance
export function playAnchorGrounding() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  // Deep calm singing bowl harmonic stack (130.81 Hz fundamental with gentle harmonic decay)
  const fundamental = 130.81;
  const harmonics = [1, 2.01, 3.01, 4.2];
  const gains = [0.035, 0.015, 0.008, 0.003];

  harmonics.forEach((h, i) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(fundamental * h, now);

    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(gains[i], now + 0.06);
    g.gain.exponentialRampToValueAtTime(0.00001, now + 2.2);

    osc.connect(g);
    g.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 2.3);
  });
}

// Natural soothing water droplet ripple sound
export function playWaterDropRipple() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // Natural droplet "plop" with gentle resonant tone
  osc.type = 'sine';
  osc.frequency.setValueAtTime(580 + Math.random() * 80, now);
  osc.frequency.exponentialRampToValueAtTime(420, now + 0.04);
  osc.frequency.exponentialRampToValueAtTime(750 + Math.random() * 80, now + 0.09);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.018, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.23);
}

// Subtle trickle/tap of a rain drop sliding on window glass
export function playRaindropTrickle() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(750 + Math.random() * 150, now);
  osc.frequency.exponentialRampToValueAtTime(480, now + 0.035);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.009, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.065);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.075);
}

/* -------------------------------------------------------------
 * CAT PURR GENERATOR (Předení kočky - 100% stabilní, bez praskání a záseků)
 * ------------------------------------------------------------*/
let purrNodes: {
  oscLow: OscillatorNode;
  oscMid: OscillatorNode;
  modOsc: OscillatorNode;
  modGain: GainNode;
  breatheOsc: OscillatorNode;
  breatheGain: GainNode;
  masterGain: GainNode;
  filter: BiquadFilterNode;
} | null = null;

let currentCatVolume = 0.8;

export function setCatPurrVolume(volume: number) {
  currentCatVolume = Math.max(0, Math.min(1, volume));
  if (purrNodes && audioCtx) {
    purrNodes.masterGain.gain.setTargetAtTime(0.35 * currentCatVolume, audioCtx.currentTime, 0.1);
  }
}

export function startCatPurr(volume = 0.8) {
  currentCatVolume = volume;
  if (isMuted || purrNodes) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Master Gain
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, now);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, 0.35 * currentCatVolume), now + 0.3);

  // Gentle lowpass filter with low Q to prevent IIR pole divergence/clicks
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(140, now);
  filter.Q.setValueAtTime(0.5, now);

  // Dual carrier oscillators in safe, stable harmonic register (48 Hz & 72 Hz)
  const oscLow = ctx.createOscillator();
  oscLow.type = 'triangle';
  oscLow.frequency.setValueAtTime(48, now);

  const oscMid = ctx.createOscillator();
  oscMid.type = 'sine';
  oscMid.frequency.setValueAtTime(72, now);

  // Subtle 26 Hz feline rattle modulation with safe depth (+- 8 Hz)
  const modOsc = ctx.createOscillator();
  modOsc.type = 'sine';
  modOsc.frequency.setValueAtTime(26, now);

  const modGain = ctx.createGain();
  modGain.gain.setValueAtTime(8, now); // safe depth: 48 - 8 = 40 Hz minimum (strictly positive)
  modOsc.connect(modGain);
  modGain.connect(oscLow.frequency);
  modGain.connect(oscMid.frequency);

  // Inhale/Exhale breath modulation via hardware LFO (NO setInterval glitches!)
  const breatheOsc = ctx.createOscillator();
  breatheOsc.type = 'sine';
  breatheOsc.frequency.setValueAtTime(0.22, now); // 4.5s breath cycle

  const breatheGain = ctx.createGain();
  breatheGain.gain.setValueAtTime(0.35, now);
  breatheOsc.connect(breatheGain);

  const vcaGain = ctx.createGain();
  vcaGain.gain.setValueAtTime(0.65, now);
  breatheGain.connect(vcaGain.gain);

  oscLow.connect(filter);
  oscMid.connect(filter);
  filter.connect(vcaGain);
  vcaGain.connect(masterGain);
  masterGain.connect(ctx.destination);

  oscLow.start(now);
  oscMid.start(now);
  modOsc.start(now);
  breatheOsc.start(now);

  purrNodes = { oscLow, oscMid, modOsc, modGain, breatheOsc, breatheGain, masterGain, filter };
}

export function stopCatPurr() {
  if (!purrNodes || !audioCtx) return;
  const now = audioCtx.currentTime;
  try {
    purrNodes.masterGain.gain.setValueAtTime(purrNodes.masterGain.gain.value, now);
    purrNodes.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
    const nodes = purrNodes;
    purrNodes = null;
    setTimeout(() => {
      try {
        nodes.oscLow.stop();
        nodes.oscMid.stop();
        nodes.modOsc.stop();
        nodes.breatheOsc.stop();
      } catch {
        // ignore
      }
    }, 350);
  } catch {
    purrNodes = null;
  }
}

export function isCatPurring(): boolean {
  return purrNodes !== null;
}

/* -------------------------------------------------------------
 * CONTINUOUS RELAXATION SOUND GENERATORS
 * Completely rebuilt with authentic acoustics:
 * 1. Rain = Real water patter & drumming on sill
 * 2. Ocean = Real surging waves breaking on shore (NO wind)
 * 3. Fireplace = Real thermal wood micro-crackles & ember sizzle (NO video game)
 * 4. Leaves = Real dry leaf footsteps & friction (NO video game)
 * 5. Whale Songs = Deep underwater ocean hydrophone + melodic whale singing
 * ------------------------------------------------------------*/

interface ActiveSoundInstance {
  stop: () => void;
  setVolume: (v: number) => void;
}

const activeSoundsMap = new Map<string, ActiveSoundInstance>();

// Generate a pink/brown noise buffer for natural fluid beds
function createNoiseBuffer(ctx: AudioContext, seconds = 6): AudioBuffer {
  const bufferSize = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
    b6 = white * 0.115926;
  }
  return buffer;
}

// 1. DÉŠŤ NA PARAPETU (Skutečné bubnování kapek vody na parapet a sklo)
function startRainSound(ctx: AudioContext, volume: number): ActiveSoundInstance {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.6 * volume), ctx.currentTime + 0.3);

  // Continuous rain background wash (filtered, gentle)
  const bgNoise = ctx.createBufferSource();
  bgNoise.buffer = createNoiseBuffer(ctx, 6);
  bgNoise.loop = true;
  const bgFilter = ctx.createBiquadFilter();
  bgFilter.type = 'lowpass';
  bgFilter.frequency.setValueAtTime(1600, ctx.currentTime);
  const bgGain = ctx.createGain();
  bgGain.gain.setValueAtTime(0.2, ctx.currentTime);
  bgNoise.connect(bgFilter);
  bgFilter.connect(bgGain);
  bgGain.connect(masterGain);
  bgNoise.start();

  // Rapid water drumming on windowsill: continuous stream of natural raindrop impacts
  const dropInterval = window.setInterval(() => {
    if (isMuted || !audioCtx) return;
    const now = audioCtx.currentTime;

    const drops = 4 + Math.floor(Math.random() * 4);
    for (let i = 0; i < drops; i++) {
      const delay = i * 0.018 + Math.random() * 0.015;
      const bufferSize = Math.floor(ctx.sampleRate * 0.022); // 22 ms drop
      const dropBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = dropBuf.getChannelData(0);
      const freq = 650 + Math.random() * 950;
      const decay = 120 + Math.random() * 80;

      for (let s = 0; s < bufferSize; s++) {
        const t = s / ctx.sampleRate;
        const env = Math.exp(-decay * t);
        const click = (Math.random() * 2 - 1) * Math.exp(-t * 400);
        const ring = Math.sin(2 * Math.PI * freq * t);
        data[s] = (click * 0.6 + ring * 0.4) * env;
      }

      const dropSource = ctx.createBufferSource();
      dropSource.buffer = dropBuf;

      const dropGain = ctx.createGain();
      const dropVol = 0.12 + Math.random() * 0.16;
      dropGain.gain.setValueAtTime(dropVol, now + delay);

      dropSource.connect(dropGain);
      dropGain.connect(masterGain);

      dropSource.start(now + delay);
    }
  }, 80);

  masterGain.connect(ctx.destination);

  return {
    setVolume: (v: number) => {
      masterGain.gain.setTargetAtTime(Math.max(0.0001, 0.6 * v), ctx.currentTime, 0.05);
    },
    stop: () => {
      clearInterval(dropInterval);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setTimeout(() => {
        try {
          bgNoise.stop();
        } catch {
          // ignore
        }
      }, 450);
    },
  };
}

// 2. MOŘE A VLNY (Skutečný příboj a valící se vlny – ŽÁDNÝ VÍTR!)
function startOceanSound(ctx: AudioContext, volume: number): ActiveSoundInstance {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.65 * volume), ctx.currentTime + 0.4);

  // Sub-bass ocean mass undertow (40-60 Hz rumble)
  const undertowNoise = ctx.createBufferSource();
  undertowNoise.buffer = createNoiseBuffer(ctx, 8);
  undertowNoise.loop = true;
  const undertowFilter = ctx.createBiquadFilter();
  undertowFilter.type = 'lowpass';
  undertowFilter.frequency.setValueAtTime(75, ctx.currentTime);
  const undertowGain = ctx.createGain();
  undertowGain.gain.setValueAtTime(0.28, ctx.currentTime);
  undertowNoise.connect(undertowFilter);
  undertowFilter.connect(undertowGain);
  undertowGain.connect(masterGain);
  undertowNoise.start();

  // Wave water body (bandpass filtered water mass)
  const waveNoise = ctx.createBufferSource();
  waveNoise.buffer = createNoiseBuffer(ctx, 8);
  waveNoise.loop = true;

  const waveFilter = ctx.createBiquadFilter();
  waveFilter.type = 'lowpass';
  waveFilter.frequency.setValueAtTime(180, ctx.currentTime);

  const waveGain = ctx.createGain();
  waveGain.gain.setValueAtTime(0.12, ctx.currentTime);

  waveNoise.connect(waveFilter);
  waveFilter.connect(waveGain);
  waveGain.connect(masterGain);
  waveNoise.start();

  // Foam wash noise (water rushing across pebbles/sand on beach)
  const foamNoise = ctx.createBufferSource();
  foamNoise.buffer = createNoiseBuffer(ctx, 8);
  foamNoise.loop = true;
  const foamFilter = ctx.createBiquadFilter();
  foamFilter.type = 'bandpass';
  foamFilter.frequency.setValueAtTime(650, ctx.currentTime);
  foamFilter.Q.setValueAtTime(0.6, ctx.currentTime);
  const foamGain = ctx.createGain();
  foamGain.gain.setValueAtTime(0.001, ctx.currentTime);
  foamNoise.connect(foamFilter);
  foamFilter.connect(foamGain);
  foamGain.connect(masterGain);
  foamNoise.start();

  let phase = 0;
  const waveInterval = window.setInterval(() => {
    if (!audioCtx) return;
    phase += 0.045;
    const cycle = (Math.sin(phase) + 1) / 2; // 0 to 1

    const waterCutoff = 120 + Math.pow(cycle, 2.5) * 450;
    const bodyVol = 0.15 + Math.pow(cycle, 2) * 0.6;
    const foamCutoff = 350 + cycle * 550;
    const foamVol = Math.max(0.001, (Math.sin(phase - 0.4) > 0 ? Math.sin(phase - 0.4) * 0.45 : 0.01));

    try {
      waveFilter.frequency.setTargetAtTime(waterCutoff, audioCtx.currentTime, 0.25);
      waveGain.gain.setTargetAtTime(Math.max(0.001, bodyVol), audioCtx.currentTime, 0.25);

      foamFilter.frequency.setTargetAtTime(foamCutoff, audioCtx.currentTime, 0.25);
      foamGain.gain.setTargetAtTime(Math.max(0.001, foamVol), audioCtx.currentTime, 0.25);
    } catch {
      // ignore
    }
  }, 100);

  masterGain.connect(ctx.destination);

  return {
    setVolume: (v: number) => {
      masterGain.gain.setTargetAtTime(Math.max(0.0001, 0.65 * v), ctx.currentTime, 0.05);
    },
    stop: () => {
      clearInterval(waveInterval);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
      setTimeout(() => {
        try {
          undertowNoise.stop();
          waveNoise.stop();
          foamNoise.stop();
        } catch {
          // ignore
        }
      }, 650);
    },
  };
}

// 3. PRASKÁNÍ DŘEVA V KRBU (Skutečné tepelné praskání dřeva, lupkání pryskyřice – ŽÁDNÁ VIDEOHRA!)
function startFireplaceSound(ctx: AudioContext, volume: number): ActiveSoundInstance {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.6 * volume), ctx.currentTime + 0.3);

  // Warm glowing hearth bed rumble (brownian ember noise)
  const emberNoise = ctx.createBufferSource();
  emberNoise.buffer = createNoiseBuffer(ctx, 5);
  emberNoise.loop = true;
  const emberFilter = ctx.createBiquadFilter();
  emberFilter.type = 'lowpass';
  emberFilter.frequency.setValueAtTime(95, ctx.currentTime);
  const emberGain = ctx.createGain();
  emberGain.gain.setValueAtTime(0.25, ctx.currentTime);
  emberNoise.connect(emberFilter);
  emberFilter.connect(emberGain);
  emberGain.connect(masterGain);
  emberNoise.start();

  // Sizzling ember hiss
  const sizzleNoise = ctx.createBufferSource();
  sizzleNoise.buffer = createNoiseBuffer(ctx, 4);
  sizzleNoise.loop = true;
  const sizzleFilter = ctx.createBiquadFilter();
  sizzleFilter.type = 'bandpass';
  sizzleFilter.frequency.setValueAtTime(1800, ctx.currentTime);
  sizzleFilter.Q.setValueAtTime(0.8, ctx.currentTime);
  const sizzleGain = ctx.createGain();
  sizzleGain.gain.setValueAtTime(0.06, ctx.currentTime);
  sizzleNoise.connect(sizzleFilter);
  sizzleFilter.connect(sizzleGain);
  sizzleGain.connect(masterGain);
  sizzleNoise.start();

  const crackleInterval = window.setInterval(() => {
    if (isMuted || !audioCtx) return;
    const now = audioCtx.currentTime;

    const isBigSnap = Math.random() < 0.22;
    const count = isBigSnap ? 2 : 1;

    for (let i = 0; i < count; i++) {
      const delay = i * 0.02;
      const bufferLen = Math.floor(ctx.sampleRate * (isBigSnap ? 0.035 : 0.008));
      const snapBuf = ctx.createBuffer(1, bufferLen, ctx.sampleRate);
      const data = snapBuf.getChannelData(0);

      const decayRate = isBigSnap ? 90 : 350;
      for (let s = 0; s < bufferLen; s++) {
        const t = s / ctx.sampleRate;
        const white = Math.random() * 2 - 1;
        data[s] = white * Math.exp(-decayRate * t);
      }

      const snapSource = ctx.createBufferSource();
      snapSource.buffer = snapBuf;

      const snapFilter = ctx.createBiquadFilter();
      snapFilter.type = isBigSnap ? 'bandpass' : 'highpass';
      snapFilter.frequency.setValueAtTime(isBigSnap ? 2400 : 3200, now + delay);
      snapFilter.Q.setValueAtTime(1.5, now + delay);

      const snapGain = ctx.createGain();
      const snapVol = isBigSnap ? 0.32 + Math.random() * 0.2 : 0.14 + Math.random() * 0.1;
      snapGain.gain.setValueAtTime(snapVol, now + delay);

      snapSource.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(masterGain);

      snapSource.start(now + delay);
    }
  }, 65);

  masterGain.connect(ctx.destination);

  return {
    setVolume: (v: number) => {
      masterGain.gain.setTargetAtTime(Math.max(0.0001, 0.6 * v), ctx.currentTime, 0.05);
    },
    stop: () => {
      clearInterval(crackleInterval);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setTimeout(() => {
        try {
          emberNoise.stop();
          sizzleNoise.stop();
        } catch {
          // ignore
        }
      }, 450);
    },
  };
}

// 4. JEMNÝ VÍTR V KORUNÁCH (Soft forest breeze)
function startWindSound(ctx: AudioContext, volume: number): ActiveSoundInstance {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.55 * volume), ctx.currentTime + 0.3);

  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, 6);
  noise.loop = true;

  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'bandpass';
  bandpass.frequency.setValueAtTime(380, ctx.currentTime);
  bandpass.Q.setValueAtTime(2.0, ctx.currentTime);

  let windT = 0;
  const windInterval = window.setInterval(() => {
    if (!audioCtx) return;
    windT += 0.04;
    const center = 340 + Math.sin(windT) * 140;
    try {
      bandpass.frequency.setTargetAtTime(center, audioCtx.currentTime, 0.4);
    } catch {
      // ignore
    }
  }, 120);

  noise.connect(bandpass);
  bandpass.connect(masterGain);
  masterGain.connect(ctx.destination);
  noise.start();

  return {
    setVolume: (v: number) => {
      masterGain.gain.setTargetAtTime(Math.max(0.0001, 0.55 * v), ctx.currentTime, 0.05);
    },
    stop: () => {
      clearInterval(windInterval);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      setTimeout(() => noise.stop(), 550);
    },
  };
}

// 5. PRASKÁNÍ POPADANÉHO LISTÍ (Skutečné suché šustění a křupání pod nohama – ŽÁDNÁ VIDEOHRA!)
function startLeavesSound(ctx: AudioContext, volume: number): ActiveSoundInstance {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.6 * volume), ctx.currentTime + 0.3);

  // Soft forest air background
  const forestNoise = ctx.createBufferSource();
  forestNoise.buffer = createNoiseBuffer(ctx, 5);
  forestNoise.loop = true;
  const forestFilter = ctx.createBiquadFilter();
  forestFilter.type = 'lowpass';
  forestFilter.frequency.setValueAtTime(800, ctx.currentTime);
  const forestGain = ctx.createGain();
  forestGain.gain.setValueAtTime(0.1, ctx.currentTime);
  forestNoise.connect(forestFilter);
  forestFilter.connect(forestGain);
  forestGain.connect(masterGain);
  forestNoise.start();

  const triggerLeafStep = () => {
    if (isMuted || !audioCtx) return;
    const now = audioCtx.currentTime;

    const grains = 8 + Math.floor(Math.random() * 5);
    for (let i = 0; i < grains; i++) {
      const delay = (i * 0.02) + (Math.random() * 0.015);
      const grainLen = Math.floor(ctx.sampleRate * 0.025); // 25 ms per grain
      const grainBuf = ctx.createBuffer(1, grainLen, ctx.sampleRate);
      const data = grainBuf.getChannelData(0);

      for (let s = 0; s < grainLen; s++) {
        const t = s / ctx.sampleRate;
        const white = Math.random() * 2 - 1;
        data[s] = white * Math.exp(-t * 180);
      }

      const grainSource = ctx.createBufferSource();
      grainSource.buffer = grainBuf;

      const grainFilter = ctx.createBiquadFilter();
      grainFilter.type = 'bandpass';
      grainFilter.frequency.setValueAtTime(2200 + Math.random() * 2400, now + delay);
      grainFilter.Q.setValueAtTime(1.8, now + delay);

      const grainGain = ctx.createGain();
      const grainVol = 0.16 + Math.random() * 0.18;
      grainGain.gain.setValueAtTime(grainVol, now + delay);

      grainSource.connect(grainFilter);
      grainFilter.connect(grainGain);
      grainGain.connect(masterGain);

      grainSource.start(now + delay);
    }
  };

  triggerLeafStep();
  const stepInterval = window.setInterval(triggerLeafStep, 1600);

  masterGain.connect(ctx.destination);

  return {
    setVolume: (v: number) => {
      masterGain.gain.setTargetAtTime(Math.max(0.0001, 0.6 * v), ctx.currentTime, 0.05);
    },
    stop: () => {
      clearInterval(stepInterval);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setTimeout(() => {
        try {
          forestNoise.stop();
        } catch {
          // ignore
        }
      }, 450);
    },
  };
}

// 6. VELRYBÍ PÍSNĚ (Přesně podle YouTube videa: Hluboký podmořský prostor, pomalý teskný velrybí zpěv a ozvěna)
function startWhaleSound(ctx: AudioContext, volume: number): ActiveSoundInstance {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.7 * volume), ctx.currentTime + 0.5);

  // 1. Deep ocean hydrophone drone (<95 Hz lowpass)
  const underwaterNoise = ctx.createBufferSource();
  underwaterNoise.buffer = createNoiseBuffer(ctx, 8);
  underwaterNoise.loop = true;
  const underFilter = ctx.createBiquadFilter();
  underFilter.type = 'lowpass';
  underFilter.frequency.setValueAtTime(95, ctx.currentTime);
  const underGain = ctx.createGain();
  underGain.gain.setValueAtTime(0.3, ctx.currentTime);
  underwaterNoise.connect(underFilter);
  underFilter.connect(underGain);
  underGain.connect(masterGain);
  underwaterNoise.start();

  // 2. Oceanic Delay / Reverb Feedback Line
  const delayNode = ctx.createDelay();
  delayNode.delayTime.setValueAtTime(0.95, ctx.currentTime);
  const delayFeedback = ctx.createGain();
  delayFeedback.gain.setValueAtTime(0.48, ctx.currentTime);
  const delayDamping = ctx.createBiquadFilter();
  delayDamping.type = 'lowpass';
  delayDamping.frequency.setValueAtTime(380, ctx.currentTime);

  delayNode.connect(delayDamping);
  delayDamping.connect(delayFeedback);
  delayFeedback.connect(delayNode);
  delayDamping.connect(masterGain);

  const whalePitches = [
    { start: 165, peak: 245, end: 175, duration: 4.2 },
    { start: 220, peak: 185, end: 140, duration: 3.8 },
    { start: 180, peak: 290, end: 210, duration: 4.8 },
    { start: 240, peak: 320, end: 190, duration: 3.5 },
  ];
  let callIdx = 0;

  const singWhaleCall = () => {
    if (isMuted || !audioCtx) return;
    const now = audioCtx.currentTime;

    const call = whalePitches[callIdx % whalePitches.length];
    callIdx++;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();

    const formantFilter = audioCtx.createBiquadFilter();
    formantFilter.type = 'bandpass';
    formantFilter.frequency.setValueAtTime(call.start * 1.5, now);
    formantFilter.Q.setValueAtTime(2.8, now);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(call.start, now);
    osc1.frequency.exponentialRampToValueAtTime(call.peak, now + call.duration * 0.45);
    osc1.frequency.exponentialRampToValueAtTime(call.end, now + call.duration * 0.95);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(call.start * 2.01, now);
    osc2.frequency.exponentialRampToValueAtTime(call.peak * 2.01, now + call.duration * 0.45);
    osc2.frequency.exponentialRampToValueAtTime(call.end * 2.01, now + call.duration * 0.95);

    formantFilter.frequency.exponentialRampToValueAtTime(call.peak * 1.6, now + call.duration * 0.45);
    formantFilter.frequency.exponentialRampToValueAtTime(call.end * 1.4, now + call.duration * 0.95);

    const vibOsc = audioCtx.createOscillator();
    const vibGain = audioCtx.createGain();
    vibOsc.frequency.setValueAtTime(3.2, now);
    vibGain.gain.setValueAtTime(3.5, now);
    vibOsc.connect(vibGain);
    vibGain.connect(osc1.frequency);
    vibGain.connect(osc2.frequency);
    vibOsc.start(now);
    vibOsc.stop(now + call.duration);

    const callGain = audioCtx.createGain();
    callGain.gain.setValueAtTime(0.001, now);
    callGain.gain.exponentialRampToValueAtTime(0.35, now + 1.2);
    callGain.gain.exponentialRampToValueAtTime(0.0001, now + call.duration);

    osc1.connect(formantFilter);
    osc2.connect(formantFilter);
    formantFilter.connect(callGain);

    callGain.connect(masterGain);
    callGain.connect(delayNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + call.duration + 0.1);
    osc2.stop(now + call.duration + 0.1);
  };

  singWhaleCall();
  const whaleInterval = window.setInterval(singWhaleCall, 5000);

  masterGain.connect(ctx.destination);

  return {
    setVolume: (v: number) => {
      masterGain.gain.setTargetAtTime(Math.max(0.0001, 0.7 * v), ctx.currentTime, 0.05);
    },
    stop: () => {
      clearInterval(whaleInterval);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      setTimeout(() => {
        try {
          underwaterNoise.stop();
        } catch {
          // ignore
        }
      }, 850);
    },
  };
}

// 7. LESNÍ POTŮČEK (Tekoucí horská bystřina, bublající voda přes oblázky)
function startBrookSound(ctx: AudioContext, volume: number): ActiveSoundInstance {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.6 * volume), ctx.currentTime + 0.3);

  // Flowing water stream bed (filtered pink noise)
  const streamNoise = ctx.createBufferSource();
  streamNoise.buffer = createNoiseBuffer(ctx, 6);
  streamNoise.loop = true;
  const streamFilter = ctx.createBiquadFilter();
  streamFilter.type = 'bandpass';
  streamFilter.frequency.setValueAtTime(550, ctx.currentTime);
  streamFilter.Q.setValueAtTime(1.2, ctx.currentTime);
  const streamGain = ctx.createGain();
  streamGain.gain.setValueAtTime(0.25, ctx.currentTime);
  streamNoise.connect(streamFilter);
  streamFilter.connect(streamGain);
  streamGain.connect(masterGain);
  streamNoise.start();

  // Rapid water droplets and bubbling water trickle over stones
  const bubbleInterval = window.setInterval(() => {
    if (isMuted || !audioCtx) return;
    const now = audioCtx.currentTime;

    const blips = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < blips; i++) {
      const delay = i * 0.02 + Math.random() * 0.015;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = 450 + Math.random() * 650;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + delay);
      osc.frequency.exponentialRampToValueAtTime(freq * (1.1 + Math.random() * 0.2), now + delay + 0.04);

      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.035 + Math.random() * 0.03, now + delay + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.045);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + delay);
      osc.stop(now + delay + 0.05);
    }
  }, 90);

  masterGain.connect(ctx.destination);

  return {
    setVolume: (v: number) => {
      masterGain.gain.setTargetAtTime(Math.max(0.0001, 0.6 * v), ctx.currentTime, 0.05);
    },
    stop: () => {
      clearInterval(bubbleInterval);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setTimeout(() => {
        try {
          streamNoise.stop();
        } catch {
          // ignore
        }
      }, 450);
    },
  };
}

// 8. RANNÍ ZPĚV PTÁČKŮ (Jemné melodické cvrlikání v probouzejícím se lese)
function startBirdsSound(ctx: AudioContext, volume: number): ActiveSoundInstance {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.55 * volume), ctx.currentTime + 0.4);

  // Soft forest air background
  const forestNoise = ctx.createBufferSource();
  forestNoise.buffer = createNoiseBuffer(ctx, 6);
  forestNoise.loop = true;
  const forestFilter = ctx.createBiquadFilter();
  forestFilter.type = 'lowpass';
  forestFilter.frequency.setValueAtTime(500, ctx.currentTime);
  const forestGain = ctx.createGain();
  forestGain.gain.setValueAtTime(0.06, ctx.currentTime);
  forestNoise.connect(forestFilter);
  forestFilter.connect(forestGain);
  forestGain.connect(masterGain);
  forestNoise.start();

  const birdMelodies = [
    [2400, 2900, 2600],
    [3200, 3600, 3100, 3800],
    [2200, 2500, 2800],
    [1950, 2400, 2200],
  ];
  let melIdx = 0;

  const chirp = () => {
    const actx = audioCtx;
    if (isMuted || !actx) return;
    const now = actx.currentTime;
    const notes = birdMelodies[melIdx % birdMelodies.length];
    melIdx++;

    notes.forEach((f, i) => {
      const delay = i * 0.07;
      const osc = actx.createOscillator();
      const gain = actx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now + delay);
      osc.frequency.exponentialRampToValueAtTime(f * 1.15, now + delay + 0.03);
      osc.frequency.exponentialRampToValueAtTime(f * 0.95, now + delay + 0.06);

      gain.gain.setValueAtTime(0.0001, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.045, now + delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.07);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now + delay);
      osc.stop(now + delay + 0.08);
    });
  };

  chirp();
  const birdInterval = window.setInterval(chirp, 2200);

  masterGain.connect(ctx.destination);

  return {
    setVolume: (v: number) => {
      masterGain.gain.setTargetAtTime(Math.max(0.0001, 0.55 * v), ctx.currentTime, 0.05);
    },
    stop: () => {
      clearInterval(birdInterval);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      setTimeout(() => {
        try {
          forestNoise.stop();
        } catch {
          // ignore
        }
      }, 450);
    },
  };
}

// 9. BOUŘKA & VZDÁLENÉ HROMY (Hluboké dunění hromů a déšť)
function startThunderSound(ctx: AudioContext, volume: number): ActiveSoundInstance {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.65 * volume), ctx.currentTime + 0.4);

  // Continuous rain background
  const rainNoise = ctx.createBufferSource();
  rainNoise.buffer = createNoiseBuffer(ctx, 6);
  rainNoise.loop = true;
  const rainFilter = ctx.createBiquadFilter();
  rainFilter.type = 'lowpass';
  rainFilter.frequency.setValueAtTime(1400, ctx.currentTime);
  const rainGain = ctx.createGain();
  rainGain.gain.setValueAtTime(0.2, ctx.currentTime);
  rainNoise.connect(rainFilter);
  rainFilter.connect(rainGain);
  rainGain.connect(masterGain);
  rainNoise.start();

  // Distant rolling thunder rumble
  const triggerThunder = () => {
    if (isMuted || !audioCtx) return;
    const now = audioCtx.currentTime;
    const dur = 4.5;

    const noise = ctx.createBufferSource();
    noise.buffer = createNoiseBuffer(ctx, 5);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(55, now);
    filter.frequency.exponentialRampToValueAtTime(85, now + 1.2);
    filter.frequency.exponentialRampToValueAtTime(45, now + dur);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.35, now + 0.8);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 2.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(masterGain);

    noise.start(now);
    noise.stop(now + dur + 0.1);
  };

  triggerThunder();
  const thunderInterval = window.setInterval(triggerThunder, 9000);

  masterGain.connect(ctx.destination);

  return {
    setVolume: (v: number) => {
      masterGain.gain.setTargetAtTime(Math.max(0.0001, 0.65 * v), ctx.currentTime, 0.05);
    },
    stop: () => {
      clearInterval(thunderInterval);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      setTimeout(() => {
        try {
          rainNoise.stop();
        } catch {
          // ignore
        }
      }, 550);
    },
  };
}

// 10. HOŘÍCÍ SVÍČKA (Jemný mihotavý plamínek a tiché praskání knotu)
function startCandleSound(ctx: AudioContext, volume: number): ActiveSoundInstance {
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.0001, 0.5 * volume), ctx.currentTime + 0.3);

  // Soft warm air hiss
  const hissNoise = ctx.createBufferSource();
  hissNoise.buffer = createNoiseBuffer(ctx, 5);
  hissNoise.loop = true;
  const hissFilter = ctx.createBiquadFilter();
  hissFilter.type = 'bandpass';
  hissFilter.frequency.setValueAtTime(1400, ctx.currentTime);
  hissFilter.Q.setValueAtTime(1.0, ctx.currentTime);
  const hissGain = ctx.createGain();
  hissGain.gain.setValueAtTime(0.06, ctx.currentTime);
  hissNoise.connect(hissFilter);
  hissFilter.connect(hissGain);
  hissGain.connect(masterGain);
  hissNoise.start();

  // Delicate wick micro-crackles
  const wickInterval = window.setInterval(() => {
    if (isMuted || !audioCtx) return;
    const now = audioCtx.currentTime;

    if (Math.random() < 0.45) {
      const snapBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.012), ctx.sampleRate);
      const data = snapBuf.getChannelData(0);
      for (let s = 0; s < data.length; s++) {
        data[s] = (Math.random() * 2 - 1) * Math.exp(-s / (ctx.sampleRate * 0.002));
      }
      const snapSource = ctx.createBufferSource();
      snapSource.buffer = snapBuf;
      const snapFilter = ctx.createBiquadFilter();
      snapFilter.type = 'highpass';
      snapFilter.frequency.setValueAtTime(2600, now);
      const snapGain = ctx.createGain();
      snapGain.gain.setValueAtTime(0.08 + Math.random() * 0.06, now);
      snapSource.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(masterGain);
      snapSource.start(now);
    }
  }, 120);

  masterGain.connect(ctx.destination);

  return {
    setVolume: (v: number) => {
      masterGain.gain.setTargetAtTime(Math.max(0.0001, 0.5 * v), ctx.currentTime, 0.05);
    },
    stop: () => {
      clearInterval(wickInterval);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      setTimeout(() => {
        try {
          hissNoise.stop();
        } catch {
          // ignore
        }
      }, 350);
    },
  };
}

export function playContinuousSound(soundId: string, volume = 0.7) {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  stopContinuousSound(soundId);

  let instance: ActiveSoundInstance | null = null;
  switch (soundId) {
    case 'rain':
      instance = startRainSound(ctx, volume);
      break;
    case 'sea':
      instance = startOceanSound(ctx, volume);
      break;
    case 'fire':
      instance = startFireplaceSound(ctx, volume);
      break;
    case 'wind':
      instance = startWindSound(ctx, volume);
      break;
    case 'leaves':
      instance = startLeavesSound(ctx, volume);
      break;
    case 'whales':
      instance = startWhaleSound(ctx, volume);
      break;
    case 'brook':
      instance = startBrookSound(ctx, volume);
      break;
    case 'birds':
      instance = startBirdsSound(ctx, volume);
      break;
    case 'thunder':
      instance = startThunderSound(ctx, volume);
      break;
    case 'candle':
      instance = startCandleSound(ctx, volume);
      break;
    case 'cat':
      startCatPurr(volume);
      instance = {
        setVolume: (v: number) => setCatPurrVolume(v),
        stop: () => stopCatPurr(),
      };
      break;
    default:
      break;
  }

  if (instance) {
    activeSoundsMap.set(soundId, instance);
  }
}

export function stopContinuousSound(soundId: string) {
  if (soundId === 'cat') {
    stopCatPurr();
  }
  const instance = activeSoundsMap.get(soundId);
  if (instance) {
    instance.stop();
    activeSoundsMap.delete(soundId);
  }
}

export function setContinuousSoundVolume(soundId: string, volume: number) {
  if (soundId === 'cat') {
    setCatPurrVolume(volume);
  }
  const instance = activeSoundsMap.get(soundId);
  if (instance) {
    instance.setVolume(volume);
  }
}

export function isSoundPlaying(soundId: string): boolean {
  if (soundId === 'cat') {
    return isCatPurring();
  }
  return activeSoundsMap.has(soundId);
}

export function stopAllContinuousSounds() {
  activeSoundsMap.forEach((inst) => inst.stop());
  activeSoundsMap.clear();
  stopCatPurr();
}
