import { useState } from 'react';
import SafetyLab from './SafetyLab.jsx';

const nav = [
  ['价值主张', 'value'], ['旗舰案例', 'cockpit'], ['产品证据', 'evidence'],
  ['经历', 'journey'], ['产品 Demo', 'lab'], ['联系', 'contact']
];

const capability = [
  ['临床一线', '真实问题与场景'], ['商业判断', '可行性与价值评估'],
  ['数据治理', '数据标准与合规'], ['AI 产品架构', '模型与系统设计'],
  ['软件验证', '可测试与可迭代']
];

const caseTabs = {
  '市场现状': {
    title: '健康座舱正在从舒适功能走向状态感知。',
    body: '奔驰已将行程、车辆与穿戴信息用于推荐舒缓方案；车载 AI 公司正在构建上下文助手与专用 Agent。真实机会不是增加一个聊天入口，而是让健康状态、安全规则与座舱执行形成闭环。'
  },
  '产品缺口': {
    title: '功能很多，但临床语义、数据质量和输出责任仍容易割裂。',
    body: '单一疲劳、情绪或生命体征信号难以支持复杂健康决策。功能分别建设也会造成重复数据接口、知识来源不一致、模型不可验证，以及高风险任务缺少人工升级。'
  },
  '我的设计': {
    title: '先定义状态、任务和风险，再选择模型。',
    body: '我将需求拆为 6 大能力板块和 34 项功能，以多模态状态层为共同输入，通过动态 Prompt、功能 Agent、Tool、RAG、Memory、Verifier 与反馈闭环形成统一 AI 中枢。'
  },
  '验证边界': {
    title: '产品架构已经形成，量产和临床有效性仍需逐层验证。',
    body: '当前证据支持产品与技术方案、研究工作流和软件 Demo，不代表整车部署或临床有效性。后续应以数据可得性、误报成本、延迟、隐私、专家评估和 A/B 测试建立准入门槛。'
  }
};

const layers = [
  ['应用层', '健康建议与场景应用'], ['智能体层', '任务规划与状态协同'],
  ['模型层', '多模态模型与能力调用'], ['数据层', '临床数据与知识库'],
  ['治理层', '数据治理与权限管理'], ['安全层', '内容安全与风险控制'],
  ['评估层', '效果评估与持续迭代'], ['基础设施层', '部署与工程化支撑']
];

const journey = [
  ['临床与医学背景', '理解医生、患者、医保和安全责任，判断需求是否适合真实工作流。'],
  ['业务与产品', '从市场、竞争、政策和技术壁垒判断一项能力是否值得建设。'],
  ['AI 与数据', '把多模态临床数据转化为 Schema、QC、数据字典和模型输入。'],
  ['产品架构', '把分散功能组织为 Agent、Tool、RAG、Verifier 和反馈闭环。'],
  ['工程与落地', '使用 AI 与 Coding 把规则做成软件、测试、报告和迭代证据。']
];

const risk = [
  ['时间分布变化', '模型在历史数据上有效，不代表面对后续患者仍可信。'],
  ['校准与不确定性', '产品不仅要给结果，也要表达置信边界与人工复核条件。'],
  ['临床边界', '群体关联不能直接替代个体预测、诊断或治疗分配。']
];

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>;
}

function App() {
  const asset = (name) => `${import.meta.env.BASE_URL}${name}`;
  const [activeTab, setActiveTab] = useState('我的设计');
  const [openBoundary, setOpenBoundary] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return <>
    <header className="site-header">
      <a className="brand" href="#top" onClick={() => scrollTo('top')}>陶文文 <span>Wenwen Tao</span></a>
      <button className="menu-button" aria-label="切换导航" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span/><span/></button>
      <nav className={menuOpen ? 'open' : ''} aria-label="主导航">
        {nav.map(([label, id]) => <button key={id} onClick={() => scrollTo(id)}>{label}</button>)}
      </nav>
      <a className="header-resume" href={asset('陶文文_临床AI产品构建者_简历_V3_公开版.pdf')} download>下载求职简历</a>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <h1><span>把真实临床问题，</span><span>做成可验证的 AI 产品。</span></h1>
          <p>我从临床与业务约束出发，定义数据、工作流与安全门槛，再用 AI 与 Coding 把方案做成可测试产品。</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => scrollTo('cockpit')}>查看旗舰案例 <ArrowIcon/></button>
            <a className="secondary" href={asset('陶文文_临床AI产品构建者_简历_V3_公开版.pdf')} download>下载求职简历</a>
          </div>
        </div>
        <div className="hero-person">
          <img src={asset('portrait.webp')} alt="陶文文职业肖像" />
          <div className="identity">
            <strong>陶文文<br/>Wenwen Tao</strong>
            <span>Clinical AI Product<br/>Medical AI Solutions<br/>AI Data Product<br/>Multimodal Agent</span>
          </div>
        </div>
      </section>

      <section id="value" className="capability-section section-shell">
        <div className="section-label"><span>价值主张</span></div>
        <div className="capability-rail">
          {capability.map(([title, text], i) => <div className="capability-step" key={title}>
            <span className="step-mark">{i + 1}</span><div><strong>{title}</strong><small>{text}</small></div>
            {i < capability.length - 1 && <ArrowIcon/>}
          </div>)}
        </div>
      </section>

      <section id="cockpit" className="case-section section-shell">
        <div className="section-label"><span>旗舰案例</span></div>
        <div className="case-heading">
          <div><h2>Intelligent Health Cockpit</h2><p>面向临床场景的 AI 决策工作台</p></div>
          <div className="case-tabs" role="tablist">
            {Object.keys(caseTabs).map(tab => <button role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}
          </div>
        </div>
        <div className="case-story" role="tabpanel">
          <span>{activeTab}</span><h3>{caseTabs[activeTab].title}</h3><p>{caseTabs[activeTab].body}</p>
        </div>
        <div className="architecture-grid">
          <div className="domain-map">
            <h3>6 大能力领域</h3>
            <div className="domain-row">{['临床洞察','患者管理','治疗支持','知识整合','协作沟通','数据分析'].map(x => <span key={x}>{x}</span>)}</div>
            <div className="module-count"><strong>34</strong><span>项功能被组织到统一产品架构中</span><i aria-hidden="true">{Array.from({length:17}).map((_,i)=><b key={i}/>)}</i></div>
          </div>
          <div className="layer-stack">
            <h3>8 层 AI 产品架构</h3>
            {layers.map(([a,b],i)=><div key={a}><em>{i+1}</em><strong>{a}</strong><span>{b}</span></div>)}
          </div>
        </div>
        <button className="boundary-toggle" aria-expanded={openBoundary} onClick={() => setOpenBoundary(!openBoundary)}>
          <span>验证边界与下一步</span><i>{openBoundary ? '收起' : '展开'}</i>
        </button>
        {openBoundary && <div className="boundary-panel"><p>已完成：产品功能地图、系统架构、研究工作流与软件 Demo。</p><p>待验证：整车端云部署、真实用户体验、误报与漏报成本、临床有效性、隐私影响及商业指标。</p></div>}
      </section>

      <section id="evidence" className="evidence-section section-shell">
        <div className="section-label"><span>产品证据</span></div>
        <div className="evidence-heading"><h2>BPlus 软件证据</h2><p>面向真实工作流的 AI 产品设计与验证</p></div>
        <div className="workflow-frame">
          <div className="workflow-intro"><strong>从专家流程到可审计软件</strong><p>协议、任务、同步、质量控制、状态解释和报告不再依赖口头经验。</p></div>
          <div className="workflow-steps">{['数据处理','模型应用','结果呈现','人工审核','迭代优化'].map((x,i)=><div key={x}><span>{String(i+1).padStart(2,'0')}</span><strong>{x}</strong>{i<4&&<ArrowIcon/>}</div>)}</div>
          <div className="gates"><div><strong>DEMO</strong><span>功能验证</span></div><div><strong>PILOT</strong><span>场景验证</span></div><div className="pending"><strong>REAL</strong><span>实践验证待完成</span></div></div>
        </div>
      </section>

      <section id="journey" className="journey-section section-shell">
        <div className="section-label"><span>经历</span></div>
        <div className="journey-heading"><h2>从临床问题到 AI 产品的能力演进</h2><p>每段经历都解决了产品价值链中的一个断点。</p></div>
        <div className="timeline">{journey.map(([title,text],i)=><article key={title}><span>{i+1}</span><strong>{title}</strong><p>{text}</p></article>)}</div>
      </section>

      <section className="risk-section section-shell">
        <div className="section-label"><span>模型与风险</span></div>
        <div className="risk-heading"><h2>我不仅关注模型能不能跑，也关注它何时会失效。</h2></div>
        <div className="risk-list">{risk.map(([title,text],i)=><article key={title}><span>0{i+1}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
        <div className="manuscript-evidence">
          <span>最新研究证据</span>
          <div><strong>Task state dominates participant-held-out prediction of risky decisions in methamphetamine dependence, with limited incremental value from pre-decision EEG.</strong><p>Submitted to <em>Clinical EEG and Neuroscience</em>。这项工作提醒产品团队：跨被试预测必须与任务状态基线比较，并单独验证 EEG 是否真正带来增量价值。</p></div>
        </div>
      </section>

      <section id="building" className="building-section section-shell">
        <div className="section-label"><span>正在构建</span></div>
        <div className="build-copy"><h2>Clinical AI Evidence &amp; Safety Lab</h2><p>面向临床 AI 的证据、安全和产品准入开源工具。</p></div>
        <div className="roadmap" aria-label="产品路线图">{['需求定义','核心功能开发','内部测试','开源发布','持续迭代'].map((x,i)=><div className={i<3?'done':i===3?'current':''} key={x}><span/>{x}</div>)}</div>
        <div className="status"><span>当前状态</span><strong>v0.2 内测</strong></div>
      </section>

      <SafetyLab />
    </main>

    <footer id="contact" className="site-footer section-shell">
      <div><span>联系</span><h2>期待与优秀的团队一起，<br/>用 AI 解决真实的临床问题。</h2></div>
      <div className="footer-actions">
        <a href={asset('陶文文_临床AI产品构建者_简历_V3_公开版.pdf')} download>下载求职简历</a>
        <a href="mailto:wendytao0310@gmail.com">邮件联系</a>
        <a href="https://wendytao9310.github.io/wenwen-academic-site/" target="_blank" rel="noreferrer">学术网站</a>
      </div>
      <p>© 2026 Wenwen Tao · Clinical AI product portfolio</p>
    </footer>
  </>;
}

export default App;
