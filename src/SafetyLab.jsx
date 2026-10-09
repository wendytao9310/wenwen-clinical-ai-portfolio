import { useEffect, useMemo, useState } from 'react';
import { assessScenario } from './safetyEngine.js';
import { checkClaims, generateEvaluationPlan, screenFeedback } from './productEngine.js';

const initialScenario = {
  title: '合成数据模型评估工作台',
  intendedUser: '临床 AI 产品与研究团队',
  intendedUse: '比较模型在合成队列中的总体表现并记录验证缺口',
  dataLevel: 'synthetic',
  decisionRole: 'workflow',
  harm: 'medium',
  oversight: 'professional',
  externalValidation: false,
  calibration: true,
  subgroups: false,
  monitoring: false
};

const checklist = [
  ['externalValidation', '独立外部验证'],
  ['calibration', '校准与不确定性'],
  ['subgroups', '亚组适用性'],
  ['monitoring', '监测、回滚与退役']
];

export default function SafetyLab() {
  const [scenario, setScenario] = useState(initialScenario);
  const [generated, setGenerated] = useState(false);
  const [tool, setTool] = useState('gate');
  const [claimText, setClaimText] = useState('这是使用合成数据的软件 Demo，尚未完成真实用户与临床验证。');
  const [feedback, setFeedback] = useState({ role: '医疗 AI / 数据人员', severity: 'S3 体验问题', issue: '', action: '' });
  const [feedbackStatus, setFeedbackStatus] = useState('');
  const [ledger, setLedger] = useState(() => {
    try { return JSON.parse(localStorage.getItem('clinical-ai-feedback-ledger') || '[]'); }
    catch { return []; }
  });
  const result = useMemo(() => assessScenario(scenario), [scenario]);
  const plan = useMemo(() => generateEvaluationPlan(scenario, result), [scenario, result]);
  const claimResult = useMemo(() => checkClaims(claimText), [claimText]);
  useEffect(() => { localStorage.setItem('clinical-ai-feedback-ledger', JSON.stringify(ledger)); }, [ledger]);
  const update = (key, value) => {
    setScenario(current => ({ ...current, [key]: value }));
    setGenerated(false);
  };
  const saveFeedback = event => {
    event.preventDefault();
    const screened = screenFeedback(feedback);
    setFeedbackStatus(screened.message);
    if (!screened.accepted) return;
    setLedger(current => [{ ...feedback, id: Date.now(), status: '待评审' }, ...current].slice(0, 20));
    setFeedback(current => ({ ...current, issue: '', action: '' }));
  };

  return <section id="lab" className="lab-section section-shell">
    <div className="lab-head">
      <div>
        <span className="lab-kicker">可运行产品 Demo · v0.2</span>
        <h2>Evidence &amp; Safety Lab</h2>
        <p>把临床 AI 的用途、证据缺口与安全边界整理成一张可审计的准入卡。</p>
      </div>
      <div className="lab-boundary"><strong>研究与产品评估用途</strong><span>Not for patient care or live clinical use.</span></div>
    </div>

    <div className="lab-tools" role="tablist" aria-label="产品工具">
      {[['gate','安全准入卡'],['plan','评估计划'],['ledger','反馈台账'],['claims','Claim Checker']].map(([key,label]) => <button key={key} role="tab" aria-selected={tool === key} className={tool === key ? 'active' : ''} onClick={() => setTool(key)}>{label}</button>)}
    </div>

    {tool === 'gate' && <div className="lab-workspace">
      <form className="lab-form" onSubmit={event => { event.preventDefault(); setGenerated(true); }}>
        <h3>01 定义使用场景</h3>
        <label>产品/研究名称<input value={scenario.title} onChange={e => update('title', e.target.value)} /></label>
        <label>预期用户<input value={scenario.intendedUser} onChange={e => update('intendedUser', e.target.value)} /></label>
        <label>预期用途<textarea rows="3" value={scenario.intendedUse} onChange={e => update('intendedUse', e.target.value)} /></label>
        <div className="lab-field-row">
          <label>数据级别<select value={scenario.dataLevel} onChange={e => update('dataLevel', e.target.value)}><option value="synthetic">仅合成数据</option><option value="aggregate">仅汇总数据</option><option value="patient">患者级/可识别数据（禁止）</option></select></label>
          <label>决策角色<select value={scenario.decisionRole} onChange={e => update('decisionRole', e.target.value)}><option value="information">信息展示</option><option value="workflow">研究工作流辅助</option><option value="support">临床决策支持研究</option><option value="autonomous">自动诊疗/处置（禁止）</option></select></label>
          <label>潜在伤害<select value={scenario.harm} onChange={e => update('harm', e.target.value)}><option value="low">低</option><option value="medium">中</option><option value="high">高</option></select></label>
          <label>人工监督<select value={scenario.oversight} onChange={e => update('oversight', e.target.value)}><option value="professional">专业人员复核</option><option value="general">普通用户可检查</option><option value="none">无人工监督</option></select></label>
        </div>
        <fieldset><legend>02 已具备的证据</legend>{checklist.map(([key, label]) => <label className="check-row" key={key}><input type="checkbox" checked={scenario[key]} onChange={e => update(key, e.target.checked)} /><span>{label}</span></label>)}</fieldset>
        <p className="data-warning">请勿输入患者记录、身份信息、病历自由文本、影像、EEG 或其他原始健康数据。</p>
        <button className="lab-generate" type="submit">生成安全与证据卡</button>
        <a className="lab-feedback" href="https://github.com/wendytao9310/wenwen-clinical-ai-portfolio/issues/new?template=demo-feedback.yml" target="_blank" rel="noreferrer">完成测试后提交结构化反馈</a>
      </form>

      <div className={`evidence-card ${generated ? 'generated' : ''}`} aria-live="polite">
        <div className="card-top"><span>{generated ? result.status : 'DRAFT'}</span><strong>{result.level}</strong></div>
        <h3>{scenario.title || '未命名场景'}</h3>
        <dl><div><dt>预期用户</dt><dd>{scenario.intendedUser || 'UNKNOWN'}</dd></div><div><dt>预期用途</dt><dd>{scenario.intendedUse || 'UNKNOWN'}</dd></div><div><dt>建议等级</dt><dd>{result.title}：{result.description}</dd></div><div><dt>人工复核</dt><dd>{result.review}</dd></div></dl>
        {result.blockers.length > 0 && <div className="card-alert stop"><strong>停止条件</strong>{result.blockers.map(item => <p key={item}>{item}</p>)}</div>}
        <div className="card-alert"><strong>验证缺口</strong>{result.gaps.length ? result.gaps.map(item => <p key={item}>{item}</p>) : <p>当前声明项无缺口，仍需人工确认来源与适用范围。</p>}</div>
        <div className="card-next"><strong>建议下一步</strong><p>{result.blockers.length ? '移除禁止用途与数据后重新评估。' : '用合成/汇总数据完成 Bad Case、可用性与专家复核，并记录版本和变更。'}</p></div>
        <small>原型建议，不是法规分类、临床结论或合规证明。</small>
      </div>
    </div>}

    {tool === 'plan' && <div className="lab-module evaluation-module">
      <div className="module-summary"><span>{plan.status}</span><h3>Evaluation Plan</h3><p>{plan.objective}</p></div>
      <div className="evaluation-list"><strong>建议测试与治理任务</strong><ol>{plan.tests.map(item => <li key={item}>{item}</li>)}</ol></div>
      <div className="release-gate"><strong>下一阶段准入条件</strong><p>{plan.releaseGate}</p><small>计划由当前准入卡动态生成，必须经过具名专业人员复核。</small></div>
    </div>}

    {tool === 'ledger' && <div className="lab-module ledger-module">
      <form onSubmit={saveFeedback} className="ledger-form">
        <div><h3>记录一次产品反馈</h3><p>仅记录界面、流程与安全边界问题。不要输入患者资料。</p></div>
        <label>测试角色<select value={feedback.role} onChange={e => setFeedback({...feedback, role:e.target.value})}><option>临床/医学专业人员</option><option>临床研究人员</option><option>医疗 AI / 数据人员</option><option>产品 / 设计人员</option><option>质量 / 合规 / 安全人员</option></select></label>
        <label>严重度<select value={feedback.severity} onChange={e => setFeedback({...feedback, severity:e.target.value})}><option>S1 安全关键</option><option>S2 任务阻断</option><option>S3 体验问题</option><option>S4 建议</option></select></label>
        <label>发现的问题<textarea rows="3" required value={feedback.issue} onChange={e => setFeedback({...feedback, issue:e.target.value})} placeholder="只描述虚构场景、界面或流程" /></label>
        <label>建议修改<textarea rows="3" required value={feedback.action} onChange={e => setFeedback({...feedback, action:e.target.value})} /></label>
        <button type="submit">保存到本地台账</button>
        {feedbackStatus && <p className={feedbackStatus.includes('未保存') ? 'ledger-error' : 'ledger-success'}>{feedbackStatus}</p>}
      </form>
      <div className="ledger-list"><div className="ledger-title"><h3>当前浏览器中的反馈</h3><div><span>{ledger.length} 条</span>{ledger.length > 0 && <button type="button" onClick={() => { setLedger([]); setFeedbackStatus('本地反馈已清空。'); }}>清空本地记录</button>}</div></div>{ledger.length === 0 ? <p className="empty-state">尚无本地反馈。正式公开反馈请使用 GitHub Issue 模板。</p> : ledger.map(item => <article key={item.id}><span>{item.severity}</span><strong>{item.issue}</strong><p>{item.action}</p><small>{item.role} · {item.status}</small></article>)}</div>
    </div>}

    {tool === 'claims' && <div className="lab-module claim-module">
      <div><h3>Claim Checker</h3><p>检查网站、README 或 Demo 文案中是否存在超出当前证据的临床、监管和部署主张。</p><textarea rows="8" value={claimText} onChange={e => setClaimText(e.target.value)} /></div>
      <div className={`claim-result ${claimResult.status === 'REVISE' ? 'revise' : ''}`}><span>{claimResult.status}</span>{claimResult.findings.length ? claimResult.findings.map(item => <article key={item.label}><strong>{item.label}</strong><p>{item.fix}</p></article>) : <><h3>未发现预设高风险主张</h3><p>这不代表文案正确、完整或合规，仍需人工核对证据来源、语境和适用范围。</p></>}</div>
    </div>}
  </section>;
}
