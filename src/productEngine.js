const claimPatterns = [
  { pattern: /(临床验证|clinically validated)/i, label: '临床验证主张', fix: '改为“尚未完成临床验证”或说明具体研究阶段。' },
  { pattern: /(获批|监管批准|FDA approved|regulatory approved)/i, label: '监管主张', fix: '删除授权暗示，并标注“不是监管分类或批准结论”。' },
  { pattern: /(已经部署|已上线医院|commercially deployed|deployed in hospitals)/i, label: '部署主张', fix: '仅陈述已完成的软件 Demo、内部测试或实际可核实部署范围。' },
  { pattern: /(保证安全|零风险|100% accurate|完全准确)/i, label: '绝对化性能主张', fix: '改为有适用范围、数据来源和不确定性的描述。' },
  { pattern: /(诊断患者|推荐治疗|自动分诊|patient diagnosis|treatment recommendation)/i, label: '患者级用途主张', fix: '从公开 Demo 中移除患者级决策用途。' }
];

const privacyPatterns = [
  /\b1[3-9]\d{9}\b/,
  /\b\d{17}[\dXx]\b/,
  /患者|病历号|住院号|身份证|手机号|姓名[：:]/,
  /patient\s*(name|id)|medical\s*record/i
];

export function generateEvaluationPlan(scenario, assessment) {
  if (assessment.blockers.length) {
    return {
      status: 'HOLD',
      objective: '先移除禁止用途与禁止数据，当前场景不得进入评估。',
      tests: assessment.blockers.map(item => `修正停止条件：${item}`),
      releaseGate: '所有停止条件关闭并经治理负责人确认。'
    };
  }

  const tests = [
    '使用合成或合规汇总数据完成核心任务与 Bad Case 测试',
    '记录模型/规则版本、数据来源、排除标准和变更历史',
    '由目标用户完成可理解性与可撤回性检查'
  ];
  if (!scenario.externalValidation) tests.push('设计独立外部验证或明确标注 NOT VALIDATED');
  if (!scenario.calibration) tests.push('评估校准、不确定性和人工升级阈值');
  if (!scenario.subgroups) tests.push('检查预设亚组的样本量、性能与适用性边界');
  if (!scenario.monitoring) tests.push('定义漂移监测、事件记录、回滚和退役条件');
  if (assessment.level === 'L3' || assessment.level === 'L4') tests.push('安排方法学、临床、隐私和治理联合评审');

  return {
    status: 'DRAFT FOR HUMAN REVIEW',
    objective: `验证“${scenario.intendedUse || 'UNKNOWN'}”在声明范围内是否可理解、可追溯且风险可控。`,
    tests,
    releaseGate: assessment.gaps.length
      ? '证据缺口关闭或被明确接受后，才可进入下一阶段。'
      : '完成具名人工复核后，才可进入受控下一阶段。'
  };
}

export function checkClaims(text) {
  const value = text.trim();
  if (!value) return { status: 'EMPTY', findings: [] };
  const claimText = value
    .replace(/(?:尚未|未)完成(?:真实用户与)?临床验证/g, '')
    .replace(/not clinically validated/gi, '')
    .replace(/不是监管分类或批准结论/g, '');
  const findings = claimPatterns
    .filter(({ pattern }) => pattern.test(claimText))
    .map(({ label, fix }) => ({ label, fix }));
  return { status: findings.length ? 'REVISE' : 'NO FLAGGED CLAIMS', findings };
}

export function screenFeedback(feedback) {
  const combined = `${feedback.issue || ''} ${feedback.action || ''}`;
  const containsSensitiveData = privacyPatterns.some(pattern => pattern.test(combined));
  return {
    accepted: !containsSensitiveData,
    message: containsSensitiveData
      ? '疑似包含患者或身份信息，未保存。请删除后重新提交。'
      : '反馈仅保存在当前浏览器中，不会自动上传。'
  };
}
