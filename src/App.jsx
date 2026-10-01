import { Fragment, useEffect, useRef } from "react";
import QuizCard from "./components/QuizCard";
import OptionButton from "./components/OptionButton";
import TypingDiagnosis from "./components/TypingDiagnosis";
import ResultLoading from "./components/ResultLoading";
import MiniVsl from "./components/MiniVsl";
import { useQuizStore } from "./store/quizStore";
import { answerKeys, createQuizFlow } from "./data/quizFlow";

// Larger initial advances, followed by smaller increments near the end.
const progressByStep = [0, 25, 45, 60, 72, 82, 90, 95, 100];

export default function App() {
  const { step, answers, history, select, next, back } = useQuizStore();
  const screen = createQuizFlow(answers).screen(step);
  const ResultWrapper = step === 6 ? ResultLoading : Fragment;
  const heading = useRef(null);
  const previousStep = useRef(step);

  useEffect(() => {
    if (previousStep.current !== step) {
      heading.current?.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: "instant" });
      previousStep.current = step;
    }
  }, [step]);

  return (
    <main className="page mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <QuizCard>
        <div className="card-top">
          <div role="progressbar" aria-label="Progresso do quiz" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressByStep[step]} className="progress-track"><div className="progress-fill" style={{ width: `${progressByStep[step]}%` }} /></div>
        </div>
        <ResultWrapper>
          <div className="card-content step-enter" key={step}>
            <h1 ref={heading} tabIndex={-1} className={`focus-heading ${step === 8 ? "sr-only" : ""}`}>{screen.title}</h1>
            {step < 6 && <>
              <p className="sub">{screen.sub}</p>
              {screen.question && <h2 id="question" className="initial-question">{screen.question}</h2>}
              <div className="options" role="group" aria-label={screen.question || screen.title}>
                {screen.options.map((option, index) => <OptionButton key={option.id} index={index} onClick={() => select(answerKeys[step], option)}>{option.text}</OptionButton>)}
              </div>
            </>}
            {step === 6 && <><TypingDiagnosis html={screen.body} /><p className="sub">{screen.sub}</p></>}
            {step === 7 && <TypingDiagnosis html={screen.box} typingLabel="Digitando…" completeLabel="Um passo possível para você" />}
            {step === 8 && <MiniVsl />}
            {history.length > 0 && step !== 8 && <nav className="actions" aria-label="Navegação do quiz">
              <button type="button" onClick={back} className="back-button"><span aria-hidden="true">← </span>Voltar</button>
              {screen.button && <button type="button" onClick={next} className="primary-button">{screen.button}<span aria-hidden="true"> →</span></button>}
            </nav>}
          </div>
        </ResultWrapper>
      </QuizCard>
    </main>
  );
}
