# Macro Risk Dashboard

US macro risk research dashboard, deployed on GitHub Pages. It displays the latest successful data snapshot and is not a live trading or execution system.

## Indicators

| Indicator | Source | Signal |
|-----------|--------|--------|
| Term Spread (10Y-2Y) | FRED | < 0 = recession warning (12-18mo lead) |
| Credit Spread (HY & IG) | FRED / ICE BofA | > 6% HY = extreme stress |
| VIX | CBOE / Yahoo Finance | > 30 = extreme fear |
| Absorption Ratio | Sector ETFs PCA | High = systemic fragility |
| Turbulence Index | Mahalanobis Distance | Spike = regime breakdown |
| Market Breadth | S&P 500 vs 200d MA | Deterioration = bearish divergence |
| S&P 500 | Yahoo Finance | Context/reference |

## Architecture

```
dashboard/
├── fetch_macro_data.py    # Python data fetcher (runs via GitHub Actions)
├── data/                  # JSON output (committed by CI)
├── requirements.txt       # Python dependencies
└── frontend/              # React + Vite + Recharts
    ├── src/
    ├── package.json
    └── dist/              # Built static site → GitHub Pages
```

## Local Development

### 1. Fetch data

```bash
cd dashboard
pip install -r requirements.txt
python fetch_macro_data.py
```

### 2. Run frontend

```bash
cd dashboard/frontend
npm install
cp -r ../data public/data
npm run dev
```

### 3. Build for production

```bash
npm run build
cp -r ../data dist/data
```

## Deployment

- **Data**: Scheduled for 00:30 UTC via `.github/workflows/update-data.yml`; the page shows the latest successful snapshot and may be stale if the workflow is unhealthy
- **Frontend**: Auto-deployed to GitHub Pages on push via `.github/workflows/deploy-dashboard.yml`

Check `summary.last_updated` before using the dashboard. A configured schedule is not evidence that daily refreshes are currently healthy; use a manual workflow dispatch and inspect the run history when the snapshot is stale.

## Setup GitHub Pages

1. Go to repo Settings → Pages
2. Set Source to "GitHub Actions"
3. Push to main/master to trigger deployment
