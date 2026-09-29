import React, { useState } from 'react';
import {
  Search,
  Plus,
  Bell,
  Sliders,
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { RadialPolarPlot } from '../components/dashboard/RadialPolarPlot';
import { PipelineTreeDAG } from '../components/dashboard/PipelineTreeDAG';
import { ConvergenceSplinePlot } from '../components/dashboard/ConvergenceSplinePlot';
import { ExperimentLogsFeed } from '../components/dashboard/ExperimentLogsFeed';
import { OptimizationRun, SystemHealth } from '../types';

interface DashboardProps {
  currentRun: OptimizationRun | null;
  onNavigate: (tab: string) => void;
  onLoadDemo: () => void;
  systemHealth: SystemHealth | null;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentRun,
  onNavigate,
  onLoadDemo,
}) => {
  const [activeFilter, setActiveFilter] = useState<'All' | 'Precision' | 'Accuracy' | 'Sensitivity' | 'Loss'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs: Array<'All' | 'Precision' | 'Accuracy' | 'Sensitivity' | 'Loss'> = [
    'All',
    'Precision',
    'Accuracy',
    'Sensitivity',
    'Loss',
  ];

  const experiments = currentRun?.experiments || [];
  const currentIteration = currentRun?.current_iteration || 24;
  const bestExp = currentRun?.experiments?.find((e) => e.id === currentRun.best_experiment_id) ||
    currentRun?.experiments?.[currentRun.experiments.length - 1];

  const precisionVal = bestExp?.metrics?.precision ? bestExp.metrics.precision.toFixed(3) : '0.980';
  const accuracyVal = bestExp?.metrics?.accuracy ? bestExp.metrics.accuracy.toFixed(3) : '0.978';
  const sensitivityVal = bestExp?.metrics?.recall ? bestExp.metrics.recall.toFixed(3) : '0.982';
  const lossVal = bestExp?.metrics?.log_loss ? bestExp.metrics.log_loss.toFixed(2) : '0.12';

  return (
    <div className="min-h-full w-full bg-[#0d0f12] text-zinc-100 flex flex-col select-none font-sans">
      {/* 1. Top Control Bar */}
      <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-[#090b0e]">
        {/* Left: View Mode Icon Switcher */}
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
          </div>
          <div className="hidden sm:flex items-center space-x-2 text-zinc-400 text-xs font-mono">
            <span className="text-white font-medium">EXPERIMENTFLOW</span>
            <span>/</span>
            <span className="text-zinc-500">WORKSTATION</span>
          </div>
        </div>

        {/* Center: Search Pill Bar */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search experiments, architectures, metrics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#14171d] border border-white/5 rounded-full pl-9 pr-4 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500/40 transition-all font-mono"
            />
          </div>
        </div>

        {/* Right: + NEW PROJECT pill, User Profile pill & Bell */}
        <div className="flex items-center space-x-3 font-mono">
          <button
            onClick={() => onNavigate('studio')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#181b22] border border-white/10 hover:border-cyan-500/40 text-xs text-white transition-all shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-sans text-[11px] font-semibold">NEW EXPERIMENT</span>
          </button>

          {/* User Profile Pill */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-[#14171d] border border-white/5 text-xs">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=50&h=50&fit=crop&crop=face"
              alt="User"
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-zinc-200 font-sans text-[11px] font-medium">Aditya Singh</span>
            <span className="text-[10px] text-zinc-500 hidden lg:inline">Lead ML Engineer</span>
          </div>

          <button
            onClick={onLoadDemo}
            className="p-1.5 text-amber-400 hover:text-amber-300 rounded-full bg-[#14171d] border border-amber-500/20 hover:border-amber-500/40 transition-all"
            title="Load Demo Benchmark"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button className="p-1.5 text-zinc-400 hover:text-white rounded-full bg-[#14171d] border border-white/5 transition-all">
            <Bell className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Sub-Header: Metric Filter Pills */}
      <div className="h-11 border-b border-white/5 px-6 flex items-center justify-between bg-[#0b0d10]">
        <div className="flex items-center space-x-2 font-mono text-xs">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1 rounded-md text-[11px] transition-all ${
                  isActive
                    ? 'border border-amber-500/60 bg-amber-500/10 text-amber-400 font-medium'
                    : 'border border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="text-[10px] font-mono text-zinc-500 flex items-center space-x-2">
          <span>RUN: <strong className="text-cyan-400">BREAST CANCER OPTIMIZATION</strong></span>
          <span>·</span>
          <span>METRIC: <strong className="text-white">F1 / PRECISION</strong></span>
        </div>
      </div>

      {/* 3. Main 3-Column Asymmetric Research Canvas */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-white/5 overflow-hidden">
        {/* ========================================================
            COLUMN 1 (Left): Radial Polar Scatter & Cluster Manifold
            ======================================================== */}
        <div className="lg:col-span-5 bg-[#090a0d] relative flex flex-col justify-center items-center p-4 min-h-[520px] overflow-hidden">
          {/* Scientific background grid */}
          <div className="absolute inset-0 lab-grid-bg opacity-30" />

          {/* Radial Polar Plot Canvas */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <RadialPolarPlot activeMetric={activeFilter} />
          </div>

          {/* Bottom Left Legend Overlay */}
          <div className="absolute bottom-4 left-6 z-20 flex items-center space-x-3 text-[10px] font-mono text-zinc-400 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>Cluster A</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span>Cluster B</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>Cluster C</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Cluster D</span>
            </span>
          </div>
        </div>

        {/* ========================================================
            COLUMN 2 (Center): Decision Tree DAG, Metric Tiles & Spline
            ======================================================== */}
        <div className="lg:col-span-4 bg-[#0d0f12] flex flex-col divide-y divide-white/5 overflow-y-auto">
          {/* Widget 1: Decision Tree / Pipeline Dendrogram */}
          <div className="h-56 bg-[#0a0c0f]">
            <PipelineTreeDAG
              currentIteration={currentIteration}
              bestModel={bestExp?.model_name || 'XGBoost'}
            />
          </div>

          {/* Widget 2: 4 Warm Copper/Dark Metric Cards */}
          <div className="p-4 bg-[#0c0e12]">
            <div className="grid grid-cols-2 gap-3 font-mono">
              {/* Precision Tile */}
              <div className="p-3.5 rounded-md bg-[#16130e] border border-amber-600/30 flex flex-col justify-between hover:border-amber-500/50 transition-all">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Precision</span>
                <span className="text-xl font-bold text-amber-300 mt-1">{precisionVal}</span>
              </div>

              {/* Accuracy Tile */}
              <div className="p-3.5 rounded-md bg-[#16130e] border border-amber-600/30 flex flex-col justify-between hover:border-amber-500/50 transition-all">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Accuracy</span>
                <span className="text-xl font-bold text-amber-300 mt-1">{accuracyVal}</span>
              </div>

              {/* Sensitivity / Recall Tile */}
              <div className="p-3.5 rounded-md bg-[#16130e] border border-amber-600/30 flex flex-col justify-between hover:border-amber-500/50 transition-all">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Sensitivity</span>
                <span className="text-xl font-bold text-amber-300 mt-1">{sensitivityVal}</span>
              </div>

              {/* Loss / F1 Tile */}
              <div className="p-3.5 rounded-md bg-[#16130e] border border-amber-600/30 flex flex-col justify-between hover:border-amber-500/50 transition-all">
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Loss</span>
                <span className="text-xl font-bold text-amber-300 mt-1">{lossVal}</span>
              </div>
            </div>
          </div>

          {/* Widget 3: Multi-curve Trajectory & Pareto Spline Graph */}
          <div className="flex-1 min-h-[220px] bg-[#0a0c0f]">
            <ConvergenceSplinePlot
              currentIteration={currentIteration}
              metricName={activeFilter}
              bestScore={Number(precisionVal)}
            />
          </div>
        </div>

        {/* ========================================================
            COLUMN 3 (Right): Activity & Experiment Execution Logs Feed
            ======================================================== */}
        <div className="lg:col-span-3 bg-[#0a0c0f] flex flex-col">
          <ExperimentLogsFeed experiments={experiments} />
        </div>
      </div>
    </div>
  );
};
