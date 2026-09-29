import time
import logging
import threading
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.database import models
from app.database.connection import SessionLocal
from app.ml.preprocessing import MLPreprocessor
from app.ml.trainers import train_and_evaluate_model
from app.ml.search_space import (
    SEARCH_SPACES,
    get_models_for_task,
    sample_random_parameters,
    validate_and_clip_parameters
)
from app.services.ai_service import ai_provider
from app.services.dataset_service import DatasetService

logger = logging.getLogger("experimentflow.optimization")

# In-memory tracking of active run threads and cancellation requests
ACTIVE_RUNS: Dict[str, bool] = {} # run_id -> is_cancelled

class OptimizationService:

    @classmethod
    def cancel_run(cls, run_id: str) -> bool:
        """Sets cooperative cancellation flag for a running optimization loop."""
        if run_id in ACTIVE_RUNS:
            ACTIVE_RUNS[run_id] = True
            logger.info(f"Cancellation requested for optimization run {run_id}")
            return True
        return False

    @classmethod
    def execute_optimization_run(cls, run_id: str):
        """
        Orchestrates full iterative optimization loop in background worker.
        Supports both AI-Guided Search and uninformed Random Search.
        """
        ACTIVE_RUNS[run_id] = False
        db = SessionLocal()
        start_time = time.perf_counter()

        try:
            run = db.query(models.OptimizationRun).filter(models.OptimizationRun.id == run_id).first()
            if not run:
                logger.error(f"Optimization run {run_id} not found in database.")
                return

            run.status = "running"
            db.commit()

            dataset = run.dataset
            df = DatasetService.load_dataframe(dataset)
            task_type = dataset.problem_type or "classification"
            target_metric = run.target_metric
            is_maximize = (run.optimization_goal == "maximize")

            # 1. Leak-Free Preprocessing (fitted strictly on train split)
            preprocessor = MLPreprocessor(
                target_column=dataset.target_column,
                problem_type=task_type,
                test_size=0.2,
                random_state=42
            )
            X_train, X_test, y_train, y_test, meta = preprocessor.fit_transform(df)

            available_models = get_models_for_task(task_type)
            history: List[Dict[str, Any]] = []

            # -------------------------------------------------------------
            # Iteration 0: Canonical Baseline Run (Random Forest Default)
            # -------------------------------------------------------------
            baseline_model = "RandomForestClassifier" if "classification" in task_type else "RandomForestRegressor"
            baseline_params = SEARCH_SPACES[baseline_model]["default"]

            exp_0 = cls._run_single_experiment(
                db=db,
                run_id=run.id,
                iteration=0,
                model_name=baseline_model,
                params=baseline_params,
                is_baseline=True,
                X_train=X_train,
                y_train=y_train,
                X_test=X_test,
                y_test=y_test,
                task_type=task_type,
                target_metric=target_metric
            )

            history.append(exp_0)
            run.current_iteration = 1
            run.best_metric_value = exp_0["primary_metric_value"]
            run.best_experiment_id = exp_0["id"]
            db.commit()

            # -------------------------------------------------------------
            # Iterative Search Loop: Iteration 1 to Budget - 1
            # -------------------------------------------------------------
            for it in range(1, run.budget):
                # Check for cooperative cancellation
                if ACTIVE_RUNS.get(run_id, False):
                    run.status = "cancelled"
                    db.commit()
                    logger.info(f"Optimization run {run_id} cancelled by user at iteration {it}.")
                    return

                if run.strategy == "ai_guided":
                    # AI-Guided: Deep analysis of history & parameter sensitivities
                    ai_decision = ai_provider.generate_recommendation(
                        task_type=task_type,
                        target_metric=target_metric,
                        optimization_goal=run.optimization_goal,
                        experiment_history=history,
                        iteration=it
                    )

                    # Persist AI decision record
                    decision_rec = models.AIDecision(
                        optimization_run_id=run.id,
                        iteration=it,
                        recommended_model=ai_decision.recommended_model,
                        recommended_parameters=ai_decision.recommended_parameters,
                        observation=ai_decision.observation,
                        rationale=ai_decision.rationale,
                        expected_goal=ai_decision.expected_goal,
                        confidence_score=ai_decision.confidence_score,
                        raw_provider_name="LocalAIProvider"
                    )
                    db.add(decision_rec)
                    db.commit()

                    chosen_model = ai_decision.recommended_model
                    chosen_params = ai_decision.recommended_parameters

                else:
                    # Uninformed Random Search Baseline
                    chosen_model = random.choice(available_models)
                    chosen_params = sample_random_parameters(chosen_model)

                # Execute Experiment
                exp_res = cls._run_single_experiment(
                    db=db,
                    run_id=run.id,
                    iteration=it,
                    model_name=chosen_model,
                    params=chosen_params,
                    is_baseline=False,
                    X_train=X_train,
                    y_train=y_train,
                    X_test=X_test,
                    y_test=y_test,
                    task_type=task_type,
                    target_metric=target_metric
                )

                history.append(exp_res)
                run.current_iteration = it + 1

                # Update best metric tracking
                current_score = exp_res["primary_metric_value"]
                if run.best_metric_value is None:
                    run.best_metric_value = current_score
                    run.best_experiment_id = exp_res["id"]
                elif is_maximize and current_score > run.best_metric_value:
                    run.best_metric_value = current_score
                    run.best_experiment_id = exp_res["id"]
                elif not is_maximize and current_score < run.best_metric_value:
                    run.best_metric_value = current_score
                    run.best_experiment_id = exp_res["id"]

                db.commit()

            # Mark complete
            run.status = "completed"
            run.completed_at = datetime.utcnow()
            run.total_duration_sec = round(time.perf_counter() - start_time, 2)
            db.commit()
            logger.info(f"Optimization run {run_id} completed successfully in {run.total_duration_sec}s.")

        except Exception as e:
            logger.exception(f"Failure in optimization run {run_id}: {e}")
            if run:
                run.status = "failed"
                db.commit()
        finally:
            if run_id in ACTIVE_RUNS:
                del ACTIVE_RUNS[run_id]
            db.close()

    @classmethod
    def _run_single_experiment(
        cls,
        db: Session,
        run_id: str,
        iteration: int,
        model_name: str,
        params: Dict[str, Any],
        is_baseline: bool,
        X_train,
        y_train,
        X_test,
        y_test,
        task_type: str,
        target_metric: str
    ) -> Dict[str, Any]:
        """Runs single model training step with step-level logging and metric persistence."""
        exp = models.Experiment(
            optimization_run_id=run_id,
            iteration=iteration,
            model_name=model_name,
            is_baseline=is_baseline,
            status="running"
        )
        db.add(exp)
        db.flush()

        # Step 1: Log Data Preparation
        log1 = models.ExperimentLog(
            experiment_id=exp.id,
            step="data_prep",
            message=f"X_train={X_train.shape}, X_test={X_test.shape} with zero-leakage preprocessing.",
            level="info"
        )
        db.add(log1)

        try:
            # Step 2: Train Model
            metrics, train_time, infer_time, clean_p = train_and_evaluate_model(
                model_name=model_name,
                params=params,
                X_train=X_train,
                y_train=y_train,
                X_test=X_test,
                y_test=y_test,
                task_type=task_type
            )

            primary_val = metrics.get(target_metric, metrics.get("f1", metrics.get("r2", 0.0)))

            exp.status = "completed"
            exp.training_time_sec = train_time
            exp.inference_time_ms = infer_time
            exp.primary_metric_value = primary_val

            # Store parameters
            for p_name, p_val in clean_p.items():
                p_type = "float" if isinstance(p_val, float) else "int" if isinstance(p_val, int) else "string"
                param_rec = models.ExperimentParameter(
                    experiment_id=exp.id,
                    param_name=p_name,
                    param_value=str(p_val),
                    param_type=p_type
                )
                db.add(param_rec)

            # Store metrics
            for m_name, m_val in metrics.items():
                m_rec = models.ExperimentMetric(
                    experiment_id=exp.id,
                    metric_name=m_name,
                    metric_value=m_val
                )
                db.add(m_rec)

            # Step 3: Log Completion
            log2 = models.ExperimentLog(
                experiment_id=exp.id,
                step="metric_calc",
                message=f"{model_name} evaluated successfully: {target_metric}={primary_val} (Train: {train_time}s).",
                level="info"
            )
            db.add(log2)
            db.commit()

            return {
                "id": exp.id,
                "iteration": iteration,
                "model_name": model_name,
                "is_baseline": is_baseline,
                "primary_metric_value": primary_val,
                "metrics": metrics,
                "parameters": clean_p,
                "training_time_sec": train_time,
                "inference_time_ms": infer_time
            }

        except Exception as e:
            exp.status = "failed"
            exp.error_message = str(e)
            log_err = models.ExperimentLog(
                experiment_id=exp.id,
                step="training",
                message=f"Model training error: {e}",
                level="error"
            )
            db.add(log_err)
            db.commit()
            return {
                "id": exp.id,
                "iteration": iteration,
                "model_name": model_name,
                "is_baseline": is_baseline,
                "primary_metric_value": 0.0,
                "metrics": {},
                "parameters": params,
                "training_time_sec": 0.0,
                "inference_time_ms": 0.0
            }

    @classmethod
    def start_background_run(cls, run_id: str):
        """Dispatches optimization run into an asynchronous thread."""
        thread = threading.Thread(target=cls.execute_optimization_run, args=(run_id,), daemon=True)
        thread.start()
