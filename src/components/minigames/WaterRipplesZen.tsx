/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Waves, Volume2, VolumeX, Eye } from 'lucide-react';
import { playWaterDropRipple } from '../../utils/soundEffects';

interface RippleRing {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  opacity: number;
}

interface IncomingDrop {
  id: number;
  x: number;
  y: number;
  currentY: number;
  targetY: number;
  speed: number;
  size: number;
}

interface FloatingPetal {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  rotation: number;
  size: number;
  color: string;
  swayPhase: number;
}

export const WaterRipplesZen: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  const ripplesRef = useRef<RippleRing[]>([]);
  const incomingDropsRef = useRef<IncomingDrop[]>([]);
  const petalsRef = useRef<FloatingPetal[]>([]);
  const nextIdRef = useRef<number>(1);
  const soundEnabledRef = useRef<boolean>(soundEnabled);
  soundEnabledRef.current = soundEnabled;

  // Deep, soothing emerald zen pond palette
  const bgTop = '#143026';
  const bgBottom = '#23493A';
  const ringColor = 'rgba(195, 235, 215, ';
  const causticColor = 'rgba(215, 245, 230, 0.07)';
  const petalColor = '#F5B3C8';

  // Create slow expanding wave circles
  const createRipple = useCallback((x: number, y: number) => {
    const baseId = nextIdRef.current++;
    const maxR = 170 + Math.random() * 40;

    // 2-3 concentric waves expanding slowly
    for (let i = 0; i < 2; i++) {
      ripplesRef.current.push({
        id: baseId * 10 + i,
        x,
        y,
        radius: 2 + i * 10,
        maxRadius: maxR,
        speed: 0.55 + i * 0.05, // VERY SLOW EXPANSION
        opacity: 0.65 - i * 0.2,
      });
    }

    if (soundEnabledRef.current) {
      playWaterDropRipple();
    }
  }, []);

  // Initialize floating petals on water
  const initPetals = useCallback((width: number, height: number) => {
    const petals: FloatingPetal[] = [];
    for (let i = 0; i < 4; i++) {
      const bx = width * 0.2 + Math.random() * (width * 0.6);
      const by = height * 0.25 + Math.random() * (height * 0.5);
      petals.push({
        x: bx,
        y: by,
        baseX: bx,
        baseY: by,
        rotation: Math.random() * Math.PI * 2,
        size: 11 + Math.random() * 4,
        color: petalColor,
        swayPhase: Math.random() * Math.PI * 2,
      });
    }
    petalsRef.current = petals;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initPetals(width, height);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initial drop starts after 1.5s
    let lastDropTime = performance.now() - 3000;

    const render = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Deep calm water gradient
      const waterGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        0,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.75
      );
      waterGrad.addColorStop(0, bgBottom);
      waterGrad.addColorStop(1, bgTop);
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Gentle ambient water caustics
      ctx.fillStyle = causticColor;
      for (let i = 0; i < 3; i++) {
        const cx = width * (0.3 + i * 0.25) + Math.sin(time * 0.0005 + i) * 15;
        const cy = height * (0.35 + (i % 2) * 0.3) + Math.cos(time * 0.0004 + i) * 12;
        const r = 80 + Math.sin(time * 0.0008 + i) * 12;

        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Automated Slow Spawner: Drops fall naturally every 5 to 7 SECONDS (very slow, calm interval)
      const spawnInterval = 5200;
      if (time - lastDropTime > spawnInterval) {
        lastDropTime = time;
        const targetX = width * 0.18 + Math.random() * (width * 0.64);
        const targetY = height * 0.2 + Math.random() * (height * 0.6);

        incomingDropsRef.current.push({
          id: nextIdRef.current++,
          x: targetX,
          y: targetY,
          currentY: targetY - 45,
          targetY,
          speed: 0.9, // SLOW DESCENDING DROP
          size: 2.6,
        });
      }

      // 4. Update and Draw Incoming Slow Droplet
      const incoming = incomingDropsRef.current;
      for (let i = incoming.length - 1; i >= 0; i--) {
        const drop = incoming[i];
        drop.currentY += drop.speed;

        // Droplet body
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(drop.x, drop.currentY, drop.size * 0.8, 0, Math.PI * 2);
        ctx.fill();

        // Droplet motion sheen
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.currentY);
        ctx.lineTo(drop.x, drop.currentY - drop.size * 1.8);
        ctx.stroke();
        ctx.restore();

        // Droplet touches water surface!
        if (drop.currentY >= drop.targetY) {
          createRipple(drop.x, drop.targetY);
          incoming.splice(i, 1);
        }
      }

      // 5. Update and Draw Gentle Slow Expanding Ripple Rings
      const ripples = ripplesRef.current;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        // Very slow, smooth expansion
        r.radius += r.speed;
        r.opacity = Math.max(0, r.opacity - 0.0018); // Fades slowly

        if (r.opacity <= 0.005 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        // Draw wave crest
        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `${ringColor}${r.opacity})`;
        ctx.lineWidth = Math.max(1, 2.8 * (1 - r.radius / r.maxRadius));
        ctx.stroke();

        // Soft outer ambient halo
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius + 1.2, 0, Math.PI * 2);
        ctx.strokeStyle = `${ringColor}${r.opacity * 0.35})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        // Interact with floating petals
        petalsRef.current.forEach((petal) => {
          const dist = Math.hypot(petal.x - r.x, petal.y - r.y);
          if (Math.abs(dist - r.radius) < 10) {
            const angle = Math.atan2(petal.y - r.y, petal.x - r.x);
            petal.x += Math.cos(angle) * 0.18;
            petal.y += Math.sin(angle) * 0.18;
            petal.rotation += 0.012;
          }
        });

        ctx.restore();
      }

      // 6. Draw Floating Sakura Petals Bobbing Gently
      petalsRef.current.forEach((p) => {
        p.x += (p.baseX - p.x) * 0.008;
        p.y += (p.baseY - p.y) * 0.008;

        const currentY = p.y + Math.sin(time * 0.0008 + p.swayPhase) * 1.5;

        ctx.save();
        ctx.translate(p.x, currentY);
        ctx.rotate(p.rotation);

        // Shadow under water
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(2, 3, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();

        // Soft petal
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.4, p.size * 0.7, p.size * 0.6, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.6, -p.size * 0.8, -p.size * 0.4, 0, -p.size);
        ctx.fill();

        // Vein
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.7);
        ctx.lineTo(0, p.size * 0.7);
        ctx.stroke();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [createRipple, initPetals]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5F5EF] border border-[#C5E9DC] text-[#1E5741] text-xs font-semibold uppercase tracking-wider mb-1">
            <Waves className="w-3.5 h-3.5 text-[#2B775A]" />
            <span>Klidná hladina rybníčku</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-light text-[#1F2E28] font-display">
            Kruhy na vodě
          </h3>
          <p className="text-xs sm:text-sm text-[#52685E]">
            Pomalé kapky dopadají na hladinu s dlouhými odstupy. Každý kruh má čas se zvolna rozplynout do ticha.
          </p>
        </div>

        {/* Audio Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-[#DEF1E7] border-[#B9DEC9] text-[#1B573B]'
                : 'bg-white border-[#DFECE4] text-[#5B7568] hover:text-[#193F2D]'
            }`}
            title="Zvuk dopadu kapky"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#216B49]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>Zvuk kapek</span>
          </button>
        </div>
      </div>

      {/* Atmospheric Water Surface Canvas Container */}
      <div className="relative w-full h-[400px] sm:h-[480px] rounded-3xl overflow-hidden shadow-lg border-4 border-[#244538]/30 bg-[#162B22]">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-default select-none block"
        />

        {/* Peaceful Zen Tag */}
        <div className="absolute top-4 left-4 pointer-events-none">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs border border-white/10 shadow-xs">
            <Eye className="w-3 h-3 text-[#A7F3D0]" />
            <span>Jen klidně pozoruj – žádné klikání</span>
          </div>
        </div>

        {/* Ambient calming message */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 pointer-events-none w-full max-w-sm px-4 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white/90 text-xs border border-white/10 shadow-sm">
            Každý kruh se rozplyne do naprostého klidu...
          </div>
        </div>
      </div>
    </div>
  );
};
