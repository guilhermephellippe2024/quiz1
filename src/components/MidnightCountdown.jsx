import { useEffect, useState } from "react";
import { formatCountdown, secondsUntilMidnight } from "../utils/midnightCountdown.js";

export default function MidnightCountdown() {
  const [remaining, setRemaining] = useState(() => secondsUntilMidnight());

  useEffect(() => {
    // Recalculate from the clock so background tabs and reloads cannot reset the timer.
    const update = () => setRemaining(secondsUntilMidnight());
    const interval = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", update);
    window.addEventListener("focus", update);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", update);
      window.removeEventListener("focus", update);
    };
  }, []);

  return (
    <div className="midnight-countdown">
      <p>Oferta válida somente hoje</p>
      <span role="timer" aria-live="off" aria-label="Tempo restante até meia-noite" className="countdown-digits">{formatCountdown(remaining)}</span>
    </div>
  );
}
