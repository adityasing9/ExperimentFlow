# ExperimentFlow — Setup & Execution Guide

This guide details the complete local setup instructions for running the **ExperimentFlow** platform on Windows (PowerShell / Command Prompt), macOS, and Linux.

---

## 1. Prerequisites

Ensure you have the following installed on your system:
- **Python**: Version 3.10 or higher (`python --version`)
- **Node.js**: Version 18.0 or higher (`node --version` and `npm --version`)
- **MySQL** *(Optional)*: MySQL 8.0+ service running on port 3306.  
  *Note: ExperimentFlow features an automatic dual-engine architecture. If MySQL is not configured or not running, the platform seamlessly falls back to a high-performance local SQLite database (`experimentflow.db`), ensuring zero downtime during college evaluation.*

---

## 2. Repository Configuration

Clone or navigate into the project root directory:

```powershell
cd c:\Users\AADI\Desktop\My\CODE\Github\ExperimentFlow
```

Create your `.env` configuration file from the provided template:

```powershell
cp .env.example .env
```

---

## 3. Backend Setup & Startup (FastAPI + Python)

### Step 3.1: Install Python Dependencies
From the project root:

```powershell
pip install -r backend/requirements.txt
```

### Step 3.2: Run Backend Automated Verification Tests
Run the test suite to verify leak-free preprocessing, models, and AI reasoning:

```powershell
pytest backend/tests/test_backend.py -v
```

### Step 3.3: Launch FastAPI Backend Server
Run the backend with hot-reload enabled:

```powershell
python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8000 --reload
```

The API will boot and be accessible at:
- **API Root**: `http://127.0.0.1:8000`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **Health Diagnostic**: `http://127.0.0.1:8000/health`

---

## 4. Frontend Setup & Startup (React + TypeScript + Vite)

Open a separate terminal window:

```powershell
cd c:\Users\AADI\Desktop\My\CODE\Github\ExperimentFlow\frontend
```

### Step 4.1: Install Node Dependencies

```powershell
npm install
```

### Step 4.2: Build Check

```powershell
npm run build
```

### Step 4.3: Launch Frontend Development Server

```powershell
npm run dev
```

The web application will open at:
- **Local Application URL**: `http://localhost:5173`

---

## 5. Instant Presentation / College Viva Demo Mode

For quick evaluation without waiting for multi-iteration live model training:
1. Open the application in your browser (`http://localhost:5173`).
2. Click **"Load Demo Benchmark"** in the top navigation or sidebar.
3. The platform will instantly load the verified **Breast Cancer Wisconsin (12 Experiments)** benchmark displaying:
   - Live Baseline Run (Random Forest: F1 0.9385)
   - Closed-loop AI-guided trajectory convergence (XGBoost: F1 0.9824)
   - Real-time side-by-side comparison: **Random Search vs AI-Guided Search**
   - Empirical synthesis and exportable academic report.

---

## 6. Docker Deployment (Alternative)

If Docker and Docker Compose are installed:

```powershell
docker-compose up --build
```
