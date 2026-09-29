from datetime import datetime
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, ConfigDict

class DatasetSummary(BaseModel):
    row_count: int
    feature_count: int
    target_column: Optional[str] = None
    problem_type: Optional[str] = None
    missing_values_total: int
    missing_by_column: Dict[str, int]
    numerical_columns: List[str]
    categorical_columns: List[str]
    memory_usage_kb: float

class FeatureStats(BaseModel):
    mean: Optional[float] = None
    std: Optional[float] = None
    min: Optional[float] = None
    q25: Optional[float] = None
    median: Optional[float] = None
    q75: Optional[float] = None
    max: Optional[float] = None
    unique_count: Optional[int] = None
    top_values: Optional[Dict[str, int]] = None

class DatasetProfileResponse(BaseModel):
    id: str
    dataset_id: str
    summary: DatasetSummary
    correlations: Dict[str, Dict[str, float]]
    class_distribution: Optional[Dict[str, int]] = None
    feature_stats: Dict[str, FeatureStats]
    created_at: datetime

class DatasetResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True, protected_namespaces=())

    id: str
    name: str
    source_type: str
    row_count: int
    feature_count: int
    target_column: Optional[str] = None
    problem_type: Optional[str] = None
    created_at: datetime
    has_profile: bool = False

class DatasetCreate(BaseModel):
    name: str
    target_column: Optional[str] = None
    problem_type: Optional[str] = None
