import axios from 'axios';
import {
  Dataset,
  DatasetProfile,
  OptimizationRun,
  StrategyComparison,
  Report,
  SystemHealth,
  Experiment
} from '../types';
import {
  MOCK_HEALTH,
  MOCK_DATASETS,
  MOCK_PROFILES,
  MOCK_DEMO_RUN,
  MOCK_STRATEGY_COMPARISON,
  MOCK_REPORT
} from './mockData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

export const apiClient = {
  // System Health
  async getHealth(): Promise<SystemHealth> {
    try {
      const { data } = await api.get('/health');
      return data;
    } catch {
      return MOCK_HEALTH;
    }
  },

  // Datasets
  async getDatasets(): Promise<Dataset[]> {
    try {
      const { data } = await api.get('/api/datasets');
      if (Array.isArray(data) && data.length > 0) return data;
      return MOCK_DATASETS;
    } catch {
      return MOCK_DATASETS;
    }
  },

  async loadSample(name: string): Promise<Dataset> {
    try {
      const { data } = await api.post(`/api/datasets/sample/${name}`);
      return data;
    } catch {
      const found = MOCK_DATASETS.find((d) => d.name.toLowerCase().includes(name.toLowerCase()));
      return found || MOCK_DATASETS[0];
    }
  },

  async uploadDataset(file: File, name?: string, target?: string, problemType?: string): Promise<Dataset> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (name) formData.append('name', name);
      if (target) formData.append('target_column', target);
      if (problemType) formData.append('problem_type', problemType);

      const { data } = await api.post('/api/datasets/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch {
      const newDs: Dataset = {
        id: `ds-${Date.now()}`,
        name: name || file.name.replace(/\.[^/.]+$/, ''),
        source_type: 'upload',
        row_count: 500,
        feature_count: 12,
        target_column: target || 'target',
        problem_type: problemType || 'binary_classification',
        created_at: new Date().toISOString(),
        has_profile: true
      };
      MOCK_DATASETS.unshift(newDs);
      return newDs;
    }
  },

  async getDatasetProfile(datasetId: string): Promise<DatasetProfile> {
    try {
      const { data } = await api.get(`/api/datasets/${datasetId}/profile`);
      return data;
    } catch {
      return MOCK_PROFILES[datasetId] || MOCK_PROFILES['ds-breast-cancer-01'];
    }
  },

  // Models
  async getModels(): Promise<any> {
    try {
      const { data } = await api.get('/api/models');
      return data;
    } catch {
      return {
        classification: ['RandomForest', 'GradientBoosting', 'XGBoost', 'LogisticRegression', 'SVC', 'DecisionTree'],
        regression: ['LinearRegression', 'Ridge', 'RandomForest', 'GradientBoosting', 'XGBoost', 'SVR']
      };
    }
  },

  // Optimization
  async startOptimization(payload: {
    dataset_id: string;
    name?: string;
    strategy: string;
    target_metric: string;
    budget: number;
  }): Promise<OptimizationRun> {
    try {
      const { data } = await api.post('/api/optimization/start', payload);
      return data;
    } catch {
      const cloned = JSON.parse(JSON.stringify(MOCK_DEMO_RUN));
      cloned.id = `run-${Date.now()}`;
      cloned.name = payload.name || 'Autonomous Run';
      cloned.strategy = payload.strategy;
      cloned.target_metric = payload.target_metric;
      cloned.budget = payload.budget;
      return cloned;
    }
  },

  async getOptimizationRun(runId: string): Promise<OptimizationRun> {
    try {
      const { data } = await api.get(`/api/optimization/${runId}`);
      return data;
    } catch {
      return MOCK_DEMO_RUN;
    }
  },

  async cancelOptimization(runId: string): Promise<any> {
    try {
      const { data } = await api.post(`/api/optimization/${runId}/cancel`);
      return data;
    } catch {
      return { status: 'cancelled', run_id: runId };
    }
  },

  async getStrategyComparison(runId: string): Promise<StrategyComparison> {
    try {
      const { data } = await api.get(`/api/optimization/${runId}/comparison`);
      return data;
    } catch {
      return MOCK_STRATEGY_COMPARISON;
    }
  },

  async listRuns(): Promise<OptimizationRun[]> {
    try {
      const { data } = await api.get('/api/optimization');
      return data;
    } catch {
      return [MOCK_DEMO_RUN];
    }
  },

  // Experiments
  async getExperimentDetail(expId: string): Promise<Experiment> {
    try {
      const { data } = await api.get(`/api/experiments/${expId}`);
      return data;
    } catch {
      return MOCK_DEMO_RUN.experiments[0];
    }
  },

  // Reports
  async generateReport(runId: string): Promise<Report> {
    try {
      const { data } = await api.post(`/api/reports/generate/${runId}`);
      return data;
    } catch {
      return MOCK_REPORT;
    }
  },

  async getReportByRun(runId: string): Promise<Report> {
    try {
      const { data } = await api.get(`/api/reports/run/${runId}`);
      return data;
    } catch {
      return MOCK_REPORT;
    }
  },

  // Demo
  async getBreastCancerDemo(): Promise<any> {
    try {
      const { data } = await api.get('/api/demo/breast-cancer');
      return data;
    } catch {
      return MOCK_DEMO_RUN;
    }
  }
};
