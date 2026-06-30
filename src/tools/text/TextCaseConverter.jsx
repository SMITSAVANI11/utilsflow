// TextCaseConverter.jsx
import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

const CONVERSIONS = [
  { id: "upper",   label: "UPPER CASE",   fn: (t) => t.toUpperCase() },
  { id: "lower",   label: "lower case",   fn: (t) => t.toLowerCase() },
  { id: "title",   label: "Title Case",   fn: (t) => t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()) },
  { id: "sentence",label: "Sentence case",fn: (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() },
  { id: "camel",   label: "camelCase",    fn: (t) => t.replace(/(?:^\w|[A-Z]|\b\w)/g, (w, i) => i === 0 ? w.toLowerCase() : w.toUpperCase()).replace(/\s+/g, "") },
  { id: "pascal",  label: "PascalCase",   fn: (t) => t.replace(/(?:^\w|[A-Z]|\b\w)/g, (w) => w.toUpperCase()).replace(/\s+/g, "") },
  { id: "snake",   label: "snake_case",   fn: (t) => t.toLowerCase().replace(/\s+/g, "_") },
  { id: "kebab",   label: "kebab-case",   fn: (t) => t.toLowerCase().replace(/\s+/g, "-") },
  { id: "alternate",label:"aLtErNaTe",   fn: (t) => t.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join("") },
];

function TextCaseConverter() {
  const [input,  setInput]  = useState("");
  const [copied, setCopied] = useState(null);

  function copy(id, text) {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  const wordCount = input.trim() ? input.trim().split(/\s+/).length : 0;
  const charCount = input.length;

  return (
    <ToolLayout
      toolId="text-case-converter"
      title="Text Case Converter"
      description="Convert text to uppercase, lowercase, title case, camelCase, snake_case, kebab-case and more. Free instant tool."
      path="/tools/text-case-converter"
      category="Text & Writing"
      categoryPath="/?cat=text"
    >
      <h1 className="tool-title">🔠 Text Case Converter</h1>
      <p className="tool-description">Convert your text to any case format instantly. Great for coding, writing, and formatting.</p>

      <div className="tool-box">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <label className="label" htmlFor="case-input" style={{ marginBottom: 0 }}>Input Text</label>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{wordCount} words · {charCount} chars</span>
        </div>
        <textarea id="case-input" className="input-field" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Type or paste your text here…"
          style={{ minHeight: "120px", resize: "vertical", marginBottom: "20px" }} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
          {CONVERSIONS.map(({ id, label, fn }) => {
            const result = input ? fn(input) : "";
            return (
              <div key={id} style={{ background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
                  <button className="btn-secondary" style={{ padding: "2px 8px", fontSize: "11px" }} onClick={() => copy(id, result)} disabled={!result}>
                    {copied === id ? "✅" : "📋"}
                  </button>
                </div>
                <p style={{ fontFamily: id === "camel" || id === "pascal" || id === "snake" || id === "kebab" ? "JetBrains Mono, monospace" : "inherit", fontSize: "13px", wordBreak: "break-all", color: result ? "var(--text-primary)" : "var(--text-muted)", minHeight: "20px" }}>
                  {result || "—"}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </ToolLayout>
  );
}

export default TextCaseConverter;
