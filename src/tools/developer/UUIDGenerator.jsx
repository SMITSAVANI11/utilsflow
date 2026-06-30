// UUIDGenerator.jsx — Generate multiple UUID v4s
import { useState, useEffect, useCallback } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

function generateUUID() {
  // Use crypto.randomUUID() if available (modern browsers), else polyfill
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

function UUIDGenerator() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("uuid-generator"); }, [trackTool]);

  const [count,  setCount]  = useState(5);
  const [uuids,  setUuids]  = useState([]);
  const [copied, setCopied] = useState(null);

  const generate = useCallback(() => {
    setUuids(Array.from({ length: count }, generateUUID));
  }, [count]);

  useEffect(() => { generate(); }, [generate]);

  function copy(uuid, idx) {
    navigator.clipboard.writeText(uuid).catch(() => {});
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  }

  function copyAll() {
    navigator.clipboard.writeText(uuids.join("\n")).catch(() => {});
    setCopied("all");
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="tool-page fade-in">
      <SEOHead title="UUID Generator" description="Generate version 4 UUIDs (RFC 4122) instantly. Bulk generate up to 20 UUIDs. Free, browser-based." path="/tools/uuid-generator" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="UUID Generator" category="Developer" categoryPath="/?cat=developer" />
        <h1 className="tool-title">🆔 UUID Generator</h1>
        <p className="tool-description">Generate cryptographically random UUID v4 identifiers (RFC 4122).</p>

        <div className="tool-box">
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-end", marginBottom: "20px", flexWrap: "wrap" }}>
            <div style={{ flex: 1 }}>
              <label className="label" htmlFor="uuid-count">Count: <strong style={{ color: "var(--primary-light)" }}>{count}</strong></label>
              <input id="uuid-count" type="range" min={1} max={20} value={count} onChange={(e) => setCount(Number(e.target.value))} />
            </div>
            <button id="generate-uuid-btn" className="btn-primary" onClick={generate}>🔄 Regenerate</button>
            <button className="btn-secondary" onClick={copyAll}>{copied === "all" ? "✅ All Copied!" : "📋 Copy All"}</button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {uuids.map((uuid, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(0,0,0,0.2)", padding: "12px 14px", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <span style={{ flex: 1, fontFamily: "JetBrains Mono, monospace", fontSize: "13px", color: "var(--primary-light)", letterSpacing: "0.5px" }}>{uuid}</span>
                <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: "12px" }} onClick={() => copy(uuid, i)} aria-label={`Copy UUID ${i + 1}`}>
                  {copied === i ? "✅" : "📋"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UUIDGenerator;
