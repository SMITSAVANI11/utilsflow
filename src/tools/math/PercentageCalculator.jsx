import { useState } from "react";
import ToolLayout from "../../components/ToolLayout";

function PercentageCalculator() {
  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState("15");
  const [m1Y, setM1Y] = useState("200");
  const m1Result = ((parseFloat(m1X) / 100) * parseFloat(m1Y)) || 0;

  // Mode 2: X is what percent of Y?
  const [m2X, setM2X] = useState("30");
  const [m2Y, setM2Y] = useState("150");
  const m2Result = ((parseFloat(m2X) / parseFloat(m2Y)) * 100) || 0;

  // Mode 3: Percentage increase/decrease from X to Y?
  const [m3X, setM3X] = useState("100");
  const [m3Y, setM3Y] = useState("150");
  const m3Diff = parseFloat(m3Y) - parseFloat(m3X);
  const m3Result = ((m3Diff / Math.abs(parseFloat(m3X))) * 100) || 0;

  // Mode 4: Add/Subtract X% to/from Y?
  const [m4X, setM4X] = useState("10");
  const [m4Y, setM4Y] = useState("200");
  const [m4Op, setM4Op] = useState("add");
  const m4Factor = parseFloat(m4X) / 100;
  const m4Result = m4Op === "add" 
    ? parseFloat(m4Y) * (1 + m4Factor)
    : parseFloat(m4Y) * (1 - m4Factor);

  return (
    <ToolLayout
      toolId="percentage-calculator"
      title="Percentage Calculator"
      description="Calculate percentages, value proportions, percent changes (increase/decrease), and markup adjustments client-side."
      path="/tools/percentage-calculator"
      category="math"
      categoryPath="/?cat=math"
    >
      <div className="tool-box" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* Module 1 */}
        <div style={{ padding: "16px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <h4 style={{ color: "var(--primary-light)", fontSize: "14px", marginBottom: "12px", fontWeight: "bold" }}>
            📈 1. Find Percentage Value
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span>What is</span>
            <input type="number" className="input-field" style={{ width: "80px", display: "inline-block" }} value={m1X} onChange={e => setM1X(e.target.value)} />
            <span>% of</span>
            <input type="number" className="input-field" style={{ width: "100px", display: "inline-block" }} value={m1Y} onChange={e => setM1Y(e.target.value)} />
            <span>?</span>
          </div>
          <div style={{ marginTop: "12px", fontSize: "15px", fontWeight: "bold" }}>
            Result: <span style={{ color: "var(--primary-light)" }}>{m1Result.toFixed(2).replace(/\.00$/, "")}</span>
          </div>
        </div>

        {/* Module 2 */}
        <div style={{ padding: "16px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <h4 style={{ color: "var(--primary-light)", fontSize: "14px", marginBottom: "12px", fontWeight: "bold" }}>
            📊 2. Find Percentage Proportion
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <input type="number" className="input-field" style={{ width: "90px", display: "inline-block" }} value={m2X} onChange={e => setM2X(e.target.value)} />
            <span>is what percent of</span>
            <input type="number" className="input-field" style={{ width: "100px", display: "inline-block" }} value={m2Y} onChange={e => setM2Y(e.target.value)} />
            <span>?</span>
          </div>
          <div style={{ marginTop: "12px", fontSize: "15px", fontWeight: "bold" }}>
            Result: <span style={{ color: "var(--primary-light)" }}>{m2Result.toFixed(2).replace(/\.00$/, "")}%</span>
          </div>
        </div>

        {/* Module 3 */}
        <div style={{ padding: "16px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <h4 style={{ color: "var(--primary-light)", fontSize: "14px", marginBottom: "12px", fontWeight: "bold" }}>
            🔄 3. Percentage Increase / Decrease
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span>Find percentage change from</span>
            <input type="number" className="input-field" style={{ width: "100px", display: "inline-block" }} value={m3X} onChange={e => setM3X(e.target.value)} />
            <span>to</span>
            <input type="number" className="input-field" style={{ width: "100px", display: "inline-block" }} value={m3Y} onChange={e => setM3Y(e.target.value)} />
          </div>
          <div style={{ marginTop: "12px", fontSize: "15px", fontWeight: "bold" }}>
            Result:{" "}
            <span style={{ color: m3Result >= 0 ? "#81c784" : "#ef5350" }}>
              {m3Result >= 0 ? "📈 Increase of " : "📉 Decrease of "}
              {Math.abs(m3Result).toFixed(2).replace(/\.00$/, "")}%
            </span>
          </div>
        </div>

        {/* Module 4 */}
        <div style={{ padding: "16px", background: "rgba(255, 255, 255, 0.02)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <h4 style={{ color: "var(--primary-light)", fontSize: "14px", marginBottom: "12px", fontWeight: "bold" }}>
            🛠️ 4. Add / Subtract Percentage
          </h4>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <select className="input-field" style={{ width: "110px", display: "inline-block" }} value={m4Op} onChange={e => setM4Op(e.target.value)}>
              <option value="add">Add</option>
              <option value="sub">Subtract</option>
            </select>
            <input type="number" className="input-field" style={{ width: "80px", display: "inline-block" }} value={m4X} onChange={e => setM4X(e.target.value)} />
            <span>% of value to / from</span>
            <input type="number" className="input-field" style={{ width: "100px", display: "inline-block" }} value={m4Y} onChange={e => setM4Y(e.target.value)} />
          </div>
          <div style={{ marginTop: "12px", fontSize: "15px", fontWeight: "bold" }}>
            Result: <span style={{ color: "var(--primary-light)" }}>{m4Result.toFixed(2).replace(/\.00$/, "")}</span>
          </div>
        </div>

      </div>
    </ToolLayout>
  );
}

export default PercentageCalculator;
