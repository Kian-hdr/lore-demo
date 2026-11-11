# From broad concepts to fine detail

A hierarchy can represent the same output at several levels of detail. The upper levels use fewer units to capture broad structure. Later levels add detail. The distinction is the granularity of the representation.

## The learned-code pyramid

Published **Next-Concept Modeling**, or **NCM**, learns a multiscale discrete representation of text. Its generator predicts one level at a time, with the positions at each level predicted in parallel. A decoder reconstructs text from the accumulated representation. [Kumbong and colleagues, 2026](https://arxiv.org/abs/2610.14162) · [Author repository](https://github.com/HazyResearch/ncm)

The diagram below is an original schematic. A–N are illustrative code labels, and the 2/4/8 row sizes are chosen for explanation.

```mermaid
%%{init: {"flowchart": {"nodeSpacing": 10, "rankSpacing": 30, "padding": 8}}}%%
flowchart TB
    subgraph COARSE["COARSE · broad structure"]
        direction LR
        A["A"] ~~~ B["B"]
    end
    subgraph MIDDLE["REFINEMENT · more detail"]
        direction LR
        C["C"] ~~~ D["D"] ~~~ E["E"] ~~~ F["F"]
    end
    subgraph FINE["FINE · dense detail"]
        direction LR
        G["G"] ~~~ H["H"] ~~~ I["I"] ~~~ J["J"] ~~~ K["K"] ~~~ L["L"] ~~~ M["M"] ~~~ N["N"]
    end
    COARSE -->|"Condition the next level"| MIDDLE
    MIDDLE -->|"Add finer information"| FINE
    FINE --> DECODER["Decoder reconstructs text tokens"]
    classDef coarse fill:#35244f,stroke:#aa91d2,color:#ffffff,font-size:26px;
    classDef middle fill:#194e48,stroke:#6ea59d,color:#ffffff,font-size:20px;
    classDef fine fill:#62422d,stroke:#c39770,color:#ffffff,font-size:14px;
    class A,B coarse;
    class C,D,E,F middle;
    class G,H,I,J,K,L,M,N fine;
```

Read from top to bottom. Fewer coarse codes summarize structure across the sequence. Finer levels supply residual detail, and the completed representation is decoded into tokens. The arrows connect representation levels. They are not a claim that each code owns exactly two children.

## What “more context per token” means here

| Term | What the visual represents |
| --- | --- |
| Text token | A symbol in the output tokenizer's vocabulary |
| Code ID | An index into a learned codebook at a particular level |
| Coarse code | Part of a representation with fewer positions for the sequence |
| Finer code | A contribution at a denser level of detail |
| Model context window | A separate limit on the information the model can attend to |

A code label does not disclose its meaning. The hierarchy lets the representation move from broad structure toward detail. A larger context window or a fixed number of words “inside” each code does not follow from the pyramid alone. [NCM formulation and tokenization](https://arxiv.org/html/2610.14162v1#S3)

## The corresponding idea in L.O.R.E.

For executable generation, L.O.R.E.'s proposed hierarchy uses explicit program meanings. This is a design analogy with the learned-code hierarchy. The roles and representations differ.

```mermaid
flowchart TD
    A["One behavior<br/>Count signed values above 10"]
    A --> B["Concept<br/>Decide whether each value qualifies"]
    A --> C["Concept<br/>Aggregate qualifying values"]
    B --> D["Read an i32"]
    B --> E["Compare it with 10"]
    C --> F["Add the Boolean result"]
    C --> G["Advance and finish the loop"]
    D --> H["Wasm load instruction"]
    E --> I["Wasm signed comparison"]
    F --> J["Wasm integer addition"]
    G --> K["Wasm control-flow instructions"]
```

The top specifies the task. The middle makes operations and interfaces explicit. The bottom supplies target execution detail. In the pilot, the graph and instructions were hand-authored. Evaluating learned versions is part of the research plan.

The tokenizer, learned codes and text-generation results in the NCM paper belong to its authors. L.O.R.E.'s current demo establishes a typed-program control and an execution path. [Subsystem guide](Subsystems.md) · [Research foundations](Research_Foundations.md)

[Overview](../README.md) · [Architecture](Architecture.md) · [Research plan](Research_Plan.md)
