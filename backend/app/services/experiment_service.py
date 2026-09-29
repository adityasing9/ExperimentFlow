"""
ExperimentFlow — Modular ML & Preprocessing Services (Section 27)
"""

from typing import Dict, Any, Tuple
import pandas as pd
from app.ml.preprocessing import LeakFreePreprocessor
from app.ml.metrics import MetricsEvaluator
from app.ml.trainers import ModelTrainerRegistry


class PreprocessingService:
    @staticmethod
    def prepare_data(df: pd.DataFrame, target_col: str, problem_type: str) -> Tuple[Any, Any, Any, Any, LeakFreePreprocessor]:
        """Orchestrates zero-leakage data preparation and splitting."""
        preprocessor = LeakFreePreprocessor(problem_type=problem_type)
        X_train, X_test, y_train, y_test = preprocessor.fit_transform_split(df, target_col=target_col)
        return X_train, X_test, y_train, y_test, preprocessor


class EvaluationService:
    @staticmethod
    def evaluate(y_true, y_pred, y_prob, problem_type: str) -> Dict[str, float]:
        """Calculates multi-dimensional performance metrics."""
        return MetricsEvaluator.evaluate(y_true, y_pred, y_prob, problem_type)


class ExperimentService:
    @staticmethod
    def train_candidate(model_name: str, params: Dict[str, Any], problem_type: str, X_train, y_train, X_test):
        """Dispatches training to model registry."""
        trainer = ModelTrainerRegistry.get_trainer(model_name, problem_type)
        return trainer.train_and_predict(X_train, y_train, X_test, params)
