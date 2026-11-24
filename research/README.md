# Research claim policy

`canonical_results.json` is the sole source for externally quoted performance.
Every public number in the repository, portfolio site or CV must map to that
manifest and its checked-in source artifacts.

## Canonical result bundle

The current canonical bundle is the raw five-factor Russell panel evaluated
from April 2022 to December 2024. Its provenance was reconstructed from the
checked-in comparison JSON, Qlib cross-check and fold schedule because the
original command and immutable run directory were not preserved. This is
recorded explicitly in the manifest and must not be omitted when describing
reproducibility.

The Qlib result validates only the locked SP500 portfolio-construction
baseline. It does not independently validate Russell model scores, factor
inputs or all LightGBM results.

## Quarantined results

Results produced with full-sample PCA are audit lessons, not performance
evidence. They may be shown only in a clearly labelled failure analysis and
must never be highlighted as a canonical or best result. The generic pipeline
therefore runs raw features by default; PCA is valid only when fit within each
training fold.

## External quoting rules

- Say "results on this sample and evaluation period", not "validated alpha".
- Say "six deterministic, role-based research stages", not "autonomous AI
  trading agents".
- State that the two-month fundamental lag is a proxy; current-snapshot
  fundamentals are not point-in-time data.
- Do not imply live trading, real-money returns, production execution or daily
  operational health merely because a scheduled workflow exists.
- Run `python3 scripts/validate_research_claims.py` before publishing changes.
