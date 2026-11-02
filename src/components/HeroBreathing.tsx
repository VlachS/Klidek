/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Bell, BellOff } from 'lucide-react';
import { playChime } from '../utils/soundEffects';
import { MindfulAnchor } from './MindfulAnchor';

interface BreathPattern {
  id: string;
  name: string;
  desc: string;
  inhale: number;
  hold1: number;
  exhale: number;
  hold2: number;
}

const PATTERNS: BreathPattern[] = [
  {
    id: 'box',
    name: 'Rovnováha 4-4-4-4',
    desc: 'Krabicový dech pro okamžité soustředění a stabilitu',
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
  },
  {
    id: 'relax',
    name: 'Ztišení 4-7-8',
    desc: 'Hluboké zklidnění nervového systému před spánkem či stresem',
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
  },
  {
    id: 'calm',
    name: 'Klidný rytmus 4-6',
    desc: 'Přirozený prodloužený výdech zpomalující tep',
    inhale: 4,
    hold1: 0,
    exhale: 6,
    hold2: 0,
  },
];

type Phase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

export const HeroBreathing: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<BreathPattern>(PATTERNS[0]);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [currentPhase, setCurrentPhase] = useState<Phase>('inhale');
  const [phaseSecondsLeft, setPhaseSecondsLeft] = useState<number>(PATTERNS[0].inhale);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [soundCues, setSoundCues] = useState<boolean>(false);

  const phaseRef = useRef<Phase>(currentPhase);
  const patternRef = useRef<BreathPattern>(selectedPattern);
  const soundCuesRef = useRef<boolean>(soundCues);

  phaseRef.current = currentPhase;
  patternRef.current = selectedPattern;
  soundCuesRef.current = soundCues;

  // Handle phase switching logic
  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setPhaseSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition to next phase
        const currentPat = patternRef.current;
        let nextPhase: Phase = 'inhale';
        let nextDuration = 4;

        if (phaseRef.current === 'inhale') {
          if (currentPat.hold1 > 0) {
            nextPhase = 'hold1';
            nextDuration = currentPat.hold1;
          } else {
            nextPhase = 'exhale';
            nextDuration = currentPat.exhale;
          }
        } else if (phaseRef.current === 'hold1') {
          nextPhase = 'exhale';
          nextDuration = currentPat.exhale;
        } else if (phaseRef.current === 'exhale') {
          if (currentPat.hold2 > 0) {
            nextPhase = 'hold2';
            nextDuration = currentPat.hold2;
          } else {
            nextPhase = 'inhale';
            nextDuration = currentPat.inhale;
            setCompletedCycles((c) => c + 1);
          }
        } else if (phaseRef.current === 'hold2') {
          nextPhase = 'inhale';
          nextDuration = currentPat.inhale;
          setCompletedCycles((c) => c + 1);
        }

        if (soundCuesRef.current) {
          playChime(nextPhase === 'inhale' ? 0 : nextPhase === 'hold1' ? 2 : nextPhase === 'exhale' ? 4 : 1);
        }

        setCurrentPhase(nextPhase);
        return nextDuration;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  const handleSelectPattern = (pat: BreathPattern) => {
    setSelectedPattern(pat);
    setCurrentPhase('inhale');
    setPhaseSecondsLeft(pat.inhale);
  };

  const handleReset = () => {
    setCurrentPhase('inhale');
    setPhaseSecondsLeft(selectedPattern.inhale);
    setCompletedCycles(0);
  };

  // Phase labels and pastel visual accents
  const phaseDetails = {
    inhale: {
      label: 'Pomalý nádech nosem',
      instruction: 'Vnímej, jak tělo nabírá čerstvou lehkost',
      colorBg: 'from-[#CDE8D8]/70 via-[#D4E6F6]/50 to-[#E8DFF5]/40',
      ringColor: 'border-[#A6D6BA]',
      scale: 'scale-110',
      badgeColor: 'text-[#3B7258] bg-[#E7F6ED]',
    },
    hold1: {
      label: 'Jemně podrž dech',
      instruction: 'Uvolni ramena a setrvej v tichu',
      colorBg: 'from-[#E8DFF5]/80 via-[#DCD0F0]/60 to-[#D4E6F6]/40',
      ringColor: 'border-[#CBB7E6]',
      scale: 'scale-110',
      badgeColor: 'text-[#614980] bg-[#F2ECF9]',
    },
    exhale: {
      label: 'Pozvolný výdech ústy',
      instruction: 'Nech odplout jakékoli napětí a spěch',
      colorBg: 'from-[#D4E6F6]/80 via-[#C1DCF3]/60 to-[#CDE8D8]/40',
      ringColor: 'border-[#9EC6EA]',
      scale: 'scale-85',
      badgeColor: 'text-[#35678B] bg-[#EAF3FA]',
    },
    hold2: {
      label: 'Klidová pauza',
      instruction: 'Vnímej přirozený prázdný prostor',
      colorBg: 'from-[#F0ECF8]/70 via-[#E5F2EC]/60 to-[#FAF9FC]',
      ringColor: 'border-[#D8D2E7]',
      scale: 'scale-90',
      badgeColor: 'text-[#564B6B] bg-[#F4EFFB]',
    },
  }[currentPhase];

  return (
    <section id="dechy" className="relative pt-10 pb-16 overflow-hidden">
      {/* Background ambient pastel glowing meshes with rich pigmentation */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#BFDEC8]/50 via-[#C3DDF0]/45 to-[#DFD0ED]/55 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Intro */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/70 border border-[#DACCEE] text-xs font-medium text-[#5F4B78] mb-4 shadow-xs">
          <span>Tvůj bezpečný přístav pro zklidnění</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-[#2D223F] font-display mb-3 text-balance">
          Zpomal. Všechno důležité počká.
        </h1>
        <p className="text-sm sm:text-base text-[#576475] max-w-xl mx-auto mb-6 leading-relaxed text-balance">
          Dotkni se své vnitřní kotvy, ukotvi se v bezpečném přítomném okamžiku a zhluboka se nadechni s naším dechovým kruhem.
        </p>

        {/* --- MINDFUL ANCHOR GROUNDING --- */}
        <MindfulAnchor />

        {/* Breath Pattern Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/70 border border-[#DCD3E9] rounded-2xl max-w-lg mx-auto mb-10 shadow-xs mt-8">
          {PATTERNS.map((p) => {
            const isSelected = selectedPattern.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPattern(p)}
                className={`px-4 py-2 text-xs font-medium rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#E3D7F3] text-[#3D285B] shadow-xs font-semibold'
                    : 'text-[#5F6878] hover:text-[#2D223F] hover:bg-white/50'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Interactive Breathing Sphere Visualizer */}
        <div className="relative flex flex-col items-center justify-center my-6">
          <div className="relative w-64 h-64 sm:w-76 sm:h-76 flex items-center justify-center">
            {/* Outer soft aura rings */}
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${phaseDetails.colorBg} blur-xl transition-all duration-1000 ease-in-out ${phaseDetails.scale}`}
            />

            {/* Middle pulsing guidance ring */}
            <div
              className={`absolute inset-3 rounded-full border-2 border-dashed ${phaseDetails.ringColor} opacity-70 transition-all duration-1000 ease-in-out ${phaseDetails.scale}`}
            />

            {/* Inner Core Sphere */}
            <div
              className={`relative z-10 w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-white/95 to-[#F5EFFB]/90 shadow-md border border-white/80 flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out ${phaseDetails.scale}`}
            >
              <span className={`text-[11px] font-semibold tracking-wide uppercase px-2.5 py-0.5 rounded-full mb-1.5 ${phaseDetails.badgeColor}`}>
                {phaseDetails.label}
              </span>
              <span className="text-5xl font-light text-[#2D223F] tabular-nums font-display">
                {phaseSecondsLeft}s
              </span>
              <span className="text-xs text-[#6F7B8C] mt-1 text-center px-4 leading-tight">
                {phaseDetails.instruction}
              </span>
            </div>
          </div>
        </div>

        {/* Breathing Control Actions & Stats */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#493563] text-white hover:bg-[#3D2C53] transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap"
          >
            {isActive ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pozastavit dech</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Pokračovat v dechu</span>
              </>
            )}
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 rounded-full bg-white/80 border border-[#DCD3E9] text-[#606D80] hover:text-[#2D223F] hover:bg-white transition-colors cursor-pointer"
            title="Resetovat dech"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              const next = !soundCues;
              setSoundCues(next);
              if (next) playChime(0);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
              soundCues
                ? 'bg-[#E3D7F3] border-[#C4B3DF] text-[#473065]'
                : 'bg-white/80 border-[#D8D2E2] text-[#687586] hover:bg-white'
            }`}
            title="Jemný zvoneček při změně dechu"
          >
            {soundCues ? <Bell className="w-3.5 h-3.5 text-[#634E7D]" /> : <BellOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Zvuk přechodu</span>
          </button>
        </div>

        {/* Calm Cycle Count Counter */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-[#7A8799]">
          <span>Dokončeno cyklů: <strong className="text-[#3E2B56] font-semibold tabular-nums">{completedCycles}</strong></span>
          <span>·</span>
          <span>{selectedPattern.desc}</span>
        </div>
      </div>
    </section>
  );
};
