import test from 'node:test';
import assert from 'node:assert/strict';
import { createQuizFlow, answerKeys } from '../src/data/quizFlow.js';
import { useQuizStore } from '../src/store/quizStore.js';

function choose(index = 0) {
  const state = useQuizStore.getState();
  const option = createQuizFlow(state.answers).screen(state.step).options[index];
  state.select(answerKeys[state.step], option);
}

test('all four initial situations reach diagnosis, belief and mini VSL', () => {
  for (let situation = 0; situation < 4; situation++) {
    useQuizStore.getState().reset();
    choose(situation);
    for (let question = 1; question < 6; question++) choose();
    assert.equal(useQuizStore.getState().step, 6);
    assert.equal(Object.keys(useQuizStore.getState().answers).length, 6);
    for (let step = 6; step < 9; step++) {
      const state = useQuizStore.getState();
      assert.equal(state.step, step);
      const screen = createQuizFlow(state.answers).screen(step);
      assert.ok(screen.title);
      if (step === 6) assert.ok(screen.body.includes('<strong>'));
      if (step === 8) assert.equal(screen.videoId, 1231891598);
      state.next();
    }
    assert.equal(useQuizStore.getState().step, 8);
    useQuizStore.getState().back();
    assert.equal(useQuizStore.getState().step, 7);
  }
});

test('back restores snapshots and changing branch discards dependent answers', () => {
  useQuizStore.getState().reset();
  choose(3);
  for (let question = 1; question < 6; question++) choose(3);
  assert.equal(useQuizStore.getState().answers.reason.id, 'ideagrow');
  for (let i = 0; i < 6; i++) useQuizStore.getState().back();
  assert.deepEqual(useQuizStore.getState().answers, {});
  choose(0);
  assert.deepEqual(Object.keys(useQuizStore.getState().answers), ['situation']);
  choose(); choose(); choose(3);
  const screen = createQuizFlow(useQuizStore.getState().answers).screen(4);
  assert.equal(screen.title, 'O que mais te impediu de começar até hoje?');
});

test('invalid or duplicate answers cannot skip questions; reset clears history', () => {
  useQuizStore.getState().reset();
  useQuizStore.getState().next();
  assert.equal(useQuizStore.getState().step, 0);
  useQuizStore.getState().select('situation', { id: 'unknown' });
  assert.equal(useQuizStore.getState().step, 0);
  choose();
  useQuizStore.getState().select('situation', { id: 'selling' });
  assert.equal(useQuizStore.getState().step, 1);
  useQuizStore.getState().reset();
  assert.equal(useQuizStore.getState().step, 0);
  assert.deepEqual(useQuizStore.getState().history, []);
  assert.deepEqual(useQuizStore.getState().answers, {});
});
