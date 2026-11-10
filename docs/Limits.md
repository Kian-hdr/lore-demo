# Current limits

| Area | Evidence and open questions |
| --- | --- |
| Program scope | One hand-authored integer kernel, one ABI, and five separately authored oracle cases. Behavior outside that scope remains unmeasured. |
| Model generation | The proposed translation from intent to graph and learned instruction generation remain research design. |
| Diagnostics | Two deliberate faults exercise distinct rejection stages. Recovery restored the known fixture in each case. |
| Portability and isolation | The replay was checked on Apple Silicon macOS. The worker uses a fixed memory page, no guest imports, interpreter fuel, and an outer timeout. The controls check these boundaries for this harness. |
| Performance | The samples measure stages of the fixed local control. Comparative latency, resource cost, and correctness on held-out program families remain to be measured. |

## How to read the evidence

Matching Wasm hashes establish byte-for-byte reproduction for the checked fixture. Matching result hashes establish agreement on the canonical records used in this run. The five oracle cases provide concrete behavioral checks. A broader claim would require more program families and a held-out oracle.

The next scientific question is whether a system can generate a valid graph or instruction plan on a new task while preserving the same acceptance criteria. A fair comparison would hold the task, evaluator, and budgets constant and include failed runs in the analysis.

[Concept](Concept.md) · [Worked example](Worked_Example.md) · [Try the demo](Try_It.md) · [Overview](../README.md)
