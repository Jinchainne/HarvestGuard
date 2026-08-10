# HarvestGuard

An agricultural quality escrow Intelligent Contract for GenLayer.

A buyer escrows GEN for a produce lot and names an independent arbiter. The designated producer submits public inspection, traceability, certification, or delivery URLs. GenLayer validators fetch that live evidence and use the Equivalence Principle to reach consensus on whether the lot meets the buyer's quality criteria. The verdict can approve payment, request a revision, or reject the lot.

## Lifecycle

```text
create_lot (buyer funds GEN)
  -> submit_inspection_evidence (producer)
  -> verify_quality (permissionless validator consensus)
     -> approved: producer paid
     -> needs revision: producer resubmits, up to three times
     -> rejected: buyer refunds or either party disputes
  -> disputed: arbiter approves/rejects, then timeout refunds buyer
  -> expired: buyer refunds
```

## Contract

Source: `contracts/harvest_guard.py`

| Method | Caller | Purpose |
| --- | --- | --- |
| `create_lot` | Buyer, payable | Names producer/arbiter, defines quality criteria, and funds escrow. |
| `submit_inspection_evidence` | Producer | Submits one to eight public evidence URLs. |
| `verify_quality` | Anyone | Runs live-web AI consensus and records the verdict. |
| `refund_rejected_lot` | Buyer | Refunds a rejected lot. |
| `raise_dispute` / `resolve_dispute` | Party / arbiter | Freezes a live lot and gives the named arbiter a binding resolution. |
| `refund_expired_lot` | Anyone | Refunds an unresolved lot after its deadline. |
| `force_default_resolution` | Anyone | Refunds a disputed lot after the arbiter grace period. |

## Verify and Deploy

```powershell
genvm-lint check contracts/harvest_guard.py
```

Deploy `contracts/harvest_guard.py` through GenLayer Studio or the CLI. It has no constructor parameters. Begin on testnet with a small GEN amount and public, stable inspection URLs.

## Live Deployment

- Network: GenLayer Bradbury Testnet (chain ID `4221`)
- Contract: [`0xDAd514CB7390d589644c4DC3feb42a77c88618aB`](https://explorer-bradbury.genlayer.com/address/0xDAd514CB7390d589644c4DC3feb42a77c88618aB)
- Deploy transaction: [`0xe8a2f695e9fd2b02f356865e6549879dc90ce723c03fa7597d03d0fc47574ac4`](https://explorer-bradbury.genlayer.com/tx/0xe8a2f695e9fd2b02f356865e6549879dc90ce723c03fa7597d03d0fc47574ac4)

See [deployment notes](docs/deployment.md) for consensus and escrow-safety details.
