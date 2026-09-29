# ExperimentFlow — Architecture Documentation

This document describes the design, execution flow, and structural design patterns utilized in **ExperimentFlow**.

---

## 1. Architectural Style

ExperimentFlow adopts a **Decoupled Client-Server & Asynchronous Service-Oriented Architecture (SOA)**:
- **Client Tier**: Single Page Application built on React 18, TypeScript, and Vite styled with the custom "Computational Laboratory" Tailwind design system.
- **API Gateway & Orchestration**: FastAPI service exposing typed REST endpoints with Pydantic V2 schema validation and asynchronous task dispatching.
- **Execution & ML Core**: Decoupled Python service layer separating data ingestion, leak-free preprocessing, model fitting, and local AI reasoning.
- **Persistence Tier**: Relational storage using SQLAlchemy ORM with dual-engine capability (MySQL 8.0 primary, SQLite local fallback).

---

## 2. Core Execution Lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant UI as React Frontend
    participant API as FastAPI Router
    participant Service as OptimizationService
    participant ML as MLPreprocessor & Trainers
    participant AI as LocalAIProvider
    participant DB as MySQL / SQLite

    UI->>API: POST /api/optimization/start
    API->>DB: Create OptimizationRun (status: queued)
    API->>Service: Launch background thread
    API-->>UI: Return OptimizationRun schema

    loop Each Experiment Iteration (k = 0 to Budget - 1)
        alt Iteration 0 (Baseline)
            Service->>ML: Train Baseline (RandomForest default)
        else Iteration k (AI Guided)
            Service->>AI: generate_recommendation(history, metric)
            AI-->>Service: Structured proposal (model, parameters)
            Service->>ML: Train candidate model with parameters
        end

        ML-->>Service: Metrics, training time, latency
        Service->>DB: Persist Experiment, Parameters, Metrics, Logs
        Service->>DB: Update best metric & run progress
        UI->>API: GET /api/optimization/{id} (Poll status)
        API-->>UI: Updated run state & live metrics
    end

    Service->>DB: Mark run completed & duration
    UI->>API: POST /api/reports/generate/{run_id}
    API-->>UI: Return comprehensive academic report
```
