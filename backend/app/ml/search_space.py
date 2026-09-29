import random
from typing import Dict, Any, List, Optional

# Definition of the model search spaces and default configurations

SEARCH_SPACES: Dict[str, Dict[str, Any]] = {
    # ------------------ CLASSIFIERS ------------------
    "LogisticRegression": {
        "task": "classification",
        "display_name": "Logistic Regression",
        "default": {"C": 1.0, "max_iter": 500, "solver": "lbfgs"},
        "bounds": {
            "C": {"type": "float", "min": 0.01, "max": 10.0, "step": 0.01},
            "max_iter": {"type": "int", "min": 100, "max": 1000, "step": 50},
            "solver": {"type": "categorical", "choices": ["lbfgs", "liblinear"]}
        }
    },
    "DecisionTreeClassifier": {
        "task": "classification",
        "display_name": "Decision Tree",
        "default": {"max_depth": 5, "min_samples_split": 2, "min_samples_leaf": 1},
        "bounds": {
            "max_depth": {"type": "int", "min": 2, "max": 20, "step": 1},
            "min_samples_split": {"type": "int", "min": 2, "max": 10, "step": 1},
            "min_samples_leaf": {"type": "int", "min": 1, "max": 8, "step": 1}
        }
    },
    "RandomForestClassifier": {
        "task": "classification",
        "display_name": "Random Forest",
        "default": {"n_estimators": 100, "max_depth": 8, "min_samples_split": 2, "min_samples_leaf": 1},
        "bounds": {
            "n_estimators": {"type": "int", "min": 20, "max": 300, "step": 20},
            "max_depth": {"type": "int", "min": 3, "max": 25, "step": 1},
            "min_samples_split": {"type": "int", "min": 2, "max": 10, "step": 1},
            "min_samples_leaf": {"type": "int", "min": 1, "max": 6, "step": 1}
        }
    },
    "GradientBoostingClassifier": {
        "task": "classification",
        "display_name": "Gradient Boosting",
        "default": {"learning_rate": 0.1, "n_estimators": 100, "max_depth": 3, "subsample": 1.0},
        "bounds": {
            "learning_rate": {"type": "float", "min": 0.01, "max": 0.3, "step": 0.01},
            "n_estimators": {"type": "int", "min": 30, "max": 250, "step": 10},
            "max_depth": {"type": "int", "min": 2, "max": 8, "step": 1},
            "subsample": {"type": "float", "min": 0.6, "max": 1.0, "step": 0.05}
        }
    },
    "XGBClassifier": {
        "task": "classification",
        "display_name": "XGBoost",
        "default": {"learning_rate": 0.1, "max_depth": 4, "n_estimators": 100, "subsample": 0.8},
        "bounds": {
            "learning_rate": {"type": "float", "min": 0.01, "max": 0.3, "step": 0.01},
            "max_depth": {"type": "int", "min": 2, "max": 10, "step": 1},
            "n_estimators": {"type": "int", "min": 30, "max": 300, "step": 10},
            "subsample": {"type": "float", "min": 0.5, "max": 1.0, "step": 0.05}
        }
    },
    "KNeighborsClassifier": {
        "task": "classification",
        "display_name": "K-Nearest Neighbors",
        "default": {"n_neighbors": 5, "weights": "uniform"},
        "bounds": {
            "n_neighbors": {"type": "int", "min": 1, "max": 25, "step": 1},
            "weights": {"type": "categorical", "choices": ["uniform", "distance"]}
        }
    },
    "SVC": {
        "task": "classification",
        "display_name": "Support Vector Machine",
        "default": {"C": 1.0, "kernel": "rbf", "gamma": "scale"},
        "bounds": {
            "C": {"type": "float", "min": 0.1, "max": 10.0, "step": 0.1},
            "kernel": {"type": "categorical", "choices": ["linear", "rbf"]},
            "gamma": {"type": "categorical", "choices": ["scale", "auto"]}
        }
    },

    # ------------------ REGRESSORS ------------------
    "LinearRegression": {
        "task": "regression",
        "display_name": "Linear Regression",
        "default": {"fit_intercept": True},
        "bounds": {
            "fit_intercept": {"type": "categorical", "choices": [True, False]}
        }
    },
    "Ridge": {
        "task": "regression",
        "display_name": "Ridge Regressor",
        "default": {"alpha": 1.0},
        "bounds": {
            "alpha": {"type": "float", "min": 0.01, "max": 100.0, "step": 0.1}
        }
    },
    "DecisionTreeRegressor": {
        "task": "regression",
        "display_name": "Decision Tree Regressor",
        "default": {"max_depth": 5, "min_samples_split": 2},
        "bounds": {
            "max_depth": {"type": "int", "min": 2, "max": 20, "step": 1},
            "min_samples_split": {"type": "int", "min": 2, "max": 10, "step": 1}
        }
    },
    "RandomForestRegressor": {
        "task": "regression",
        "display_name": "Random Forest Regressor",
        "default": {"n_estimators": 100, "max_depth": 8, "min_samples_split": 2},
        "bounds": {
            "n_estimators": {"type": "int", "min": 20, "max": 300, "step": 20},
            "max_depth": {"type": "int", "min": 3, "max": 20, "step": 1},
            "min_samples_split": {"type": "int", "min": 2, "max": 10, "step": 1}
        }
    },
    "GradientBoostingRegressor": {
        "task": "regression",
        "display_name": "Gradient Boosting Regressor",
        "default": {"learning_rate": 0.1, "n_estimators": 100, "max_depth": 3},
        "bounds": {
            "learning_rate": {"type": "float", "min": 0.01, "max": 0.3, "step": 0.01},
            "n_estimators": {"type": "int", "min": 30, "max": 250, "step": 10},
            "max_depth": {"type": "int", "min": 2, "max": 8, "step": 1}
        }
    },
    "XGBRegressor": {
        "task": "regression",
        "display_name": "XGBoost Regressor",
        "default": {"learning_rate": 0.1, "max_depth": 4, "n_estimators": 100, "subsample": 0.8},
        "bounds": {
            "learning_rate": {"type": "float", "min": 0.01, "max": 0.3, "step": 0.01},
            "max_depth": {"type": "int", "min": 2, "max": 10, "step": 1},
            "n_estimators": {"type": "int", "min": 30, "max": 300, "step": 10},
            "subsample": {"type": "float", "min": 0.5, "max": 1.0, "step": 0.05}
        }
    },
    "KNeighborsRegressor": {
        "task": "regression",
        "display_name": "KNN Regressor",
        "default": {"n_neighbors": 5, "weights": "uniform"},
        "bounds": {
            "n_neighbors": {"type": "int", "min": 1, "max": 25, "step": 1},
            "weights": {"type": "categorical", "choices": ["uniform", "distance"]}
        }
    },
    "SVR": {
        "task": "regression",
        "display_name": "Support Vector Regressor",
        "default": {"C": 1.0, "kernel": "rbf"},
        "bounds": {
            "C": {"type": "float", "min": 0.1, "max": 10.0, "step": 0.1},
            "kernel": {"type": "categorical", "choices": ["linear", "rbf"]}
        }
    }
}

def get_models_for_task(task: str) -> List[str]:
    """Returns list of model keys matching classification or regression."""
    normalized_task = "classification" if "classification" in task.lower() else "regression"
    return [name for name, spec in SEARCH_SPACES.items() if spec["task"] == normalized_task]

def sample_random_parameters(model_name: str) -> Dict[str, Any]:
    """Generates a random legal hyperparameter configuration for uninformed Random Search."""
    if model_name not in SEARCH_SPACES:
        raise ValueError(f"Unknown model name '{model_name}'")

    bounds = SEARCH_SPACES[model_name]["bounds"]
    sampled = {}
    for param, spec in bounds.items():
        p_type = spec["type"]
        if p_type == "int":
            sampled[param] = random.randint(spec["min"], spec["max"])
        elif p_type == "float":
            sampled[param] = round(random.uniform(spec["min"], spec["max"]), 4)
        elif p_type == "categorical":
            sampled[param] = random.choice(spec["choices"])
    return sampled

def validate_and_clip_parameters(model_name: str, params: Dict[str, Any]) -> Dict[str, Any]:
    """Validates suggested parameters against physical bounds, clipping if out of legal range."""
    if model_name not in SEARCH_SPACES:
        return params

    bounds = SEARCH_SPACES[model_name]["bounds"]
    cleaned = dict(params)

    for param, spec in bounds.items():
        if param in cleaned:
            val = cleaned[param]
            p_type = spec["type"]
            try:
                if p_type == "int":
                    val = int(val)
                    val = max(spec["min"], min(spec["max"], val))
                    cleaned[param] = val
                elif p_type == "float":
                    val = float(val)
                    val = max(spec["min"], min(spec["max"], val))
                    cleaned[param] = round(val, 4)
                elif p_type == "categorical":
                    if val not in spec["choices"]:
                        cleaned[param] = spec["choices"][0]
            except (ValueError, TypeError):
                # Fall back to default
                cleaned[param] = SEARCH_SPACES[model_name]["default"].get(param)
        else:
            # Supply default if missing
            cleaned[param] = SEARCH_SPACES[model_name]["default"].get(param)

    return cleaned
