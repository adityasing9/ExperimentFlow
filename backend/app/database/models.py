import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    Text,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from app.database.connection import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    role = Column(String(20), default="researcher")
    created_at = Column(DateTime, default=datetime.utcnow)

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    file_path = Column(String(255), nullable=False)
    source_type = Column(String(20), default="sample") # sample or upload
    row_count = Column(Integer, default=0)
    feature_count = Column(Integer, default=0)
    target_column = Column(String(100), nullable=True)
    problem_type = Column(String(30), nullable=True) # binary_classification, multiclass_classification, regression
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    profile = relationship("DatasetProfile", back_populates="dataset", uselist=False, cascade="all, delete-orphan")
    optimization_runs = relationship("OptimizationRun", back_populates="dataset", cascade="all, delete-orphan")

class DatasetProfile(Base):
    __tablename__ = "dataset_profiles"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    dataset_id = Column(String(36), ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False)
    summary_json = Column(JSON, nullable=False)
    correlations_json = Column(JSON, nullable=True)
    class_distribution_json = Column(JSON, nullable=True)
    feature_stats_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    dataset = relationship("Dataset", back_populates="profile")

class MLModelRegistry(Base):
    __tablename__ = "models"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(50), unique=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    task_type = Column(String(30), nullable=False) # classification, regression, both
    description = Column(Text, nullable=True)
    hyperparameter_space = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class OptimizationRun(Base):
    __tablename__ = "optimization_runs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    dataset_id = Column(String(36), ForeignKey("datasets.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(150), nullable=False)
    strategy = Column(String(30), nullable=False) # ai_guided, random_search
    target_metric = Column(String(50), nullable=False) # f1, accuracy, roc_auc, r2, rmse, mae
    optimization_goal = Column(String(20), default="maximize") # maximize or minimize
    budget = Column(Integer, default=10)
    current_iteration = Column(Integer, default=0)
    status = Column(String(30), default="queued") # queued, running, completed, failed, cancelled
    best_metric_value = Column(Float, nullable=True)
    best_experiment_id = Column(String(36), nullable=True)
    total_duration_sec = Column(Float, default=0.0)
    is_demo = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    dataset = relationship("Dataset", back_populates="optimization_runs")
    experiments = relationship("Experiment", back_populates="optimization_run", cascade="all, delete-orphan", order_by="Experiment.iteration")
    ai_decisions = relationship("AIDecision", back_populates="optimization_run", cascade="all, delete-orphan", order_by="AIDecision.iteration")
    reports = relationship("Report", back_populates="optimization_run", cascade="all, delete-orphan")

class Experiment(Base):
    __tablename__ = "experiments"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    optimization_run_id = Column(String(36), ForeignKey("optimization_runs.id", ondelete="CASCADE"), nullable=False)
    iteration = Column(Integer, nullable=False)
    model_name = Column(String(50), nullable=False)
    is_baseline = Column(Boolean, default=False)
    status = Column(String(30), default="queued") # queued, running, completed, failed
    training_time_sec = Column(Float, default=0.0)
    inference_time_ms = Column(Float, default=0.0)
    primary_metric_value = Column(Float, nullable=True)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    optimization_run = relationship("OptimizationRun", back_populates="experiments")
    parameters = relationship("ExperimentParameter", back_populates="experiment", cascade="all, delete-orphan")
    metrics = relationship("ExperimentMetric", back_populates="experiment", cascade="all, delete-orphan")
    logs = relationship("ExperimentLog", back_populates="experiment", cascade="all, delete-orphan")

class ExperimentParameter(Base):
    __tablename__ = "experiment_parameters"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    experiment_id = Column(String(36), ForeignKey("experiments.id", ondelete="CASCADE"), nullable=False)
    param_name = Column(String(100), nullable=False)
    param_value = Column(String(255), nullable=False)
    param_type = Column(String(20), default="string") # float, int, string, boolean

    # Relationships
    experiment = relationship("Experiment", back_populates="parameters")

class ExperimentMetric(Base):
    __tablename__ = "experiment_metrics"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    experiment_id = Column(String(36), ForeignKey("experiments.id", ondelete="CASCADE"), nullable=False)
    metric_name = Column(String(50), nullable=False)
    metric_value = Column(Float, nullable=False)

    # Relationships
    experiment = relationship("Experiment", back_populates="metrics")

class AIDecision(Base):
    __tablename__ = "ai_decisions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    optimization_run_id = Column(String(36), ForeignKey("optimization_runs.id", ondelete="CASCADE"), nullable=False)
    iteration = Column(Integer, nullable=False)
    recommended_model = Column(String(50), nullable=False)
    recommended_parameters = Column(JSON, nullable=False)
    observation = Column(Text, nullable=False)
    rationale = Column(Text, nullable=False)
    expected_goal = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.85)
    raw_provider_name = Column(String(50), default="local_ai_heuristic")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    optimization_run = relationship("OptimizationRun", back_populates="ai_decisions")

class ExperimentLog(Base):
    __tablename__ = "experiment_logs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    experiment_id = Column(String(36), ForeignKey("experiments.id", ondelete="CASCADE"), nullable=False)
    step = Column(String(50), nullable=False) # data_prep, training, validation, metric_calc, ai_analysis
    message = Column(Text, nullable=False)
    level = Column(String(20), default="info") # info, warning, error
    timestamp = Column(DateTime, default=datetime.utcnow)

    # Relationships
    experiment = relationship("Experiment", back_populates="logs")

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    optimization_run_id = Column(String(36), ForeignKey("optimization_runs.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    content_json = Column(JSON, nullable=False)
    summary_markdown = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    optimization_run = relationship("OptimizationRun", back_populates="reports")
