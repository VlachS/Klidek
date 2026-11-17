/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Square,
  Volume2,
  Volume1,
  VolumeX,
  Sliders,
  Sparkles,
  CloudRain,
  Waves,
  Flame,
  Wind,
  Footprints,
  Compass,
  Heart,
  ExternalLink,
  Layers,
  FastForward,
  Droplets,
  Bird,
  CloudLightning,
  Minus,
  Plus,
} from 'lucide-react';
import { stopAllContinuousSounds } from '../utils/soundEffects';

export interface SoundCue {
  label: string;
  time: number;
  tip?: string;
}

export interface SoundTrack {
  id: string;
  name: string;
  desc: string;
  youtubeId: string;
  youtubeUrl: string;
  icon: React.ElementType;
  colorBorder: string;
  colorBg: string;
  activeBg: string;
  accentText: string;
  tag: string;
  defaultVolume: number;
  startTime?: number;
  cues?: SoundCue[];
}

const SOUND_TRACKS: SoundTrack[] = [
  {
    id: 'rain',
    name: 'Déšť na parapetu',
    desc: 'Jemný déšť bubnující přímo na okno a parapet. Dlouhé tiché intro videa je automaticky přeskočeno.',
    youtubeId: 'c1XOgrBz6sU',
    youtubeUrl: 'https://youtu.be/c1XOgrBz6sU',
    icon: CloudRain,
    colorBorder: 'border-[#BAD6EE]',
    colorBg: 'bg-[#F0F6FA]',
    activeBg: 'bg-[#E3EFF8]',
    accentText: 'text-[#285779]',
    tag: 'Bubnování na parapet',
    defaultVolume: 50,
    startTime: 45,
    cues: [
      { label: '0:45 (Začátek)', time: 45, tip: 'Okamžitý začátek bubnování kapek' },
      { label: '2:00 (Bubnování)', time: 120, tip: 'Plný proud deště na parapet' },
      { label: '5:00 (Vytrvalý)', time: 300, tip: 'Vytrvalý hluboký déšť' },
    ],
  },
  {
    id: 'sea',
    name: 'Moře a valící se vlny',
    desc: 'Čistý příboj oceánu – skutečné vlny rozbíjející se o pobřeží bez rušivého větru.',
    youtubeId: 'vPhg6sc1Mk4',
    youtubeUrl: 'https://youtu.be/vPhg6sc1Mk4',
    icon: Waves,
    colorBorder: 'border-[#C8BAE0]',
    colorBg: 'bg-[#F6F2FB]',
    activeBg: 'bg-[#ECE4F7]',
    accentText: 'text-[#503E6B]',
    tag: 'Příboj bez větru',
    defaultVolume: 50,
    startTime: 10,
    cues: [
      { label: '0:10 (Začátek)', time: 10, tip: 'První vlny přelévající se přes břeh' },
      { label: '1:00 (Valící se vlny)', time: 60, tip: 'Rytmický a hluboký příboj' },
      { label: '3:00 (Hluboký oceán)', time: 180, tip: 'Plynulý nekonečný proud vln' },
    ],
  },
  {
    id: 'fire',
    name: 'Praskání dřeva v krbu',
    desc: 'Autentické teplo hořícího dřeva, hřejivý oheň a tiché lupkání pryskyřice v krbu.',
    youtubeId: 'UgHKb_7884o',
    youtubeUrl: 'https://youtu.be/UgHKb_7884o',
    icon: Flame,
    colorBorder: 'border-[#F0C9D7]',
    colorBg: 'bg-[#FAF2F5]',
    activeBg: 'bg-[#F5E6EC]',
    accentText: 'text-[#6D344B]',
    tag: 'Hřejivý oheň',
    defaultVolume: 50,
    startTime: 10,
    cues: [
      { label: '0:10 (Začátek)', time: 10, tip: 'Rozhořívající se suchá polínka' },
      { label: '1:00 (Hřejivý krb)', time: 60, tip: 'Plný oheň a jiskry' },
      { label: '3:00 (Lupání dřeva)', time: 180, tip: 'Tiché a uklidňující lupkání pryskyřice' },
    ],
  },
  {
    id: 'wind',
    name: 'Jemný vánek v korunách',
    desc: 'Měkké vanutí větru a ševelení listoví v korunách stromů pro vyčištění hlavy.',
    youtubeId: '7WPsftkv1ZY',
    youtubeUrl: 'https://youtu.be/7WPsftkv1ZY',
    icon: Wind,
    colorBorder: 'border-[#B4DAC7]',
    colorBg: 'bg-[#F2F8F5]',
    activeBg: 'bg-[#E5F3EC]',
    accentText: 'text-[#2D5A42]',
    tag: 'Čerstvý vzduch',
    defaultVolume: 50,
    startTime: 10,
    cues: [
      { label: '0:10 (Začátek)', time: 10, tip: 'První závan mezi stromy' },
      { label: '1:00 (Šum listí)', time: 60, tip: 'Měkké ševelení větví a listí' },
      { label: '3:00 (Horský vítr)', time: 180, tip: 'Čerstvé proudění vzduchu' },
    ],
  },
  {
    id: 'leaves',
    name: 'Praskání popadaného listí',
    desc: 'Křupavé, suché šustění spadaného podzimního listí pod pomalými kroky (ASMR záznam).',
    youtubeId: 'cInZcbicdzU',
    youtubeUrl: 'https://youtu.be/cInZcbicdzU',
    icon: Footprints,
    colorBorder: 'border-[#E7D0BD]',
    colorBg: 'bg-[#FAF5F0]',
    activeBg: 'bg-[#F5ECE2]',
    accentText: 'text-[#684B31]',
    tag: 'Podzimní stezka',
    defaultVolume: 50,
    startTime: 10,
    cues: [
      { label: '0:10 (Začátek)', time: 10, tip: 'První křupnutí listí' },
      { label: '0:45 (Podzimní cesta)', time: 45, tip: 'Pravidelné šustění kroků v listí' },
      { label: '2:00 (Hluboký les)', time: 120, tip: 'Klidná chůze podzimní alejí' },
    ],
  },
  {
    id: 'whales',
    name: 'Velrybí písně',
    desc: 'Podmořský oceánský prostor a teskný, harmonický zpěv velryb pro spánek a zklidnění.',
    youtubeId: 'R5rGICvc9ro',
    youtubeUrl: 'https://youtu.be/R5rGICvc9ro',
    icon: Compass,
    colorBorder: 'border-[#B9D8E6]',
    colorBg: 'bg-[#F0F7FB]',
    activeBg: 'bg-[#E0EFF8]',
    accentText: 'text-[#295973]',
    tag: 'Hlubina oceánu',
    defaultVolume: 50,
    startTime: 15,
    cues: [
      { label: '0:15 (Začátek)', time: 15, tip: 'První hluboký zpěv velryby' },
      { label: '1:00 (Písně pod vodou)', time: 60, tip: 'Harmonické podmořské volání' },
      { label: '3:00 (Hlubina oceánu)', time: 180, tip: 'Měkké uklidňující vibrace' },
    ],
  },
  {
    id: 'cat',
    name: 'Předení kočičky Míci',
    desc: 'Pravidelné, hřejivé vrnění a předení spokojené kočky z odpočinkového videa.',
    youtubeId: 'CY7t8ow2gOM',
    youtubeUrl: 'https://youtu.be/CY7t8ow2gOM',
    icon: Heart,
    colorBorder: 'border-[#E2CBE6]',
    colorBg: 'bg-[#FAF4FB]',
    activeBg: 'bg-[#F2E5F5]',
    accentText: 'text-[#5E3867]',
    tag: 'Kočičí teplo',
    defaultVolume: 65,
    startTime: 10,
    cues: [
      { label: '0:10 (Začátek)', time: 10, tip: 'První hřejivé zavrnění' },
      { label: '1:00 (Hluboké předení)', time: 60, tip: 'Stálé uklidňující předení kočičky' },
      { label: '3:00 (Spící Míca)', time: 180, tip: 'Poklidný spánek a oddechování' },
    ],
  },
  {
    id: 'brook',
    name: 'Lesní potůček',
    desc: 'Křišťálově čistá tekoucí bystřina, přelévání vody přes hladké oblázky a horský pramen.',
    youtubeId: 'IvjMgVS6kng',
    youtubeUrl: 'https://youtu.be/IvjMgVS6kng',
    icon: Droplets,
    colorBorder: 'border-[#B4DADA]',
    colorBg: 'bg-[#F0F8F8]',
    activeBg: 'bg-[#DFEFF0]',
    accentText: 'text-[#1F5453]',
    tag: 'Lesní bystřina',
    defaultVolume: 50,
    startTime: 15,
    cues: [
      { label: '0:15 (Začátek)', time: 15, tip: 'Zurčící bystřina přes kameny' },
      { label: '1:00 (Čistý proud)', time: 60, tip: 'Plný proud lesního pramene' },
      { label: '3:00 (Horská tůňka)', time: 180, tip: 'Tiché a svěží přelévání vody' },
    ],
  },
  {
    id: 'birds',
    name: 'Ranní zpěv ptáčků',
    desc: 'Ptačí zpěv v probouzejícím se jarním lese plném svěžesti, slunečních paprsků a života.',
    youtubeId: '2G8LAiHSCAs',
    youtubeUrl: 'https://youtu.be/2G8LAiHSCAs',
    icon: Bird,
    colorBorder: 'border-[#C4E2C8]',
    colorBg: 'bg-[#F2F9F3]',
    activeBg: 'bg-[#E3F4E6]',
    accentText: 'text-[#28572F]',
    tag: 'Ptačí zpěv',
    defaultVolume: 50,
    startTime: 10,
    cues: [
      { label: '0:10 (Začátek)', time: 10, tip: 'První ranní ptačí trilkování' },
      { label: '1:00 (Lesní chór)', time: 60, tip: 'Bohatý zpěv v prosluněném lese' },
      { label: '3:00 (Ptačí zahrada)', time: 180, tip: 'Klidný a osvěžující jarní koncert' },
    ],
  },
  {
    id: 'thunder',
    name: 'Bouřka & vzdálené hromy',
    desc: 'Hluboké dunění hromů v dálce a silnější déšť za oknem pro bezpečný pocit domova v suchu.',
    youtubeId: 'gVKEM4K8J8A',
    youtubeUrl: 'https://youtu.be/gVKEM4K8J8A',
    icon: CloudLightning,
    colorBorder: 'border-[#BDC7E6]',
    colorBg: 'bg-[#F2F4FB]',
    activeBg: 'bg-[#E5E9F8]',
    accentText: 'text-[#2E3C6E]',
    tag: 'Hřmění a déšť',
    defaultVolume: 50,
    startTime: 20,
    cues: [
      { label: '0:20 (Začátek)', time: 20, tip: 'Silný déšť a vzdálený hrom' },
      { label: '1:30 (Vzdálený hrom)', time: 90, tip: 'Hluboké a bezpečné dunění za oknem' },
      { label: '3:30 (Útulná bouře)', time: 210, tip: 'Bezpečný teplý úkryt před lijákem' },
    ],
  },
  {
    id: 'candle',
    name: 'Jemně praskající svíčka',
    desc: 'Tichý mihotavý plamínek svíčky a něžné praskání dřevěného knotu pro soustředění a klid.',
    youtubeId: 'qOhUpdIWrMs',
    youtubeUrl: 'https://youtu.be/qOhUpdIWrMs',
    icon: Sparkles,
    colorBorder: 'border-[#EAD3BD]',
    colorBg: 'bg-[#FAF6F0]',
    activeBg: 'bg-[#F6EDE2]',
    accentText: 'text-[#6D492A]',
    tag: 'Plamínek & knot',
    defaultVolume: 50,
    startTime: 10,
    cues: [
      { label: '0:10 (Začátek)', time: 10, tip: 'První lupkání dřevěného knotu' },
      { label: '1:00 (Hřejivý plamen)', time: 60, tip: 'Stálé mihotavé praskání svíčky' },
      { label: '2:30 (Klidný večer)', time: 150, tip: 'Hluboký uklidňující večerní relax' },
    ],
  },
];

interface PresetMix {
  name: string;
  tagline: string;
  icon: string;
  tracks: Record<string, number>;
}

const PRESET_MIXES: PresetMix[] = [
  {
    name: 'Útulný večer u krbu',
    tagline: 'Déšť bubnující na parapet, oheň v krbu a předení kočičky',
    icon: '🌧️🔥',
    tracks: {
      rain: 40,
      fire: 65,
      cat: 60,
    },
  },
  {
    name: 'Jarní probuzení v lese',
    tagline: 'Bublající potůček, zpěv ptáčků a svěží vánek',
    icon: '🌲🐦',
    tracks: {
      brook: 55,
      birds: 50,
      wind: 35,
    },
  },
  {
    name: 'Bezpečí před bouřkou',
    tagline: 'Hluboká bouřka za oknem, hořící svíčka a kočičí předení',
    icon: '⛈️🕯️',
    tracks: {
      thunder: 55,
      candle: 60,
      cat: 65,
    },
  },
  {
    name: 'Tajemná hlubina moře',
    tagline: 'Vlny příboje, zpěv velryb a mírný pobřežní vánek',
    icon: '🌊🐋',
    tracks: {
      sea: 50,
      whales: 65,
      wind: 30,
    },
  },
  {
    name: 'Podzimní procházka',
    tagline: 'Šustění suchého listí, svěží vánek a vzdálený déšť',
    icon: '🍂💨',
    tracks: {
      leaves: 65,
      wind: 45,
      rain: 25,
    },
  },
  {
    name: 'Hluboké zklidnění pro spánek',
    tagline: 'Jemný zpěv velryb, tiché moře a vrnění pro usnutí',
    icon: '🌙✨',
    tracks: {
      whales: 50,
      cat: 60,
      sea: 35,
    },
  },
];

export const SoundsSection: React.FC = () => {
  const [activeTracks, setActiveTracks] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    SOUND_TRACKS.forEach((t) => {
      initial[t.id] = false;
    });
    return initial;
  });

  const [masterVolume, setMasterVolume] = useState<number>(100);
  const [isMasterMuted, setIsMasterMuted] = useState<boolean>(false);

  const [volumes, setVolumes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SOUND_TRACKS.forEach((t) => {
      initial[t.id] = t.defaultVolume;
    });
    return initial;
  });

  // Store previous non-zero volume for each track so clicking the speaker icon can mute & restore
  const prevVolumesRef = useRef<Record<string, number>>({});

  // HTML5 Audio + Web Audio API GainNode references for hardware-level attenuation & boost (0% to 350%)
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({});
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodesRef = useRef<Record<string, GainNode | null>>({});

  // Per-track acoustic calibration so naturally quieter recordings (fire, candle, leaves, brook)
  // match the loudness of denser recordings (rain, thunder) without distorting their dynamic range
  const TRACK_BASE_GAIN: Record<string, number> = {
    rain: 0.85,
    thunder: 0.9,
    sea: 1.35,
    whales: 1.35,
    birds: 1.45,
    cat: 1.4,
    brook: 1.9,
    wind: 1.9,
    fire: 2.8,
    candle: 3.0,
    leaves: 3.0,
  };

  // Apply volume to both HTMLAudioElement and Web Audio GainNode
  // 0% = complete silence
  // 1% - 50% = smooth logarithmic attenuation from whisper to normal 1.0x volume
  // 50% - 100% = hardware amplification (boost) up to 3.5x louder via Web Audio GainNode!
  const applyHardwareVolume = useCallback(
    (id: string, trackVol: number, masterVol: number, muted: boolean) => {
      const audio = audioRefs.current[id];
      if (!audio) return;

      const eff = muted ? 0 : (trackVol * masterVol) / 100;

      if (eff <= 0) {
        audio.muted = true;
        audio.volume = 0;
        const g = gainNodesRef.current[id];
        if (g && audioCtxRef.current) {
          g.gain.setValueAtTime(0, audioCtxRef.current.currentTime);
        }
        return;
      }

      audio.muted = false;
      const g = gainNodesRef.current[id];
      const baseCalibration = TRACK_BASE_GAIN[id] ?? 1.0;

      if (eff <= 50) {
        // 0..50 maps to 0.0..1.0 with steep perceptual taper so 5% is truly whisper-quiet
        const ratio = eff / 50;
        const elemVol = Math.min(1, Math.max(0, Math.pow(ratio, 1.7)));
        const nodeGain = Math.max(0, Math.pow(ratio, 1.1) * baseCalibration);
        audio.volume = elemVol;
        if (g && audioCtxRef.current) {
          g.gain.setValueAtTime(nodeGain, audioCtxRef.current.currentTime);
        }
      } else {
        // 50..100 boosts gain from 1.0x up to 3.5x (multiplied by baseCalibration) so user can make any track much louder!
        const boostRatio = (eff - 50) / 50;
        audio.volume = 1.0;
        if (g && audioCtxRef.current) {
          const boostedGain = (1.0 + Math.pow(boostRatio, 1.25) * 2.5) * baseCalibration;
          g.gain.setValueAtTime(boostedGain, audioCtxRef.current.currentTime);
        }
      }
    },
    []
  );

  // Get or lazily create the HTML5 Audio instance + Web Audio GainNode for a track
  const getOrCreateAudio = useCallback((id: string): HTMLAudioElement => {
    let audio = audioRefs.current[id];
    if (!audio) {
      audio = new Audio(`./audio/${id}.mp3?v=3`);
      audio.loop = true;
      audio.preload = 'auto';
      audioRefs.current[id] = audio;

      try {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioContextClass) {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContextClass();
          }
          const ctx = audioCtxRef.current;
          const source = ctx.createMediaElementSource(audio);
          const gainNode = ctx.createGain();
          source.connect(gainNode);
          gainNode.connect(ctx.destination);
          gainNodesRef.current[id] = gainNode;
        }
      } catch {
        // Fallback to standard HTMLAudioElement.volume if Web Audio graph fails
      }
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    return audio;
  }, []);

  // Compute effective percentage for UI display
  const getEffectiveVolume = useCallback(
    (trackId: string, customTrackVol?: number, customMasterVol?: number): number => {
      if (isMasterMuted) return 0;
      const tVol = customTrackVol !== undefined ? customTrackVol : (volumes[trackId] ?? 50);
      const mVol = customMasterVol !== undefined ? customMasterVol : masterVolume;
      return Math.round((tVol * mVol) / 100);
    },
    [isMasterMuted, volumes, masterVolume]
  );

  // Guarantee all playing HTMLAudioElements and GainNodes stay in sync with volume states
  useEffect(() => {
    SOUND_TRACKS.forEach((track) => {
      if (audioRefs.current[track.id]) {
        const tVol = volumes[track.id] ?? track.defaultVolume;
        applyHardwareVolume(track.id, tVol, masterVolume, isMasterMuted);
      }
    });
  }, [volumes, masterVolume, isMasterMuted, applyHardwareVolume]);

  // Helper to format seconds as M:SS
  const formatSeconds = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Position offsets in seconds
  const [trackPositions, setTrackPositions] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SOUND_TRACKS.forEach((t) => {
      initial[t.id] = t.startTime ?? 0;
    });
    return initial;
  });

  // Jump to specific timestamp in track
  const handleSeek = (id: string, seconds: number) => {
    setTrackPositions((prev) => ({ ...prev, [id]: seconds }));
    const tVol = volumes[id] ?? 50;

    const audio = getOrCreateAudio(id);
    applyHardwareVolume(id, tVol, masterVolume, isMasterMuted);
    if (audio.duration && Number.isFinite(audio.duration)) {
      audio.currentTime = seconds % audio.duration;
    }
    audio.play().catch(() => {});

    setActiveTracks((prev) => ({ ...prev, [id]: true }));
  };

  // Jump relative delta seconds forward
  const handleSeekForward = (id: string, delta = 30) => {
    const current = trackPositions[id] ?? (SOUND_TRACKS.find((t) => t.id === id)?.startTime ?? 0);
    const nextPos = current + delta;
    handleSeek(id, nextPos);
  };

  // Clean stop on unmount
  useEffect(() => {
    return () => {
      stopAllContinuousSounds();
      Object.values(audioRefs.current).forEach((a) => {
        if (a) {
          a.pause();
        }
      });
    };
  }, []);

  // Toggle single sound track (does NOT stop other sounds - enables combining!)
  const handleToggleTrack = (id: string) => {
    const willPlay = !activeTracks[id];
    let tVol = volumes[id] ?? 50;
    // If track was muted at 0% and user clicks Play, restore it to 50% so it can be heard
    if (willPlay && tVol === 0) {
      tVol = prevVolumesRef.current[id] || 50;
      setVolumes((prev) => ({ ...prev, [id]: tVol }));
    }

    const audio = getOrCreateAudio(id);
    applyHardwareVolume(id, tVol, masterVolume, isMasterMuted);

    if (willPlay) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }

    setActiveTracks((prev) => ({ ...prev, [id]: willPlay }));
  };

  // Adjust volume for an individual track in real-time
  const handleVolumeChange = (id: string, rawVol: number) => {
    const newTrackVol = Math.min(100, Math.max(0, Math.round(rawVol)));
    if (newTrackVol > 0) {
      prevVolumesRef.current[id] = newTrackVol;
    }
    setVolumes((prev) => ({ ...prev, [id]: newTrackVol }));

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    applyHardwareVolume(id, newTrackVol, masterVolume, isMasterMuted);
  };

  // Toggle mute/unmute for a single track via its speaker button
  const handleToggleTrackMute = (id: string) => {
    const currentVol = volumes[id] ?? 50;
    if (currentVol > 0) {
      prevVolumesRef.current[id] = currentVol;
      handleVolumeChange(id, 0);
    } else {
      const restored = prevVolumesRef.current[id] || 50;
      handleVolumeChange(id, restored);
    }
  };

  // Step track volume down or up by delta (e.g. -15% or +15%)
  const handleStepTrackVolume = (id: string, delta: number) => {
    const currentVol = volumes[id] ?? 50;
    handleVolumeChange(id, currentVol + delta);
  };

  // Adjust master volume and instantly scale all currently playing tracks
  const handleMasterVolumeChange = (rawMaster: number) => {
    const newMaster = Math.min(100, Math.max(0, Math.round(rawMaster)));
    setMasterVolume(newMaster);
    if (isMasterMuted && newMaster > 0) {
      setIsMasterMuted(false);
    }

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }

    SOUND_TRACKS.forEach((track) => {
      const tVol = volumes[track.id] ?? track.defaultVolume;
      applyHardwareVolume(track.id, tVol, newMaster, newMaster === 0);
    });
  };

  // Toggle master mute
  const handleToggleMasterMute = () => {
    const nextMuted = !isMasterMuted;
    setIsMasterMuted(nextMuted);

    SOUND_TRACKS.forEach((track) => {
      const tVol = volumes[track.id] ?? track.defaultVolume;
      applyHardwareVolume(track.id, tVol, masterVolume, nextMuted);
    });
  };

  // Stop all sounds
  const handleStopAll = () => {
    stopAllContinuousSounds();
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio) {
        audio.pause();
      }
    });
    const resetActive: Record<string, boolean> = {};
    SOUND_TRACKS.forEach((t) => {
      resetActive[t.id] = false;
    });
    setActiveTracks(resetActive);
  };

  // Apply a pre-made soundscape combination
  const handleApplyPreset = (preset: PresetMix) => {
    // 1. Stop current
    handleStopAll();

    // 2. Prepare new volumes and active tracks
    const newVolumes = { ...volumes };
    const newActive: Record<string, boolean> = {};
    SOUND_TRACKS.forEach((t) => {
      newActive[t.id] = false;
    });

    Object.entries(preset.tracks).forEach(([id, vol]) => {
      newVolumes[id] = vol;
      newActive[id] = true;
    });

    setVolumes(newVolumes);
    setActiveTracks(newActive);

    // 3. Start audio with hardware gain
    Object.entries(preset.tracks).forEach(([id, vol]) => {
      const audio = getOrCreateAudio(id);
      applyHardwareVolume(id, vol, masterVolume, isMasterMuted);
      audio.play().catch(() => {});
    });
  };

  const activeTrackIds = Object.keys(activeTracks).filter((id) => activeTracks[id]);
  const activeCount = activeTrackIds.length;

  return (
    <section id="zvuky" className="py-20 bg-white/30 border-t border-black/5 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E8DFF5] border border-[#D5C7E8] text-xs font-medium text-[#5B4777] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#634E7D]" />
            <span>Vícekanálový mixer relaxačních zvuků</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-light text-[#2D223F] font-display mb-3 text-balance">
            Zvuková oáza & kombinovaný mixér
          </h2>

          <p className="text-sm sm:text-base text-[#616D7E] leading-relaxed">
            Můžeš si pustit kterýkoliv zvuk samostatně, nebo libovolně <strong>nakombinovat více stop najednou</strong> (např. déšť + praskání ohně + kočičí předení) a každé nastavit přesnou hlasitost od ticha (0 %) až po silné zesílení (100 %).
          </p>
        </div>

        {/* PRESET SOUNDSCAPES (Uklidňující kombinace na 1 kliknutí) */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#796F8E]">
              <Layers className="w-4 h-4 text-[#896BAE]" />
              <span>Doporučené zvukové kombinace na 1 kliknutí</span>
            </div>
            <span className="text-xs text-[#7B8798]">Kliknutím spustíš celý mix</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {PRESET_MIXES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="group p-3.5 rounded-2xl bg-white/75 hover:bg-white border border-[#E4DCF0] hover:border-[#C4B3DD] shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-lg">{preset.icon}</span>
                    <h4 className="text-xs font-semibold text-[#3B2956] group-hover:text-[#5B3F82] transition-colors">
                      {preset.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-[#717E90] leading-snug line-clamp-2">
                    {preset.tagline}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-[#F2ECF7] flex items-center justify-between text-[11px] text-[#7A5A9E] font-medium">
                  <span>Pustit mix</span>
                  <Play className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ACTIVE MIXER CONSOLE DOCK (Zobrazí se, když hraje alespoň jedna stopa) */}
        {activeCount > 0 && (
          <div className="mb-8 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#EDE3FA] via-[#F4EBF7] to-[#E5F2EC] border border-[#D5C2EA] shadow-md ring-2 ring-[#EADCF7]/60 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#D8C7EB]/70">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#593E7A] text-white shadow-xs">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-[#2F2145] font-display">
                      Aktivní mix ({activeCount} {activeCount === 1 ? 'stopa' : activeCount < 5 ? 'stopy' : 'stop'} hraje)
                    </h3>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52B788] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2D936C]"></span>
                    </span>
                  </div>
                  <p className="text-xs text-[#6A5A82]">
                    Zvuky hrají společně v reálném čase. Tlačítky <strong>− / +</strong> nebo posuvníkem okamžitě ztišíš či zesílíš každou stopu.
                  </p>
                </div>
              </div>

              {/* Master Volume Controls */}
              <div className="w-full md:w-auto flex flex-wrap items-center gap-2.5 bg-white/80 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-[#D8C7EB]">
                <button
                  type="button"
                  onClick={handleToggleMasterMute}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                    isMasterMuted || masterVolume === 0
                      ? 'bg-[#FCECEE] border-[#E9BDC4] text-[#862E44]'
                      : 'bg-[#FAF6FC] border-[#DACCEE] text-[#43305D] hover:bg-[#EFE8F7]'
                  }`}
                  title={isMasterMuted ? 'Zapnout zvuk' : 'Ztlumit vše'}
                >
                  {isMasterMuted || masterVolume === 0 ? (
                    <>
                      <VolumeX className="w-4 h-4 text-[#A84860]" />
                      <span>Ztlumeno</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Celková:</span>
                    </>
                  )}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleMasterVolumeChange((isMasterMuted ? 0 : masterVolume) - 15)}
                    className="p-1.5 rounded-lg bg-white border border-[#DACCEE] text-[#43305D] hover:bg-[#FAF6FC] cursor-pointer"
                    title="Ztišit celkovou hlasitost"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMasterMuted ? 0 : masterVolume}
                    onInput={(e) => handleMasterVolumeChange(Number((e.target as HTMLInputElement).value))}
                    onChange={(e) => handleMasterVolumeChange(Number(e.target.value))}
                    className="w-24 sm:w-28 h-2 bg-black/15 rounded-lg appearance-none cursor-pointer accent-[#583E7A]"
                  />
                  <button
                    type="button"
                    onClick={() => handleMasterVolumeChange((isMasterMuted ? 0 : masterVolume) + 15)}
                    className="p-1.5 rounded-lg bg-white border border-[#DACCEE] text-[#43305D] hover:bg-[#FAF6FC] cursor-pointer"
                    title="Zesílit celkovou hlasitost"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs tabular-nums font-bold text-[#4F366D] w-9 text-right">
                    {isMasterMuted ? '0%' : `${masterVolume}%`}
                  </span>
                </div>

                <div className="h-4 w-px bg-black/10 mx-0.5" />

                <button
                  type="button"
                  onClick={handleStopAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FCECEE] hover:bg-[#F9DEE2] border border-[#E9BDC4] text-[#862E44] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Zastavit vše</span>
                </button>
              </div>
            </div>

            {/* Active Channels Quick Slider Strip */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOUND_TRACKS.filter((t) => activeTracks[t.id]).map((track) => {
                const Icon = track.icon;
                const vol = volumes[track.id] ?? 50;
                const effective = getEffectiveVolume(track.id);
                const isTrackMuted = vol === 0 || isMasterMuted;

                return (
                  <div
                    key={`active-strip-${track.id}`}
                    className="p-3.5 rounded-2xl bg-white/90 border border-[#DACCEE] flex flex-col gap-2.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`p-1.5 rounded-lg bg-[#FAF7FC] ${track.accentText}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-[#302146] truncate">{track.name}</div>
                          <div className="text-[10px] text-[#7E8D9F] tabular-nums">
                            Hlasitost: <strong>{vol}%</strong> (výstup {effective}%)
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleSeekForward(track.id, 15)}
                          className="px-2 py-1 rounded-lg text-[#554271] hover:bg-[#F0EAF7] border border-black/5 transition-colors cursor-pointer text-[10px] font-semibold flex items-center gap-0.5"
                          title="Posunout záznam o +15 sekund dopředu"
                        >
                          <FastForward className="w-3 h-3 text-[#79629E]" />
                          <span>+15s</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleTrack(track.id)}
                          className="px-2 py-1 rounded-lg text-[#883C52] bg-[#FCECEE] hover:bg-[#F9DEE2] border border-[#E9BDC4] transition-colors cursor-pointer text-[10px] font-semibold flex items-center gap-1"
                          title="Vypnout tuto stopu"
                        >
                          <Square className="w-2.5 h-2.5 fill-current" />
                          <span>Vypnout</span>
                        </button>
                      </div>
                    </div>

                    {/* Interactive Volume Bar in Active Strip */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleTrackMute(track.id)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isTrackMuted
                            ? 'bg-[#FCECEE] border-[#E9BDC4] text-[#A84860]'
                            : 'bg-[#FAF6FC] border-[#DACCEE] text-[#43305D] hover:bg-[#EFE8F7]'
                        }`}
                        title={isTrackMuted ? 'Zapnout zvuk stopy' : 'Ztlumit tuto stopu (0 %)'}
                      >
                        {isTrackMuted ? (
                          <VolumeX className="w-3.5 h-3.5" />
                        ) : vol < 40 ? (
                          <Volume1 className="w-3.5 h-3.5" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStepTrackVolume(track.id, -15)}
                        className="px-2 py-1 rounded-lg bg-white border border-[#DACCEE] text-[#43305D] hover:bg-[#FAF6FC] text-xs font-bold cursor-pointer"
                        title="Ztišit o 15 %"
                      >
                        −
                      </button>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={vol}
                        onInput={(e) => handleVolumeChange(track.id, Number((e.target as HTMLInputElement).value))}
                        onChange={(e) => handleVolumeChange(track.id, Number(e.target.value))}
                        className="flex-1 h-2 bg-black/15 rounded-lg appearance-none cursor-pointer accent-[#583E7A]"
                      />

                      <button
                        type="button"
                        onClick={() => handleStepTrackVolume(track.id, 15)}
                        className="px-2 py-1 rounded-lg bg-white border border-[#DACCEE] text-[#43305D] hover:bg-[#FAF6FC] text-xs font-bold cursor-pointer"
                        title="Zesílit o 15 %"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SOUND TRACKS CARDS GRID */}
        <div className="bg-white/90 border border-[#E4DCF0] rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
          {/* Top Bar of Main Board */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 mb-6 border-b border-[#F0EAF5] gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#E8DFF5] text-[#553E73]">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#2E2342] font-display">
                  Všechny zvukové stopy
                </h3>
                <p className="text-xs text-[#727D8F] mt-0.5">
                  Klikni na <strong>„Přidat do mixu“</strong> a pomocí tlačítek <strong>Ztlumit / − / +</strong> nebo posuvníku nastav hlasitost.
                </p>
              </div>
            </div>

            {activeCount > 0 && (
              <button
                type="button"
                onClick={handleStopAll}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#FBF7F9] border border-[#E9D6DE] text-[#7A4056] hover:bg-[#F8EDF2] transition-colors cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Zastavit všechny zvuky</span>
              </button>
            )}
          </div>

          {/* Sound Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOUND_TRACKS.map((track) => {
              const isPlaying = activeTracks[track.id];
              const vol = volumes[track.id] ?? track.defaultVolume;
              const effectiveVol = getEffectiveVolume(track.id);
              const isTrackMuted = vol === 0 || isMasterMuted;
              const Icon = track.icon;

              return (
                <div
                  key={track.id}
                  className={`p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    isPlaying
                      ? `${track.activeBg} ${track.colorBorder} shadow-sm ring-2 ring-[#D9C8ED]`
                      : `${track.colorBg} border-black/5 hover:border-black/10`
                  }`}
                >
                  <div>
                    {/* Header: Tag + Toggle Button */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#796F8E]">
                        {track.tag}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleTrack(track.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-2xs ${
                          isPlaying
                            ? 'bg-[#4B3469] text-white hover:bg-[#3C2755]'
                            : 'bg-white border border-[#DDD5EB] text-[#554271] hover:bg-[#FAF8FD]'
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <Square className="w-3 h-3 fill-white" />
                            <span>Hraje v mixu</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" />
                            <span>Přidat do mixu</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Icon + Title */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-2 rounded-xl bg-white/80 ${track.accentText}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className={`text-base font-medium ${track.accentText}`}>
                          {track.name}
                        </h4>
                      </div>

                      <a
                        href={track.youtubeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#7A8799] hover:text-[#3B2857] p-1 transition-colors"
                        title="Otevřít původní video na YouTube"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="text-xs text-[#6B7586] leading-relaxed mb-3">
                      {track.desc}
                    </p>

                    {/* Universal Quick Jump & Skip Intro bar on EVERY sound track */}
                    <div className="mb-3 p-2.5 rounded-xl bg-white/80 border border-black/5 space-y-1.5 shadow-2xs">
                      <div className="flex items-center justify-between text-[11px] font-medium text-[#4D4360]">
                        <div className="flex items-center gap-1.5">
                          <FastForward className="w-3.5 h-3.5 text-[#634E7D]" />
                          <span>Rychlý start / přeskočit načítání:</span>
                        </div>
                        <span className="text-[10px] bg-[#EAE2F7] px-2 py-0.5 rounded-full font-semibold text-[#483366]">
                          {formatSeconds(trackPositions[track.id] ?? track.startTime ?? 0)}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {track.cues && track.cues.length > 0 ? (
                          track.cues.map((cue) => {
                            const isCurrent = (trackPositions[track.id] ?? track.startTime ?? 0) === cue.time;
                            return (
                              <button
                                key={`${track.id}-cue-${cue.time}`}
                                type="button"
                                onClick={() => handleSeek(track.id, cue.time)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all cursor-pointer ${
                                  isCurrent
                                    ? 'bg-[#4B3469] text-white shadow-2xs'
                                    : 'bg-white border border-[#DDD5EB] text-[#4A3B63] hover:bg-[#FAF8FD]'
                                }`}
                                title={cue.tip ?? `Skočit na čas ${cue.label}`}
                              >
                                {cue.label}
                              </button>
                            );
                          })
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSeek(track.id, track.startTime ?? 10)}
                            className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-white border border-[#DDD5EB] text-[#4A3B63] hover:bg-[#FAF8FD] transition-colors cursor-pointer"
                          >
                            Od začátku zvuku
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSeekForward(track.id, 15)}
                          className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-white border border-[#DDD5EB] text-[#4A3B63] hover:bg-[#FAF8FD] transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                          title="Posunout o 15 sekund dopředu"
                        >
                          <FastForward className="w-3 h-3 text-[#634E7D]" />
                          <span>+15 s</span>
                        </button>
                      </div>
                    </div>

                    {/* Active status badge */}
                    {isPlaying && (
                      <div className="mb-3 px-3 py-1.5 rounded-xl border border-[#C6DEC9] bg-[#EAF6EC] text-[#225732] text-[11px] font-medium flex items-center justify-between">
                        <span>✓ Hraje v mixu</span>
                        <span className="animate-pulse">●</span>
                      </div>
                    )}
                  </div>

                  {/* Interactive Volume Controls for this specific track */}
                  <div className="pt-3 border-t border-black/5 space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#606D7E]">
                      {/* Clickable Mute / Unmute Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleTrackMute(track.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                          isTrackMuted
                            ? 'bg-[#FCECEE] border-[#E9BDC4] text-[#A84860]'
                            : 'bg-white/90 border-[#DACCEE] text-[#43305D] hover:bg-white'
                        }`}
                        title={isTrackMuted ? 'Kliknutím zapneš zvuk stopy' : 'Kliknutím ztlumíš tuto stopu'}
                      >
                        {isTrackMuted ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5 text-[#A84860]" />
                            <span>Ztlumeno (zapnout)</span>
                          </>
                        ) : vol < 40 ? (
                          <>
                            <Volume1 className="w-3.5 h-3.5 text-[#543878]" />
                            <span>Ztlumit zvuk</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-[#543878]" />
                            <span>Ztlumit zvuk</span>
                          </>
                        )}
                      </button>

                      <span className="tabular-nums font-bold text-[#48375F]">
                        {vol}% {isPlaying && <span className="text-[10px] text-[#7A889A] font-normal">(výstup {effectiveVol}%)</span>}
                      </span>
                    </div>

                    {/* Slider with - and + step buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStepTrackVolume(track.id, -15)}
                        className="p-1.5 rounded-lg bg-white/90 hover:bg-white border border-[#DACCEE] text-[#43305D] transition-colors cursor-pointer shrink-0"
                        title="Ztišit o 15 %"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={vol}
                        onInput={(e) => handleVolumeChange(track.id, Number((e.target as HTMLInputElement).value))}
                        onChange={(e) => handleVolumeChange(track.id, Number(e.target.value))}
                        className="w-full h-2 bg-black/15 rounded-lg appearance-none cursor-pointer accent-[#583E7A]"
                      />

                      <button
                        type="button"
                        onClick={() => handleStepTrackVolume(track.id, 15)}
                        className="p-1.5 rounded-lg bg-white/90 hover:bg-white border border-[#DACCEE] text-[#43305D] transition-colors cursor-pointer shrink-0"
                        title="Zesílit o 15 %"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick 1-click volume presets */}
                    <div className="grid grid-cols-4 gap-1 pt-0.5">
                      {[
                        { label: 'Ticho 0%', val: 0 },
                        { label: 'Potichu', val: 15 },
                        { label: 'Středně', val: 50 },
                        { label: 'Nahlas', val: 100 },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleVolumeChange(track.id, preset.val)}
                          className={`py-1 px-1.5 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer ${
                            vol === preset.val
                              ? 'bg-[#4B3469] text-white border-transparent'
                              : 'bg-white/75 border-[#DDD5EB] text-[#4A3B63] hover:bg-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggestion note */}
        <div className="p-4 rounded-2xl bg-white/70 border border-[#E7DFEF] text-center max-w-xl mx-auto text-xs text-[#6B7889] flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#7E669B]" />
          <span>Každou stopu můžeš pustit nezávisle a nastavit jí vlastní úroveň hlasitosti v mixéru.</span>
        </div>
      </div>
    </section>
  );
};
