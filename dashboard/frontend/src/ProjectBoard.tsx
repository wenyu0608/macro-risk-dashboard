const RESULTS = [
  { model: 'IC-Weighted Linear', sharpe: 0.56, mdd: -21.5, netAnn: 12.1 },
  { model: 'LambdaRank LightGBM', sharpe: 0.44, mdd: -26.9, netAnn: 13.7 },
  { model: 'Regression LightGBM', sharpe: 0.17, mdd: -38.0, netAnn: 5.2 },
];

const REPO = 'https://github.com/wenyu0608/macro-risk-dashboard';
const MANIFEST = `${REPO}/blob/main/research/canonical_results.json`;
const AUDIT = `${REPO}/blob/main/factor_pipeline/DEAD_REVIEW.md`;

const PROTOCOL_FACTS = [
  '459 instruments',
  '24-month training / 3-month testing',
  'Monthly top-20, equal weight',
  '10 bps / side',
];

const RESEARCH_DESIGN = [
  {
    title: 'Build a common information set',
    detail: 'Compare models using the same five raw signals: momentum, book-to-price, size, low volatility and short-term reversal.',
  },
  {
    title: 'Fit and evaluate in market time',
    detail: 'Roll 24-month training and 3-month test windows forward by three months. The 23-fold schedule (OOS starts 2019) describes model evaluation coverage. The portfolio results above use the locked April 2022 to December 2024 window.',
  },
  {
    title: 'Hold the portfolio rule fixed',
    detail: 'Turn each monthly ranking into the same equal-weight top-20 portfolio and apply identical per-side costs. Compare net Sharpe, annualized return and maximum drawdown together.',
  },
];

const RESEARCH_DISCIPLINE = [
  {
    title: 'Three null results retained',
    detail: 'Three preregistered single-factor studies (F001–F003) were archived as null results. The audit records the tests and the criteria used to stop.',
    href: AUDIT,
    label: 'Read the audit',
  },
  {
    title: 'Corporate-action error corrected',
    detail: 'A UVIX reverse-split handling error inflated a benchmark in a separate factor study. The corrected result still failed its acceptance criteria.',
    href: AUDIT,
    label: 'Inspect the correction',
  },
  {
    title: 'Portfolio implementation cross-checked',
    detail: 'The Qlib replay matched net annual return within 0.02 percentage points (2 bp) for the locked SP500 portfolio-construction baseline only. The Russell model comparison has separate provenance.',
    href: MANIFEST,
    label: 'Check the replication scope',
  },
];

const PILOT_PLAN = [
  {
    title: 'Build an event-time dataset',
    detail: 'Align timestamped company news and policy announcements with historical intraday US-equity quotes. Record first availability, revisions and the spread immediately before each event.',
  },
  {
    title: 'Forecast five-minute spread widening',
    detail: 'Compare numerical-only, text-only and fused models on the same events and later test period. Prespecify the widening threshold and evaluate probability calibration alongside log loss.',
  },
  {
    title: 'Measure the value of timely text',
    detail: 'Compare fresh, delayed and stale text using the same evaluation clock. With order-level data, extend the study to time to fill and passive versus aggressive execution.',
  },
];

function ResearchSteps({ items }: { items: typeof RESEARCH_DESIGN }) {
  return (
    <div className="discipline-grid">
      {items.map(item => (
        <article key={item.title} className="discipline-card">
          <h3>{item.title}</h3>
          <p>{item.detail}</p>
        </article>
      ))}
    </div>
  );
}

export function ProjectBoard() {
  return (
    <div className="board-container">
      <header className="board-header">
        <div>
          <h1>Quant Research Pipeline</h1>
          <p className="board-subtitle">Wenyu Li · Independent research in US equities</p>
        </div>
      </header>

      <section className="showcase-hero" aria-labelledby="showcase-question">
        <div className="showcase-boundary">RESEARCH PROTOTYPE · NO LIVE CAPITAL</div>
        <div className="showcase-hero-grid">
          <div>
            <h2 id="showcase-question">Does a more complex model improve a factor portfolio after costs?</h2>
            <p className="showcase-takeaway">
              On the same five inputs and portfolio rule, the IC-weighted linear model had the highest net Sharpe.
              LambdaRank earned a higher annualized return with a deeper drawdown.
            </p>
          </div>
          <nav className="showcase-links" aria-label="Project evidence links">
            <a href={REPO}>Code and methodology</a>
            <a href={MANIFEST}>Results manifest</a>
            <a href={AUDIT}>Experiment audit</a>
          </nav>
        </div>
        <div className="showcase-facts" aria-label="Evaluation protocol">
          {PROTOCOL_FACTS.map(fact => <span key={fact}>{fact}</span>)}
        </div>
      </section>

      <section className="board-card" aria-labelledby="backtest-results">
        <h2 id="backtest-results">Walk-Forward Backtest Results</h2>
        <p className="lab-card-desc">Quoted backtest: Apr 2022 - Dec 2024. All three models used the same liquidity-filtered Russell 1000 panel, inputs and cost assumptions.</p>
        <div className="lab-table-wrap" tabIndex={0} role="region" aria-label="Model comparison">
          <table className="lab-table">
            <thead>
              <tr>
                <th scope="col">Model</th>
                <th scope="col">Net Sharpe</th>
                <th scope="col">Net annualized return</th>
                <th scope="col">Max drawdown</th>
              </tr>
            </thead>
            <tbody>
              {RESULTS.map(result => (
                <tr key={result.model}>
                  <th scope="row">{result.model}</th>
                  <td className="lab-td-mono">{result.sharpe.toFixed(2)}</td>
                  <td className="lab-td-mono">{result.netAnn.toFixed(1)}%</td>
                  <td className="lab-td-mono">{result.mdd.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="result-takeaway">Absolute performance is modest and sample-specific, and it is not evidence of stable alpha.</p>
      </section>

      <section className="board-card research-discipline" aria-labelledby="research-design">
        <h2 id="research-design">Research Design</h2>
        <ResearchSteps items={RESEARCH_DESIGN} />
      </section>

      <section className="board-card research-discipline" aria-labelledby="audit-evidence">
        <h2 id="audit-evidence">Validation and Limitations</h2>
        <div className="discipline-grid">
          {RESEARCH_DISCIPLINE.map(item => (
            <article key={item.title} className="discipline-card">
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <a href={item.href}>{item.label}</a>
            </article>
          ))}
        </div>
        <div className="scope-banner">
          The current-constituent universe is exposed to survivorship bias. Lagged fundamental snapshots cannot establish what was known at the time.
          Full-sample PCA was excluded because it used data outside the training folds. The exact historical run command was not retained, so the comparison is documented through checked-in artifacts.
        </div>
      </section>

      <section className="board-card research-discipline" aria-labelledby="microstructure-pilot">
        <h2 id="microstructure-pilot">Proposed Study: Language and Intraday Liquidity</h2>
        <p className="lab-card-desc">
          The factor study compared models given the same inputs. The next question is whether a new input,
          timestamped text, adds information beyond a strong numerical baseline. That requires intraday quote
          and news data at the time scale of the decision.
        </p>
        <ResearchSteps items={PILOT_PLAN} />
      </section>
    </div>
  );
}
