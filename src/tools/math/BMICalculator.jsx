// BMICalculator.jsx
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

function BMICalculator() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("bmi-calculator"); }, [trackTool]);

  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [unit,   setUnit]   = useState("metric");

  let bmi = null;
  if (weight && height) {
    const w = parseFloat(weight), h = parseFloat(height);
    if (!isNaN(w) && !isNaN(h) && h > 0) {
      if (unit === "metric") {
        bmi = w / ((h / 100) ** 2);
      } else {
        bmi = (703 * w) / (h ** 2);
      }
    }
  }

  function getCategory(bmi) {
    if (bmi < 18.5) return { label:"Underweight", color:"#3b82f6" };
    if (bmi < 25)   return { label:"Normal weight", color:"#10b981" };
    if (bmi < 30)   return { label:"Overweight", color:"#f59e0b" };
    return               { label:"Obese", color:"#ef4444" };
  }

  const category = bmi ? getCategory(bmi) : null;
  const bmiPercent = bmi ? Math.min((bmi / 40) * 100, 100) : 0;

  return (
    <div className="tool-page fade-in">
      <SEOHead title="BMI Calculator" description="Calculate your Body Mass Index (BMI) with metric or imperial units. Free health calculator." path="/tools/bmi-calculator" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="BMI Calculator" category="Productivity" categoryPath="/?cat=productivity" />
        <h1 className="tool-title">⚖️ BMI Calculator</h1>
        <p className="tool-description">Calculate your Body Mass Index. BMI is a simple measure using height and weight. Supports metric and imperial units.</p>

        <div className="tool-box">
          {/* Unit toggle */}
          <div style={{ display:"flex",gap:"8px",marginBottom:"20px" }}>
            {["metric","imperial"].map(u=>(
              <button key={u} className={unit===u?"btn-primary":"btn-secondary"} onClick={()=>{setUnit(u);setWeight("");setHeight("");}} style={{flex:1,textTransform:"capitalize"}}>{u==="metric"?"🌍 Metric (kg/cm)":"🇺🇸 Imperial (lb/in)"}</button>
            ))}
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px",marginBottom:"20px" }}>
            <div>
              <label className="label" htmlFor="bmi-weight">Weight ({unit==="metric"?"kg":"lbs"})</label>
              <input id="bmi-weight" className="input-field" type="number" value={weight} onChange={(e)=>setWeight(e.target.value)} placeholder={unit==="metric"?"70":"154"} />
            </div>
            <div>
              <label className="label" htmlFor="bmi-height">Height ({unit==="metric"?"cm":"inches"})</label>
              <input id="bmi-height" className="input-field" type="number" value={height} onChange={(e)=>setHeight(e.target.value)} placeholder={unit==="metric"?"175":"69"} />
            </div>
          </div>

          {bmi && category && (
            <div className="result-box">
              <div style={{ textAlign:"center",marginBottom:"16px" }}>
                <p style={{ fontSize:"13px",color:"var(--text-secondary)",marginBottom:"4px" }}>Your BMI</p>
                <p style={{ fontSize:"44px",fontWeight:800,color:category.color,fontFamily:"JetBrains Mono, monospace",lineHeight:1 }}>{bmi.toFixed(1)}</p>
                <p style={{ fontSize:"16px",fontWeight:600,color:category.color,marginTop:"6px" }}>{category.label}</p>
              </div>
              {/* BMI gauge */}
              <div style={{ height:"12px",borderRadius:"6px",overflow:"hidden",background:"linear-gradient(to right, #3b82f6 18.5%, #10b981 25%, #f59e0b 30%, #ef4444 40%)",marginBottom:"16px",position:"relative" }}>
                <div style={{ position:"absolute",top:"-4px",left:`${bmiPercent}%`,width:"20px",height:"20px",background:"white",borderRadius:"50%",border:`3px solid ${category.color}`,transform:"translateX(-50%)",boxShadow:"0 2px 6px rgba(0,0,0,0.3)" }} />
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"8px",textAlign:"center" }}>
                {[{label:"Underweight",range:"<18.5",c:"#3b82f6"},{label:"Normal",range:"18.5–24.9",c:"#10b981"},{label:"Overweight",range:"25–29.9",c:"#f59e0b"},{label:"Obese",range:"≥30",c:"#ef4444"}].map(s=>(
                  <div key={s.label} style={{ padding:"8px 4px",borderRadius:"8px",background:`${s.c}1a`,border:`1px solid ${s.c}33` }}>
                    <p style={{ fontSize:"10px",color:s.c,fontWeight:700 }}>{s.label}</p>
                    <p style={{ fontSize:"11px",color:"var(--text-secondary)" }}>{s.range}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="result-box" style={{marginTop:"16px"}}>
          <p style={{fontSize:"13px",color:"var(--text-secondary)"}}>⚠️ BMI is a general indicator and does not account for muscle mass, age, or other health factors. Consult a healthcare professional for personalized advice.</p>
        </div>
      </div>
    </div>
  );
}

export default BMICalculator;
