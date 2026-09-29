import os
import shutil
from typing import List, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.config import settings
from app.database import models
from app.database.connection import get_db
from app.schemas.dataset_schema import DatasetResponse, DatasetProfileResponse
from app.services.dataset_service import DatasetService

router = APIRouter(prefix="/api/datasets", tags=["Datasets"])

@router.get("", response_model=List[DatasetResponse])
def list_datasets(db: Session = Depends(get_db)):
    datasets = db.query(models.Dataset).order_by(models.Dataset.created_at.desc()).all()
    results = []
    for d in datasets:
        results.append(DatasetResponse(
            id=d.id,
            name=d.name,
            source_type=d.source_type,
            row_count=d.row_count,
            feature_count=d.feature_count,
            target_column=d.target_column,
            problem_type=d.problem_type,
            created_at=d.created_at,
            has_profile=(d.profile is not None)
        ))
    return results

@router.post("/sample/{name}", response_model=DatasetResponse)
def load_sample_dataset(name: str, db: Session = Depends(get_db)):
    normalized = name.lower().replace("-", "_").replace(" ", "_")
    sample_files = {
        "iris": ("Iris Dataset", "iris.csv", "species", "multiclass_classification"),
        "breast_cancer": ("Breast Cancer Wisconsin", "breast_cancer.csv", "diagnosis", "binary_classification"),
        "california_housing": ("California Housing", "california_housing.csv", "median_house_value", "regression"),
        "titanic": ("Titanic Survival", "titanic.csv", "Survived", "binary_classification")
    }

    if normalized not in sample_files:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown sample dataset '{name}'. Available: {list(sample_files.keys())}"
        )

    disp_name, filename, target, prob_type = sample_files[normalized]
    file_path = os.path.join(settings.datasets_dir, filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"Sample file {filename} not found on disk.")

    # Check if already exists in DB
    existing = db.query(models.Dataset).filter(models.Dataset.name == disp_name).first()
    if existing:
        return DatasetResponse(
            id=existing.id,
            name=existing.name,
            source_type=existing.source_type,
            row_count=existing.row_count,
            feature_count=existing.feature_count,
            target_column=existing.target_column,
            problem_type=existing.problem_type,
            created_at=existing.created_at,
            has_profile=(existing.profile is not None)
        )

    ds = DatasetService.register_or_update_dataset(
        db=db,
        name=disp_name,
        file_path=file_path,
        source_type="sample",
        target_column=target,
        problem_type=prob_type
    )

    return DatasetResponse(
        id=ds.id,
        name=ds.name,
        source_type=ds.source_type,
        row_count=ds.row_count,
        feature_count=ds.feature_count,
        target_column=ds.target_column,
        problem_type=ds.problem_type,
        created_at=ds.created_at,
        has_profile=(ds.profile is not None)
    )

@router.post("/upload", response_model=DatasetResponse)
async def upload_dataset(
    file: UploadFile = File(...),
    name: Optional[str] = Form(None),
    target_column: Optional[str] = Form(None),
    problem_type: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    # Validation
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files (.csv) are currently supported.")

    os.makedirs(settings.upload_dir, exist_ok=True)
    clean_filename = f"{os.path.splitext(file.filename)[0]}_{os.urandom(4).hex()}.csv"
    save_path = os.path.join(settings.upload_dir, clean_filename)

    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    dataset_name = name or file.filename.replace(".csv", "").replace("_", " ").title()

    try:
        ds = DatasetService.register_or_update_dataset(
            db=db,
            name=dataset_name,
            file_path=save_path,
            source_type="upload",
            target_column=target_column,
            problem_type=problem_type
        )
    except Exception as e:
        if os.path.exists(save_path):
            os.remove(save_path)
        raise HTTPException(status_code=400, detail=f"Failed to process CSV: {str(e)}")

    return DatasetResponse(
        id=ds.id,
        name=ds.name,
        source_type=ds.source_type,
        row_count=ds.row_count,
        feature_count=ds.feature_count,
        target_column=ds.target_column,
        problem_type=ds.problem_type,
        created_at=ds.created_at,
        has_profile=(ds.profile is not None)
    )

@router.get("/{dataset_id}/profile", response_model=DatasetProfileResponse)
def get_dataset_profile(dataset_id: str, db: Session = Depends(get_db)):
    profile = db.query(models.DatasetProfile).filter(models.DatasetProfile.dataset_id == dataset_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Dataset profile not found.")

    return DatasetProfileResponse(
        id=profile.id,
        dataset_id=profile.dataset_id,
        summary=profile.summary_json,
        correlations=profile.correlations_json or {},
        class_distribution=profile.class_distribution_json,
        feature_stats=profile.feature_stats_json or {},
        created_at=profile.created_at
    )
