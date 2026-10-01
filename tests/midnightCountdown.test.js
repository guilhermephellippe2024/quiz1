import test from 'node:test';
import assert from 'node:assert/strict';
import { secondsUntilMidnight, formatCountdown } from '../src/utils/midnightCountdown.js';

test('counts down from 21:00 according to the local clock', () => {
  assert.equal(formatCountdown(secondsUntilMidnight(new Date(2026, 9, 1, 21, 0, 0))), '03:00:00');
  assert.equal(formatCountdown(secondsUntilMidnight(new Date(2026, 9, 1, 21, 0, 1))), '02:59:59');
});

test('handles the final second and starts the next day at midnight', () => {
  assert.equal(formatCountdown(secondsUntilMidnight(new Date(2026, 9, 1, 23, 59, 59, 900))), '00:00:01');
  assert.equal(formatCountdown(secondsUntilMidnight(new Date(2026, 9, 2, 0, 0, 0))), '24:00:00');
});

test('handles month and year rollover', () => {
  assert.equal(formatCountdown(secondsUntilMidnight(new Date(2026, 11, 31, 23, 30, 0))), '00:30:00');
  assert.equal(formatCountdown(secondsUntilMidnight(new Date(2027, 0, 1, 0, 0, 1))), '23:59:59');
});
