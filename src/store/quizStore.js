import { create } from "zustand";
import { answerKeys, createQuizFlow } from "../data/quizFlow.js";

const initialState = () => ({ step: 0, answers: {}, history: [] });
const snapshot = ({ step, answers }) => ({ step, answers: { ...answers } });

export const useQuizStore = create((set) => ({
  ...initialState(),
  select: (key, value) => set((state) => {
    if (answerKeys[state.step] !== key) return state;
    const option = createQuizFlow(state.answers).screen(state.step).options.find((item) => item.id === value.id);
    if (!option) return state;
    // Later answers depend on this choice and must never leak from another branch.
    const answers = Object.fromEntries(answerKeys.slice(0, state.step).map((name) => [name, state.answers[name]]));
    return { answers: { ...answers, [key]: option }, step: state.step + 1, history: [...state.history, snapshot(state)] };
  }),
  next: () => set((state) => state.step === 6 ? {
    step: state.step + 1, history: [...state.history, snapshot(state)],
  } : state),
  back: () => set((state) => state.history.length ? {
    ...state.history[state.history.length - 1], history: state.history.slice(0, -1),
  } : state),
  reset: () => set(initialState()),
}));
