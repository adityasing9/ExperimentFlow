import React from 'react';
import { GitBranch, Layers } from 'lucide-react';

interface PipelineTreeDAGProps {
  currentIteration?: number;
  bestModel?: string;
}

export const PipelineTreeDAG: React.FC<PipelineTreeDAGProps> = ({
  currentIteration = 24,
  bestModel = 'XGBoost',
}) => {
  return (
    <div className="h-full w-full flex flex-col justify-between p-3.5 select-none font-mono text-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/5">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-zinc-400 font-semibold uppercase tracking-wider">
            Experiment Architecture DAG
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] bg-red-500/20 text-red-400 font-bold border border-red-500/30">
            {currentIteration}
          </span>
        </div>
        <span className="text-[10px] text-zinc-500">DEPTH: 4 LEVELS</span>
      </div>

      <div className="flex items-center space-x-4 h-full pt-2">
        {/* Left Column: Result Series List */}
        <div className="w-24 border-r border-white/5 pr-2 space-y-1.5 overflow-hidden text-[10px] text-zinc-400">
          {[24, 23, 22, 21, 20, 19, 18, 17, 16, 15].map((num) => (
            <div
              key={num}
              className={`flex items-center space-x-1.5 truncate cursor-pointer hover:text-white transition-all ${
                num === currentIteration ? 'text-amber-400 font-bold' : ''
              }`}
            >
              <span className={`w-1 h-1 rounded-full ${num === currentIteration ? 'bg-amber-400' : 'bg-zinc-600'}`} />
              <span>Result {num}</span>
            </div>
          ))}
        </div>

        {/* Right Area: Interactive Branching Pipeline Dendrogram */}
        <div className="flex-1 h-full flex items-center justify-center relative overflow-hidden">
          <svg className="w-full h-44" viewBox="0 0 340 160" fill="none">
            {/* Branching Green/Teal Connection Paths */}
            <path d="M40 80 H80 V40 H140 V20 H200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.8" />
            <path d="M140 40 H200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.8" />
            <path d="M140 40 V60 H200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.8" />
            
            <path d="M80 80 H140" stroke="#10b981" strokeWidth="1" strokeOpacity="0.8" />
            <path d="M140 80 V70 H200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.8" />
            <path d="M140 80 V90 H200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.8" />

            <path d="M80 80 V120 H140 V105 H200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.8" />
            <path d="M140 120 H200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.8" />
            <path d="M140 120 V135 H200" stroke="#10b981" strokeWidth="1" strokeOpacity="0.8" />

            {/* Further Level 3 Branches */}
            <path d="M200 20 H260" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
            <path d="M200 40 H260" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
            <path d="M200 60 H260" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
            <path d="M200 70 H260" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
            <path d="M200 90 H260" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
            <path d="M200 105 H260" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
            <path d="M200 120 H260" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />
            <path d="M200 135 H260" stroke="#10b981" strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.6" />

            {/* Root Node: Input */}
            <g transform="translate(10, 72)">
              <rect width="32" height="16" rx="3" fill="#3b82f6" />
              <text x="16" y="11" fill="#ffffff" fontSize="8" textAnchor="middle" fontWeight="bold">ROOT</text>
            </g>

            {/* Level 1 Nodes */}
            <g transform="translate(85, 32)">
              <rect width="40" height="15" rx="3" fill="#8b5cf6" />
              <text x="20" y="11" fill="#ffffff" fontSize="7" textAnchor="middle">NORM</text>
            </g>
            <g transform="translate(85, 72)">
              <rect width="40" height="15" rx="3" fill="#8b5cf6" />
              <text x="20" y="11" fill="#ffffff" fontSize="7" textAnchor="middle">SPLIT</text>
            </g>
            <g transform="translate(85, 112)">
              <rect width="40" height="15" rx="3" fill="#8b5cf6" />
              <text x="20" y="11" fill="#ffffff" fontSize="7" textAnchor="middle">IMPUTE</text>
            </g>

            {/* Level 2 Nodes (Blue pills) */}
            <g transform="translate(160, 13)">
              <rect width="36" height="14" rx="2" fill="#2563eb" />
              <text x="18" y="10" fill="#ffffff" fontSize="7" textAnchor="middle">TRAIN</text>
            </g>
            <g transform="translate(160, 53)">
              <rect width="36" height="14" rx="2" fill="#2563eb" />
              <text x="18" y="10" fill="#ffffff" fontSize="7" textAnchor="middle">VAL</text>
            </g>
            <g transform="translate(160, 98)">
              <rect width="36" height="14" rx="2" fill="#2563eb" />
              <text x="18" y="10" fill="#ffffff" fontSize="7" textAnchor="middle">OPTIM</text>
            </g>
            <g transform="translate(160, 128)">
              <rect width="36" height="14" rx="2" fill="#2563eb" />
              <text x="18" y="10" fill="#ffffff" fontSize="7" textAnchor="middle">METRIC</text>
            </g>

            {/* Leaf nodes (Green dots with labels) */}
            {[20, 40, 60, 70, 90, 105, 120, 135].map((y, i) => (
              <g key={i} transform={`translate(262, ${y - 3})`}>
                <circle cx="3" cy="3" r="2" fill="#10b981" />
                <text x="9" y="5" fill="#9ca3af" fontSize="6">
                  {i % 2 === 0 ? 'Experiment' : 'Eval'}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};
