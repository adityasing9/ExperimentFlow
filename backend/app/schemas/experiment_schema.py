from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict

class ExperimentParameterSchema(BaseModel):
    name: str
    value: Any
    param_type: str

class ExperimentMetricSchema(BaseModel):
    name: str
    value: float

class ExperimentLogSchema(BaseModel):
    step: str
    message: str
    level: str
    timestamp: datetime

class ExperimentSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    id: str
    optimization_run_id: str
    iteration: int
    model_name: str
    is_baseline: bool
    status: str
    training_time_sec: float
    inference_time_ms: float
    primary_metric_value: Optional[float] = None
    parameters: Dict[str, Any]
    metrics: Dict[str, float]
    created_at: datetime

class ExperimentDetailResponse(ExperimentSummaryResponse):
    error_message: Optional[str] = None
    logs: List[ExperimentLogSchema] = []
