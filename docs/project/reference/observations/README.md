# Observation records

The machine-readable master ledger is [`../observations.json`](../observations.json).
Use a stable `MP-*` ID for every new micro-experiment. Mark it `observed` only
when the exact setup, action, visible result, persistence check, and evidence
are recorded; otherwise use `partially-observed`, `inferred`, or `unknown`.
