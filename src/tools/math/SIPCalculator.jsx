// ============================================================
// SIPCalculator.jsx — SIP Investment Calculator
// ============================================================
// Calculates returns on a Systematic Investment Plan (SIP)
// using compound interest formula.
// ============================================================

import { useState } from "react";

// Format a number as Indian Rupee currency
function formatINR(amount) {
  if (amount >= 10_000_000) return "₹" + (amount / 10_000_000).toFixed(2) + " Cr";
  if (amount >= 100_000) return "₹" + (amount / 100_000).toFixed(2) + " L";
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

function SIPCalculator() {
  // User inputs
  const [monthly, setMonthly] = useState(5000);       // Monthly investment in ₹
  const [rate, setRate] = useState(12);               // Expected annual return %
  const [years, setYears] = useState(10);             // Duration in years

  // SIP formula: M = P × ({[1 + i]^n – 1} / i) × (1 + i)
  // where P = monthly amount, i = monthly rate, n = total months
  const months = years * 12;
  const monthlyRate = rate / 100 / 12;
  const futureValue = monthly * (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
  const totalInvested = monthly * months;
  const totalGain = futureValue - totalInvested;
  const gainPercent = ((totalGain / totalInvested) * 100).toFixed(1);

  // Pie chart percentages for the visual bar
  const investedWidth = (totalInvested / futureValue) * 100;

  return (
    <div className="tool-page fade-in">
      <div className="tool-page-inner">

        {/* Title */}
        <h1 className="tool-title">📈 SIP Calculator</h1>
        <p className="tool-description">
          Calculate wealth from your monthly SIP investments. Adjust values to see the power of compounding.
        </p>

        {/* Input sliders */}
        <div className="tool-box">

          {/* Monthly Investment */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="label">Monthly Investment</label>
              <span style={{ color: "#a78bfa", fontWeight: "700" }}>₹{monthly.toLocaleString("en-IN")}</span>
            </div>
            <input type="range" min="500" max="100000" step="500" value={monthly}
              onChange={e => setMonthly(Number(e.target.value))} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
              <span>₹500</span><span>₹1,00,000</span>
            </div>
          </div>

          {/* Annual Return Rate */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="label">Expected Annual Return</label>
              <span style={{ color: "#a78bfa", fontWeight: "700" }}>{rate}%</span>
            </div>
            <input type="range" min="1" max="30" step="0.5" value={rate}
              onChange={e => setRate(Number(e.target.value))} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
              <span>1%</span><span>30%</span>
            </div>
          </div>

          {/* Duration */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="label">Investment Duration</label>
              <span style={{ color: "#a78bfa", fontWeight: "700" }}>{years} Years</span>
            </div>
            <input type="range" min="1" max="40" step="1" value={years}
              onChange={e => setYears(Number(e.target.value))} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
              <span>1 Year</span><span>40 Years</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="result-box" style={{ marginTop: "20px" }}>

          {/* Summary numbers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "20px", marginBottom: "24px" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>TOTAL INVESTED</p>
              <p style={{ fontSize: "20px", fontWeight: "700", color: "var(--text-primary)" }}>{formatINR(totalInvested)}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>GAINS</p>
              <p style={{ fontSize: "20px", fontWeight: "700", color: "var(--success)" }}>{formatINR(totalGain)}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>FUTURE VALUE</p>
              <p style={{ fontSize: "24px", fontWeight: "800", color: "#a78bfa" }}>{formatINR(futureValue)}</p>
            </div>
          </div>

          {/* Visual progress bar */}
          <div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>
              Return on Investment: <strong style={{ color: "var(--success)" }}>+{gainPercent}%</strong>
            </p>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "8px", height: "16px", overflow: "hidden" }}>
              <div style={{ display: "flex", height: "100%" }}>
                <div style={{ width: `${investedWidth}%`, background: "var(--secondary)", transition: "width 0.5s ease" }} />
                <div style={{ flex: 1, background: "var(--success)", transition: "all 0.5s ease" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "8px", fontSize: "12px" }}>
              <span style={{ color: "var(--secondary)" }}>● Invested</span>
              <span style={{ color: "var(--success)" }}>● Gains</span>
            </div>
          </div>
        </div>

        {/* Tip */}
        <div className="result-box" style={{ marginTop: "16px" }}>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            💡 <strong>Tip:</strong> Starting early makes a huge difference. Investing ₹5,000/month for 20 years
            at 12% gives far more than investing ₹10,000/month for 10 years!
          </p>
        </div>

      </div>
    </div>
  );
}

export default SIPCalculator;
