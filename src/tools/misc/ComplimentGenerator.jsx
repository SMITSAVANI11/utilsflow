// ============================================================
// ComplimentGenerator.jsx — Random Compliment Generator
// ============================================================
import { useState } from "react";

const COMPLIMENTS = [
  "You have an amazing ability to make people feel welcome. 🌟",
  "Your creativity knows no bounds — keep dreaming big! 🎨",
  "The world is genuinely better because you're in it. 💫",
  "You have a gift for turning the ordinary into the extraordinary. ✨",
  "Your kindness is like a beacon that guides others. 🕯️",
  "You make every room brighter just by walking in. ☀️",
  "Your determination is truly inspiring to everyone around you. 💪",
  "You have the rare ability to listen and truly understand. 🫂",
  "Every challenge you face, you handle with grace and strength. 🦁",
  "You're more powerful than you realize — keep going! 🚀",
  "The positivity you bring is contagious in the best way. 😊",
  "Your unique perspective adds incredible value to everything. 🔭",
  "You are exactly the kind of person the world needs more of. 💎",
  "Your smile can literally change someone's entire day. 😄",
  "You have a heart of gold and a mind of steel. ⚡",
  "Not everyone has your courage to try new things — that's special. 🌈",
  "You're crushing it today, even if you don't feel like it. 🏆",
  "Your potential is limitless — never forget that. 🌌",
];

const ANIMATIONS = ["✨", "🎉", "💫", "🌟", "⭐", "🎊"];

function ComplimentGenerator() {
  const [compliment, setCompliment] = useState("");
  const [anim, setAnim] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [animKey, setAnimKey] = useState(0);

  function generate() {
    const c = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];
    const a = ANIMATIONS[Math.floor(Math.random() * ANIMATIONS.length)];
    setCompliment(c);
    setAnim(a);
    setAnimKey(k => k + 1); // force re-animation
    setCopied(false);
    setHistory(prev => [c, ...prev].slice(0, 5));
  }

  function copy() {
    if (!compliment) return;
    navigator.clipboard.writeText(compliment);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="tool-page fade-in">
      <div className="tool-page-inner" style={{ maxWidth: "600px" }}>
        <h1 className="tool-title">💌 Compliment Generator</h1>
        <p className="tool-description">Need a pick-me-up? Generate a heartfelt compliment to brighten your day!</p>

        {/* Main compliment card */}
        <div className="tool-box" style={{ textAlign: "center", padding: "40px 30px", marginBottom: "20px" }}>
          {compliment ? (
            <>
              <p key={animKey} style={{
                fontSize: "48px", marginBottom: "16px",
                animation: "bounceIn 0.5s ease"
              }}>{anim}</p>
              <p key={`c-${animKey}`} style={{
                fontSize: "20px", fontWeight: "600", lineHeight: "1.6",
                color: "var(--text-primary)", animation: "fadeIn 0.4s ease"
              }}>
                {compliment}
              </p>
              <button onClick={copy} className="btn-secondary" style={{ marginTop: "20px" }}>
                {copied ? "✅ Copied!" : "📋 Copy Compliment"}
              </button>
            </>
          ) : (
            <>
              <p style={{ fontSize: "60px", marginBottom: "16px" }}>💌</p>
              <p style={{ color: "var(--text-secondary)", fontSize: "16px" }}>
                Click the button below to get your compliment!
              </p>
            </>
          )}
        </div>

        {/* Generate button */}
        <button id="generate-compliment-btn" className="btn-primary" onClick={generate}
          style={{ width: "100%", justifyContent: "center", padding: "16px" }}>
          ✨ Generate Compliment
        </button>

        {/* History */}
        {history.length > 1 && (
          <div style={{ marginTop: "24px" }}>
            <p className="label">Recent Compliments</p>
            {history.slice(1).map((c, i) => (
              <div key={i} style={{
                padding: "12px 16px", marginTop: "8px",
                background: "rgba(255,255,255,0.03)", borderRadius: "8px",
                border: "1px solid var(--border)", fontSize: "14px",
                color: "var(--text-secondary)"
              }}>
                {c}
              </div>
            ))}
          </div>
        )}

        <style>{`
          @keyframes bounceIn {
            0% { transform: scale(0.5); opacity: 0; }
            70% { transform: scale(1.2); }
            100% { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
}

export default ComplimentGenerator;
