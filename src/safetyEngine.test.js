import test from 'node:test';
import assert from 'node:assert/strict';
import { assessScenario } from './safetyEngine.js';

test('blocks patient-level data and autonomous care decisions', () => {
  const result = assessScenario({
    dataLevel: 'patient', decisionRole: 'autonomous', harm: 'high', oversight: 'none',
    externalValidation: false, calibration: false, subgroups: false, monitoring: false
  });
  assert.equal(result.level, 'L5');
  assert.equal(result.status, 'STOP');
  assert.equal(result.blockers.length, 2);
});

test('keeps low-risk aggregate workflow support inside a human-review gate', () => {
  const result = assessScenario({
    dataLevel: 'aggregate', decisionRole: 'workflow', harm: 'low', oversight: 'professional',
    externalValidation: true, calibration: true, subgroups: true, monitoring: true
  });
  assert.equal(result.level, 'L1');
  assert.equal(result.status, 'READY FOR HUMAN REVIEW');
});

test('surfaces evidence gaps instead of treating them as validated', () => {
  const result = assessScenario({
    dataLevel: 'synthetic', decisionRole: 'support', harm: 'medium', oversight: 'professional',
    externalValidation: false, calibration: false, subgroups: true, monitoring: false
  });
  assert.equal(result.level, 'L3');
  assert.equal(result.status, 'VERIFY BEFORE USE');
  assert.deepEqual(result.gaps, ['缺少独立外部验证', '缺少校准与不确定性评估', '缺少上线后监测与回滚方案']);
});
