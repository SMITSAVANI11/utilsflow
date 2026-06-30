// ============================================================
// EMICalculator.jsx — EMI (Loan) Calculator Tool
// ============================================================
// Calculates monthly EMI, total interest and total amount
// payable for home, car or personal loans.
// ============================================================

import { useState } from "react";

// Format as Indian currency
function formatINR(amount) {
  if (amount >= 10_000_000) return "₹" + (amount / 10_000_000).toFixed(2) + " Cr";
  if (amount >= 100_000) return "₹" + (amount / 100_000).toFixed(2) + " L";
  return "₹" + Math.round(amount).toLocaleString("en-IN");
}

// Loan type presets
const LOAN_PRESETS = [
  { label: "🏠 Home Loan", amount: 3000000, rate: 8.5, years: 20 },
  { label: "🚗 Car Loan", amount: 800000, rate: 9.0, years: 5 },
  { label: "💳 Personal Loan", amount: 300000, rate: 14.0, years: 3 },
  { label: "🎓 Education Loan", amount: 500000, rate: 10.5, years: 7 },
];

function EMICalculator() {
  const [principal, setPrincipal] = useState(1000000); // Loan amount
  const [rate, setRate] = useState(8.5);               // Annual interest rate %
  const [years, setYears] = useState(10);              // Loan tenure

  // EMI formula: EMI = [P × R × (1+R)^N] / [(1+R)^N – 1]
  // where P = principal, R = monthly rate, N = total months
  const months = years * 12;
  const monthlyRate = rate / 100 / 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
              (Math.pow(1 + monthlyRate, months) - 1);
  const totalAmount = emi * months;
  const totalInterest = totalAmount - principal;
  const interestPercent = ((totalInterest / totalAmount) * 100).toFixed(1);

  return (
    <div className="tool-page fade-in">
      <div className="tool-page-inner">

        {/* Title */}
        <h1 className="tool-title">🏦 EMI Calculator</h1>
        <p className="tool-description">
          Calculate your monthly loan EMI for home, car or personal loans. Adjust values instantly.
        </p>

        {/* Quick presets */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
          {LOAN_PRESETS.map(p => (
            <button
              key={p.label}
              onClick={() => { setPrincipal(p.amount); setRate(p.rate); setYears(p.years); }}
              className="btn-secondary"
              style={{ fontSize: "13px", padding: "8px 14px" }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input sliders */}
        <div className="tool-box">

          {/* Loan Amount */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="label">Loan Amount</label>
              <span style={{ color: "#a78bfa", fontWeight: "700" }}>{formatINR(principal)}</span>
            </div>
            <input type="range" min="50000" max="10000000" step="50000" value={principal}
              onChange={e => setPrincipal(Number(e.target.value))} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
              <span>₹50K</span><span>₹1 Cr</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="label">Annual Interest Rate</label>
              <span style={{ color: "#a78bfa", fontWeight: "700" }}>{rate}%</span>
            </div>
            <input type="range" min="5" max="24" step="0.1" value={rate}
              onChange={e => setRate(Number(e.target.value))} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
              <span>5%</span><span>24%</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="label">Loan Tenure</label>
              <span style={{ color: "#a78bfa", fontWeight: "700" }}>{years} Years ({months} months)</span>
            </div>
            <input type="range" min="1" max="30" step="1" value={years}
              onChange={e => setYears(Number(e.target.value))} />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--text-secondary)" }}>
              <span>1 Year</span><span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="result-box" style={{ marginTop: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "20px", marginBottom: "20px" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>MONTHLY EMI</p>
              <p style={{ fontSize: "26px", fontWeight: "800", color: "#a78bfa" }}>{formatINR(emi)}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>TOTAL INTEREST</p>
              <p style={{ fontSize: "20px", fontWeight: "700", color: "var(--danger)" }}>{formatINR(totalInterest)}</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "var(--text-secondary)", fontSize: "12px", marginBottom: "6px" }}>TOTAL PAYABLE</p>
              <p style={{ fontSize: "20px", fontWeight: "700" }}>{formatINR(totalAmount)}</p>
            </div>
          </div>

          {/* Visual bar */}
          <div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "8px" }}>
              Interest is <strong style={{ color: "var(--danger)" }}>{interestPercent}%</strong> of total repayment
            </p>
            <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: "8px", height: "16px", overflow: "hidden" }}>
              <div style={{ display: "flex", height: "100%" }}>
                <div style={{ width: `${100 - parseFloat(interestPercent)}%`, background: "var(--secondary)", transition: "width 0.5s ease" }} />
                <div style={{ flex: 1, background: "var(--danger)" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "16px", marginTop: "8px", fontSize: "12px" }}>
              <span style={{ color: "var(--secondary)" }}>● Principal</span>
              <span style={{ color: "var(--danger)" }}>● Interest</span>
            </div>
          </div>
        </div>

        <div className="result-box" style={{ marginTop: "16px" }}>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            💡 <strong>Tip:</strong> Making even one extra EMI per year can reduce your loan tenure significantly
            and save thousands in interest payments!
          </p>
        </div>

      </div>
    </div>
  );
}

export default EMICalculator;
