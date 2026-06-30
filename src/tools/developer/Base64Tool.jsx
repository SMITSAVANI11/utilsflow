// Base64Tool.jsx — Encode and decode Base64
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

function Base64Tool() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("base64-tool"); }, [trackTool]);

  const [input,   setInput]   = useState("");
  const [output,  setOutput]  = useState("");
  const [mode,    setMode]    = useState("encode");
  const [error,   setError]   = useState("");
  const [copied,  setCopied]  = useState(false);

  function process() {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError(mode === "decode" ? "Invalid Base64 string." : "Encoding failed.");
      setOutput("");
    }
  }

  function copy() {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function swap() {
    setInput(output);
    setOutput("");
    setMode((m) => (m === "encode" ? "decode" : "encode"));
  }

  return (
    <div className="tool-page fade-in">
      <SEOHead title="Base64 Encoder / Decoder" description="Encode or decode Base64 strings online. Supports UTF-8 text. Free, instant, browser-based." path="/tools/base64-tool" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="Base64 Encoder/Decoder" category="Developer" categoryPath="/?cat=developer" />
        <h1 className="tool-title">🔢 Base64 Encoder / Decoder</h1>
        <p className="tool-description">Convert text to Base64 or decode Base64 back to plain text. Supports Unicode / UTF-8.</p>

        <div className="tool-box">
          {/* Mode toggle */}
          <div className="flex gap-2 mb-5">
            {["encode", "decode"].map((m) => (
              <button key={m} className={`${mode === m ? "btn-primary" : "btn-secondary"} flex-1 capitalize`} onClick={() => { setMode(m); setOutput(""); setError(""); }}>
                {m === "encode" ? "🔒 Encode" : "🔓 Decode"}
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="label" htmlFor="b64-input">{mode === "encode" ? "Plain Text Input" : "Base64 Input"}</label>
            <textarea id="b64-input" className="input-field min-h-[120px] font-mono text-[13px] resize-y" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={mode === "encode" ? "Enter text to encode…" : "Enter Base64 to decode…"} />
          </div>

          {error && <p role="alert" className="text-danger mb-3 text-sm">⚠️ {error}</p>}

          <button id="b64-process-btn" className="btn-primary w-full mb-3" onClick={process}>
            {mode === "encode" ? "🔒 Encode to Base64" : "🔓 Decode from Base64"}
          </button>

          {output && (
            <>
              <label className="label">{mode === "encode" ? "Base64 Output" : "Decoded Text"}</label>
              <div className="code-block mb-3 break-all">{output}</div>
              <div className="flex gap-2">
                <button id="copy-b64-btn" className="btn-secondary" onClick={copy}>{copied ? "✅ Copied!" : "📋 Copy"}</button>
                <button className="btn-secondary" onClick={swap}>🔄 Swap & Reverse</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Base64Tool;
