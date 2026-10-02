import { Fragment, useEffect, useRef } from "react";
import QuizCard from "./components/QuizCard";
import OptionButton from "./components/OptionButton";
import TypingDiagnosis from "./components/TypingDiagnosis";
import ResultLoading from "./components/ResultLoading";
import MiniVsl from "./components/MiniVsl";
import { useQuizStore } from "./store/quizStore";
import { answerKeys, createQuizFlow } from "./data/quizFlow";

// Larger initial advances, followed by smaller increments near the end.
const progressByStep = [0, 25, 45, 60, 72, 82, 88, 93, 97, 100];

export default function App() {
  const { step, answers, select, next } = useQuizStore();
  const screen = createQuizFlow(answers).screen(step);
  const ResultWrapper = step === answerKeys.length ? ResultLoading : Fragment;
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
          <div
            role="progressbar"
            aria-label="Progresso do quiz"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressByStep[step]}
            className="progress-track"
          >
            <div
              className="progress-fill"
              style={{ width: `${progressByStep[step]}%` }}
            />
          </div>
        </div>
        <ResultWrapper>
          <div className="card-content step-enter" key={step}>
            {step !== answerKeys.length && <h1 ref={heading} tabIndex={-1} className={`focus-heading text-center ${step === answerKeys.length + 1 ? "sr-only" : ""} ${step === 0 ? "intro-headline" : ""}`}>{screen.title}</h1>}

            {step < answerKeys.length && <>
              {screen.sub && <p className="sub">{screen.sub}</p>}
              {screen.question && <h2 id="question" className="initial-question">{screen.question}</h2>}
              <div className="options" role="group" aria-label={screen.question || screen.title}>
                {screen.options.map((option, index) => <OptionButton key={option.id} index={index} onClick={() => select(answerKeys[step], option)}>{option.text}</OptionButton>)}
              </div>
            </>}
            {step === answerKeys.length && <><TypingDiagnosis title={screen.title} headingRef={heading} html={screen.body} />{screen.sub && <p className="sub">{screen.sub}</p>}</>}
            {step === answerKeys.length + 1 && <MiniVsl />}
            {screen.button && <nav className="actions" aria-label="Continuar">
              <button type="button" onClick={next} className="primary-button">{screen.button}<span aria-hidden="true"> →</span></button>
            </nav>}
          </div>
        </ResultWrapper>
      </QuizCard>
    </main>
  );
}
