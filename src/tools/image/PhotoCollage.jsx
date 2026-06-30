import { useState, useRef, useEffect } from "react";
import ToolLayout from "../../components/ToolLayout";

const COLLAGE_LAYOUTS = [
  { id: "grid-2x2", label: "2 × 2 Grid", slots: 4 },
  { id: "vertical-3", label: "3 Vertical Columns", slots: 3 },
  { id: "horizontal-3", label: "3 Horizontal Rows", slots: 3 },
  { id: "split-2", label: "2 Split Columns", slots: 2 }
];

function PhotoCollage() {
  const [layout, setLayout] = useState("grid-2x2");
  const [images, setImages] = useState({});
  const [borderWidth, setBorderWidth] = useState(10);
  const [borderColor, setBorderColor] = useState("#ffffff");
  const [canvasUrl, setCanvasUrl] = useState("");
  const canvasRef = useRef(null);

  // Redraw collage when parameters change
  useEffect(() => {
    drawCollage();
  }, [layout, images, borderWidth, borderColor]);

  function handleSlotFile(slotIdx, file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setImages(prev => ({ ...prev, [slotIdx]: img }));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function drawCollage() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = 800;
    const H = 800;

    canvas.width = W;
    canvas.height = H;

    // Background color
    ctx.fillStyle = borderColor;
    ctx.fillRect(0, 0, W, H);

    const gap = parseInt(borderWidth) || 0;
    const slotsCount = COLLAGE_LAYOUTS.find(l => l.id === layout).slots;

    for (let i = 0; i < slotsCount; i++) {
      let x = 0, y = 0, w = W, h = H;

      if (layout === "grid-2x2") {
        const itemW = (W - gap * 3) / 2;
        const itemH = (H - gap * 3) / 2;
        x = gap + (i % 2) * (itemW + gap);
        y = gap + Math.floor(i / 2) * (itemH + gap);
        w = itemW;
        h = itemH;
      } else if (layout === "vertical-3") {
        const itemW = (W - gap * 4) / 3;
        x = gap + i * (itemW + gap);
        y = gap;
        w = itemW;
        h = H - gap * 2;
      } else if (layout === "horizontal-3") {
        const itemH = (H - gap * 4) / 3;
        x = gap;
        y = gap + i * (itemH + gap);
        w = W - gap * 2;
        h = itemH;
      } else if (layout === "split-2") {
        const itemW = (W - gap * 3) / 2;
        x = gap + i * (itemW + gap);
        y = gap;
        w = itemW;
        h = H - gap * 2;
      }

      const img = images[i];
      if (img) {
        // Draw image keeping aspect ratio (cover mode)
        const imgRatio = img.width / img.height;
        const slotRatio = w / h;
        let sWidth = img.width;
        let sHeight = img.height;
        let sx = 0;
        let sy = 0;

        if (imgRatio > slotRatio) {
          sWidth = img.height * slotRatio;
          sx = (img.width - sWidth) / 2;
        } else {
          sHeight = img.width / slotRatio;
          sy = (img.height - sHeight) / 2;
        }

        ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
      } else {
        // Placeholder slot color
        ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.font = "14px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`Slot ${i + 1} (Empty)`, x + w / 2, y + h / 2);
      }
    }

    setCanvasUrl(canvas.toDataURL("image/png"));
  }

  return (
    <ToolLayout
      toolId="photo-collage"
      title="Photo Collage Maker"
      description="Design customized photo collages, choose from grid presets, modify borders, and download your final design as high-resolution PNG."
      path="/tools/photo-collage"
      category="image"
      categoryPath="/?cat=image"
    >
      <div className="tool-box">
        <div className="editor-grid">
          
          {/* Controls */}
          <div>
            <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "16px", textTransform: "uppercase" }}>
              📐 Layout Setup
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
              <div>
                <label className="label" htmlFor="coll-lay">Collage Layout</label>
                <select id="coll-lay" className="input-field" value={layout} onChange={e => {
                  setLayout(e.target.value);
                  setImages({}); // Reset images on layout change to prevent out of bounds slots
                }}>
                  {COLLAGE_LAYOUTS.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
                </select>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="label" htmlFor="coll-brd-w">Border Width (px)</label>
                  <input type="number" id="coll-brd-w" className="input-field" value={borderWidth} onChange={e => setBorderWidth(e.target.value)} />
                </div>
                <div>
                  <label className="label" htmlFor="coll-brd-c">Border Color</label>
                  <input type="color" id="coll-brd-c" className="input-field" style={{ height: "38px", padding: "2px" }} value={borderColor} onChange={e => setBorderColor(e.target.value)} />
                </div>
              </div>
            </div>

            <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "16px", textTransform: "uppercase" }}>
              🖼️ Upload Slot Images
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {Array.from({ length: COLLAGE_LAYOUTS.find(l => l.id === layout).slots }).map((_, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.01)", border: "1px solid var(--border)", padding: "10px", borderRadius: "var(--radius-sm)" }}>
                  <span style={{ fontSize: "13px", fontWeight: "bold" }}>Slot {i + 1}:</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleSlotFile(i, e.target.files[0])}
                    className="input-field"
                    style={{ fontSize: "12px", padding: "4px" }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <h4 style={{ color: "var(--primary-light)", fontSize: "14px", marginBottom: "16px", textTransform: "uppercase" }}>
              👀 Collage Preview
            </h4>
            <div style={{
              width: "100%",
              maxWidth: "340px",
              aspectRatio: "1/1",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              overflow: "hidden",
              background: "rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <img src={canvasUrl} alt="Collage Preview" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
            </div>
            
            <a href={canvasUrl} download="collage.png" className="btn-primary" style={{ textDecoration: "none", width: "100%", maxWidth: "340px", justifyContent: "center" }}>
              📥 Download Collage PNG
            </a>
          </div>

        </div>

        {/* Hidden Canvas used for drawing */}
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </ToolLayout>
  );
}

export default PhotoCollage;
export { COLLAGE_LAYOUTS };
