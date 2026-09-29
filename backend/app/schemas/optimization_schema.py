from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, ConfigDict
from app.schemas.experiment_schema import ExperimentSummaryResponse

class AIDecisionSchema(BaseModel):
    iteration: int
    recommended_model: str
    recommended_parameters: Dict[str, Any]
    observation: str
    rationale: str
    expected_goal: str
    confidence_score: float = 0.85

class OptimizationRunCreate(BaseModel):
    dataset_id: str
    name: Optional[str] = None
    strategy: str = "ai_guided" # ai_guided, random_search
    target_metric: str = "f1" # f1, accuracy, roc_auc, r2, rmse, mae
    budget: int = Field(default=10, ge=3, le=50)

class OptimizationRunResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    id: str
    dataset_id: str
    name: str
    strategy: str
    target_metric: str
    optimization_goal: str
    budget: int
    current_iteration: int
    status: str
    best_metric_value: Optional[float] = None
    best_experiment_id: Optional[str] = None
    total_duration_sec: float
    is_demo: bool = False
    created_at: datetime
    completed_at: Optional[datetime] = None
    experiments: List[ExperimentSummaryResponse] = []
    ai_decisions: List[AIDecisionSchema] = []

class StrategyComparisonResponse(BaseModel):
    dataset_name: str
    task_type: str
    target_metric: str
    random_search: Dict[str, Any]
    ai_guided_search: Dict[str, Any]
    efficiency_gain_pct: float
    iterations_to_optimum_delta: int
    academic_conclusion: str
