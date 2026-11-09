import { useMemo, useState } from 'react';
import { buildMedicalDataSop, medicalItems, summarizeReviews } from './medicalDataEngine.js';

const options = [['','未评'],['pass','通过'],['revise','需修订'],['unsafe','安全阻断']];

export default function MedicalDataOps(){
  const [selected,setSelected]=useState(medicalItems[0].id);
  const [reviews,setReviews]=useState({
    'MD-001':{reviewerA:'unsafe',reviewerB:'revise'},
    'MD-002':{reviewerA:'revise',reviewerB:'revise'},
    'MD-003':{reviewerA:'pass',reviewerB:'pass'}
  });
  const item=medicalItems.find(x=>x.id===selected);
  const summary=useMemo(()=>summarizeReviews(reviews),[reviews]);
  const sop=useMemo(()=>buildMedicalDataSop(summary),[summary]);
  const update=(reviewer,value)=>setReviews(current=>({...current,[selected]:{...current[selected],[reviewer]:value}}));
  return <section id="dataops" className="dataops-section page-shell">
    <div className="dataops-head"><div><span>可运行产品原型 · 合成数据</span><h2>Medical Data Ops Studio</h2><p>把医学需求转化为评测集、标注规范、双人复核、争议仲裁、质量归因和交付 SOP。</p></div><div className={`delivery-state ${summary.disputes.length?'warn':'hold'}`}><small>当前交付状态</small><strong>{summary.release}</strong><span>不接收真实患者数据</span></div></div>
    <div className="dataops-layout">
      <aside className="task-queue"><strong>合成评测集</strong>{medicalItems.map(x=><button className={selected===x.id?'active':''} key={x.id} onClick={()=>setSelected(x.id)}><span>{x.id}</span><b>{x.task}</b><small>{x.issue}</small></button>)}</aside>
      <div className="annotation-panel"><div className="panel-label">医学任务定义</div><h3>{item.task}</h3><dl><div><dt>用户问题</dt><dd>{item.prompt}</dd></div><div><dt>模型回答</dt><dd>{item.answer}</dd></div><div><dt>标准答案要点</dt><dd>{item.standard}</dd></div></dl><div className="review-grid"><label>医学复核 A<select value={reviews[item.id]?.reviewerA||''} onChange={e=>update('reviewerA',e.target.value)}>{options.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label><label>医学复核 B<select value={reviews[item.id]?.reviewerB||''} onChange={e=>update('reviewerB',e.target.value)}>{options.map(([v,l])=><option value={v} key={v}>{l}</option>)}</select></label></div>{reviews[item.id]?.reviewerA&&reviews[item.id]?.reviewerB&&reviews[item.id].reviewerA!==reviews[item.id].reviewerB&&<p className="arbitration-alert"><strong>触发专家仲裁</strong> 两名复核者结论不一致，当前样本不得进入交付集。</p>}</div>
      <div className="quality-panel"><div className="quality-metrics"><div><small>双人完成</small><strong>{summary.completed}/{medicalItems.length}</strong></div><div><small>一致率</small><strong>{summary.agreement}%</strong></div><div><small>争议样本</small><strong>{summary.disputes.length}</strong></div><div><small>安全阻断</small><strong>{summary.safetyBlocks}</strong></div></div><div className="root-cause"><strong>质量归因</strong><p>安全边界：回答越过医疗建议权限</p><p>信息缺失：未检查单位、参考范围和上下文</p><p>规范修订：把高频错误写回标注指南与培训样例</p></div><div className="sop-list"><strong>自动生成的交付 SOP</strong><ol>{sop.map(x=><li key={x}>{x}</li>)}</ol></div></div>
    </div>
    <p className="dataops-boundary"><strong>证据边界：</strong>该模块证明产品定义、评测规则、数据质检和原型交付能力；尚未证明真实医生团队管理、供应商产能、线上模型效果或临床有效性。</p>
  </section>;
}
