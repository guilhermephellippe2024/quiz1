import { useEffect, useRef, useState } from "react";

const LOADING_DURATION_MS = 5000;

export default function ResultLoading({ children }) {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const container = useRef(null);

  useEffect(() => {
    const startedAt = performance.now();
    const interval = window.setInterval(() => {
      setProgress(Math.min(100, (performance.now() - startedAt) / LOADING_DURATION_MS * 100));
    }, 50);
    const timer = window.setTimeout(() => {
      window.clearInterval(interval);
      setProgress(100);
      setReady(true);
    }, LOADING_DURATION_MS);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    container.current?.querySelector("h1")?.focus({ preventScroll: true });
  }, [ready]);

  return (
    <div ref={container}>
      {ready ? children : (
        <div className="result-loading" role="status" aria-live="polite">
          <h1 tabIndex={-1} className="focus-heading">Estou analisando sua resposta</h1>
          <div className="loading-track" role="progressbar" aria-label="Análise das respostas" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
            <div className="loading-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}
