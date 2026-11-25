#!/usr/bin/env python3
"""Validate externally quoted research claims against checked-in artifacts."""

from __future__ import annotations

import json
import csv
import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "research" / "canonical_results.json"
COMPARE = ROOT / "qlib_migration" / "compare_result_v2.json"
QLIB = ROOT / "qlib_migration" / "qlib_result.json"
FOLDS = ROOT / "qlib_migration" / "folds_v2.csv"


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def main() -> int:
    errors: list[str] = []
    manifest = load(MANIFEST)
    compare = load(COMPARE)
    qlib = load(QLIB)

    required = {
        "run_id", "claim_status", "reconstructed_provenance", "source_commit",
        "source_paths", "experiment", "canonical_net_results",
        "qlib_cross_check", "limitations", "quarantined_claims",
    }
    missing = sorted(required - manifest.keys())
    if missing:
        errors.append(f"manifest missing fields: {missing}")

    mapping = {
        "ic_weighted_linear": "linear",
        "lightgbm_lambdarank": "rank",
        "lightgbm_regression": "reg",
    }
    for public_name, source_name in mapping.items():
        expected = compare["backtest"][source_name]["net"]
        actual = manifest["canonical_net_results"][public_name]
        for key in ("annual_return", "sharpe", "max_drawdown"):
            if actual[key] != expected["ann_return" if key == "annual_return" else key]:
                errors.append(f"{public_name}.{key} diverges from compare_result_v2.json")
        if actual["total_cost"] != compare["backtest"][source_name]["total_cost"]:
            errors.append(f"{public_name}.total_cost diverges from compare_result_v2.json")

    qlib_diff = manifest["qlib_cross_check"]["net_annual_return_absolute_difference"]
    if qlib_diff != qlib["abs_diff_net"]:
        errors.append("Qlib net annual return difference diverges from qlib_result.json")

    experiment = manifest["experiment"]
    if experiment.get("effective_instruments") != 459:
        errors.append("effective instrument count must be 459")
    if experiment.get("fold_schedule_rows") != 23:
        errors.append("fold schedule must record 23 rows")
    with FOLDS.open(newline="", encoding="utf-8") as fh:
        actual_fold_rows = sum(1 for _ in csv.DictReader(fh))
    if experiment.get("fold_schedule_rows") != actual_fold_rows:
        errors.append(
            f"manifest fold count {experiment.get('fold_schedule_rows')} "
            f"does not match folds_v2.csv ({actual_fold_rows})"
        )
    if not manifest.get("reconstructed_provenance"):
        errors.append("current bundle must disclose reconstructed provenance")

    public_files = {
        "root_readme": ROOT / "README.md",
        "qlib_readme": ROOT / "qlib_migration" / "README.md",
        "project_board": ROOT / "dashboard" / "frontend" / "src" / "ProjectBoard.tsx",
    }
    public_contents = {
        name: path.read_text(encoding="utf-8")
        for name, path in public_files.items()
    }
    public_text = "\n".join(public_contents.values())
    prohibited_highlights = ("Sharpe 0.86", "15.4%", "six autonomous agents", "Six autonomous agents")
    for phrase in prohibited_highlights:
        if phrase in public_text:
            errors.append(f"prohibited canonical/highlight claim remains: {phrase!r}")

    public_models = {
        "IC-weighted linear": "ic_weighted_linear",
        "LightGBM LambdaRank": "lightgbm_lambdarank",
        "LightGBM Regression": "lightgbm_regression",
    }
    for public_name in ("root_readme", "qlib_readme"):
        path = public_files[public_name]
        text = public_contents[public_name]
        for label, key in public_models.items():
            result = manifest["canonical_net_results"][key]
            expected = (
                rf"\|\s*\**{re.escape(label)}\**\s*\|\s*\**{result['sharpe']:.2f}\**\s*\|"
                rf"\s*\**{result['annual_return'] * 100:.1f}%\**\s*\|"
                rf"\s*\**{result['max_drawdown'] * 100:.1f}%\**\s*\|"
            )
            if not re.search(expected, text, re.IGNORECASE):
                errors.append(f"{path.relative_to(ROOT)} does not quote canonical metrics for {label}")

    project_board = public_contents["project_board"]
    board_labels = {
        "IC-weighted linear": "IC-Weighted Linear",
        "LightGBM LambdaRank": "LambdaRank LightGBM",
        "LightGBM Regression": "Regression LightGBM",
    }
    for label, key in public_models.items():
        result = manifest["canonical_net_results"][key]
        expected = (
            rf"model:\s*'{re.escape(board_labels[label])}'.*?"
            rf"sharpe:\s*{result['sharpe']:.2f}.*?"
            rf"mdd:\s*{result['max_drawdown'] * 100:.1f}.*?"
            rf"netAnn:\s*{result['annual_return'] * 100:.1f}"
        )
        if not re.search(expected, project_board):
            errors.append(f"ProjectBoard.tsx does not quote canonical metrics for {label}")

    forbidden_public_patterns = {
        "project_board": {
            "quarantined 30%/17% comparison": r"(?:30%.*17%|17%.*30%)",
            "unsupported leakage-safe wording": r"leakage-safe",
            "unmanifested gross annual return": r"(?:grossAnn|Gross Ann\.)",
        },
        "site_navigation": {
            "unsupported leakage-safe wording": r"leakage-safe",
        },
    }
    site_navigation = (
        ROOT / "dashboard" / "frontend" / "src" / "siteNav.ts"
    ).read_text(encoding="utf-8")
    forbidden_contents = {
        "project_board": project_board,
        "site_navigation": site_navigation,
    }
    for public_name, patterns in forbidden_public_patterns.items():
        text = forbidden_contents[public_name]
        for description, pattern in patterns.items():
            if re.search(pattern, text, re.IGNORECASE | re.DOTALL):
                errors.append(f"{public_name} retains {description}")

    required_public_phrases = {
        "project_board": (
            "RESEARCH PROTOTYPE · NO LIVE CAPITAL",
            "23-fold schedule (OOS starts 2019)",
            "Quoted backtest: Apr 2022 - Dec 2024",
            "Absolute performance is modest and sample-specific",
            "it is not evidence of stable alpha",
            "Three null results retained",
            "reverse-split handling error",
            "locked SP500 portfolio-construction baseline only",
            "0.02 percentage points (2 bp)",
            "https://github.com/wenyu0608/macro-risk-dashboard",
            "/blob/main/research/canonical_results.json",
            "/blob/main/factor_pipeline/DEAD_REVIEW.md",
        ),
        "root_readme": (
            "https://wenyu0608.github.io/macro-risk-dashboard/#pipeline",
            "No result represents live capital",
            "validated stable alpha",
            "Three preregistered factor cases (F001-F003)",
            "UVIX reverse-split handling error",
            "locked SP500 portfolio-construction baseline",
            "0.02 percentage points (2 bp)",
            "https://wenyu0608.github.io/macro-risk-dashboard/#pipeline",
            "https://github.com/wenyu0608/macro-risk-dashboard.git",
        ),
        "qlib_readme": (
            "0.02 percentage points (2 bp)",
            "portfolio-construction implementation only",
            "does not independently validate the Russell model scores",
        ),
    }
    for public_name, phrases in required_public_phrases.items():
        text = public_contents[public_name]
        for phrase in phrases:
            if phrase not in text:
                path = public_files[public_name].relative_to(ROOT)
                errors.append(f"{path} missing required public evidence or boundary: {phrase!r}")

    if errors:
        print("Research claim validation FAILED:")
        for error in errors:
            print(f"- {error}")
        return 1
    print("Research claim validation passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
