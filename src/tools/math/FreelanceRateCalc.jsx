// FreelanceRateCalc.jsx — Calculate freelance hourly/project rate
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

function FreelanceRateCalc() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("freelance-rate-calculator"); }, [trackTool]);

  const [monthlyIncome, setMonthlyIncome] = useState(100000);
  const [workDays,      setWorkDays]      = useState(22);
  const [hoursPerDay,   setHoursPerDay]   = useState(8);
  const [vacationDays,  setVacationDays]  = useState(15);
  const [taxRate,       setTaxRate]       = useState(30);
  const [bufferPct,     setBufferPct]     = useState(20);
  const [currency,      setCurrency]      = useState("₹");

  const annualIncome     = monthlyIncome * 12;
  const effectiveWorkDays = (workDays * 12) - vacationDays;
  const billableHours    = effectiveWorkDays * hoursPerDay;
  const grossNeeded      = annualIncome / (1 - taxRate / 100);
  const withBuffer       = grossNeeded * (1 + bufferPct / 100);
  const hourlyRate       = withBuffer / billableHours;
  const dailyRate        = hourlyRate * hoursPerDay;
  const projectRate      = { small: hourlyRate * 20, medium: hourlyRate * 80, large: hourlyRate * 200 };

  function fmt(n) { return currency + Math.ceil(n).toLocaleString("en-IN"); }

  const Slider = ({ label, value, min, max, step = 1, onChange, suffix = "" }) => (
    <div style={{ marginBottom: "16px" }}>
      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"6px" }}>
        <label className="label" style={{ marginBottom:0 }}>{label}</label>
        <strong style={{ color:"var(--primary-light)", fontFamily:"JetBrains Mono, monospace" }}>{suffix.startsWith(currency) ? fmt(value) : value + suffix}</strong>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );

  return (
    <div className="tool-page fade-in">
      <SEOHead title="Freelance Rate Calculator" description="Calculate your freelance hourly and project rates based on your income goals, tax rate, and work hours." path="/tools/freelance-rate-calculator" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="Freelance Rate Calculator" category="Finance" categoryPath="/?cat=finance" />
        <h1 className="tool-title">💼 Freelance Rate Calculator</h1>
        <p className="tool-description">Figure out exactly what to charge clients based on your income goals, taxes, and working hours.</p>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"20px" }}>
          <div className="tool-box">
            <div style={{ display:"flex",gap:"8px",marginBottom:"20px" }}>
              {["₹","$","€","£"].map(c=>(
                <button key={c} onClick={()=>setCurrency(c)} style={{ padding:"6px 14px",borderRadius:"8px",border:"1px solid var(--border)",background:currency===c?"var(--primary)":"transparent",color:currency===c?"white":"var(--text-secondary)",cursor:"pointer",fontWeight:700,fontSize:"16px",transition:"all 0.2s" }}>{c}</button>
              ))}
            </div>
            <Slider label="Target Monthly Income" value={monthlyIncome} min={10000} max={1000000} step={5000} onChange={setMonthlyIncome} suffix={currency} />
            <Slider label="Work Days per Month" value={workDays} min={10} max={26} onChange={setWorkDays} suffix=" days" />
            <Slider label="Hours per Day" value={hoursPerDay} min={4} max={12} onChange={setHoursPerDay} suffix=" hrs" />
            <Slider label="Vacation Days per Year" value={vacationDays} min={0} max={60} onChange={setVacationDays} suffix=" days" />
            <Slider label="Tax Rate" value={taxRate} min={0} max={50} onChange={setTaxRate} suffix="%" />
            <Slider label="Buffer (non-billable time)" value={bufferPct} min={0} max={50} onChange={setBufferPct} suffix="%" />
          </div>

          <div>
            <div className="result-box" style={{ marginTop:0, marginBottom:"16px" }}>
              <p style={{ fontSize:"13px",color:"var(--text-secondary)",marginBottom:"16px" }}>Recommended Rates</p>
              {[
                { label:"⏱ Hourly Rate",  value: fmt(hourlyRate) },
                { label:"📅 Daily Rate",   value: fmt(dailyRate) },
                { label:"📦 Small Project (20h)", value: fmt(projectRate.small) },
                { label:"🏗 Medium Project (80h)", value: fmt(projectRate.medium) },
                { label:"🚀 Large Project (200h)", value: fmt(projectRate.large) },
              ].map(({ label, value }) => (
                <div key={label} style={{ display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid var(--border)" }}>
                  <span style={{ color:"var(--text-secondary)",fontSize:"14px" }}>{label}</span>
                  <strong style={{ fontFamily:"JetBrains Mono, monospace",color:"var(--primary-light)" }}>{value}</strong>
                </div>
              ))}
            </div>

            <div className="tool-box" style={{ fontSize:"13px" }}>
              <p className="label">Breakdown</p>
              <p style={{ color:"var(--text-secondary)",lineHeight:"1.8" }}>
                Annual target: <strong>{fmt(annualIncome)}</strong><br />
                Billable hours/year: <strong>{billableHours}</strong><br />
                Gross needed (after tax): <strong>{fmt(grossNeeded)}</strong><br />
                With {bufferPct}% buffer: <strong>{fmt(withBuffer)}</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelanceRateCalc;
