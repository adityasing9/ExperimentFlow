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

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiClient = {
  // System Health
  async getHealth(): Promise<SystemHealth> {
    const { data } = await api.get('/health');
    return data;
  },

  // Datasets
  async getDatasets(): Promise<Dataset[]> {
    const { data } = await api.get('/api/datasets');
    return data;
  },

  async loadSample(name: string): Promise<Dataset> {
    const { data } = await api.post(`/api/datasets/sample/${name}`);
    return data;
  },

  async uploadDataset(file: File, name?: string, target?: string, problemType?: string): Promise<Dataset> {
    const formData = new FormData();
    formData.append('file', file);
    if (name) formData.append('name', name);
    if (target) formData.append('target_column', target);
    if (problemType) formData.append('problem_type', problemType);

    const { data } = await api.post('/api/datasets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async getDatasetProfile(datasetId: string): Promise<DatasetProfile> {
    const { data } = await api.get(`/api/datasets/${datasetId}/profile`);
    return data;
  },

  // Models
  async getModels(): Promise<any> {
    const { data } = await api.get('/api/models');
    return data;
  },

  // Optimization
  async startOptimization(payload: {
    dataset_id: string;
    name?: string;
    strategy: string;
    target_metric: string;
    budget: number;
  }): Promise<OptimizationRun> {
    const { data } = await api.post('/api/optimization/start', payload);
    return data;
  },

  async getOptimizationRun(runId: string): Promise<OptimizationRun> {
    const { data } = await api.get(`/api/optimization/${runId}`);
    return data;
  },

  async cancelOptimization(runId: string): Promise<any> {
    const { data } = await api.post(`/api/optimization/${runId}/cancel`);
    return data;
  },

  async getStrategyComparison(runId: string): Promise<StrategyComparison> {
    const { data } = await api.get(`/api/optimization/${runId}/comparison`);
    return data;
  },

  async listRuns(): Promise<OptimizationRun[]> {
    const { data } = await api.get('/api/optimization');
    return data;
  },

  // Experiments
  async getExperimentDetail(expId: string): Promise<Experiment> {
    const { data } = await api.get(`/api/experiments/${expId}`);
    return data;
  },

  // Reports
  async generateReport(runId: string): Promise<Report> {
    const { data } = await api.post(`/api/reports/generate/${runId}`);
    return data;
  },

  async getReportByRun(runId: string): Promise<Report> {
    const { data } = await api.get(`/api/reports/run/${runId}`);
    return data;
  },

  // Demo
  async getBreastCancerDemo(): Promise<any> {
    const { data } = await api.get('/api/demo/breast-cancer');
    return data;
  }
};
