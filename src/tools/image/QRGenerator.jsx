// QRGenerator.jsx v2 — With error handling, revokeObjectURL, and SEO
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

const QR_TYPES = [
  { id: "url",     label: "URL / Website",   placeholder: "https://example.com" },
  { id: "text",    label: "Plain Text",       placeholder: "Any text you want..." },
  { id: "email",   label: "Email",            placeholder: "hello@example.com" },
  { id: "phone",   label: "Phone Number",     placeholder: "+1234567890" },
  { id: "sms",     label: "SMS",              placeholder: "+1234567890" },
  { id: "wifi",    label: "WiFi Network",     placeholder: "NetworkName:Password:WPA" },
];

function buildQRData(type, input) {
  switch (type) {
    case "email":  return `mailto:${input}`;
    case "phone":  return `tel:${input}`;
    case "sms":    return `sms:${input}`;
    case "wifi": {
      const [ssid, pass, enc = "WPA"] = input.split(":");
      return `WIFI:T:${enc};S:${ssid};P:${pass};;`;
    }
    default: return input;
  }
}

function QRGenerator() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("qr-generator"); }, [trackTool]);

  const [qrType,   setQrType]   = useState("url");
  const [input,    setInput]    = useState("");
  const [qrUrl,    setQrUrl]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [size,     setSize]     = useState(256);
  const [fgColor,  setFgColor]  = useState("#a78bfa");
  const [bgColor,  setBgColor]  = useState("#0a0a0f");

  const currentType = QR_TYPES.find((t) => t.id === qrType);

  function generateQR() {
    if (!input.trim()) { setError("Please enter some text or URL."); return; }
    setError("");
    setLoading(true);
    const data = buildQRData(qrType, input.trim());
    const encoded = encodeURIComponent(data);
    const fg = fgColor.replace("#", "");
    const bg = bgColor.replace("#", "");
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}&color=${fg}&bgcolor=${bg}&margin=10`;
    setQrUrl(url);
    setLoading(false);
  }

  async function downloadQR() {
    if (!qrUrl) return;
    let objectUrl = null;
    try {
      const res = await fetch(qrUrl);
      if (!res.ok) throw new Error(`Download failed (${res.status})`);
      const blob = await res.blob();
      objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = "qrcode-utilsflow.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Download failed. Please try saving the image manually.");
      console.error("QR download error:", err);
    } finally {
      if (objectUrl) URL.revokeObjectURL(objectUrl); // ✅ prevent memory leak
    }
  }

  return (
    <div className="tool-page fade-in">
      <SEOHead
        title="QR Code Generator"
        description="Generate QR codes for URLs, WiFi, email, phone, and SMS. Custom colors and sizes. Free, instant, no signup."
        path="/tools/qr-generator"
      />
      <div className="tool-page-inner">
        <Breadcrumb toolName="QR Code Generator" category="Image & Design" categoryPath="/?cat=image" />
        <h1 className="tool-title">📱 QR Code Generator</h1>
        <p className="tool-description">Generate QR codes for websites, WiFi credentials, phone numbers, emails, and more.</p>

        <div className="tool-box">
          {/* Type selector */}
          <div style={{ marginBottom: "16px" }}>
            <label className="label" htmlFor="qr-type">QR Type</label>
            <select id="qr-type" className="input-field" value={qrType} onChange={(e) => { setQrType(e.target.value); setInput(""); setQrUrl(""); }}>
              {QR_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>

          {/* Input */}
          <div style={{ marginBottom: "16px" }}>
            <label className="label" htmlFor="qr-input">{currentType.label}</label>
            <input id="qr-input" className="input-field" placeholder={currentType.placeholder} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && generateQR()} />
          </div>

          {/* Colors + size row */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "16px" }}>
            <div style={{ flex: 1, minWidth: "120px" }}>
              <label className="label">QR Color</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ width: "42px", height: "38px", border: "1px solid var(--border)", borderRadius: "6px", cursor: "pointer", background: "none" }} />
                <input type="text" className="input-field" value={fgColor} onChange={(e) => setFgColor(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: "120px" }}>
              <label className="label">Background</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ width: "42px", height: "38px", border: "1px solid var(--border)", borderRadius: "6px", cursor: "pointer", background: "none" }} />
                <input type="text" className="input-field" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{ flex: 1 }} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: "160px" }}>
              <label className="label">Size: {size}×{size}px</label>
              <input type="range" min="128" max="512" step="64" value={size} onChange={(e) => setSize(Number(e.target.value))} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}><span>128</span><span>512</span></div>
            </div>
          </div>

          {error && <p role="alert" style={{ color: "var(--danger)", marginBottom: "12px", fontSize: "14px" }}>⚠️ {error}</p>}

          <button id="generate-qr-btn" className="btn-primary" onClick={generateQR} style={{ width: "100%" }}>
            📱 Generate QR Code
          </button>
        </div>

        {/* QR Output */}
        {qrUrl && !loading && (
          <div className="tool-box" style={{ marginTop: "24px", textAlign: "center" }}>
            <p className="label" style={{ textAlign: "left" }}>Your QR Code</p>
            <div style={{ display: "inline-block", padding: "16px", background: bgColor, borderRadius: "12px", margin: "16px 0", border: "1px solid var(--border)" }}>
              <img src={qrUrl} alt="Generated QR Code" width={size} height={size} style={{ display: "block" }} onError={() => setError("QR generation failed. The external API may be unavailable.")} />
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button id="download-qr-btn" className="btn-primary" onClick={downloadQR}>⬇️ Download PNG</button>
              <a href={qrUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary">🔗 Open in new tab</a>
            </div>
          </div>
        )}

        <div className="result-box" style={{ marginTop: "24px" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            💡 <strong>Tip:</strong> WiFi QR format: <code style={{ fontFamily: "JetBrains Mono, monospace" }}>NetworkName:Password:WPA</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default QRGenerator;
