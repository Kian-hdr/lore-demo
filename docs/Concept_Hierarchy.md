# From broad concepts to fine detail

A hierarchy can represent the same output at several levels of detail. The upper levels use fewer units to capture broad structure. Later levels add detail. The distinction is the granularity of the representation.

## The learned-code pyramid

Published **Next-Concept Modeling**, or **NCM**, learns a multiscale discrete representation of text. Its generator predicts one level at a time, with the positions at each level predicted in parallel. A decoder reconstructs text from the accumulated representation. [Kumbong and colleagues, 2026](https://arxiv.org/abs/2610.14162) · [Author repository](https://github.com/HazyResearch/ncm)

The diagram below is an original schematic. Each tile contains an illustrative numeric code ID. The rows contain 2, 4 and 8 codes. These IDs are examples, not values copied from a trained model.

```mermaid
block-beta
    columns 8
    coarse["COARSE · 2 code IDs"]:8
    space:2 a["204"]:2 b["718"]:2 space:2
    middle["REFINEMENT · 4 code IDs"]:8
    c["41"]:2 d["93"]:2 e["206"]:2 f["517"]:2
    fine["FINE · 8 code IDs"]:8
    g["8"] h["26"] i["74"] j["105"] k["186"] l["329"] m["488"] n["652"]
    decoder["Accumulate the levels, then decode text tokens"]:8
    classDef heading fill:#30303c,stroke:#777786,color:#ffffff,font-size:18px;
    classDef broad fill:#35244f,stroke:#aa91d2,color:#ffffff,font-size:30px;
    classDef refine fill:#194e48,stroke:#6ea59d,color:#ffffff,font-size:24px;
    classDef detail fill:#62422d,stroke:#c39770,color:#ffffff,font-size:20px;
    class coarse,middle,fine,decoder heading;
    class a,b broad;
    class c,d,e,f refine;
    class g,h,i,j,k,l,m,n detail;
```

Read from top to bottom. Fewer coarse codes summarize structure across the sequence. Finer levels supply residual detail, and the completed representation is decoded into tokens. Rows represent refinement levels. An ID names a codebook entry. The number printed in a tile is not a token count or an abstraction score.

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
    classDef plan fill:#35244f,stroke:#aa91d2,color:#ffffff;
    class A,B,C plan;
    classDef check fill:#234b38,stroke:#7ba98c,color:#ffffff;
    class F check;
    classDef exec fill:#62422d,stroke:#c39770,color:#ffffff;
    class H,I,J,K exec;
```

The top specifies the task. The middle makes operations and interfaces explicit. The bottom supplies target execution detail. In the pilot, the graph and instructions were hand-authored. Evaluating learned versions is part of the research plan.

The tokenizer, learned codes and text-generation results in the NCM paper belong to its authors. L.O.R.E.'s current demo establishes a typed-program control and an execution path. [Subsystem guide](Subsystems.md) · [Research foundations](Research_Foundations.md)

[Overview](../README.md) · [Architecture](Architecture.md) · [Research plan](Research_Plan.md)

Visual reference for the layered teaching approach: [Cloud X Berry video](https://www.youtube.com/watch?v=SMYzc9FMXj0). The schematics on this page were authored for this explanation, with the mechanism checked against the linked primary research.
