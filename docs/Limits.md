# Current evidence and open questions

L.O.R.E. is at the control-pilot stage. The full concept includes intent inference, hierarchical graphs, learned instruction prediction, feedback, and larger executable tasks. Those capabilities need experiments.

| Area | Evidence and remaining work |
| --- | --- |
| Program scope | One hand-authored signed-integer kernel, one ABI and five separately authored oracle cases |
| Encoding | A fresh Wasm module was emitted from structured instructions and reproduced byte for byte |
| Diagnostics | Two deliberate faults exercised instruction validation and a typed graph join; recovery restored the known fixture |
| Model generation | Intent inference, graph generation and learned instructions remain proposed |
| Repair | A useful automated repair policy and bounded machine-state feedback remain to be evaluated |
| Scheduling | Serial, batched and distributed generation need matched comparisons |
| Portability | Original isolated verification ran on Apple Silicon macOS; the prebuilt module also runs in the tested browser demo |
| Performance | The original stage timings describe the fixed control on one host; comparative system performance remains unmeasured |

## What the demonstration establishes

Matching artifact hashes establish reproduction of the checked fixture. The five cases test empty input, equality, duplicates, signed extremes and the input bound. The original harness also exercised resource controls and expected rejection paths.

The browser demo lets readers inspect the behavior of that prebuilt module. It does not exercise model inference or fresh instruction generation.

## What a larger claim would require

Use unseen program families and independent held-out tests. Measure the complete workflow, including failed attempts. Compare matched tasks, targets, acceptance rules, retry limits and budgets. The proposed research sequence is described in the [research plan](Research_Plan.md).

[Concept](Concept.md) · [Architecture](Architecture.md) · [Worked example](Worked_Example.md) · [Overview](../README.md)

## Memory demonstration

The memory control uses a hand-authored numeric codebook and resolution rules over synthetic records. It demonstrates selection, exact facts, correction propagation and explicit intervention semantics. Learned embeddings, learned resolution, continual weight updates, compression gains and real-world causal competence remain research questions. [Memory details](Memory.md)
