from fastapi import APIRouter
from app.ml.search_space import SEARCH_SPACES

router = APIRouter(prefix="/api/models", tags=["Models"])

@router.get("")
def list_models_and_search_spaces():
    return {
        "models": SEARCH_SPACES,
        "supported_metrics": {
            "classification": ["f1", "accuracy", "precision", "recall", "roc_auc", "f1_macro"],
            "regression": ["r2", "rmse", "mae", "mse", "explained_variance"]
        },
        "default_metrics": {
            "classification": "f1",
            "regression": "r2"
        }
    }
