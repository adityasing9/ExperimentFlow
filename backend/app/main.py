import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database.connection import init_db, SessionLocal
from app.services.dataset_service import DatasetService
from app.api import health, datasets, models, optimization, experiments, reports, demo

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("experimentflow")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 1. Initialize DB tables
    logger.info("Starting up ExperimentFlow Engine...")
    init_db()

    # 2. Seed initial sample datasets if not already registered
    try:
        db = SessionLocal()
        DatasetService.ensure_storage_dirs()

        sample_definitions = [
            ("Iris Dataset", "iris.csv", "species", "multiclass_classification"),
            ("Breast Cancer Wisconsin", "breast_cancer.csv", "diagnosis", "binary_classification"),
            ("California Housing", "california_housing.csv", "median_house_value", "regression"),
            ("Titanic Survival", "titanic.csv", "Survived", "binary_classification")
        ]

        for disp_name, fname, target, prob_type in sample_definitions:
            fpath = os.path.join(settings.datasets_dir, fname)
            if os.path.exists(fpath):
                from app.database import models as db_models
                existing = db.query(db_models.Dataset).filter(db_models.Dataset.name == disp_name).first()
                if not existing:
                    DatasetService.register_or_update_dataset(
                        db=db,
                        name=disp_name,
                        file_path=fpath,
                        source_type="sample",
                        target_column=target,
                        problem_type=prob_type
                    )
                    logger.info(f"Registered sample dataset: {disp_name}")
        db.close()
    except Exception as e:
        logger.warning(f"Initial sample dataset seeding note: {e}")

    yield
    logger.info("Shutting down ExperimentFlow Engine.")

app = FastAPI(
    title="ExperimentFlow API",
    description="AI-Powered Machine Learning Experiment Automation and Optimization Platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Permissive for easy local dev & cross-device evaluation
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routes
app.include_router(health.router)
app.include_router(datasets.router)
app.include_router(models.router)
app.include_router(optimization.router)
app.include_router(experiments.router)
app.include_router(reports.router)
app.include_router(demo.router)

@app.get("/")
def root():
    return {
        "name": "ExperimentFlow",
        "description": "AI-Powered ML Experiment Automation & Optimization Platform",
        "status": "online",
        "documentation": "/docs"
    }
