const PHASES = [
  {
    id: 'foundation',
    title: 'Research Pipeline Foundation',
    weeks: 'Week 1-2',
    status: 'complete' as const,
    color: '#3a82d6',
    tasks: [
      { name: 'Six-Stage Pipeline Architecture', done: true, detail: 'DataEngineer → Researcher → Backtester → Critic → RiskManager → PM' },
      { name: 'MessageBus Communication', done: true, detail: 'Shared state store with pub/sub pattern' },
      { name: '5-Factor Model Implementation', done: true, detail: 'Momentum, Value (B/P), Size, Low-Vol, Reversal' },
      { name: 'Initial SP500 Research Universe', done: true, detail: 'yfinance OHLCV + fundamentals download' },
      { name: 'Alphalens Factor Analysis', done: true, detail: 'IC, quantile returns, factor charts' },
      { name: 'Flask Dashboard', done: true, detail: 'Research workflow monitoring' },
    ],
  },
  {
    id: 'optimization',
    title: 'Factor Optimization & A/B Tests',
    weeks: 'Week 3',
    status: 'complete' as const,
    color: '#8b5cf6',
    tasks: [
      { name: 'PCA Orthogonalization Audit', done: true, detail: 'Only per-fold PCA is admissible; full-sample PCA is quarantined' },
      { name: 'Industry Neutralization A/B', done: true, detail: 'Cross-sectional z-score within sectors' },
      { name: 'Universe Size Comparison', done: true, detail: 'Initial and expanded research universes compared' },
      { name: 'Legacy Baseline Quarantined', done: true, detail: 'Full-sample PCA retained only as an audit lesson' },
      { name: 'Lookahead Bias Identification', done: true, detail: 'Full-sample PCA is non-comparable and retained only as an audit lesson' },
    ],
  },
  {
    id: 'qlib',
    title: 'Qlib Migration & Validation',
    weeks: 'Week 3-4',
    status: 'complete' as const,
    color: '#16a34a',
    tasks: [
      { name: 'OHLCV → Qlib Binary Dump', done: true, detail: 'calendars/instruments/features/*.day.bin' },
      { name: 'Price Match Verification', done: true, detail: 'Qlib reads match yfinance prices exactly' },
      { name: 'Baseline Backtest Replay', done: true, detail: 'Qlib net annual return differs by 0.02 percentage points (2 bp) on the locked SP500 baseline' },
      { name: 'Reusable Backtest Library', done: true, detail: 'qlib_backtest_lib.py — shared by all experiments' },
    ],
  },
  {
    id: 'lgbm-v1',
    title: 'LightGBM Walk-Forward (v1)',
    weeks: 'Week 4',
    status: 'complete' as const,
    color: '#ea580c',
    tasks: [
      { name: 'Extended Factor Panel (2016-2024)', done: true, detail: 'Multi-year panel assembled for the initial ablation study' },
      { name: 'Walk-Forward Protocol', done: true, detail: '24M train / 3M test / 3M step; 23-fold schedule with OOS starting in 2019' },
      { name: 'Per-Fold PCA (No Lookahead)', done: true, detail: 'Honest feature engineering per fold' },
      { name: 'LambdaRank LightGBM', done: true, detail: 'Decile labels + group, 120 rounds' },
      { name: 'Honest Linear Baseline', done: true, detail: '6-month trailing IC-weighted PCs' },
      { name: 'Key Finding: ML < Linear', done: true, detail: 'Complexity did not improve risk-adjusted performance in the locked evaluation' },
    ],
  },
  {
    id: 'lgbm-v2',
    title: 'Regression + Wide Universe (v2)',
    weeks: 'Week 4+',
    status: 'complete' as const,
    color: '#d6457a',
    tasks: [
      { name: 'Expanded Russell Universe', done: true, detail: 'Broader cross-section prepared for the locked evaluation' },
      { name: 'Regression Objective (raw returns)', done: true, detail: 'Direct prediction of forward returns' },
      { name: 'LambdaRank on Wide Universe', done: true, detail: 'Same ranking approach, more data' },
      { name: 'Raw Features vs PCA', done: true, detail: 'Trees benefit from non-orthogonalized inputs' },
      { name: 'Best LightGBM: Raw+Rank', done: true, detail: 'Ranking was the strongest LightGBM variant in the locked comparison' },
      { name: 'Qlib Backtest on Russell 1000', done: true, detail: '459 instruments in Qlib binary format' },
    ],
  },
];

interface BacktestResult {
  model: string;
  universe: string;
  features: string;
  sharpe: number;
  mdd: number;
  netAnn: number;
  highlight?: boolean;
}

const RESULTS: BacktestResult[] = [
  { model: 'IC-Weighted Linear', universe: 'Russell-459', features: 'Raw 5-Factor', sharpe: 0.56, mdd: -21.5, netAnn: 12.1, highlight: true },
  { model: 'LambdaRank LightGBM', universe: 'Russell-459', features: 'Raw 5-Factor', sharpe: 0.44, mdd: -26.9, netAnn: 13.7 },
  { model: 'Regression LightGBM', universe: 'Russell-459', features: 'Raw 5-Factor', sharpe: 0.17, mdd: -38.0, netAnn: 5.2 },
];

const AGENTS = [
  { name: 'DataEngineer', role: '数据获取', icon: '📊', color: '#4CAF50', desc: 'yfinance OHLCV + fundamentals' },
  { name: 'Researcher', role: '因子研究', icon: '🔬', color: '#2196F3', desc: '5 factors, PCA, industry neutral' },
  { name: 'Backtester', role: '因子检验', icon: '📈', color: '#FF9800', desc: 'Alphalens IC, quantile returns' },
  { name: 'Critic', role: '质量审查', icon: '🔍', color: '#9C27B0', desc: 'Lookahead, survivorship, overfit' },
  { name: 'RiskManager', role: '风险管理', icon: '🛡️', color: '#F44336', desc: 'VaR, drawdown, stress tests' },
  { name: 'PortfolioManager', role: '组合构建', icon: '💼', color: '#607D8B', desc: 'IC-weighted Top-20 monthly' },
];

const FINDINGS = [
  {
    title: 'ML 不是免费午餐',
    detail: '在该锁定样本和评估期内，LightGBM 未能在风险调整基础上超越简单 IC 加权线性模型。选择正确的工具比默认使用复杂模型更重要。',
    icon: '⚖️',
    color: '#3a82d6',
  },
  {
    title: '复杂度必须经过样本外检验',
    detail: '公开主结果只使用可映射到 canonical manifest 的 raw-feature 实验。PCA 只有在每个训练折内拟合且 provenance 完整时才可比较。',
    icon: '🔄',
    color: '#8b5cf6',
  },
  {
    title: '结果口径锁定',
    detail: '459 个有效标的、24M/3M walk-forward、Top-20 月度等权与单边 10bps 成本构成公开结果的固定口径。',
    icon: '📐',
    color: '#16a34a',
  },
  {
    title: '全样本 PCA 结果不可比较',
    detail: '旧版全样本 PCA 在各训练折之外拟合，因此被隔离为审计案例，不作为可比较的业绩证据。',
    icon: '⚠️',
    color: '#ea580c',
  },
];

const SHOWCASE_LINKS = [
  { label: 'Live pipeline', href: 'https://wenyu0608.github.io/macro-risk-dashboard/#pipeline' },
  { label: 'GitHub', href: 'https://github.com/wenyu0608/macro-risk-dashboard' },
  { label: 'Methodology', href: 'https://github.com/wenyu0608/macro-risk-dashboard#readme' },
  { label: 'Canonical manifest', href: 'https://github.com/wenyu0608/macro-risk-dashboard/blob/main/research/canonical_results.json' },
  { label: 'Alpha Deck', href: 'https://wenyu0608.github.io/macro-risk-dashboard/#factorlab' },
];

const PROTOCOL_FACTS = [
  '459 instruments',
  '23-fold schedule (OOS starts 2019)',
  '24M train / 3M test',
  'Monthly Top-20',
  '10 bps / side',
  'Quoted backtest: Apr 2022 - Dec 2024',
];

const RESEARCH_DISCIPLINE = [
  {
    kicker: 'PREREGISTRATION',
    title: 'Three null results retained',
    detail: 'F001-F003 completed the S0-S7 protocol and were archived as null results rather than promoted as signals.',
    href: 'https://github.com/wenyu0608/macro-risk-dashboard/blob/main/factor_pipeline/DEAD_REVIEW.md',
    linkLabel: 'Read the audit review',
  },
  {
    kicker: 'DATA AUDIT',
    title: 'Reverse-split error corrected',
    detail: 'The UVIX benchmark was recomputed after identifying a reverse-split handling error; the corrected result remained a failure.',
    href: 'https://github.com/wenyu0608/macro-risk-dashboard/blob/main/factor_pipeline/DEAD_REVIEW.md',
    linkLabel: 'Inspect the correction',
  },
  {
    kicker: 'REPRODUCTION',
    title: 'Qlib baseline reproduced',
    detail: 'Net annual return matched within 0.02 percentage points (2 bp) for the locked SP500 portfolio-construction baseline only; this does not validate the Russell model scores.',
    href: 'https://github.com/wenyu0608/macro-risk-dashboard/blob/main/research/canonical_results.json',
    linkLabel: 'Check the scope',
  },
];

const FACTORS = [
  { name: 'Momentum', def: 'ret_2_12', desc: '2-12月累计收益（跳过近1月）', rationale: '价格趋势延续' },
  { name: 'Value (B/P)', def: 'book/price', desc: '账面价值/市价，延迟2月', rationale: '均值回归到基本面' },
  { name: 'Size', def: 'log(mcap)', desc: 'log市值，延迟2月', rationale: '小盘股溢价' },
  { name: 'Low Vol', def: '-20D σ', desc: '-20日滚动标准差', rationale: '低风险异象' },
  { name: 'Reversal', def: '-ret_1M', desc: '-1月收益率', rationale: '短期均值回归' },
];

function statusBadge(status: string) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    complete: { bg: '#dcfce7', color: '#15803d', label: 'COMPLETE' },
    active: { bg: '#dceeff', color: '#3a82d6', label: 'ACTIVE' },
    planned: { bg: '#f3f4f6', color: '#6b7280', label: 'PLANNED' },
  };
  const s = styles[status] || styles.planned;
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: '2px 10px', borderRadius: 12,
      fontSize: 10, fontWeight: 700, letterSpacing: '0.5px',
    }}>
      {s.label}
    </span>
  );
}

function pctColor(val: number, thresholds: [number, number]) {
  if (val >= thresholds[1]) return '#15803d';
  if (val >= thresholds[0]) return '#b45309';
  return '#dc2626';
}

export function ProjectBoard() {
  const completedTasks = PHASES.reduce((sum, p) => sum + p.tasks.filter(t => t.done).length, 0);
  const totalTasks = PHASES.reduce((sum, p) => sum + p.tasks.length, 0);

  return (
    <div className="board-container">
      <header className="board-header">
        <div>
          <h1>Quant Research Pipeline</h1>
          <p className="board-subtitle">项目进度看板 — Factor Research & Portfolio Construction</p>
        </div>
        <div className="board-stats">
          <div className="board-stat">
            <span className="board-stat-value">{completedTasks}/{totalTasks}</span>
            <span className="board-stat-label">Tasks</span>
          </div>
          <div className="board-stat">
            <span className="board-stat-value">{PHASES.length}</span>
            <span className="board-stat-label">Phases</span>
          </div>
          <div className="board-stat">
            <span className="board-stat-value">459</span>
            <span className="board-stat-label">Stocks</span>
          </div>
        </div>
      </header>

      <section className="showcase-hero" aria-labelledby="showcase-question">
        <div className="showcase-boundary">RESEARCH PROTOTYPE · NO LIVE CAPITAL</div>
        <div className="showcase-hero-grid">
          <div>
            <p className="showcase-kicker">RESEARCH QUESTION</p>
            <h2 id="showcase-question">
              Can a simple, reproducible factor pipeline outperform more complex models after leakage-aware walk-forward evaluation and transaction costs?
            </h2>
            <p className="showcase-takeaway">
              In this sample, the IC-weighted linear model delivered the strongest risk-adjusted result. Absolute performance is modest and sample-specific; it is not evidence of stable alpha.
            </p>
          </div>
          <nav className="showcase-links" aria-label="Project evidence links">
            {SHOWCASE_LINKS.map(link => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="showcase-facts" aria-label="Evaluation protocol">
          {PROTOCOL_FACTS.map(fact => <span key={fact}>{fact}</span>)}
        </div>
      </section>

      {/* Research Pipeline */}
      <section className="board-card">
        <div className="ab-header">
          <h2>Research Pipeline Architecture</h2>
          <span className="ab-badge">6 STAGES</span>
          <span className="ab-badge" style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}>RESEARCH PROTOTYPE</span>
        </div>
        <p className="lab-card-desc">六个确定性、角色化阶段通过 MessageBus 顺序执行，逐步完成数据获取、因子计算、回测验证、风险管理和组合构建</p>
        <div className="agent-pipeline">
          {AGENTS.map((agent, i) => (
            <div key={agent.name} className="agent-node" style={{ '--agent-color': agent.color } as React.CSSProperties}>
              <div className="agent-icon">{agent.icon}</div>
              <div className="agent-name">{agent.name}</div>
              <div className="agent-role">{agent.role}</div>
              <div className="agent-desc">{agent.desc}</div>
              {i < AGENTS.length - 1 && <div className="agent-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Factor Table */}
      <section className="board-card">
        <h2>Five-Factor Model</h2>
        <p className="lab-card-desc">基本面因子延迟2个月只是披露时滞代理；当前快照并非 point-in-time 历史财报，残余前视风险仍存在</p>
        <div className="lab-table-wrap">
          <table className="lab-table">
            <thead>
              <tr>
                <th>Factor</th>
                <th>Definition</th>
                <th>Description</th>
                <th>Rationale</th>
              </tr>
            </thead>
            <tbody>
              {FACTORS.map(f => (
                <tr key={f.name}>
                  <td style={{ fontWeight: 600 }}>{f.name}</td>
                  <td className="lab-td-mono" style={{ fontSize: 12 }}>{f.def}</td>
                  <td style={{ fontSize: 12, color: '#5a4452' }}>{f.desc}</td>
                  <td style={{ fontSize: 12, color: '#8a7882' }}>{f.rationale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Phase Timeline */}
      <section className="board-card">
        <div className="ab-header">
          <h2>Project Timeline</h2>
          <span className="ab-badge" style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac' }}>
            {Math.round(completedTasks / totalTasks * 100)}% COMPLETE
          </span>
        </div>
        <p className="lab-card-desc">每个阶段的工作内容与完成状态</p>

        <div className="phase-timeline">
          {PHASES.map((phase) => (
            <div key={phase.id} className="phase-card" style={{ '--phase-color': phase.color } as React.CSSProperties}>
              <div className="phase-header">
                <div className="phase-dot" style={{ background: phase.color }} />
                <div className="phase-title-row">
                  <h3>{phase.title}</h3>
                  <div className="phase-meta">
                    <span className="phase-weeks">{phase.weeks}</span>
                    {statusBadge(phase.status)}
                  </div>
                </div>
              </div>
              <div className="phase-tasks">
                {phase.tasks.map((task, i) => (
                  <div key={i} className={`phase-task ${task.done ? 'done' : ''}`}>
                    <span className="task-check">{task.done ? '✓' : '○'}</span>
                    <div className="task-info">
                      <span className="task-name">{task.name}</span>
                      <span className="task-detail">{task.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="phase-progress-bar">
                <div
                  className="phase-progress-fill"
                  style={{
                    width: `${phase.tasks.filter(t => t.done).length / phase.tasks.length * 100}%`,
                    background: phase.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Results Comparison */}
      <section className="board-card" style={{ borderColor: '#d6e6f7', background: 'linear-gradient(135deg, #fff7fa 0%, #fff 50%, #f2f8ff 100%)' }}>
        <div className="ab-header">
          <h2>Walk-Forward Backtest Results</h2>
          <span className="ab-badge">2022-04 ~ 2024-12</span>
          <span className="ab-badge" style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fcd34d' }}>TOP20 EW MONTHLY</span>
        </div>
        <p className="lab-card-desc">Canonical manifest 中可对外引用的样本外结果；仅适用于该样本和评估区间，不代表稳定 alpha</p>

        <div className="result-takeaway">
          <strong>Restrained conclusion.</strong> The linear baseline ranks first on risk-adjusted performance in this locked evaluation, while the absolute Sharpe remains modest. Model complexity did not produce a stable advantage in this sample.
        </div>

        <div className="lab-table-wrap">
          <table className="lab-table">
            <thead>
              <tr>
                <th>Model</th>
                <th>Universe</th>
                <th>Features</th>
                <th>Sharpe</th>
                <th>Max DD</th>
                <th>Net Ann.</th>
              </tr>
            </thead>
            <tbody>
              {RESULTS.map((r, i) => (
                <tr key={i} style={r.highlight ? { background: 'rgba(34, 197, 94, 0.06)' } : undefined}>
                  <td style={{ fontWeight: 600 }}>
                    {r.highlight && <span className="ab-best-tag">BEST</span>}
                    {r.model}
                  </td>
                  <td style={{ fontSize: 12 }}>{r.universe}</td>
                  <td style={{ fontSize: 12 }}>{r.features}</td>
                  <td className="lab-td-mono" style={{ color: pctColor(r.sharpe, [0.5, 0.8]) }}>
                    {r.sharpe.toFixed(2)}
                  </td>
                  <td className="lab-td-mono" style={{ color: r.mdd > -30 ? '#b45309' : '#dc2626' }}>
                    {r.mdd.toFixed(1)}%
                  </td>
                  <td className="lab-td-mono">
                    {r.netAnn.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ref-baseline">
          <span className="ref-label">REF</span>
          <span>Legacy full-sample PCA baseline is quarantined as an audit lesson and is not performance evidence.</span>
        </div>
      </section>

      <section className="board-card research-discipline">
        <div className="ab-header">
          <h2>Research Discipline</h2>
          <span className="ab-badge">AUDITABLE EVIDENCE</span>
        </div>
        <p className="lab-card-desc">Negative results, data corrections and reproduction boundaries remain part of the public research record.</p>
        <div className="discipline-grid">
          {RESEARCH_DISCIPLINE.map(item => (
            <article key={item.title} className="discipline-card">
              <span>{item.kicker}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <a href={item.href} target="_blank" rel="noreferrer">{item.linkLabel}</a>
            </article>
          ))}
        </div>
        <div className="scope-banner">
          The exact historical raw-feature command was not preserved. Provenance is reconstructed from checked-in artifacts, and fundamental inputs are not genuine point-in-time snapshots.
        </div>
      </section>

      {/* Key Findings */}
      <section className="board-card">
        <h2>Key Findings</h2>
        <p className="lab-card-desc">Walk-forward 诚实评估的核心结论</p>
        <div className="findings-grid">
          {FINDINGS.map((f, i) => (
            <div key={i} className="finding-card" style={{ borderTopColor: f.color }}>
              <div className="finding-icon">{f.icon}</div>
              <h3 style={{ color: f.color }}>{f.title}</h3>
              <p>{f.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="board-card">
        <h2>Tech Stack</h2>
        <div className="tech-tags">
          {['Python', 'yfinance', 'alphalens', 'scikit-learn', 'pandas', 'numpy', 'matplotlib',
            'LightGBM', 'Microsoft Qlib', 'Flask', 'React', 'Vite', 'Recharts', 'GitHub Actions'].map(t => (
            <span key={t} className="tech-tag">{t}</span>
          ))}
        </div>
      </section>

      <footer className="board-footer">
        <div>Quant Research Hub — reproducible walk-forward factor research on US equities</div>
        <div style={{ marginTop: '4px', fontSize: '10px', opacity: 0.6, letterSpacing: '0.3px' }}>
          Built with <strong>auto-dashboard</strong> · design © Coco
        </div>
      </footer>
    </div>
  );
}
