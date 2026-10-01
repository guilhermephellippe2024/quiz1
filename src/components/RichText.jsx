// The original copy uses only <strong> and <br>. Render those as React nodes,
// including partially typed emphasis, without injecting or truncating HTML.
export function plainText(html = "") {
  const source = typeof html === "string" ? html : "";
  return source.replace(/<br\s*\/?>(?:\s*)/gi, "\n").replace(/<\/?strong>/gi, "");
}

export default function RichText({ html = "", limit = Infinity }) {
  const source = typeof html === "string" ? html : "";
  let remaining = limit;
  let strong = false;
  return source.split(/(<\/?strong>|<br\s*\/?>)/gi).map((token, index) => {
    if (/^<strong>$/i.test(token)) { strong = true; return null; }
    if (/^<\/strong>$/i.test(token)) { strong = false; return null; }
    if (/^<br/i.test(token)) {
      if (remaining <= 0) return null;
      remaining -= 1;
      return <br key={index} />;
    }
    const text = token.slice(0, Math.max(0, remaining));
    remaining -= text.length;
    return strong ? <strong key={index}>{text}</strong> : <span key={index}>{text}</span>;
  });
}
