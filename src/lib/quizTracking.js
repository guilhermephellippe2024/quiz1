import { supabase } from './supabase';
import { answerKeys, createQuizFlow } from '../data/quizFlow';

const STORAGE_KEY = 'geleias-quiz-attempt-v1';
let memoryAttempt;
function readAttempt() {
  if (memoryAttempt) return memoryAttempt;
  try { memoryAttempt = JSON.parse(sessionStorage.getItem(STORAGE_KEY)); } catch { /* Storage may be unavailable. */ }
  if (!memoryAttempt?.id || !memoryAttempt?.token) {
    memoryAttempt = { id: crypto.randomUUID(), token: crypto.randomUUID(), revision: 0, step: 0, answers: {} };
  }
  return memoryAttempt;
}
function saveLocally(attempt) {
  memoryAttempt = attempt;
  try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attempt)); } catch { /* Continue in memory. */ }
}

export function restoreQuizAttempt(store) {
  const attempt = readAttempt();
  if (!Number.isInteger(attempt.step) || attempt.step < 0 || attempt.step > 7) return;
  // Rebuild answers from canonical options; never inject stored arbitrary text into diagnosis HTML.
  const answers = {};
  const history = [];
  for (let step = 0; step < Math.min(attempt.step, 6); step++) {
    const key = answerKeys[step];
    const option = createQuizFlow(answers).screen(step).options.find((item) => item.id === attempt.answers?.[key]?.id);
    if (!option) return;
    history.push({ step, answers: { ...answers } });
    answers[key] = option;
  }
  if (attempt.step === 7) history.push({ step: 6, answers: { ...answers } });
  store.setState({ step: attempt.step, answers, history });
}

export function startQuizTracking(store) {
  if (!supabase) return () => {};
  let stopped = false;
  let pending;
  let running = false;
  let retry;
  let failures = 0;
  async function flush() {
    if (running || stopped || !pending) return;
    running = true;
    const attempt = pending;
    pending = null;
    try {
      const { error } = await supabase.rpc('save_quiz_progress', {
        p_id: attempt.id, p_token: attempt.token, p_answers: attempt.answers,
        p_step: attempt.step, p_revision: attempt.revision,
      }).abortSignal(AbortSignal.timeout(12000));
      if (error) throw error;
      failures = 0;
    } catch {
      pending ||= attempt;
      failures++;
      if (failures === 1) console.warn('Não foi possível sincronizar o quiz. Uma nova tentativa será feita automaticamente.');
    } finally {
      running = false;
      if (!stopped && pending) retry = window.setTimeout(flush, failures ? Math.min(30000, 1000 * 2 ** Math.min(failures, 5)) : 0);
    }
  }
  function capture(state, previous) {
    if (previous && state.step === previous.step && state.answers === previous.answers && state.attemptGeneration === previous.attemptGeneration) return;
    let attempt = readAttempt();
    if (previous && state.attemptGeneration !== previous.attemptGeneration) {
      attempt = { id: crypto.randomUUID(), token: crypto.randomUUID(), revision: 0 };
    }
    const updated = { ...attempt, revision: attempt.revision + 1, step: state.step, answers: state.answers };
    saveLocally(updated);
    pending = updated;
    window.clearTimeout(retry);
    void flush();
  }
  const unsubscribe = store.subscribe(capture);
  const online = () => { window.clearTimeout(retry); void flush(); };
  window.addEventListener('online', online);
  capture(store.getState());
  return () => { stopped = true; unsubscribe(); window.clearTimeout(retry); window.removeEventListener('online', online); };
}
