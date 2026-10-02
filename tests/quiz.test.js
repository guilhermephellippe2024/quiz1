import test from 'node:test';
import assert from 'node:assert/strict';
import { createQuizFlow, answerKeys } from '../src/data/quizFlow.js';
import { useQuizStore } from '../src/store/quizStore.js';

function choose(index = 0) {
  const state = useQuizStore.getState();
  const option = createQuizFlow(state.answers).screen(state.step).options[index];
  state.select(answerKeys[state.step], option);
}

test('all four initial situations reach diagnosis and mini VSL', () => {
  for (let situation = 0; situation < 4; situation++) {
    useQuizStore.getState().reset();
    choose(); choose(); choose(situation);
    for (let question = 1; question < 6; question++) choose();
    assert.equal(useQuizStore.getState().step, 8);
    assert.equal(Object.keys(useQuizStore.getState().answers).length, 8);
    for (let step = 8; step < 10; step++) {
      const state = useQuizStore.getState();
      assert.equal(state.step, step);
      const screen = createQuizFlow(state.answers).screen(step);
      assert.ok(screen.title);
      if (step === 8) assert.ok(screen.body.includes('<strong>'));
      if (step === 9) assert.equal(screen.videoId, 1231891598);
      state.next();
    }
    assert.equal(useQuizStore.getState().step, 9);
  }
});

test('back restores snapshots and changing branch discards dependent answers', () => {
  useQuizStore.getState().reset();
  choose(); choose(); choose(3);
  for (let question = 1; question < 6; question++) choose(3);
  assert.equal(useQuizStore.getState().answers.reason.id, 'ideagrow');
  for (let i = 0; i < 8; i++) useQuizStore.getState().back();
  assert.deepEqual(useQuizStore.getState().answers, {});
  choose(); choose(); choose(0);
  assert.deepEqual(Object.keys(useQuizStore.getState().answers), ['experience', 'age', 'situation']);
  choose(); choose(); choose(3);
  const screen = createQuizFlow(useQuizStore.getState().answers).screen(6);
  assert.equal(screen.title, 'O que mais te impediu de começar até hoje?');
});

test('invalid or duplicate answers cannot skip questions; reset clears history', () => {
  useQuizStore.getState().reset();
  useQuizStore.getState().next();
  assert.equal(useQuizStore.getState().step, 0);
  useQuizStore.getState().select('experience', { id: 'unknown' });
  assert.equal(useQuizStore.getState().step, 0);
  choose();
  useQuizStore.getState().select('experience', { id: 'often' });
  assert.equal(useQuizStore.getState().step, 1);
  useQuizStore.getState().reset();
  assert.equal(useQuizStore.getState().step, 0);
  assert.deepEqual(useQuizStore.getState().history, []);
  assert.deepEqual(useQuizStore.getState().answers, {});
});

 test('intro uses the exact requested copy and all experience/age choices preserve the original question', () => {
  const opening = createQuizFlow({}).screen(0);
  assert.equal(opening.title, 'Descubra o que falta para você começar a vender suas primeiras geleias');
  assert.equal(opening.sub, 'Responda algumas perguntas rápidas. Leva menos de 1 minuto.');
  assert.deepEqual(opening.options.map(o => o.text), ['Faço sempre', 'Fiz uma vez', 'Quero começar']);
  assert.deepEqual(createQuizFlow({}).screen(1).options.map(o => o.text), ['18 a 25', '26 a 35', '36 a 55', '56+']);
  for (let experience = 0; experience < 3; experience++) for (let age = 0; age < 4; age++) {
    useQuizStore.getState().reset(); choose(experience); choose(age);
    assert.equal(useQuizStore.getState().step, 2);
    assert.equal(createQuizFlow(useQuizStore.getState().answers).screen(2).title, 'Qual destas situações mais parece com a sua hoje?');
  }
});
