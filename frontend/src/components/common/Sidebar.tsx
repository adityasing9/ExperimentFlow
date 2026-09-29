import React from 'react';
import {
  Activity,
  Database,
  Sliders,
  GitBranch,
  Layers,
  FileText,
  Settings,
  Flame,
  Cpu,
  TrendingUp,
  Sparkles,
  Home
} from 'lucide-react';
import { SystemHealth } from '../../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  systemHealth: SystemHealth | null;
  onLoadDemo: () => void;
  isDemoActive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  systemHealth,
  onLoadDemo,
  isDemoActive,
}) => {
  const navSections = [
    {
      title: 'CORE',
      items: [
        { id: 'dashboard', label: 'Overview', icon: Home },
      ]
    },
    {
      title: 'DATA',
      items: [
        { id: 'datasets', label: 'Dataset Lab', icon: Database },
      ]
    },
    {
      title: 'EXPERIMENT',
      items: [
        { id: 'studio', label: 'Experiment Studio', icon: Sliders },
        { id: 'timeline', label: 'Timeline', icon: GitBranch },
      ]
    },
    {
      title: 'OPTIMIZATION',
      items: [
        { id: 'optimization', label: 'Optimization Lab', icon: TrendingUp },
      ]
    },
    {
      title: 'ANALYSIS',
      items: [
        { id: 'comparison', label: 'Model Comparison', icon: Layers },
      ]
    },
    {
      title: 'OUTPUT',
      items: [
        { id: 'report', label: 'Scientific Report', icon: FileText },
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings & Runtime', icon: Settings },
      ]
    },
  ];

  return (
    <aside className="w-64 bg-lab-surface border-r border-lab-border flex flex-col justify-between select-none">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-lab-border">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded bg-lab-cyan/10 border border-lab-cyan/30 flex items-center justify-center text-lab-cyan">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="font-mono text-sm tracking-wider font-semibold text-white">
                EXPERIMENTFLOW
              </span>
              <div className="text-[10px] text-lab-textDim font-mono tracking-widest">
                AUTONOMOUS ML LAB
              </div>
            </div>
          </div>

          {/* Engine Status HUD */}
          <div className="mt-3.5 px-2.5 py-1.5 rounded bg-lab-bg/60 border border-lab-border flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-lab-emerald animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-lab-emerald" />
              <span className="text-lab-textMuted uppercase tracking-wider">
                {systemHealth?.database?.engine === 'mysql' ? 'MYSQL ENGINE' : 'LOCAL ENGINE'}
              </span>
            </div>
            <span className="text-lab-cyan text-[10px]">READY</span>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-250px)]">
          {navSections.map((sec) => (
            <div key={sec.title}>
              <div className="px-3 text-[10px] font-mono tracking-wider text-lab-textDim uppercase mb-1">
                {sec.title}
              </div>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded text-xs font-mono transition-all text-left ${
                        isActive
                          ? 'bg-lab-card text-lab-cyan border-l-2 border-lab-cyan font-medium shadow-sm'
                          : 'text-lab-textMuted hover:text-white hover:bg-lab-card/50'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-lab-cyan' : 'text-lab-textDim'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / Demo Trigger */}
      <div className="p-4 border-t border-lab-border bg-lab-bg/40 space-y-2.5">
        <button
          onClick={onLoadDemo}
          className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded border text-xs font-mono transition-all ${
            isDemoActive
              ? 'bg-lab-amber/10 border-lab-amber text-lab-amber shadow-sm'
              : 'bg-lab-card border-lab-border text-lab-text hover:border-lab-cyan/40 hover:text-lab-cyan'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-lab-amber" />
          <span>{isDemoActive ? '● DEMO BENCHMARK' : 'Load Demo Benchmark'}</span>
        </button>

        <div className="text-[10px] font-mono text-lab-textDim text-center">
          3-Credit BE AIML Mini-Project
        </div>
      </div>
    </aside>
  );
};
