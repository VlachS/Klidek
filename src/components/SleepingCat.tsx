/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Volume2, Play, Square, ExternalLink } from 'lucide-react';
import { startCatPurr, stopCatPurr, setCatPurrVolume } from '../utils/soundEffects';

export const SleepingCat: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [volume, setVolume] = useState(70);
  const [useYouTube, setUseYouTube] = useState(false);
  const ytIframeRef = React.useRef<HTMLIFrameElement | null>(null);

  const sendYtCommand = (func: string, args: unknown[] = []) => {
    if (ytIframeRef.current && ytIframeRef.current.contentWindow) {
      try {
        ytIframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch {
        // ignore
      }
    }
  };

  // Guarantee silence on page load and unmount
  useEffect(() => {
    stopCatPurr();
    return () => {
      stopCatPurr();
    };
  }, []);

  const handleTogglePurr = () => {
    if (isPlaying) {
      stopCatPurr();
      sendYtCommand('pauseVideo');
      setIsPlaying(false);
    } else {
      if (!useYouTube) {
        startCatPurr(volume / 100);
      }
      setIsPlaying(true);
      setStrokeCount((c) => c + 1);
    }
  };

  const handleDirectStop = () => {
    stopCatPurr();
    sendYtCommand('pauseVideo');
    setIsPlaying(false);
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setCatPurrVolume(newVol / 100);
    sendYtCommand('setVolume', [newVol]);
  };

  const handleIframeLoad = () => {
    sendYtCommand('unMute');
    sendYtCommand('setVolume', [volume]);
    sendYtCommand('playVideo');
    setTimeout(() => {
      sendYtCommand('unMute');
      sendYtCommand('setVolume', [volume]);
    }, 400);
  };

  const toggleSource = (yt: boolean) => {
    stopCatPurr();
    setUseYouTube(yt);
    if (isPlaying) {
      if (!yt) {
        startCatPurr(volume / 100);
      }
    }
  };

  return (
    <div className="relative my-8 max-w-md mx-auto">
      {/* Purring aura glow (only visible when playing) */}
      <div
        className={`absolute -inset-3 rounded-full bg-gradient-to-r from-[#CDE8D8]/60 via-[#E8DFF5]/60 to-[#D4E6F6]/60 blur-xl transition-all duration-700 pointer-events-none ${
          isPlaying ? 'opacity-100 scale-105' : 'opacity-0 scale-95'
        }`}
      />

      <div
        className={`relative z-10 p-6 rounded-3xl bg-white/85 border transition-all duration-300 shadow-sm text-center ${
          isPlaying
            ? 'border-[#CBB7E6] shadow-md ring-2 ring-[#E8DFF5]'
            : 'border-[#E2DCEE]'
        }`}
      >
        {/* Floating purr indicators */}
        {isPlaying && (
          <div className="absolute top-3 right-6 flex items-center gap-1 text-[#6A4F8C] animate-pulse">
            <Heart className="w-3.5 h-3.5 fill-[#E8DFF5] text-[#8869B2]" />
            <span className="text-[11px] font-medium tracking-wide">Přrr... přrr...</span>
          </div>
        )}

        <div className="flex flex-col items-center justify-center">
          {/* Sleeping Cat SVG Illustration (Click to toggle petting) */}
          <button
            type="button"
            onClick={handleTogglePurr}
            className={`relative w-44 h-28 my-1 transition-transform duration-700 cursor-pointer group focus:outline-hidden ${
              isPlaying ? 'scale-105 animate-pulse-gentle' : 'hover:scale-[1.02]'
            }`}
            title={isPlaying ? 'Klikni pro zastavení předení' : 'Klikni pro pohlazení a spuštění předení'}
          >
            {/* Cushion / Pillow underneath */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-42 h-10 rounded-full bg-gradient-to-r from-[#D7CEE5] via-[#EAE3F5] to-[#D5CADF] shadow-inner border border-[#C5B8DA]/50" />

            {/* Cat Body */}
            <svg
              viewBox="0 0 200 130"
              className="w-full h-full drop-shadow-xs"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M 50 95 C 30 95 20 80 25 65 C 28 55 40 58 38 68 C 36 78 45 88 65 88"
                stroke="#C9B7A3"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <ellipse cx="100" cy="80" rx="65" ry="36" fill="#F7EFE6" stroke="#E2D4C3" strokeWidth="2.5" />
              <path
                d="M 85 52 C 95 50 115 54 125 62 C 115 68 95 65 85 52 Z"
                fill="#EAD9F2"
                opacity="0.85"
              />
              <path
                d="M 55 70 C 65 65 75 75 70 85 C 60 85 52 78 55 70 Z"
                fill="#D4E6D8"
                opacity="0.8"
              />
              <circle cx="145" cy="74" r="28" fill="#F7EFE6" stroke="#E2D4C3" strokeWidth="2.5" />
              <polygon points="135,52 145,30 156,50" fill="#F7EFE6" stroke="#E2D4C3" strokeWidth="2" />
              <polygon points="138,48 145,36 153,47" fill="#F2D2D7" />
              <polygon points="156,52 168,34 174,54" fill="#F7EFE6" stroke="#E2D4C3" strokeWidth="2" />
              <polygon points="159,49 167,39 171,51" fill="#F2D2D7" />
              <path d="M 140 76 Q 146 81 152 76" stroke="#7E6C5F" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 158 76 Q 164 81 170 76" stroke="#7E6C5F" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="154,82 158,82 156,86" fill="#E8A8B8" />
              <path d="M 156 86 Q 153 90 149 88" stroke="#9A8576" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 156 86 Q 159 90 163 88" stroke="#9A8576" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="168" y1="83" x2="185" y2="82" stroke="#B8A89A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="168" y1="86" x2="184" y2="89" stroke="#B8A89A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="135" y1="83" x2="120" y2="82" stroke="#B8A89A" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="135" y1="86" x2="122" y2="89" stroke="#B8A89A" strokeWidth="1.5" strokeLinecap="round" />
              <ellipse cx="120" cy="100" rx="12" ry="8" fill="#F7EFE6" stroke="#E2D4C3" strokeWidth="2" />
              <ellipse cx="140" cy="100" rx="10" ry="8" fill="#F7EFE6" stroke="#E2D4C3" strokeWidth="2" />
            </svg>
          </button>

          <div className="mt-2">
            <h4 className="text-base font-medium text-[#382650] font-display flex items-center justify-center gap-2">
              <span>Spící kočička Míca</span>
              {isPlaying && <Sparkles className="w-3.5 h-3.5 text-[#8869B2]" />}
            </h4>
            <p className="text-xs text-[#6A788A] mt-0.5">
              {isPlaying
                ? 'Míca spokojeně přede. Zvuk hraje pouze tehdy, když ho máš zapnutý.'
                : 'Klikni na kočičku nebo tlačítko níže pro pohlazení a zapnutí předení.'}
            </p>
          </div>

          {/* Explicit ON / OFF controls */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleTogglePurr}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                isPlaying
                  ? 'bg-[#493563] text-white hover:bg-[#3D2C53]'
                  : 'bg-white border border-[#DDD5EB] text-[#554271] hover:bg-[#FAF8FD]'
              }`}
            >
              {isPlaying ? <Square className="w-3 h-3 fill-white" /> : <Play className="w-3 h-3" />}
              <span>{isPlaying ? 'Zastavit předení' : 'Pohladit a spustit předení'}</span>
            </button>

            {isPlaying && (
              <button
                type="button"
                onClick={handleDirectStop}
                className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#FBF7F9] border border-[#E9D6DE] text-[#7A4056] hover:bg-[#F8EDF2] transition-colors cursor-pointer"
              >
                Vypnout
              </button>
            )}
          </div>

          {/* Source switch (Web Audio / YouTube) */}
          <div className="mt-3 flex items-center justify-center gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => toggleSource(false)}
              className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                !useYouTube
                  ? 'bg-[#EAE2F5] border-[#CBB7E6] text-[#4F366F] font-semibold'
                  : 'bg-white/60 border-[#E2DAED] text-[#6E7A8A]'
              }`}
            >
              Čisté vrnění (Web Audio)
            </button>
            <button
              type="button"
              onClick={() => toggleSource(true)}
              className={`px-2.5 py-1 rounded-lg border transition-colors cursor-pointer flex items-center gap-1 ${
                useYouTube
                  ? 'bg-[#EAE2F5] border-[#CBB7E6] text-[#4F366F] font-semibold'
                  : 'bg-white/60 border-[#E2DAED] text-[#6E7A8A]'
              }`}
            >
              <span>YouTube záznam</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Volume Slider */}
          <div className="w-full max-w-[260px] mt-3 pt-3 border-t border-[#EDE5F5]">
            <div className="flex items-center justify-between text-xs text-[#625375] mb-1">
              <span className="flex items-center gap-1.5 text-[11px]">
                <Volume2 className="w-3 h-3 text-[#79668F]" />
                <span>Hlasitost předení</span>
              </span>
              <span className="tabular-nums font-semibold text-[11px]">{volume}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              className="w-full h-1.5 bg-black/10 rounded-lg appearance-none cursor-pointer accent-[#614980]"
            />
          </div>

          {/* Embedded YouTube Player for Cat Purring when explicitly playing in YouTube mode */}
          {isPlaying && useYouTube && (
            <div className="mt-3 w-full rounded-2xl overflow-hidden border border-[#D8C7EB] bg-black/5 p-1">
              <iframe
                ref={ytIframeRef}
                onLoad={handleIframeLoad}
                width="100%"
                height="75"
                src="https://www.youtube-nocookie.com/embed/CY7t8ow2gOM?autoplay=1&enablejsapi=1&version=3&loop=1&playlist=CY7t8ow2gOM&playsinline=1"
                title="Happy Cat Purring YouTube"
                allow="autoplay; encrypted-media"
                className="rounded-xl border-0 block"
              />
            </div>
          )}

          {strokeCount > 0 && (
            <div className="mt-2 text-[11px] text-[#7E8C9D]">
              Pohlazeno: <strong className="text-[#4E3768] font-semibold">{strokeCount}×</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
