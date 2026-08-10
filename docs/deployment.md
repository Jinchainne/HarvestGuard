# HarvestGuard Deployment Notes

## Intelligent Contract Decision

`verify_quality` copies the stored criteria and evidence URLs into local values. Inside `gl.eq_principle.prompt_comparative`, every validator renders each public URL through `gl.nondet.web.render` and asks an LLM whether the lot meets the agreed criteria. The `approved` boolean must match across validators, so release of escrow is a non-deterministic consensus result.

## Escrow Safety

- Only the buyer funds a lot and only the assigned producer submits evidence.
- `_settle` zeros the live escrow balance and persists the terminal status before transferring GEN.
- A settled lot cannot be paid or refunded again.
- Buyer recovery is available after rejection or expiry.

## Test Checklist

1. Lint the source with `genvm-lint check contracts/harvest_guard.py`.
2. Deploy to GenLayer testnet.
3. Create a low-value lot with clear quality criteria.
4. Submit publicly accessible inspection or traceability URLs.
5. Call `verify_quality`, then inspect `get_lot` for the verdict and reasoning.
6. Test a rejection and the expiry refund path before using meaningful value.
