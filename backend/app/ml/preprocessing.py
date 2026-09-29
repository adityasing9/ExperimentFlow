import pandas as pd
import numpy as np
from typing import Tuple, Dict, Any, List
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder, LabelEncoder
from sklearn.impute import SimpleImputer

class MLPreprocessor:
    """
    Leak-free automated preprocessing pipeline for classification and regression tasks.
    Guarantees that all scalers, imputers, and encoders are fitted strictly on the
    training partition to prevent data leakage.
    """

    def __init__(self, target_column: str, problem_type: str = "classification", test_size: float = 0.2, random_state: int = 42):
        self.target_column = target_column
        self.problem_type = problem_type
        self.test_size = test_size
        self.random_state = random_state

        self.num_imputer = SimpleImputer(strategy="median")
        self.cat_imputer = SimpleImputer(strategy="most_frequent")
        self.scaler = StandardScaler()
        self.encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
        self.label_encoder = LabelEncoder() if "classification" in problem_type else None

        self.numerical_cols: List[str] = []
        self.categorical_cols: List[str] = []
        self.feature_names_out: List[str] = []
        self.target_classes_: List[str] = []

    def fit_transform(self, df: pd.DataFrame) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, Dict[str, Any]]:
        """
        Splits raw dataset into train and test splits, fits all transformers strictly
        on X_train, and transforms both splits.
        Returns: X_train, X_test, y_train, y_test, metadata_dict
        """
        # Ensure target column exists
        if self.target_column not in df.columns:
            raise ValueError(f"Target column '{self.target_column}' not found in dataset columns: {list(df.columns)}")

        # Separate features and target
        X = df.drop(columns=[self.target_column]).copy()
        y = df[self.target_column].copy()

        # Handle target missing values if any
        valid_idx = y.notna()
        X = X[valid_idx].reset_index(drop=True)
        y = y[valid_idx].reset_index(drop=True)

        # Detect column types
        for col in X.columns:
            if pd.api.types.is_numeric_dtype(X[col]):
                self.numerical_cols.append(col)
            else:
                self.categorical_cols.append(col)

        # Stratification for classification if class distribution permits
        stratify = None
        if "classification" in self.problem_type:
            val_counts = y.value_counts()
            if (val_counts >= 2).all() and len(val_counts) > 1:
                stratify = y

        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=self.test_size, random_state=self.random_state, stratify=stratify
        )

        # Process numerical features
        X_train_num_processed = np.empty((len(X_train), 0))
        X_test_num_processed = np.empty((len(X_test), 0))
        if self.numerical_cols:
            train_num = self.num_imputer.fit_transform(X_train[self.numerical_cols])
            test_num = self.num_imputer.transform(X_test[self.numerical_cols])
            X_train_num_processed = self.scaler.fit_transform(train_num)
            X_test_num_processed = self.scaler.transform(test_num)

        # Process categorical features
        X_train_cat_processed = np.empty((len(X_train), 0))
        X_test_cat_processed = np.empty((len(X_test), 0))
        encoded_feature_names = []
        if self.categorical_cols:
            train_cat = self.cat_imputer.fit_transform(X_train[self.categorical_cols].astype(str))
            test_cat = self.cat_imputer.transform(X_test[self.categorical_cols].astype(str))
            X_train_cat_processed = self.encoder.fit_transform(train_cat)
            X_test_cat_processed = self.encoder.transform(test_cat)
            encoded_feature_names = list(self.encoder.get_feature_names_out(self.categorical_cols))

        # Combine processed matrices
        if self.numerical_cols and self.categorical_cols:
            X_train_final = np.hstack([X_train_num_processed, X_train_cat_processed])
            X_test_final = np.hstack([X_test_num_processed, X_test_cat_processed])
            self.feature_names_out = self.numerical_cols + encoded_feature_names
        elif self.numerical_cols:
            X_train_final = X_train_num_processed
            X_test_final = X_test_num_processed
            self.feature_names_out = self.numerical_cols
        else:
            X_train_final = X_train_cat_processed
            X_test_final = X_test_cat_processed
            self.feature_names_out = encoded_feature_names

        # Process target
        if "classification" in self.problem_type and self.label_encoder:
            y_train_final = self.label_encoder.fit_transform(y_train)
            y_test_final = self.label_encoder.transform(y_test)
            self.target_classes_ = [str(cls) for cls in self.label_encoder.classes_]
        else:
            y_train_final = np.array(y_train, dtype=float)
            y_test_final = np.array(y_test, dtype=float)

        pipeline_metadata = {
            "num_features_in": len(X.columns),
            "num_features_out": X_train_final.shape[1],
            "train_samples": len(X_train_final),
            "test_samples": len(X_test_final),
            "numerical_columns": self.numerical_cols,
            "categorical_columns": self.categorical_cols,
            "feature_names_out": self.feature_names_out,
            "target_classes": self.target_classes_,
            "imputation_strategy": {"numerical": "median", "categorical": "most_frequent"},
            "scaling": "StandardScaler",
            "leak_prevention": "Strict train-split fit; test-split transform only"
        }

        return X_train_final, X_test_final, y_train_final, y_test_final, pipeline_metadata
