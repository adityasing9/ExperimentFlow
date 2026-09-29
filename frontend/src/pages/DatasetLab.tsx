import React, { useState, useEffect } from 'react';
import {
  Database,
  Upload,
  FileText,
  BarChart2,
  Table,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../api/client';
import { Dataset, DatasetProfile } from '../types';

interface DatasetLabProps {
  onSelectDatasetForExperiment: (dataset: Dataset) => void;
}

export const DatasetLab: React.FC<DatasetLabProps> = ({ onSelectDatasetForExperiment }) => {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadName, setUploadName] = useState<string>('');
  const [uploadTarget, setUploadTarget] = useState<string>('');

  const sampleCards = [
    {
      id: 'breast_cancer',
      name: 'Breast Cancer Wisconsin',
      problem: 'Binary Classification',
      desc: '30 continuous diagnostic features, 569 patient samples. Core classification benchmark.',
      target: 'diagnosis',
      rows: 569,
      cols: 31
    },
    {
      id: 'california_housing',
      name: 'California Housing',
      problem: 'Regression',
      desc: 'Census block statistics predicting median home values. Continuous numeric regression.',
      target: 'median_house_value',
      rows: 1500,
      cols: 9
    },
    {
      id: 'titanic',
      name: 'Titanic Survival',
      problem: 'Messy Real-World Classification',
      desc: 'Passenger manifests with 860+ missing values and mixed categorical variables.',
      target: 'Survived',
      rows: 891,
      cols: 12
    },
    {
      id: 'iris',
      name: 'Iris Flower Morphology',
      problem: 'Multiclass Classification',
      desc: 'Classic 3-class botanical dataset for rapid multi-target pipeline calibration.',
      target: 'species',
      rows: 150,
      cols: 5
    }
  ];

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const list = await apiClient.getDatasets();
      setDatasets(list);
      if (list.length > 0 && !selectedDataset) {
        setSelectedDataset(list[0]);
        loadProfile(list[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch datasets');
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async (id: string) => {
    try {
      setLoading(true);
      const prof = await apiClient.getDatasetProfile(id);
      setProfile(prof);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  const handleSelectSample = async (sampleKey: string) => {
    try {
      setLoading(true);
      const ds = await apiClient.loadSample(sampleKey);
      await fetchDatasets();
      setSelectedDataset(ds);
      await loadProfile(ds.id);
    } catch (err: any) {
      setError(err.message || 'Error loading sample dataset');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    try {
      setLoading(true);
      const ds = await apiClient.uploadDataset(uploadFile, uploadName, uploadTarget);
      await fetchDatasets();
      setSelectedDataset(ds);
      await loadProfile(ds.id);
      setUploadFile(null);
      setUploadName('');
      setUploadTarget('');
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-lab-cyan mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>DATA PROFILER & REPOSITORY</span>
          </div>
          <h2 className="text-xl font-mono font-semibold text-white">
            Dataset Ingestion & Statistical Lab
          </h2>
          <p className="text-xs text-lab-textDim mt-0.5 font-mono">
            Automated column type inference, zero-leakage split preparation, and statistical distributions.
          </p>
        </div>

        {selectedDataset && (
          <button
            onClick={() => onSelectDatasetForExperiment(selectedDataset)}
            className="flex items-center space-x-2 px-4 py-2 rounded bg-lab-cyan text-black font-mono text-xs font-semibold hover:bg-cyan-300 transition-all shadow-lab-glow"
          >
            <span>Configure Experiment Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {error && (
        <div className="p-3 rounded bg-lab-rose/10 border border-lab-rose/40 text-lab-rose text-xs font-mono flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Benchmark Sample Datasets Carousel */}
      <div className="space-y-3">
        <div className="text-xs font-mono text-lab-textMuted uppercase tracking-wider flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-lab-amber" />
          <span>STANDARD BENCHMARK REPOSITORY (SECTION 11)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sampleCards.map((sample) => {
            const isCurrent = selectedDataset?.name.toLowerCase().includes(sample.id.replace('_', ' '));
            return (
              <div
                key={sample.id}
                onClick={() => handleSelectSample(sample.id)}
                className={`p-4 rounded-md border cursor-pointer transition-all space-y-2 flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-lab-card border-lab-cyan text-white shadow-lab-glow'
                    : 'bg-lab-surface border-lab-border hover:border-lab-cyan/40 text-lab-textMuted hover:text-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-lab-cyan mb-1">
                    <span>{sample.problem}</span>
                    {isCurrent && <span className="text-[10px] text-lab-emerald">● ACTIVE</span>}
                  </div>
                  <h4 className="font-mono text-xs font-semibold text-white">{sample.name}</h4>
                  <p className="text-[11px] text-lab-textDim mt-1 leading-relaxed">{sample.desc}</p>
                </div>
                <div className="pt-2 border-t border-lab-border flex items-center justify-between text-[10px] font-mono text-lab-textDim">
                  <span>Target: <span className="text-white">{sample.target}</span></span>
                  <span>{sample.rows} rows</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dataset Profile HUD & Upload Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Deep Profile Metrics */}
        <div className="lg:col-span-8 space-y-6">
          {profile ? (
            <div className="space-y-6">
              {/* Summary Metrics Bar */}
              <div className="p-6 rounded-md bg-lab-card border border-lab-border space-y-4">
                <div className="flex items-center justify-between border-b border-lab-border pb-3">
                  <div className="flex items-center space-x-2">
                    <Table className="w-4 h-4 text-lab-cyan" />
                    <span className="font-mono text-xs font-semibold text-white uppercase">
                      {selectedDataset?.name} — PROFILE OVERVIEW
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-lab-emerald bg-lab-emerald/10 border border-lab-emerald/30 px-2 py-0.5 rounded">
                    VALIDATED CSV
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono">
                  <div className="p-3 rounded bg-lab-surface border border-lab-border">
                    <div className="text-[10px] text-lab-textDim uppercase">Total Samples</div>
                    <div className="text-xl font-bold text-white mt-0.5">{profile.summary.row_count}</div>
                  </div>
                  <div className="p-3 rounded bg-lab-surface border border-lab-border">
                    <div className="text-[10px] text-lab-textDim uppercase">Feature Dimensions</div>
                    <div className="text-xl font-bold text-white mt-0.5">{profile.summary.feature_count}</div>
                  </div>
                  <div className="p-3 rounded bg-lab-surface border border-lab-border">
                    <div className="text-[10px] text-lab-textDim uppercase">Missing Values</div>
                    <div className={`text-xl font-bold mt-0.5 ${profile.summary.missing_values_total > 0 ? 'text-lab-amber' : 'text-lab-emerald'}`}>
                      {profile.summary.missing_values_total}
                    </div>
                  </div>
                  <div className="p-3 rounded bg-lab-surface border border-lab-border">
                    <div className="text-[10px] text-lab-textDim uppercase">Target Attribute</div>
                    <div className="text-xs font-bold text-lab-cyan truncate mt-2">{profile.summary.target_column || 'N/A'}</div>
                  </div>
                </div>

                {/* Class Distribution if Classification */}
                {profile.class_distribution && (
                  <div className="p-3 rounded bg-lab-surface border border-lab-border space-y-2">
                    <div className="text-[11px] font-mono text-lab-textDim uppercase">
                      Class Balance Distribution:
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      {Object.entries(profile.class_distribution).map(([cls, count]) => (
                        <div key={cls} className="flex items-center space-x-2 text-xs font-mono bg-lab-card px-2.5 py-1 rounded border border-lab-border">
                          <span className="text-lab-cyan">{cls}:</span>
                          <span className="text-white font-medium">{count}</span>
                          <span className="text-lab-textDim text-[10px]">
                            ({Math.round((count / profile.summary.row_count) * 100)}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Feature Statistical Distributions Table */}
              <div className="p-6 rounded-md bg-lab-card border border-lab-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="w-4 h-4 text-lab-cyan" />
                    <span className="font-mono text-xs font-semibold text-white uppercase">
                      Numerical Feature Statistics (Standard Moments)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-lab-textDim">
                    {profile.summary.numerical_columns.length} Numerical Columns
                  </span>
                </div>

                <div className="overflow-x-auto max-h-72">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-lab-surface text-lab-textDim uppercase text-[10px] border-b border-lab-border sticky top-0">
                      <tr>
                        <th className="py-2.5 px-3">Feature</th>
                        <th className="py-2.5 px-3">Mean</th>
                        <th className="py-2.5 px-3">Std Dev</th>
                        <th className="py-2.5 px-3">Min</th>
                        <th className="py-2.5 px-3">Median</th>
                        <th className="py-2.5 px-3">Max</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-lab-border text-lab-text">
                      {Object.entries(profile.feature_stats).map(([feat, stats]) => (
                        <tr key={feat} className="hover:bg-lab-surface/50">
                          <td className="py-2 px-3 text-white font-medium truncate max-w-xs">{feat}</td>
                          <td className="py-2 px-3 text-lab-cyan">{stats.mean !== undefined ? stats.mean : '—'}</td>
                          <td className="py-2 px-3 text-lab-textDim">{stats.std !== undefined ? stats.std : '—'}</td>
                          <td className="py-2 px-3 text-lab-textDim">{stats.min !== undefined ? stats.min : '—'}</td>
                          <td className="py-2 px-3 text-white">{stats.median !== undefined ? stats.median : '—'}</td>
                          <td className="py-2 px-3 text-lab-textDim">{stats.max !== undefined ? stats.max : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Correlation Heatmap Grid (top features) */}
              {Object.keys(profile.correlations).length > 0 && (
                <div className="p-6 rounded-md bg-lab-card border border-lab-border space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-white uppercase">
                      Correlation Matrix (Pearson ρ)
                    </span>
                    <span className="text-[10px] font-mono text-lab-textDim">Normalized [-1.0, 1.0]</span>
                  </div>

                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full">
                      <div className="grid gap-1 text-[9px] font-mono" style={{ gridTemplateColumns: `100px repeat(${Object.keys(profile.correlations).length}, minmax(42px, 1fr))` }}>
                        <div className="text-lab-textDim py-1 truncate">Features</div>
                        {Object.keys(profile.correlations).map((k) => (
                          <div key={k} className="text-lab-textDim text-center truncate px-1 py-1" title={k}>
                            {k.slice(0, 5)}
                          </div>
                        ))}

                        {Object.entries(profile.correlations).map(([rowKey, colObj]) => (
                          <React.Fragment key={rowKey}>
                            <div className="text-lab-textDim py-1 truncate font-medium" title={rowKey}>
                              {rowKey.slice(0, 12)}
                            </div>
                            {Object.entries(colObj).map(([colKey, val]) => {
                              const absVal = Math.abs(val);
                              const isPositive = val >= 0;
                              const bgStyle = isPositive
                                ? `rgba(0, 229, 255, ${absVal * 0.7})`
                                : `rgba(244, 63, 94, ${absVal * 0.7})`;
                              return (
                                <div
                                  key={colKey}
                                  className="h-8 flex items-center justify-center rounded text-white font-mono text-[9px] border border-lab-border/30"
                                  style={{ backgroundColor: bgStyle }}
                                  title={`${rowKey} ↔ ${colKey}: ${val}`}
                                >
                                  {val.toFixed(2)}
                                </div>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-md bg-lab-card border border-lab-border text-center font-mono text-xs text-lab-textDim space-y-2">
              <Database className="w-8 h-8 text-lab-cyan/50 mx-auto animate-pulse" />
              <div>Select a dataset above to inspect deep statistical profiles.</div>
            </div>
          )}
        </div>

        {/* Right Column: Custom CSV Upload & Quick Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 rounded-md bg-lab-card border border-lab-border space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono text-white font-semibold uppercase">
              <Upload className="w-4 h-4 text-lab-cyan" />
              <span>Ingest Custom CSV</span>
            </div>
            <p className="text-xs text-lab-textDim font-sans">
              Provide your own dataset. ExperimentFlow automatically prevents data leakage during transformation.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4 font-mono text-xs">
              <div className="border-2 border-dashed border-lab-border hover:border-lab-cyan/40 p-4 rounded text-center cursor-pointer transition-all">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="csv-file-input"
                />
                <label htmlFor="csv-file-input" className="cursor-pointer block space-y-1">
                  <FileText className="w-6 h-6 text-lab-textDim mx-auto" />
                  <span className="text-white font-medium block">
                    {uploadFile ? uploadFile.name : 'Select CSV file'}
                  </span>
                  <span className="text-[10px] text-lab-textDim block">Max 10MB · Comma Delimited</span>
                </label>
              </div>

              <div>
                <label className="text-[10px] text-lab-textDim uppercase block mb-1">Dataset Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Customer Churn Experiment"
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-lab-surface border border-lab-border text-white text-xs focus:border-lab-cyan outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-lab-textDim uppercase block mb-1">Target Column (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. target, churn, label"
                  value={uploadTarget}
                  onChange={(e) => setUploadTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-lab-surface border border-lab-border text-white text-xs focus:border-lab-cyan outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={!uploadFile || loading}
                className="w-full py-2.5 rounded bg-lab-cyan text-black font-semibold hover:bg-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? 'Profiling CSV...' : 'Ingest & Compute Profile'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
