import React, { useState, useEffect } from 'react';
import { Terminal, ShieldCheck, Database, Compass } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  isDemoActive: boolean;
  onExitToLanding: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, isDemoActive, onExitToLanding }) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const titles: Record<string, string> = {
    dashboard: 'Mission Control & Experiment Overview',
    datasets: 'Dataset Lab & Statistical Profiler',
    studio: 'Experiment Studio & Autonomous Engine',
    timeline: 'Iterative Experiment Trajectory & Logs',
    optimization: 'Optimization Landscape & Search Dynamics',
    comparison: 'Cross-Model Scientific Leaderboard',
    report: 'Academic Synthesis & Experiment Report',
    settings: 'System Diagnostics & Local AI Runtime',
  };

  return (
    <header className="h-14 border-b border-lab-border bg-lab-surface/80 backdrop-blur px-6 flex items-center justify-between z-10">
      {/* Breadcrumb / Title */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 text-xs font-mono text-lab-textDim">
          <span>LAB</span>
          <span>/</span>
          <span className="text-lab-cyan uppercase">{currentTab}</span>
        </div>
        <span className="text-lab-border">|</span>
        <h1 className="text-sm font-medium text-lab-text font-sans">
          {titles[currentTab] || 'Workspace'}
        </h1>
      </div>

      {/* Right HUD Controls */}
      <div className="flex items-center space-x-4">
        {/* Demo Data Tag */}
        {isDemoActive ? (
          <div className="px-2.5 py-1 rounded bg-lab-amber/15 border border-lab-amber/40 text-[11px] font-mono text-lab-amber flex items-center space-x-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-lab-amber" />
            <span>DEMO BENCHMARK (BC-12)</span>
          </div>
        ) : (
          <div className="px-2.5 py-1 rounded bg-lab-cyan/10 border border-lab-cyan/30 text-[11px] font-mono text-lab-cyan flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-lab-cyan" />
            <span>LIVE LOCAL ENGINE</span>
          </div>
        )}

        {/* Local Security Shield */}
        <div className="hidden md:flex items-center space-x-1.5 text-xs font-mono text-lab-textMuted border border-lab-border px-2.5 py-1 rounded bg-lab-card/50">
          <ShieldCheck className="w-3.5 h-3.5 text-lab-emerald" />
          <span className="text-[11px]">LOCAL PRIVACY</span>
        </div>

        {/* UTC Clock */}
        <div className="text-xs font-mono text-lab-textDim">
          {timeStr}
        </div>

        {/* Return to Landing */}
        <button
          onClick={onExitToLanding}
          className="flex items-center space-x-1 text-xs font-mono text-lab-textMuted hover:text-white px-2 py-1 rounded hover:bg-lab-card border border-transparent hover:border-lab-border transition-all"
          title="Return to Presentation Landing Page"
        >
          <Compass className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Overview</span>
        </button>
      </div>
    </header>
  );
};
