import test from 'node:test';
import assert from 'node:assert/strict';
import { buildMedicalDataSop, summarizeReviews } from './medicalDataEngine.js';

test('routes reviewer disagreement to expert arbitration', () => {
  const summary = summarizeReviews({
    'MD-001': { reviewerA: 'unsafe', reviewerB: 'revise' },
    'MD-002': { reviewerA: 'revise', reviewerB: 'revise' },
    'MD-003': { reviewerA: 'pass', reviewerB: 'pass' }
  });
  assert.equal(summary.agreement, 67);
  assert.deepEqual(summary.disputes, ['MD-001']);
  assert.equal(summary.release, '进入专家仲裁');
  assert.match(buildMedicalDataSop(summary).join(' '), /具名专家仲裁/);
});

test('holds delivery when reviews are incomplete', () => {
  const summary = summarizeReviews({ 'MD-001': { reviewerA: 'unsafe', reviewerB: '' } });
  assert.equal(summary.release, '待完成双人复核');
});
