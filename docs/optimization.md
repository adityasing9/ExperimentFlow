# ExperimentFlow — Optimization Strategies & Comparative Analysis

---

## 1. The Core Scientific Comparison

To address Section 18 & 19 of the specification, ExperimentFlow directly implements and compares two distinct optimization paradigms:

### Strategy A: Uninformed Random Search (Baseline)
- Based on Bergstra & Bengio (2012), "Random Search for Hyper-Parameter Optimization".
- Each trial selects a random legal model family $m \in \Omega$ and samples hyperparameters $\theta$ uniformly from bounded intervals:
  $$\theta_j \sim \mathcal{U}(a_j, b_j)$$
- **Characteristics**: Simple and unbiased, but computationally inefficient due to independent sampling with no memory of prior trials.

### Strategy B: Closed-Loop AI-Guided Search
- Evaluates the empirical gradient of validation metric improvements across trials.
- Narrows search intervals around the most promising sub-manifolds:
  $$\theta^{(k+1)} = \theta^* + \epsilon, \quad \epsilon \sim \mathcal{N}(0, \sigma^2)$$
- Balances fine-grained exploitation with periodic multi-architecture exploration.

---

## 2. Quantitative Evaluation Criteria

When evaluating the two paradigms on identical task budgets ($B=12$), the following metrics are recorded:
1. **Best Score Achieved**: Peak validation score across all trials.
2. **Trials to Peak**: Iteration index where the optimal score was first reached.
3. **Total Latency**: Cumulative wall-clock seconds elapsed during training.
4. **Parameter Efficiency**: Rate of metric improvement per exploratory trial.
