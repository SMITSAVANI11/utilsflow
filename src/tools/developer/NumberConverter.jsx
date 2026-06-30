// NumberConverter.jsx — Bin/Oct/Dec/Hex converter
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

const BASES = [
  { id: "dec", label: "Decimal",     base: 10, prefix: "",   placeholder: "255" },
  { id: "bin", label: "Binary",      base: 2,  prefix: "0b", placeholder: "11111111" },
  { id: "oct", label: "Octal",       base: 8,  prefix: "0o", placeholder: "377" },
  { id: "hex", label: "Hexadecimal", base: 16, prefix: "0x", placeholder: "FF" },
];

function NumberConverter() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("number-converter"); }, [trackTool]);

  const [values, setValues] = useState({ dec: "", bin: "", oct: "", hex: "" });
  const [error,  setError]  = useState("");
  const [copied, setCopied] = useState(null);

  function handleChange(id, base, raw) {
    setError("");
    const val = raw.trim().replace(/^0[xXbBoO]/, "");
    if (!val) { setValues({ dec: "", bin: "", oct: "", hex: "" }); return; }
    const n = parseInt(val, base);
    if (isNaN(n) || n < 0) { setError(`Invalid ${BASES.find(b => b.id === id).label} number.`); return; }
    setValues({
      dec: String(n),
      bin: n.toString(2),
      oct: n.toString(8),
      hex: n.toString(16).toUpperCase(),
    });
  }

  function copy(id) {
    navigator.clipboard.writeText(values[id]).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="tool-page fade-in">
      <SEOHead title="Number System Converter" description="Convert numbers between decimal, binary, octal, and hexadecimal instantly. Free developer tool." path="/tools/number-converter" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="Number Converter" category="Developer" categoryPath="/?cat=developer" />
        <h1 className="tool-title">🔢 Number System Converter</h1>
        <p className="tool-description">Convert between Decimal, Binary, Octal, and Hexadecimal. Type in any field to convert.</p>

        <div className="tool-box">
          {error && <p role="alert" style={{ color: "var(--danger)", marginBottom: "16px", fontSize: "14px" }}>⚠️ {error}</p>}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {BASES.map(({ id, label, base, prefix }) => (
              <div key={id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label className="label" htmlFor={`num-${id}`} style={{ marginBottom: 0 }}>{label}</label>
                  {values[id] && (
                    <button className="btn-secondary" style={{ padding: "3px 10px", fontSize: "12px" }} onClick={() => copy(id)}>
                      {copied === id ? "✅" : "📋"}
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,0,0,0.2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px 14px" }}>
                  {prefix && <span style={{ fontFamily: "JetBrains Mono, monospace", color: "var(--text-muted)", flexShrink: 0 }}>{prefix}</span>}
                  <input id={`num-${id}`} type="text" value={values[id]}
                    onChange={(e) => handleChange(id, base, e.target.value)}
                    placeholder={BASES.find(b => b.id === id).placeholder}
                    style={{ flex: 1, background: "none", border: "none", outline: "none", color: "var(--primary-light)", fontFamily: "JetBrains Mono, monospace", fontSize: "15px", letterSpacing: "0.5px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NumberConverter;
