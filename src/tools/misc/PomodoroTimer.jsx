// ============================================================
// PomodoroTimer.jsx — Pomodoro Focus Timer
// ============================================================
// 25-minute work sessions followed by 5-minute breaks.
// Uses setInterval to count down each second.
// ============================================================

import { useState, useEffect, useRef } from "react";

// Timer modes
const MODES = {
  work:       { label: "🍅 Focus",      seconds: 25 * 60, color: "#a78bfa" },
  short:      { label: "☕ Short Break", seconds: 5 * 60,  color: "var(--success)" },
  long:       { label: "🛋️ Long Break",  seconds: 15 * 60, color: "var(--secondary)" },
};

function fmt(secs) {
  const m = String(Math.floor(secs / 60)).padStart(2, "0");
  const s = String(secs % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function PomodoroTimer() {
  const [mode, setMode] = useState("work");
  const [timeLeft, setTimeLeft] = useState(MODES.work.seconds);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [customWork, setCustomWork] = useState(25);
  const intervalRef = useRef(null);

  // Current mode config
  const current = { ...MODES[mode], seconds: mode === "work" ? customWork * 60 : MODES[mode].seconds };

  // Progress as percentage
  const progress = ((current.seconds - timeLeft) / current.seconds) * 100;

  // Start/stop timer
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            // Notify user
            if (Notification.permission === "granted") {
              new Notification("UtilsFlow Pomodoro", { body: mode === "work" ? "Time for a break! 🎉" : "Back to work! 💪" });
            }
            if (mode === "work") setSessions(s => s + 1);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, mode]);

  // Switch mode
  function switchMode(m) {
    setRunning(false);
    setMode(m);
    setTimeLeft(m === "work" ? customWork * 60 : MODES[m].seconds);
  }

  // Reset
  function reset() {
    setRunning(false);
    setTimeLeft(current.seconds);
  }

  // Request notification permission
  function requestNotif() {
    if (Notification.permission === "default") Notification.requestPermission();
  }

  // Ring size for circular progress
  const R = 90;
  const circ = 2 * Math.PI * R;
  const offset = circ - (progress / 100) * circ;

  return (
    <div className="tool-page fade-in">
      <div className="tool-page-inner" style={{ maxWidth: "500px" }}>
        <h1 className="tool-title">⏱️ Pomodoro Timer</h1>
        <p className="tool-description">Stay focused with timed work and break sessions.</p>

        {/* Mode tabs */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {Object.entries(MODES).map(([key, val]) => (
            <button key={key} onClick={() => switchMode(key)}
              style={{
                flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid",
                borderColor: mode === key ? val.color : "var(--border)",
                background: mode === key ? `${val.color}22` : "var(--bg-card)",
                color: mode === key ? val.color : "var(--text-secondary)",
                cursor: "pointer", fontWeight: 600, fontSize: "13px", transition: "all 0.2s"
              }}>
              {val.label}
            </button>
          ))}
        </div>

        {/* Circular timer */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <svg width="220" height="220" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="110" cy="110" r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
            <circle cx="110" cy="110" r={R} fill="none" stroke={current.color} strokeWidth="12"
              strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div style={{ marginTop: "-160px", marginBottom: "140px" }}>
            <p style={{ fontSize: "56px", fontWeight: "800", color: current.color, fontVariantNumeric: "tabular-nums" }}>
              {fmt(timeLeft)}
            </p>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>{current.label}</p>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginBottom: "24px" }}>
          <button id="pomodoro-start-btn" className="btn-primary" onClick={() => { requestNotif(); setRunning(r => !r); }}
            style={{ minWidth: "120px", justifyContent: "center" }}>
            {running ? "⏸ Pause" : "▶ Start"}
          </button>
          <button className="btn-secondary" onClick={reset}>↺ Reset</button>
        </div>

        {/* Custom work duration */}
        <div className="tool-box">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <label className="label">Work Duration</label>
            <span style={{ color: "#a78bfa", fontWeight: 700 }}>{customWork} min</span>
          </div>
          <input type="range" min="5" max="60" step="5" value={customWork}
            onChange={e => { setCustomWork(Number(e.target.value)); if (mode === "work") setTimeLeft(Number(e.target.value) * 60); }} />
        </div>

        {/* Session count */}
        <div className="result-box" style={{ marginTop: "16px", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Completed sessions today</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "8px" }}>
            {Array.from({ length: Math.max(sessions, 4) }).map((_, i) => (
              <div key={i} style={{
                width: "28px", height: "28px", borderRadius: "50%",
                background: i < sessions ? "#a78bfa" : "rgba(255,255,255,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px"
              }}>
                {i < sessions ? "🍅" : ""}
              </div>
            ))}
          </div>
          <p style={{ marginTop: "8px", color: "#a78bfa", fontWeight: 700, fontSize: "20px" }}>
            {sessions} session{sessions !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PomodoroTimer;
