export const safetyLevels = {
  L0: ['内容展示', '不参与健康判断'],
  L1: ['信息整理', '仅提供一般性教育信息'],
  L2: ['工作流辅助', '结果可检查、可撤回，不影响个体诊疗'],
  L3: ['决策支持研究', '必须可追溯并由合格专业人员复核'],
  L4: ['高风险研究功能', '可能影响诊疗路径，需前瞻性验证与治理'],
  L5: ['禁止在本 Demo 中实现', '自动诊断、治疗、剂量或紧急处置']
};

const levelOrder = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5'];

export function assessScenario(input) {
  const blockers = [];
  const gaps = [];
  let score = 0;

  if (input.dataLevel === 'patient') blockers.push('不得输入患者级记录、可识别信息、自由文本、影像或生理信号。');
  if (input.decisionRole === 'autonomous') blockers.push('本 Demo 禁止自动诊断、治疗、剂量、分诊或紧急处置。');
  if (input.decisionRole === 'support') score += 3;
  if (input.decisionRole === 'workflow') score += 2;
  if (input.harm === 'high') score += 2;
  if (input.harm === 'medium') score += 1;
  if (input.oversight === 'none') score += 2;
  if (input.oversight === 'professional') score -= 1;

  if (!input.externalValidation) gaps.push('缺少独立外部验证');
  if (!input.calibration) gaps.push('缺少校准与不确定性评估');
  if (!input.subgroups) gaps.push('缺少亚组适用性检查');
  if (!input.monitoring) gaps.push('缺少上线后监测与回滚方案');

  const level = blockers.length ? 'L5' : levelOrder[Math.max(0, Math.min(4, score))];
  const review = level === 'L0' || level === 'L1'
    ? '产品负责人确认用途与文案边界'
    : level === 'L2'
      ? '领域专家与产品负责人共同复核'
      : '方法学、临床、隐私及治理角色共同复核';

  return {
    level,
    title: safetyLevels[level][0],
    description: safetyLevels[level][1],
    blockers,
    gaps,
    review,
    status: blockers.length ? 'STOP' : gaps.length ? 'VERIFY BEFORE USE' : 'READY FOR HUMAN REVIEW'
  };
}
