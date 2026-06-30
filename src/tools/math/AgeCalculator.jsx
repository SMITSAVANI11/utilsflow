// ============================================================
// AgeCalculator.jsx — Exact Age Calculator
// ============================================================
import { useState } from "react";

function AgeCalculator() {
  const [dob, setDob] = useState("");
  const [result, setResult] = useState(null);

  function calculate() {
    if (!dob) return;
    const birth = new Date(dob);
    const now = new Date();
    if (birth > now) { setResult(null); return; }

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) { months--; const prev = new Date(now.getFullYear(), now.getMonth(), 0); days += prev.getDate(); }
    if (months < 0) { years--; months += 12; }

    const totalDays = Math.floor((now - birth) / 86400000);
    const totalWeeks = Math.floor(totalDays / 7);
    const totalHours = totalDays * 24;
    const totalSeconds = totalDays * 86400;

    // Next birthday
    const nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday <= now) nextBday.setFullYear(now.getFullYear() + 1);
    const daysUntilBday = Math.ceil((nextBday - now) / 86400000);

    setResult({ years, months, days, totalDays, totalWeeks, totalHours, totalSeconds, daysUntilBday });
  }

  // Quick presets for famous birthdays
  const presets = [
    { label: "Jan 1, 2000", val: "2000-01-01" },
    { label: "Jul 4, 1990", val: "1990-07-04" },
    { label: "Mar 14, 1995", val: "1995-03-14" },
  ];

  return (
    <div className="tool-page fade-in">
      <div className="tool-page-inner">
        <h1 className="tool-title">🎂 Age Calculator</h1>
        <p className="tool-description">Find your exact age in years, months, days, and even seconds!</p>

        <div className="tool-box">
          <label className="label" htmlFor="dob-input">Your Date of Birth</label>
          <input id="dob-input" className="input-field" type="date" value={dob}
            max={new Date().toISOString().split("T")[0]}
            onChange={e => setDob(e.target.value)} />

          <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap" }}>
            {presets.map(p => (
              <button key={p.val} className="btn-secondary" style={{ fontSize: "13px", padding: "8px 12px" }}
                onClick={() => setDob(p.val)}>
                {p.label}
              </button>
            ))}
          </div>

          <button id="calc-age-btn" className="btn-primary" onClick={calculate} style={{ marginTop: "16px" }}>
            🎂 Calculate Age
          </button>
        </div>

        {result && (
          <>
            {/* Main age display */}
            <div className="result-box" style={{ marginTop: "20px", textAlign: "center" }}>
              <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>YOU ARE</p>
              <p style={{ fontSize: "36px", fontWeight: "800", color: "#a78bfa" }}>
                {result.years} <span style={{ fontSize: "20px" }}>years</span>{" "}
                {result.months} <span style={{ fontSize: "20px" }}>months</span>{" "}
                {result.days} <span style={{ fontSize: "20px" }}>days</span>
              </p>
              <p style={{ marginTop: "12px", color: "var(--success)", fontWeight: 600 }}>
                🎉 Next birthday in {result.daysUntilBday} days!
              </p>
            </div>

            {/* Detail stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginTop: "16px" }}>
              {[
                { label: "Total Days", val: result.totalDays.toLocaleString(), emoji: "📅" },
                { label: "Total Weeks", val: result.totalWeeks.toLocaleString(), emoji: "📆" },
                { label: "Total Hours", val: result.totalHours.toLocaleString(), emoji: "⏰" },
                { label: "Total Seconds", val: result.totalSeconds.toLocaleString(), emoji: "⚡" },
              ].map(s => (
                <div key={s.label} className="glass-card" style={{ padding: "16px", textAlign: "center" }}>
                  <p style={{ fontSize: "24px" }}>{s.emoji}</p>
                  <p style={{ fontSize: "18px", fontWeight: "700", color: "#a78bfa", marginTop: "4px" }}>{s.val}</p>
                  <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AgeCalculator;
