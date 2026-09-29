from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import models
from app.database.connection import get_db
from app.schemas.experiment_schema import ExperimentDetailResponse, ExperimentLogSchema

router = APIRouter(prefix="/api/experiments", tags=["Experiments"])

@router.get("/{experiment_id}", response_model=ExperimentDetailResponse)
def get_experiment_detail(experiment_id: str, db: Session = Depends(get_db)):
    exp = db.query(models.Experiment).filter(models.Experiment.id == experiment_id).first()
    if not exp:
        raise HTTPException(status_code=404, detail="Experiment not found.")

    params_dict = {p.param_name: p.param_value for p in exp.parameters}
    metrics_dict = {m.metric_name: m.metric_value for m in exp.metrics}
    logs_data = [
        ExperimentLogSchema(
            step=l.step,
            message=l.message,
            level=l.level,
            timestamp=l.timestamp
        ) for l in exp.logs
    ]

    return ExperimentDetailResponse(
        id=exp.id,
        optimization_run_id=exp.optimization_run_id,
        iteration=exp.iteration,
        model_name=exp.model_name,
        is_baseline=exp.is_baseline,
        status=exp.status,
        training_time_sec=exp.training_time_sec,
        inference_time_ms=exp.inference_time_ms,
        primary_metric_value=exp.primary_metric_value,
        error_message=exp.error_message,
        parameters=params_dict,
        metrics=metrics_dict,
        logs=logs_data,
        created_at=exp.created_at
    )
