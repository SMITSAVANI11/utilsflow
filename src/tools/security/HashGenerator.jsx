// HashGenerator.jsx — SHA-256/SHA-1/SHA-512 via Web Crypto API
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

async function hashString(text, algorithm) {
  const msgBuffer = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function HashGenerator() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("hash-generator"); }, [trackTool]);

  const [input,    setInput]    = useState("");
  const [hashes,   setHashes]   = useState({});
  const [loading,  setLoading]  = useState(false);
  const [copied,   setCopied]   = useState(null);

  const ALGOS = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];

  async function generateHashes() {
    if (!input.trim()) { setHashes({}); return; }
    setLoading(true);
    const results = {};
    for (const algo of ALGOS) {
      results[algo] = await hashString(input, algo);
    }
    setHashes(results);
    setLoading(false);
  }

  function copy(algo) {
    navigator.clipboard.writeText(hashes[algo]).catch(() => {});
    setCopied(algo);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="tool-page fade-in">
      <SEOHead title="Hash Generator — SHA-256, SHA-512" description="Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from any text. Uses the Web Crypto API. Free, secure, browser-based." path="/tools/hash-generator" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="Hash Generator" category="Developer" categoryPath="/?cat=developer" />
        <h1 className="tool-title">#️⃣ Hash Generator</h1>
        <p className="tool-description">Generate cryptographic hashes (SHA-1, SHA-256, SHA-384, SHA-512) using the built-in Web Crypto API. Runs entirely in your browser.</p>

        <div className="tool-box">
          <label className="label" htmlFor="hash-input">Input Text</label>
          <textarea id="hash-input" className="input-field" value={input} onChange={(e) => setInput(e.target.value)}
            placeholder="Enter any text to hash…"
            style={{ minHeight: "100px", fontFamily: "JetBrains Mono, monospace", fontSize: "14px", resize: "vertical", marginBottom: "16px" }} />

          <button id="generate-hash-btn" className="btn-primary" onClick={generateHashes} disabled={loading} style={{ width: "100%" }}>
            {loading ? "Computing…" : "#️⃣ Generate Hashes"}
          </button>
        </div>

        {Object.keys(hashes).length > 0 && (
          <div className="tool-box" style={{ marginTop: "20px" }}>
            {ALGOS.filter((a) => hashes[a]).map((algo) => (
              <div key={algo} style={{ marginBottom: "18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label className="label" style={{ marginBottom: 0 }}>{algo}</label>
                  <button className="btn-secondary" style={{ padding: "3px 10px", fontSize: "12px" }} onClick={() => copy(algo)}>
                    {copied === algo ? "✅" : "📋"}
                  </button>
                </div>
                <div className="code-block" style={{ wordBreak: "break-all", fontSize: "12px" }}>{hashes[algo]}</div>
              </div>
            ))}
          </div>
        )}

        <div className="result-box" style={{ marginTop: "20px" }}>
          <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
            🔒 Hashing runs locally via <code style={{ fontFamily: "JetBrains Mono, monospace" }}>crypto.subtle.digest()</code>. Your input never leaves your browser.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HashGenerator;
