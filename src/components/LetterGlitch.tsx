"use client";

import { useRef, useEffect } from "react";

// ── helpers ──────────────────────────────────────────────────────────

const hexToRgb = (hex: string) => {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const num = parseInt(v, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
};

const interpolateColor = (
  s: { r: number; g: number; b: number },
  e: { r: number; g: number; b: number },
  t: number,
) =>
  `rgb(${Math.round(s.r + (e.r - s.r) * t)}, ${Math.round(s.g + (e.g - s.g) * t)}, ${Math.round(s.b + (e.b - s.b) * t)})`;

const FALLOFF = {
  linear: (t: number) => t,
  smooth: (t: number) => t * t * (3 - 2 * t),
  sharp: (t: number) => t * t * t,
};

interface Letter {
  char: string;
  color: string;
  targetColor: string;
  colorProgress: number;
  brightness: number;
  lastTouched: number;
}

interface Pulse {
  x: number;
  y: number;
  t0: number; // performance.now()
}

interface LetterGlitchProps {
  glitchColors?: string[];
  glitchSpeed?: number;
  smooth?: boolean;
  characters?: string;
  className?: string;
  mouseRadius?: number;
  falloff?: "linear" | "smooth" | "sharp";
  holdTime?: number;
  fadeDuration?: number;
  /** 点击时发出扩散脉冲波纹 */
  clickPulse?: boolean;
  /** 脉冲扩散速度 (px/s) */
  pulseSpeed?: number;
}

export default function LetterGlitch({
  glitchColors = ["#6366f1", "#818cf8", "#22d3ee"],
  className = "",
  glitchSpeed = 50,
  smooth = true,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*()-_+=/[]{};:<>.,",
  mouseRadius = 150,
  falloff = "smooth",
  holdTime = 300,
  fadeDuration = 800,
  clickPulse = true,
  pulseSpeed = 700,
}: LetterGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lettersRef = useRef<Letter[]>([]);
  const gridRef = useRef({ columns: 0, rows: 0 });
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const pulsesRef = useRef<Pulse[]>([]);
  const runningRef = useRef(false);
  const lastFrameRef = useRef(0);
  const propsRef = useRef({
    glitchSpeed,
    smooth,
    mouseRadius,
    glitchColors,
    falloff,
    holdTime,
    fadeDuration,
    clickPulse,
    pulseSpeed,
  });
  propsRef.current = {
    glitchSpeed,
    smooth,
    mouseRadius,
    glitchColors,
    falloff,
    holdTime,
    fadeDuration,
    clickPulse,
    pulseSpeed,
  };

  const sym = Array.from(characters);

  const fontSize = 16;
  const cw = 10; // char cell width
  const ch = 20; // char cell height

  // ── helpers ────────────────────────────────────────────────────────

  const randomChar = () => sym[(Math.random() * sym.length) | 0];

  const randomColor = () => {
    const cols = propsRef.current.glitchColors;
    return cols[(Math.random() * cols.length) | 0];
  };

  const cellCenter = (i: number): [number, number] => {
    const cols = gridRef.current.columns;
    return [(i % cols) * cw + cw / 2, Math.floor(i / cols) * ch + ch / 2];
  };

  // ── build ──────────────────────────────────────────────────────────

  const build = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctxRef.current?.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cols = Math.ceil(rect.width / cw);
    const rows = Math.ceil(rect.height / ch);
    gridRef.current = { columns: cols, rows: rows };
    lettersRef.current = Array.from({ length: cols * rows }, () => ({
      char: randomChar(),
      color: randomColor(),
      targetColor: randomColor(),
      colorProgress: 1,
      brightness: 0,
      lastTouched: 0,
    }));
  };

  // ── energize ───────────────────────────────────────────────────────

  const energize = (mx: number, my: number) => {
    const p = propsRef.current;
    const r = Math.max(p.mouseRadius, 1);
    const ease = FALLOFF[p.falloff] ?? FALLOFF.linear;
    const now = performance.now();
    const items = lettersRef.current;
    const { columns: cols } = gridRef.current;
    if (!items.length) return;

    const minCol = Math.max(0, Math.floor((mx - r) / cw));
    const maxCol = Math.min(cols - 1, Math.ceil((mx + r) / cw));
    const minRow = Math.max(0, Math.floor((my - r) / ch));
    const maxRow = Math.min(
      gridRef.current.rows - 1,
      Math.ceil((my + r) / ch),
    );

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const i = row * cols + col;
        if (i < 0 || i >= items.length) continue;
        const [cx, cy] = cellCenter(i);
        const dist = Math.hypot(cx - mx, cy - my);
        if (dist > r) continue;
        const level = ease(1 - dist / r);
        if (level > items[i].brightness) {
          items[i].brightness = level;
        }
        items[i].lastTouched = now;
      }
    }
  };

  // ── click pulse ────────────────────────────────────────────────────

  const energizeRing = (
    cx: number,
    cy: number,
    ringR: number,
    band: number,
    now: number,
  ) => {
    const items = lettersRef.current;
    const { columns: cols } = gridRef.current;
    if (!items.length) return;

    const minCol = Math.max(0, Math.floor((cx - ringR - band) / cw));
    const maxCol = Math.min(cols - 1, Math.ceil((cx + ringR + band) / cw));
    const minRow = Math.max(0, Math.floor((cy - ringR - band) / ch));
    const maxRow = Math.min(
      gridRef.current.rows - 1,
      Math.ceil((cy + ringR + band) / ch),
    );

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        const i = row * cols + col;
        if (i < 0 || i >= items.length) continue;
        const [lx, ly] = cellCenter(i);
        const dist = Math.hypot(lx - cx, ly - cy);
        if (Math.abs(dist - ringR) < band / 2) {
          items[i].brightness = 1;
          items[i].lastTouched = now;
        }
      }
    }
  };

  // ── glitch ─────────────────────────────────────────────────────────

  const glitchLetters = () => {
    const items = lettersRef.current;
    if (!items.length) return;

    const visible: number[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].brightness > 0.01) visible.push(i);
    }

    const count = Math.max(3, Math.min(80, Math.floor(Math.max(visible.length, 1) * 0.08)));

    for (let k = 0; k < count; k++) {
      let i: number;
      if (Math.random() < 0.7 && visible.length > 0) {
        i = visible[(Math.random() * visible.length) | 0];
      } else {
        i = (Math.random() * items.length) | 0;
      }

      const letter = items[i];
      if (!letter) continue;

      letter.char = randomChar();
      letter.targetColor = randomColor();

      if (!propsRef.current.smooth) {
        letter.color = letter.targetColor;
        letter.colorProgress = 1;
      } else {
        letter.colorProgress = 0;
      }
    }
  };

  // ── draw ───────────────────────────────────────────────────────────

  const drawLetters = () => {
    const ctx = ctxRef.current;
    const items = lettersRef.current;
    if (!ctx || !items.length) return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();

    ctx.clearRect(0, 0, rect.width, rect.height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = "top";

    const cols = gridRef.current.columns;

    for (let i = 0; i < items.length; i++) {
      const letter = items[i];
      if (letter.brightness < 0.01) continue;

      const x = (i % cols) * cw;
      const y = Math.floor(i / cols) * ch;

      ctx.globalAlpha = letter.brightness;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    }
    ctx.globalAlpha = 1;
  };

  // ── main loop ──────────────────────────────────────────────────────

  const tick = (now: number) => {
    const p = propsRef.current;
    const dt = Math.min(now - lastFrameRef.current, 50);
    lastFrameRef.current = now;

    const items = lettersRef.current;

    // ── click pulse rings ──────────────────────────────────────────

    const pulses = pulsesRef.current;
    const canvas = canvasRef.current;
    const band = ch; // ring thickness ≈ one letter row
    const w = canvas ? canvas.getBoundingClientRect().width : 0;
    const h = canvas ? canvas.getBoundingClientRect().height : 0;

    for (let pi = pulses.length - 1; pi >= 0; pi--) {
      const pulse = pulses[pi];
      const age = (now - pulse.t0) / 1000;
      const ringR = age * p.pulseSpeed;
      if (ringR > Math.hypot(w, h)) {
        pulses.splice(pi, 1);
        continue;
      }
      energizeRing(pulse.x, pulse.y, ringR, band, now);
    }

    // ── fade out ───────────────────────────────────────────────────

    let anyVisible = pulses.length > 0;
    const fadeStep = dt / Math.max(p.fadeDuration, 16);

    for (let i = 0; i < items.length; i++) {
      const letter = items[i];
      if (letter.brightness <= 0) continue;
      if (now - letter.lastTouched > p.holdTime) {
        letter.brightness = Math.max(0, letter.brightness - fadeStep);
      }
      if (letter.brightness > 0.01) anyVisible = true;
    }

    // ── smooth color transitions ───────────────────────────────────

    if (p.smooth) {
      for (let i = 0; i < items.length; i++) {
        const letter = items[i];
        if (letter.colorProgress < 1 && letter.brightness > 0.01) {
          letter.colorProgress += 0.05;
          if (letter.colorProgress > 1) letter.colorProgress = 1;
          const s = hexToRgb(letter.color);
          const e = hexToRgb(letter.targetColor);
          letter.color = interpolateColor(s, e, letter.colorProgress);
          anyVisible = true;
        }
      }
    }

    if (anyVisible) {
      drawLetters();
      rafRef.current = requestAnimationFrame(tick);
    } else {
      runningRef.current = false;
    }
  };

  const wake = () => {
    if (runningRef.current) return;
    runningRef.current = true;
    lastFrameRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  };

  // ── setup ──────────────────────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext("2d");
    build();

    const inBounds = (cx: number, cy: number) => {
      const c = canvasRef.current;
      if (!c) return false;
      const r = c.getBoundingClientRect();
      return cx >= r.left && cx <= r.right && cy >= r.top && cy <= r.bottom;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!canvasRef.current) return;
      if (!inBounds(e.clientX, e.clientY)) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      mouseRef.current = { x: mx, y: my };
      energize(mx, my);
      wake();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (!propsRef.current.clickPulse) return;
      if (!canvasRef.current) return;
      if (!inBounds(e.clientX, e.clientY)) return;
      const rect = canvasRef.current.getBoundingClientRect();
      pulsesRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        t0: performance.now(),
      });
      wake();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        cancelAnimationFrame(rafRef.current);
        runningRef.current = false;
        build();
        wake();
      }, 100);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Timer-based glitch
  useEffect(() => {
    const interval = setInterval(() => glitchLetters(), glitchSpeed);
    return () => clearInterval(interval);
  }, [glitchSpeed]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
