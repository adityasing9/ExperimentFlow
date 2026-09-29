import time
import numpy as np
from typing import Dict, Any, Tuple
from sklearn.linear_model import LogisticRegression, LinearRegression, Ridge
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.ensemble import (
    RandomForestClassifier,
    RandomForestRegressor,
    GradientBoostingClassifier,
    GradientBoostingRegressor,
)
from sklearn.neighbors import KNeighborsClassifier, KNeighborsRegressor
from sklearn.svm import SVC, SVR
import xgboost as xgb

from app.ml.metrics import MetricEvaluator
from app.ml.search_space import validate_and_clip_parameters

MODEL_CLASS_MAP = {
    # Classifiers
    "LogisticRegression": LogisticRegression,
    "DecisionTreeClassifier": DecisionTreeClassifier,
    "RandomForestClassifier": RandomForestClassifier,
    "GradientBoostingClassifier": GradientBoostingClassifier,
    "XGBClassifier": xgb.XGBClassifier,
    "KNeighborsClassifier": KNeighborsClassifier,
    "SVC": SVC,

    # Regressors
    "LinearRegression": LinearRegression,
    "Ridge": Ridge,
    "DecisionTreeRegressor": DecisionTreeRegressor,
    "RandomForestRegressor": RandomForestRegressor,
    "GradientBoostingRegressor": GradientBoostingRegressor,
    "XGBRegressor": xgb.XGBRegressor,
    "KNeighborsRegressor": KNeighborsRegressor,
    "SVR": SVR,
}

def train_and_evaluate_model(
    model_name: str,
    params: Dict[str, Any],
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_test: np.ndarray,
    y_test: np.ndarray,
    task_type: str = "classification",
    random_state: int = 42
) -> Tuple[Dict[str, float], float, float, Dict[str, Any]]:
    """
    Instantiates, trains, measures, and evaluates a target model.
    Returns:
        metrics (Dict[str, float]),
        training_time_sec (float),
        inference_time_ms (float),
        clean_params (Dict[str, Any])
    """
    if model_name not in MODEL_CLASS_MAP:
        raise ValueError(f"Unsupported model: {model_name}. Allowed: {list(MODEL_CLASS_MAP.keys())}")

    clean_params = validate_and_clip_parameters(model_name, params)
    model_cls = MODEL_CLASS_MAP[model_name]

    # Inject random_state if supported
    instantiation_params = dict(clean_params)
    if "random_state" in model_cls.__init__.__code__.co_varnames:
        instantiation_params["random_state"] = random_state

    # SVC probability flag for ROC-AUC
    if model_name == "SVC":
        instantiation_params["probability"] = True

    model_instance = model_cls(**instantiation_params)

    # 1. Training Phase
    start_train = time.perf_counter()
    model_instance.fit(X_train, y_train)
    training_time_sec = round(time.perf_counter() - start_train, 4)

    # 2. Inference Phase
    start_infer = time.perf_counter()
    y_pred = model_instance.predict(X_test)
    inference_time_ms = round((time.perf_counter() - start_infer) * 1000.0, 3)

    # 3. Metric Evaluation
    if "classification" in task_type:
        y_prob = None
        if hasattr(model_instance, "predict_proba"):
            try:
                y_prob = model_instance.predict_proba(X_test)
            except Exception:
                y_prob = None
        metrics = MetricEvaluator.evaluate_classification(y_test, y_pred, y_prob)
    else:
        metrics = MetricEvaluator.evaluate_regression(y_test, y_pred)

    return metrics, training_time_sec, inference_time_ms, clean_params
