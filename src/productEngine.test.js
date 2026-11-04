import test from 'node:test';
import assert from 'node:assert/strict';
import { buildAuditReport, checkClaims, generateEvaluationPlan, screenFeedback } from './productEngine.js';

test('holds evaluation when safety blockers exist', () => {
  const plan = generateEvaluationPlan({ intendedUse: '自动诊断' }, { level: 'L5', blockers: ['禁止自动诊断'], gaps: [] });
  assert.equal(plan.status, 'HOLD');
  assert.match(plan.tests[0], /停止条件/);
});

test('adds missing evidence work to evaluation plan', () => {
  const plan = generateEvaluationPlan(
    { intendedUse: '比较模型', externalValidation: false, calibration: true, subgroups: false, monitoring: false },
    { level: 'L3', blockers: [], gaps: ['缺少外部验证'] }
  );
  assert.equal(plan.status, 'DRAFT FOR HUMAN REVIEW');
  assert.ok(plan.tests.some(item => item.includes('外部验证')));
  assert.ok(plan.tests.some(item => item.includes('联合评审')));
});

test('flags unsupported clinical and regulatory claims', () => {
  const result = checkClaims('本产品已经完成临床验证并获 FDA approved。');
  assert.equal(result.status, 'REVISE');
  assert.equal(result.findings.length, 2);
});

test('accepts bounded demo wording', () => {
  const result = checkClaims('这是使用合成数据的软件 Demo，尚未完成真实用户与临床验证。');
  assert.equal(result.status, 'NO FLAGGED CLAIMS');
  assert.equal(result.findings.length, 0);
});

test('rejects feedback that appears to contain patient identifiers', () => {
  const result = screenFeedback({ issue: '患者姓名：张三', action: '优化界面' });
  assert.equal(result.accepted, false);
});

test('exports an auditable report with boundaries and gaps', () => {
  const report = buildAuditReport(
    { title: 'Synthetic model', intendedUser: 'Product team', intendedUse: 'Compare aggregate performance', dataLevel: 'synthetic', decisionRole: 'workflow' },
    { status: 'REVIEW', level: 'L2', title: 'Controlled review', review: 'Human review', blockers: [], gaps: ['External validation missing'] },
    { status: 'DRAFT', tests: ['Run bad-case testing'], releaseGate: 'Close evidence gaps' }
  );
  assert.match(report, /Synthetic model/);
  assert.match(report, /External validation missing/);
  assert.match(report, /not a regulatory classification/i);
});
