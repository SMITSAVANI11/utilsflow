// ============================================================
// TipCalculator.jsx — Restaurant Tip Calculator
// ============================================================
import { useState } from "react";

const TIP_PRESETS = [10, 15, 18, 20, 25];

function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState(15);
  const [customTip, setCustomTip] = useState("");
  const [splits, setSplits] = useState(1);

  const billAmt = parseFloat(bill) || 0;
  const activeTip = customTip !== "" ? parseFloat(customTip) || 0 : tipPercent;
  const tipAmount = (billAmt * activeTip) / 100;
  const total = billAmt + tipAmount;
  const perPerson = splits > 0 ? total / splits : total;

  return (
    <div className="tool-page fade-in">
      <div className="tool-page-inner">
        <h1 className="tool-title">🍽️ Tip Calculator</h1>
        <p className="tool-description">Calculate the perfect tip and split bills at restaurants.</p>

        <div className="tool-box">
          {/* Bill amount */}
          <label className="label" htmlFor="bill-amount">Bill Amount (₹)</label>
          <input id="bill-amount" className="input-field" type="number" placeholder="Enter bill total..." value={bill} onChange={e => setBill(e.target.value)} />

          {/* Tip preset buttons */}
          <label className="label" style={{ marginTop: "20px" }}>Select Tip %</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "8px" }}>
            {TIP_PRESETS.map(t => (
              <button key={t} onClick={() => { setTipPercent(t); setCustomTip(""); }}
                style={{
                  padding: "10px 18px", borderRadius: "8px", border: "1px solid",
                  borderColor: activeTip === t && customTip === "" ? "var(--primary)" : "var(--border)",
                  background: activeTip === t && customTip === "" ? "rgba(124,58,237,0.2)" : "var(--bg-card)",
                  color: "var(--text-primary)", cursor: "pointer", fontWeight: 600, transition: "all 0.2s"
                }}>
                {t}%
              </button>
            ))}
            <input className="input-field" type="number" placeholder="Custom %" value={customTip}
              onChange={e => setCustomTip(e.target.value)}
              style={{ width: "100px" }} />
          </div>

          {/* Number of people */}
          <div style={{ marginTop: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <label className="label">Split Between</label>
              <span style={{ color: "#a78bfa", fontWeight: 700 }}>{splits} {splits === 1 ? "person" : "people"}</span>
            </div>
            <input type="range" min="1" max="20" value={splits} onChange={e => setSplits(Number(e.target.value))} />
          </div>
        </div>

        {/* Results */}
        <div className="result-box" style={{ marginTop: "20px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "16px" }}>
            {[
              { label: "BILL", val: `₹${billAmt.toFixed(2)}`, color: "var(--text-primary)" },
              { label: `TIP (${activeTip}%)`, val: `₹${tipAmount.toFixed(2)}`, color: "var(--warning)" },
              { label: "TOTAL", val: `₹${total.toFixed(2)}`, color: "#a78bfa" },
              { label: "PER PERSON", val: `₹${perPerson.toFixed(2)}`, color: "var(--success)" },
            ].map(r => (
              <div key={r.label} style={{ textAlign: "center" }}>
                <p style={{ color: "var(--text-secondary)", fontSize: "11px", marginBottom: "6px" }}>{r.label}</p>
                <p style={{ fontSize: "22px", fontWeight: "800", color: r.color }}>{r.val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="result-box" style={{ marginTop: "16px" }}>
          <p style={{ color: "#94a3b8", fontSize: "14px" }}>
            💡 <strong>Tip:</strong> 15–20% is standard in restaurants. Tip extra for exceptional service!
          </p>
        </div>
      </div>
    </div>
  );
}

export default TipCalculator;
