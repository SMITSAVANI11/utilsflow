// URLEncoderDecoder.jsx
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

function URLEncoderDecoder() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("url-encoder"); }, [trackTool]);

  const [input,  setInput]  = useState("");
  const [output, setOutput] = useState("");
  const [mode,   setMode]   = useState("encode");
  const [error,  setError]  = useState("");
  const [copied, setCopied] = useState(false);

  function process() {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError("Invalid URL-encoded string.");
      setOutput("");
    }
  }

  function copy() {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="tool-page fade-in">
      <SEOHead title="URL Encoder / Decoder" description="Encode or decode URL components online. Convert special characters to percent-encoding. Free, instant." path="/tools/url-encoder" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="URL Encoder/Decoder" category="Developer" categoryPath="/?cat=developer" />
        <h1 className="tool-title">🔗 URL Encoder / Decoder</h1>
        <p className="tool-description">Encode URLs (percent-encoding) or decode them back to readable text.</p>

        <div className="tool-box">
          <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
            {["encode", "decode"].map((m) => (
              <button key={m} className={mode === m ? "btn-primary" : "btn-secondary"} onClick={() => { setMode(m); setOutput(""); setError(""); }} style={{ flex: 1, textTransform: "capitalize" }}>
                {m === "encode" ? "🔒 Encode" : "🔓 Decode"}
              </button>
            ))}
          </div>

          <label className="label" htmlFor="url-input">Input</label>
          <textarea id="url-input" className="input-field" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "https://example.com/search?q=hello world&lang=en" : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"}
            style={{ minHeight: "100px", fontFamily: "JetBrains Mono, monospace", fontSize: "13px", resize: "vertical", marginBottom: "16px" }} />

          {error && <p role="alert" style={{ color: "var(--danger)", marginBottom: "12px", fontSize: "14px" }}>⚠️ {error}</p>}

          <button id="url-process-btn" className="btn-primary" onClick={process} style={{ width: "100%", marginBottom: "16px" }}>
            {mode === "encode" ? "🔒 Encode URL" : "🔓 Decode URL"}
          </button>

          {output && (
            <>
              <label className="label">Output</label>
              <div className="code-block" style={{ marginBottom: "12px", wordBreak: "break-all" }}>{output}</div>
              <button id="copy-url-btn" className="btn-secondary" onClick={copy}>{copied ? "✅ Copied!" : "📋 Copy"}</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default URLEncoderDecoder;
