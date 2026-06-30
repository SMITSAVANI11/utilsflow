// ============================================================
// GradientGenerator.jsx — CSS Gradient Generator Tool
// ============================================================
// Pick two colors and direction → get live preview + CSS code
// ============================================================

import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

function GradientGenerator() {
  const [color1, setColor1] = useState("#7c3aed");
  const [color2, setColor2] = useState("#2563eb");
  const [direction, setDirection] = useState("135deg");
  const [copied, setCopied] = useState(false);

  // Build the CSS gradient string
  const gradient = `linear-gradient(${direction}, ${color1}, ${color2})`;
  const cssCode = `background: ${gradient};`;

  function copyCSS() {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <ToolLayout
      toolId="gradient-generator"
      title="Gradient Generator"
      description="Create stunning CSS gradients with a live preview and copy CSS code."
      path="/tools/gradient-generator"
      category="Creative"
      categoryPath="/?cat=creative"
    >
      <h1 className="tool-title">🌈 Gradient Generator</h1>
      <p className="tool-description">
        Pick two colors and a direction. Copy the CSS code and use it anywhere!
      </p>

      {/* Live Preview Box */}
      <div style={{
        width: "100%",
        height: "180px",
        background: gradient,
        borderRadius: "16px",
        marginBottom: "24px",
        boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
        transition: "background 0.3s ease",
      }} />

      <div className="tool-box">

        {/* Color pickers row */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <label className="label">Color 1</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                type="color"
                id="gradient-color1"
                value={color1}
                onChange={e => setColor1(e.target.value)}
                style={{ width: "50px", height: "42px", border: "none", borderRadius: "8px", cursor: "pointer", background: "none" }}
              />
              <input
                type="text"
                className="input-field"
                value={color1}
                onChange={e => setColor1(e.target.value)}
              />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label className="label">Color 2</label>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <input
                type="color"
                id="gradient-color2"
                value={color2}
                onChange={e => setColor2(e.target.value)}
                style={{ width: "50px", height: "42px", border: "none", borderRadius: "8px", cursor: "pointer", background: "none" }}
              />
              <input
                type="text"
                className="input-field"
                value={color2}
                onChange={e => setColor2(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Direction selector */}
        <div style={{ marginBottom: "20px" }}>
          <label className="label">Direction</label>
          <select
            id="gradient-direction"
            className="input-field"
            value={direction}
            onChange={e => setDirection(e.target.value)}
          >
            <option value="to right">→ Left to Right</option>
            <option value="to left">← Right to Left</option>
            <option value="to bottom">↓ Top to Bottom</option>
            <option value="to top">↑ Bottom to Top</option>
            <option value="135deg">↘ Diagonal (135°)</option>
            <option value="45deg">↗ Diagonal (45°)</option>
          </select>
        </div>

        {/* CSS Code output */}
        <label className="label">CSS Code</label>
        <div style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "8px",
          padding: "16px",
          fontFamily: "monospace",
          fontSize: "14px",
          color: "#a78bfa",
          marginBottom: "16px",
        }}>
          {cssCode}
        </div>

        <button
          id="copy-gradient-btn"
          className="btn-primary"
          onClick={copyCSS}
        >
          {copied ? "✅ Copied!" : "📋 Copy CSS"}
        </button>
      </div>
    </ToolLayout>
  );
}

export default GradientGenerator;
