import os
import uuid
import pandas as pd
import numpy as np
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.config import settings
from app.database import models
from app.schemas.dataset_schema import DatasetSummary, FeatureStats, DatasetProfileResponse

class DatasetService:

    @staticmethod
    def ensure_storage_dirs():
        os.makedirs(settings.upload_dir, exist_ok=True)
        os.makedirs(settings.datasets_dir, exist_ok=True)

    @classmethod
    def load_dataframe(cls, dataset: models.Dataset) -> pd.DataFrame:
        if not os.path.exists(dataset.file_path):
            raise FileNotFoundError(f"Dataset file at {dataset.file_path} not found.")
        return pd.read_csv(dataset.file_path)

    @classmethod
    def compute_profile(cls, df: pd.DataFrame, target_column: Optional[str] = None) -> Dict[str, Any]:
        """Calculates deep statistical profiling, column types, distributions, and correlations."""
        row_count, feature_count = df.shape

        numerical_cols = []
        categorical_cols = []
        missing_by_col = {}
        feature_stats = {}

        for col in df.columns:
            missing_count = int(df[col].isna().sum())
            missing_by_col[col] = missing_count

            if pd.api.types.is_numeric_dtype(df[col]):
                numerical_cols.append(col)
                series = df[col].dropna()
                if len(series) > 0:
                    feature_stats[col] = {
                        "mean": round(float(series.mean()), 4),
                        "std": round(float(series.std()), 4) if len(series) > 1 else 0.0,
                        "min": round(float(series.min()), 4),
                        "q25": round(float(series.quantile(0.25)), 4),
                        "median": round(float(series.median()), 4),
                        "q75": round(float(series.quantile(0.75)), 4),
                        "max": round(float(series.max()), 4),
                        "unique_count": int(series.nunique())
                    }
                else:
                    feature_stats[col] = {"unique_count": 0}
            else:
                categorical_cols.append(col)
                series = df[col].dropna().astype(str)
                top_vals = series.value_counts().head(5).to_dict()
                feature_stats[col] = {
                    "unique_count": int(series.nunique()),
                    "top_values": {str(k): int(v) for k, v in top_vals.items()}
                }

        # Correlation Matrix for numerical columns (limit to top 15 for readable heatmap)
        correlations = {}
        if len(numerical_cols) > 1:
            num_sub = df[numerical_cols[:15]].dropna()
            corr_df = num_sub.corr().round(4).fillna(0.0)
            correlations = corr_df.to_dict()

        # Class distribution if target column is categorical/discrete
        class_dist = None
        inferred_problem = "regression"
        if target_column and target_column in df.columns:
            target_series = df[target_column].dropna()
            unique_count = target_series.nunique()
            if not pd.api.types.is_numeric_dtype(target_series) or unique_count <= 10:
                if unique_count == 2:
                    inferred_problem = "binary_classification"
                else:
                    inferred_problem = "multiclass_classification"
                class_dist = {str(k): int(v) for k, v in target_series.value_counts().to_dict().items()}
            else:
                inferred_problem = "regression"

        summary = {
            "row_count": row_count,
            "feature_count": feature_count,
            "target_column": target_column,
            "problem_type": inferred_problem,
            "missing_values_total": int(df.isna().sum().sum()),
            "missing_by_column": missing_by_col,
            "numerical_columns": numerical_cols,
            "categorical_columns": categorical_cols,
            "memory_usage_kb": round(df.memory_usage(deep=True).sum() / 1024.0, 2)
        }

        return {
            "summary": summary,
            "correlations": correlations,
            "class_distribution": class_dist,
            "feature_stats": feature_stats
        }

    @classmethod
    def register_or_update_dataset(
        cls,
        db: Session,
        name: str,
        file_path: str,
        source_type: str = "sample",
        target_column: Optional[str] = None,
        problem_type: Optional[str] = None
    ) -> models.Dataset:
        cls.ensure_storage_dirs()
        df = pd.read_csv(file_path)

        # Default target column heuristics for bundled samples
        if not target_column:
            if "diagnosis" in df.columns:
                target_column = "diagnosis"
            elif "species" in df.columns:
                target_column = "species"
            elif "Survived" in df.columns:
                target_column = "Survived"
            elif "median_house_value" in df.columns:
                target_column = "median_house_value"
            else:
                target_column = df.columns[-1]

        profile_data = cls.compute_profile(df, target_column=target_column)
        detected_problem = problem_type or profile_data["summary"]["problem_type"]

        dataset = models.Dataset(
            name=name,
            file_path=file_path,
            source_type=source_type,
            row_count=profile_data["summary"]["row_count"],
            feature_count=profile_data["summary"]["feature_count"],
            target_column=target_column,
            problem_type=detected_problem
        )
        db.add(dataset)
        db.flush()

        # Add profile
        profile = models.DatasetProfile(
            dataset_id=dataset.id,
            summary_json=profile_data["summary"],
            correlations_json=profile_data["correlations"],
            class_distribution_json=profile_data["class_distribution"],
            feature_stats_json=profile_data["feature_stats"]
        )
        db.add(profile)
        db.commit()
        db.refresh(dataset)
        return dataset
