"use client";

import { useEffect, useRef, useCallback } from "react";
import "./ElectricBorder.css";

interface ElectricBorderProps {
  children: React.ReactNode;
  color?: string;
  speed?: number;
  chaos?: number;
  borderRadius?: number;
  className?: string;
  style?: React.CSSProperties;
}

// ── noise ────────────────────────────────────────────────────────────

function random(x: number): number {
  return (Math.sin(x * 12.9898) * 43758.5453) % 1;
}

function noise2D(x: number, y: number): number {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;
  const a = random(i + j * 57);
  const b = random(i + 1 + j * 57);
  const c = random(i + (j + 1) * 57);
  const d = random(i + 1 + (j + 1) * 57);
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  return a * (1 - ux) * (1 - uy) + b * ux * (1 - uy) + c * (1 - ux) * uy + d * ux * uy;
}

function octavedNoise(
  x: number, octaves: number, lacunarity: number, gain: number,
  baseAmplitude: number, baseFrequency: number, time: number,
  seed: number, baseFlatness: number,
): number {
  let y = 0;
  let amplitude = baseAmplitude;
  let frequency = baseFrequency;
  for (let i = 0; i < octaves; i++) {
    let octaveAmplitude = amplitude;
    if (i === 0) octaveAmplitude *= baseFlatness;
    y += octaveAmplitude * noise2D(frequency * x + seed * 100, time * frequency * 0.3);
    frequency *= lacunarity;
    amplitude *= gain;
  }
  return y;
}

// ── geometry ─────────────────────────────────────────────────────────

function cornerPoint(
  cx: number, cy: number, r: number,
  startAngle: number, arcLength: number, progress: number,
) {
  const a = startAngle + progress * arcLength;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function roundedRectPoint(
  t: number, L: number, T: number, W: number, H: number, R: number,
): { x: number; y: number } {
  const sw = W - 2 * R;
  const sh = H - 2 * R;
  const ca = (Math.PI * R) / 2;
  const total = 2 * sw + 2 * sh + 4 * ca;
  const d = t * total;
  let acc = 0;

  if (d <= acc + sw) return { x: L + R + (d - acc), y: T };
  acc += sw;
  if (d <= acc + ca) return cornerPoint(L + W - R, T + R, R, -Math.PI / 2, Math.PI / 2, (d - acc) / ca);
  acc += ca;
  if (d <= acc + sh) return { x: L + W, y: T + R + (d - acc) };
  acc += sh;
  if (d <= acc + ca) return cornerPoint(L + W - R, T + H - R, R, 0, Math.PI / 2, (d - acc) / ca);
  acc += ca;
  if (d <= acc + sw) return { x: L + W - R - (d - acc), y: T + H };
  acc += sw;
  if (d <= acc + ca) return cornerPoint(L + R, T + H - R, R, Math.PI / 2, Math.PI / 2, (d - acc) / ca);
  acc += ca;
  if (d <= acc + sh) return { x: L, y: T + H - R - (d - acc) };
  acc += sh;
  return cornerPoint(L + R, T + R, R, Math.PI, Math.PI / 2, (d - acc) / ca);
}

// ── lerp helper ──────────────────────────────────────────────────────

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ── component ────────────────────────────────────────────────────────

export default function ElectricBorder({
  children,
  color = "#6366f1",
  speed = 1,
  chaos = 0.12,
  borderRadius = 24,
  className = "",
  style,
}: ElectricBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef(0);
  const timeRef = useRef(0);
  const lastFrameRef = useRef(0);
  // 平滑过渡 — 0 = 光滑曲线, 1 = 全量扭曲
  const hoverRef = useRef(0);

  const draw = useCallback((now: number) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const borderOffset = 60;
    const displacement = 60;

    const rect = container.getBoundingClientRect();
    const w = rect.width + borderOffset * 2;
    const h = rect.height + borderOffset * 2;

    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const dt = Math.min((now - lastFrameRef.current) / 1000, 0.1);
    timeRef.current += dt * speed;
    lastFrameRef.current = now;

    // 鼠标悬停 → hoverRef 趋近 1；离开 → 趋近 0
    const target = container.dataset.hovering === "true" ? 1 : 0;
    const lerpSpeed = 4; // 过渡速度
    hoverRef.current = lerp(hoverRef.current, target, Math.min(dt * lerpSpeed, 1));
    const hh = hoverRef.current; // 0..1

    // 当前混沌强度
    const currentChaos = chaos * hh;

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // 平滑曲线始终画（不管 hover 不 hover），透明度随 hover 变化
    // idle = 微弱静态, hover = 亮色跳动
    const baseAlpha = 0.3 + hh * 0.7;
    ctx.strokeStyle = color;
    ctx.globalAlpha = baseAlpha;

    const L = borderOffset;
    const T = borderOffset;
    const bw = w - 2 * borderOffset;
    const bh = h - 2 * borderOffset;
    const maxR = Math.min(bw, bh) / 2;
    const r = Math.min(borderRadius, maxR);
    const perimeter = 2 * (bw + bh) + 2 * Math.PI * r;
    const steps = Math.floor(perimeter / 2);
    const octaves = 6;
    const lacunarity = 1.6;
    const gain = 0.7;
    const freq = 10;

    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const pt = roundedRectPoint(t, L, T, bw, bh, r);
      // 扭曲幅度随 hoverRef 变化：idle=0（纯圆角矩），hover=满 chaos
      const xn = octavedNoise(t * 8, octaves, lacunarity, gain, currentChaos, freq, timeRef.current, 0, 0);
      const yn = octavedNoise(t * 8, octaves, lacunarity, gain, currentChaos, freq, timeRef.current, 1, 0);
      const dx = pt.x + xn * displacement * hh;
      const dy = pt.y + yn * displacement * hh;
      if (i === 0) ctx.moveTo(dx, dy);
      else ctx.lineTo(dx, dy);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1;

    animRef.current = requestAnimationFrame(draw);
  }, [color, speed, chaos, borderRadius]);

  useEffect(() => {
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [draw]);

  // ── hover tracking ─────────────────────────────────────────────────

  const onEnter = useCallback(() => {
    if (containerRef.current) containerRef.current.dataset.hovering = "true";
  }, []);
  const onLeave = useCallback(() => {
    if (containerRef.current) containerRef.current.dataset.hovering = "false";
  }, []);

  const vars = {
    "--electric-border-color": color,
    borderRadius,
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className={`electric-border${className ? ` ${className}` : ""}`}
      style={{ ...vars, ...style }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      data-hovering="false"
    >
      <div className="eb-canvas-container">
        <canvas ref={canvasRef} className="eb-canvas" />
      </div>
      <div className="eb-layers">
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className="eb-content">{children}</div>
    </div>
  );
}
