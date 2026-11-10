# Try the count-above-10 demo

Download the repository as a ZIP and extract it, or clone it. Open [demo/index.html](../demo/index.html) from the extracted folder in a modern browser. The page works offline and requires only a browser with WebAssembly support.

| Input | Expected count |
| --- | ---: |
| Empty | 0 |
| `10, 10` | 0 |
| `11, 11, 10, 11` | 3 |
| `-2147483648, -1, 9, 10, 11, 2147483647` | 2 |

You can supply up to 256 signed 32-bit integers, separated by commas or spaces. The result is the count strictly greater than 10.

The page runs the same prebuilt 110-byte [Wasm fixture](../demo/Count_GT_10.wasm) that passed the pilot. The original verification checked five oracle cases, two deliberate faults and resource limits in a separate research harness. This page runs the prebuilt module with your inputs. It includes an optional check of the five fixed cases.

Fixture SHA-256 is `16c78a7858e986d8660ac843cf704f00e1362267213f8911343fb53e2d7191b6`.

[Worked example](Worked_Example.md) · [Architecture](Architecture.md) · [Overview](../README.md)
