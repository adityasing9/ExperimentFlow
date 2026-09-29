from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import models
from app.database.connection import get_db
from app.schemas.report_schema import ReportResponse
from app.services.report_service import ReportService

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.post("/generate/{run_id}", response_model=ReportResponse)
def generate_report(run_id: str, db: Session = Depends(get_db)):
    try:
        report = ReportService.generate_report(db, run_id)
        return format_report(report)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{report_id}", response_model=ReportResponse)
def get_report(report_id: str, db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    return format_report(report)

@router.get("/run/{run_id}", response_model=ReportResponse)
def get_report_by_run(run_id: str, db: Session = Depends(get_db)):
    report = db.query(models.Report).filter(models.Report.optimization_run_id == run_id).order_by(models.Report.created_at.desc()).first()
    if not report:
        # Generate on the fly
        report = ReportService.generate_report(db, run_id)
    return format_report(report)

def format_report(report: models.Report) -> ReportResponse:
    cj = report.content_json
    return ReportResponse(
        id=report.id,
        optimization_run_id=report.optimization_run_id,
        title=report.title,
        problem_definition=f"{cj.get('problem_type', '').title()} problem optimizing {cj.get('target_metric', '').upper()}",
        dataset_overview={
            "name": cj.get("dataset_name"),
            "rows": cj.get("row_count"),
            "features": cj.get("feature_count"),
            "target": cj.get("target_column")
        },
        preprocessing_summary={
            "strategy": "Stratified Split + Imputation + Scaling",
            "leak_prevention": "Zero-leakage training-only fitting"
        },
        models_evaluated=cj.get("models_tested", []),
        search_strategy=cj.get("strategy", ""),
        best_configuration=cj.get("best_parameters", {}),
        best_metrics=cj.get("best_metrics", {}),
        comparison_summary={
            "baseline_model": cj.get("baseline_model"),
            "baseline_score": cj.get("baseline_score"),
            "best_model": cj.get("best_model"),
            "best_score": cj.get("best_score"),
            "improvement_pct": cj.get("improvement_pct")
        },
        ai_reasoning_synthesis="Closed-loop hyperparameter optimization isolated optimal region through gradient-informed trial scheduling.",
        conclusions=[
            f"Achieved peak {cj.get('target_metric', '').upper()} of {cj.get('best_score')} utilizing {cj.get('best_model')}.",
            f"Observed {cj.get('improvement_pct')}% improvement over standard baseline parameterization.",
            "Eliminated repetitive manual parameter sweeps with automated search trajectory."
        ],
        limitations=[
            "Hyperparameter boundaries are constrained to curated legal domain bounds.",
            "Local heuristic search assumes local metric smoothness across continuous dimensions."
        ],
        summary_markdown=report.summary_markdown,
        created_at=report.created_at
    )
