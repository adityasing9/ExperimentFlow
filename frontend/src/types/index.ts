export interface Dataset {
  id: string;
  name: string;
  source_type: 'sample' | 'upload';
  row_count: number;
  feature_count: number;
  target_column: string | null;
  problem_type: string | null;
  created_at: string;
  has_profile: boolean;
}

export interface DatasetSummary {
  row_count: number;
  feature_count: number;
  target_column: string | null;
  problem_type: string | null;
  missing_values_total: number;
  missing_by_column: Record<string, number>;
  numerical_columns: string[];
  categorical_columns: string[];
  memory_usage_kb: number;
}

export interface FeatureStats {
  mean?: number;
  std?: number;
  min?: number;
  q25?: number;
  median?: number;
  q75?: number;
  max?: number;
  unique_count?: number;
  top_values?: Record<string, number>;
}

export interface DatasetProfile {
  id: string;
  dataset_id: string;
  summary: DatasetSummary;
  correlations: Record<string, Record<string, number>>;
  class_distribution?: Record<string, number>;
  feature_stats: Record<string, FeatureStats>;
  created_at: string;
}

export interface ExperimentLog {
  step: string;
  message: string;
  level: string;
  timestamp: string;
}

export interface Experiment {
  id: string;
  optimization_run_id: string;
  iteration: number;
  model_name: string;
  is_baseline: boolean;
  status: 'queued' | 'running' | 'completed' | 'failed';
  training_time_sec: number;
  inference_time_ms: number;
  primary_metric_value: number | null;
  parameters: Record<string, any>;
  metrics: Record<string, number>;
  created_at: string;
  logs?: ExperimentLog[];
  error_message?: string;
}

export interface AIDecision {
  iteration: number;
  recommended_model: string;
  recommended_parameters: Record<string, any>;
  observation: string;
  rationale: string;
  expected_goal: string;
  confidence_score: number;
}

export interface OptimizationRun {
  id: string;
  dataset_id: string;
  name: string;
  strategy: 'ai_guided' | 'random_search';
  target_metric: string;
  optimization_goal: 'maximize' | 'minimize';
  budget: number;
  current_iteration: number;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';
  best_metric_value: number | null;
  best_experiment_id: string | null;
  total_duration_sec: number;
  is_demo: boolean;
  created_at: string;
  completed_at?: string;
  experiments: Experiment[];
  ai_decisions: AIDecision[];
}

export interface StrategyComparison {
  dataset_name: string;
  task_type: string;
  target_metric: string;
  random_search: {
    strategy: string;
    budget: number;
    best_score: number;
    best_model?: string;
    iterations_to_peak: number;
    trials: number[];
  };
  ai_guided_search: {
    strategy: string;
    budget: number;
    best_score: number;
    best_model?: string;
    iterations_to_peak: number;
    trials: number[];
  };
  efficiency_gain_pct: number;
  iterations_to_optimum_delta: number;
  academic_conclusion: string;
}

export interface Report {
  id: string;
  optimization_run_id: string;
  title: string;
  problem_definition: string;
  dataset_overview: Record<string, any>;
  preprocessing_summary: Record<string, any>;
  models_evaluated: string[];
  search_strategy: string;
  best_configuration: Record<string, any>;
  best_metrics: Record<string, number>;
  comparison_summary?: Record<string, any>;
  ai_reasoning_synthesis: string;
  conclusions: string[];
  limitations: string[];
  summary_markdown: string;
  created_at: string;
}

export interface SystemHealth {
  status: string;
  system: string;
  version: string;
  database: {
    status: string;
    engine: string;
  };
  ml_engine: {
    status: string;
    models_available: number;
  };
  ai_provider: {
    status: string;
    provider: string;
    model?: string;
    description?: string;
  };
}
