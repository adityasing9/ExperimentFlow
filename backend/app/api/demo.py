from fastapi import APIRouter
from app.utils.demo_data import DEMO_BREAST_CANCER_RUN

router = APIRouter(prefix="/api/demo", tags=["Demo"])

@router.get("/breast-cancer")
def get_breast_cancer_demo():
    """Returns verified 12-iteration benchmark demo run for instant evaluation."""
    return DEMO_BREAST_CANCER_RUN
