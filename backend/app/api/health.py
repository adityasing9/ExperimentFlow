from fastapi import APIRouter
from app.database.connection import DB_ENGINE_TYPE
from app.services.ai_service import ai_provider
from app.ml.trainers import MODEL_CLASS_MAP

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    ai_status = ai_provider.health_check()
    return {
        "status": "healthy",
        "system": "ExperimentFlow Engine",
        "version": "1.0.0",
        "database": {
            "status": "connected",
            "engine": DB_ENGINE_TYPE
        },
        "ml_engine": {
            "status": "ready",
            "models_available": len(MODEL_CLASS_MAP)
        },
        "ai_provider": ai_status
    }
