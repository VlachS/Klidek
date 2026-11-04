/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Shield, Sparkles, Heart, RefreshCw } from 'lucide-react';
import {
  playAnchorGrounding,
  startAnchorHoldSound,
  stopAnchorHoldSound,
} from '../utils/soundEffects';

interface AnchorAffirmation {
  text: string;
  focus: string;
}

const AFFIRMATIONS: AnchorAffirmation[] = [
  {
    text: 'Tady a teď jsi v bezpečí. Zhluboka vydechni – tíha a stres smějí odejít.',
    focus: 'Okamžitá úleva a bezpečí',
  },
  {
    text: 'Tento moment je stabilní. Tvoje nohy stojí pevně na zemi a ramena klesají.',
    focus: 'Fyzické ukotvení těla',
  },
  {
    text: 'Bouře v myšlenkách není tím, kým jsi. Tvá vnitřní kotva tě drží bezpečně na místě.',
    focus: 'Odstup od bouře v hlavě',
  },
  {
    text: 'Všechno spěchání a tlak se smí na chvíli zastavit. Jsi v pořádku tak, jak jsi.',
    focus: 'Zastavení vnitřního spěchu',
  },
  {
    text: 'Nemusíš teď vyřešit celý svůj život. Stačí zvládnout a vnímat tento jediný nádech.',
    focus: 'Krok za krokem v přítomnosti',
  },
];

export const MindfulAnchor: React.FC = () => {
  const [isHolding, setIsHolding] = useState<boolean>(false);
  const [holdProgress, setHoldProgress] = useState<number>(0);
  const [isGrounded, setIsGrounded] = useState<boolean>(false);
  const [groundedCount, setGroundedCount] = useState<number>(0);
  const [affirmationIndex, setAffirmationIndex] = useState<number>(0);
  const [rippleActive, setRippleActive] = useState<boolean>(false);
  const [holdHint, setHoldHint] = useState<string | null>(null);

  const holdStartRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const completedRef = useRef<boolean>(false);

  const activeAffirmation = AFFIRMATIONS[affirmationIndex];
  const HOLD_DURATION_MS = 1600; // 1.6 seconds deliberate hold

  // SVG ring parameters for the hold progress indicator
  const RADIUS = 76;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const strokeDashoffset = CIRCUMFERENCE * (1 - holdProgress / 100);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Only respond to primary mouse / touch button
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    setIsHolding(true);
    setHoldHint(null);
    completedRef.current = false;
    holdStartRef.current = performance.now();
    startAnchorHoldSound();

    const updateHold = (now: number) => {
      if (!holdStartRef.current) return;
      const elapsed = now - holdStartRef.current;
      const progress = Math.min(100, (elapsed / HOLD_DURATION_MS) * 100);
      setHoldProgress(progress);

      if (progress >= 100 && !completedRef.current) {
        // Complete the grounding milestone while continuing to hold and emit sound!
        completedRef.current = true;
        setIsGrounded(true);
        setRippleActive(true);
        playAnchorGrounding();
        setGroundedCount((c) => c + 1);
        setHoldProgress(100);
        setHoldHint('Kotva dosedla. Drž ji dál, jak dlouho potřebuješ – vnímej její klidný tón.');

        // Cycle to next affirmation for fresh reflection
        setTimeout(() => {
          setAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
        }, 800);
      }

      animFrameRef.current = requestAnimationFrame(updateHold);
    };

    animFrameRef.current = requestAnimationFrame(updateHold);
  };

  const handlePointerUpOrCancel = () => {
    stopAnchorHoldSound();

    if (!completedRef.current && isHolding) {
      if (holdProgress < 85 && holdProgress > 5) {
        setHoldHint('Kotvu je potřeba podržet... Zkus stisknout a vydržet.');
      }
    } else if (completedRef.current && isHolding) {
      setHoldHint('Kotva tě ukotvila. Kdykoliv ji můžeš znovu podržet.');
    }

    setIsHolding(false);
    setRippleActive(false);
    holdStartRef.current = null;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    setHoldProgress(0);
  };

  useEffect(() => {
    return () => {
      stopAnchorHoldSound();
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const nextAffirmation = () => {
    setAffirmationIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
  };

  return (
    <div className="relative my-8 max-w-lg mx-auto">
      {/* Concentric grounding shockwave when hold is successfully completed */}
      {rippleActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <div className="w-56 h-56 rounded-full border-2 border-[#76569C]/50 animate-ping" />
          <div className="w-72 h-72 rounded-full border border-[#8A67B3]/40 animate-pulse delay-150" />
        </div>
      )}

      {/* Main Anchor Container */}
      <div
        className={`relative z-10 p-6 sm:p-7 rounded-3xl bg-white/90 backdrop-blur-md border transition-all duration-500 shadow-sm text-center ${
          isHolding
            ? 'border-[#7954A3] ring-4 ring-[#E6DBF5] shadow-lg scale-[1.01]'
            : isGrounded
            ? 'border-[#C2AEDC] shadow-md ring-2 ring-[#F1E8FB]'
            : 'border-[#DFD5EC]'
        }`}
      >
        {/* Top badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE8F7] border border-[#DCCEEE] text-[#553C73] text-[11px] font-semibold tracking-wide uppercase mb-3">
          <Shield className="w-3.5 h-3.5 text-[#6D4994]" />
          <span>Vnitřní kotva klidu (pouze na podržení)</span>
        </div>

        {/* Interactive Anchor Visual - ONLY ON HOLD */}
        <div className="relative flex flex-col items-center justify-center my-4">
          <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center select-none">
            {/* Circular Hold Progress Ring (SVG) */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              {/* Background faint ring */}
              <circle
                cx="50%"
                cy="50%"
                r={RADIUS}
                fill="none"
                stroke="#EAE2F3"
                strokeWidth="4"
              />
              {/* Active progress fill ring */}
              <circle
                cx="50%"
                cy="50%"
                r={RADIUS}
                fill="none"
                stroke="#77519E"
                strokeWidth="5"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-75 ease-linear"
              />
            </svg>

            {/* Hold Anchor Button */}
            <button
              type="button"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUpOrCancel}
              onPointerLeave={handlePointerUpOrCancel}
              onPointerCancel={handlePointerUpOrCancel}
              className={`group relative w-36 h-36 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer select-none touch-none ${
                isHolding
                  ? 'bg-gradient-to-b from-[#E7D6F7] to-[#D5BFEA] shadow-inner transform scale-95'
                  : 'bg-gradient-to-b from-[#F7F2FB] to-[#ECE1F6] hover:from-[#F2E8FA] hover:to-[#E4D1F3] shadow-md'
              }`}
              title="Stiskni a drž prstem nebo myší pro usazení kotvy"
            >
              {/* Aura behind anchor */}
              <div
                className={`absolute inset-2 rounded-full bg-gradient-to-tr from-[#9B7BBF]/20 to-[#432A60]/10 transition-opacity duration-300 ${
                  isHolding ? 'opacity-100 scale-105' : 'opacity-60 group-hover:opacity-90'
                }`}
              />

              {/* Anchor SVG with realistic metallic sheen */}
              <svg
                viewBox="0 0 100 100"
                className={`w-24 h-24 sm:w-26 sm:h-26 transition-transform duration-300 drop-shadow-sm ${
                  isHolding ? 'scale-95 translate-y-1 text-[#3D255B]' : 'group-hover:scale-105 text-[#543878]'
                }`}
                fill="currentColor"
              >
                {/* Ring at top */}
                <circle cx="50" cy="18" r="8" fill="none" stroke="currentColor" strokeWidth="3.5" />
                <circle cx="50" cy="18" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />

                {/* Rope loop wrapped around top */}
                <path
                  d="M 45 27 C 47 24 53 24 55 27 C 56 30 52 32 47 33 C 44 34 46 38 52 38"
                  fill="none"
                  stroke="#B59CCF"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Crossbar */}
                <line x1="28" y1="36" x2="72" y2="36" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
                <circle cx="28" cy="36" r="3.5" fill="currentColor" />
                <circle cx="72" cy="36" r="3.5" fill="currentColor" />

                {/* Main Vertical Shaft */}
                <line x1="50" y1="26" x2="50" y2="82" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round" />

                {/* Lower curved arms */}
                <path
                  d="M 22 62 C 22 84 50 88 50 88 C 50 88 78 84 78 62"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* Left Fluke */}
                <polygon points="22,64 15,55 29,57" fill="currentColor" />
                {/* Right Fluke */}
                <polygon points="78,64 85,55 71,57" fill="currentColor" />

                {/* Bottom crown jewel / point */}
                <polygon points="50,91 46,84 54,84" fill="currentColor" />
              </svg>

              {/* Status pill on the anchor */}
              <div className="absolute bottom-2 px-2.5 py-0.5 rounded-full bg-white/80 text-[10px] font-semibold text-[#573A78] shadow-2xs">
                {isHolding
                  ? holdProgress >= 100
                    ? 'Zní tón klidu...'
                    : `Drž dál... ${Math.round(holdProgress)}%`
                  : 'Stiskni & drž'}
              </div>
            </button>
          </div>

          {/* Gentle somatic instruction */}
          <p className="text-xs text-[#7B6E8F] mt-2 font-medium">
            {holdHint
              ? holdHint
              : isHolding
              ? 'Drž a vnímej, jak ramena a čelist klesají dolů...'
              : 'Neklepat – polož prst nebo myš na kotvu a podrž ji.'}
          </p>
        </div>

        {/* Main User-Requested Anchor Inscription */}
        <div className="my-3">
          <h3 className="text-xl sm:text-2xl font-light text-[#2C1D42] font-display tracking-tight mb-2">
            Ukotvi se v tomto momentě
          </h3>
          <p className="text-sm sm:text-base text-[#57446E] font-medium max-w-md mx-auto leading-relaxed">
            „{activeAffirmation.text}“
          </p>
        </div>

        {/* Sub-focus & Cycle Action */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-[#EDE4F5]">
          <span className="text-xs text-[#7B6E8F] flex items-center gap-1.5 bg-[#FAF6FC] px-3 py-1 rounded-full border border-[#E7DCF2]">
            <Sparkles className="w-3 h-3 text-[#7B53A8]" />
            <span>Zaměření: <strong className="text-[#4E356F] font-semibold">{activeAffirmation.focus}</strong></span>
          </span>

          <button
            type="button"
            onClick={nextAffirmation}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#DACCEE] text-[#553C73] text-xs font-medium hover:bg-[#F8F3FC] transition-colors cursor-pointer shadow-2xs"
            title="Přepnout na další uklidňující myšlenku"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Další myšlenka</span>
          </button>
        </div>

        {/* Grounding Counter & Somatic Comfort */}
        {groundedCount > 0 && (
          <div className="mt-3 text-[11px] text-[#7F7195] flex items-center justify-center gap-2">
            <Heart className="w-3 h-3 text-[#A872BD] fill-[#EADBEE]" />
            <span>
              Pevně ukotveno v přítomnosti: <strong className="text-[#452D63] font-semibold">{groundedCount}×</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
