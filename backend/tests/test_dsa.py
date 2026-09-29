"""
Tests for Data Structures & Algorithms (DSA) component (Section 54)
"""

import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.ml.dsa import ExperimentPriorityQueue, ParetoFrontierFilter, HyperparameterSensitivityGraph


def test_priority_queue_heap():
    pq = ExperimentPriorityQueue()
    assert pq.is_empty()

    pq.push(0.85, "exp-1", {"lr": 0.1})
    pq.push(0.95, "exp-2", {"lr": 0.05})
    pq.push(0.91, "exp-3", {"lr": 0.01})

    assert len(pq) == 3
    # Max-heap: highest acquisition score first
    top = pq.pop()
    assert top.experiment_id == "exp-2"
    assert top.priority == 0.95

    next_top = pq.pop()
    assert next_top.experiment_id == "exp-3"
    assert next_top.priority == 0.91


def test_pareto_frontier_filter():
    experiments = [
        {"id": "e1", "metrics": {"f1_score": 0.90}, "training_time_sec": 1.0},
        {"id": "e2", "metrics": {"f1_score": 0.88}, "training_time_sec": 2.0},  # Dominated by e1
        {"id": "e3", "metrics": {"f1_score": 0.95}, "training_time_sec": 3.0},  # Non-dominated
        {"id": "e4", "metrics": {"f1_score": 0.92}, "training_time_sec": 4.0},  # Dominated by e3
    ]

    frontier = ParetoFrontierFilter.compute_frontier(experiments, metric_key="f1_score", cost_key="training_time_sec")
    frontier_ids = [e["id"] for e in frontier]
    assert "e1" in frontier_ids
    assert "e3" in frontier_ids
    assert "e2" not in frontier_ids
    assert "e4" not in frontier_ids


def test_sensitivity_graph_traversal():
    graph = HyperparameterSensitivityGraph()
    graph.add_node("e0", {"metric": 0.90})
    graph.add_node("e1", {"metric": 0.93})
    graph.add_node("e2", {"metric": 0.96})

    graph.add_edge("e0", "e1", 0.03)
    graph.add_edge("e1", "e2", 0.03)

    path = graph.get_gradient_path("e0")
    assert path == ["e0", "e1", "e2"]
