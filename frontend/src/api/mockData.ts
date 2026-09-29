import {
  Dataset,
  DatasetProfile,
  OptimizationRun,
  StrategyComparison,
  Report,
  SystemHealth,
  Experiment,
  AIDecision
} from '../types';

export const MOCK_HEALTH: SystemHealth = {
  status: 'healthy',
  system: 'ExperimentFlow Autonomous ML Station',
  version: '1.0.0',
  database: {
    status: 'connected',
    engine: 'sqlite (dual-engine active)'
  },
  ml_engine: {
    status: 'online',
    models_available: 8
  },
  ai_provider: {
    status: 'active',
    provider: 'LocalAI (Deterministic Bayesian Heuristic)',
    model: 'local-bayesian-gradient',
    description: 'Autonomous gradient-directed hyperparameter mutation'
  }
};

export const MOCK_DATASETS: Dataset[] = [
  {
    id: 'ds-breast-cancer-01',
    name: 'Breast Cancer Wisconsin (Diagnostic)',
    source_type: 'sample',
    row_count: 569,
    feature_count: 30,
    target_column: 'diagnosis',
    problem_type: 'binary_classification',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    has_profile: true,
  },
  {
    id: 'ds-california-housing-02',
    name: 'California Housing Median Value',
    source_type: 'sample',
    row_count: 1500,
    feature_count: 8,
    target_column: 'MedHouseVal',
    problem_type: 'regression',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    has_profile: true,
  },
  {
    id: 'ds-titanic-03',
    name: 'Titanic Disaster Survival',
    source_type: 'sample',
    row_count: 891,
    feature_count: 11,
    target_column: 'Survived',
    problem_type: 'binary_classification',
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    has_profile: true,
  },
  {
    id: 'ds-iris-04',
    name: 'Iris Flower Morphology',
    source_type: 'sample',
    row_count: 150,
    feature_count: 4,
    target_column: 'species',
    problem_type: 'multiclass_classification',
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    has_profile: true,
  },
];

export const MOCK_PROFILES: Record<string, DatasetProfile> = {
  'ds-breast-cancer-01': {
    id: 'prof-bc-01',
    dataset_id: 'ds-breast-cancer-01',
    summary: {
      row_count: 569,
      feature_count: 30,
      target_column: 'diagnosis',
      problem_type: 'binary_classification',
      missing_values_total: 0,
      missing_by_column: {},
      numerical_columns: [
        'mean radius', 'mean texture', 'mean perimeter', 'mean area',
        'mean smoothness', 'mean compactness', 'mean concavity',
        'worst radius', 'worst texture', 'worst perimeter', 'worst area'
      ],
      categorical_columns: [],
      memory_usage_kb: 133.5
    },
    correlations: {
      'mean radius': { 'mean radius': 1.0, 'mean perimeter': 0.998, 'mean area': 0.987, 'worst radius': 0.969 },
      'mean perimeter': { 'mean radius': 0.998, 'mean perimeter': 1.0, 'mean area': 0.986, 'worst radius': 0.969 },
      'mean area': { 'mean radius': 0.987, 'mean perimeter': 0.986, 'mean area': 1.0, 'worst radius': 0.962 },
      'worst radius': { 'mean radius': 0.969, 'mean perimeter': 0.969, 'mean area': 0.962, 'worst radius': 1.0 }
    },
    class_distribution: {
      'Benign (0)': 357,
      'Malignant (1)': 212
    },
    feature_stats: {
      'mean radius': { mean: 14.127, std: 3.524, min: 6.981, median: 13.37, max: 28.11 },
      'mean texture': { mean: 19.289, std: 4.301, min: 9.71, median: 18.84, max: 39.28 },
      'mean perimeter': { mean: 91.969, std: 24.298, min: 43.79, median: 86.24, max: 188.5 },
      'mean area': { mean: 654.889, std: 351.914, min: 143.5, median: 551.1, max: 2501.0 }
    },
    created_at: new Date().toISOString()
  }
};

const createExperiments = (): Experiment[] => [
  {
    id: 'exp-00',
    optimization_run_id: 'run-demo-bc',
    iteration: 0,
    model_name: 'RandomForest',
    is_baseline: true,
    status: 'completed',
    training_time_sec: 0.42,
    inference_time_ms: 12.4,
    primary_metric_value: 0.9412,
    parameters: { n_estimators: 100, max_depth: null, min_samples_split: 2 },
    metrics: { accuracy: 0.9298, f1_score: 0.9412, precision: 0.938, recall: 0.944, log_loss: 0.24 },
    created_at: new Date(Date.now() - 3600000).toISOString(),
    logs: [
      { step: 'ingest', message: 'Loaded 569 samples. Train: 455, Test: 114', level: 'info', timestamp: '12:00:01' },
      { step: 'baseline', message: 'Anchor Baseline E00 evaluated: F1=0.9412', level: 'info', timestamp: '12:00:03' }
    ]
  },
  {
    id: 'exp-01',
    optimization_run_id: 'run-demo-bc',
    iteration: 1,
    model_name: 'LogisticRegression',
    is_baseline: false,
    status: 'completed',
    training_time_sec: 0.15,
    inference_time_ms: 4.1,
    primary_metric_value: 0.9520,
    parameters: { C: 1.0, penalty: 'l2', solver: 'lbfgs' },
    metrics: { accuracy: 0.9474, f1_score: 0.9520, precision: 0.951, recall: 0.953, log_loss: 0.19 },
    created_at: new Date(Date.now() - 3300000).toISOString(),
    logs: [
      { step: 'train', message: 'Fitted L2 regularized logistic baseline', level: 'info', timestamp: '12:00:05' }
    ]
  },
  {
    id: 'exp-02',
    optimization_run_id: 'run-demo-bc',
    iteration: 2,
    model_name: 'SVC',
    is_baseline: false,
    status: 'completed',
    training_time_sec: 0.18,
    inference_time_ms: 5.6,
    primary_metric_value: 0.9582,
    parameters: { C: 2.0, kernel: 'rbf', gamma: 'scale' },
    metrics: { accuracy: 0.9561, f1_score: 0.9582, precision: 0.959, recall: 0.957, log_loss: 0.16 },
    created_at: new Date(Date.now() - 3000000).toISOString()
  },
  {
    id: 'exp-03',
    optimization_run_id: 'run-demo-bc',
    iteration: 3,
    model_name: 'GradientBoosting',
    is_baseline: false,
    status: 'completed',
    training_time_sec: 0.55,
    inference_time_ms: 7.2,
    primary_metric_value: 0.9610,
    parameters: { n_estimators: 100, learning_rate: 0.1, max_depth: 3 },
    metrics: { accuracy: 0.9649, f1_score: 0.9610, precision: 0.962, recall: 0.960, log_loss: 0.14 },
    created_at: new Date(Date.now() - 2700000).toISOString()
  },
  {
    id: 'exp-04',
    optimization_run_id: 'run-demo-bc',
    iteration: 4,
    model_name: 'XGBoost',
    is_baseline: false,
    status: 'completed',
    training_time_sec: 0.38,
    inference_time_ms: 6.8,
    primary_metric_value: 0.9648,
    parameters: { n_estimators: 120, learning_rate: 0.08, max_depth: 4, subsample: 0.85 },
    metrics: { accuracy: 0.9649, f1_score: 0.9648, precision: 0.965, recall: 0.964, log_loss: 0.13 },
    created_at: new Date(Date.now() - 2400000).toISOString()
  },
  {
    id: 'exp-05',
    optimization_run_id: 'run-demo-bc',
    iteration: 5,
    model_name: 'XGBoost',
    is_baseline: false,
    status: 'completed',
    training_time_sec: 0.41,
    inference_time_ms: 6.5,
    primary_metric_value: 0.9705,
    parameters: { n_estimators: 150, learning_rate: 0.06, max_depth: 3, subsample: 0.9 },
    metrics: { accuracy: 0.9737, f1_score: 0.9705, precision: 0.971, recall: 0.970, log_loss: 0.11 },
    created_at: new Date(Date.now() - 2100000).toISOString()
  },
  {
    id: 'exp-06',
    optimization_run_id: 'run-demo-bc',
    iteration: 6,
    model_name: 'RandomForest',
    is_baseline: false,
    status: 'completed',
    training_time_sec: 0.48,
    inference_time_ms: 11.2,
    primary_metric_value: 0.9650,
    parameters: { n_estimators: 200, max_depth: 8, min_samples_split: 4 },
    metrics: { accuracy: 0.9649, f1_score: 0.9650, precision: 0.966, recall: 0.964, log_loss: 0.12 },
    created_at: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'exp-07',
    optimization_run_id: 'run-demo-bc',
    iteration: 7,
    model_name: 'XGBoost',
    is_baseline: false,
    status: 'completed',
    training_time_sec: 0.44,
    inference_time_ms: 6.9,
    primary_metric_value: 0.9740,
    parameters: { n_estimators: 180, learning_rate: 0.05, max_depth: 3, colsample_bytree: 0.85 },
    metrics: { accuracy: 0.9737, f1_score: 0.9740, precision: 0.975, recall: 0.973, log_loss: 0.09 },
    created_at: new Date(Date.now() - 1500000).toISOString()
  },
  {
    id: 'exp-08',
    optimization_run_id: 'run-demo-bc',
    iteration: 8,
    model_name: 'GradientBoosting',
    is_baseline: false,
    status: 'completed',
    training_time_sec: 0.62,
    inference_time_ms: 7.8,
    primary_metric_value: 0.9688,
    parameters: { n_estimators: 160, learning_rate: 0.05, max_depth: 4 },
    metrics: { accuracy: 0.9649, f1_score: 0.9688, precision: 0.970, recall: 0.967, log_loss: 0.10 },
    created_at: new Date(Date.now() - 1200000).toISOString()
  },
  {
    id: 'exp-09',
    optimization_run_id: 'run-demo-bc',
    iteration: 9,
    model_name: 'XGBoost',
    is_baseline: false,
    status: 'completed',
    training_time_sec: 0.49,
    inference_time_ms: 7.1,
    primary_metric_value: 0.9780,
    parameters: { n_estimators: 200, learning_rate: 0.045, max_depth: 3, subsample: 0.88 },
    metrics: { accuracy: 0.9825, f1_score: 0.9780, precision: 0.980, recall: 0.976, log_loss: 0.08 },
    created_at: new Date(Date.now() - 900000).toISOString()
  },
  {
    id: 'exp-10',
    optimization_run_id: 'run-demo-bc',
    iteration: 10,
    model_name: 'SVC',
    is_baseline: false,
    status: 'completed',
    training_time_sec: 0.22,
    inference_time_ms: 5.9,
    primary_metric_value: 0.9632,
    parameters: { C: 4.5, kernel: 'rbf', gamma: 0.01 },
    metrics: { accuracy: 0.9649, f1_score: 0.9632, precision: 0.964, recall: 0.962, log_loss: 0.11 },
    created_at: new Date(Date.now() - 600000).toISOString()
  },
  {
    id: 'exp-11',
    optimization_run_id: 'run-demo-bc',
    iteration: 11,
    model_name: 'XGBoost',
    is_baseline: false,
    status: 'completed',
    training_time_sec: 0.52,
    inference_time_ms: 7.4,
    primary_metric_value: 0.9824,
    parameters: { n_estimators: 220, learning_rate: 0.04, max_depth: 3, subsample: 0.9, colsample_bytree: 0.8 },
    metrics: { accuracy: 0.9825, f1_score: 0.9824, precision: 0.981, recall: 0.984, log_loss: 0.06 },
    created_at: new Date(Date.now() - 300000).toISOString(),
    logs: [
      { step: 'train', message: 'Trained XGBoost (depth=3, lr=0.04)', level: 'info', timestamp: '12:00:22' },
      { step: 'eval', message: 'F1=0.9824 | Peak optimum discovered!', level: 'success', timestamp: '12:00:23' }
    ]
  }
];

const createDecisions = (): AIDecision[] => [
  {
    iteration: 1,
    recommended_model: 'LogisticRegression',
    recommended_parameters: { C: 1.0, penalty: 'l2' },
    observation: 'Baseline Random Forest achieved F1=0.9412 with minor variance.',
    rationale: 'Establish linear decision boundary baseline to assess feature separability.',
    expected_goal: 'Determine if dataset features are linearly separable after standardization.',
    confidence_score: 0.88
  },
  {
    iteration: 4,
    recommended_model: 'XGBoost',
    recommended_parameters: { n_estimators: 120, learning_rate: 0.08, max_depth: 4 },
    observation: 'Gradient Boosting achieved F1=0.9610, showing strong responsiveness to residual fitting.',
    rationale: 'Switch to XGBoost with column subsampling to regularize high-dimensional boundary.',
    expected_goal: 'Surpass 0.965 F1 barrier via second-order Taylor expansion tree splitting.',
    confidence_score: 0.94
  },
  {
    iteration: 11,
    recommended_model: 'XGBoost',
    recommended_parameters: { n_estimators: 220, learning_rate: 0.04, max_depth: 3, subsample: 0.9 },
    observation: 'Sensitivity analysis indicates decreasing learning rate and depth 3 maximizes generalization.',
    rationale: 'Exploit optimal parameter basin with fine-grained shrinkage.',
    expected_goal: 'Reach global Pareto optimum on validation manifold.',
    confidence_score: 0.97
  }
];

export const MOCK_DEMO_RUN: OptimizationRun = {
  id: 'run-demo-bc',
  dataset_id: 'ds-breast-cancer-01',
  name: 'Breast Cancer Diagnostic Optimization',
  strategy: 'ai_guided',
  target_metric: 'f1_score',
  optimization_goal: 'maximize',
  budget: 12,
  current_iteration: 12,
  status: 'completed',
  best_metric_value: 0.9824,
  best_experiment_id: 'exp-11',
  total_duration_sec: 5.48,
  is_demo: true,
  created_at: new Date(Date.now() - 3600000).toISOString(),
  completed_at: new Date().toISOString(),
  experiments: createExperiments(),
  ai_decisions: createDecisions()
};

export const MOCK_STRATEGY_COMPARISON: StrategyComparison = {
  dataset_name: 'Breast Cancer Wisconsin (Diagnostic)',
  task_type: 'binary_classification',
  target_metric: 'f1_score',
  random_search: {
    strategy: 'Random Search',
    budget: 12,
    best_score: 0.9561,
    best_model: 'GradientBoosting',
    iterations_to_peak: 10,
    trials: [0.9412, 0.9320, 0.9480, 0.9390, 0.9510, 0.9460, 0.9561, 0.9490, 0.9520, 0.9561, 0.9500, 0.9540]
  },
  ai_guided_search: {
    strategy: 'AI-Guided Bayesian Sensitivity Search',
    budget: 12,
    best_score: 0.9824,
    best_model: 'XGBoost',
    iterations_to_peak: 8,
    trials: [0.9412, 0.9520, 0.9582, 0.9610, 0.9648, 0.9705, 0.9650, 0.9740, 0.9688, 0.9780, 0.9632, 0.9824]
  },
  efficiency_gain_pct: 2.75,
  iterations_to_optimum_delta: 2,
  academic_conclusion: 'AI-guided sensitivity search converged to superior Pareto frontier in 8 trials (+2.75% gain over random search).'
};

export const MOCK_REPORT: Report = {
  id: 'rep-demo-01',
  optimization_run_id: 'run-demo-bc',
  title: 'Autonomous ML Optimization & Experimentation Report',
  problem_definition: 'Binary classification on 30 diagnostic cell nuclei features with zero data leakage.',
  dataset_overview: {
    name: 'Breast Cancer Wisconsin (Diagnostic)',
    rows: 569,
    features: 30,
    target: 'diagnosis',
    problem_type: 'binary_classification'
  },
  preprocessing_summary: {
    split: 'Stratified 80/20 train-test split',
    scaler: 'StandardScaler fitted strictly on training partition',
    leakage_guarantee: 'Zero test data leakage verified'
  },
  models_evaluated: ['RandomForest', 'LogisticRegression', 'SVC', 'GradientBoosting', 'XGBoost'],
  search_strategy: 'AI-Guided Sensitivity Search',
  best_configuration: {
    model: 'XGBoost',
    parameters: { n_estimators: 220, learning_rate: 0.04, max_depth: 3, subsample: 0.9, colsample_bytree: 0.8 }
  },
  best_metrics: {
    f1_score: 0.9824,
    accuracy: 0.9825,
    precision: 0.981,
    recall: 0.984,
    log_loss: 0.06
  },
  comparison_summary: {
    baseline_f1: 0.9412,
    ai_best_f1: 0.9824,
    random_search_f1: 0.9561,
    delta: '+0.0412 (+4.38%)'
  },
  ai_reasoning_synthesis: 'Closed-loop Bayesian sensitivity analysis recognized that reducing learning rate while constraining tree depth to 3 yielded optimal bias-variance tradeoff.',
  conclusions: [
    'AI-guided hyperparameter mutation outperformed uninformed random search by +2.75% in final F1.',
    'Zero data leakage protocol preserved true holdout generalization accuracy.',
    'XGBoost with second-order gradient shrinkage achieved the highest stability.'
  ],
  limitations: [
    'Dataset size is moderate (569 samples); larger clinical benchmarks could warrant deep neural models.',
    'Exploration was capped at 12 iterations due to compute budget constraints.'
  ],
  summary_markdown: `# ExperimentFlow Autonomous Research Report
## Dataset: Breast Cancer Wisconsin Diagnostic

### 1. Executive Summary
An autonomous, closed-loop machine learning experiment sequence was conducted across 12 controlled iterations.
* **Baseline Anchor (E00)**: RandomForest (F1: 0.9412)
* **Champion Model (E11)**: XGBoost (F1: 0.9824)
* **Relative Improvement**: +4.38% (Absolute delta +0.0412)

### 2. Zero-Leakage Preprocessing Guarantee
All imputations and standard scalers were strictly fitted on the 80% training partition (455 samples) and validated on the isolated 20% holdout partition (114 samples).
`,
  created_at: new Date().toISOString()
};
