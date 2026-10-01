import { useEffect, useState } from "react";
import RichText, { plainText } from "./RichText";

export default function TypingDiagnosis({ html, title, headingRef, typingLabel = "Digitando seu resultado…", completeLabel = "Seu resultado" }) {
  const total = plainText(html).length;
  const [count, setCount] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches ? total : 0);
  const done = count >= total;

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finishIfReduced = () => { if (preference.matches) setCount(total); };
    preference.addEventListener("change", finishIfReduced);
    if (preference.matches || done) return () => preference.removeEventListener("change", finishIfReduced);
    const timer = window.setInterval(() => setCount((current) => Math.min(total, current + 3)), 24);
    return () => { window.clearInterval(timer); preference.removeEventListener("change", finishIfReduced); };
  }, [total, done]);

  return (
    <div className="diagnosis">
      <div className="typing-toolbar">
        <span className="typing-status" aria-hidden="true"><span className={`status-dot ${done ? "" : "is-typing"}`} />{done ? completeLabel : typingLabel}</span>
        {!done && <button type="button" className="skip-button" onClick={() => setCount(total)}>Mostrar tudo</button>}
      </div>
      <div className="copy-box">
        {title && <h1 ref={headingRef} tabIndex={-1} className="focus-heading diagnosis-title">{title}</h1>}
        <div className="sr-only"><RichText html={html} /></div>
        <div className="typing-content" aria-hidden="true">
          <div className="typing-measure"><RichText html={html} /></div>
          <div className="typing-overlay"><RichText html={html} limit={count} />{!done && <span className="typing-caret" />}</div>
        </div>
      </div>
    </div>
  );
}
