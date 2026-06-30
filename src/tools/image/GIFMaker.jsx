import { useState, useEffect } from "react";
import ToolLayout from "../../components/ToolLayout";

function GIFMaker() {
  const [images, setImages] = useState([]);
  const [frameDuration, setFrameDuration] = useState(0.5); // seconds
  const [gifWidth, setGifWidth] = useState(320);
  const [gifHeight, setGifHeight] = useState(320);
  const [loading, setLoading] = useState(false);
  const [resultGif, setResultGif] = useState("");
  const [error, setError] = useState("");

  // Dynamically load gifshot library
  useEffect(() => {
    if (window.gifshot) return;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gifshot/0.4.5/gifshot.min.js";
    script.async = true;
    script.onload = () => console.log("gifshot loaded successfully.");
    script.onerror = () => setError("Failed to load GIF creation engine. Check your connection.");
    document.body.appendChild(script);
    return () => {
      // Clean up script on unmount
      document.body.removeChild(script);
    };
  }, []);

  function handleFiles(e) {
    const files = Array.from(e.target.files);
    const readPromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then(base64Images => {
      setImages(prev => [...prev, ...base64Images]);
      setError("");
    });
  }

  function compileGif() {
    if (images.length < 2) {
      setError("Please upload at least 2 images to create an animation loop.");
      return;
    }
    if (!window.gifshot) {
      setError("GIF engine is still loading. Please try again in a few seconds.");
      return;
    }

    setLoading(true);
    setError("");
    setResultGif("");

    window.gifshot.createGIF(
      {
        images: images,
        interval: frameDuration,
        gifWidth: parseInt(gifWidth) || 320,
        gifHeight: parseInt(gifHeight) || 320,
        numFrames: images.length,
        frameDuration: frameDuration * 10,
        sampleInterval: 10,
      },
      function (obj) {
        setLoading(false);
        if (!obj.error) {
          setResultGif(obj.image);
        } else {
          setError(`Compilation failed: ${obj.errorMsg}`);
        }
      }
    );
  }

  return (
    <ToolLayout
      toolId="gif-maker"
      title="GIF Maker"
      description="Compile multiple images into an animated GIF loop, configure dimensions, adjust speed, and export locally."
      path="/tools/gif-maker"
      category="image"
      categoryPath="/?cat=image"
    >
      <div className="tool-box">
        {error && (
          <div style={{ padding: "10px", background: "rgba(244,67,54,0.15)", border: "1px solid #f44336", color: "#ef5350", borderRadius: "4px", marginBottom: "16px", fontSize: "13px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }} className="editor-grid">
          {/* Controls */}
          <div>
            <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "16px", textTransform: "uppercase" }}>
              🖼️ Upload Frames
            </h4>
            
            <input type="file" multiple accept="image/*" id="gif-imgs-inp" onChange={handleFiles} style={{ display: "none" }} />
            <label
              htmlFor="gif-imgs-inp"
              style={{
                display: "block",
                border: "2px dashed var(--border)",
                borderRadius: "var(--radius)",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
                background: "rgba(255, 255, 255, 0.01)",
                marginBottom: "16px"
              }}
            >
              📷 Upload Image Frames ({images.length} added)
            </label>

            {images.length > 0 && (
              <div style={{
                display: "flex",
                gap: "6px",
                overflowX: "auto",
                padding: "8px",
                background: "rgba(0,0,0,0.2)",
                borderRadius: "4px",
                marginBottom: "20px"
              }}>
                {images.map((img, idx) => (
                  <div key={idx} style={{ position: "relative", flexShrink: 0, width: "60px", height: "60px", border: "1px solid var(--border)", borderRadius: "4px", overflow: "hidden" }}>
                    <img src={img} alt="Frame" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button
                      style={{
                        position: "absolute",
                        top: "2px",
                        right: "2px",
                        background: "rgba(244,67,54,0.9)",
                        color: "white",
                        border: "none",
                        width: "18px",
                        height: "18px",
                        borderRadius: "50%",
                        fontSize: "10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                      onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <h4 style={{ color: "var(--primary-light)", fontSize: "14px", borderBottom: "1px solid var(--border)", paddingBottom: "6px", marginBottom: "16px", textTransform: "uppercase" }}>
              ⚙️ Settings
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label className="label" htmlFor="gif-spd">Frame Interval (seconds)</label>
                <input
                  id="gif-spd"
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={frameDuration}
                  onChange={e => setFrameDuration(parseFloat(e.target.value) || 0.1)}
                />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="label" htmlFor="gif-w">Width (px)</label>
                  <input
                    id="gif-w"
                    type="number"
                    className="input-field"
                    value={gifWidth}
                    onChange={e => setGifWidth(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="gif-h">Height (px)</label>
                  <input
                    id="gif-h"
                    type="number"
                    className="input-field"
                    value={gifHeight}
                    onChange={e => setGifHeight(e.target.value)}
                  />
                </div>
              </div>

              <button className="btn-primary" onClick={compileGif} disabled={loading} style={{ justifyContent: "center", marginTop: "10px" }}>
                {loading ? "Compiling GIF..." : "⚡ Compile Animated GIF"}
              </button>
            </div>
          </div>

          {/* Result */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "20px", background: "rgba(0,0,0,0.15)" }}>
            {resultGif ? (
              <div style={{ textAlign: "center", width: "100%" }}>
                <h5 style={{ color: "var(--primary-light)", marginBottom: "12px", fontSize: "14px", fontWeight: "bold" }}>
                  🎉 Animation Output Preview
                </h5>
                <div style={{
                  display: "inline-block",
                  border: "4px solid #333",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "black",
                  marginBottom: "16px",
                  maxHeight: "300px"
                }}>
                  <img src={resultGif} alt="Result animated GIF" style={{ maxWidth: "100%", maxHeight: "290px", objectFit: "contain" }} />
                </div>
                <div>
                  <a href={resultGif} download="animated.gif" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none", justifyContent: "center" }}>
                    📥 Download GIF File
                  </a>
                </div>
              </div>
            ) : (
              <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                {loading ? "Processing frames..." : "Add frames and click Compile to preview GIF."}
              </p>
            )}
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}

export default GIFMaker;
