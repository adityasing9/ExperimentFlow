import React from 'react';

interface ConvergenceSplinePlotProps {
  currentIteration?: number;
  metricName?: string;
  bestScore?: number;
}

export const ConvergenceSplinePlot: React.FC<ConvergenceSplinePlotProps> = ({
  currentIteration = 24,
  metricName = 'Precision',
  bestScore = 0.982,
}) => {
  return (
    <div className="h-full w-full flex flex-col justify-between p-3.5 select-none font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
            Trajectory Optimization Frontier
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 font-bold border border-white/10">
            Experiment {currentIteration}
          </span>
        </div>
        <span className="text-[10px] text-emerald-400 font-medium">CONVERGENCE: 98.2%</span>
      </div>

      {/* SVG Canvas Multi-curve Plot */}
      <div className="relative w-full h-44 mt-1 flex items-end">
        {/* Vertical Striping Bands (1 day, 2 days, 3 days, 4 days) */}
        <div className="absolute inset-0 flex">
          <div className="flex-1 border-r border-white/5 bg-white/[0.01]" />
          <div className="flex-1 border-r border-white/5 bg-white/[0.02]" />
          <div className="flex-1 border-r border-white/5 bg-white/[0.01]" />
          <div className="flex-1 bg-white/[0.02]" />
        </div>

        {/* Y-axis Ticks & Labels */}
        <div className="absolute left-1 top-2 bottom-6 flex flex-col justify-between text-[8px] text-zinc-500 font-mono">
          <span>0.9 —</span>
          <span>0.7 —</span>
          <span>0.5 —</span>
          <span>0.3 —</span>
          <span>0.1 —</span>
        </div>

        {/* SVG Drawing */}
        <svg className="w-full h-full pl-7 pb-5 pr-2 pt-2 relative z-10" viewBox="0 0 340 140" fill="none">
          {/* Horizontal gridlines */}
          <line x1="0" y1="20" x2="340" y2="20" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
          <line x1="0" y1="50" x2="340" y2="50" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
          <line x1="0" y1="80" x2="340" y2="80" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />
          <line x1="0" y1="110" x2="340" y2="110" stroke="rgba(255,255,255,0.04)" strokeDasharray="2 4" />

          {/* Faint Explored Trajectories (Multi-splines) */}
          <path
            d="M10 125 C 60 115, 120 70, 180 85 C 240 100, 280 40, 330 30"
            stroke="#10b981"
            strokeWidth="0.8"
            strokeOpacity="0.45"
            strokeDasharray="2 2"
          />
          <path
            d="M10 130 C 50 90, 110 120, 170 60 C 230 40, 270 95, 330 65"
            stroke="#f59e0b"
            strokeWidth="0.8"
            strokeOpacity="0.45"
            strokeDasharray="2 2"
          />
          <path
            d="M10 120 C 80 130, 130 90, 190 75 C 240 60, 290 85, 330 50"
            stroke="#ec4899"
            strokeWidth="0.8"
            strokeOpacity="0.45"
            strokeDasharray="2 2"
          />
          <path
            d="M10 110 C 90 95, 140 105, 200 45 C 260 20, 300 35, 330 25"
            stroke="#06b6d4"
            strokeWidth="0.8"
            strokeOpacity="0.45"
            strokeDasharray="2 2"
          />

          {/* Bold Ascending Blue Pareto Regression Frontier Line */}
          <path
            d="M10 130 L 90 105 L 170 78 L 250 50 L 330 22"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Subtle Glow duplicate */}
          <path
            d="M10 130 L 90 105 L 170 78 L 250 50 L 330 22"
            stroke="#3b82f6"
            strokeWidth="5"
            strokeOpacity="0.3"
            strokeLinecap="round"
          />

          {/* Scatter Points on the Blue Line */}
          <circle cx="10" cy="130" r="3" fill="#60a5fa" />
          <circle cx="90" cy="105" r="3" fill="#60a5fa" />
          <circle cx="170" cy="78" r="3" fill="#60a5fa" />
          <circle cx="250" cy="50" r="3" fill="#60a5fa" />
          <circle cx="330" cy="22" r="4.5" fill="#ffffff" stroke="#2563eb" strokeWidth="2" />
        </svg>

        {/* X-axis Labels */}
        <div className="absolute left-8 right-2 bottom-0.5 flex justify-between text-[8px] text-zinc-500 font-mono">
          <span>0</span>
          <span>1 day</span>
          <span>2 days</span>
          <span>3 days</span>
          <span>4 days</span>
        </div>
      </div>
    </div>
  );
};
