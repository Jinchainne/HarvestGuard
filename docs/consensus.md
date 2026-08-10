# HarvestGuard Consensus Design

## Purpose

HarvestGuard is a reusable escrow primitive for evidence-backed agricultural settlement. It is not a generic LLM opinion: a producer is paid only when validator consensus determines that live, public inspection evidence satisfies the buyer's pre-committed quality criteria.

## Non-Deterministic Consensus

`verify_quality` copies stored lot fields into local variables and invokes a closure through `gl.eq_principle.prompt_comparative`.

1. Each validator independently calls `gl.nondet.web.render` for the submitted public evidence URLs.
2. Each validator calls `gl.nondet.exec_prompt` with the product specification, inspection criteria, and fetched evidence.
3. The equivalence principle requires the `verdict` field to match exactly: `APPROVED`, `NEEDS_REVISION`, or `REJECTED`.
4. Reasoning can differ in wording, but must support the same quality conclusion.

The consensus verdict is bound directly to contract state: approval releases escrow, revision returns the lot to the producer, and final rejection enables buyer recovery.

## State Machine

```text
FUNDED -> EVIDENCE_SUBMITTED -> APPROVED -> PAID
                              -> NEEDS_REVISION -> EVIDENCE_SUBMITTED
                              -> REJECTED -> REJECTED_FINAL -> REFUNDED

Any unsettled state -> DISPUTED -> arbiter APPROVE -> PAID
                                 -> arbiter REJECT -> REFUNDED
DISPUTED after deadline + grace -> REFUNDED
```

`NEEDS_REVISION` is capped at three rounds. The cap prevents a producer from indefinitely keeping buyer funds in a retry loop. A timeout route protects both parties when the arbiter does not act.

## Safety Invariants

- Only the designated producer can submit evidence, and only buyer/producer can raise a dispute.
- The arbiter is selected at lot creation and is the only address able to resolve a dispute.
- `_settle` zeroes the live escrow ledger and persists terminal state before transferring GEN.
- Every live lot has a deadline; unresolved, non-disputed lots can be refunded after expiry.
- Fetched pages are treated as untrusted evidence, not executable instructions.

## Reuse

Other builders can adapt the evidence schema and prompt while retaining the settlement core: committed criteria, validator-consensus verdict, capped revisions, independent arbitration, and deterministic recovery paths.
