# Proposed system architecture

These Mermaid views adapt the architecture diagrams developed during the project discussion. They describe the proposed full system. The current pilot provides evidence for a small hand-authored control path, detailed at the end of this page.

## From English to a tested executable

```mermaid
flowchart TD
    P["Plain-English request"] --> E["Transformer encodes the request"]
    E --> C["Infer behavioral contract<br/>Inputs, outputs, rules and assumptions"]
    C -->|Material ambiguity| Q["Ask a focused question"]
    Q --> C
    C -->|Contract sufficiently defined| N["NCM sketches the program<br/>Subsystems, interfaces and behaviors"]
    N --> G["Refine and check the typed program graph"]
    G --> I["Instruction head predicts<br/>opcodes and operands"]
    I --> B["Deterministic encoder packages fresh Wasm"]
    B --> V["Validate module and execute independent checks"]
    V -->|Pass| R["Runnable binary and hash-bound receipt"]
    V -->|Fail| D["Localize failure and apply a bounded repair"]
    D -. "Affected contract or graph" .-> C
    D -. "Affected instruction sequence" .-> I
    D -->|Budget exhausted| X["Failure receipt"]
```

The intent and concept stages decide the program's meaning and structure. The instruction stage proposes how to execute it on the chosen target. Whether these stages share one transformer or use separate models is an experimental choice.

| Interface | Information exchanged | Required check |
| --- | --- | --- |
| Intent to graph | Behavior, types, assumptions, bounds and allowed effects | Contract coherence and alignment with caller intent |
| Graph to instruction generator | Checked operations, argument references, interfaces and origin IDs | Complete graph, compatible joins and supported target |
| Instructions to encoder | Structured control flow, opcodes, operands and origin IDs | Valid records and structural references |
| Binary to evaluator | Module, ABI, contract and expected tests | Binary validation, isolation and resource limits |
| Evaluator to receipt | Outcomes, diagnostics, hashes, environment and measurements | Bind the evidence to the exact artifact and test configuration |

Independent tests can reveal intent errors, but their coverage is limited. A valid module can still implement the wrong behavior.

## Coarse-to-fine and parallel refinement

```mermaid
flowchart TD
    A["Request a playable enemy wave"] --> O["Sketch the wave and its shared state"]
    O --> F["Freeze interfaces and tick order"]
    F --> S["Refine spawn rules"]
    F --> P["Refine projectile updates"]
    F --> C["Refine collision detection"]
    F --> D["Refine scoring rules"]
    S --> SI["Generate spawn instructions"]
    P --> PI["Generate projectile instructions"]
    C --> CI["Generate collision instructions"]
    D --> DI["Generate scoring instructions"]
    SI --> J["Join and check fresh components"]
    PI --> J
    CI --> J
    DI --> J
    J --> T["Run a seeded replay<br/>Check timings, hits and final score"]
    T --> R["Runnable wave and receipt"]
```

The wave is an illustrative future workload. Branches inherit the root contract and keep their agreed interfaces while they refine their internals. The join checks types, effects, shared-state assumptions, and update order. Work is eligible for parallel execution only when its dependencies permit it.

## Instruction feedback and repair

```mermaid
flowchart TD
    A["A failed check or behavior mismatch"] --> B["Reproduce the exact artifact and case"]
    B --> C{"Where does behavior first diverge?"}
    C -->|Contract differs from intent| D["Revise the affected contract"]
    C -->|Graph differs from contract| E["Patch the affected graph node"]
    C -->|Binary differs from graph| F["Regenerate implicated instructions"]
    C -->|Components fail at their join| G["Repair interface or update order"]
    D --> H["Regenerate affected parts within budget"]
    E --> H
    F --> H
    G --> H
    H --> I["Rerun failing case and final independent checks"]
    I -->|Pass| J["New binary and receipt"]
    I -->|Budget exhausted| K["Failure receipt with evidence"]
```

The optional instruction-level experiment would feed bounded summaries of stack, locals, memory, control flow, or a failed property back to the generator. The behavioral contract remains fixed during that experiment. Compare the generator with and without this feedback using matched latency or compute budgets.

The pilot's two rejection controls demonstrate locations for diagnostics. A person restored the known fixture. Learning a useful repair policy is future work.

## Execution profiles

```mermaid
flowchart TD
    A["Checked outline and frozen interfaces"] --> B["Schedule branches with ready dependencies"]
    B -->|Small or tightly coupled task| C["Refine serially"]
    B -->|Independent branches on one device| D["Batch branches with one resident model"]
    B -->|Enough independent work| E["Distribute branches across workers"]
    C --> F["Join and verify components"]
    D --> F
    E --> F
    F --> G["Run integration checks and return the artifact"]
```

Measure critical-path rounds, join failures, repair costs, total compute, and wall time. Distribution is a candidate execution profile, whose overhead and consistency costs need evaluation.

## The tested control

```mermaid
flowchart TD
    A["Hand-authored typed graph"] --> B["Check predicate and count interface"]
    B --> C["Hand-authored structured Wasm instructions"]
    C --> D["Encode a fresh 110-byte module and origin map"]
    D --> E["Wasmi validation and bounded execution"]
    E --> F["Supervisor compares five expected results"]
    F --> G["Artifact and execution receipt"]
```

The original harness also checked an invalid local instruction and an incompatible graph join. The browser demo runs the prebuilt accepted module with new input values. [Worked example](Worked_Example.md) · [Try it](Try_It.md) · [Evidence limits](Limits.md)

[Project concept](Concept.md) · [Research plan](Research_Plan.md) · [Overview](../README.md)
