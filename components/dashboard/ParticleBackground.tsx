'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  phase: number;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const particles: Particle[] = [];

    function init() {
      w = canvas!.width = canvas!.parentElement!.offsetWidth;
      h = canvas!.height = canvas!.parentElement!.offsetHeight;
      particles.length = 0;
      for (let i = 0; i < 40; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: 1 + Math.random() * 2,
          opacity: 0.2 + Math.random() * 0.4,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      const t = Date.now() / 1000;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const alpha = p.opacity * (0.5 + 0.5 * Math.sin(t * 0.8 + p.phase));
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(201,168,76,${alpha})`;
        ctx!.fill();
      }
      animRef.current = requestAnimationFrame(draw);
    }

    function onResize() {
      init();
    }

    init();
    animRef.current = requestAnimationFrame(draw);
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
}
