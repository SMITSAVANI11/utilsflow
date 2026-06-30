// JSONFormatter.jsx — JSON format, validate, minify, and copy
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

function JSONFormatter() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("json-formatter"); }, [trackTool]);

  const [input,  setInput]  = useState("");
  const [output, setOutput] = useState("");
  const [error,  setError]  = useState("");
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  function format() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
      setError("");
    } catch (e) {
      setError(e.message);
      setOutput("");
    }
  }

  function minify() {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError(e.message);
      setOutput("");
    }
  }

  function copy() {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const lineCount = output ? output.split("\n").length : 0;
  const size = new Blob([output || input]).size;

  return (
    <div className="tool-page fade-in">
      <SEOHead title="JSON Formatter & Validator" description="Format, validate, and minify JSON online. Instant error highlighting and syntax validation. Free developer tool." path="/tools/json-formatter" />
      <div className="tool-page-inner" style={{ maxWidth: "1000px" }}>
        <Breadcrumb toolName="JSON Formatter" category="Developer" categoryPath="/?cat=developer" />
        <h1 className="tool-title">{ } JSON Formatter & Validator</h1>
        <p className="tool-description">Paste your JSON to format, validate, or minify it instantly.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {/* Input */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label className="label" htmlFor="json-input" style={{ marginBottom: 0 }}>Input JSON</label>
              <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }} onClick={() => { setInput(""); setOutput(""); setError(""); }}>Clear</button>
            </div>
            <textarea id="json-input" className="input-field" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={'{\n  "name": "UtilsFlow",\n  "tools": 141\n}'}
              style={{ minHeight: "360px", fontFamily: "JetBrains Mono, monospace", fontSize: "13px", resize: "vertical" }} />
          </div>

          {/* Output */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label className="label" style={{ marginBottom: 0 }}>Output</label>
              {output && (
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {lineCount} lines · {size} bytes
                </span>
              )}
            </div>
            <div className="code-block" style={{ minHeight: "360px", overflow: "auto", whiteSpace: "pre", position: "relative" }}>
              {error
                ? <span style={{ color: "var(--danger)" }}>❌ {error}</span>
                : output || <span style={{ opacity: 0.4 }}>Formatted JSON appears here…</span>
              }
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="tool-box" style={{ marginTop: "16px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label className="label" style={{ marginBottom: 0, whiteSpace: "nowrap" }}>Indent:</label>
            <select className="input-field" value={indent} onChange={(e) => setIndent(Number(e.target.value))} style={{ width: "80px" }}>
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={1}>Tab</option>
            </select>
          </div>
          <button id="format-json-btn" className="btn-primary" onClick={format}>✨ Format</button>
          <button id="minify-json-btn" className="btn-secondary" onClick={minify}>📦 Minify</button>
          {output && <button id="copy-json-btn" className="btn-secondary" onClick={copy}>{copied ? "✅ Copied!" : "📋 Copy"}</button>}
        </div>

        {!error && output && (
          <p style={{ marginTop: "12px", fontSize: "13px", color: "var(--success)" }}>✅ Valid JSON</p>
        )}
      </div>
    </div>
  );
}

export default JSONFormatter;
