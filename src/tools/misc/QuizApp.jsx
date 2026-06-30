// ============================================================
// QuizApp.jsx — Daily General Knowledge Quiz
// ============================================================
import { useState } from "react";

const QUESTIONS = [
  { q: "What is the capital of Australia?", opts: ["Sydney", "Melbourne", "Canberra", "Brisbane"], ans: 2 },
  { q: "Which planet is known as the Red Planet?", opts: ["Venus", "Mars", "Jupiter", "Saturn"], ans: 1 },
  { q: "Who painted the Mona Lisa?", opts: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"], ans: 2 },
  { q: "What is the largest ocean on Earth?", opts: ["Atlantic", "Indian", "Arctic", "Pacific"], ans: 3 },
  { q: "How many sides does a hexagon have?", opts: ["5", "6", "7", "8"], ans: 1 },
  { q: "What is the chemical symbol for Gold?", opts: ["Gd", "Go", "Au", "Ag"], ans: 2 },
  { q: "In which year did World War II end?", opts: ["1943", "1944", "1945", "1946"], ans: 2 },
  { q: "What is the fastest land animal?", opts: ["Lion", "Cheetah", "Leopard", "Horse"], ans: 1 },
  { q: "Which country invented pizza?", opts: ["France", "USA", "Spain", "Italy"], ans: 3 },
  { q: "What is H2O commonly known as?", opts: ["Oxygen", "Water", "Hydrogen", "Salt"], ans: 1 },
];

function QuizApp() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState([]);

  const q = QUESTIONS[current];

  function select(i) {
    if (selected !== null) return;
    setSelected(i);
    const correct = i === q.ans;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, { q: q.q, chosen: i, correct: q.ans, isCorrect: correct }]);
  }

  function next() {
    if (current + 1 >= QUESTIONS.length) { setDone(true); return; }
    setCurrent(c => c + 1);
    setSelected(null);
  }

  function restart() {
    setCurrent(0); setSelected(null); setScore(0); setDone(false); setAnswers([]);
  }

  const grade = score >= 9 ? "🏆 Expert" : score >= 7 ? "🌟 Smart" : score >= 5 ? "👍 Average" : "📚 Needs Practice";

  if (done) {
    return (
      <div className="tool-page fade-in">
        <div className="tool-page-inner" style={{ maxWidth: "600px" }}>
          <h1 className="tool-title">🧠 Quiz Results</h1>
          <div className="result-box" style={{ textAlign: "center", padding: "32px", marginBottom: "20px" }}>
            <p style={{ fontSize: "48px" }}>{grade.split(" ")[0]}</p>
            <p style={{ fontSize: "36px", fontWeight: "800", color: "#a78bfa", margin: "12px 0" }}>
              {score}/{QUESTIONS.length}
            </p>
            <p style={{ color: "var(--text-secondary)" }}>{grade.split(" ").slice(1).join(" ")}</p>
          </div>

          {/* Answer review */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            {answers.map((a, i) => (
              <div key={i} style={{
                padding: "12px 16px", borderRadius: "10px",
                background: a.isCorrect ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                border: `1px solid ${a.isCorrect ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
              }}>
                <p style={{ fontSize: "14px", fontWeight: 600 }}>Q{i + 1}: {a.q}</p>
                <p style={{ fontSize: "13px", color: a.isCorrect ? "var(--success)" : "var(--danger)", marginTop: "4px" }}>
                  {a.isCorrect ? "✅ Correct" : `❌ You picked: ${QUESTIONS[i].opts[a.chosen]} | Correct: ${QUESTIONS[i].opts[a.correct]}`}
                </p>
              </div>
            ))}
          </div>

          <button id="restart-quiz-btn" className="btn-primary" onClick={restart} style={{ width: "100%", justifyContent: "center" }}>
            🔄 Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tool-page fade-in">
      <div className="tool-page-inner" style={{ maxWidth: "600px" }}>
        <h1 className="tool-title">🧠 Daily GK Quiz</h1>
        <p className="tool-description">Test your general knowledge! {QUESTIONS.length} questions, no time limit.</p>

        {/* Progress */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Question {current + 1} of {QUESTIONS.length}</span>
          <span style={{ color: "#a78bfa", fontWeight: 700 }}>Score: {score}</span>
        </div>
        <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "4px", height: "6px", marginBottom: "24px" }}>
          <div style={{ width: `${((current) / QUESTIONS.length) * 100}%`, height: "100%", background: "linear-gradient(90deg, var(--primary), var(--secondary))", borderRadius: "4px", transition: "width 0.4s" }} />
        </div>

        {/* Question card */}
        <div className="tool-box" style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "18px", fontWeight: "700", lineHeight: "1.5" }}>{q.q}</p>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
          {q.opts.map((opt, i) => {
            let bg = "rgba(255,255,255,0.04)", border = "var(--border)", color = "var(--text-primary)";
            if (selected !== null) {
              if (i === q.ans) { bg = "rgba(16,185,129,0.15)"; border = "var(--success)"; color = "var(--success)"; }
              else if (i === selected && selected !== q.ans) { bg = "rgba(239,68,68,0.15)"; border = "var(--danger)"; color = "var(--danger)"; }
            }
            return (
              <button key={i} onClick={() => select(i)}
                style={{
                  padding: "14px 18px", borderRadius: "10px", border: `1px solid ${border}`,
                  background: bg, color, textAlign: "left", cursor: selected !== null ? "default" : "pointer",
                  fontWeight: 500, fontSize: "15px", transition: "all 0.2s"
                }}
                onMouseEnter={e => { if (selected === null) e.currentTarget.style.background = "rgba(124,58,237,0.1)"; }}
                onMouseLeave={e => { if (selected === null) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
              >
                <span style={{ color: "var(--text-secondary)", marginRight: "10px" }}>
                  {["A", "B", "C", "D"][i]}.
                </span>
                {opt}
              </button>
            );
          })}
        </div>

        {/* Next button */}
        {selected !== null && (
          <button id="next-question-btn" className="btn-primary" onClick={next}
            style={{ width: "100%", justifyContent: "center" }}>
            {current + 1 >= QUESTIONS.length ? "🏁 See Results" : "Next Question →"}
          </button>
        )}
      </div>
    </div>
  );
}

export default QuizApp;
