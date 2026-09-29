# ExperimentFlow — Verification & Testing Protocol

This document outlines the automated testing suite validating data integrity, leak-free preprocessing, model execution, AI reasoning, and API routes.

---

## 1. Test Architecture

The testing suite is located in `backend/tests/`:
- `test_backend.py`: Unit and integration tests covering:
  - `test_dataset_profiling`: Column type detection, missing value counting, moments calculation.
  - `test_preprocessor_zero_leakage`: Confirms transformers fit strictly on the train partition.
  - `test_model_training_classification`: Validates training, timing, and metric outputs.
  - `test_parameter_clipping_and_validation`: Tests boundary clipping on illegal parameter inputs.
  - `test_ai_reasoning_generation`: Verifies schema adherence of AI decision objects.
  - `test_health_endpoint`: Asserts `/health` route returns 200 with engine statuses.
  - `test_models_endpoint`: Asserts model registry exposes valid search space definitions.
  - `test_demo_endpoint`: Asserts demo benchmark payloads are well-formed.
- `test_e2e_flow.py`: Full end-to-end integration test verifying complete dataset ingestion, background execution, AI decision persistence, report generation, and strategy comparison.

---

## 2. Running Automated Tests

Execute all tests from the repository root:

```powershell
pytest backend/tests/test_backend.py -v
pytest backend/tests/test_e2e_flow.py -v -s
```
