# ExperimentFlow — Comprehensive Viva Voce Preparation Guide
*Detailed Technical Questions & Defensible Answers for Project Evaluation*

---

### Q1: What core problem does ExperimentFlow solve?
**Answer:**  
In conventional machine learning workflows, model tuning is bottlenecked by manual trial-and-error: an engineer trains a model, inspects metrics, guesses what parameters to change next, and repeats. This manual process is slow, prone to human cognitive bias, computationally wasteful, and risks data leakage. ExperimentFlow automates this entire loop into an intelligent, closed-loop research workstation: **Experiment $\rightarrow$ Analyze $\rightarrow$ Decide $\rightarrow$ Experiment**.

---

### Q2: Why is AI needed? How is this different from standard AutoML?
**Answer:**  
Standard AutoML tools (such as TPOT, Auto-Sklearn, or FLAML) typically rely on brute-force grid sweeps, genetic programming, or black-box Bayesian acquisition functions without qualitative transparency. ExperimentFlow introduces an **AI Analytical Reasoner** (`LocalAIProvider`) that inspects structured empirical metric trajectories, calculates hyperparameter sensitivity gradients, balances exploration vs exploitation, and emits **explainable, human-readable hypotheses** (observation, rationale, expected goal, and confidence score) validating why a specific configuration was chosen.

---

### Q3: What optimization strategy is used, and why compare against Random Search?
**Answer:**  
ExperimentFlow uses a **Closed-Loop AI-Guided Search** combining empirical sensitivity analysis with neighborhood exploitation and periodic architectural exploration. Uninformed Random Search (Bergstra & Bengio, 2012) is the classical standard scientific baseline in AutoML research because it uniformly explores the search space without inductive bias. Comparing against Random Search on identical computational budgets proves whether AI reasoning actually accelerates convergence.

---

### Q4: How does the AI select the subsequent experiment?
**Answer:**  
1. Every run initiates with an un-tuned baseline (Trial 00) to anchor comparative deltas.
2. At step $k$, previous trials are sorted by performance.
3. Every 4th iteration, the engine executes an *Exploration Step* to test untested candidate model families.
4. In all other iterations (*Exploitation Step*), the reasoner computes parameter sensitivity deltas around the current empirical optimum (Pareto boundary) and performs targeted local perturbation (e.g., fine-tuning learning rate within $[0.03, 0.05]$ and setting tree depth to 3).
5. All suggestions pass through a strict mathematical validator (`validate_and_clip_parameters`) ensuring physical feasibility.

---

### Q5: How do you strictly prevent Data Leakage?
**Answer:**  
Data leakage occurs when information from outside the training partition is used to fit models. ExperimentFlow prevents this by:
1. Enforcing an 80/20 train-test partition prior to any feature transformation.
2. Fitting all standardizers (`StandardScaler`), missing value imputers (`SimpleImputer`), and categorical encoders (`OneHotEncoder`) **strictly on $X_{\text{train}}$**.
3. Applying only the `.transform()` method to $X_{\text{test}}$, ensuring no distribution moments from the test split bleed into the training pipeline.

---

### Q6: What metrics are evaluated?
**Answer:**  
- **Classification**: Weighted F1 Score, Accuracy, Macro F1, Weighted Precision, Recall, ROC-AUC (via predict_proba / OvR for multiclass), Log Loss, Training Time (s), and Inference Latency (ms).
- **Regression**: R-squared ($R^2$), Root Mean Squared Error (RMSE), Mean Absolute Error (MAE), Mean Squared Error (MSE), and Explained Variance.

---

### Q7: Why did you choose MySQL and FastAPI?
**Answer:**  
- **MySQL**: Provides strict relational integrity, ACID compliance, and foreign key cascades across trials, metrics, and parameters. ExperimentFlow also implements an automatic dual-engine architecture: if MySQL is not configured on an evaluator's machine, it seamlessly falls back to SQLite (`experimentflow.db`) with zero downtime.
- **FastAPI**: Offers asynchronous non-blocking request handling, automatic OpenAPI/Swagger documentation, high execution speed (Starlette/Uvicorn), and native Pydantic V2 schema validation.

---

### Q8: What happens if an experiment fails or crashes during training?
**Answer:**  
Individual experiment failures are isolated within try-except wrappers in `OptimizationService._run_single_experiment`. If a model fails (e.g., non-convergence or memory limit), the experiment status is flagged as `FAILED`, the error message is logged to the database, and the loop safely proceeds to the next experiment. The server never crashes.

---

### Q9: How is experiment reproducibility ensured?
**Answer:**  
Every experiment run records:
- The fixed pseudorandom seed (`random_state=42`).
- Exact numerical hyperparameter values in `experiment_parameters`.
- Preprocessing transformer specifications.
- Timestamps and execution environment metadata.
This enables exact scientific reproduction of any recorded trial.

---

### Q10: What are the main limitations and future scope of the project?
**Answer:**  
- **Limitations**: Search spaces are currently bounded by domain-specific heuristic intervals; runs execute sequentially on local CPU threads.
- **Future Scope**: Asynchronous multi-fidelity early stopping (Hyperband/ASHA), automated interaction feature engineering, distributed multi-node training (Celery/Ray), and deep learning neural architecture search (NAS).
