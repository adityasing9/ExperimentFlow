import sys
import os
import pytest
import pandas as pd
import numpy as np

# Ensure backend directory is in path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from app.main import app
from app.ml.preprocessing import MLPreprocessor
from app.ml.trainers import train_and_evaluate_model
from app.ml.search_space import SEARCH_SPACES, sample_random_parameters, validate_and_clip_parameters
from app.services.ai_service import ai_provider
from app.services.dataset_service import DatasetService

client = TestClient(app)

# ----------------- 1. Dataset Tests -----------------
def test_dataset_profiling():
    df = pd.DataFrame({
        "age": [25, 30, 35, 40, np.nan],
        "salary": [50000, 60000, 80000, 100000, 120000],
        "department": ["IT", "HR", "IT", "Finance", "HR"],
        "target": [0, 1, 0, 1, 0]
    })
    profile = DatasetService.compute_profile(df, target_column="target")
    assert profile["summary"]["row_count"] == 5
    assert profile["summary"]["feature_count"] == 4
    assert profile["summary"]["missing_values_total"] == 1
    assert "age" in profile["feature_stats"]
    assert profile["class_distribution"] == {"0": 3, "1": 2}

# ----------------- 2. Preprocessing & Leak Prevention -----------------
def test_preprocessor_zero_leakage():
    df = pd.DataFrame({
        "num1": [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0, 9.0, 10.0],
        "num2": [10.0, 20.0, np.nan, 40.0, 50.0, 60.0, 70.0, 80.0, 90.0, 100.0],
        "cat1": ["a", "b", "a", "b", "a", "b", "a", "b", "a", "b"],
        "target": [0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
    })
    prep = MLPreprocessor(target_column="target", problem_type="binary_classification", test_size=0.2)
    X_train, X_test, y_train, y_test, meta = prep.fit_transform(df)

    assert len(X_train) == 8
    assert len(X_test) == 2
    assert not np.isnan(X_train).any(), "X_train must have no NaNs after imputation"
    assert not np.isnan(X_test).any(), "X_test must have no NaNs after imputation"
    assert meta["leak_prevention"] == "Strict train-split fit; test-split transform only"

# ----------------- 3. Model Training & Metrics -----------------
def test_model_training_classification():
    X_train = np.random.randn(80, 5)
    y_train = np.random.choice([0, 1], size=80)
    X_test = np.random.randn(20, 5)
    y_test = np.random.choice([0, 1], size=20)

    metrics, t_time, i_time, clean_p = train_and_evaluate_model(
        model_name="RandomForestClassifier",
        params={"n_estimators": 25, "max_depth": 4},
        X_train=X_train,
        y_train=y_train,
        X_test=X_test,
        y_test=y_test,
        task_type="classification"
    )

    assert "accuracy" in metrics
    assert "f1" in metrics
    assert t_time >= 0.0
    assert i_time >= 0.0
    assert clean_p["n_estimators"] == 25

# ----------------- 4. Search Space & Parameter Validation -----------------
def test_parameter_clipping_and_validation():
    # Provide out-of-bounds parameters
    bad_params = {"n_estimators": 5000, "max_depth": 100, "learning_rate": -0.5}
    cleaned = validate_and_clip_parameters("XGBClassifier", bad_params)

    assert cleaned["n_estimators"] <= SEARCH_SPACES["XGBClassifier"]["bounds"]["n_estimators"]["max"]
    assert cleaned["max_depth"] <= SEARCH_SPACES["XGBClassifier"]["bounds"]["max_depth"]["max"]
    assert cleaned["learning_rate"] >= SEARCH_SPACES["XGBClassifier"]["bounds"]["learning_rate"]["min"]

# ----------------- 5. AI Reasoning Engine -----------------
def test_ai_reasoning_generation():
    fake_history = [
        {"iteration": 0, "model_name": "RandomForestClassifier", "primary_metric_value": 0.88, "parameters": {"n_estimators": 100}},
        {"iteration": 1, "model_name": "RandomForestClassifier", "primary_metric_value": 0.91, "parameters": {"n_estimators": 150}},
        {"iteration": 2, "model_name": "XGBClassifier", "primary_metric_value": 0.93, "parameters": {"learning_rate": 0.08}}
    ]

    decision = ai_provider.generate_recommendation(
        task_type="classification",
        target_metric="f1",
        optimization_goal="maximize",
        experiment_history=fake_history,
        iteration=3
    )

    assert decision.recommended_model in SEARCH_SPACES
    assert decision.observation is not None
    assert decision.rationale is not None
    assert decision.confidence_score > 0.0

# ----------------- 6. API Endpoints -----------------
def test_health_endpoint():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert "database" in data
    assert "ml_engine" in data

def test_models_endpoint():
    res = client.get("/api/models")
    assert res.status_code == 200
    data = res.json()
    assert "models" in data
    assert "RandomForestClassifier" in data["models"]

def test_demo_endpoint():
    res = client.get("/api/demo/breast-cancer")
    assert res.status_code == 200
    demo = res.json()
    assert demo["is_demo"] is True
    assert len(demo["experiments"]) == 12
    assert "strategy_comparison" in demo
