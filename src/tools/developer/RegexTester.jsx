// RegexTester.jsx — Live regex testing with match highlighting
import { useState, useEffect, useRef } from "react";
import ToolLayout from "../../components/ToolLayout";

const EXAMPLES = [
  { label: "Email", pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: "g" },
  { label: "URL",   pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)", flags: "gi" },
  { label: "Phone", pattern: "(\\+?\\d{1,3}[\\s-]?)?\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4}", flags: "g" },
  { label: "Date (YYYY-MM-DD)", pattern: "\\d{4}-(0[1-9]|1[012])-(0[1-9]|[12]\\d|3[01])", flags: "g" },
  { label: "Hex Color", pattern: "#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})", flags: "g" },
  { label: "IPv4", pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
];

const workerCode = `
  self.onmessage = function(e) {
    const { pattern, flags, testStr } = e.data;
    try {
      const rx = new RegExp(pattern, flags);
      const matches = [];
      let m;
      if (flags.includes("g")) {
        while ((m = rx.exec(testStr)) !== null) {
          matches.push({ match: m[0], index: m.index, groups: m.groups });
          if (m.index === rx.lastIndex) { rx.lastIndex++; }
        }
      } else {
        m = rx.exec(testStr);
        if (m) matches.push({ match: m[0], index: m.index, groups: m.groups });
      }
      self.postMessage({ success: true, matches });
    } catch (err) {
      self.postMessage({ success: false, error: err.message });
    }
  };
`;

function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags,   setFlags]   = useState("g");
  const [testStr, setTestStr] = useState("Test your regex here. Email: hello@example.com, URL: https://utilsflow.com");
  const [matches, setMatches] = useState([]);
  const [error,   setError]   = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const workerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setError("");
      setEvaluating(false);
      return;
    }

    setEvaluating(true);

    if (workerRef.current) {
      workerRef.current.terminate();
    }

    const blob = new Blob([workerCode], { type: "application/javascript" });
    const worker = new Worker(URL.createObjectURL(blob));
    workerRef.current = worker;

    const timeoutId = setTimeout(() => {
      worker.terminate();
      setError("Evaluation timed out. Your regular expression may be suffering from catastrophic backtracking.");
      setMatches([]);
      setEvaluating(false);
    }, 1500);

    worker.onmessage = (e) => {
      clearTimeout(timeoutId);
      setEvaluating(false);
      if (e.data.success) {
        setMatches(e.data.matches);
        setError("");
      } else {
        setError(e.data.error);
        setMatches([]);
      }
    };

    worker.postMessage({ pattern, flags, testStr });

    return () => {
      clearTimeout(timeoutId);
      worker.terminate();
    };
  }, [pattern, flags, testStr]);

  function loadExample(ex) {
    setPattern(ex.pattern);
    setFlags(ex.flags);
    setError("");
  }

  const flagOptions = ["g", "i", "m", "s", "u"];

  function toggleFlag(f) {
    setFlags((prev) => prev.includes(f) ? prev.replace(f, "") : prev + f);
  }

  return (
    <ToolLayout
      toolId="regex-tester"
      title="Regex Tester"
      description="Test JavaScript regular expressions online with live match highlighting. Supports all JS regex flags. Free developer tool."
      path="/tools/regex-tester"
      category="Developer"
      categoryPath="/?cat=developer"
    >
      <h1 className="tool-title">🔎 Regex Tester</h1>
      <p className="tool-description">Test JavaScript regular expressions with live match highlighting and group extraction.</p>

      {/* Examples */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
        {EXAMPLES.map((ex) => (
          <button key={ex.label} className="btn-secondary" style={{ fontSize: "12px", padding: "5px 10px" }} onClick={() => loadExample(ex)}>
            {ex.label}
          </button>
        ))}
      </div>

      <div className="tool-box">
        {/* Pattern */}
        <div style={{ marginBottom: "16px" }}>
          <label className="label" htmlFor="regex-pattern">Regular Expression</label>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,0,0,0.2)", border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`, borderRadius: "8px", padding: "10px 14px" }}>
            <span style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>/</span>
            <input id="regex-pattern" type="text" value={pattern} onChange={(e) => setPattern(e.target.value)}
              placeholder="[a-z]+" style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--primary-light)", fontFamily: "JetBrains Mono, monospace", fontSize: "15px" }} />
            <span style={{ color: "var(--text-muted)", fontFamily: "JetBrains Mono, monospace" }}>/{flags}</span>
          </div>
          {error && <p role="alert" style={{ color: "var(--danger)", fontSize: "13px", marginTop: "6px" }}>⚠️ {error}</p>}
        </div>

        {/* Flags */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
          <span className="label" style={{ marginBottom: 0, alignSelf: "center" }}>Flags:</span>
          {flagOptions.map((f) => (
            <button key={f} onClick={() => toggleFlag(f)}
              style={{ padding: "4px 12px", borderRadius: "6px", border: "1px solid var(--border)", background: flags.includes(f) ? "rgba(99, 102, 241, 0.2)" : "transparent", color: flags.includes(f) ? "var(--primary-light)" : "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace", fontSize: "13px", cursor: "pointer", transition: "all 0.2s" }}>
              {f}
            </button>
          ))}
        </div>

        {/* Test string */}
        <label className="label" htmlFor="regex-test">Test String</label>
        <textarea id="regex-test" className="input-field" value={testStr} onChange={(e) => setTestStr(e.target.value)}
          style={{ minHeight: "100px", fontFamily: "JetBrains Mono, monospace", fontSize: "13px", marginBottom: "16px", resize: "vertical" }} />
      </div>

      {/* Results */}
      {pattern && (
        <div className="tool-box" style={{ marginTop: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <p className="label" style={{ marginBottom: 0 }}>Matches</p>
            <span style={{ fontSize: "13px", color: matches.length > 0 ? "var(--success)" : "var(--text-secondary)" }}>
              {evaluating ? "⏳ Calculating..." : `${matches.length} match${matches.length !== 1 ? "es" : ""}`}
            </span>
          </div>
          {matches.length === 0 && !error && !evaluating && <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>No matches found.</p>}
          {matches.map((m, i) => (
            <div key={i} style={{ display: "flex", gap: "12px", padding: "8px 12px", background: "rgba(99, 102, 241, 0.08)", borderRadius: "6px", marginBottom: "6px", fontSize: "13px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontWeight: 600, color: "var(--primary-light)", fontFamily: "JetBrains Mono, monospace" }}>"{m.match}"</span>
              <span style={{ color: "var(--text-muted)" }}>at index {m.index}</span>
              {m.groups && Object.keys(m.groups).length > 0 && (
                <span style={{ color: "var(--text-secondary)" }}>groups: {JSON.stringify(m.groups)}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}

export default RegexTester;
