// ============================================================
// AspectRatio.jsx — Aspect Ratio Calculator Tool
// ============================================================
// Enter width and height to get the aspect ratio.
// Or enter a ratio and one dimension to get the other.
// ============================================================

import { useState } from "react";

// Greatest Common Divisor — used to simplify ratio like 1920:1080 → 16:9
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

// Common presets for quick use
const PRESETS = [
  { label: "16:9 — YouTube/HD", w: 1920, h: 1080 },
  { label: "4:3 — Standard SD", w: 1024, h: 768 },
  { label: "1:1 — Instagram Post", w: 1080, h: 1080 },
  { label: "9:16 — Instagram Story", w: 1080, h: 1920 },
  { label: "21:9 — Ultrawide", w: 2560, h: 1080 },
  { label: "4:5 — Instagram Portrait", w: 1080, h: 1350 },
];

function AspectRatio() {
  // Mode 1: from dimensions
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");

  // Mode 2: scale existing
  const [ratioW, setRatioW] = useState("");
  const [ratioH, setRatioH] = useState("");
  const [scaleWidth, setScaleWidth] = useState("");
  const [scaleHeight, setScaleHeight] = useState("");

  // Results
  const [ratio, setRatio] = useState(null);

  // Calculate aspect ratio from width & height
  function calcRatio() {
    const w = parseInt(width);
    const h = parseInt(height);
    if (!w || !h || w <= 0 || h <= 0) return;

    const g = gcd(w, h);
    setRatio({
      simplified: `${w / g}:${h / g}`,
      decimal: (w / h).toFixed(4),
      megapixels: ((w * h) / 1_000_000).toFixed(2),
      w,
      h,
    });
  }

  // Apply a preset
  function applyPreset(preset) {
    setWidth(String(preset.w));
    setHeight(String(preset.h));
    const g = gcd(preset.w, preset.h);
    setRatio({
      simplified: `${preset.w / g}:${preset.h / g}`,
      decimal: (preset.w / preset.h).toFixed(4),
      megapixels: ((preset.w * preset.h) / 1_000_000).toFixed(2),
      w: preset.w,
      h: preset.h,
    });
  }

  // Scale: given ratio + one dimension, find the other
  function calcScale(mode) {
    const rw = parseInt(ratioW);
    const rh = parseInt(ratioH);
    if (!rw || !rh) return;

    if (mode === "height" && scaleWidth) {
      const sw = parseInt(scaleWidth);
      setScaleHeight(Math.round((sw * rh) / rw));
    } else if (mode === "width" && scaleHeight) {
      const sh = parseInt(scaleHeight);
      setScaleWidth(Math.round((sh * rw) / rh));
    }
  }

  return (
    <div className="tool-page fade-in">
      <div className="tool-page-inner">

        {/* Title */}
        <h1 className="tool-title">📐 Aspect Ratio Calculator</h1>
        <p className="tool-description">
          Find the aspect ratio of any image or video, or scale dimensions while keeping the ratio.
        </p>

        {/* Preset buttons */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
          {PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => applyPreset(p)}
              className="btn-secondary"
              style={{ fontSize: "13px", padding: "8px 14px" }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Section 1: Find ratio from dimensions */}
        <div className="tool-box">
          <p className="label">Find Aspect Ratio from Dimensions</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "10px" }}>
            <div>
              <label className="label" htmlFor="ar-width">Width (px)</label>
              <input
                id="ar-width"
                className="input-field"
                type="number"
                placeholder="e.g. 1920"
                value={width}
                onChange={e => setWidth(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="ar-height">Height (px)</label>
              <input
                id="ar-height"
                className="input-field"
                type="number"
                placeholder="e.g. 1080"
                value={height}
                onChange={e => setHeight(e.target.value)}
              />
            </div>
          </div>

          <button
            id="calc-ratio-btn"
            className="btn-primary"
            onClick={calcRatio}
            style={{ marginTop: "16px" }}
          >
            📐 Calculate Ratio
          </button>

          {/* Results */}
          {ratio && (
            <div className="result-box" style={{ marginTop: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "16px" }}>
                <div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "4px" }}>ASPECT RATIO</p>
                  <p style={{ fontSize: "22px", fontWeight: "700", color: "#a78bfa" }}>{ratio.simplified}</p>
                </div>
                <div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "4px" }}>DECIMAL</p>
                  <p style={{ fontSize: "22px", fontWeight: "700" }}>{ratio.decimal}</p>
                </div>
                <div>
                  <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "4px" }}>MEGAPIXELS</p>
                  <p style={{ fontSize: "22px", fontWeight: "700" }}>{ratio.megapixels} MP</p>
                </div>
              </div>

              {/* Visual representation */}
              <div style={{ marginTop: "16px" }}>
                <div style={{
                  width: "100%",
                  maxWidth: "300px",
                  paddingBottom: `${(ratio.h / ratio.w) * 100}%`,
                  background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.3))",
                  border: "2px solid rgba(124,58,237,0.5)",
                  borderRadius: "8px",
                  position: "relative",
                  maxHeight: "200px",
                }}>
                  <span style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap",
                  }}>
                    {ratio.w} × {ratio.h}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Scale calculator */}
        <div className="tool-box" style={{ marginTop: "20px" }}>
          <p className="label">Scale Dimensions — Keep the Ratio</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "10px" }}>
            <div>
              <label className="label" htmlFor="ratio-w">Ratio Width</label>
              <input id="ratio-w" className="input-field" type="number" placeholder="16" value={ratioW} onChange={e => setRatioW(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="ratio-h">Ratio Height</label>
              <input id="ratio-h" className="input-field" type="number" placeholder="9" value={ratioH} onChange={e => setRatioH(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="scale-w">Width (px)</label>
              <input id="scale-w" className="input-field" type="number" placeholder="Enter width..." value={scaleWidth} onChange={e => setScaleWidth(e.target.value)} />
              <button className="btn-secondary" onClick={() => calcScale("height")} style={{ marginTop: "8px", fontSize: "13px", padding: "8px 14px" }}>
                → Find Height
              </button>
            </div>
            <div>
              <label className="label" htmlFor="scale-h">Height (px)</label>
              <input id="scale-h" className="input-field" type="number" placeholder="Enter height..." value={scaleHeight} onChange={e => setScaleHeight(e.target.value)} />
              <button className="btn-secondary" onClick={() => calcScale("width")} style={{ marginTop: "8px", fontSize: "13px", padding: "8px 14px" }}>
                → Find Width
              </button>
            </div>
          </div>

          {(scaleWidth && scaleHeight) && (
            <div className="result-box" style={{ marginTop: "16px" }}>
              <p>✅ Result: <strong style={{ color: "#a78bfa" }}>{scaleWidth} × {scaleHeight} px</strong></p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default AspectRatio;
