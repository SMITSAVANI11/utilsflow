// ============================================================
// MemeGenerator.jsx — Meme Text Generator Tool
// ============================================================
// Type top/bottom text, pick a template, generate a meme caption
// ============================================================

import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

// Sample meme templates (just text-based captions)
const memeTemplates = [
  { id: 1, name: "Drake Approves",  top: "Using old method",        bottom: "Using UtilsFlow" },
  { id: 2, name: "Two Buttons",     top: "Keep working",            bottom: "Browse memes" },
  { id: 3, name: "Distracted BF",   top: "My old tools",            bottom: "UtilsFlow" },
  { id: 4, name: "Expanding Brain", top: "Doing it manually",       bottom: "Using free online tools" },
  { id: 5, name: "This is Fine",    top: "Everything is fine",      bottom: "*server is on fire*" },
];

function MemeGenerator() {
  const [topText, setTopText]       = useState("When I discovered UtilsFlow");
  const [bottomText, setBottomText] = useState("All tools in one place! 🎉");
  const [copied, setCopied]         = useState(false);

  function loadTemplate(template) {
    setTopText(template.top);
    setBottomText(template.bottom);
  }

  function copyMeme() {
    const memeText = `*Top:* ${topText}\n*Bottom:* ${bottomText}`;
    navigator.clipboard.writeText(memeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <ToolLayout
      toolId="meme-generator"
      title="Meme Text Generator"
      description="Create text-based meme captions instantly with templates or your own text."
      path="/tools/meme-generator"
      category="Creative"
      categoryPath="/?cat=creative"
    >
      <h1 className="tool-title">😂 Meme Text Generator</h1>
      <p className="tool-description">
        Add top/bottom text to make meme captions. Use templates or write your own!
      </p>

      {/* Meme Preview */}
      <div style={{
        background: "#1a1a2e",
        border: "2px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "30px 20px",
        textAlign: "center",
        marginBottom: "24px",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        {/* Top text */}
        <p style={{
          fontSize: "clamp(18px, 3vw, 26px)",
          fontWeight: 900,
          color: "white",
          textTransform: "uppercase",
          textShadow: "2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black",
          letterSpacing: "1px",
          maxWidth: "600px",
        }}>
          {topText || "TYPE TOP TEXT"}
        </p>

        {/* Middle emoji as placeholder for image */}
        <div style={{ fontSize: "80px", margin: "10px 0" }}>🤣</div>

        {/* Bottom text */}
        <p style={{
          fontSize: "clamp(18px, 3vw, 26px)",
          fontWeight: 900,
          color: "white",
          textTransform: "uppercase",
          textShadow: "2px 2px 0 black, -2px -2px 0 black, 2px -2px 0 black, -2px 2px 0 black",
          letterSpacing: "1px",
          maxWidth: "600px",
        }}>
          {bottomText || "TYPE BOTTOM TEXT"}
        </p>
      </div>

      <div className="tool-box">
        {/* Top text input */}
        <div style={{ marginBottom: "16px" }}>
          <label className="label">Top Text</label>
          <input
            id="meme-top-text"
            type="text"
            className="input-field"
            placeholder="Enter top text..."
            value={topText}
            onChange={e => setTopText(e.target.value)}
          />
        </div>

        {/* Bottom text input */}
        <div style={{ marginBottom: "20px" }}>
          <label className="label">Bottom Text</label>
          <input
            id="meme-bottom-text"
            type="text"
            className="input-field"
            placeholder="Enter bottom text..."
            value={bottomText}
            onChange={e => setBottomText(e.target.value)}
          />
        </div>

        {/* Template buttons */}
        <label className="label">Quick Templates</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
          {memeTemplates.map(t => (
            <button
              key={t.id}
              className="btn-secondary"
              style={{ fontSize: "12px", padding: "8px 14px" }}
              onClick={() => loadTemplate(t)}
            >
              {t.name}
            </button>
          ))}
        </div>

        <button id="copy-meme-btn" className="btn-primary" onClick={copyMeme}>
          {copied ? "✅ Copied!" : "📋 Copy Meme Text"}
        </button>
      </div>
    </ToolLayout>
  );
}

export default MemeGenerator;
