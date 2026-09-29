from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, ConfigDict

class ReportSection(BaseModel):
    title: str
    body: str
    key_metrics: Optional[Dict[str, Any]] = None

class ReportResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    id: str
    optimization_run_id: str
    title: str
    problem_definition: str
    dataset_overview: Dict[str, Any]
    preprocessing_summary: Dict[str, Any]
    models_evaluated: List[str]
    search_strategy: str
    best_configuration: Dict[str, Any]
    best_metrics: Dict[str, float]
    comparison_summary: Optional[Dict[str, Any]] = None
    ai_reasoning_synthesis: str
    conclusions: List[str]
    limitations: List[str]
    summary_markdown: str
    created_at: datetime
