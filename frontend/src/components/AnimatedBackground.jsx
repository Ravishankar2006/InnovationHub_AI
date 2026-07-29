import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse positions
    const mouse = { x: null, y: null, targetX: null, targetY: null, radius: 160 };

    // Particle definitions
    const particles = [];
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    
    // Golden Colors
    const colors = [
      'rgba(212, 175, 55, 0.15)', // Royal Gold
      'rgba(255, 217, 90, 0.12)', // Amber Gold
      'rgba(255, 255, 255, 0.05)', // White Gold
      'rgba(212, 175, 55, 0.08)'
    ];

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.25;
        this.vy = (Math.random() - 0.5) * 0.25;
        this.radius = Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.originalAlpha = Math.random() * 0.5 + 0.1;
        this.alpha = this.originalAlpha;
        this.pulseSpeed = Math.random() * 0.02 + 0.005;
        this.pulseDir = Math.random() > 0.5 ? 1 : -1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce borders
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Gentle breathing alpha
        this.alpha += this.pulseSpeed * this.pulseDir;
        if (this.alpha > 0.6 || this.alpha < 0.05) {
          this.pulseDir *= -1;
        }

        // Mouse interaction (react to hover)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            // Push gently away
            this.x += (dx / dist) * force * 0.6;
            this.y += (dy / dist) * force * 0.6;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace(/0\.\d+/, this.alpha.toFixed(2));
        ctx.shadowBlur = this.radius * 2;
        ctx.shadowColor = '#D4AF37';
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Slow Moving Blobs
    const blobs = [
      { x: width * 0.25, y: height * 0.3, tx: width * 0.25, ty: height * 0.3, r: Math.min(width, height) * 0.4, color: 'rgba(212, 175, 55, 0.025)' },
      { x: width * 0.75, y: height * 0.7, tx: width * 0.75, ty: height * 0.7, r: Math.min(width, height) * 0.5, color: 'rgba(255, 217, 90, 0.015)' },
      { x: width * 0.5, y: height * 0.1, tx: width * 0.5, ty: height * 0.1, r: Math.min(width, height) * 0.35, color: 'rgba(212, 175, 55, 0.018)' }
    ];

    const updateBlobs = () => {
      blobs.forEach((blob) => {
        // Move towards target
        blob.x += (blob.tx - blob.x) * 0.005;
        blob.y += (blob.ty - blob.y) * 0.005;

        // If close to target, choose new target
        if (Math.abs(blob.x - blob.tx) < 10 && Math.abs(blob.y - blob.ty) < 10) {
          blob.tx = Math.random() * width;
          blob.ty = Math.random() * height;
        }

        // Mouse pull on blobs
        if (mouse.x !== null && mouse.y !== null) {
          blob.x += (mouse.x - blob.x) * 0.001;
          blob.y += (mouse.y - blob.y) * 0.001;
        }
      });
    };

    const drawBlobs = () => {
      blobs.forEach((blob) => {
        const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
        grad.addColorStop(0, blob.color);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    // Draw neural network lines
    const drawConnections = () => {
      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.08 * Math.min(p1.alpha, p2.alpha);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing blobs
      updateBlobs();
      drawBlobs();

      // 2. Draw neural mesh
      drawConnections();

      // 3. Draw & update particles
      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      particles.length = 0;
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const handleMouseMove = (e) => {
      // Smooth interpolation for mouse movements
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Start animation loop
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 bg-[#070707]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
