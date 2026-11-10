# Concept

L.O.R.E. asks whether a system can turn an intent into an executable by working through a typed program graph and a structured instruction plan. A deterministic encoder would produce the binary. A separate verification stage would check what it actually does.

A **typed program graph** describes the operations and the values they exchange. For the count-above-10 example, the comparison produces a Boolean and the counter consumes one. That boundary gives the checker a place to reject a mismatched graph before anything executes. **Structured instructions** express a lower-level plan as operations and operands, such as a signed comparison inside a loop. The encoder writes those instructions into a WebAssembly module.

## Where the model would fit

In the proposed system, a model would turn a request into a behavior contract and a typed graph. The contract records choices such as what “above” means, the permitted inputs, and the expected output. A later model stage could propose target instructions for that checked graph. Deterministic encoding, resource limits, and a separately authored oracle would still determine whether the resulting binary passes.

The CPU-only pilot starts with a hand-authored graph and instruction fixture. That gives the project a control for the path from checked graph to runnable binary and test receipt. It also makes failures at different stages observable before a model supplies either input.

## What would make the idea worth pursuing?

An experiment could compare the fixed control, learned graph or instruction generation, and a conventional source-to-binary baseline. Use equivalent tasks, held-out tests, resource limits, and retry budgets. Measure verified success and end-to-end time to a passing artifact. The comparison would help separate the effects of the representation, generation strategy, and runner.

[Architecture](Architecture.md) · [Worked example](Worked_Example.md) · [Current limits](Limits.md) · [Overview](../README.md)
