// PasswordGenerator.jsx v2 — Uses crypto.getRandomValues() (secure)
import { useState, useCallback, useEffect } from "react";
import ToolLayout from "../../components/ToolLayout";

function PasswordGenerator() {
  const [length,     setLength]     = useState(16);
  const [useUpper,   setUseUpper]   = useState(true);
  const [useLower,   setUseLower]   = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password,   setPassword]   = useState("");
  const [copied,     setCopied]     = useState(false);
  const [history,    setHistory]    = useState([]);

  // ✅ SECURITY FIX: uses Web Crypto API — cryptographically secure
  const generate = useCallback(() => {
    const upper   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower   = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = "";
    if (useUpper)   chars += upper;
    if (useLower)   chars += lower;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;
    if (!chars) return;

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    const pwd = Array.from(array, (n) => chars[n % chars.length]).join("");
    setPassword(pwd);
    setCopied(false);
    setHistory((prev) => [pwd, ...prev].slice(0, 5));
  }, [length, useUpper, useLower, useNumbers, useSymbols]);

  // Generate on initial mount
  useEffect(() => {
    generate();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function copyPassword() {
    navigator.clipboard.writeText(password).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Entropy calculation
  function getEntropy() {
    let poolSize = 0;
    if (useUpper)   poolSize += 26;
    if (useLower)   poolSize += 26;
    if (useNumbers) poolSize += 10;
    if (useSymbols) poolSize += 32;
    if (!poolSize) return 0;
    return Math.floor(length * Math.log2(poolSize));
  }

  function getStrength() {
    const entropy = getEntropy();
    if (entropy < 40) return { label: "Weak",   color: "var(--danger)", width: "25%" };
    if (entropy < 60) return { label: "Fair",   color: "var(--warning)", width: "50%" };
    if (entropy < 80) return { label: "Strong", color: "var(--success)", width: "75%" };
    return               { label: "Very Strong", color: "var(--info)", width: "100%" };
  }

  const strength = getStrength();
  const entropy  = getEntropy();

  return (
    <ToolLayout
      toolId="password-generator"
      title="Password Generator"
      description="Generate strong, cryptographically secure passwords. Custom length, character sets, and entropy score. 100% free, runs in your browser."
      path="/tools/password-generator"
      category="Text & Writing"
      categoryPath="/?cat=text"
    >
      <h1 className="tool-title">🔐 Password Generator</h1>
      <p className="tool-description">
        Cryptographically secure passwords using the Web Crypto API. Never reuse passwords!
      </p>

      <div className="tool-box">
        {/* Password output */}
        <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <code style={{ fontSize: "clamp(13px, 2vw, 17px)", fontFamily: "JetBrains Mono, monospace", color: "var(--primary-light)", wordBreak: "break-all", flex: 1 }}>
            {password || "Click Generate to create a password…"}
          </code>
          {password && (
            <button id="copy-password-btn" className="btn-secondary" style={{ padding: "8px 14px", fontSize: "13px" }} onClick={copyPassword} aria-label={copied ? "Copied!" : "Copy password"}>
              {copied ? "✅ Copied!" : "📋 Copy"}
            </button>
          )}
        </div>

        {/* Strength + Entropy */}
        {password && (
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px" }}>
              <span style={{ color: "var(--text-secondary)" }}>Strength: <strong style={{ color: strength.color }}>{strength.label}</strong></span>
              <span style={{ color: "var(--text-secondary)" }}>Entropy: <strong style={{ color: "var(--primary-light)" }}>{entropy} bits</strong></span>
            </div>
            <div style={{ height: "6px", background: "rgba(255,255,255,0.1)", borderRadius: "3px" }}>
              <div style={{ height: "100%", borderRadius: "3px", background: strength.color, width: strength.width, transition: "width 0.4s ease, background 0.4s ease" }} />
            </div>
          </div>
        )}

        {/* Length */}
        <div style={{ marginBottom: "20px" }}>
          <label className="label" htmlFor="password-length">
            Length: <strong style={{ color: "var(--primary-light)" }}>{length}</strong>
          </label>
          <input id="password-length" type="range" min={6} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} aria-valuenow={length} aria-valuemin={6} aria-valuemax={64} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-muted)" }}>
            <span>6</span><span>64</span>
          </div>
        </div>

        {/* Options */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
          {[
            { label: "Uppercase (A-Z)", state: useUpper,   setter: setUseUpper,   id: "use-upper" },
            { label: "Lowercase (a-z)", state: useLower,   setter: setUseLower,   id: "use-lower" },
            { label: "Numbers (0-9)",   state: useNumbers, setter: setUseNumbers, id: "use-numbers" },
            { label: "Symbols (!@#$)",  state: useSymbols, setter: setUseSymbols, id: "use-symbols" },
          ].map((opt) => (
            <label key={opt.id} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "14px" }}>
              <input id={opt.id} type="checkbox" checked={opt.state} onChange={(e) => opt.setter(e.target.checked)} style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }} />
              {opt.label}
            </label>
          ))}
        </div>

        <button id="generate-password-btn" className="btn-primary" onClick={generate} style={{ width: "100%" }}>
          🔄 Generate Password
        </button>
      </div>

      {/* History */}
      {history.length > 1 && (
        <div className="tool-box" style={{ marginTop: "20px" }}>
          <p className="label">Recent Passwords</p>
          {history.slice(1).map((pwd, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < history.length - 2 ? "1px solid var(--border)" : "none" }}>
              <code style={{ fontSize: "13px", color: "var(--text-secondary)", fontFamily: "JetBrains Mono, monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: "12px" }}>{pwd}</code>
              <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }} onClick={() => { navigator.clipboard.writeText(pwd).catch(() => {}); }}>
                📋
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="result-box" style={{ marginTop: "20px" }}>
        <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          🔒 <strong>Security note:</strong> All passwords are generated in your browser using <code style={{ fontFamily: "JetBrains Mono, monospace" }}>crypto.getRandomValues()</code> — cryptographically secure. Nothing is sent to any server.
        </p>
      </div>
    </ToolLayout>
  );
}

export default PasswordGenerator;
