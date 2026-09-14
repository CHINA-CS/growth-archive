"use client";

import { useEffect, useRef } from "react";

type TrailDot = {
  x: number;
  y: number;
  r: number;
  life: number;
};

/**
 * 自定义光标 + 拖尾粒子。
 * 跟手：主点几乎即时，外环略滞后（有「跟手感」但不迟钝）。
 */
export function SiteCursor() {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;

    const ring = ringRef.current;
    const dot = dotRef.current;
    const canvas = canvasRef.current;
    if (!ring || !dot || !canvas) return;

    document.body.classList.add("has-cursor");

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let rx = x;
    let ry = y;
    let dx = x;
    let dy = y;
    let raf = 0;
    let trail: TrailDot[] = [];
    let hover = false;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      // 拖尾：按位移密度吐点
      const last = trail[trail.length - 1];
      const dist = last ? Math.hypot(x - last.x, y - last.y) : 99;
      if (dist > 6) {
        trail.push({
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          r: 1.2 + Math.random() * 2.2,
          life: 1,
        });
        if (trail.length > 28) trail.shift();
      }
      ring.classList.remove("is-hidden");
      dot.classList.remove("is-hidden");
    };

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null;
      if (!t) return;
      hover = Boolean(t.closest("a,button,input,select,textarea,label,[data-cursor]"));
      ring.classList.toggle("is-hover", hover);
      dot.classList.toggle("is-hover", hover);
    };

    const leave = () => {
      ring.classList.add("is-hidden");
      dot.classList.add("is-hidden");
    };

    const loop = () => {
      // 点：很跟手（~0.55），环：略拖尾（~0.28）——有跟手感但不肉
      dx += (x - dx) * 0.55;
      dy += (y - dy) * 0.55;
      rx += (x - rx) * 0.28;
      ry += (y - ry) * 0.28;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;

      if (ctx) {
        ctx.clearRect(0, 0, w, h);
        trail = trail.filter((p) => p.life > 0.02);
        for (const p of trail) {
          p.life *= 0.88;
          p.r *= 0.98;
          ctx.beginPath();
          ctx.fillStyle = `rgba(91,106,138,${0.35 * p.life})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      raf = requestAnimationFrame(loop);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    document.addEventListener("mouseleave", leave);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.removeEventListener("mouseleave", leave);
      document.body.classList.remove("has-cursor");
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} aria-hidden className="cursor-trail pointer-events-none fixed inset-0 z-[9998]" />
      <div ref={ringRef} className="site-cursor-ring" aria-hidden>
        <span className="site-cursor-label">Enter</span>
      </div>
      <div ref={dotRef} className="site-cursor-dot" aria-hidden />
    </>
  );
}
