import React, { useEffect, useRef } from 'react';

interface RadialPolarPlotProps {
  activeMetric?: string;
}

export const RadialPolarPlot: React.FC<RadialPolarPlotProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number = 0;
    let rotation = 0;

    // Generate clusters of points in 4 sectors
    const sectors = [
      { name: 'amber', color: '#f59e0b', dotColor: '#fbbf24', startAngle: -Math.PI * 0.95, endAngle: -Math.PI * 0.55 },
      { name: 'purple', color: '#a855f7', dotColor: '#c084fc', startAngle: -Math.PI * 0.45, endAngle: -Math.PI * 0.05 },
      { name: 'teal', color: '#06b6d4', dotColor: '#22d3ee', startAngle: Math.PI * 0.55, endAngle: Math.PI * 0.95 },
      { name: 'blue', color: '#3b82f6', dotColor: '#60a5fa', startAngle: Math.PI * 0.05, endAngle: Math.PI * 0.45 },
    ];

    // Seed points per sector
    const points: Array<{ r: number; theta: number; color: string; size: number }> = [];
    sectors.forEach((sec) => {
      const count = 180;
      for (let i = 0; i < count; i++) {
        // Quantize radius into concentric bands
        const band = 50 + Math.floor(Math.pow(Math.random(), 0.8) * 160);
        const theta = sec.startAngle + Math.random() * (sec.endAngle - sec.startAngle);
        points.push({
          r: band,
          theta: theta,
          color: sec.dotColor,
          size: 1.5 + Math.random() * 2.2,
        });
      }
    });

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw concentric guide circles
      const rings = [35, 60, 90, 120, 150, 180, 210, 235];
      rings.forEach((r, idx) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = idx === rings.length - 1 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = idx === rings.length - 1 ? 1.5 : 1;
        ctx.stroke();
      });

      // Outer neon ring boundary
      ctx.beginPath();
      ctx.arc(cx, cy, 242, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Outer dashed track
      ctx.beginPath();
      ctx.arc(cx, cy, 252, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 6]);
      ctx.stroke();
      ctx.setLineDash([]);

      // 2. Draw vertical and horizontal axis crosshairs
      ctx.beginPath();
      ctx.moveTo(cx, cy - 250);
      ctx.lineTo(cx, cy + 250);
      ctx.moveTo(cx - 250, cy);
      ctx.lineTo(cx + 250, cy);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 3. Draw tick labels along vertical axis (10, 20, 30 ... 100)
      ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
      ctx.font = '8px monospace';
      ctx.textAlign = 'center';
      for (let i = 1; i <= 9; i++) {
        const val = i * 10;
        const tickY = cy + (i * 22);
        ctx.fillText(String(val), cx - 12, tickY + 3);
        // tiny tick mark
        ctx.beginPath();
        ctx.moveTo(cx - 3, tickY);
        ctx.lineTo(cx + 3, tickY);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.stroke();
      }

      // 4. Draw Radial filament lines for each sector
      sectors.forEach((sec) => {
        const rayCount = 14;
        for (let i = 0; i <= rayCount; i++) {
          const angle = sec.startAngle + (i / rayCount) * (sec.endAngle - sec.startAngle);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(angle) * 35, cy + Math.sin(angle) * 35);
          ctx.lineTo(cx + Math.cos(angle) * 225, cy + Math.sin(angle) * 225);
          ctx.strokeStyle = `${sec.color}18`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // 5. Draw Scatter Points
      points.forEach((p) => {
        const x = cx + Math.cos(p.theta) * p.r;
        const y = cy + Math.sin(p.theta) * p.r;

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 4;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // 6. Draw Glowing Center Iris Aperture
      const gradient = ctx.createRadialGradient(cx, cy, 5, cx, cy, 32);
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.3, '#f8fafc');
      gradient.addColorStop(0.7, '#e2e8f0');
      gradient.addColorStop(1, '#090b0e');

      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();

      // Outer Iris border ring
      ctx.beginPath();
      ctx.arc(cx, cy, 33, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(cx, cy, 36, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();

      rotation += 0.001;
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-hidden">
      {/* Top Circuit Bus Traces (Cybernetic PCB lines) */}
      <svg
        className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-70"
        width="340"
        height="100"
        viewBox="0 0 340 100"
        fill="none"
      >
        <path d="M40 0 V40 H140 V100" stroke="#00e5ff" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M50 0 V30 H150 V100" stroke="#00e5ff" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M60 0 V20 H160 V100" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M300 0 V40 H200 V100" stroke="#00e5ff" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M290 0 V30 H190 V100" stroke="#00e5ff" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M280 0 V20 H180 V100" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" />
      </svg>

      {/* Main Polar Canvas */}
      <canvas
        ref={canvasRef}
        width={560}
        height={560}
        className="w-[520px] h-[520px] max-w-full aspect-square"
      />

      {/* Bottom Circuit Bus Traces */}
      <svg
        className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none opacity-70"
        width="340"
        height="100"
        viewBox="0 0 340 100"
        fill="none"
      >
        <path d="M140 0 V60 H40 V100" stroke="#00e5ff" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M150 0 V70 H50 V100" stroke="#00e5ff" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M160 0 V80 H60 V100" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M200 0 V60 H300 V100" stroke="#00e5ff" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M190 0 V70 H290 V100" stroke="#00e5ff" strokeWidth="1" strokeDasharray="3 3" />
        <path d="M180 0 V80 H280 V100" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" />
      </svg>
    </div>
  );
};
