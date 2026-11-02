/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { CloudRain, Volume2, VolumeX, Eye } from 'lucide-react';
import { playRaindropTrickle } from '../../utils/soundEffects';

interface TrailPoint {
  x: number;
  y: number;
  r: number;
  alpha: number;
}

interface WindowDrop {
  id: number;
  x: number;
  y: number;
  radius: number;
  vy: number;
  seed: number;
  sliding: boolean;
  isStuck: boolean; // some drops lose momentum and stop midway
  distanceTraveled: number;
  maxDistance: number; // max distance before this drop gets stuck/rests
  trail: TrailPoint[];
}

export const RainWindowRace: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  const dropsRef = useRef<WindowDrop[]>([]);
  const staticMistRef = useRef<{ x: number; y: number; r: number; alpha: number }[]>([]);
  const nextIdRef = useRef<number>(1);
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    // Fixed, rich cozy twilight window palette (permanent single window)
    const bgTop = '#191829';
    const bgBottom = '#2E2235';
    const bokehColors = ['#F5C87E', '#EFA375', '#A58DD1', '#664C7A', '#F7DDB5'];

    // Pre-computed soft atmospheric bokeh lights in background
    const bokehLights = [
      { x: 0.18, y: 0.3, r: 48, col: 0 },
      { x: 0.38, y: 0.52, r: 72, col: 1 },
      { x: 0.72, y: 0.28, r: 56, col: 2 },
      { x: 0.58, y: 0.7, r: 84, col: 3 },
      { x: 0.84, y: 0.65, r: 52, col: 4 },
      { x: 0.24, y: 0.82, r: 64, col: 1 },
    ];

    const initScene = (w: number, h: number) => {
      // 1. Static tiny mist droplets (glass condensation that stays on glass)
      const mist: { x: number; y: number; r: number; alpha: number }[] = [];
      for (let i = 0; i < 90; i++) {
        mist.push({
          x: Math.random() * w,
          y: Math.random() * (h - 20),
          r: 1 + Math.random() * 2.2,
          alpha: 0.35 + Math.random() * 0.45,
        });
      }
      staticMistRef.current = mist;

      // 2. Initial gentle raindrops on glass
      const drops: WindowDrop[] = [];
      for (let i = 0; i < 22; i++) {
        const isSliding = Math.random() < 0.45;
        drops.push({
          id: nextIdRef.current++,
          x: 20 + Math.random() * (w - 40),
          y: Math.random() * (h * 0.65),
          radius: 2.2 + Math.random() * 3.2,
          vy: isSliding ? 0.08 + Math.random() * 0.14 : 0, // VERY SLOW!
          seed: Math.random() * 100,
          sliding: isSliding,
          isStuck: false,
          distanceTraveled: 0,
          // 65% of drops stop midway and do NOT reach the bottom!
          maxDistance: Math.random() < 0.65 ? 40 + Math.random() * (h * 0.45) : 9999,
          trail: [],
        });
      }
      dropsRef.current = drops;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initScene(width, height);
    };
    resize();
    window.addEventListener('resize', resize);

    let lastSpawnTime = performance.now();
    let lastSoundTime = 0;

    const render = (now: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw cozy twilight gradient background through rainy glass
      const bg = ctx.createLinearGradient(0, 0, 0, height);
      bg.addColorStop(0, bgTop);
      bg.addColorStop(1, bgBottom);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);

      // 2. Soft, blurry background bokeh lights (warm street lamps in rain)
      bokehLights.forEach((b) => {
        const bx = b.x * width;
        const by = b.y * height;
        const rad = ctx.createRadialGradient(bx, by, 0, bx, by, b.r);
        const col = bokehColors[b.col];
        rad.addColorStop(0, col + '55');
        rad.addColorStop(0.65, col + '20');
        rad.addColorStop(1, 'transparent');
        ctx.fillStyle = rad;
        ctx.beginPath();
        ctx.arc(bx, by, b.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Subtle glass tint & wooden frame reflection
      ctx.fillStyle = 'rgba(255, 245, 235, 0.03)';
      ctx.fillRect(0, 0, width, height);

      // 4. Draw static condensation mist dots on glass
      staticMistRef.current.forEach((m) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();

        // Tiny glint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(m.x - m.r * 0.3, m.y - m.r * 0.3, Math.max(0.6, m.r * 0.3), 0, Math.PI * 2);
        ctx.fill();
      });

      // 5. Very slow, organic droplet appearance (approx every 3.5 - 6 seconds)
      if (now - lastSpawnTime > 3800) {
        lastSpawnTime = now;
        if (dropsRef.current.length < 28) {
          const isSliding = Math.random() < 0.55;
          dropsRef.current.push({
            id: nextIdRef.current++,
            x: 20 + Math.random() * (width - 40),
            y: 0,
            radius: 2.2 + Math.random() * 3,
            vy: isSliding ? 0.07 + Math.random() * 0.12 : 0, // EXTREMELY SLOW
            seed: Math.random() * 100,
            sliding: isSliding,
            isStuck: false,
            distanceTraveled: 0,
            // Most drops get stuck midway
            maxDistance: Math.random() < 0.65 ? 30 + Math.random() * (height * 0.4) : 9999,
            trail: [],
          });
        }
      }

      const drops = dropsRef.current;

      // 6. Draw Meandering Wet Trails (water tracks on glass)
      drops.forEach((d) => {
        if (d.trail.length > 1) {
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          for (let i = 0; i < d.trail.length; i++) {
            const pt = d.trail[i];
            ctx.lineWidth = pt.r * 1.1;
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
            // Very slow trail fading
            pt.alpha -= 0.00015;
          }
          ctx.stroke();

          // Glistening highlight inside the wet trail
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.lineWidth = 1;
          for (let i = 0; i < d.trail.length; i++) {
            const pt = d.trail[i];
            if (i === 0) ctx.moveTo(pt.x, pt.y);
            else ctx.lineTo(pt.x, pt.y);
          }
          ctx.stroke();

          d.trail = d.trail.filter((p) => p.alpha > 0.02);
        }
      });

      // 7. Update Drops: Slow Meandering & Sticking Midway
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];

        if (d.sliding && !d.isStuck) {
          // EXTREMELY SLOW, DELIBERATE DESCENT
          // Gentle terminal velocity: between 0.12 and 0.35 pixels per frame
          const stepY = d.vy;
          d.y += stepY;
          d.distanceTraveled += stepY;

          // MEANDERING: Drops do NOT go straight down!
          // Natural serpentine curve using layered sinusoidal friction
          const meander =
            Math.sin(d.y * 0.035 + d.seed) * 0.28 +
            Math.cos(d.y * 0.08 + d.seed * 2) * 0.14;
          d.x += meander;

          // Record trail point periodically
          if (Math.random() < 0.4) {
            d.trail.push({
              x: d.x,
              y: d.y,
              r: d.radius * 0.65,
              alpha: 0.3,
            });
            if (d.trail.length > 55) d.trail.shift();
          }

          // Trigger subtle sound very rarely when a drop gathers enough pace
          if (
            soundEnabledRef.current &&
            now - lastSoundTime > 4000 &&
            Math.random() < 0.004
          ) {
            playRaindropTrickle();
            lastSoundTime = now;
          }

          // Merge with static mist in its meandering path
          for (let mIdx = staticMistRef.current.length - 1; mIdx >= 0; mIdx--) {
            const mist = staticMistRef.current[mIdx];
            const dist = Math.hypot(d.x - mist.x, d.y - mist.y);
            if (dist < d.radius + mist.r + 1) {
              // Absorb moisture: slight growth and tiny boost, then slow back down
              d.radius = Math.min(6.2, d.radius + 0.18);
              d.vy = Math.min(0.38, d.vy + 0.04);
              staticMistRef.current.splice(mIdx, 1);
            }
          }

          // STICKING MIDWAY: Drop runs out of mass/momentum and stops moving
          if (d.distanceTraveled >= d.maxDistance) {
            d.isStuck = true;
            d.sliding = false;
            d.vy = 0;
          }

          // Droplet reaches the very bottom sill
          if (d.y >= height - 16) {
            drops.splice(i, 1);
            continue;
          }
        }

        // 8. Draw Droplet Shape (Realistic teardrop with caustics and highlights)
        ctx.save();
        ctx.translate(d.x, d.y);

        // Water droplet body
        ctx.beginPath();
        if (d.sliding && !d.isStuck) {
          // Elongated droplet with curved tail when sliding
          ctx.ellipse(0, 0, d.radius * 0.88, d.radius * 1.25, 0, 0, Math.PI * 2);
        } else {
          // Relaxed teardrop/circle when stationary or stuck
          ctx.arc(0, 0, d.radius, 0, Math.PI * 2);
        }

        // Refractive radial gradient
        const grad = ctx.createRadialGradient(
          -d.radius * 0.25,
          -d.radius * 0.25,
          0,
          0,
          0,
          d.radius * 1.05
        );
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.35, 'rgba(230, 240, 255, 0.45)');
        grad.addColorStop(0.8, 'rgba(120, 145, 185, 0.25)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0.7)');
        ctx.fillStyle = grad;
        ctx.fill();

        // Primary Specular Glint (top-left light reflection)
        ctx.beginPath();
        ctx.arc(
          -d.radius * 0.32,
          -d.radius * 0.32,
          Math.max(0.8, d.radius * 0.26),
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();

        // Secondary bottom soft caustic reflection
        ctx.beginPath();
        ctx.arc(
          d.radius * 0.2,
          d.radius * 0.28,
          Math.max(0.6, d.radius * 0.2),
          0,
          Math.PI * 2
        );
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fill();

        ctx.restore();
      }

      // 9. Draw cozy wooden window bottom sill
      ctx.fillStyle = '#181220';
      ctx.fillRect(0, height - 14, width, 14);

      // Water condensation line on sill
      const sillGrad = ctx.createLinearGradient(0, height - 17, 0, height - 13);
      sillGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      sillGrad.addColorStop(1, 'rgba(220, 235, 255, 0.22)');
      ctx.fillStyle = sillGrad;
      ctx.fillRect(0, height - 17, width, 4);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EBF3FB] border border-[#CDE1F4] text-[#245277] text-xs font-semibold uppercase tracking-wider mb-1">
            <CloudRain className="w-3.5 h-3.5 text-[#356F9F]" />
            <span>Meditativní pozorování kapek</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-light text-[#223348] font-display">
            Kapky na okně
          </h3>
          <p className="text-xs sm:text-sm text-[#5B6C7E]">
            Pomalé kapky stékající po skle. Meandrují, kroutí se, některé se zastaví v půli cesty. Jen klidně pozoruj.
          </p>
        </div>

        {/* Ambient Observer Badge & Sound Button */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#E3EFFB] border-[#B9D5F0] text-[#1E527D]'
                : 'bg-white border-[#E2E8F0] text-[#64748B] hover:text-[#1E293B]'
            }`}
            title="Zvuk kapek"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#245C8A]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Zvuk kapek</span>
          </button>
        </div>
      </div>

      {/* Atmospheric Permanent Window Container */}
      <div className="relative w-full h-[400px] sm:h-[480px] rounded-3xl overflow-hidden shadow-lg border-4 border-[#352B42]/50 bg-[#191829]">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-default select-none block"
        />

        {/* Gentle Zen Tag */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs border border-white/10 shadow-xs">
            <Eye className="w-3 h-3 text-[#A8C7FA]" />
            <span>Jen klidně pozoruj – žádný spěch</span>
          </div>
        </div>

        {/* Atmospheric Bottom Hint */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none w-full max-w-sm px-4 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/85 text-xs border border-white/10 shadow-sm">
            Některé kapky se spojí, jiné poklidně spočinou na skle...
          </div>
        </div>
      </div>
    </div>
  );
};
