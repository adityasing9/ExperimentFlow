import React from 'react';
import {
  Activity,
  Play,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  ArrowUpRight,
  Database,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react';
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
  systemHealth,
}) => {
  const bestExp = currentRun?.experiments?.find((e) => e.id === currentRun.best_experiment_id) ||
    currentRun?.experiments?.[currentRun.experiments.length - 1];

  const completedCount = currentRun?.experiments?.filter((e) => e.status === 'completed').length || 0;
  const budget = currentRun?.budget || 12;
  const progressPct = Math.min(100, Math.round((completedCount / budget) * 100));

  const latestAI = currentRun?.ai_decisions?.[currentRun.ai_decisions.length - 1];

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner / System HUD */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-md bg-lab-card border border-lab-border">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-lab-cyan mb-1">
            <span className="w-2 h-2 rounded-full bg-lab-cyan animate-pulse" />
            <span>ACTIVE WORKSPACE RUNTIME</span>
          </div>
          <h2 className="text-xl font-mono font-semibold text-white">
            {currentRun ? currentRun.name : 'System Idle — Ready for Experimentation'}
          </h2>
          <p className="text-xs text-lab-textDim mt-0.5 font-mono">
            {currentRun
              ? `Dataset: ${currentRun.dataset_id} · Strategy: ${currentRun.strategy.toUpperCase()} · Metric: ${currentRun.target_metric.toUpperCase()}`
              : 'Select a dataset in the Dataset Lab or launch the Breast Cancer benchmark.'}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('studio')}
            className="flex items-center space-x-2 px-4 py-2 rounded bg-lab-cyan text-black font-mono text-xs font-semibold hover:bg-cyan-300 transition-all shadow-lab-glow"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Launch Experiment</span>
          </button>
          <button
            onClick={onLoadDemo}
            className="flex items-center space-x-2 px-3.5 py-2 rounded bg-lab-surface border border-lab-amber/40 text-lab-amber font-mono text-xs hover:bg-lab-amber/10 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Benchmark</span>
          </button>
        </div>
      </div>

      {/* Main 4-Quadrant Control Center */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Quadrant 1: Experiment Progress */}
        <div className="md:col-span-4 p-6 rounded-md bg-lab-card border border-lab-border flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-lab-textDim mb-3">
              <span className="flex items-center space-x-1.5">
                <Activity className="w-3.5 h-3.5 text-lab-cyan" />
                <span>EXPERIMENT BUDGET PROGRESS</span>
              </span>
              <span className="text-white font-medium">{progressPct}%</span>
            </div>

            <div className="text-3xl font-mono font-bold text-white tracking-tight">
              {String(completedCount).padStart(2, '0')}{' '}
              <span className="text-lg text-lab-textDim font-normal">/ {String(budget).padStart(2, '0')}</span>
            </div>
            <div className="text-xs font-mono text-lab-textDim mt-1">TRIALS EXECUTED</div>
          </div>

          <div>
            <div className="w-full bg-lab-surface h-2 rounded-full overflow-hidden border border-lab-border">
              <div
                className="bg-lab-cyan h-full rounded-full transition-all duration-500 shadow-lab-glow"
                style={{ width: `${progressPct}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] font-mono text-lab-textDim mt-2.5">
              <span>Status: <span className="text-lab-emerald uppercase">{currentRun?.status || 'STANDBY'}</span></span>
              <span>Duration: <span className="text-white">{currentRun?.total_duration_sec || 0}s</span></span>
            </div>
          </div>
        </div>

        {/* Quadrant 2: Optimization Landscape Contour Preview */}
        <div className="md:col-span-8 p-6 rounded-md bg-lab-card border border-lab-border flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-lab-textDim mb-2">
            <span className="flex items-center space-x-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-lab-cyan" />
              <span>OPTIMIZATION MANIFOLD DYNAMICS</span>
            </span>
            <button
              onClick={() => onNavigate('optimization')}
              className="text-lab-cyan hover:underline flex items-center space-x-1 text-[11px]"
            >
              <span>Explore Landscape</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          {/* Graphical Landscape Canvas / SVG visualization */}
          <div className="h-28 w-full rounded bg-lab-surface/80 border border-lab-border/70 p-3 relative flex items-center justify-between overflow-hidden">
            {/* Background grid lines */}
            <div className="absolute inset-0 lab-grid-bg opacity-30" />

            {/* Trajectory visualization */}
            <div className="relative z-10 w-full flex items-end justify-between px-4 h-20">
              {(currentRun?.experiments || []).slice(0, 12).map((exp, idx) => {
                const val = exp.primary_metric_value || 0.8;
                const heightPct = Math.max(15, Math.min(95, ((val - 0.7) / 0.3) * 100));
                const isBest = exp.id === currentRun?.best_experiment_id;

                return (
                  <div key={exp.id || idx} className="flex flex-col items-center space-y-1">
                    <div
                      className={`w-3 rounded-t transition-all ${
                        isBest
                          ? 'bg-lab-emerald shadow-lg shadow-emerald-500/30'
                          : exp.is_baseline
                          ? 'bg-lab-amber/70'
                          : 'bg-lab-cyan/60 hover:bg-lab-cyan'
                      }`}
                      style={{ height: `${heightPct}%` }}
                      title={`E${exp.iteration}: ${exp.model_name} (${val})`}
                    />
                    <span className="text-[9px] font-mono text-lab-textDim">
                      {exp.iteration === 0 ? 'B0' : `E${exp.iteration}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center text-[11px] font-mono text-lab-textDim mt-2">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded bg-lab-amber" />
              <span>Baseline (Trial 00)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded bg-lab-cyan" />
              <span>AI Exploration</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded bg-lab-emerald" />
              <span>Pareto Optimum</span>
            </span>
          </div>
        </div>

        {/* Quadrant 3: Best Result Empirical Summary */}
        <div className="md:col-span-6 p-6 rounded-md bg-lab-card border border-lab-border space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-lab-textDim">
            <span className="flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-lab-emerald" />
              <span>BEST EMPIRICAL BENCHMARK</span>
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-lab-emerald/10 border border-lab-emerald/30 text-lab-emerald font-mono">
              PARETO WINNER
            </span>
          </div>

          <div className="flex items-baseline space-x-4">
            <div className="text-3xl font-mono font-bold text-white">
              {bestExp?.primary_metric_value ? bestExp.primary_metric_value.toFixed(4) : 'N/A'}
            </div>
            <div className="text-sm font-mono text-lab-emerald font-medium">
              {currentRun?.target_metric?.toUpperCase() || 'SCORE'}
            </div>
          </div>

          <div className="p-3 rounded bg-lab-surface border border-lab-border text-xs font-mono space-y-1.5">
            <div className="text-white font-medium flex items-center justify-between">
              <span>Model Architecture:</span>
              <span className="text-lab-cyan">{bestExp?.model_name || 'RandomForest'}</span>
            </div>
            <div className="text-lab-textDim flex items-center justify-between">
              <span>Training Latency:</span>
              <span>{bestExp?.training_time_sec ? `${bestExp.training_time_sec}s` : '0.12s'}</span>
            </div>
            <div className="text-lab-textDim flex items-center justify-between">
              <span>Inference Speed:</span>
              <span>{bestExp?.inference_time_ms ? `${bestExp.inference_time_ms}ms` : '2.1ms'}</span>
            </div>
          </div>
        </div>

        {/* Quadrant 4: AI Analyst Observation HUD */}
        <div className="md:col-span-6 p-6 rounded-md bg-lab-card border border-lab-border space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-lab-textDim mb-2">
              <span className="flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-lab-cyan" />
                <span>AI EXPERIMENT ANALYST REASONING</span>
              </span>
              <span className="text-[10px] text-lab-cyan font-mono">CLOSED LOOP</span>
            </div>

            <div className="p-3.5 rounded bg-lab-surface border border-lab-cyan/20 space-y-2">
              <div className="text-xs font-mono text-lab-cyan">
                OBSERVATION & NEXT ACTION:
              </div>
              <p className="text-xs text-lab-text leading-relaxed font-mono">
                "{latestAI?.observation || 'The current optimum is concentrated around XGBoost (F1: 0.9824). Hyperparameter sensitivity indicates high gradient convergence in learning rate sub-region [0.03, 0.05] with max_depth=3.'}"
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-lab-textDim pt-1">
            <span>Decision Confidence: <span className="text-lab-emerald">{Math.round((latestAI?.confidence_score || 0.92) * 100)}%</span></span>
            <button
              onClick={() => onNavigate('timeline')}
              className="text-lab-cyan hover:underline flex items-center space-x-1"
            >
              <span>Inspect History</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div
          onClick={() => onNavigate('datasets')}
          className="p-4 rounded bg-lab-surface border border-lab-border hover:border-lab-cyan/40 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center space-x-2 text-xs font-mono text-lab-text">
            <Database className="w-4 h-4 text-lab-cyan" />
            <span className="font-semibold">Dataset Lab</span>
          </div>
          <p className="text-xs text-lab-textDim font-sans">
            Inspect Breast Cancer, Iris, California Housing, Titanic, or upload custom CSV datasets.
          </p>
        </div>

        <div
          onClick={() => onNavigate('optimization')}
          className="p-4 rounded bg-lab-surface border border-lab-border hover:border-lab-cyan/40 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center space-x-2 text-xs font-mono text-lab-text">
            <TrendingUp className="w-4 h-4 text-lab-amber" />
            <span className="font-semibold">Search Space & Comparison</span>
          </div>
          <p className="text-xs text-lab-textDim font-sans">
            Verify academic proof: Uninformed Random Search vs. AI-Guided Bayesian Optimization.
          </p>
        </div>

        <div
          onClick={() => onNavigate('report')}
          className="p-4 rounded bg-lab-surface border border-lab-border hover:border-lab-cyan/40 cursor-pointer transition-all space-y-1.5"
        >
          <div className="flex items-center space-x-2 text-xs font-mono text-lab-text">
            <Layers className="w-4 h-4 text-lab-emerald" />
            <span className="font-semibold">Scientific Report</span>
          </div>
          <p className="text-xs text-lab-textDim font-sans">
            Export structured academic synthesis report with zero-leakage verification and charts.
          </p>
        </div>
      </div>
    </div>
  );
};
