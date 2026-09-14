"use client";

import { useEffect, useRef } from "react";

/** 奶油纸底上的轻雾光斑，贴合插画站而非赛博暗场 */
export function AmbientCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Mote = { x: number; y: number; r: number; vx: number; vy: number; a: number };
    let motes: Mote[] = [];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.floor((w * h) / 36000);
      motes = Array.from({ length: Math.max(18, Math.min(n, 48)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.8 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -0.04 - Math.random() * 0.12,
        a: 0.12 + Math.random() * 0.28,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const t = performance.now() * 0.00012;

      // 粉彩 / 雾蓝漂移光
      const gx = w * (0.25 + Math.sin(t) * 0.08);
      const gy = h * (0.2 + Math.cos(t * 0.7) * 0.06);
      const g1 = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(w, h) * 0.4);
      g1.addColorStop(0, "rgba(228,184,180,0.16)");
      g1.addColorStop(1, "rgba(228,184,180,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const hx = w * (0.75 + Math.cos(t * 1.1) * 0.05);
      const hy = h * (0.7 + Math.sin(t) * 0.06);
      const g2 = ctx.createRadialGradient(hx, hy, 0, hx, hy, Math.max(w, h) * 0.35);
      g2.addColorStop(0, "rgba(168,192,212,0.14)");
      g2.addColorStop(1, "rgba(168,192,212,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      for (const m of motes) {
        m.x += m.vx;
        m.y += m.vy;
        if (m.y < -4) m.y = h + 4;
        if (m.x < -4) m.x = w + 4;
        if (m.x > w + 4) m.x = -4;
        ctx.beginPath();
        ctx.fillStyle = `rgba(91,106,138,${m.a * 0.35})`;
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="ambient-canvas pointer-events-none fixed inset-0 z-0" />;
}
