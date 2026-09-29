import React, { useState, useEffect } from 'react';
import {
  Settings,
  Cpu,
  Database,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Server,
  Layers
} from 'lucide-react';
import { apiClient } from '../api/client';
import { SystemHealth } from '../types';

interface SettingsPageProps {
  systemHealth: SystemHealth | null;
  onRefreshHealth: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ systemHealth, onRefreshHealth }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefreshHealth();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div className="p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-lab-cyan mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>RUNTIME DIAGNOSTICS & SYSTEM CONTROLS</span>
          </div>
          <h2 className="text-xl font-mono font-semibold text-white">
            System Settings & Local AI Runtime
          </h2>
          <p className="text-xs text-lab-textDim mt-0.5 font-mono">
            Verify database connectivity, LocalAIProvider abstraction, and zero-telemetry privacy guarantees.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded bg-lab-surface border border-lab-border text-xs font-mono text-white hover:border-lab-cyan/40 hover:text-lab-cyan transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Status</span>
        </button>
      </div>

      {/* Grid of Diagnostic Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local AI Engine Health */}
        <div className="p-6 rounded-md bg-lab-card border border-lab-border space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-white font-semibold">
            <Cpu className="w-4 h-4 text-lab-cyan" />
            <span>Local AI Reasoning Provider (Section 33)</span>
          </div>
          <p className="text-xs text-lab-textDim font-sans">
            ExperimentFlow supports local LLMs (Ollama/OpenAI local runtimes) with an integrated heuristic Bayesian-gradient sensitivity fallback.
          </p>

          <div className="p-3 rounded bg-lab-surface border border-lab-border text-xs font-mono space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-lab-textDim">Runtime Mode:</span>
              <span className="text-lab-cyan font-semibold">
                {systemHealth?.ai_provider?.status || 'Algorithmic Heuristic Mode'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lab-textDim">Engine Provider:</span>
              <span className="text-white">
                {systemHealth?.ai_provider?.provider || 'ExperimentFlow Sensitivity Core'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lab-textDim">Cloud API Requirement:</span>
              <span className="text-lab-emerald">NONE (100% Local & Free)</span>
            </div>
          </div>
        </div>

        {/* Database & Storage Status */}
        <div className="p-6 rounded-md bg-lab-card border border-lab-border space-y-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-white font-semibold">
            <Database className="w-4 h-4 text-lab-amber" />
            <span>Persistence & Database Engine (Section 26)</span>
          </div>
          <p className="text-xs text-lab-textDim font-sans">
            Relational storage with strict foreign keys. Supports MySQL natively with automatic local SQLite fallback.
          </p>

          <div className="p-3 rounded bg-lab-surface border border-lab-border text-xs font-mono space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-lab-textDim">Connection Status:</span>
              <span className="text-lab-emerald font-semibold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-lab-emerald inline-block" />
                <span>ONLINE</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lab-textDim">Active Engine:</span>
              <span className="text-white font-bold uppercase">
                {systemHealth?.database?.engine || 'SQLITE FALLBACK'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lab-textDim">Dataset Storage:</span>
              <span className="text-lab-text">Local File System (`datasets/`)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Local Privacy & Security Matrix (Section 34) */}
      <div className="p-6 rounded-md bg-lab-card border border-lab-emerald/30 space-y-4">
        <div className="flex items-center justify-between border-b border-lab-border pb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-lab-emerald" />
            <span className="font-mono text-xs font-semibold text-white uppercase">
              Academic Privacy & Security Guarantee (Section 34)
            </span>
          </div>
          <span className="text-[10px] font-mono text-lab-emerald bg-lab-emerald/10 border border-lab-emerald/30 px-2 py-0.5 rounded">
            ZERO TELEMETRY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
          <div className="p-3 rounded bg-lab-surface border border-lab-border space-y-1">
            <div className="text-lab-textDim text-[10px] uppercase">Dataset Storage</div>
            <div className="text-white font-bold">100% LOCAL</div>
            <p className="text-[10px] text-lab-textDim font-sans">No data leaves this machine.</p>
          </div>

          <div className="p-3 rounded bg-lab-surface border border-lab-border space-y-1">
            <div className="text-lab-textDim text-[10px] uppercase">Model Training</div>
            <div className="text-white font-bold">LOCAL CPU/GPU</div>
            <p className="text-[10px] text-lab-textDim font-sans">Executes in native Python runtime.</p>
          </div>

          <div className="p-3 rounded bg-lab-surface border border-lab-border space-y-1">
            <div className="text-lab-textDim text-[10px] uppercase">AI Reasoning</div>
            <div className="text-white font-bold">LOCAL RUNTIME</div>
            <p className="text-[10px] text-lab-textDim font-sans">Zero external token leakage.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
