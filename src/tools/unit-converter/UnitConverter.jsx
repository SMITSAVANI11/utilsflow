// UnitConverter.jsx — Length, Weight, Temperature, Speed, Area
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

const CATEGORIES = {
  Length: {
    units: ["m","km","cm","mm","mile","yard","foot","inch"],
    toBase: { m:1,km:1000,cm:0.01,mm:0.001,mile:1609.344,yard:0.9144,foot:0.3048,inch:0.0254 },
  },
  Weight: {
    units: ["kg","g","mg","lb","oz","ton"],
    toBase: { kg:1,g:0.001,mg:0.000001,lb:0.453592,oz:0.0283495,ton:1000 },
  },
  Temperature: {
    units: ["°C","°F","K"],
    toBase: null, // special handling
  },
  Speed: {
    units: ["m/s","km/h","mph","knot"],
    toBase: { "m/s":1,"km/h":0.277778,"mph":0.44704,"knot":0.514444 },
  },
  Area: {
    units: ["m²","km²","cm²","ft²","acre","hectare"],
    toBase: { "m²":1,"km²":1e6,"cm²":0.0001,"ft²":0.092903,"acre":4046.86,"hectare":10000 },
  },
};

function convertTemp(value, from, to) {
  let celsius;
  if (from === "°C") celsius = value;
  else if (from === "°F") celsius = (value - 32) * 5/9;
  else celsius = value - 273.15;
  if (to === "°C") return celsius;
  if (to === "°F") return celsius * 9/5 + 32;
  return celsius + 273.15;
}

function UnitConverter() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("unit-converter"); }, [trackTool]);

  const [category, setCategory] = useState("Length");
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit,   setToUnit]   = useState("km");
  const [value,    setValue]    = useState("1");
  const [result,   setResult]   = useState("");

  const cat = CATEGORIES[category];
  useEffect(() => { setFromUnit(cat.units[0]); setToUnit(cat.units[1]); setResult(""); }, [category]);

  function convert() {
    const n = parseFloat(value);
    if (isNaN(n)) { setResult(""); return; }
    if (category === "Temperature") {
      setResult(convertTemp(n, fromUnit, toUnit).toFixed(4));
    } else {
      const base = n * cat.toBase[fromUnit];
      setResult((base / cat.toBase[toUnit]).toFixed(6).replace(/\.?0+$/, ""));
    }
  }

  function swap() { const tmp = fromUnit; setFromUnit(toUnit); setToUnit(tmp); setResult(""); }

  return (
    <div className="tool-page fade-in">
      <SEOHead title="Unit Converter" description="Convert length, weight, temperature, speed, and area units instantly. Free online unit converter." path="/tools/unit-converter" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="Unit Converter" category="Productivity" categoryPath="/?cat=productivity" />
        <h1 className="tool-title">📏 Unit Converter</h1>
        <p className="tool-description">Convert between units of length, weight, temperature, speed, and area.</p>

        <div className="tool-box">
          {/* Category */}
          <div style={{ display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"20px" }}>
            {Object.keys(CATEGORIES).map(c=>(
              <button key={c} onClick={()=>setCategory(c)} style={{ padding:"7px 16px",borderRadius:"20px",border:"1px solid var(--border)",background:category===c?"var(--primary)":"transparent",color:category===c?"white":"var(--text-secondary)",cursor:"pointer",fontWeight:600,fontSize:"13px",transition:"all 0.2s" }}>{c}</button>
            ))}
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:"12px",alignItems:"flex-end",marginBottom:"20px" }}>
            <div>
              <label className="label" htmlFor="from-unit">From</label>
              <select id="from-unit" className="input-field" value={fromUnit} onChange={(e)=>setFromUnit(e.target.value)}>
                {cat.units.map(u=><option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            <button onClick={swap} style={{ background:"none",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px",cursor:"pointer",color:"var(--text-secondary)",fontSize:"18px",transition:"all 0.2s" }} title="Swap units">⇄</button>
            <div>
              <label className="label" htmlFor="to-unit">To</label>
              <select id="to-unit" className="input-field" value={toUnit} onChange={(e)=>setToUnit(e.target.value)}>
                {cat.units.map(u=><option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          <div style={{ marginBottom:"16px" }}>
            <label className="label" htmlFor="unit-value">Value</label>
            <input id="unit-value" className="input-field" type="number" value={value} onChange={(e)=>setValue(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&convert()} placeholder="Enter value…" style={{ fontFamily:"JetBrains Mono, monospace",fontSize:"16px" }} />
          </div>

          <button id="convert-unit-btn" className="btn-primary" onClick={convert} style={{ width:"100%" }}>📏 Convert</button>

          {result !== "" && (
            <div className="result-box" style={{ marginTop:"16px",textAlign:"center" }}>
              <p style={{ fontSize:"13px",color:"var(--text-secondary)",marginBottom:"6px" }}>{value} {fromUnit} =</p>
              <p style={{ fontSize:"28px",fontWeight:700,color:"var(--primary-light)",fontFamily:"JetBrains Mono, monospace" }}>{result} {toUnit}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UnitConverter;
