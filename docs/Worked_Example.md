# Worked example

> Count the signed integers strictly greater than 10.

For `[11, 11, 10, 11]`, the answer is `3`. Each `11` counts separately. The `10` contributes zero because it equals the threshold.

## From intent to contract

The hand-authored contract accepts zero to 256 signed 32-bit integers and returns a count from zero to 256. The comparison uses signed values. An empty input returns zero.

The module exports `memory`, a fixed 64 KiB page, and `count_gt_10(len: i32) -> i32`. The host writes little-endian integers starting at byte zero and passes the number of elements. The guest reads those bytes and returns the count through the function result.

## From graph to binary

```text
input (bounded i32 slice)
  ↓
load (i32)
  ↓
signed_gt_10 (Bool)
  ↓
count_true (count)
```

The fixture loads each element, compares it with 10, and adds the comparison result to a running count. Inside Wasm, the signed comparison `i32.gt_s` yields 0 or 1. An enclosing block lets the loop exit when the index reaches the supplied length.

The deterministic encoder writes Wasm bytes from these structured operations and records their byte spans and graph origins. The output of this case is a 110-byte module. The demo runs the prebuilt module from that experiment.

## From binary to receipt

Wasmi validates the module and runs it inside a macOS process sandbox. The supervisor checks actual counts against a separately written oracle. All five frozen cases matched across the original run and a clean local rebuild.

| Oracle case | Expected and observed |
| --- | ---: |
| Empty sequence | 0 |
| Two values equal to 10 | 0 |
| `[11, 11, 10, 11]` | 3 |
| Signed mixture, including both i32 extremes | 2 |
| 256 copies of 11 | 256 |

The receipt binds the artifact and canonical outcomes to hashes. The clean rebuild reproduced the module byte for byte and matched the canonical results digest. [Try the prebuilt module](Try_It.md) with your own inputs.

## Two deliberate failures

1. **Wrong instruction.** Replacing the threshold constant with a read of local 99 caused validation to fail at byte offset 90. The origin map resolved that location to `signed_gt_10`. Restoring the original instruction recovered the original bytes.
2. **Wrong interface.** Replacing the Boolean predicate with an integer identity operation made its output incompatible with the Boolean input of `count_true`. The graph checker rejected the join before emission. Restoring the original predicate recovered the original bytes.

Each recovery restored a known, hand-authored fixture. Automated selection of a correction remains a research question.

[Architecture](Architecture.md) · [Current limits](Limits.md) · [Overview](../README.md)
