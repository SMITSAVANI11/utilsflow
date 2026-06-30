// GSTCalculator.jsx — Indian GST Calculator
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

const GST_RATES = [3, 5, 12, 18, 28];

function GSTCalculator() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("gst-calculator"); }, [trackTool]);

  const [amount,  setAmount]  = useState("");
  const [rate,    setRate]    = useState(18);
  const [mode,    setMode]    = useState("exclusive"); // exclusive = amount before GST, inclusive = amount includes GST
  const [copied,  setCopied]  = useState(false);

  const num = parseFloat(amount) || 0;
  let baseAmount, gstAmount, totalAmount;

  if (mode === "exclusive") {
    baseAmount  = num;
    gstAmount   = (num * rate) / 100;
    totalAmount = num + gstAmount;
  } else {
    totalAmount = num;
    baseAmount  = (num * 100) / (100 + rate);
    gstAmount   = num - baseAmount;
  }

  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  function fmt(n) { return n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function copy() {
    const text = `Base Amount: ₹${fmt(baseAmount)}\nGST (${rate}%): ₹${fmt(gstAmount)}\nCGST (${rate/2}%): ₹${fmt(cgst)}\nSGST (${rate/2}%): ₹${fmt(sgst)}\nTotal: ₹${fmt(totalAmount)}`;
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const Row = ({ label, value, highlight }) => (
    <div style={{ display:"flex", justifyContent:"space-between", padding:"12px 0", borderBottom:"1px solid var(--border)" }}>
      <span style={{ color:"var(--text-secondary)", fontSize:"14px" }}>{label}</span>
      <span style={{ fontWeight: highlight ? 700 : 600, color: highlight ? "var(--primary-light)" : "var(--text-primary)", fontSize: highlight ? "18px" : "15px", fontFamily:"JetBrains Mono, monospace" }}>₹{fmt(value)}</span>
    </div>
  );

  return (
    <div className="tool-page fade-in">
      <SEOHead title="GST Calculator" description="Calculate GST (Goods and Services Tax) for any amount. Supports all GST slabs: 3%, 5%, 12%, 18%, 28%. Free India GST calculator." path="/tools/gst-calculator" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="GST Calculator" category="Finance" categoryPath="/?cat=finance" />
        <h1 className="tool-title">📊 GST Calculator</h1>
        <p className="tool-description">Calculate Goods and Services Tax for all GST slabs. Supports both GST-exclusive and GST-inclusive amounts.</p>

        <div className="tool-box">
          {/* Mode toggle */}
          <div style={{ display:"flex",gap:"8px",marginBottom:"20px" }}>
            <button className={mode==="exclusive"?"btn-primary":"btn-secondary"} onClick={()=>setMode("exclusive")} style={{flex:1}}>Add GST to Amount</button>
            <button className={mode==="inclusive"?"btn-primary":"btn-secondary"} onClick={()=>setMode("inclusive")} style={{flex:1}}>Remove GST from Amount</button>
          </div>

          {/* Amount */}
          <div style={{ marginBottom:"16px" }}>
            <label className="label" htmlFor="gst-amount">{mode==="exclusive"?"Amount (before GST)":"Total Amount (including GST)"}</label>
            <div style={{ display:"flex",alignItems:"center",gap:"8px",background:"rgba(0,0,0,0.2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px 14px" }}>
              <span style={{ color:"var(--text-muted)",fontWeight:700 }}>₹</span>
              <input id="gst-amount" type="number" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="Enter amount" style={{flex:1,background:"none",border:"none",outline:"none",color:"var(--text-primary)",fontSize:"16px",fontFamily:"JetBrains Mono, monospace"}} />
            </div>
          </div>

          {/* GST Rate */}
          <div style={{ marginBottom:"20px" }}>
            <label className="label">GST Rate</label>
            <div style={{ display:"flex",gap:"8px",flexWrap:"wrap" }}>
              {GST_RATES.map(r=>(
                <button key={r} onClick={()=>setRate(r)} style={{ padding:"8px 18px",borderRadius:"20px",border:"1px solid var(--border)",background:rate===r?"var(--primary)":"transparent",color:rate===r?"white":"var(--text-secondary)",cursor:"pointer",fontWeight:600,fontSize:"14px",transition:"all 0.2s" }}>
                  {r}%
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          {num > 0 && (
            <div className="result-box" style={{ marginTop:0 }}>
              <Row label="Base Amount (Taxable)" value={baseAmount} />
              <Row label={`CGST @ ${rate/2}%`} value={cgst} />
              <Row label={`SGST @ ${rate/2}%`} value={sgst} />
              <Row label={`Total GST @ ${rate}%`} value={gstAmount} />
              <Row label="Total Amount (Payable)" value={totalAmount} highlight />
              <div style={{ marginTop:"12px", textAlign:"right" }}>
                <button className="btn-secondary" style={{fontSize:"13px"}} onClick={copy}>{copied?"✅ Copied!":"📋 Copy Summary"}</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default GSTCalculator;
