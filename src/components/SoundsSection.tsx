/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Square,
  Volume2,
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
  RotateCcw,
  FastForward,
  Droplets,
  Bird,
  CloudLightning,
} from 'lucide-react';
import {
  playContinuousSound,
  stopContinuousSound,
  setContinuousSoundVolume,
  stopAllContinuousSounds,
} from '../utils/soundEffects';

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
    defaultVolume: 75,
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
    defaultVolume: 65,
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
    defaultVolume: 60,
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
    defaultVolume: 65,
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
    defaultVolume: 70,
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
    defaultVolume: 70,
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
    defaultVolume: 70,
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
    defaultVolume: 60,
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
    defaultVolume: 70,
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
    defaultVolume: 65,
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
      rain: 80,
      fire: 55,
      cat: 65,
    },
  },
  {
    name: 'Jarní probuzení v lese',
    tagline: 'Bublající potůček, zpěv ptáčků a svěží vánek',
    icon: '🌲🐦',
    tracks: {
      brook: 75,
      birds: 65,
      wind: 40,
    },
  },
  {
    name: 'Bezpečí před bouřkou',
    tagline: 'Hluboká bouřka za oknem, hořící svíčka a kočičí předení',
    icon: '⛈️🕯️',
    tracks: {
      thunder: 75,
      candle: 65,
      cat: 65,
    },
  },
  {
    name: 'Tajemná hlubina moře',
    tagline: 'Vlny příboje, zpěv velryb a mírný pobřežní vánek',
    icon: '🌊🐋',
    tracks: {
      sea: 70,
      whales: 80,
      wind: 35,
    },
  },
  {
    name: 'Podzimní procházka',
    tagline: 'Šustění suchého listí, svěží vánek a vzdálený déšť',
    icon: '🍂💨',
    tracks: {
      leaves: 80,
      wind: 60,
      rain: 35,
    },
  },
  {
    name: 'Hluboké zklidnění pro spánek',
    tagline: 'Jemný zpěv velryb, tiché moře a vrnění pro usnutí',
    icon: '🌙✨',
    tracks: {
      whales: 65,
      cat: 60,
      sea: 45,
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

  const [playbackSource, setPlaybackSource] = useState<'youtube' | 'webaudio'>('youtube');
  const [masterVolume, setMasterVolume] = useState<number>(85);
  const [isMasterMuted, setIsMasterMuted] = useState<boolean>(false);

  const [volumes, setVolumes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    SOUND_TRACKS.forEach((t) => {
      initial[t.id] = t.defaultVolume;
    });
    return initial;
  });

  // Keep references to all YouTube iframes to control their volume via postMessage
  const iframeRefs = useRef<Record<string, HTMLIFrameElement | null>>({});

  // Safe helper to send postMessage commands to a specific YouTube iframe
  const sendYouTubeCommand = useCallback((id: string, func: string, args: unknown[] = []) => {
    const iframe = iframeRefs.current[id];
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func,
            args,
          }),
          '*'
        );
      } catch {
        // ignore cross-origin timing issues
      }
    }
  }, []);

  // Compute effective volume for a track considering master volume and mute
  const getEffectiveVolume = useCallback((trackId: string, customTrackVol?: number, customMasterVol?: number): number => {
    if (isMasterMuted) return 0;
    const tVol = customTrackVol !== undefined ? customTrackVol : (volumes[trackId] ?? 60);
    const mVol = customMasterVol !== undefined ? customMasterVol : masterVolume;
    return Math.round((tVol * mVol) / 100);
  }, [isMasterMuted, volumes, masterVolume]);

  // Helper to format seconds as M:SS
  const formatSeconds = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Position offsets in seconds (for skipping silent intros on every sound)
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
    if (!activeTracks[id]) {
      setActiveTracks((prev) => {
        const willPlay = true;
        const eff = getEffectiveVolume(id);
        if (playbackSource === 'webaudio') {
          playContinuousSound(id, eff / 100);
        }
        return { ...prev, [id]: willPlay };
      });
    }
    sendYouTubeCommand(id, 'seekTo', [seconds, true]);
    sendYouTubeCommand(id, 'playVideo');
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
    };
  }, []);

  // Handle track iframe ready / loaded
  const handleIframeLoaded = (id: string) => {
    const eff = getEffectiveVolume(id);
    const track = SOUND_TRACKS.find((t) => t.id === id);
    const startSec = trackPositions[id] ?? (track?.startTime ?? 0);

    sendYouTubeCommand(id, 'unMute');
    sendYouTubeCommand(id, 'setVolume', [eff]);
    if (startSec > 0) {
      sendYouTubeCommand(id, 'seekTo', [startSec, true]);
    }
    sendYouTubeCommand(id, 'playVideo');

    // Backup triggers after short delay to ensure YouTube internal JS player is initialized
    setTimeout(() => {
      sendYouTubeCommand(id, 'unMute');
      sendYouTubeCommand(id, 'setVolume', [eff]);
      if (startSec > 0) {
        sendYouTubeCommand(id, 'seekTo', [startSec, true]);
      }
      sendYouTubeCommand(id, 'playVideo');
    }, 400);

    setTimeout(() => {
      sendYouTubeCommand(id, 'setVolume', [eff]);
      if (startSec > 0) {
        sendYouTubeCommand(id, 'seekTo', [startSec, true]);
      }
    }, 900);
  };

  // Toggle single sound track (does NOT stop other sounds - enables combining!)
  const handleToggleTrack = (id: string) => {
    setActiveTracks((prev) => {
      const willPlay = !prev[id];
      const eff = getEffectiveVolume(id);

      if (playbackSource === 'webaudio') {
        if (willPlay) {
          playContinuousSound(id, eff / 100);
        } else {
          stopContinuousSound(id);
        }
      } else {
        if (!willPlay) {
          sendYouTubeCommand(id, 'pauseVideo');
        }
      }

      return { ...prev, [id]: willPlay };
    });
  };

  // Adjust volume for an individual track in real-time
  const handleVolumeChange = (id: string, newTrackVol: number) => {
    setVolumes((prev) => ({ ...prev, [id]: newTrackVol }));
    const eff = getEffectiveVolume(id, newTrackVol);

    if (playbackSource === 'youtube') {
      sendYouTubeCommand(id, 'setVolume', [eff]);
    } else if (activeTracks[id]) {
      setContinuousSoundVolume(id, eff / 100);
    }
  };

  // Adjust master volume and instantly scale all currently playing tracks
  const handleMasterVolumeChange = (newMaster: number) => {
    setMasterVolume(newMaster);
    if (isMasterMuted) {
      setIsMasterMuted(false);
    }

    SOUND_TRACKS.forEach((track) => {
      if (activeTracks[track.id]) {
        const eff = Math.round(((volumes[track.id] ?? 60) * newMaster) / 100);
        if (playbackSource === 'youtube') {
          sendYouTubeCommand(track.id, 'setVolume', [eff]);
        } else {
          setContinuousSoundVolume(track.id, eff / 100);
        }
      }
    });
  };

  // Toggle master mute
  const handleToggleMasterMute = () => {
    const nextMuted = !isMasterMuted;
    setIsMasterMuted(nextMuted);

    SOUND_TRACKS.forEach((track) => {
      if (activeTracks[track.id]) {
        const eff = nextMuted ? 0 : Math.round(((volumes[track.id] ?? 60) * masterVolume) / 100);
        if (playbackSource === 'youtube') {
          if (nextMuted) {
            sendYouTubeCommand(track.id, 'mute');
          } else {
            sendYouTubeCommand(track.id, 'unMute');
            sendYouTubeCommand(track.id, 'setVolume', [eff]);
          }
        } else {
          setContinuousSoundVolume(track.id, eff / 100);
        }
      }
    });
  };

  // Stop all sounds
  const handleStopAll = () => {
    stopAllContinuousSounds();
    SOUND_TRACKS.forEach((track) => {
      sendYouTubeCommand(track.id, 'pauseVideo');
    });
    const resetActive: Record<string, boolean> = {};
    SOUND_TRACKS.forEach((t) => {
      resetActive[t.id] = false;
    });
    setActiveTracks(resetActive);
  };

  // Switch between YouTube recordings and offline Web Audio generator
  const switchPlaybackSource = (src: 'youtube' | 'webaudio') => {
    handleStopAll();
    setPlaybackSource(src);
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

    // 3. Start audio in chosen mode
    if (playbackSource === 'webaudio') {
      Object.entries(preset.tracks).forEach(([id, vol]) => {
        const eff = Math.round((vol * masterVolume) / 100);
        playContinuousSound(id, eff / 100);
      });
    }
  };

  const activeTrackIds = Object.keys(activeTracks).filter((id) => activeTracks[id]);
  const activeCount = activeTrackIds.length;

  return (
    <section id="zvuky" className="py-20 bg-gradient-to-b from-[#FAF8FC] via-[#F4EFFB] to-[#F1F6F4] border-t border-[#EDE7F6]">
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

          <p className="text-sm sm:text-base text-[#616D7E] leading-relaxed mb-6">
            Můžeš si pustit kterýkoliv zvuk samostatně, nebo libovolně <strong>nakombinovat více stop najednou</strong> (např. déšť + praskání ohně + kočičí předení) a každé nastavit přesnou hlasitost.
          </p>

          {/* Source Switcher */}
          <div className="inline-flex items-center gap-1.5 p-1 bg-white/70 border border-[#E2DAED] rounded-2xl shadow-2xs">
            <button
              onClick={() => switchPlaybackSource('youtube')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                playbackSource === 'youtube'
                  ? 'bg-[#E4D8F3] text-[#432A64] font-semibold shadow-xs'
                  : 'text-[#626A7A] hover:text-[#2D223F]'
              }`}
            >
              Originální YouTube záznamy
            </button>
            <button
              onClick={() => switchPlaybackSource('webaudio')}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                playbackSource === 'webaudio'
                  ? 'bg-[#CDE8D8] text-[#24523A] font-semibold shadow-xs'
                  : 'text-[#626A7A] hover:text-[#2D223F]'
              }`}
            >
              Vestavěný offline generátor
            </button>
          </div>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                    Zvuky hrají společně v reálném čase. Posouváním faderů nastav poměr jednotlivých stop.
                  </p>
                </div>
              </div>

              {/* Master Volume Controls */}
              <div className="w-full md:w-auto flex items-center gap-3 bg-white/70 backdrop-blur-xs px-4 py-2.5 rounded-2xl border border-[#D8C7EB]">
                <button
                  type="button"
                  onClick={handleToggleMasterMute}
                  className="p-1.5 rounded-lg text-[#5B3E7A] hover:bg-[#EAE1F5] transition-colors cursor-pointer"
                  title={isMasterMuted ? 'Zrušit ztlumení' : 'Ztlumit veškerý zvuk'}
                >
                  {isMasterMuted ? <VolumeX className="w-4 h-4 text-[#A84860]" /> : <Volume2 className="w-4 h-4" />}
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#5D4E73] font-medium whitespace-nowrap">
                    Celková hlasitost:
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={isMasterMuted ? 0 : masterVolume}
                    onChange={(e) => handleMasterVolumeChange(Number(e.target.value))}
                    className="w-24 sm:w-32 h-1.5 bg-black/15 rounded-lg appearance-none cursor-pointer accent-[#583E7A]"
                  />
                  <span className="text-xs tabular-nums font-semibold text-[#4F366D] w-8 text-right">
                    {isMasterMuted ? '0%' : `${masterVolume}%`}
                  </span>
                </div>

                <div className="h-4 w-px bg-black/10 mx-1" />

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
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {SOUND_TRACKS.filter((t) => activeTracks[t.id]).map((track) => {
                const Icon = track.icon;
                const vol = volumes[track.id] ?? 60;
                const effective = getEffectiveVolume(track.id);

                return (
                  <div
                    key={`active-strip-${track.id}`}
                    className="p-3 rounded-2xl bg-white/85 border border-[#DACCEE] flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`p-1.5 rounded-lg bg-[#FAF7FC] ${track.accentText}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold text-[#302146] truncate">{track.name}</div>
                        <div className="text-[10px] text-[#7E8D9F] tabular-nums">
                          {vol}% (výstup {effective}%)
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {playbackSource === 'youtube' && (
                        <button
                          type="button"
                          onClick={() => handleSeekForward(track.id, 30)}
                          className="px-1.5 py-1 rounded-lg text-[#554271] hover:bg-[#F0EAF7] border border-black/5 transition-colors cursor-pointer text-[10px] font-semibold flex items-center gap-0.5"
                          title="Přeskočit o +30 sekund dopředu"
                        >
                          <FastForward className="w-3 h-3 text-[#79629E]" />
                          <span>+30s</span>
                        </button>
                      )}
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={vol}
                        onChange={(e) => handleVolumeChange(track.id, Number(e.target.value))}
                        className="w-20 h-1.5 bg-black/15 rounded-lg appearance-none cursor-pointer accent-[#624587]"
                      />
                      <button
                        type="button"
                        onClick={() => handleToggleTrack(track.id)}
                        className="p-1 rounded-lg text-[#883C52] hover:bg-[#FBECEF] transition-colors cursor-pointer"
                        title="Vypnout tuto stopu"
                      >
                        <Square className="w-3 h-3 fill-current" />
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
                  Klikni na tlačítko <strong>„Přidat do mixu“</strong> u libovolného počtu zvuků níže.
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

          {/* 7 Sound Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SOUND_TRACKS.map((track) => {
              const isPlaying = activeTracks[track.id];
              const vol = volumes[track.id] ?? track.defaultVolume;
              const effectiveVol = getEffectiveVolume(track.id);
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
                          onClick={() => handleSeekForward(track.id, 30)}
                          className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-white border border-[#DDD5EB] text-[#4A3B63] hover:bg-[#FAF8FD] transition-colors cursor-pointer flex items-center gap-1 ml-auto"
                          title="Přeskočit o dalších 30 sekund dopředu"
                        >
                          <FastForward className="w-3 h-3 text-[#634E7D]" />
                          <span>+30 s</span>
                        </button>
                      </div>
                    </div>

                    {/* YouTube Player Iframe (kept mounted while active to maintain continuous streaming) */}
                    {isPlaying && playbackSource === 'youtube' && (
                      <div className="mb-3 rounded-xl overflow-hidden border border-[#D5C6E6] bg-black/5 p-0.5">
                        <iframe
                          ref={(el) => {
                            iframeRefs.current[track.id] = el;
                          }}
                          id={`yt-player-${track.id}`}
                          onLoad={() => handleIframeLoaded(track.id)}
                          width="100%"
                          height="75"
                          src={`https://www.youtube-nocookie.com/embed/${track.youtubeId}?autoplay=1&enablejsapi=1&version=3&loop=1&playlist=${track.youtubeId}&playsinline=1${(trackPositions[track.id] ?? (track.startTime ?? 0)) > 0 ? `&start=${trackPositions[track.id] ?? track.startTime}` : ''}`}
                          title={track.name}
                          allow="autoplay; encrypted-media"
                          className="rounded-lg border-0 block"
                        />
                      </div>
                    )}
                  </div>

                  {/* Volume Slider for this specific track */}
                  <div className="pt-3 border-t border-black/5">
                    <div className="flex items-center justify-between text-xs text-[#606D7E] mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5 text-[#7B8899]" />
                        <span>Hlasitost stopy</span>
                      </span>
                      <span className="tabular-nums font-semibold text-[#48375F]">
                        {vol}% {isPlaying && <span className="text-[10px] text-[#7A889A] font-normal">({effectiveVol}%)</span>}
                      </span>
                    </div>

                    <input
                      type="range"
                      min="5"
                      max="100"
                      value={vol}
                      onChange={(e) => handleVolumeChange(track.id, Number(e.target.value))}
                      className="w-full h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#583E7A]"
                    />
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
