// JWTDecoder.jsx — Decode JWT tokens (header + payload)
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

function decodeBase64URL(str) {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded  = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, "=");
  return JSON.parse(decodeURIComponent(escape(atob(padded))));
}

function JWTDecoder() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("jwt-decoder"); }, [trackTool]);

  const [token,   setToken]   = useState("");
  const [decoded, setDecoded] = useState(null);
  const [error,   setError]   = useState("");

  function decode() {
    setError("");
    const parts = token.trim().split(".");
    if (parts.length !== 3) { setError("Invalid JWT: must have 3 parts (header.payload.signature)"); setDecoded(null); return; }
    try {
      const header  = decodeBase64URL(parts[0]);
      const payload = decodeBase64URL(parts[1]);
      setDecoded({ header, payload, signature: parts[2] });
    } catch {
      setError("Failed to decode JWT. Make sure it's a valid token.");
      setDecoded(null);
    }
  }

  const isExpired = decoded?.payload?.exp && decoded.payload.exp < Date.now() / 1000;

  return (
    <div className="tool-page fade-in">
      <SEOHead title="JWT Decoder" description="Decode JSON Web Tokens (JWT) to inspect header, payload, and claims. Free, client-side, instant." path="/tools/jwt-decoder" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="JWT Decoder" category="Developer" categoryPath="/?cat=developer" />
        <h1 className="tool-title">🔑 JWT Decoder</h1>
        <p className="tool-description">Paste any JWT token to decode and inspect its header and payload. Runs entirely in your browser — tokens are never sent anywhere.</p>

        <div className="tool-box">
          <label className="label" htmlFor="jwt-input">JWT Token</label>
          <textarea id="jwt-input" className="input-field" value={token} onChange={(e) => setToken(e.target.value)}
            placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
            style={{ minHeight: "100px", fontFamily: "JetBrains Mono, monospace", fontSize: "12px", resize: "vertical", marginBottom: "16px" }} />

          {error && <p role="alert" style={{ color: "var(--danger)", marginBottom: "12px", fontSize: "14px" }}>⚠️ {error}</p>}

          <button id="decode-jwt-btn" className="btn-primary" onClick={decode} style={{ width: "100%" }}>
            🔑 Decode JWT
          </button>
        </div>

        {decoded && (
          <>
            {isExpired && (
              <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", marginTop: "16px", fontSize: "14px", color: "var(--danger)" }}>
                ⚠️ This token is <strong>expired</strong> (exp: {new Date(decoded.payload.exp * 1000).toLocaleString()})
              </div>
            )}

            {[{ label: "Header", data: decoded.header }, { label: "Payload", data: decoded.payload }].map(({ label, data }) => (
              <div key={label} className="tool-box" style={{ marginTop: "16px" }}>
                <p className="label">{label}</p>
                <div className="code-block">{JSON.stringify(data, null, 2)}</div>
                {label === "Payload" && data.exp && (
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px" }}>
                    Expires: {new Date(data.exp * 1000).toLocaleString()}
                    {data.iat && ` · Issued: ${new Date(data.iat * 1000).toLocaleString()}`}
                  </p>
                )}
              </div>
            ))}

            <div className="tool-box" style={{ marginTop: "16px" }}>
              <p className="label">Signature</p>
              <div className="code-block" style={{ wordBreak: "break-all", fontSize: "12px", color: "var(--warning)" }}>{decoded.signature}</div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "8px" }}>⚠️ Signature verification requires the secret key and is not done client-side.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default JWTDecoder;
