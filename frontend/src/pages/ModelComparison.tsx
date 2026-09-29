import React, { useState } from 'react';
import {
  Layers,
  ArrowUpDown,
  Zap,
  Clock,
  Award,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { OptimizationRun, Experiment } from '../types';

interface ModelComparisonProps {
  currentRun: OptimizationRun | null;
}

export const ModelComparison: React.FC<ModelComparisonProps> = ({ currentRun }) => {
  const [sortField, setSortField] = useState<string>('primary_metric_value');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  const experiments: Experiment[] = currentRun?.experiments || [];
  const targetMetric = currentRun?.target_metric?.toUpperCase() || 'F1';

  // Group by model architecture or show top unique models
  const uniqueModels: Record<string, Experiment> = {};
  experiments.forEach((exp) => {
    if (!uniqueModels[exp.model_name] ||
        (exp.primary_metric_value || 0) > (uniqueModels[exp.model_name].primary_metric_value || 0)) {
      uniqueModels[exp.model_name] = exp;
    }
  });

  const modelList = Object.values(uniqueModels);

  const sortedList = [...modelList].sort((a, b) => {
    let valA = 0;
    let valB = 0;

    if (sortField === 'primary_metric_value') {
      valA = a.primary_metric_value || 0;
      valB = b.primary_metric_value || 0;
    } else if (sortField === 'training_time_sec') {
      valA = a.training_time_sec;
      valB = b.training_time_sec;
    } else if (sortField === 'inference_time_ms') {
      valA = a.inference_time_ms;
      valB = b.inference_time_ms;
    } else if (sortField === 'model_name') {
      return sortAsc
        ? a.model_name.localeCompare(b.model_name)
        : b.model_name.localeCompare(a.model_name);
    }

    return sortAsc ? valA - valB : valB - valA;
  });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const bestScore = Math.max(...modelList.map((m) => m.primary_metric_value || 0));

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-xs font-mono text-lab-cyan mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>MULTI-MODEL SCIENTIFIC BENCHMARK MATRIX</span>
        </div>
        <h2 className="text-xl font-mono font-semibold text-white">
          Cross-Model Comparison & Frontier (Section 24)
        </h2>
        <p className="text-xs text-lab-textDim mt-0.5 font-mono">
          Rigorous evaluation across architecture families, latency profiles, and inductive bias efficiencies.
        </p>
      </div>

      {modelList.length > 0 ? (
        <div className="p-6 rounded-md bg-lab-card border border-lab-border space-y-4">
          <div className="flex items-center justify-between border-b border-lab-border pb-3">
            <span className="font-mono text-xs font-semibold text-white uppercase">
              Evaluated Architectures ({modelList.length} Model Classes)
            </span>
            <span className="text-[10px] font-mono text-lab-textDim">Click column headers to sort</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-lab-surface text-lab-textDim uppercase text-[10px] border-b border-lab-border">
                <tr>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => handleSort('model_name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Model Architecture</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => handleSort('primary_metric_value')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Peak {targetMetric}</span>
                      <ArrowUpDown className="w-3 h-3 text-lab-cyan" />
                    </div>
                  </th>
                  <th className="py-3 px-4">Accuracy</th>
                  <th className="py-3 px-4">Precision</th>
                  <th className="py-3 px-4">Recall</th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => handleSort('training_time_sec')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Train Time</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:text-white"
                    onClick={() => handleSort('inference_time_ms')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Inference Speed</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lab-border text-lab-text">
                {sortedList.map((m) => {
                  const isTop = (m.primary_metric_value || 0) === bestScore;
                  return (
                    <tr
                      key={m.model_name}
                      className={`hover:bg-lab-surface/60 transition-all ${
                        isTop ? 'bg-lab-emerald/5 font-medium' : ''
                      }`}
                    >
                      <td className="py-3 px-4 flex items-center space-x-2 text-white">
                        {isTop && <Award className="w-3.5 h-3.5 text-lab-emerald flex-shrink-0" />}
                        <span>{m.model_name}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-bold ${
                            isTop ? 'text-lab-emerald' : 'text-lab-cyan'
                          }`}
                        >
                          {m.primary_metric_value ? m.primary_metric_value.toFixed(4) : '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-lab-textMuted">
                        {m.metrics.accuracy ? m.metrics.accuracy.toFixed(4) : '—'}
                      </td>
                      <td className="py-3 px-4 text-lab-textDim">
                        {m.metrics.precision ? m.metrics.precision.toFixed(4) : '—'}
                      </td>
                      <td className="py-3 px-4 text-lab-textDim">
                        {m.metrics.recall ? m.metrics.recall.toFixed(4) : '—'}
                      </td>
                      <td className="py-3 px-4 text-lab-textDim">{m.training_time_sec}s</td>
                      <td className="py-3 px-4 text-lab-textDim">{m.inference_time_ms}ms</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center font-mono text-xs text-lab-textDim p-12 bg-lab-card border border-lab-border rounded">
          <Layers className="w-8 h-8 text-lab-cyan/40 mx-auto mb-2" />
          <div>No models evaluated in this session yet. Launch a run or load demo benchmark.</div>
        </div>
      )}
    </div>
  );
};
