# The L.O.R.E. concept

L.O.R.E. explores executable generation through explicit program structure. The intended interface is a plain-English request. The intended result is a runnable artifact plus a receipt identifying the contract, binary, environment, and checks that passed.

The modeling idea is to plan through explicit program concepts. A concept is a typed operation with arguments, bounds, effects, and a defined role in the program. The planner would sketch a coarse program, refine it into connected operations, and stop refinement when each part has a supported instruction-level meaning. Published **Next-Concept Modeling** supplies a related coarse-to-fine research direction based on learned text codes. The [visual comparison](Concept_Hierarchy.md) distinguishes that representation from L.O.R.E.'s typed graphs.

## From intent to a program

Consider “count the numbers above 10.” Before building a program, the system needs choices about signed values, equality, input shape, empty input, and output type. It would infer a behavioral contract and record consequential assumptions. If an ambiguity changes the intended result, it could ask a focused question.

That contract would constrain the graph. For a count, the comparison produces a Boolean and the reduction consumes one. For a larger task, the outline would name subsystems and freeze the interfaces between them before independent refinement. Checks would enforce compatible types, effects, bounds, and dependencies throughout the graph.

## From the graph to instructions

The research target includes generating fresh instruction sequences. A learned backend would predict structured opcodes and operands for the checked graph. It would operate within a versioned target and instruction subset.

A deterministic encoder would serialize those records, resolve structural references, and assemble module metadata. The algorithm and instruction choices belong to the generator. The first target is WebAssembly with an explicit ABI. A native machine-code target would require its own ISA, ABI, loader, and verification contract.

The first control uses a fixed hand-authored graph and instruction fixture to establish the encoding and verification path. The learned generator is a later experiment.

## Why this might help

Explicit interfaces could give the model useful constraints during generation. A graph may offer better locations for diagnosis and partial regeneration. Independent subgraphs may also permit parallel work once their dependencies and joins are defined.

These are hypotheses. A graph adds its own prediction and checking costs. Learned instructions may fail validation. Parallel branches may disagree at their joins. Strong independent evaluation is needed to determine whether any benefit survives the complete path to a verified result.

## Intended reach

The research would expand from pure integer kernels to fresh executable components and then bounded application tasks. A game wave in a fixed host is one illustrative intermediate case. It has spawn rules, motion, collision, and scoring components with shared interfaces and a reproducible replay.

The longer-term ambition includes building, editing, and debugging runnable software from ordinary requests. Expansion would follow demonstrated correctness on each supported workload and target.

[Architecture](Architecture.md) · [Research plan](Research_Plan.md) · [Worked example](Worked_Example.md) · [Overview](../README.md)

Advanced model, training and core implementation details are reserved for internal research. [Technical disclosure and contact](Access.md)

[Visual subsystem guide](Subsystems.md) · [Research foundations](Research_Foundations.md)
