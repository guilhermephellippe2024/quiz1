export default function OptionButton({ children, onClick, index }) {
  return (
    <button type="button" onClick={onClick} className="answer-option answer-enter" style={{ "--entry-delay": `${index * 140}ms` }}>
      <span className="answer-dot" aria-hidden="true" />
      <span className="flex-1">{children}</span>
      <span className="answer-arrow" aria-hidden="true">→</span>
    </button>
  );
}
