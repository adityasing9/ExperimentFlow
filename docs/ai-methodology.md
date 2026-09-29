# ExperimentFlow — AI Reasoning Methodology

This document outlines the theoretical and algorithmic principles behind the **AI Experiment Analyst** in ExperimentFlow.

---

## 1. Design Philosophy: Explainable Closed-Loop Reasoning

ExperimentFlow rejects black-box or purely decorative AI text generation. Every observation and parameter decision emitted by the `LocalAIProvider` is grounded directly in empirical validation metrics recorded in prior trials.

```text
Prior Experiments History H_k
           ↓
[ Empirical Sensitivity Analysis ]
           ↓
[ Exploration vs. Exploitation Balance ]
           ↓
[ Candidate Parameter Recommendation ]
           ↓
[ Physical Bound Validator & Clipper ]
           ↓
Execution in Next Trial
```

---

## 2. LocalAIProvider Abstraction

The `LocalAIProvider` class encapsulates dual execution pathways:
1. **Local LLM Pathway**: Interrogates a local runtime (such as Ollama or an OpenAI-compatible local model) via REST (`POST /api/generate`) with strict JSON schema formatting (`AIDecisionSchema`).
2. **Deterministic Bayesian-Gradient Heuristic Fallback**: An embedded algorithmic intelligence that operates without network access, external tokens, or third-party servers.

---

## 3. Decision Heuristics & Sensitivity Manifolds

At iteration $k$:
1. **Pareto Sorting**: Identifies $(m^*, \theta^*, S^*)$ — the trial yielding the highest validation score under objective $M$.
2. **Periodic Exploration (Step $k \equiv 0 \pmod 4$)**:
   - If untested model families remain in the legal candidate set $\Omega_{\text{task}}$, the engine randomly selects an untested family $m \notin \text{tested}(H)$ and samples legal random bounds.
   - **Rationale**: Mitigates premature convergence to suboptimal local model families.
3. **Targeted Exploitation (Step $k \not\equiv 0 \pmod 4$)**:
   - Isolates the best model family $m^*$.
   - Applies directional perturbations $\pm \delta$ to continuous hyperparameters (e.g. learning rate, regularization constant $C$) within a $\pm 12\%$ neighborhood of $\theta^*$.
   - Emits structured hypotheses explaining:
     - `observation`: Specific metric changes observed in previous steps.
     - `rationale`: Why the targeted parameter perturbation is expected to yield higher margin separation.
     - `expected_goal`: Concrete numerical threshold targeted.
