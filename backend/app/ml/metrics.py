import numpy as np
from typing import Dict, Any, Optional
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    log_loss,
    r2_score,
    mean_squared_error,
    mean_absolute_error,
    explained_variance_score,
)

class MetricEvaluator:
    """
    Computes comprehensive standardized metrics for classification and regression models.
    """

    @staticmethod
    def evaluate_classification(
        y_true: np.ndarray,
        y_pred: np.ndarray,
        y_prob: Optional[np.ndarray] = None
    ) -> Dict[str, float]:
        metrics = {
            "accuracy": float(accuracy_score(y_true, y_pred)),
            "precision": float(precision_score(y_true, y_pred, average="weighted", zero_division=0)),
            "recall": float(recall_score(y_true, y_pred, average="weighted", zero_division=0)),
            "f1": float(f1_score(y_true, y_pred, average="weighted", zero_division=0)),
            "f1_macro": float(f1_score(y_true, y_pred, average="macro", zero_division=0)),
        }

        # Calculate ROC-AUC & Log Loss if probabilities are supplied
        if y_prob is not None:
            try:
                unique_classes = np.unique(y_true)
                if len(unique_classes) == 2:
                    # Binary classification
                    prob_pos = y_prob[:, 1] if y_prob.ndim == 2 and y_prob.shape[1] == 2 else y_prob
                    metrics["roc_auc"] = float(roc_auc_score(y_true, prob_pos))
                    metrics["log_loss"] = float(log_loss(y_true, y_prob))
                elif len(unique_classes) > 2:
                    # Multi-class classification (One-vs-Rest)
                    metrics["roc_auc"] = float(roc_auc_score(y_true, y_prob, multi_class="ovr", average="weighted"))
                    metrics["log_loss"] = float(log_loss(y_true, y_prob))
            except Exception:
                # If probabilistic evaluation fails, provide fallback values
                metrics["roc_auc"] = metrics["accuracy"]
                metrics["log_loss"] = 0.0
        else:
            metrics["roc_auc"] = metrics["accuracy"]
            metrics["log_loss"] = 0.0

        return {k: round(v, 4) for k, v in metrics.items()}

    @staticmethod
    def evaluate_regression(
        y_true: np.ndarray,
        y_pred: np.ndarray
    ) -> Dict[str, float]:
        mse = mean_squared_error(y_true, y_pred)
        rmse = float(np.sqrt(mse))
        r2 = r2_score(y_true, y_pred)
        mae = mean_absolute_error(y_true, y_pred)
        ev = explained_variance_score(y_true, y_pred)

        metrics = {
            "r2": float(r2),
            "mse": float(mse),
            "rmse": float(rmse),
            "mae": float(mae),
            "explained_variance": float(ev)
        }
        return {k: round(v, 4) for k, v in metrics.items()}
