import { useState, useRef, useEffect } from "react";
import ToolLayout from "../../components/ToolLayout";

const CURSIVE_FONTS = [
  { name: "Caveat", family: "'Caveat', cursive", url: "https://fonts.googleapis.com/css2?family=Caveat:wght@400;700&display=swap" },
  { name: "Great Vibes", family: "'Great Vibes', cursive", url: "https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" },
  { name: "Alex Brush", family: "'Alex Brush', cursive", url: "https://fonts.googleapis.com/css2?family=Alex+Brush&display=swap" },
  { name: "Dancing Script", family: "'Dancing Script', cursive", url: "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500&display=swap" },
  { name: "Sacramento", family: "'Sacramento', cursive", url: "https://fonts.googleapis.com/css2?family=Sacramento&display=swap" },
];

function DigitalSignature() {
  const [signatureMode, setSignatureMode] = useState("draw"); // "draw" | "type"

  // Pen Drawing Settings
  const [penColor, setPenColor] = useState("#000000");
  const [penWidth, setPenWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);

  // Typed Signature Settings
  const [typedText, setTypedText] = useState("");
  const [selectedFont, setSelectedFont] = useState(CURSIVE_FONTS[0].family);
  const [typedSize, setTypedSize] = useState(48);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  // Load custom fonts dynamically from Google Fonts
  useEffect(() => {
    CURSIVE_FONTS.forEach(font => {
      if (!document.getElementById(`font-${font.name}`)) {
        const link = document.createElement("link");
        link.id = `font-${font.name}`;
        link.rel = "stylesheet";
        link.href = font.url;
        document.head.appendChild(link);
      }
    });
  }, []);

  // Initialize Canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Set display/resolution size
    canvas.width = 600;
    canvas.height = 200;
    
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    clearCanvas();
  }, [signatureMode]);

  // Handle Typed Signature Drawing
  useEffect(() => {
    if (signatureMode !== "type" || !ctxRef.current || !canvasRef.current) return;
    drawTypedSignature();
  }, [signatureMode, typedText, selectedFont, penColor, typedSize]);

  function clearCanvas() {
    if (!ctxRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // If not transparent, we could fill it, but signature outputs are best transparent.
    // Draw a subtle placeholder grid or baseline when empty in draw mode
    if (signatureMode === "draw") {
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(30, 150);
      ctx.lineTo(570, 150);
      ctx.stroke();
      ctx.restore();
    }
  }

  function drawTypedSignature() {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!typedText.trim()) return;

    ctx.save();
    ctx.font = `${typedSize}px ${selectedFont}`;
    ctx.fillStyle = penColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(typedText, canvas.width / 2, canvas.height / 2);
    ctx.restore();
  }

  // Draw Mode Drawing Handlers
  function getCoordinates(e) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Check touch vs mouse
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  function startDrawing(e) {
    e.preventDefault();
    const coords = getCoordinates(e);
    const ctx = ctxRef.current;

    // If canvas was empty, clear baseline helper
    if (!isDrawing) {
      // Clear canvas to remove baseline helper
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = penWidth;
    
    setIsDrawing(true);
  }

  function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    const coords = getCoordinates(e);
    const ctx = ctxRef.current;
    
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  }

  function stopDrawing() {
    setIsDrawing(false);
  }

  function downloadSignature() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    
    // Check if empty (optional but helpful)
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "digital_signature.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  return (
    <ToolLayout
      toolId="digital-signature"
      title="Digital Signature Pad"
      description="Create, draw, or type your digital signature. Customize pen colors, styles, and download as a transparent PNG."
      path="/tools/digital-signature"
      category="pdf"
      categoryPath="/?cat=pdf"
    >
      <div className="tool-box">
        {/* Draw vs Type selector */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          <button
            className={`btn-secondary ${signatureMode === "draw" ? "btn-primary" : ""}`}
            onClick={() => setSignatureMode("draw")}
            style={{ flex: 1, padding: "10px", fontSize: "14px", justifyContent: "center" }}
          >
            ✏️ Draw Signature
          </button>
          <button
            className={`btn-secondary ${signatureMode === "type" ? "btn-primary" : ""}`}
            onClick={() => setSignatureMode("type")}
            style={{ flex: 1, padding: "10px", fontSize: "14px", justifyContent: "center" }}
          >
            ⌨️ Type Signature
          </button>
        </div>

        {/* Canvas Display Pad */}
        <div style={{
          background: "var(--input-bg)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "24px",
          position: "relative",
          userSelect: "none",
          touchAction: "none",
        }}>
          <canvas
            ref={canvasRef}
            onMouseDown={signatureMode === "draw" ? startDrawing : undefined}
            onMouseMove={signatureMode === "draw" ? draw : undefined}
            onMouseUp={signatureMode === "draw" ? stopDrawing : undefined}
            onMouseLeave={signatureMode === "draw" ? stopDrawing : undefined}
            onTouchStart={signatureMode === "draw" ? startDrawing : undefined}
            onTouchMove={signatureMode === "draw" ? draw : undefined}
            onTouchEnd={signatureMode === "draw" ? stopDrawing : undefined}
            style={{
              background: "white", // Signature pad canvas background
              width: "100%",
              maxWidth: "600px",
              height: "200px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow)",
              cursor: signatureMode === "draw" ? "crosshair" : "default",
            }}
          />
        </div>

        {/* Settings and Options Panel */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "16px",
          marginBottom: "24px",
        }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
            {/* Color selection (applies to both modes) */}
            <div>
              <label className="label">Signature Color</label>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                {["#000000", "#002fa7", "#008000", "#ff0000"].map(color => (
                  <button
                    key={color}
                    onClick={() => setPenColor(color)}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "50%",
                      background: color,
                      border: penColor === color ? "2px solid var(--primary-light)" : "1px solid var(--border)",
                      cursor: "pointer",
                    }}
                    aria-label={`Select color ${color}`}
                  />
                ))}
                <input
                  type="color"
                  value={penColor}
                  onChange={e => setPenColor(e.target.value)}
                  style={{ width: "30px", height: "30px", padding: 0, border: "1px solid var(--border)", background: "none", borderRadius: "50%", cursor: "pointer" }}
                  aria-label="Custom color picker"
                />
              </div>
            </div>

            {/* Draw mode specific: Width slider */}
            {signatureMode === "draw" && (
              <div>
                <label className="label" htmlFor="stroke-range">Stroke Width: {penWidth}px</label>
                <input
                  id="stroke-range"
                  type="range"
                  min="1"
                  max="10"
                  value={penWidth}
                  onChange={e => setPenWidth(Number(e.target.value))}
                />
              </div>
            )}

            {/* Type mode specific: Text Input */}
            {signatureMode === "type" && (
              <div style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "12px" }}>
                  <div>
                    <label className="label" htmlFor="type-sig-inp">Type your name</label>
                    <input
                      id="type-sig-inp"
                      type="text"
                      className="input-field"
                      placeholder="e.g. John Doe"
                      value={typedText}
                      onChange={e => setTypedText(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="font-sig-sel">Font Style</label>
                    <select
                      id="font-sig-sel"
                      className="input-field"
                      value={selectedFont}
                      onChange={e => setSelectedFont(e.target.value)}
                    >
                      {CURSIVE_FONTS.map(font => (
                        <option key={font.name} value={font.family} style={{ fontFamily: font.family }}>
                          {font.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: "12px" }}>
                  <label className="label" htmlFor="sig-size-slider">Signature Size: {typedSize}px</label>
                  <input
                    id="sig-size-slider"
                    type="range"
                    min="20"
                    max="80"
                    value={typedSize}
                    onChange={e => setTypedSize(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="btn-danger"
            onClick={clearCanvas}
            style={{ flex: 1, justifyContent: "center" }}
          >
            🗑️ Clear Signature
          </button>
          <button
            className="btn-primary"
            onClick={downloadSignature}
            style={{ flex: 1, justifyContent: "center" }}
          >
            💾 Download Signature (PNG)
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}

export default DigitalSignature;
export { CURSIVE_FONTS };
