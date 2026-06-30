// ============================================================
// TypingTest.jsx — Typing Speed Test (WPM)
// ============================================================
import { useState, useEffect, useRef, useCallback } from "react";

const TEXTS = [
  "The quick brown fox jumps over the lazy dog. Practice makes perfect when it comes to typing speed.",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. Keep typing.",
  "Technology is best when it brings people together. Every keystroke is a step toward mastery.",
  "The only way to do great work is to love what you do. Type fast and never look back at the keys.",
  "In the middle of difficulty lies opportunity. Speed typing is a skill that opens many doors in life.",
];

function TypingTest() {
  const [text] = useState(() => TEXTS[Math.floor(Math.random() * TEXTS.length)]);
  const [typed, setTyped] = useState("");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const finish = useCallback(() => {
    clearInterval(timerRef.current);
    setFinished(true);
    const words = typed.trim().split(/\s+/).filter(Boolean).length;
    const elapsed = 60 - timeLeft || 1;
    setWpm(Math.round((words / elapsed) * 60));
    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === text[i]) correct++;
    }
    setAccuracy(typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100);
  }, [typed, timeLeft, text]);

  // Countdown timer
  useEffect(() => {
    if (started && !finished) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(timerRef.current); finish(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [started, finished, finish]);

  // Check if finished typing
  useEffect(() => {
    if (typed.length >= text.length && started && !finished) finish();
  }, [typed, text, started, finished, finish]);

  function handleInput(e) {
    const val = e.target.value;
    if (!started && val.length > 0) setStarted(true);
    if (!finished) setTyped(val);
  }

  function restart() {
    clearInterval(timerRef.current);
    setTyped(""); setStarted(false); setFinished(false);
    setTimeLeft(60); setWpm(0); setAccuracy(100);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  // Color each character
  const chars = text.split("").map((ch, i) => {
    let color = "var(--text-secondary)";
    if (i < typed.length) color = typed[i] === ch ? "var(--success)" : "var(--danger)";
    return <span key={i} style={{ color, transition: "color 0.1s" }}>{ch}</span>;
  });

  const progress = (typed.length / text.length) * 100;

  return (
    <div className="tool-page fade-in">
      <div className="tool-page-inner">
        <h1 className="tool-title">⌨️ Typing Speed Test</h1>
        <p className="tool-description">Type the text below as fast and accurately as you can. 60 seconds!</p>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
          {[
            { label: "⏱ Time", val: `${timeLeft}s`, color: timeLeft < 10 ? "var(--danger)" : "#a78bfa" },
            { label: "💨 WPM", val: finished ? wpm : Math.round((typed.split(/\s+/).filter(Boolean).length / Math.max(1, 60 - timeLeft)) * 60), color: "var(--success)" },
            { label: "🎯 Accuracy", val: `${accuracy}%`, color: "var(--warning)" },
          ].map(s => (
            <div key={s.label} className="glass-card" style={{ flex: 1, minWidth: "100px", padding: "14px", textAlign: "center" }}>
              <p style={{ fontSize: "11px", color: "var(--text-secondary)" }}>{s.label}</p>
              <p style={{ fontSize: "26px", fontWeight: "800", color: s.color }}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Text display */}
        <div className="tool-box" style={{ marginBottom: "16px", fontFamily: "monospace", fontSize: "17px", lineHeight: "2", letterSpacing: "0.5px" }}>
          {chars}
        </div>

        {/* Progress bar */}
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "4px", height: "6px", marginBottom: "16px" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg, var(--primary), var(--success))", borderRadius: "4px", transition: "width 0.2s" }} />
        </div>

        {/* Input area */}
        {!finished ? (
          <textarea
            ref={inputRef}
            id="typing-input"
            className="input-field"
            rows={3}
            placeholder="Start typing here..."
            value={typed}
            onChange={handleInput}
            style={{ fontFamily: "monospace", fontSize: "15px", resize: "none" }}
            autoFocus
          />
        ) : (
          <div className="result-box" style={{ textAlign: "center" }}>
            <p style={{ fontSize: "40px" }}>🎉</p>
            <p style={{ fontSize: "28px", fontWeight: "800", color: "#a78bfa", marginTop: "8px" }}>{wpm} WPM</p>
            <p style={{ color: "var(--text-secondary)", marginTop: "4px" }}>Accuracy: {accuracy}%</p>
            <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>
              {wpm < 30 ? "Keep practicing! 💪" : wpm < 60 ? "Good speed! 👍" : wpm < 90 ? "Great job! 🌟" : "You're a typing legend! 🚀"}
            </p>
            <button id="restart-typing-btn" className="btn-primary" onClick={restart} style={{ marginTop: "16px" }}>
              🔄 Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TypingTest;
