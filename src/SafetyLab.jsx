import { useMemo, useState } from 'react';
import { assessScenario } from './safetyEngine.js';

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
  const result = useMemo(() => assessScenario(scenario), [scenario]);
  const update = (key, value) => {
    setScenario(current => ({ ...current, [key]: value }));
    setGenerated(false);
  };

  return <section id="lab" className="lab-section section-shell">
    <div className="lab-head">
      <div>
        <span className="lab-kicker">可运行产品 Demo · v0.1</span>
        <h2>Evidence &amp; Safety Lab</h2>
        <p>把临床 AI 的用途、证据缺口与安全边界整理成一张可审计的准入卡。</p>
      </div>
      <div className="lab-boundary"><strong>研究与产品评估用途</strong><span>Not for patient care or live clinical use.</span></div>
    </div>

    <div className="lab-workspace">
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
    </div>
  </section>;
}
