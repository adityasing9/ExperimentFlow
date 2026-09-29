import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  Activity,
  Sliders,
  Sparkles,
  TrendingUp,
  Cpu,
  CheckCircle2,
  Clock,
  Layers,
  Zap,
  AlertCircle
} from 'lucide-react';
import { apiClient } from '../api/client';
import { Dataset, OptimizationRun, Experiment } from '../types';

interface ExperimentStudioProps {
  datasets: Dataset[];
  currentRun: OptimizationRun | null;
  setCurrentRun: (run: OptimizationRun | null) => void;
  onNavigate: (tab: string) => void;
}

export const ExperimentStudio: React.FC<ExperimentStudioProps> = ({
  datasets,
  currentRun,
  setCurrentRun,
  onNavigate,
}) => {
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>(
    datasets[0]?.id || ''
  );
  const [strategy, setStrategy] = useState<'ai_guided' | 'random_search'>('ai_guided');
  const [targetMetric, setTargetMetric] = useState<string>('f1');
  const [budget, setBudget] = useState<number>(10);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync selected dataset when dataset list updates
  useEffect(() => {
    if (datasets.length > 0 && !selectedDatasetId) {
      setSelectedDatasetId(datasets[0].id);
    }
  }, [datasets]);

  // Adjust metric options based on selected dataset problem type
  const activeDataset = datasets.find((d) => d.id === selectedDatasetId);
  const isRegression = activeDataset?.problem_type === 'regression';

  useEffect(() => {
    if (isRegression) {
      setTargetMetric('r2');
    } else {
      setTargetMetric('f1');
    }
  }, [isRegression]);

  // Polling loop for live running optimization
  useEffect(() => {
    if (!currentRun || currentRun.status !== 'running') return;

    const interval = setInterval(async () => {
      try {
        const updated = await apiClient.getOptimizationRun(currentRun.id);
        setCurrentRun(updated);
      } catch (e) {
        console.error('Polling error:', e);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [currentRun?.id, currentRun?.status]);

  const handleStart = async () => {
    if (!selectedDatasetId) {
      setError('Please select a dataset');
      return;
    }
    setError(null);
    setIsLaunching(true);

    try {
      const run = await apiClient.startOptimization({
        dataset_id: selectedDatasetId,
        strategy: strategy,
        target_metric: targetMetric,
        budget: Number(budget),
      });
      setCurrentRun(run);
    } catch (err: any) {
      setError(err.message || 'Failed to start experiment');
    } finally {
      setIsLaunching(false);
    }
  };

  const handleCancel = async () => {
    if (!currentRun) return;
    try {
      await apiClient.cancelOptimization(currentRun.id);
      const updated = await apiClient.getOptimizationRun(currentRun.id);
      setCurrentRun(updated);
    } catch (err: any) {
      console.error(err);
    }
  };

  const latestExp: Experiment | undefined =
    currentRun?.experiments?.[currentRun.experiments.length - 1];

  const currentIter = currentRun?.current_iteration || 0;
  const isRunning = currentRun?.status === 'running';

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-lab-cyan mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>AUTONOMOUS EXPERIMENT CONTROLLER</span>
          </div>
          <h2 className="text-xl font-mono font-semibold text-white">
            Experiment Studio & Execution Pipeline
          </h2>
          <p className="text-xs text-lab-textDim mt-0.5 font-mono">
            Configure search boundaries, launch closed-loop optimization, and monitor real-time execution.
          </p>
        </div>

        {currentRun && (
          <div className="flex items-center space-x-3">
            {isRunning && (
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded bg-lab-rose/15 border border-lab-rose/40 text-lab-rose font-mono text-xs hover:bg-lab-rose/25 transition-all"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop Run</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('timeline')}
              className="flex items-center space-x-2 px-3.5 py-1.5 rounded bg-lab-surface border border-lab-border text-white font-mono text-xs hover:border-lab-cyan/40 hover:text-lab-cyan transition-all"
            >
              <span>View Timeline</span>
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded bg-lab-rose/10 border border-lab-rose/40 text-lab-rose text-xs font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Studio Grid: Configuration + Live Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Experiment Configuration Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-md bg-lab-card border border-lab-border space-y-5">
            <div className="flex items-center justify-between border-b border-lab-border pb-3">
              <span className="font-mono text-xs font-semibold text-white uppercase">
                Experiment Configuration
              </span>
              <span className="text-[10px] font-mono text-lab-cyan">SECTION 12</span>
            </div>

            {/* Dataset Selection */}
            <div>
              <label className="text-[11px] font-mono text-lab-textDim uppercase block mb-1.5">
                Target Dataset
              </label>
              <select
                value={selectedDatasetId}
                onChange={(e) => setSelectedDatasetId(e.target.value)}
                disabled={isRunning}
                className="w-full px-3 py-2 rounded bg-lab-surface border border-lab-border text-white text-xs font-mono focus:border-lab-cyan outline-none"
              >
                {datasets.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.row_count} rows, {d.problem_type})
                  </option>
                ))}
              </select>
            </div>

            {/* Search Strategy */}
            <div>
              <label className="text-[11px] font-mono text-lab-textDim uppercase block mb-1.5">
                Exploration Strategy (Section 18)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={isRunning}
                  onClick={() => setStrategy('ai_guided')}
                  className={`p-3 rounded border text-left font-mono transition-all ${
                    strategy === 'ai_guided'
                      ? 'bg-lab-cyan/10 border-lab-cyan text-white shadow-lab-glow'
                      : 'bg-lab-surface border-lab-border text-lab-textMuted hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-lab-cyan">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI-Guided</span>
                  </div>
                  <div className="text-[10px] text-lab-textDim mt-1 leading-snug">
                    Closed-loop Bayesian sensitivity gradient
                  </div>
                </button>

                <button
                  type="button"
                  disabled={isRunning}
                  onClick={() => setStrategy('random_search')}
                  className={`p-3 rounded border text-left font-mono transition-all ${
                    strategy === 'random_search'
                      ? 'bg-lab-amber/10 border-lab-amber text-white'
                      : 'bg-lab-surface border-lab-border text-lab-textMuted hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-lab-amber">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Random Search</span>
                  </div>
                  <div className="text-[10px] text-lab-textDim mt-1 leading-snug">
                    Uninformed baseline parameter sweep
                  </div>
                </button>
              </div>
            </div>

            {/* Optimization Objective Metric */}
            <div>
              <label className="text-[11px] font-mono text-lab-textDim uppercase block mb-1.5">
                Optimization Objective Metric
              </label>
              <select
                value={targetMetric}
                onChange={(e) => setTargetMetric(e.target.value)}
                disabled={isRunning}
                className="w-full px-3 py-2 rounded bg-lab-surface border border-lab-border text-white text-xs font-mono focus:border-lab-cyan outline-none"
              >
                {!isRegression ? (
                  <>
                    <option value="f1">F1 Score (Weighted Harmonic Mean)</option>
                    <option value="accuracy">Classification Accuracy</option>
                    <option value="roc_auc">ROC-AUC Score</option>
                    <option value="precision">Precision (Weighted)</option>
                    <option value="recall">Recall (Sensitivity)</option>
                  </>
                ) : (
                  <>
                    <option value="r2">R-Squared Coefficient (R²)</option>
                    <option value="rmse">Root Mean Squared Error (RMSE)</option>
                    <option value="mae">Mean Absolute Error (MAE)</option>
                  </>
                )}
              </select>
            </div>

            {/* Experiment Budget Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                <span className="text-lab-textDim uppercase">Experiment Budget</span>
                <span className="text-white font-bold">{budget} Experiments</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                disabled={isRunning}
                className="w-full accent-lab-cyan cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-lab-textDim mt-1">
                <span>3 trials (Rapid)</span>
                <span>12 trials (Standard)</span>
                <span>25 trials (Deep)</span>
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleStart}
              disabled={isRunning || isLaunching}
              className="w-full py-3 rounded bg-lab-cyan text-black font-mono text-xs font-bold hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lab-glow flex items-center justify-center space-x-2"
            >
              <Play className="w-4 h-4 fill-black" />
              <span>{isRunning ? 'EXECUTION IN PROGRESS...' : 'START AUTONOMOUS EXPERIMENT'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Run Monitor (Section 20) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-md bg-lab-card border border-lab-border space-y-6">
            <div className="flex items-center justify-between border-b border-lab-border pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-lab-cyan" />
                <span className="font-mono text-xs font-semibold text-white uppercase">
                  LIVE EXPERIMENT MONITOR (SECTION 20)
                </span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase ${
                isRunning
                  ? 'bg-lab-cyan/15 text-lab-cyan animate-pulse border border-lab-cyan/30'
                  : currentRun?.status === 'completed'
                  ? 'bg-lab-emerald/15 text-lab-emerald border border-lab-emerald/30'
                  : 'text-lab-textDim'
              }`}>
                {currentRun?.status || 'STANDBY'}
              </span>
            </div>

            {/* Live Card */}
            {currentRun ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded bg-lab-surface border border-lab-border font-mono">
                  <div>
                    <div className="text-[10px] text-lab-textDim uppercase">
                      Current Iteration / Budget
                    </div>
                    <div className="text-2xl font-bold text-white mt-0.5">
                      RUNNING EXPERIMENT {String(currentIter).padStart(2, '0')} / {String(currentRun.budget).padStart(2, '0')}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-lab-textDim uppercase">Current Best {currentRun.target_metric.toUpperCase()}</div>
                    <div className="text-2xl font-bold text-lab-emerald mt-0.5">
                      {currentRun.best_metric_value ? currentRun.best_metric_value.toFixed(4) : '0.0000'}
                    </div>
                  </div>
                </div>

                {/* Model & Hyperparameter Inspector */}
                <div className="p-4 rounded bg-lab-surface border border-lab-border font-mono text-xs space-y-3">
                  <div className="flex justify-between items-center text-lab-textDim pb-2 border-b border-lab-border">
                    <span>Active Architecture:</span>
                    <span className="text-lab-cyan font-bold text-sm">
                      {latestExp?.model_name || 'RandomForestClassifier'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-lab-textDim uppercase block mb-1">
                      Active Parameter Values:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {latestExp?.parameters && Object.keys(latestExp.parameters).length > 0 ? (
                        Object.entries(latestExp.parameters).map(([k, v]) => (
                          <span
                            key={k}
                            className="px-2 py-1 rounded bg-lab-card border border-lab-border text-[11px] text-white"
                          >
                            <span className="text-lab-textDim">{k}:</span> {String(v)}
                          </span>
                        ))
                      ) : (
                        <span className="text-lab-textDim">Initial default baseline parameters</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Scientific 5-Stage Step Progress Pipeline */}
                <div className="space-y-2 font-mono text-xs">
                  <div className="text-[10px] text-lab-textDim uppercase mb-2">
                    Execution Stage Progression
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="p-2.5 rounded bg-lab-surface border border-lab-border flex items-center justify-between">
                      <span className="text-lab-textMuted">1. DATA PREPARATION (Zero-Leakage)</span>
                      <span className="text-lab-emerald text-sm font-bold">✓ COMPLETED</span>
                    </div>

                    <div className="p-2.5 rounded bg-lab-surface border border-lab-border flex items-center justify-between">
                      <span className="text-lab-textMuted">2. MODEL TRAINING</span>
                      <span className="text-lab-emerald text-sm font-bold">✓ COMPLETED</span>
                    </div>

                    <div className="p-2.5 rounded bg-lab-surface border border-lab-border flex items-center justify-between">
                      <span className="text-lab-textMuted">3. HOLDOUT VALIDATION</span>
                      <span className="text-lab-emerald text-sm font-bold">✓ COMPLETED</span>
                    </div>

                    <div className="p-2.5 rounded bg-lab-surface border border-lab-border flex items-center justify-between">
                      <span className="text-lab-textMuted">4. METRIC CALCULATION</span>
                      <span className="text-lab-emerald text-sm font-bold">✓ COMPLETED</span>
                    </div>

                    <div className="p-2.5 rounded bg-lab-surface border border-lab-cyan/30 flex items-center justify-between">
                      <span className="text-lab-cyan font-medium">5. AI SENSITIVITY ANALYSIS & NEXT MOVE</span>
                      <span className={isRunning ? 'text-lab-cyan animate-pulse font-bold' : 'text-lab-emerald font-bold'}>
                        {isRunning ? '● COMPUTING...' : '✓ COMPLETE'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center font-mono text-xs text-lab-textDim space-y-3">
                <Activity className="w-8 h-8 text-lab-cyan/40 mx-auto" />
                <div>No active experiment run. Configure parameters on the left and click start.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
