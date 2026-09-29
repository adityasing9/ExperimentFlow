import React, { useState } from 'react';
import {
  GitBranch,
  CheckCircle2,
  Cpu,
  Clock,
  ChevronRight,
  TrendingUp,
  FileCode,
  Zap
} from 'lucide-react';
import { OptimizationRun, Experiment } from '../types';

interface ExperimentTimelineProps {
  currentRun: OptimizationRun | null;
}

export const ExperimentTimeline: React.FC<ExperimentTimelineProps> = ({ currentRun }) => {
  const [selectedExpId, setSelectedExpId] = useState<string | null>(null);

  const experiments = currentRun?.experiments || [];
  const selectedExp = experiments.find((e) => e.id === selectedExpId) || experiments[0];
  const targetMetric = currentRun?.target_metric || 'f1';

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-lab-cyan mb-1">
          <GitBranch className="w-3.5 h-3.5" />
          <span>EXPERIMENT TRAJECTORY & HYPERPARAMETER HISTORY</span>
        </div>
        <h2 className="text-xl font-mono font-semibold text-white">
          Sequential Experiment Timeline (Section 21)
        </h2>
        <p className="text-xs text-lab-textDim mt-0.5 font-mono">
          Audit every trial in chronological order with AI reasoning hypotheses and parameter values.
        </p>
      </div>

      {experiments.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Interactive Timeline Node Chain */}
          <div className="lg:col-span-7 space-y-4">
            <div className="text-xs font-mono text-lab-textDim uppercase tracking-wider mb-2">
              Execution Sequence ({experiments.length} Experiments)
            </div>

            <div className="relative pl-6 border-l-2 border-lab-border space-y-4">
              {experiments.map((exp, idx) => {
                const isSelected = selectedExp?.id === exp.id;
                const isBest = exp.id === currentRun?.best_experiment_id;
                const aiDecision = currentRun?.ai_decisions?.find((d) => d.iteration === exp.iteration);

                return (
                  <div
                    key={exp.id || idx}
                    onClick={() => setSelectedExpId(exp.id)}
                    className={`relative p-4 rounded-md border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-lab-card border-lab-cyan shadow-lab-glow'
                        : 'bg-lab-surface border-lab-border hover:border-lab-cyan/40'
                    }`}
                  >
                    {/* Timeline Node Indicator on the line */}
                    <div
                      className={`absolute -left-[31px] top-5 w-3 h-3 rounded-full border-2 ${
                        isBest
                          ? 'bg-lab-emerald border-lab-emerald ring-2 ring-emerald-500/20'
                          : exp.is_baseline
                          ? 'bg-lab-amber border-lab-amber'
                          : 'bg-lab-cyan border-lab-cyan'
                      }`}
                    />

                    <div className="flex items-center justify-between font-mono text-xs mb-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="text-lab-textDim font-bold">
                          {exp.is_baseline ? 'TRIAL 00 [BASELINE]' : `TRIAL ${String(exp.iteration).padStart(2, '0')}`}
                        </span>
                        <span className="text-lab-border">·</span>
                        <span className="text-white font-semibold">{exp.model_name}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {isBest && (
                          <span className="text-[10px] bg-lab-emerald/15 border border-lab-emerald/40 text-lab-emerald px-2 py-0.5 rounded font-bold">
                            CURRENT BEST
                          </span>
                        )}
                        <span className="text-lab-emerald font-bold text-sm">
                          {targetMetric.toUpperCase()}: {exp.primary_metric_value?.toFixed(4) || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* AI Decision Observation snippet if present */}
                    {aiDecision && (
                      <div className="mt-2 p-2 rounded bg-lab-bg/60 border border-lab-cyan/20 text-[11px] font-mono text-lab-cyan flex items-start space-x-2">
                        <Cpu className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">AI Rationale: </span>
                          <span className="text-lab-text">{aiDecision.rationale}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-[10px] font-mono text-lab-textDim mt-2 pt-2 border-t border-lab-border/40">
                      <span>Training Latency: {exp.training_time_sec}s</span>
                      <span className="flex items-center space-x-1 text-lab-cyan">
                        <span>Inspect Parameters</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Experiment Inspector & Parameter Vector */}
          <div className="lg:col-span-5 space-y-6">
            {selectedExp ? (
              <div className="p-6 rounded-md bg-lab-card border border-lab-border space-y-6 sticky top-20">
                <div className="border-b border-lab-border pb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-lab-textDim uppercase">
                      Experiment Detail Inspector
                    </div>
                    <h3 className="font-mono text-sm font-semibold text-white">
                      Trial {selectedExp.iteration}: {selectedExp.model_name}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-lab-surface border border-lab-border text-lab-cyan">
                    ID: {selectedExp.id.slice(0, 8)}
                  </span>
                </div>

                {/* Primary Metric Scorecard */}
                <div className="p-4 rounded bg-lab-surface border border-lab-border font-mono flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-lab-textDim uppercase">Target Score</div>
                    <div className="text-2xl font-bold text-white mt-0.5">
                      {selectedExp.primary_metric_value?.toFixed(4) || 'N/A'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-lab-textDim uppercase">Metric</div>
                    <div className="text-sm font-bold text-lab-cyan uppercase">{targetMetric}</div>
                  </div>
                </div>

                {/* All Calculated Scientific Metrics */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-lab-textDim uppercase">
                    Calculated Metrics Vector
                  </div>
                  <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                    {Object.entries(selectedExp.metrics).map(([mName, mVal]) => (
                      <div key={mName} className="p-2 rounded bg-lab-surface border border-lab-border">
                        <div className="text-[10px] text-lab-textDim uppercase truncate">{mName}</div>
                        <div className="text-white font-semibold mt-0.5">{mVal.toFixed(4)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hyperparameter Settings */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-lab-textDim uppercase">
                    Configured Hyperparameters
                  </div>
                  <div className="p-3 rounded bg-lab-surface border border-lab-border space-y-1.5 font-mono text-xs">
                    {Object.entries(selectedExp.parameters).map(([pName, pVal]) => (
                      <div key={pName} className="flex justify-between items-center py-0.5 border-b border-lab-border/30 last:border-b-0">
                        <span className="text-lab-textMuted">{pName}:</span>
                        <span className="text-lab-cyan font-medium">{String(pVal)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Latency Profile */}
                <div className="p-3 rounded bg-lab-surface border border-lab-border font-mono text-xs flex justify-between">
                  <span className="text-lab-textDim">Train Time: <span className="text-white">{selectedExp.training_time_sec}s</span></span>
                  <span className="text-lab-textDim">Inference Latency: <span className="text-white">{selectedExp.inference_time_ms}ms</span></span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="py-20 text-center font-mono text-xs text-lab-textDim space-y-3 p-12 bg-lab-card border border-lab-border rounded">
          <GitBranch className="w-8 h-8 text-lab-cyan/40 mx-auto" />
          <div>No experiment trajectory recorded yet. Launch an experiment from Experiment Studio.</div>
        </div>
      )}
    </div>
  );
};
