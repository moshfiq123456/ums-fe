"use client";
import { useEffect, useRef } from "react";

export function DynamicParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // create a non-null alias so closures see a definite non-null context
    const ctx2: CanvasRenderingContext2D = ctx;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    type Particle = { x: number; y: number; vx: number; vy: number; radius: number };

    const particles: Particle[] = [];
    const numParticles = 60;

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        radius: Math.random() * 4 + 2,
      });
    }

    function draw() {
      ctx2.clearRect(0, 0, width, height);

      // Draw particles
      particles.forEach((p) => {
        ctx2.beginPath();
        ctx2.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx2.fillStyle = "rgba(56,189,248,0.8)";
        ctx2.fill();
      });

      // Draw lines
      for (let i = 0; i < numParticles; i++) {
        for (let j = i + 1; j < numParticles; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            ctx2.strokeStyle = `rgba(56,189,248,${1 - dist / 160})`;
            ctx2.lineWidth = 1.2;
            ctx2.beginPath();
            ctx2.moveTo(particles[i].x, particles[i].y);
            ctx2.lineTo(particles[j].x, particles[j].y);
            ctx2.stroke();
          }
        }
      }

      // Update positions
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
      });

      requestAnimationFrame(draw);
    }

    draw();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
}
