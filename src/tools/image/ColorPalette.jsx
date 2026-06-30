// ============================================================
// ColorPalette.jsx — Color Palette Generator Tool
// ============================================================
// Generates 5 random beautiful colors.
// Click any color to copy its HEX code.
// ============================================================

import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

// Generate a random hex color like #A3F2C1
function randomColor() {
  return "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
}

// Generate a set of 5 random colors
function generatePalette() {
  return Array.from({ length: 5 }, randomColor);
}

// Check if a color is dark (so we can show white or black text on it)
function isDark(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

function ColorPalette() {
  // State: current palette colors
  const [palette, setPalette] = useState(generatePalette());

  // State: which color was just copied (for showing feedback)
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Copy hex to clipboard
  function copyColor(color, index) {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500); // reset after 1.5s
  }

  return (
    <ToolLayout
      toolId="color-palette"
      title="Color Palette Generator"
      description="Generate beautiful color palettes instantly. Click to copy hex codes."
      path="/tools/color-palette"
      category="Creative"
      categoryPath="/?cat=creative"
    >
      {/* Title */}
      <h1 className="tool-title">🎨 Color Palette Generator</h1>
      <p className="tool-description">
        Click "Generate" for new colors. Click any color swatch to copy its HEX code.
      </p>

      {/* Generate button */}
      <button
        id="generate-palette-btn"
        className="btn-primary"
        onClick={() => setPalette(generatePalette())}
        style={{ marginBottom: "24px" }}
      >
        🎲 Generate New Palette
      </button>

      {/* Color swatches */}
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {palette.map((color, index) => (
          <div
            key={index}
            onClick={() => copyColor(color, index)}
            style={{
              flex: "1",
              minWidth: "100px",
              height: "160px",
              backgroundColor: color,
              borderRadius: "16px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: "12px",
              transition: "transform 0.2s ease",
              position: "relative",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            {/* HEX label */}
            <span style={{
              background: "rgba(0,0,0,0.4)",
              color: "white",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "1px",
            }}>
              {copiedIndex === index ? "✅ Copied!" : color.toUpperCase()}
            </span>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="result-box" style={{ marginTop: "30px" }}>
        <p style={{ color: "#94a3b8", fontSize: "14px" }}>
          💡 <strong>Tip:</strong> Click any color swatch to copy its HEX code to your clipboard.
          Use these colors in Figma, CSS, or any design tool!
        </p>
      </div>
    </ToolLayout>
  );
}

export default ColorPalette;
