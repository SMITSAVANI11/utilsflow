// ============================================================
// BusinessNameGenerator.jsx — Business Name Generator Tool
// ============================================================
// User enters keywords, and we generate creative business names
// using prefixes, suffixes, and keyword combinations.
// ============================================================

import { useState } from "react";

// Word parts we mix and match to build business names
const prefixes = ["Nova", "Peak", "Apex", "Spark", "Zen", "Swift", "Bold", "Bright", "Fuse", "Orbit", "Pixel", "Neo"];
const suffixes = ["Hub", "Lab", "Forge", "Works", "Studio", "Co", "HQ", "Base", "Sphere", "Edge", "Vault", "Wave"];
const connectors = ["", "ly", "ify", "io", "ai", "pro", "app"];

// Generate a list of creative names from a keyword
function generateNames(keyword) {
  const word = keyword.trim();
  if (!word) return [];

  const names = new Set();

  // Pattern 1: prefix + keyword
  prefixes.forEach(p => names.add(p + word.charAt(0).toUpperCase() + word.slice(1)));

  // Pattern 2: keyword + suffix
  suffixes.forEach(s => names.add(word.charAt(0).toUpperCase() + word.slice(1) + s));

  // Pattern 3: keyword + connector
  connectors.forEach(c => {
    if (c) names.add(word.charAt(0).toUpperCase() + word.slice(1) + c);
  });

  // Pattern 4: prefix + connector
  prefixes.slice(0, 6).forEach(p => {
    const c = connectors[Math.floor(Math.random() * connectors.length)];
    if (c) names.add(p + c);
  });

  // Shuffle and return 12 unique results
  return [...names].sort(() => Math.random() - 0.5).slice(0, 12);
}

function BusinessNameGenerator() {
  // State: the user's keyword input
  const [keyword, setKeyword] = useState("");

  // State: generated name results
  const [names, setNames] = useState([]);

  // State: which name was just copied
  const [copied, setCopied] = useState(null);

  // State: was the form submitted with empty input?
  const [error, setError] = useState("");

  // Handle form submit
  function handleGenerate() {
    if (!keyword.trim()) {
      setError("Please enter a keyword first!");
      return;
    }
    setError("");
    setNames(generateNames(keyword));
  }

  // Copy a name to clipboard
  function copyName(name) {
    navigator.clipboard.writeText(name);
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="tool-page fade-in">
      <div className="tool-page-inner">

        {/* Title */}
        <h1 className="tool-title">💼 Business Name Generator</h1>
        <p className="tool-description">
          Enter a keyword related to your business and get 12 creative name ideas instantly.
        </p>

        {/* Input box */}
        <div className="tool-box">
          <label className="label" htmlFor="biz-keyword">Your Keyword</label>
          <input
            id="biz-keyword"
            className="input-field"
            placeholder="e.g. coffee, tech, design, health..."
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleGenerate()}
          />

          {/* Error message */}
          {error && (
            <p style={{ color: "var(--danger)", marginTop: "8px", fontSize: "14px" }}>
              ⚠️ {error}
            </p>
          )}

          {/* Generate button */}
          <button
            id="generate-names-btn"
            className="btn-primary"
            onClick={handleGenerate}
            style={{ marginTop: "16px" }}
          >
            ✨ Generate Names
          </button>
        </div>

        {/* Results grid */}
        {names.length > 0 && (
          <div style={{ marginTop: "24px" }}>
            <p className="label">Generated Names — Click to Copy</p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "12px",
              marginTop: "10px"
            }}>
              {names.map((name, i) => (
                <button
                  key={i}
                  onClick={() => copyName(name)}
                  style={{
                    background: copied === name
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(124, 58, 237, 0.1)",
                    border: `1px solid ${copied === name ? "var(--success)" : "rgba(124,58,237,0.3)"}`,
                    borderRadius: "10px",
                    padding: "14px",
                    color: "var(--text-primary)",
                    fontSize: "15px",
                    fontWeight: "600",
                    textAlign: "center",
                    transition: "all 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {copied === name ? "✅ Copied!" : name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tip box */}
        <div className="result-box" style={{ marginTop: "24px" }}>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            💡 <strong>Tip:</strong> Try keywords like your niche, location, or founder name.
            Check domain availability on Namecheap or GoDaddy after picking a name!
          </p>
        </div>

      </div>
    </div>
  );
}

export default BusinessNameGenerator;
