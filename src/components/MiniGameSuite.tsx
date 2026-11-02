/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  Wind,
  Search,
  Sparkles,
  Layers,
  RotateCcw,
  Check,
  Heart,
  Puzzle,
  Eye,
  EyeOff,
  Wand2,
  LayoutGrid,
  HelpCircle,
  CircleDot,
  Smile,
  Activity,
  CloudRain,
  Waves,
} from 'lucide-react';
import {
  playBubblePop,
  playChime,
  playStoneThud,
  playSquishPress,
  playSquishRelease,
} from '../utils/soundEffects';
import { RainWindowRace } from './minigames/RainWindowRace';
import { WaterRipplesZen } from './minigames/WaterRipplesZen';

type MiniGameMode =
  | 'leaves'
  | 'lily-count'
  | 'bubbles'
  | 'stones'
  | 'puzzle'
  | 'pexeso'
  | 'stress-ball'
  | 'rain-window'
  | 'water-ripples';

interface LeafParticle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  color: string;
  type: number;
  grounded: boolean;
}

interface LilyItem {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number;
  colorType: 'purple' | 'blue' | 'pink' | 'white';
  colorHex: string;
  isTarget: boolean;
  found: boolean;
}

export const MiniGameSuite: React.FC = () => {
  const [activeMode, setActiveMode] = useState<MiniGameMode>('leaves');

  // ==========================================
  // MINI-GAME 1: Sledování padajícího listí
  // ==========================================
  const leavesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [breezeLevel, setBreezeLevel] = useState<number>(1);
  const [fallenCount, setFallenCount] = useState<number>(0);

  useEffect(() => {
    if (activeMode !== 'leaves') return;
    const canvas = leavesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let leaves: LeafParticle[] = [];

    const pastelColors = [
      '#E8D9A8', // soft amber
      '#E3BE98', // warm apricot
      '#C8DDBE', // pale sage
      '#E2C8D8', // pastel heather
      '#DFB8A5', // terracotta tint
      '#D2DEC3', // light mint
    ];

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    // Spawn initial leaves
    for (let i = 0; i < 24; i++) {
      leaves.push({
        x: Math.random() * (canvas.getBoundingClientRect().width || 500),
        y: Math.random() * (canvas.getBoundingClientRect().height || 350),
        size: 14 + Math.random() * 12,
        vx: 0.2 + Math.random() * 0.8,
        vy: 0.6 + Math.random() * 0.9,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.04,
        color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
        type: Math.floor(Math.random() * 3),
        grounded: false,
      });
    }

    const drawLeaf = (l: LeafParticle) => {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rotation);
      ctx.fillStyle = l.color;
      ctx.globalAlpha = 0.88;

      ctx.beginPath();
      // Organic leaf shape
      ctx.moveTo(0, -l.size);
      ctx.bezierCurveTo(l.size * 0.7, -l.size * 0.4, l.size * 0.7, l.size * 0.4, 0, l.size);
      ctx.bezierCurveTo(-l.size * 0.7, l.size * 0.4, -l.size * 0.7, -l.size * 0.4, 0, -l.size);
      ctx.fill();

      // Delicate leaf vein
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -l.size * 0.8);
      ctx.lineTo(0, l.size * 0.8);
      ctx.stroke();

      ctx.restore();
    };

    let tick = 0;
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Sky & Tree backdrop
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#EAE5F3');
      bgGrad.addColorStop(0.6, '#E2EDEE');
      bgGrad.addColorStop(1, '#D8E8DC');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // Stylized peaceful tree branch on top left
      ctx.save();
      ctx.strokeStyle = '#B3A293';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-20, -10);
      ctx.quadraticCurveTo(w * 0.25, 45, w * 0.5, 30);
      ctx.stroke();

      // Sub-branches
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(w * 0.2, 35);
      ctx.quadraticCurveTo(w * 0.35, 75, w * 0.4, 110);
      ctx.stroke();
      ctx.restore();

      // Cluster of stationary leaves on branches
      for (let b = 0; b < 16; b++) {
        const bx = 30 + (b * 22) % (w * 0.45);
        const by = 20 + Math.sin(b * 1.5) * 35;
        ctx.save();
        ctx.translate(bx, by);
        ctx.rotate(Math.sin(tick * 0.02 + b) * 0.15);
        ctx.fillStyle = pastelColors[b % pastelColors.length];
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 8, b * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      tick++;

      // Spawn new leaf periodically
      if (tick % Math.max(18, Math.floor(65 / breezeLevel)) === 0 && leaves.length < 55) {
        leaves.push({
          x: Math.random() * (w * 0.55),
          y: 20 + Math.random() * 50,
          size: 14 + Math.random() * 12,
          vx: (0.4 + Math.random() * 0.9) * breezeLevel,
          vy: 0.7 + Math.random() * 0.8,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.03,
          color: pastelColors[Math.floor(Math.random() * pastelColors.length)],
          type: Math.floor(Math.random() * 3),
          grounded: false,
        });
      }

      // Update & Draw falling leaves
      const groundY = h - 25;
      leaves.forEach((l) => {
        if (!l.grounded) {
          l.x += l.vx + Math.sin(tick * 0.03 + l.y * 0.05) * (0.8 * breezeLevel);
          l.y += l.vy;
          l.rotation += l.vRot;

          if (l.y >= groundY + (Math.random() * 15 - 8)) {
            l.grounded = true;
            l.vy = 0;
            l.vx = 0;
            l.vRot = 0;
            setFallenCount((c) => c + 1);
          }
        }
        drawLeaf(l);
      });

      // Keep ground clean if too many leaves accumulate
      if (leaves.length > 50) {
        leaves = leaves.filter((l) => !l.grounded || Math.random() > 0.015);
      }

      // Soft grassy pastel floor
      ctx.fillStyle = '#C8DEC8';
      ctx.fillRect(0, groundY + 10, w, 25);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [activeMode, breezeLevel]);

  // ==========================================
  // MINI-GAME 2: Počítání fialových leknínů
  // ==========================================
  const generatePondItems = () => {
    const targetPurpleCount = 4 + Math.floor(Math.random() * 3); // 4 to 6 purple lilies
    const otherColors: Array<'blue' | 'pink' | 'white'> = ['blue', 'pink', 'white'];
    const otherHexMap = {
      blue: '#D4E6F6',
      pink: '#F6D9E3',
      white: '#F4F7F9',
    };

    const items: LilyItem[] = [];

    // Target purple lilies
    for (let i = 0; i < targetPurpleCount; i++) {
      items.push({
        id: i,
        x: 12 + Math.random() * 76,
        y: 15 + Math.random() * 70,
        size: 32 + Math.random() * 14,
        colorType: 'purple',
        colorHex: '#CDBBEA',
        isTarget: true,
        found: false,
      });
    }

    // Distractor lilies of other pastel colors
    for (let i = 0; i < 9; i++) {
      const cType = otherColors[i % otherColors.length];
      items.push({
        id: 100 + i,
        x: 10 + Math.random() * 80,
        y: 12 + Math.random() * 76,
        size: 28 + Math.random() * 12,
        colorType: cType,
        colorHex: otherHexMap[cType],
        isTarget: false,
        found: false,
      });
    }

    // Shuffle for natural placement
    return items.sort(() => Math.random() - 0.5);
  };

  const [lilyItems, setLilyItems] = useState<LilyItem[]>(generatePondItems);
  const totalTargetCount = lilyItems.filter((i) => i.isTarget).length;
  const foundTargetCount = lilyItems.filter((i) => i.isTarget && i.found).length;

  const handleLilyClick = (item: LilyItem) => {
    if (item.found) return;

    if (item.isTarget) {
      playChime(foundTargetCount);
      setLilyItems((prev) =>
        prev.map((it) => (it.id === item.id ? { ...it, found: true } : it))
      );
    } else {
      // Gentle soft chime without error harshness
      playBubblePop(1.5);
    }
  };

  const handleResetLilyGame = () => {
    playChime(0);
    setLilyItems(generatePondItems());
  };

  // ==========================================
  // MINI-GAME 3: Bublinkový pop-it
  // ==========================================
  const [bubbles, setBubbles] = useState<Array<{ id: number; popped: boolean; color: string }>>(() =>
    Array.from({ length: 30 }, (_, i) => {
      const colors = [
        'bg-[#CBE7D7] hover:bg-[#BCE0CB] border-[#A8D3BA] text-[#29563E]',
        'bg-[#D2E4F4] hover:bg-[#C2DCF0] border-[#B2D2EB] text-[#255276]',
        'bg-[#E6DBF5] hover:bg-[#DAC8EF] border-[#CBB3E7] text-[#553E74]',
      ];
      return { id: i, popped: false, color: colors[i % colors.length] };
    })
  );
  const [poppedCount, setPoppedCount] = useState(0);

  const handlePop = (id: number) => {
    setBubbles((prev) =>
      prev.map((b) => {
        if (b.id === id && !b.popped) {
          playBubblePop(0.9 + Math.random() * 0.4);
          setPoppedCount((c) => c + 1);
          return { ...b, popped: true };
        }
        return b;
      })
    );
  };

  // ==========================================
  // MINI-GAME 4: Zenové oblázky (Pojmenované kameny)
  // ==========================================
  const ALL_ZEN_STONES = [
    { id: 'st1', name: 'Základní křemenec', meaning: 'Zemská stabilita', width: 210, color: 'bg-[#C5DED0]', borderColor: 'border-[#A3C7B2]', textColor: 'text-[#244E38]' },
    { id: 'st2', name: 'Šalvějový říční kámen', meaning: 'Bylinný klid', width: 180, color: 'bg-[#C8E4D5]', borderColor: 'border-[#ABCFBD]', textColor: 'text-[#29543C]' },
    { id: 'st3', name: 'Chrpová břidlice', meaning: 'Jasná mysl', width: 155, color: 'bg-[#D2E4F2]', borderColor: 'border-[#AFCBE0]', textColor: 'text-[#224A68]' },
    { id: 'st4', name: 'Levandulový achát', meaning: 'Vnitřní pokoj', width: 130, color: 'bg-[#E3D9F2]', borderColor: 'border-[#C8BAE0]', textColor: 'text-[#4A3863]' },
    { id: 'st5', name: 'Mátový jadeit', meaning: 'Svěží dech', width: 110, color: 'bg-[#D3EBE0]', borderColor: 'border-[#B4DAC7]', textColor: 'text-[#2B5641]' },
    { id: 'st6', name: 'Ametystové pohlazení', meaning: 'Laskavost k sobě', width: 90, color: 'bg-[#EAE2F7]', borderColor: 'border-[#D2C5E8]', textColor: 'text-[#533E72]' },
    { id: 'st7', name: 'Vrcholový krystal', meaning: 'Čistá přítomnost', width: 70, color: 'bg-[#EAF3FA]', borderColor: 'border-[#CCE1F2]', textColor: 'text-[#285374]' },
  ];

  const [stackedStones, setStackedStones] = useState<typeof ALL_ZEN_STONES>([
    ALL_ZEN_STONES[0],
    ALL_ZEN_STONES[1],
    ALL_ZEN_STONES[2],
  ]);

  const addNextStone = (stone: typeof ALL_ZEN_STONES[0]) => {
    playStoneThud();
    setStackedStones((prev) => [...prev, stone]);
  };

  const removeTopStone = () => {
    if (stackedStones.length > 0) {
      playStoneThud();
      setStackedStones((prev) => prev.slice(0, -1));
    }
  };

  const resetAllStones = () => {
    playChime(0);
    setStackedStones([]);
  };

  // ==========================================
  // MINI-GAME 5: Skutečné puzzle (Drag & drop na prázdné plátno bez obrysů a čísel)
  // ==========================================
  type PuzzleTheme = 'cat' | 'forest' | 'whales';
  const [puzzleTheme, setPuzzleTheme] = useState<PuzzleTheme>('cat');
  // Starts completely blank: zero pieces placed ahead of time!
  const [placedPieces, setPlacedPieces] = useState<Record<number, boolean>>({});
  const [selectedPieceFromTray, setSelectedPieceFromTray] = useState<number | null>(null);
  const [draggedPiece, setDraggedPiece] = useState<{ id: number; x: number; y: number } | null>(null);
  const [showPuzzlePreview, setShowPuzzlePreview] = useState<boolean>(false);
  const [puzzleFeedback, setPuzzleFeedback] = useState<string | null>(null);
  const [puzzleMoveCount, setPuzzleMoveCount] = useState<number>(0);

  const boardRef = useRef<HTMLDivElement | null>(null);

  // Tab orientation matrix between columns (V_TABS) and rows (H_TABS)
  const V_TABS = useMemo(() => [
    [1, -1, 1],
    [-1, 1, -1],
  ], []);

  const H_TABS = useMemo(() => [
    [1, -1, 1],
    [-1, 1, -1],
  ], []);

  const getJigsawPath = useCallback((col: number, row: number) => {
    const x0 = col * 100;
    const y0 = row * 100;
    const x1 = x0 + 100;
    const y1 = y0 + 100;

    const topDir = row === 0 ? 0 : (H_TABS[row - 1][col] === 1 ? 1 : -1);
    const rightDir = col === 2 ? 0 : V_TABS[col][row];
    const bottomDir = row === 2 ? 0 : (H_TABS[row][col] === 1 ? 1 : -1);
    const leftDir = col === 0 ? 0 : (V_TABS[col - 1][row] === 1 ? 1 : -1);

    let path = `M ${x0} ${y0}`;

    // 1. TOP EDGE
    if (topDir === 0) {
      path += ` L ${x1} ${y0}`;
    } else {
      const depth = 16 * topDir;
      path += ` L ${x0 + 38} ${y0} ` +
        `C ${x0 + 38} ${y0 + depth * 0.25}, ${x0 + 42} ${y0 + depth * 0.65}, ${x0 + 44} ${y0 + depth} ` +
        `C ${x0 + 46} ${y0 + depth * 1.15}, ${x0 + 54} ${y0 + depth * 1.15}, ${x0 + 56} ${y0 + depth} ` +
        `C ${x0 + 58} ${y0 + depth * 0.65}, ${x0 + 62} ${y0 + depth * 0.25}, ${x0 + 62} ${y0} ` +
        `L ${x1} ${y0}`;
    }

    // 2. RIGHT EDGE
    if (rightDir === 0) {
      path += ` L ${x1} ${y1}`;
    } else {
      const depth = 16 * rightDir;
      path += ` L ${x1} ${y0 + 38} ` +
        `C ${x1 + depth * 0.25} ${y0 + 38}, ${x1 + depth * 0.65} ${y0 + 42}, ${x1 + depth} ${y0 + 44} ` +
        `C ${x1 + depth * 1.15} ${y0 + 46}, ${x1 + depth * 1.15} ${y0 + 54}, ${x1 + depth} ${y0 + 56} ` +
        `C ${x1 + depth * 0.65} ${y0 + 58}, ${x1 + depth * 0.25} ${y0 + 62}, ${x1} ${y0 + 62} ` +
        `L ${x1} ${y1}`;
    }

    // 3. BOTTOM EDGE
    if (bottomDir === 0) {
      path += ` L ${x0} ${y1}`;
    } else {
      const depth = 16 * bottomDir;
      path += ` L ${x0 + 62} ${y1} ` +
        `C ${x0 + 62} ${y1 + depth * 0.25}, ${x0 + 58} ${y1 + depth * 0.65}, ${x0 + 56} ${y1 + depth} ` +
        `C ${x0 + 54} ${y1 + depth * 1.15}, ${x0 + 46} ${y1 + depth * 1.15}, ${x0 + 44} ${y1 + depth} ` +
        `C ${x0 + 42} ${y1 + depth * 0.65}, ${x0 + 38} ${y1 + depth * 0.25}, ${x0 + 38} ${y1} ` +
        `L ${x0} ${y1}`;
    }

    // 4. LEFT EDGE
    if (leftDir === 0) {
      path += ` Z`;
    } else {
      const depth = 16 * leftDir;
      path += ` L ${x0} ${y0 + 62} ` +
        `C ${x0 + depth * 0.25} ${y0 + 62}, ${x0 + depth * 0.65} ${y0 + 58}, ${x0 + depth} ${y0 + 56} ` +
        `C ${x0 + depth * 1.15} ${y0 + 54}, ${x0 + depth * 1.15} ${y0 + 46}, ${x0 + depth} ${y0 + 44} ` +
        `C ${x0 + depth * 0.65} ${y0 + 42}, ${x0 + depth * 0.25} ${y0 + 38}, ${x0} ${y0 + 38} ` +
        `Z`;
    }

    return path;
  }, [H_TABS, V_TABS]);

  // Pointer drag listener on window for smooth touch and mouse dragging
  useEffect(() => {
    if (!draggedPiece) return;

    const onPointerMove = (e: PointerEvent) => {
      setDraggedPiece((prev) => (prev ? { ...prev, x: e.clientX, y: e.clientY } : null));
    };

    const onPointerUp = (e: PointerEvent) => {
      const currentPieceId = draggedPiece.id;
      setDraggedPiece(null);

      const boardEl = boardRef.current;
      if (!boardEl) return;

      const rect = boardEl.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!isInside) return;

      setPuzzleMoveCount((c) => c + 1);

      // Relative coordinates in 300x300 board space
      const relX = ((e.clientX - rect.left) / rect.width) * 300;
      const relY = ((e.clientY - rect.top) / rect.height) * 300;

      const col = currentPieceId % 3;
      const row = Math.floor(currentPieceId / 3);
      const targetCenterX = col * 100 + 50;
      const targetCenterY = row * 100 + 50;

      const dist = Math.hypot(relX - targetCenterX, relY - targetCenterY);

      // Magnetic snap radius
      if (dist <= 62) {
        setPlacedPieces((prev) => {
          const next = { ...prev, [currentPieceId]: true };
          const allDone = [0, 1, 2, 3, 4, 5, 6, 7, 8].every((id) => next[id]);
          if (allDone) {
            playChime(4);
            setPuzzleFeedback('Celý obraz je nádherně poskládaný! ✨');
          } else {
            playChime(3);
            setPuzzleFeedback('Dílek přesně zapadl na své místo!');
          }
          return next;
        });
        setSelectedPieceFromTray(null);
      } else {
        playStoneThud();
        setPuzzleFeedback('Tady tento dílek nesedí. Podívej se na rovné okraje a barvy motivu.');
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [draggedPiece]);

  // Pointer down on a loose piece to start dragging
  const handlePointerDownPiece = (e: React.PointerEvent, pieceId: number) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    setDraggedPiece({
      id: pieceId,
      x: e.clientX,
      y: e.clientY,
    });
    setSelectedPieceFromTray(pieceId);
    setPuzzleFeedback('Přetáhni dílek na plátno a pusť ho tam, kde podle tebe sedí.');
    playChime(1);
  };

  // Click on board to place selected piece (accessible fallback for click-to-place)
  const handleBoardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (selectedPieceFromTray === null) return;
    const boardEl = boardRef.current;
    if (!boardEl) return;

    const rect = boardEl.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * 300;
    const relY = ((e.clientY - rect.top) / rect.height) * 300;

    const col = selectedPieceFromTray % 3;
    const row = Math.floor(selectedPieceFromTray / 3);
    const targetCenterX = col * 100 + 50;
    const targetCenterY = row * 100 + 50;

    const dist = Math.hypot(relX - targetCenterX, relY - targetCenterY);
    setPuzzleMoveCount((c) => c + 1);

    if (dist <= 62) {
      const pieceId = selectedPieceFromTray;
      setPlacedPieces((prev) => {
        const next = { ...prev, [pieceId]: true };
        const allDone = [0, 1, 2, 3, 4, 5, 6, 7, 8].every((id) => next[id]);
        if (allDone) {
          playChime(4);
          setPuzzleFeedback('Celý obraz je nádherně poskládaný! ✨');
        } else {
          playChime(3);
          setPuzzleFeedback('Dílek přesně zapadl na své místo!');
        }
        return next;
      });
      setSelectedPieceFromTray(null);
    } else {
      playStoneThud();
      setPuzzleFeedback('Tady tento dílek nesedí. Zkus jiné místo na plátně.');
    }
  };

  // Remove already placed piece from board back to tray
  const handleRemovePlacedPiece = (e: React.MouseEvent, pieceId: number) => {
    e.stopPropagation();
    setPlacedPieces((prev) => {
      const next = { ...prev };
      delete next[pieceId];
      return next;
    });
    playStoneThud();
    setPuzzleFeedback('Dílek byl vrácen zpět do zásobníku.');
  };

  const handlePickPieceFromTray = (pieceId: number) => {
    if (selectedPieceFromTray === pieceId) {
      setSelectedPieceFromTray(null);
      setPuzzleFeedback(null);
    } else {
      setSelectedPieceFromTray(pieceId);
      setPuzzleFeedback('Dílek je vybrán. Můžeš ho přetáhnout nebo kliknout na plátno.');
      playChime(1);
    }
  };

  const handleAutoPlaceOne = () => {
    const unplaced = [0, 1, 2, 3, 4, 5, 6, 7, 8].find((id) => !placedPieces[id]);
    if (unplaced !== undefined) {
      setPlacedPieces((prev) => {
        const next = { ...prev, [unplaced]: true };
        const allDone = [0, 1, 2, 3, 4, 5, 6, 7, 8].every((id) => next[id]);
        if (allDone) {
          playChime(4);
          setPuzzleFeedback('Celý obraz je nádherně poskládaný! ✨');
        } else {
          playChime(3);
          setPuzzleFeedback('Dílek byl jemně usazen na plátno.');
        }
        return next;
      });
      setSelectedPieceFromTray(null);
    }
  };

  const handleAutoSolveAll = () => {
    const all: Record<number, boolean> = {};
    for (let i = 0; i < 9; i++) all[i] = true;
    setPlacedPieces(all);
    setSelectedPieceFromTray(null);
    setPuzzleFeedback('Celý obraz byl harmonicky složen. Vnímej pocit klidu. ✨');
    playChime(4);
  };

  const handleResetPuzzleToTray = () => {
    setPlacedPieces({});
    setSelectedPieceFromTray(null);
    setPuzzleMoveCount(0);
    setPuzzleFeedback('Plátno je prázdné. Přetáhni dílky ze zásobníku.');
    playChime(0);
  };

  const handleSelectTheme = (theme: PuzzleTheme) => {
    setPuzzleTheme(theme);
    setPlacedPieces({});
    setSelectedPieceFromTray(null);
    setPuzzleMoveCount(0);
    setPuzzleFeedback(`Vybrán nový motiv. Všechny dílky jsou připraveny v zásobníku.`);
    playChime(1);
  };

  const placedCount = useMemo(() => {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].filter((id) => placedPieces[id]).length;
  }, [placedPieces]);

  const isPuzzleCompleted = placedCount === 9;

  // ==========================================
  // MINI-GAME 6: Jemné pexeso (Paměťové karty pro uklidnění)
  // ==========================================
  interface PexesoCard {
    uid: number;
    pairId: number;
    title: string;
    sub: string;
    icon: string;
    colorBg: string;
    borderColor: string;
    textColor: string;
  }

  const PEXESO_BASE = useMemo<Omit<PexesoCard, 'uid'>[]>(() => [
    { pairId: 0, title: 'Kočička Míca', sub: 'Hřejivé předení', icon: '🐱', colorBg: 'bg-[#F5EDFB]', borderColor: 'border-[#DCBFEF]', textColor: 'text-[#50306E]' },
    { pairId: 1, title: 'Májový déšť', sub: 'Bubnování na parapet', icon: '🌧️', colorBg: 'bg-[#EDF5FB]', borderColor: 'border-[#BCD5EC]', textColor: 'text-[#255273]' },
    { pairId: 2, title: 'Tichá svíčka', sub: 'Praskání knotu', icon: '🕯️', colorBg: 'bg-[#FAF3E8]', borderColor: 'border-[#E7D0AE]', textColor: 'text-[#6C471E]' },
    { pairId: 3, title: 'Fialový leknín', sub: 'Klidná hladina', icon: '🪷', colorBg: 'bg-[#F3EBFB]', borderColor: 'border-[#D9C1F2]', textColor: 'text-[#533177]' },
    { pairId: 4, title: 'Zpěv velryb', sub: 'Hlubina oceánu', icon: '🐋', colorBg: 'bg-[#ECF7FA]', borderColor: 'border-[#B4DEE8]', textColor: 'text-[#1F5569]' },
    { pairId: 5, title: 'Lesní vánek', sub: 'Šumění v korunách', icon: '🍃', colorBg: 'bg-[#EEF7F1]', borderColor: 'border-[#B8DEC3]', textColor: 'text-[#235835]' },
  ], []);

  const generatePexesoDeck = useCallback((): PexesoCard[] => {
    const deck: PexesoCard[] = [];
    PEXESO_BASE.forEach((item) => {
      deck.push({ ...item, uid: item.pairId * 2 });
      deck.push({ ...item, uid: item.pairId * 2 + 1 });
    });
    return deck.sort(() => Math.random() - 0.5);
  }, [PEXESO_BASE]);

  const [pexesoDeck, setPexesoDeck] = useState<PexesoCard[]>(() => generatePexesoDeck());
  const [pexesoFlipped, setPexesoFlipped] = useState<number[]>([]);
  const [pexesoMatched, setPexesoMatched] = useState<number[]>([]);
  const [pexesoTurns, setPexesoTurns] = useState<number>(0);
  const [pexesoFeedback, setPexesoFeedback] = useState<string | null>(null);
  const [pexesoPeekAll, setPexesoPeekAll] = useState<boolean>(false);

  const handlePexesoCardClick = (cardIndex: number) => {
    if (pexesoPeekAll) return;
    if (pexesoFlipped.length >= 2) return;
    if (pexesoFlipped.includes(cardIndex)) return;

    const clickedCard = pexesoDeck[cardIndex];
    if (pexesoMatched.includes(clickedCard.pairId)) return;

    if (pexesoFlipped.length === 0) {
      setPexesoFlipped([cardIndex]);
      setPexesoFeedback(null);
      playChime(1);
    } else if (pexesoFlipped.length === 1) {
      const firstIndex = pexesoFlipped[0];
      const firstCard = pexesoDeck[firstIndex];
      const nextFlipped = [firstIndex, cardIndex];
      setPexesoFlipped(nextFlipped);
      setPexesoTurns((t) => t + 1);

      if (firstCard.pairId === clickedCard.pairId) {
        // Match found!
        const nextMatched = [...pexesoMatched, firstCard.pairId];
        setPexesoMatched(nextMatched);
        setPexesoFeedback(`Nalezen pár: ${clickedCard.title} ✨`);
        playChime(3);

        setTimeout(() => {
          setPexesoFlipped([]);
        }, 550);

        if (nextMatched.length === PEXESO_BASE.length) {
          setTimeout(() => {
            playChime(4);
            setPexesoFeedback('Všechny páry nalezeny! Tvá mysl je klidná a soustředěná. 🌸');
          }, 600);
        }
      } else {
        // No match
        playStoneThud();
        setTimeout(() => {
          setPexesoFlipped([]);
        }, 900);
      }
    }
  };

  const handleResetPexeso = () => {
    setPexesoDeck(generatePexesoDeck());
    setPexesoFlipped([]);
    setPexesoMatched([]);
    setPexesoTurns(0);
    setPexesoFeedback('Nové pexeso připraveno. Najdi 6 dvojic v klidu a bez spěchu.');
    playChime(0);
  };

  const handlePeekPexeso = () => {
    if (pexesoPeekAll) return;
    setPexesoPeekAll(true);
    playChime(2);
    setTimeout(() => {
      setPexesoPeekAll(false);
    }, 2000);
  };

  // ==========================================
  // MINI-GAME 7: Antistresový míček (Squishy mačkání)
  // ==========================================
  type StressBallTheme = 'lavender' | 'cat-paw' | 'cloud' | 'sparkle' | 'dough';
  type SquishResistance = 'marshmallow' | 'gel' | 'clay';

  interface FloatingSparkle {
    id: number;
    x: number;
    y: number;
    symbol: string;
    dx: number;
    dy: number;
  }

  const [stressBallTheme, setStressBallTheme] = useState<StressBallTheme>('lavender');
  const [squishResistance, setSquishResistance] = useState<SquishResistance>('gel');
  const [isSquishing, setIsSquishing] = useState<boolean>(false);
  const [squeezeCount, setSqueezeCount] = useState<number>(0);
  const [pressCoord, setPressCoord] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ballParticles, setBallParticles] = useState<FloatingSparkle[]>([]);
  const [breathPacing, setBreathPacing] = useState<boolean>(true);
  const [breathStep, setBreathStep] = useState<'inhale' | 'exhale'>('inhale');
  const ballContainerRef = useRef<HTMLDivElement | null>(null);

  // Breathing timer cycle for mindful squeeze
  useEffect(() => {
    if (activeMode !== 'stress-ball' || !breathPacing) return;
    const interval = setInterval(() => {
      setBreathStep((prev) => (prev === 'inhale' ? 'exhale' : 'inhale'));
    }, 4000);
    return () => clearInterval(interval);
  }, [activeMode, breathPacing]);

  // Clean up floating particles
  useEffect(() => {
    if (ballParticles.length === 0) return;
    const timer = setTimeout(() => {
      setBallParticles((prev) => prev.slice(1));
    }, 1100);
    return () => clearTimeout(timer);
  }, [ballParticles]);

  const getThemeSymbols = (theme: StressBallTheme): string[] => {
    switch (theme) {
      case 'cat-paw':
        return ['🐾', '💖', '✨', '🌸'];
      case 'cloud':
        return ['☁️', '💤', '✨', '🫧'];
      case 'sparkle':
        return ['✨', '💎', '🫧', '🌟'];
      case 'dough':
        return ['🌿', '🍃', '🌱', '✨'];
      default:
        return ['💜', '🌸', '✨', '🫧'];
    }
  };

  const handleBallPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    e.preventDefault();
    setIsSquishing(true);

    const el = ballContainerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (e.clientX - centerX) / (rect.width / 2);
      const offsetY = (e.clientY - centerY) / (rect.height / 2);
      setPressCoord({ x: Math.max(-1, Math.min(1, offsetX)), y: Math.max(-1, Math.min(1, offsetY)) });
    }

    const intensity = squishResistance === 'marshmallow' ? 1.3 : squishResistance === 'gel' ? 1.0 : 0.75;
    playSquishPress(intensity);

    const symbols = getThemeSymbols(stressBallTheme);
    const chosen = symbols[Math.floor(Math.random() * symbols.length)];
    const newSparkle: FloatingSparkle = {
      id: Date.now() + Math.random(),
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 50,
      symbol: chosen,
      dx: (Math.random() - 0.5) * 30,
      dy: -35 - Math.random() * 35,
    };
    setBallParticles((prev) => [...prev.slice(-7), newSparkle]);
  };

  const handleBallPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isSquishing) return;
    const el = ballContainerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const offsetX = (e.clientX - centerX) / (rect.width / 2);
      const offsetY = (e.clientY - centerY) / (rect.height / 2);
      setPressCoord({ x: Math.max(-1, Math.min(1, offsetX)), y: Math.max(-1, Math.min(1, offsetY)) });
    }
  };

  const handleBallPointerUp = () => {
    if (!isSquishing) return;
    setIsSquishing(false);
    playSquishRelease();
    setSqueezeCount((c) => c + 1);
  };

  const handleResetSqueezeCount = () => {
    setSqueezeCount(0);
    playChime(0);
  };

  const renderPuzzleScene = (theme: PuzzleTheme) => {
    if (theme === 'cat') {
      return (
        <svg viewBox="0 0 300 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="#EAE2F7" />
          <circle cx="45" cy="50" r="2.5" fill="#FFF8E7" opacity="0.9" />
          <circle cx="120" cy="35" r="2" fill="#FFF8E7" opacity="0.8" />
          <circle cx="240" cy="65" r="3" fill="#FFF8E7" opacity="0.85" />
          <circle cx="280" cy="110" r="2" fill="#FFF8E7" opacity="0.7" />
          <circle cx="70" cy="120" r="1.5" fill="#FFF8E7" opacity="0.6" />
          <path d="M 235 45 A 25 25 0 0 1 260 85 A 28 28 0 1 0 235 45 Z" fill="#FFF6D6" />
          <path d="M 30 180 C 30 90 270 90 270 180 L 270 290 L 30 290 Z" fill="#F4ECFB" opacity="0.75" />
          <ellipse cx="150" cy="225" rx="100" ry="42" fill="#E0D1F2" stroke="#CCAEE6" strokeWidth="3" />
          <ellipse cx="150" cy="210" rx="58" ry="32" fill="#FAF4EC" stroke="#DEC8B4" strokeWidth="2" />
          <path d="M 95 215 C 80 205 75 225 90 230 C 115 235 130 230 150 230" stroke="#E2C9B5" strokeWidth="8" strokeLinecap="round" fill="none" />
          <polygon points="175,185 186,165 198,182" fill="#FAF4EC" stroke="#DEC8B4" strokeWidth="1.5" />
          <polygon points="178,182 186,168 193,180" fill="#F3D1D9" />
          <polygon points="194,185 206,166 215,185" fill="#FAF4EC" stroke="#DEC8B4" strokeWidth="1.5" />
          <polygon points="197,183 206,170 211,183" fill="#F3D1D9" />
          <circle cx="195" cy="202" r="24" fill="#FAF4EC" stroke="#DEC8B4" strokeWidth="2" />
          <path d="M 188 204 Q 193 209 198 204" stroke="#876F5E" strokeWidth="2" strokeLinecap="round" />
          <path d="M 203 204 Q 208 209 213 204" stroke="#876F5E" strokeWidth="2" strokeLinecap="round" />
          <polygon points="200,210 204,210 202,213" fill="#E898AA" />
          <line x1="212" y1="209" x2="225" y2="208" stroke="#DEC8B4" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="212" y1="212" x2="224" y2="215" stroke="#DEC8B4" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="184" y1="209" x2="172" y2="208" stroke="#DEC8B4" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="184" y1="212" x2="173" y2="215" stroke="#DEC8B4" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 55 270 Q 70 220 65 190" stroke="#7E659E" strokeWidth="2" fill="none" />
          <circle cx="65" cy="190" r="4" fill="#B39AD6" />
          <circle cx="68" cy="198" r="4.5" fill="#C4ADE6" />
          <circle cx="62" cy="205" r="4.5" fill="#B39AD6" />
          <circle cx="67" cy="214" r="4" fill="#C4ADE6" />
        </svg>
      );
    }
    if (theme === 'forest') {
      return (
        <svg viewBox="0 0 300 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" fill="#E5F3EB" />
          <polygon points="40,0 80,0 200,300 120,300" fill="#FFFDE8" opacity="0.35" />
          <polygon points="140,0 180,0 280,300 230,300" fill="#FFFDE8" opacity="0.25" />
          <polygon points="50,40 20,110 80,110" fill="#C4DEC9" />
          <polygon points="120,30 85,120 155,120" fill="#B2D6BA" />
          <polygon points="250,50 220,120 280,120" fill="#C4DEC9" />
          <path d="M 0 140 Q 90 120 150 150 T 300 130 L 300 300 L 0 300 Z" fill="#D3EBD8" />
          <path d="M 120 140 C 130 180 70 210 100 260 C 120 285 180 295 240 300 L 300 300 L 300 220 C 230 200 210 160 160 140 Z" fill="#B6DDE8" />
          <path d="M 115 210 Q 140 200 165 215" stroke="#E3F4F9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 150 240 Q 180 235 210 250" stroke="#E3F4F9" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <ellipse cx="85" cy="240" rx="24" ry="16" fill="#D2C7B8" stroke="#B8AB9B" strokeWidth="1.5" />
          <path d="M 70 238 C 75 230 95 230 100 238" fill="#88B896" />
          <ellipse cx="230" cy="265" rx="32" ry="18" fill="#D5CBC0" stroke="#BCB0A4" strokeWidth="1.5" />
          <ellipse cx="145" cy="275" rx="16" ry="10" fill="#CEC1B3" />
          <circle cx="195" cy="225" r="14" fill="#88B693" />
          <path d="M 195 215 C 205 215 205 235 195 235 C 185 235 185 215 195 215 Z" fill="#E2CBE8" />
          <circle cx="195" cy="225" r="4" fill="#F5DF7E" />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 300 300" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="300" fill="#314261" />
        <circle cx="150" cy="0" r="220" fill="#4B638A" opacity="0.45" />
        <circle cx="150" cy="0" r="130" fill="#7899C4" opacity="0.35" />
        <polygon points="100,0 130,0 180,240 140,240" fill="#A8CEEA" opacity="0.15" />
        <polygon points="180,0 210,0 250,220 220,220" fill="#A8CEEA" opacity="0.12" />
        <path d="M 60 160 C 100 130 190 120 250 155 C 275 170 260 190 220 185 C 180 180 120 195 80 180 Z" fill="#E2F1F8" />
        <path d="M 120 178 C 160 182 200 175 220 170" stroke="#B8D5E5" strokeWidth="2.5" fill="none" />
        <path d="M 160 165 C 150 195 130 220 115 225 C 115 215 135 185 155 165 Z" fill="#D3E7F2" />
        <path d="M 65 160 C 45 145 25 140 20 148 C 25 158 45 165 55 165 C 45 170 25 178 20 188 C 28 192 48 180 65 175 Z" fill="#D3E7F2" />
        <circle cx="235" cy="158" r="2.5" fill="#3D4E68" />
        <circle cx="210" cy="120" r="5" stroke="#C8E8F5" strokeWidth="1.5" fill="#D8EFF8" opacity="0.75" />
        <circle cx="225" cy="95" r="7" stroke="#C8E8F5" strokeWidth="1.5" fill="#D8EFF8" opacity="0.7" />
        <circle cx="240" cy="70" r="4" stroke="#C8E8F5" strokeWidth="1.5" fill="#D8EFF8" opacity="0.8" />
        <circle cx="130" cy="100" r="3" stroke="#C8E8F5" strokeWidth="1" fill="#D8EFF8" opacity="0.6" />
      </svg>
    );
  };

  return (
    <section id="minihra" className="py-20 bg-white/30 border-t border-black/5 transition-colors duration-500">
      <div className="max-w-5xl mx-auto px-6">
        {/* Heading */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-semibold tracking-wider uppercase text-[#5F487D] mb-1.5 block">
            Hrací koutek klidu
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-[#2D223F] font-display mb-3 text-balance">
            Relaxační minihry pro zklidnění mysli
          </h2>
          <p className="text-sm sm:text-base text-[#616D7E] leading-relaxed">
            Vyber si aktivitu pro přesměrování pozornosti a ukotvení v přítomnosti. Žádný spěch, žádné hodnocení.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-white/70 border border-[#E2DBEC] rounded-2xl max-w-xl mx-auto mb-10 shadow-xs">
          <button
            onClick={() => setActiveMode('leaves')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'leaves'
                ? 'bg-[#E3D9F2] text-[#422C62] shadow-xs font-semibold'
                : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Padající listí</span>
          </button>
          <button
            onClick={() => setActiveMode('lily-count')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'lily-count'
                ? 'bg-[#CDE8D8] text-[#24523A] shadow-xs font-semibold'
                : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Počítání leknínů</span>
          </button>
          <button
            onClick={() => setActiveMode('bubbles')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'bubbles'
                ? 'bg-[#D4E6F6] text-[#234E72] shadow-xs font-semibold'
                : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bublinkový pop-it</span>
          </button>
          <button
            onClick={() => setActiveMode('stones')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'stones'
                ? 'bg-[#FAF0E4] text-[#63482C] shadow-xs font-semibold'
                : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Zenové oblázky</span>
          </button>
          <button
            onClick={() => setActiveMode('puzzle')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'puzzle'
                ? 'bg-[#EADFF7] text-[#442E64] shadow-xs font-semibold'
                : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            <Puzzle className="w-3.5 h-3.5" />
            <span>Klidné puzzle</span>
          </button>
          <button
            onClick={() => setActiveMode('pexeso')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'pexeso'
                ? 'bg-[#DCE8F7] text-[#20456C] shadow-xs font-semibold'
                : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Jemné pexeso</span>
          </button>
          <button
            onClick={() => setActiveMode('stress-ball')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'stress-ball'
                ? 'bg-[#FBE4ED] text-[#6E2B4B] shadow-xs font-semibold'
                : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5" />
            <span>Antistres míček</span>
          </button>
          <button
            onClick={() => setActiveMode('rain-window')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'rain-window'
                ? 'bg-[#E3EFFB] text-[#1E527D] shadow-xs font-semibold'
                : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Kapky na okně</span>
          </button>
          <button
            onClick={() => setActiveMode('water-ripples')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeMode === 'water-ripples'
                ? 'bg-[#DEF1E7] text-[#1B573B] shadow-xs font-semibold'
                : 'text-[#626A7A] hover:text-[#2D223F]'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Kruhy na vodě</span>
          </button>
        </div>

        {/* 1. PADÍCÍ LISTÍ ZE STROMŮ */}
        {activeMode === 'leaves' && (
          <div className="bg-white/90 border border-[#E4DEF0] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-[#F0EBF7] gap-3">
              <div>
                <h3 className="text-xl font-medium text-[#2E2342] font-display">
                  Sledování listí snášejícího se k zemi
                </h3>
                <p className="text-xs sm:text-sm text-[#727D8F] mt-0.5">
                  Nech své oči sledovat pomalou křivku dopadu každého lístku. Dopřej mysli tiché bezmyšlenkovité plynutí.
                </p>
              </div>

              {/* Breeze slider */}
              <div className="flex items-center gap-3 bg-[#FAF8FD] px-3.5 py-1.5 rounded-2xl border border-[#E7DFEF] text-xs text-[#5E4D76] shrink-0">
                <span>Síla vánku:</span>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.5"
                  value={breezeLevel}
                  onChange={(e) => setBreezeLevel(Number(e.target.value))}
                  className="w-20 accent-[#634E7D] cursor-pointer"
                />
              </div>
            </div>

            {/* Falling Leaves Canvas */}
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden border border-[#D5CADF] shadow-inner">
              <canvas ref={leavesCanvasRef} className="w-full h-full block" />
              <div className="absolute bottom-3 left-4 bg-white/80 backdrop-blur-xs px-3.5 py-1 rounded-full text-[11px] text-[#5A4870]">
                Spadlo lístků k odpočinku: <strong className="tabular-nums font-semibold">{fallenCount}</strong>
              </div>
            </div>
          </div>
        )}

        {/* 2. POČÍTÁNÍ FIALOVÝCH LEKNÍNŮ (Uzemnění pozornosti) */}
        {activeMode === 'lily-count' && (
          <div className="bg-white/90 border border-[#D8EADB] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-4 border-b border-[#E8F2EC] gap-4">
              <div>
                <h3 className="text-xl font-medium text-[#224433] font-display flex items-center gap-2">
                  <span>Spočítej a označ všechny fialové lekníny</span>
                  <span className="w-3.5 h-3.5 rounded-full bg-[#CDBBEA] border border-[#B09BCE] inline-block" />
                </h3>
                <p className="text-xs sm:text-sm text-[#627B6D] mt-0.5">
                  Uzemni svou mysl. Prozkoumej hladinu a klikni na každý fialový leknín, který spatříš.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="px-3.5 py-1.5 rounded-full bg-[#EBF5EE] border border-[#C5E4CF] text-xs font-semibold text-[#27593D]">
                  Nalezeno: <strong className="tabular-nums text-[#1F4932]">{foundTargetCount}</strong> / {totalTargetCount}
                </div>

                <button
                  onClick={handleResetLilyGame}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-[#D0E2D6] text-[#345C44] hover:bg-[#F2F7F4] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Nová hladina</span>
                </button>
              </div>
            </div>

            {/* Pond Game Surface */}
            <div className="relative w-full h-[380px] sm:h-[440px] rounded-2xl overflow-hidden border border-[#BFD9C7] bg-gradient-to-b from-[#D2E7DA] via-[#CFE3E7] to-[#C7DBEB] shadow-inner select-none">
              {/* Water shimmer effect */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/30 via-transparent to-transparent pointer-events-none" />

              {/* Water Lily Items */}
              {lilyItems.map((item) => {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLilyClick(item)}
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      width: `${item.size * 1.6}px`,
                      height: `${item.size * 1.6}px`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 transform group hover:scale-110 active:scale-95 ${
                      item.found ? 'opacity-100 scale-110' : 'opacity-90'
                    }`}
                    title={item.isTarget ? 'Fialový leknín' : 'Leknín jiné barvy'}
                  >
                    {/* Lily Pad Leaf underneath */}
                    <div className="absolute inset-0 rounded-full bg-[#7FB08A] border border-[#64946E] shadow-2xs rotate-45" />

                    {/* Flower Petals */}
                    <div
                      style={{ backgroundColor: item.colorHex }}
                      className="absolute inset-1.5 rounded-full border border-white/80 shadow-xs flex items-center justify-center transition-all"
                    >
                      {item.found && item.isTarget && (
                        <Check className="w-4 h-4 text-[#4E3768] animate-bounce" />
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Success celebration banner when all are found */}
              {foundTargetCount === totalTargetCount && totalTargetCount > 0 && (
                <div className="absolute inset-0 bg-[#2D223F]/40 backdrop-blur-2xs flex items-center justify-center p-6 animate-fadeIn">
                  <div className="bg-white/95 rounded-3xl p-6 sm:p-8 max-w-sm text-center shadow-lg border border-[#CBB7E6]">
                    <div className="w-12 h-12 rounded-full bg-[#E8DFF5] flex items-center justify-center mx-auto mb-3 text-[#5A4575]">
                      <Heart className="w-6 h-6 fill-[#E8DFF5]" />
                    </div>
                    <h4 className="text-xl font-medium text-[#2E2342] font-display mb-1.5">
                      Všechny nalezeny!
                    </h4>
                    <p className="text-xs sm:text-sm text-[#616D7E] mb-5">
                      Tvá pozornost se úspěšně ukotvila v přítomném okamžiku. Všechny {totalTargetCount} fialové lekníny rozkvetly.
                    </p>
                    <button
                      onClick={handleResetLilyGame}
                      className="px-5 py-2 rounded-full text-xs font-semibold bg-[#493563] text-white hover:bg-[#3D2C53] transition-colors cursor-pointer shadow-xs"
                    >
                      Nová klidná hladina
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. BUBLINKOVÝ POP-IT */}
        {activeMode === 'bubbles' && (
          <div className="bg-white/90 border border-[#E9E4F3] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#F0EBF7]">
              <div>
                <h3 className="text-xl font-medium text-[#2E2342] font-display">Praskání bublinek bez spěchu</h3>
                <p className="text-xs text-[#727D8F]">Každá bublinka vydá jemný harmonický tón a uvolní prostor.</p>
              </div>
              <div className="text-xs text-[#6A788A]">
                Prasknuto: <strong className="text-[#43305D] tabular-nums font-semibold">{poppedCount}</strong>
              </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 sm:gap-4 max-w-xl mx-auto py-4">
              {bubbles.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handlePop(b.id)}
                  disabled={b.popped}
                  className={`aspect-square rounded-2xl flex items-center justify-center border-2 transition-all duration-300 transform active:scale-90 cursor-pointer shadow-xs ${
                    b.popped
                      ? 'bg-transparent border-[#E3DEF0]/50 opacity-30 scale-75 cursor-default'
                      : `${b.color} hover:scale-105 active:scale-95`
                  }`}
                >
                  {b.popped ? (
                    <Check className="w-3.5 h-3.5 text-[#8878A3]" />
                  ) : (
                    <div className="w-2.5 h-2.5 rounded-full bg-white/70 shadow-xs pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. ZENOVÉ OBLÁZKY (Pojmenované) */}
        {activeMode === 'stones' && (
          <div className="bg-white/90 border border-[#E9E2D8] rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-[#F2ECE4] gap-4">
              <div>
                <h3 className="text-xl font-medium text-[#3D2E1E] font-display">Zenové kameny na sebe</h3>
                <p className="text-xs text-[#7B6E60]">Každý kámen nese svůj význam a stabilitu. Kliknutím na kámen v nabídce ho položíš na mohylu.</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {stackedStones.length > 0 && (
                  <button
                    onClick={removeTopStone}
                    className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#FAF5EE] border border-[#DECDBB] text-[#5C4530] hover:bg-[#F5ECE0] transition-colors cursor-pointer"
                  >
                    Odebrat vršek
                  </button>
                )}
                <button
                  onClick={resetAllStones}
                  className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#FAF5EE] border border-[#DECDBB] text-[#5C4530] hover:bg-[#F5ECE0] transition-colors cursor-pointer"
                >
                  Začít znovu
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
              {/* Altar Area with Stacked Stones */}
              <div className="md:col-span-7 min-h-[340px] bg-gradient-to-b from-[#FAF7F2] to-[#ECE3D6] rounded-2xl border border-[#DFD1C2] flex flex-col-reverse items-center justify-end p-6 shadow-inner relative overflow-hidden">
                <div className="absolute top-4 left-4 text-xs text-[#7A6B5C]">
                  Kamenů v mohyle: <strong className="font-semibold text-[#483928]">{stackedStones.length}</strong> / 7
                </div>

                <div className="w-64 h-4 rounded-full bg-[#D4C3B2] border border-[#BFAFA0] shadow-inner mb-2" />

                {/* Stones Stack */}
                {stackedStones.map((stone, idx) => (
                  <div
                    key={`${stone.id}-${idx}`}
                    style={{ width: `${stone.width}px` }}
                    onClick={removeTopStone}
                    className={`h-10 rounded-full ${stone.color} border ${stone.borderColor} shadow-xs my-[-3px] flex items-center justify-center transition-all duration-300 transform hover:scale-105 cursor-pointer z-10 animate-float-slow`}
                    title={`${stone.name} (${stone.meaning}) - Klikni pro odebrání`}
                  >
                    <span className={`text-[11px] font-semibold ${stone.textColor} select-none`}>
                      {stone.name}
                    </span>
                  </div>
                ))}

                {stackedStones.length === 0 && (
                  <div className="mb-14 text-center text-xs text-[#8F7F70] italic">
                    Vyber si kámen ze seznamu vpravo a začni stavět svou mohylu klidu.
                  </div>
                )}
              </div>

              {/* Palette of Available Named Stones */}
              <div className="md:col-span-5 flex flex-col gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#634E39] mb-1">
                  Kameny k položení na mohylu
                </span>

                {ALL_ZEN_STONES.map((stone) => {
                  const isAlreadyInStack = stackedStones.some((s) => s.id === stone.id);
                  return (
                    <button
                      key={stone.id}
                      onClick={() => addNextStone(stone)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all cursor-pointer ${stone.color} ${stone.borderColor} hover:scale-[1.01]`}
                    >
                      <div>
                        <div className={`text-xs font-semibold ${stone.textColor}`}>
                          {stone.name}
                        </div>
                        <div className="text-[10px] text-[#695646]">
                          {stone.meaning}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#5A4533] px-2 py-0.5 rounded-md bg-white/60">
                        {isAlreadyInStack ? '+ Další' : 'Položit +'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 5. SKUTEČNÉ ZENOVÉ PUZZLE */}
        {activeMode === 'puzzle' && (
          <div className="bg-white/90 border border-[#E4DEF0] rounded-3xl p-6 sm:p-8 shadow-sm">
            {/* Top Bar of Puzzle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-[#F0EBF7] gap-4">
              <div>
                <h3 className="text-xl font-medium text-[#2E2342] font-display">
                  Skládání skutečných dílků puzzle
                </h3>
                <p className="text-xs text-[#727D8F]">
                  Klikni na volný dílek v zásobníku dole a usaď ho na odpovídající místo na desce.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPuzzlePreview(!showPuzzlePreview)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    showPuzzlePreview
                      ? 'bg-[#E3D9F2] text-[#483366] border-[#CEBFDF]'
                      : 'bg-white border-[#E0D8ED] text-[#637083] hover:bg-[#FAF8FD]'
                  }`}
                  title="Zobrazit nebo skrýt náhled hotového obrazu"
                >
                  {showPuzzlePreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPuzzlePreview ? 'Skrýt předlohu' : 'Ukázat předlohu'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetPuzzleToTray}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-[#E0D8ED] text-[#637083] hover:bg-[#FAF8FD] transition-colors cursor-pointer"
                  title="Vrátit všechny dílky do zásobníku a začít znovu"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Do zásobníku</span>
                </button>

                <button
                  type="button"
                  onClick={handleAutoPlaceOne}
                  disabled={isPuzzleCompleted}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F5EFFB] border border-[#DDD0EE] text-[#553C73] hover:bg-[#EFE5FA] transition-colors cursor-pointer disabled:opacity-50"
                  title="Jemně posadit jeden chybějící dílek"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Složit 1 dílek</span>
                </button>

                <button
                  type="button"
                  onClick={handleAutoSolveAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF6EE] border border-[#ECDDC9] text-[#78542F] hover:bg-[#F5EDE1] transition-colors cursor-pointer"
                  title="Jemně poskládat celý obraz"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>Složit vše</span>
                </button>
              </div>
            </div>

            {/* Motif Selector */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-6 text-xs">
              <span className="text-[#7B8798] font-medium mr-1">Výběr motivu:</span>
              <button
                type="button"
                onClick={() => handleSelectTheme('cat')}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                  puzzleTheme === 'cat'
                    ? 'bg-[#EADFF7] border-[#CFBCE7] text-[#472E66] font-semibold shadow-2xs'
                    : 'bg-white border-[#E4DCF0] text-[#647184] hover:bg-[#FAF8FD]'
                }`}
              >
                🐱 Spící kočička Míca
              </button>

              <button
                type="button"
                onClick={() => handleSelectTheme('forest')}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                  puzzleTheme === 'forest'
                    ? 'bg-[#D7EFE1] border-[#B6DEC5] text-[#225237] font-semibold shadow-2xs'
                    : 'bg-white border-[#E4DCF0] text-[#647184] hover:bg-[#FAF8FD]'
                }`}
              >
                🌲 Lesní potůček a mech
              </button>

              <button
                type="button"
                onClick={() => handleSelectTheme('whales')}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                  puzzleTheme === 'whales'
                    ? 'bg-[#D7E8F7] border-[#B7D4EE] text-[#234E72] font-semibold shadow-2xs'
                    : 'bg-white border-[#E4DCF0] text-[#647184] hover:bg-[#FAF8FD]'
                }`}
              >
                🐋 Klidná velryba v moři
              </button>
            </div>

            {/* Active Feedback Bar */}
            {puzzleFeedback && (
              <div className="max-w-md mx-auto mb-6 px-4 py-2 rounded-2xl bg-[#F6F1FA] border border-[#E3D6F0] text-center text-xs font-medium text-[#50376F] animate-in fade-in duration-200">
                {puzzleFeedback}
              </div>
            )}

            {/* Floating piece while dragging */}
            {draggedPiece && (
              <div
                className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 scale-110 drop-shadow-xl"
                style={{
                  left: draggedPiece.x,
                  top: draggedPiece.y,
                  width: 90,
                  height: 90,
                }}
              >
                <svg
                  viewBox={`${(draggedPiece.id % 3) * 100 - 18} ${Math.floor(draggedPiece.id / 3) * 100 - 18} 136 136`}
                  className="w-full h-full"
                >
                  <defs>
                    <clipPath id={`floating-clip-${draggedPiece.id}-${puzzleTheme}`}>
                      <path d={getJigsawPath(draggedPiece.id % 3, Math.floor(draggedPiece.id / 3))} />
                    </clipPath>
                  </defs>
                  <g clipPath={`url(#floating-clip-${draggedPiece.id}-${puzzleTheme})`}>
                    {renderPuzzleScene(puzzleTheme)}
                  </g>
                  <path
                    d={getJigsawPath(draggedPiece.id % 3, Math.floor(draggedPiece.id / 3))}
                    fill="none"
                    stroke="#68429B"
                    strokeWidth="3"
                  />
                </svg>
              </div>
            )}

            {/* Board Area */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 py-2">
              {/* Optional Preview Box */}
              {showPuzzlePreview && (
                <div className="flex flex-col items-center animate-in fade-in duration-200">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#796F8E] mb-2">
                    Náhled předlohy
                  </span>
                  <div className="w-52 h-52 sm:w-60 sm:h-60 rounded-2xl overflow-hidden border-2 border-[#D5C6E6] shadow-md relative">
                    {renderPuzzleScene(puzzleTheme)}
                  </div>
                </div>
              )}

              {/* Puzzle Assembly Board (Čisté plátno bez obrysů a čísel) */}
              <div className="relative flex flex-col items-center">
                <div className="text-center mb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#796F8E]">
                    Skládací plátno (přetáhni dílek sem)
                  </span>
                </div>

                <div
                  ref={boardRef}
                  onClick={handleBoardClick}
                  className="relative w-[300px] sm:w-[360px] aspect-square rounded-3xl overflow-hidden border-4 border-[#DECDEE] bg-gradient-to-b from-[#FBF8FD] via-[#F6F0FB] to-[#F0E6F6] shadow-md p-2 cursor-default select-none"
                >
                  <svg viewBox="0 0 300 300" className="w-full h-full block">
                    {/* Blank canvas subtle watermark when empty */}
                    {placedCount === 0 && (
                      <g opacity="0.45" className="pointer-events-none select-none">
                        <text
                          x="150"
                          y="142"
                          textAnchor="middle"
                          fontSize="14"
                          fontWeight="600"
                          fill="#685382"
                        >
                          Prázdné plátno
                        </text>
                        <text
                          x="150"
                          y="166"
                          textAnchor="middle"
                          fontSize="11"
                          fill="#8876A2"
                        >
                          Přetáhni sem dílky myší nebo prstem
                        </text>
                      </g>
                    )}

                    {/* ONLY placed pieces that the user has successfully snapped onto the board */}
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((pieceId) => {
                      if (!placedPieces[pieceId]) return null;
                      const col = pieceId % 3;
                      const row = Math.floor(pieceId / 3);
                      const path = getJigsawPath(col, row);

                      return (
                        <g
                          key={`board-placed-${pieceId}`}
                          onClick={(e) => handleRemovePlacedPiece(e, pieceId)}
                          className="cursor-pointer group"
                        >
                          <defs>
                            <clipPath id={`board-placed-clip-${pieceId}-${puzzleTheme}`}>
                              <path d={path} />
                            </clipPath>
                          </defs>
                          <g clipPath={`url(#board-placed-clip-${pieceId}-${puzzleTheme})`}>
                            {renderPuzzleScene(puzzleTheme)}
                          </g>
                          <path
                            d={path}
                            fill="none"
                            stroke="#CDBAE5"
                            strokeWidth="1.5"
                            className="group-hover:stroke-[#805AA8] transition-colors"
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Completion celebration modal overlay */}
                {isPuzzleCompleted && (
                  <div className="absolute inset-0 bg-[#2C203F]/50 backdrop-blur-2xs rounded-3xl flex items-center justify-center p-6 animate-in fade-in duration-300 z-30">
                    <div className="bg-white/95 rounded-3xl p-6 sm:p-8 max-w-xs text-center shadow-xl border border-[#D5C6E6]">
                      <div className="w-12 h-12 rounded-full bg-[#EADFF7] text-[#553C73] flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h4 className="text-xl font-medium text-[#2E2143] font-display mb-1.5">
                        Krásně poskládáno!
                      </h4>
                      <p className="text-xs text-[#637183] leading-relaxed mb-4">
                        Všechny dílky do sebe dokonale zapadly na prázdném plátně. Tvá mysl nalezla klidné soustředění.
                      </p>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const themes: PuzzleTheme[] = ['cat', 'forest', 'whales'];
                            const next = themes[(themes.indexOf(puzzleTheme) + 1) % themes.length];
                            handleSelectTheme(next);
                          }}
                          className="w-full py-2 rounded-xl text-xs font-semibold bg-[#493563] text-white hover:bg-[#3D2C53] transition-colors cursor-pointer shadow-xs"
                        >
                          Další motiv
                        </button>
                        <button
                          type="button"
                          onClick={handleResetPuzzleToTray}
                          className="w-full py-2 rounded-xl text-xs font-medium bg-[#F7F2FA] hover:bg-[#EFE8F5] text-[#54406E] transition-colors cursor-pointer"
                        >
                          Složit znovu od začátku
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tray of Loose Jigsaw Pieces (Zásobník volných dílků bez čísel) */}
            <div className="mt-8 pt-6 border-t border-[#F0EBF7]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-[#3B2857] flex items-center gap-2">
                    <Puzzle className="w-4 h-4 text-[#6A4799]" />
                    <span>Zásobník volných dílků</span>
                    <span className="text-xs font-normal text-[#758292]">
                      ({9 - placedCount} {9 - placedCount === 1 ? 'dílek zbývá' : 9 - placedCount >= 2 && 9 - placedCount <= 4 ? 'dílky zbývají' : 'dílků zbývá'})
                    </span>
                  </h4>
                  <p className="text-xs text-[#717E90]">
                    Uchop dílek myší nebo prstem a přetáhni ho přímo na plátno.
                  </p>
                </div>

                {selectedPieceFromTray !== null && (
                  <div className="px-3 py-1 rounded-full bg-[#EADDF7] text-[#4F3175] text-xs font-semibold animate-pulse">
                    Vybrán dílek k přetažení
                  </div>
                )}
              </div>

              {/* Loose pieces list */}
              {9 - placedCount === 0 ? (
                <div className="py-8 text-center bg-[#FAF7FC] rounded-2xl border border-dashed border-[#DFD3ED] text-[#5A4575] text-xs font-medium">
                  🌸 Všechny dílky jsou usazeny na plátně v harmonii. Kliknutím na kterýkoliv dílek na plátně ho můžeš vrátit sem.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-9 gap-3 p-3 bg-gradient-to-b from-[#FBF9FD] to-[#F3ECF8] rounded-2xl border border-[#DFD2ED] shadow-inner select-none">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((pieceId) => {
                    if (placedPieces[pieceId]) return null;

                    const col = pieceId % 3;
                    const row = Math.floor(pieceId / 3);
                    const isSelected = selectedPieceFromTray === pieceId;
                    const isBeingDragged = draggedPiece?.id === pieceId;
                    const path = getJigsawPath(col, row);

                    return (
                      <div
                        key={`tray-piece-${pieceId}`}
                        onPointerDown={(e) => handlePointerDownPiece(e, pieceId)}
                        onClick={() => handlePickPieceFromTray(pieceId)}
                        className={`flex flex-col items-center justify-center p-2 rounded-2xl transition-all cursor-grab active:cursor-grabbing touch-none select-none ${
                          isBeingDragged
                            ? 'opacity-30 scale-95'
                            : isSelected
                            ? 'bg-[#E7D6F5] ring-3 ring-[#7B53A8] scale-105 shadow-md'
                            : 'bg-white/80 border border-[#E0D4EC] hover:bg-white hover:scale-105 shadow-2xs'
                        }`}
                        title="Přetáhni tento dílek na plátno"
                      >
                        <div className="w-16 h-16 sm:w-20 sm:h-20 relative pointer-events-none">
                          <svg
                            viewBox={`${col * 100 - 18} ${row * 100 - 18} 136 136`}
                            className="w-full h-full drop-shadow-xs"
                          >
                            <defs>
                              <clipPath id={`tray-piece-clip-${pieceId}-${puzzleTheme}`}>
                                <path d={path} />
                              </clipPath>
                            </defs>
                            <g clipPath={`url(#tray-piece-clip-${pieceId}-${puzzleTheme})`}>
                              {renderPuzzleScene(puzzleTheme)}
                            </g>
                            <path
                              d={path}
                              fill="none"
                              stroke={isSelected ? '#634493' : '#BCA4DB'}
                              strokeWidth={isSelected ? '3.5' : '2'}
                            />
                          </svg>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Status Counter */}
            <div className="mt-6 pt-4 border-t border-[#F0EBF7] flex flex-wrap items-center justify-center gap-6 text-xs text-[#6D7B8C]">
              <div>
                Umístěno: <strong className="text-[#432F5C] font-semibold">{placedCount}</strong> / 9 dílků
              </div>
              <div className="w-1 h-1 rounded-full bg-black/20" />
              <div>
                Zbývá v zásobníku: <strong className="text-[#432F5C] font-semibold">{9 - placedCount}</strong>
              </div>
              <div className="w-1 h-1 rounded-full bg-black/20" />
              <div>
                Počet tahů: <strong className="text-[#432F5C] font-semibold">{puzzleMoveCount}</strong>
              </div>
            </div>
          </div>
        )}

        {/* 6. JEMNÉ PEXESO (Uklidňující paměťové karty) */}
        {activeMode === 'pexeso' && (
          <div className="bg-white/90 border border-[#D5E3F5] rounded-3xl p-6 sm:p-8 shadow-sm">
            {/* Top Bar of Pexeso */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-[#EBF2FA] gap-4">
              <div>
                <h3 className="text-xl font-medium text-[#1E3B5C] font-display flex items-center gap-2">
                  <span>Jemné pexeso pro zklidnění</span>
                  <span className="text-sm">🌸</span>
                </h3>
                <p className="text-xs text-[#6B7F96]">
                  Otáčej karty a hledej stejné dvojice. Žádný časový limit, jen příjemné pastelové symboly a tichý relax.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handlePeekPexeso}
                  disabled={pexesoPeekAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-white border border-[#D0DFEF] text-[#34587E] hover:bg-[#F3F8FD] transition-colors cursor-pointer disabled:opacity-50"
                  title="Ukázat na 2 sekundy všechny karty pro uklidnění"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Krátký náhled (2 s)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetPexeso}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#EEF5FB] border border-[#C9DEEE] text-[#224A70] hover:bg-[#E5EFF8] transition-colors cursor-pointer"
                  title="Zamíchat karty a začít novou partii"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Zamíchat nové</span>
                </button>
              </div>
            </div>

            {/* Notification feedback */}
            {pexesoFeedback && (
              <div className="max-w-md mx-auto mb-6 px-4 py-2 rounded-2xl bg-[#EEF5FC] border border-[#CDE1F3] text-center text-xs font-medium text-[#20496E] animate-in fade-in duration-200">
                {pexesoFeedback}
              </div>
            )}

            {/* 4x3 Cards Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xl mx-auto">
              {pexesoDeck.map((card, index) => {
                const isFlipped = pexesoFlipped.includes(index);
                const isMatched = pexesoMatched.includes(card.pairId);
                const isOpen = isFlipped || isMatched || pexesoPeekAll;

                return (
                  <button
                    key={`pexeso-card-${card.uid}-${index}`}
                    type="button"
                    onClick={() => handlePexesoCardClick(index)}
                    disabled={isMatched || isFlipped || pexesoPeekAll}
                    className={`aspect-[4/5] rounded-2xl p-2 sm:p-3 relative transition-all duration-300 transform cursor-pointer ${
                      isOpen
                        ? `${card.colorBg} ${card.borderColor} border-2 shadow-sm scale-100`
                        : 'bg-gradient-to-br from-[#F5F1FA] via-[#EEF4FB] to-[#EDF6F2] border-2 border-[#D8D2E7] hover:border-[#BCAFD5] hover:scale-[1.03] shadow-xs active:scale-95'
                    }`}
                  >
                    {isOpen ? (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center animate-in zoom-in-95 duration-200">
                        <div className="text-2xl sm:text-3xl mb-1.5 filter drop-shadow-xs">
                          {card.icon}
                        </div>
                        <h5 className={`text-xs sm:text-sm font-semibold ${card.textColor} leading-tight`}>
                          {card.title}
                        </h5>
                        <p className="text-[10px] text-[#697E93] leading-tight mt-0.5 hidden sm:block">
                          {card.sub}
                        </p>

                        {isMatched && (
                          <div className="mt-1 flex items-center gap-1 text-[9px] font-semibold text-[#2E6B47] bg-[#E3F4EA] px-2 py-0.5 rounded-full">
                            <Check className="w-2.5 h-2.5" />
                            <span>Pár</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-xl border border-dashed border-[#D2C8E4] flex flex-col items-center justify-center text-[#82759E]/70 select-none">
                        <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center shadow-2xs">
                          <Sparkles className="w-4 h-4 text-[#7C6C9C]" />
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Victory banner */}
            {pexesoMatched.length === PEXESO_BASE.length && (
              <div className="mt-8 p-5 bg-[#EEF8F3] border border-[#BFDFCE] rounded-2xl max-w-md mx-auto text-center animate-in zoom-in-95 duration-300">
                <div className="w-10 h-10 rounded-full bg-[#D7EFE2] text-[#245E3B] flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-base font-semibold text-[#1F5435] mb-1 font-display">
                  Všechny páry byly jemně objeveny!
                </h4>
                <p className="text-xs text-[#527961] mb-3 leading-relaxed">
                  Trénink paměti v klidu uvolňuje napětí a vrací tělo i mysl do vyrovnaného stavu.
                </p>
                <button
                  type="button"
                  onClick={handleResetPexeso}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#2C6240] text-white hover:bg-[#235034] transition-colors cursor-pointer shadow-xs"
                >
                  Zahrát si znovu
                </button>
              </div>
            )}

            {/* Status Counter */}
            <div className="mt-6 pt-4 border-t border-[#E8F1FA] flex flex-wrap items-center justify-center gap-6 text-xs text-[#6B7F96]">
              <div>
                Nalezené páry: <strong className="text-[#1E3B5C] font-semibold">{pexesoMatched.length}</strong> / {PEXESO_BASE.length}
              </div>
              <div className="w-1 h-1 rounded-full bg-black/20" />
              <div>
                Počet pokusů: <strong className="text-[#1E3B5C] font-semibold">{pexesoTurns}</strong>
              </div>
            </div>
          </div>
        )}

        {/* 7. ANTISTRESOVÝ MAČKACÍ MÍČEK (Squishy relaxace) */}
        {activeMode === 'stress-ball' && (
          <div className="bg-white/90 border border-[#F2D7E3] rounded-3xl p-6 sm:p-8 shadow-sm">
            {/* Top Bar of Anti-stress */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 mb-6 border-b border-[#F7EAF0] gap-4">
              <div>
                <h3 className="text-xl font-medium text-[#52233C] font-display flex items-center gap-2">
                  <span>Antistresový mačkací míček</span>
                  <span className="text-base">🫧</span>
                </h3>
                <p className="text-xs text-[#7B6371]">
                  Stiskni a podrž pro uvolnění nahromaděného napětí v těle. Zmáčkni při nádechu, povol s pomalým výdechem.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBreathPacing(!breathPacing)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    breathPacing
                      ? 'bg-[#FBE4ED] text-[#71284E] border-[#F2BFD4]'
                      : 'bg-white border-[#E7D6DF] text-[#72646D] hover:bg-[#FAF5F7]'
                  }`}
                  title="Zapnout nebo vypnout nápovědu pro synchronizaci dechu se stiskem"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>{breathPacing ? 'Dechový průvodce: Zapnut' : 'Dechový průvodce: Vypnut'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetSqueezeCount}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#FAF3F6] border border-[#ECD9E3] text-[#6E3C56] hover:bg-[#F6E9F0] transition-colors cursor-pointer"
                  title="Vynulovat počet stisků"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Vynulovat</span>
                </button>
              </div>
            </div>

            {/* Toy & Material Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 text-xs">
              {/* Toy themes */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-[#846E7B] font-medium mr-1">Tvar:</span>
                <button
                  type="button"
                  onClick={() => {
                    setStressBallTheme('lavender');
                    playChime(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    stressBallTheme === 'lavender'
                      ? 'bg-[#EADFF7] border-[#CFBCE7] text-[#472E66] font-semibold shadow-2xs'
                      : 'bg-white border-[#E8DEE5] text-[#6F5F68] hover:bg-[#FAF6F8]'
                  }`}
                >
                  💜 Levandulový gel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStressBallTheme('cat-paw');
                    playChime(2);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    stressBallTheme === 'cat-paw'
                      ? 'bg-[#FBE2EB] border-[#F4BACD] text-[#6F2848] font-semibold shadow-2xs'
                      : 'bg-white border-[#E8DEE5] text-[#6F5F68] hover:bg-[#FAF6F8]'
                  }`}
                >
                  🐾 Kočičí tlapka
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStressBallTheme('cloud');
                    playChime(3);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    stressBallTheme === 'cloud'
                      ? 'bg-[#DDE9F8] border-[#BACEE9] text-[#244773] font-semibold shadow-2xs'
                      : 'bg-white border-[#E8DEE5] text-[#6F5F68] hover:bg-[#FAF6F8]'
                  }`}
                >
                  ☁️ Obláček
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStressBallTheme('sparkle');
                    playChime(4);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    stressBallTheme === 'sparkle'
                      ? 'bg-[#DCF3F5] border-[#B5E2E6] text-[#1F5458] font-semibold shadow-2xs'
                      : 'bg-white border-[#E8DEE5] text-[#6F5F68] hover:bg-[#FAF6F8]'
                  }`}
                >
                  🫧 Třpytky
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStressBallTheme('dough');
                    playChime(0);
                  }}
                  className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer font-medium ${
                    stressBallTheme === 'dough'
                      ? 'bg-[#D7EFE1] border-[#B6DEC5] text-[#225237] font-semibold shadow-2xs'
                      : 'bg-white border-[#E8DEE5] text-[#6F5F68] hover:bg-[#FAF6F8]'
                  }`}
                >
                  🌿 Šalvějové těsto
                </button>
              </div>

              {/* Firmness / Resistance */}
              <div className="flex items-center gap-1.5 bg-[#FAF4F7] px-3 py-1 rounded-2xl border border-[#EBDDE5] shrink-0">
                <span className="text-[#846E7B] font-medium mr-1">Měkkost:</span>
                <button
                  type="button"
                  onClick={() => setSquishResistance('marshmallow')}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] transition-all cursor-pointer ${
                    squishResistance === 'marshmallow'
                      ? 'bg-[#F1D2E1] text-[#642442] font-semibold shadow-2xs'
                      : 'text-[#7B6874] hover:text-[#451C30]'
                  }`}
                >
                  Pěna
                </button>
                <button
                  type="button"
                  onClick={() => setSquishResistance('gel')}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] transition-all cursor-pointer ${
                    squishResistance === 'gel'
                      ? 'bg-[#F1D2E1] text-[#642442] font-semibold shadow-2xs'
                      : 'text-[#7B6874] hover:text-[#451C30]'
                  }`}
                >
                  Gel
                </button>
                <button
                  type="button"
                  onClick={() => setSquishResistance('clay')}
                  className={`px-2.5 py-0.5 rounded-lg text-[11px] transition-all cursor-pointer ${
                    squishResistance === 'clay'
                      ? 'bg-[#F1D2E1] text-[#642442] font-semibold shadow-2xs'
                      : 'text-[#7B6874] hover:text-[#451C30]'
                  }`}
                >
                  Těsto
                </button>
              </div>
            </div>

            {/* Breathing Companion Bar */}
            {breathPacing && (
              <div className="max-w-md mx-auto mb-6 p-3 rounded-2xl bg-gradient-to-r from-[#FDF6FA] via-[#F8EFF6] to-[#FAF4FB] border border-[#F0DDE8] flex items-center justify-between text-xs animate-in fade-in duration-300">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-1000 ${
                      breathStep === 'inhale'
                        ? 'bg-[#DE8BAE] scale-125 shadow-xs ring-4 ring-[#F8DDE8]'
                        : 'bg-[#BFA7CC] scale-90'
                    }`}
                  />
                  <span className="text-[#593049] font-medium">
                    {breathStep === 'inhale'
                      ? 'Nadechni se nosem a pevně stiskni míček...'
                      : 'Pomalu vydechuj ústy a uvolňuj stisk míčku...'}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-white text-[#78395C] border border-[#ECD9E4]">
                  {breathStep === 'inhale' ? 'Nádech' : 'Výdech'}
                </span>
              </div>
            )}

            {/* SQUISHY BALL STAGE */}
            <div className="relative py-6 sm:py-8 flex flex-col items-center justify-center select-none overflow-hidden min-h-[320px]">
              {/* Floating particles from squish */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                {ballParticles.map((pt) => (
                  <span
                    key={pt.id}
                    className="absolute text-xl animate-out fade-out slide-out-to-top duration-1000 select-none filter drop-shadow-xs"
                    style={{
                      transform: `translate(${pt.x + pt.dx}px, ${pt.y + pt.dy}px)`,
                    }}
                  >
                    {pt.symbol}
                  </span>
                ))}
              </div>

              {/* Stress Ball Object Container */}
              <div
                ref={ballContainerRef}
                onPointerDown={handleBallPointerDown}
                onPointerMove={handleBallPointerMove}
                onPointerUp={handleBallPointerUp}
                onPointerLeave={handleBallPointerUp}
                className="relative cursor-pointer touch-none select-none flex items-center justify-center group"
                style={{
                  width: 250,
                  height: 250,
                }}
              >
                {/* Contact Shadow on Table/Mat */}
                <div
                  className="absolute bottom-2 rounded-full bg-[#522940]/10 filter blur-md transition-all duration-300"
                  style={{
                    width: isSquishing ? 260 : 200,
                    height: isSquishing ? 40 : 28,
                    transform: `translateX(${pressCoord.x * 8}px)`,
                  }}
                />

                {/* The Deformable Ball / Toy */}
                <div
                  className="w-52 h-52 sm:w-56 sm:h-56 rounded-full relative flex items-center justify-center select-none"
                  style={{
                    transform: isSquishing
                      ? `translate(${pressCoord.x * 12}px, ${pressCoord.y * 12}px) scale(${
                          squishResistance === 'marshmallow' ? 1.36 : squishResistance === 'gel' ? 1.26 : 1.18
                        }, ${
                          squishResistance === 'marshmallow' ? 0.66 : squishResistance === 'gel' ? 0.74 : 0.83
                        }) rotate(${pressCoord.x * 6}deg)`
                      : 'translate(0px, 0px) scale(1, 1)',
                    transition: isSquishing
                      ? 'transform 0.08s ease-out'
                      : squishResistance === 'clay'
                      ? 'transform 0.65s cubic-bezier(0.25, 1, 0.5, 1)'
                      : 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }}
                >
                  {/* THEME 1: LEVANDULOVÝ GELOVÝ MÍČEK */}
                  {stressBallTheme === 'lavender' && (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#E6DAF7] via-[#C9B3EC] to-[#9F82D3] shadow-lg border-2 border-[#E1D1F5] relative overflow-hidden flex items-center justify-center">
                      {/* Glossy highlight dome arc */}
                      <div className="absolute top-2 left-6 right-6 h-20 rounded-full bg-gradient-to-b from-white/70 to-transparent pointer-events-none" />
                      {/* Secondary soft reflection */}
                      <div className="absolute bottom-3 left-10 right-10 h-6 rounded-full bg-white/20 filter blur-xs pointer-events-none" />

                      {/* Sweet calm sleeping face */}
                      <div className="flex flex-col items-center justify-center pointer-events-none select-none z-10">
                        <div className="flex items-center gap-6 mb-2">
                          {/* Left sleepy curved eye */}
                          <div className="w-5 h-2.5 border-b-2 border-[#543875] rounded-full" />
                          {/* Right sleepy curved eye */}
                          <div className="w-5 h-2.5 border-b-2 border-[#543875] rounded-full" />
                        </div>
                        {/* Smile */}
                        <div className="w-3.5 h-2 border-b-2 border-[#543875] rounded-full" />
                        {/* Rosy cheeks */}
                        <div className="flex items-center justify-between w-20 -mt-2">
                          <div className="w-3.5 h-2 rounded-full bg-[#E597B8]/40 filter blur-2xs" />
                          <div className="w-3.5 h-2 rounded-full bg-[#E597B8]/40 filter blur-2xs" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* THEME 2: KOČIČÍ TLAPKA */}
                  {stressBallTheme === 'cat-paw' && (
                    <div className="w-full h-full rounded-[48%] bg-gradient-to-br from-[#FFF8F1] via-[#FBF0E6] to-[#F3DFD1] shadow-lg border-2 border-[#F6E5D7] relative p-3 flex flex-col items-center justify-center">
                      {/* 4 squishy toe beans */}
                      <div className="flex items-center gap-2.5 mb-2 -mt-2 z-10 pointer-events-none">
                        <div
                          className="w-6 h-7 rounded-full bg-gradient-to-b from-[#F9C3D3] to-[#F1A2BA] shadow-2xs border border-[#F8D2DE] transition-transform"
                          style={{ transform: isSquishing ? 'scale(0.85, 0.8)' : 'scale(1, 1)' }}
                        />
                        <div
                          className="w-7 h-8 rounded-full bg-gradient-to-b from-[#F9C3D3] to-[#F1A2BA] shadow-2xs border border-[#F8D2DE] -mt-1.5 transition-transform"
                          style={{ transform: isSquishing ? 'scale(0.85, 0.8)' : 'scale(1, 1)' }}
                        />
                        <div
                          className="w-7 h-8 rounded-full bg-gradient-to-b from-[#F9C3D3] to-[#F1A2BA] shadow-2xs border border-[#F8D2DE] -mt-1.5 transition-transform"
                          style={{ transform: isSquishing ? 'scale(0.85, 0.8)' : 'scale(1, 1)' }}
                        />
                        <div
                          className="w-6 h-7 rounded-full bg-gradient-to-b from-[#F9C3D3] to-[#F1A2BA] shadow-2xs border border-[#F8D2DE] transition-transform"
                          style={{ transform: isSquishing ? 'scale(0.85, 0.8)' : 'scale(1, 1)' }}
                        />
                      </div>

                      {/* Main central paw pad (heart-shaped) */}
                      <div
                        className="w-20 h-16 rounded-[40%_40%_50%_50%] bg-gradient-to-b from-[#F9C3D3] to-[#EF9EB7] shadow-inner border border-[#F8D2DE] relative z-10 transition-transform"
                        style={{ transform: isSquishing ? 'scale(0.88, 0.8)' : 'scale(1, 1)' }}
                      >
                        <div className="w-6 h-2 rounded-full bg-white/40 absolute top-2 left-4" />
                      </div>
                    </div>
                  )}

                  {/* THEME 3: NADÝCHANÝ OBLÁČEK */}
                  {stressBallTheme === 'cloud' && (
                    <div className="w-full h-full rounded-[45%_55%_50%_50%] bg-gradient-to-br from-[#FFFFFF] via-[#EEF5FD] to-[#D5E6FA] shadow-lg border-2 border-[#E1EDFC] relative flex items-center justify-center p-3">
                      {/* Cloud bubbles */}
                      <div className="absolute -top-3 left-10 w-16 h-16 rounded-full bg-[#FFFFFF]/90 filter blur-xs pointer-events-none" />
                      <div className="absolute -top-2 right-10 w-16 h-16 rounded-full bg-[#FFFFFF]/90 filter blur-xs pointer-events-none" />

                      {/* Sleepy sweet face */}
                      <div className="flex flex-col items-center justify-center pointer-events-none z-10">
                        <div className="flex items-center gap-7 mb-2">
                          <span className="text-[#3F5A82] text-sm font-semibold tracking-widest">( -</span>
                          <span className="text-[#3F5A82] text-sm font-semibold tracking-widest">- )</span>
                        </div>
                        <div className="w-4 h-2 border-b-2 border-[#3F5A82] rounded-full" />
                        <div className="flex items-center justify-between w-24 -mt-1.5">
                          <div className="w-4 h-2 rounded-full bg-[#F3B3C8]/50 filter blur-2xs" />
                          <div className="w-4 h-2 rounded-full bg-[#F3B3C8]/50 filter blur-2xs" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* THEME 4: TŘPYTIVÝ MÍČEK */}
                  {stressBallTheme === 'sparkle' && (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-[#E6F8F9] via-[#C9EFF2] to-[#86D4DC] shadow-lg border-2 border-[#E0F5F7] relative overflow-hidden flex items-center justify-center">
                      <div className="absolute top-2 left-6 right-6 h-20 rounded-full bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />

                      {/* Internal floating glitter specks */}
                      <div className="absolute inset-4 rounded-full pointer-events-none">
                        <div className="absolute top-6 left-10 w-3 h-3 rounded-full bg-white/90 shadow-xs animate-pulse" />
                        <div className="absolute top-14 right-8 w-4 h-4 rounded-full bg-[#FBF0B5]/80 filter blur-2xs" />
                        <div className="absolute bottom-10 left-12 w-3.5 h-3.5 rounded-full bg-[#F6CEE1]/80" />
                        <div className="absolute bottom-8 right-12 w-2.5 h-2.5 rounded-full bg-white/90" />
                        <div className="absolute top-20 left-20 w-5 h-5 rounded-full bg-[#D4C3F3]/60 filter blur-2xs" />
                      </div>

                      <div className="text-2xl filter drop-shadow-xs z-10 pointer-events-none">
                        ✨
                      </div>
                    </div>
                  )}

                  {/* THEME 5: ŠALVĚJOVÉ TĚSTO */}
                  {stressBallTheme === 'dough' && (
                    <div className="w-full h-full rounded-[48%_52%_47%_53%] bg-gradient-to-br from-[#E6F3EB] via-[#CDE8D7] to-[#A8D3B8] shadow-lg border-2 border-[#DCF0E3] relative flex items-center justify-center p-4">
                      {/* Indentation crease */}
                      <div className="absolute inset-4 rounded-full border border-black/5 pointer-events-none" />

                      {/* Embossed botanical leaf */}
                      <div className="flex flex-col items-center pointer-events-none z-10 opacity-75">
                        <span className="text-3xl filter drop-shadow-xs">🌿</span>
                        <span className="text-[10px] font-semibold tracking-wider uppercase text-[#29563C] mt-1">
                          Bylinný klid
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gentle tactile prompt */}
              <p className="text-xs text-[#897380] mt-3 font-medium text-center">
                {isSquishing
                  ? 'Výborně... Drž stisk a vnímej uvolnění v těle.'
                  : 'Klikni nebo klepni a drž pro promáčknutí míčku.'}
              </p>
            </div>

            {/* Somatic Milestones & Counter Bar */}
            <div className="mt-4 pt-4 border-t border-[#F7EAF0] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7B6774]">
              {/* Relaxation guidance based on count */}
              <div className="text-center sm:text-left">
                <span className="text-[#642D4B] font-semibold">Tělesná úleva: </span>
                <span>
                  {squeezeCount === 0
                    ? 'Chyť míček a stiskni ho. Drž stisknuto jak dlouho potřebuješ.'
                    : squeezeCount <= 5
                    ? 'S každým stisknutím odchází kousek nahromaděného napětí z dlaní i ramen.'
                    : squeezeCount <= 15
                    ? 'Všímej si, jak postupně povolují čelist, krk i sevřený dech.'
                    : squeezeCount <= 30
                    ? 'Tělo nachází svůj přirozený, klidný a uvolněný rytmus.'
                    : 'Hluboké uzemnění. Vnímej pocit lehkosti v celém těle.'}
                </span>
              </div>

              {/* Squeeze Counter */}
              <div className="flex items-center gap-2 bg-[#FBF2F6] px-3.5 py-1.5 rounded-full border border-[#EED9E4] shrink-0 font-medium">
                <span>Uvolňujících stisků:</span>
                <strong className="text-[#65294A] font-bold text-sm tabular-nums">
                  {squeezeCount}×
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* 8. ZÁVOD KAPEK NA OKNĚ (JEN POZOROVAT) */}
        {activeMode === 'rain-window' && (
          <div className="bg-white/90 border border-[#DEE7F0] rounded-3xl p-6 sm:p-8 shadow-sm">
            <RainWindowRace />
          </div>
        )}

        {/* 9. KAPKY DOPADAJÍCÍ NA HLADINU & KRUHY NA VODĚ (JEN POZOROVAT) */}
        {activeMode === 'water-ripples' && (
          <div className="bg-white/90 border border-[#D5E5DE] rounded-3xl p-6 sm:p-8 shadow-sm">
            <WaterRipplesZen />
          </div>
        )}
      </div>
    </section>
  );
};
