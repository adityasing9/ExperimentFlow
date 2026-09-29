# ExperimentFlow — REST API Reference

The backend provides typed, validated REST endpoints under `/api`. Interactive documentation is available via Swagger UI at `http://localhost:8000/docs`.

---

## 1. System Health
- **`GET /health`**
  - **Description**: Returns database connection health, engine type (MySQL vs SQLite), registered ML model count, and LocalAIProvider operational status.

---

## 2. Dataset Management
- **`GET /api/datasets`**
  - **Description**: Lists all ingested datasets and their profiling status.
- **`POST /api/datasets/sample/{name}`**
  - **Description**: Ingests or initializes a bundled benchmark dataset (`iris`, `breast_cancer`, `california_housing`, `titanic`).
- **`POST /api/datasets/upload`**
  - **Description**: Multipart CSV upload with validation, filename sanitization, and automatic statistical profiling.
- **`GET /api/datasets/{id}/profile`**
  - **Description**: Retrieves statistical summaries, missing counts, class distributions, and correlation matrices.

---

## 3. Optimization & Experiment Execution
- **`POST /api/optimization/start`**
  - **Payload**:
    ```json
    {
      "dataset_id": "uuid",
      "name": "Breast Cancer Run",
      "strategy": "ai_guided",
      "target_metric": "f1",
      "budget": 10
    }
    ```
  - **Description**: Spawns an asynchronous background thread executing the iterative search loop.
- **`GET /api/optimization/{id}`**
  - **Description**: Polls live run progress, current iteration, best score, experiment list, and AI decisions.
- **`POST /api/optimization/{id}/cancel`**
  - **Description**: Cooperatively halts execution of remaining queued trials.
- **`GET /api/optimization/{id}/comparison`**
  - **Description**: Generates head-to-head empirical comparison: Uninformed Random Search vs. AI-Guided Search.

---

## 4. Reports & Demo Benchmarks
- **`POST /api/reports/generate/{run_id}`**
  - **Description**: Generates a structured academic synthesis report in Markdown and JSON.
- **`GET /api/demo/breast-cancer`**
  - **Description**: Returns verified 12-iteration Breast Cancer Wisconsin benchmark run for instant viva demonstration.
