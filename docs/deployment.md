# ExperimentFlow — Deployment Architecture & Guide

---

## 1. Production Topology

```text
GitHub Repository
   │
   ├── Frontend (Vercel)
   │     └── Built via Vite (`npm run build`)
   │     └── Environment: VITE_API_URL = https://experimentflow-backend.onrender.com
   │
   └── Backend (Render / Railway / Docker)
         └── Python 3.10 + FastAPI + Uvicorn
         └── Relational Database: Managed MySQL / SQLite
```

---

## 2. Frontend Deployment (Vercel)

1. Connect the GitHub repository to [Vercel](https://vercel.com).
2. Configure Project Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment Variables:
   - `VITE_API_URL`: URL of your deployed backend (e.g. `https://your-backend.onrender.com`).

---

## 3. Backend Deployment (Render)

1. Connect the GitHub repository to [Render](https://render.com).
2. Create a new **Web Service**:
   - **Root Directory**: `backend`
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
3. Set Environment Variables:
   - `APP_ENV`: `production`
   - `CORS_ORIGINS`: `https://your-frontend.vercel.app`
   - `MYSQL_HOST`: Managed database host (or leave empty for embedded SQLite store)
