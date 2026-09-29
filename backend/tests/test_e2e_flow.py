import sys
import os
import time
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from fastapi.testclient import TestClient
from app.main import app

def test_full_pipeline_flow():
    with TestClient(app) as client:
        # 1. Health
        h = client.get('/health').json()
        assert h['status'] == 'healthy'
        print('Health OK:', h['status'], '| DB Engine:', h['database']['engine'])

        # 2. Datasets
        datasets = client.get('/api/datasets').json()
        assert len(datasets) >= 4
        print('Datasets count:', len(datasets))

        bc_ds = next(d for d in datasets if 'Breast Cancer' in d['name'])
        bc_id = bc_ds['id']
        profile = client.get(f'/api/datasets/{bc_id}/profile').json()
        assert profile['summary']['row_count'] == 569
        print('Profile loaded successfully: 569 samples, 31 features')

        # 3. Start a real fast AI-guided optimization run (budget 3)
        run_req = client.post('/api/optimization/start', json={
            'dataset_id': bc_id,
            'strategy': 'ai_guided',
            'target_metric': 'f1',
            'budget': 3
        }).json()
        run_id = run_req['id']
        assert run_req['status'] in ['queued', 'running']
        print('Run launched:', run_id)

        # Wait for completion
        completed = False
        for _ in range(30):
            time.sleep(1)
            st = client.get(f'/api/optimization/{run_id}').json()
            if st['status'] in ['completed', 'failed']:
                completed = (st['status'] == 'completed')
                break

        assert completed, 'Optimization run failed to complete in time'
        assert st['best_metric_value'] is not None
        assert len(st['experiments']) == 3
        assert len(st['ai_decisions']) >= 2
        print(f"Run completed: Best F1 = {st['best_metric_value']}, Decisions = {len(st['ai_decisions'])}")

        # 4. Generate Academic Report
        rep = client.post(f'/api/reports/generate/{run_id}').json()
        assert rep['id'] is not None
        assert len(rep['conclusions']) >= 2
        print('Report generated:', rep['title'])

        # 5. Check Comparison
        comp = client.get(f'/api/optimization/{run_id}/comparison').json()
        assert comp['ai_guided_search']['best_score'] > 0
        assert comp['random_search']['best_score'] > 0
        print(f"Comparison: AI {comp['ai_guided_search']['best_score']} vs Random {comp['random_search']['best_score']}")
