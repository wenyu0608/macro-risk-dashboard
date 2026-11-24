from __future__ import annotations

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


class ManifestIntegrityTests(unittest.TestCase):
    def test_manifest_matches_checked_in_results(self):
        manifest = json.loads((ROOT / "research/canonical_results.json").read_text())
        comparison = json.loads((ROOT / "qlib_migration/compare_result_v2.json").read_text())
        self.assertEqual(manifest["claim_status"], "canonical_with_reconstructed_provenance")
        self.assertTrue(manifest["reconstructed_provenance"])
        self.assertEqual(manifest["experiment"]["effective_instruments"], 459)
        self.assertEqual(manifest["experiment"]["fold_schedule_rows"], 23)
        self.assertEqual(manifest["experiment"]["transaction_cost_per_side"], 0.001)
        self.assertEqual(
            manifest["qlib_cross_check"]["scope"],
            "locked SP500 portfolio-construction baseline only",
        )
        self.assertEqual(
            manifest["qlib_cross_check"]["net_annual_return_absolute_difference"],
            0.0002,
        )
        limitations = " ".join(manifest["limitations"]).lower()
        self.assertIn("no live capital", limitations)
        self.assertIn("sample-specific", limitations)
        self.assertIn("do not establish stable alpha", limitations)
        self.assertEqual(
            manifest["canonical_net_results"]["ic_weighted_linear"]["sharpe"],
            comparison["backtest"]["linear"]["net"]["sharpe"],
        )
        self.assertEqual(
            manifest["canonical_net_results"]["lightgbm_lambdarank"]["annual_return"],
            comparison["backtest"]["rank"]["net"]["ann_return"],
        )

    def test_public_showcase_retains_boundaries_and_evidence_links(self):
        board = (ROOT / "dashboard/frontend/src/ProjectBoard.tsx").read_text(encoding="utf-8")
        readme = (ROOT / "README.md").read_text(encoding="utf-8")
        qlib_readme = (ROOT / "qlib_migration/README.md").read_text(encoding="utf-8")
        site_nav = (ROOT / "dashboard/frontend/src/siteNav.ts").read_text(encoding="utf-8")

        self.assertIn("RESEARCH PROTOTYPE · NO LIVE CAPITAL", board)
        self.assertIn("459 instruments", board)
        self.assertIn("23-fold schedule (OOS starts 2019)", board)
        self.assertIn("Quoted backtest: Apr 2022 - Dec 2024", board)
        self.assertIn("10 bps / side", board)
        self.assertIn("Absolute performance is modest and sample-specific", board)
        self.assertIn("it is not evidence of stable alpha", board)
        self.assertIn("Three null results retained", board)
        self.assertIn("reverse-split handling error", board)
        self.assertIn("locked SP500 portfolio-construction baseline only", board)
        self.assertIn("0.02 percentage points (2 bp)", board)
        self.assertIn("https://wenyu0608.github.io/macro-risk-dashboard/#pipeline", board)
        self.assertIn("https://github.com/wenyu0608/macro-risk-dashboard", board)
        self.assertIn("https://wenyu0608.github.io/macro-risk-dashboard/#factorlab", board)

        self.assertIn("No result represents live capital", readme)
        self.assertIn("Three preregistered factor cases (F001-F003)", readme)
        self.assertIn("UVIX reverse-split handling error", readme)
        self.assertIn("locked SP500 portfolio-construction baseline", readme)
        self.assertIn("0.02 percentage points (2 bp)", readme)
        self.assertIn("https://wenyu0608.github.io/macro-risk-dashboard/#pipeline", readme)

        self.assertIn("0.02 percentage points (2 bp)", qlib_readme)
        self.assertIn("portfolio-construction implementation only", qlib_readme)
        self.assertIn("Leakage-aware walk-forward evaluation", site_nav)
        self.assertIn("459 stocks · 23-fold schedule · 10 bps/side", site_nav)

        public_showcase = "\n".join((board, readme, qlib_readme, site_nav))
        self.assertNotRegex(public_showcase.lower(), r"leakage-safe")
        self.assertNotRegex(board, r"Gross Ann\.")
        self.assertNotRegex(board, r"\bgrossAnn\b")
        self.assertNotRegex(board.replace("\n", " "), r"(?:30%.*17%|17%.*30%)")
        self.assertNotIn("Sharpe 0.86", public_showcase)
        self.assertNotIn("15.4%", public_showcase)


if __name__ == "__main__":
    unittest.main()
