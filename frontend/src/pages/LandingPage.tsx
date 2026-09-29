import React from 'react';
import {
  Activity,
  ArrowRight,
  Cpu,
  Database,
  GitBranch,
  Shield,
  Sliders,
  TrendingUp,
  Layers,
  Sparkles,
  Terminal,
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  onLaunchWorkspace: () => void;
  onLaunchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchWorkspace, onLaunchDemo }) => {
  return (
    <div className="min-h-screen bg-lab-bg text-lab-text lab-grid-bg flex flex-col justify-between selection:bg-lab-cyan/20 selection:text-lab-cyan">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-lab-border px-8 flex items-center justify-between backdrop-blur-sm bg-lab-bg/80 sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-lab-cyan/10 border border-lab-cyan/30 flex items-center justify-center text-lab-cyan">
            <Activity className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="font-mono text-sm tracking-wider font-semibold text-white">EXPERIMENTFLOW</span>
            <span className="text-[10px] text-lab-textDim font-mono ml-2 border-l border-lab-border pl-2">BE AIML MINI-PROJECT</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onLaunchDemo}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-mono text-lab-amber bg-lab-amber/10 border border-lab-amber/30 rounded hover:bg-lab-amber/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Demo Benchmark</span>
          </button>
          <button
            onClick={onLaunchWorkspace}
            className="flex items-center space-x-2 px-4 py-1.5 text-xs font-mono text-black bg-lab-cyan font-medium rounded hover:bg-cyan-300 transition-all shadow-lab-glow"
          >
            <span>Launch Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-16 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded bg-lab-surface border border-lab-border text-xs font-mono text-lab-cyan">
              <span className="w-1.5 h-1.5 rounded-full bg-lab-cyan animate-ping" />
              <span>AUTONOMOUS EXPERIMENT & OPTIMIZATION PLATFORM</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-mono font-bold tracking-tight text-white leading-tight">
              Machine learning experiments, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-lab-cyan to-blue-400">
                without the repetitive work.
              </span>
            </h1>

            <div className="space-y-1 text-sm md:text-base font-mono text-lab-textMuted border-l-2 border-lab-cyan/40 pl-4 py-1">
              <div>Experiment.</div>
              <div>Analyze.</div>
              <div>Adapt.</div>
              <div className="text-lab-cyan">Repeat.</div>
            </div>

            <p className="text-sm text-lab-textDim leading-relaxed max-w-xl">
              Eliminate manual parameter tweaking. ExperimentFlow executes a controlled sequence of experiments, analyzes empirical sensitivity gradients using local AI reasoning, intelligently navigates the hyperparameter manifold, and produces defensible academic synthesis reports.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onLaunchWorkspace}
                className="flex items-center space-x-2 px-6 py-3 rounded text-sm font-mono text-black bg-lab-cyan font-semibold hover:bg-cyan-300 transition-all shadow-lab-glow"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onLaunchDemo}
                className="flex items-center space-x-2 px-5 py-3 rounded text-sm font-mono text-lab-text bg-lab-card border border-lab-border hover:border-lab-cyan/40 hover:text-lab-cyan transition-all"
              >
                <Sparkles className="w-4 h-4 text-lab-amber" />
                <span>Instant Demo Mode (BC-12)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Animated Experiment Graph / DAG Visualization */}
          <div className="lg:col-span-5">
            <div className="bg-lab-card border border-lab-border rounded-md p-6 relative overflow-hidden shadow-lab-card">
              <div className="text-[11px] font-mono text-lab-textDim border-b border-lab-border pb-3 mb-4 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <GitBranch className="w-3.5 h-3.5 text-lab-cyan" />
                  <span>EXPERIMENT TRAJECTORY DAG</span>
                </span>
                <span className="text-lab-emerald text-[10px]">CONVERGENCE: ACTIVE</span>
              </div>

              {/* Schematic Experiment Graph */}
              <div className="space-y-3 font-mono text-xs">
                {/* Node: Dataset */}
                <div className="p-2.5 rounded bg-lab-surface border border-lab-border flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="w-3.5 h-3.5 text-lab-cyan" />
                    <span className="text-white font-medium">Dataset Input</span>
                  </div>
                  <span className="text-[10px] text-lab-textDim">569 samples · 30 feats</span>
                </div>

                <div className="text-center text-lab-textDim text-xs">│</div>

                {/* Nodes: Experiments */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-lab-surface/70 border border-lab-border">
                    <div className="text-lab-textDim">E00: Baseline</div>
                    <div className="text-white font-medium">Random Forest</div>
                    <div className="text-lab-textMuted text-[10px]">F1: 0.9385</div>
                  </div>
                  <div className="p-2 rounded bg-lab-surface/70 border border-lab-border">
                    <div className="text-lab-textDim">E01: Linear Boundary</div>
                    <div className="text-white font-medium">Logistic Regression</div>
                    <div className="text-lab-textMuted text-[10px]">F1: 0.9472</div>
                  </div>
                  <div className="p-2 rounded bg-lab-surface/70 border border-lab-border">
                    <div className="text-lab-textDim">E03: Margin Opt</div>
                    <div className="text-white font-medium">SVC (RBF)</div>
                    <div className="text-lab-textMuted text-[10px]">F1: 0.9560</div>
                  </div>
                  <div className="p-2 rounded bg-lab-cyan/10 border border-lab-cyan/40">
                    <div className="text-lab-cyan text-[10px]">E08: Gradient Frontier</div>
                    <div className="text-white font-medium">XGBoost (LR: 0.04)</div>
                    <div className="text-lab-emerald font-semibold text-[10px]">F1: 0.9824 ✓</div>
                  </div>
                </div>

                <div className="text-center text-lab-textDim text-xs">↓</div>

                {/* Node: AI Guided Optimization */}
                <div className="p-2.5 rounded bg-lab-surface border border-lab-cyan/30 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-3.5 h-3.5 text-lab-cyan" />
                    <span className="text-lab-cyan font-medium">AI Optimization</span>
                  </div>
                  <span className="text-[10px] text-lab-emerald font-mono">+4.68% OVER BASELINE</span>
                </div>

                <div className="text-center text-lab-textDim text-xs">↓</div>

                {/* Node: Best Region */}
                <div className="p-2.5 rounded bg-lab-emerald/10 border border-lab-emerald/30 text-[11px] text-lab-text flex items-center justify-between">
                  <span className="font-semibold text-white">Optimal Configuration</span>
                  <span className="font-mono text-lab-emerald font-medium">F1 0.9824 · XGBoost</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Grid / Methodology */}
        <div className="mt-20 pt-12 border-t border-lab-border grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded bg-lab-surface/50 border border-lab-border space-y-2.5">
            <div className="w-8 h-8 rounded bg-lab-card border border-lab-border flex items-center justify-center text-lab-cyan">
              <Cpu className="w-4 h-4" />
            </div>
            <h3 className="font-mono text-sm font-semibold text-white">Closed-Loop AI Reasoning</h3>
            <p className="text-xs text-lab-textDim leading-relaxed">
              Not a fixed pipeline. The engine analyzes cross-validated metrics from previous trials to formulate informed hypothesis deltas for the subsequent experiment.
            </p>
          </div>

          <div className="p-5 rounded bg-lab-surface/50 border border-lab-border space-y-2.5">
            <div className="w-8 h-8 rounded bg-lab-card border border-lab-border flex items-center justify-center text-lab-amber">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h3 className="font-mono text-sm font-semibold text-white">Uninformed vs. AI Search</h3>
            <p className="text-xs text-lab-textDim leading-relaxed">
              Provides direct academic benchmarking: compare classical random parameter sampling against AI-guided gradient exploitation on identical budgets.
            </p>
          </div>

          <div className="p-5 rounded bg-lab-surface/50 border border-lab-border space-y-2.5">
            <div className="w-8 h-8 rounded bg-lab-card border border-lab-border flex items-center justify-center text-lab-emerald">
              <Shield className="w-4 h-4" />
            </div>
            <h3 className="font-mono text-sm font-semibold text-white">Zero Data Leakage</h3>
            <p className="text-xs text-lab-textDim leading-relaxed">
              Rigorous scientific preprocessing pipelines. All imputers, categorical encoders, and standardizers are fitted strictly on training partitions.
            </p>
          </div>
        </div>

        {/* Technical Architecture Stack */}
        <div className="mt-12 p-6 rounded bg-lab-card/60 border border-lab-border flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center space-x-2 text-lab-textMuted">
            <Terminal className="w-4 h-4 text-lab-cyan" />
            <span>TECHNOLOGY FOUNDATION:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-lab-textDim">
            <span className="px-2 py-0.5 rounded bg-lab-surface border border-lab-border text-white">FastAPI</span>
            <span className="px-2 py-0.5 rounded bg-lab-surface border border-lab-border text-white">Scikit-Learn</span>
            <span className="px-2 py-0.5 rounded bg-lab-surface border border-lab-border text-white">XGBoost</span>
            <span className="px-2 py-0.5 rounded bg-lab-surface border border-lab-border text-white">React + Vite</span>
            <span className="px-2 py-0.5 rounded bg-lab-surface border border-lab-border text-white">MySQL + SQLAlchemy</span>
            <span className="px-2 py-0.5 rounded bg-lab-surface border border-lab-border text-white">Local AI Provider</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-12 border-t border-lab-border px-8 flex items-center justify-between text-xs font-mono text-lab-textDim">
        <div>ExperimentFlow — 3-Credit BE AIML Academic Mini-Project</div>
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-lab-emerald" />
          <span>LOCAL ENGINE ONLINE</span>
        </div>
      </footer>
    </div>
  );
};
