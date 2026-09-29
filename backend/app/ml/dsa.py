"""
ExperimentFlow — Algorithmic & Data Structures Component (Section 54)

This module implements academic-grade data structures and algorithms:
1. ExperimentPriorityQueue (Max-Heap based experiment scheduling)
2. ParetoFrontierFilter (2D/3D Non-dominated sorting for multi-objective trade-offs)
3. SensitivityGraphTraversal (Directed Acyclic Graph traversal of hyperparameter space)
"""

import heapq
from typing import List, Dict, Any, Tuple


class PrioritizedExperiment:
    """
    Heap element wrapper prioritizing experiments by expected information gain.
    
    Time Complexity:
        Insertion: O(log N)
        Extraction: O(log N)
        Peek: O(1)
    Space Complexity:
        O(N) where N is number of candidate trials queued.
    """
    def __init__(self, priority: float, experiment_id: str, configuration: Dict[str, Any]):
        self.priority = priority  # Higher priority indicates higher acquisition value
        self.experiment_id = experiment_id
        self.configuration = configuration

    def __lt__(self, other: 'PrioritizedExperiment') -> bool:
        # Python heapq is a min-heap; we invert priority for max-heap behavior
        return self.priority > other.priority

    def to_dict(self) -> Dict[str, Any]:
        return {
            "priority": round(self.priority, 4),
            "experiment_id": self.experiment_id,
            "configuration": self.configuration
        }


class ExperimentPriorityQueue:
    """
    Priority Queue for scheduling model evaluations based on Upper Confidence Bound (UCB).
    
    Algorithm:
        Acquisition Priority = Expected_Metric + beta * Uncertainty_Estimate
    """
    def __init__(self):
        self._heap: List[PrioritizedExperiment] = []

    def push(self, priority: float, experiment_id: str, configuration: Dict[str, Any]) -> None:
        """Push trial onto priority queue in O(log N) time."""
        item = PrioritizedExperiment(priority, experiment_id, configuration)
        heapq.heappush(self._heap, item)

    def pop(self) -> PrioritizedExperiment:
        """Extract highest-priority candidate in O(log N) time."""
        if not self._heap:
            raise IndexError("pop from an empty priority queue")
        return heapq.heappop(self._heap)

    def peek(self) -> PrioritizedExperiment:
        """View next best candidate in O(1) time without removing."""
        if not self._heap:
            raise IndexError("peek from an empty priority queue")
        return self._heap[0]

    def __len__(self) -> int:
        return len(self._heap)

    def is_empty(self) -> bool:
        return len(self._heap) == 0


class ParetoFrontierFilter:
    """
    Multi-objective Non-Dominated Sorting Algorithm (Section 54 & 55).
    
    Identifies optimal trade-off solutions between:
        Objective 1: Performance Metric (Maximize e.g. F1-Score)
        Objective 2: Computational Cost (Minimize e.g. Latency / Training Time)
        
    Algorithm:
        Kung's Efficient 2D Non-Dominated Sort
    Time Complexity:
        O(N log N) where N is number of evaluated models.
    Space Complexity:
        O(N) auxiliary space.
    """
    @staticmethod
    def compute_frontier(experiments: List[Dict[str, Any]],
                         metric_key: str = "f1_score",
                         cost_key: str = "training_time_sec") -> List[Dict[str, Any]]:
        """
        Filters experiments to extract strictly non-dominated Pareto frontier candidates.
        
        Input:
            experiments: List of experiment dictionaries containing metrics and costs.
            metric_key: Objective 1 to maximize.
            cost_key: Objective 2 to minimize.
            
        Output:
            List of non-dominated experiment dictionaries lying on the Pareto boundary.
        """
        valid = [
            e for e in experiments
            if e.get("metrics") and metric_key in e["metrics"] and e.get(cost_key) is not None
        ]

        if not valid:
            return []

        # Sort primary objective (cost) ascending; secondary (metric) descending
        sorted_candidates = sorted(
            valid,
            key=lambda x: (x.get(cost_key, float('inf')), -x["metrics"].get(metric_key, -float('inf')))
        )

        pareto_frontier: List[Dict[str, Any]] = []
        max_metric_so_far = -float('inf')

        # Single pass sweep through sorted candidate list: O(N)
        for cand in sorted_candidates:
            current_metric = cand["metrics"][metric_key]
            if current_metric > max_metric_so_far:
                pareto_frontier.append(cand)
                max_metric_so_far = current_metric

        return pareto_frontier


class HyperparameterSensitivityGraph:
    """
    Directed Acyclic Graph (DAG) of Hyperparameter Perturbations.
    
    Algorithm:
        Breadth-First Exploration with Gradient Shrinkage
    Time Complexity:
        Traversal: O(V + E) where V is number of trials, E is mutation transitions.
    Space Complexity:
        O(V + E) adjacency matrix representation.
    """
    def __init__(self):
        self.adjacency: Dict[str, List[Tuple[str, float]]] = {}
        self.nodes: Dict[str, Dict[str, Any]] = {}

    def add_node(self, experiment_id: str, data: Dict[str, Any]) -> None:
        self.nodes[experiment_id] = data
        if experiment_id not in self.adjacency:
            self.adjacency[experiment_id] = []

    def add_edge(self, parent_id: str, child_id: str, metric_delta: float) -> None:
        if parent_id in self.adjacency:
            self.adjacency[parent_id].append((child_id, metric_delta))

    def get_gradient_path(self, start_id: str) -> List[str]:
        """Traces the steepest ascent path from anchor baseline to optimum."""
        path = [start_id]
        curr = start_id
        while self.adjacency.get(curr):
            # Select edge with highest positive delta
            best_edge = max(self.adjacency[curr], key=lambda edge: edge[1])
            if best_edge[1] <= 0:
                break
            curr = best_edge[0]
            path.append(curr)
        return path
