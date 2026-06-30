// ColorConverter.jsx — HEX ↔ RGB ↔ HSL
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return { r, g, b };
}
function rgbToHex(r,g,b) { return `#${[r,g,b].map(v=>v.toString(16).padStart(2,"0")).join("")}`; }
function rgbToHsl(r,g,b) {
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h,s,l=(max+min)/2;
  if(max===min){h=s=0;}else{
    const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){case r:h=((g-b)/d+(g<b?6:0))/6;break;case g:h=((b-r)/d+2)/6;break;default:h=((r-g)/d+4)/6;}
  }
  return { h:Math.round(h*360), s:Math.round(s*100), l:Math.round(l*100) };
}
function hslToRgb(h,s,l) {
  s/=100; l/=100;
  const k=n=>(n+h/30)%12, a=s*Math.min(l,1-l);
  const f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
  return { r:Math.round(f(0)*255), g:Math.round(f(8)*255), b:Math.round(f(4)*255) };
}

function ColorConverter() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("color-converter"); }, [trackTool]);

  const [hex, setHex] = useState("#7c3aed");
  const [rgb, setRgb] = useState({ r:124, g:58, b:237 });
  const [hsl, setHsl] = useState({ h:263, s:77, l:58 });
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState("");

  function fromHex(v) {
    setError(""); setHex(v);
    if(/^#[0-9a-fA-F]{6}$/.test(v)) {
      const r2=hexToRgb(v); setRgb(r2); setHsl(rgbToHsl(r2.r,r2.g,r2.b));
    }
  }
  function fromRgb(field, val) {
    const n=Number(val); if(isNaN(n)||n<0||n>255){setError("RGB values: 0–255");return;}
    setError(""); const r2={...rgb,[field]:n}; setRgb(r2);
    setHex(rgbToHex(r2.r,r2.g,r2.b)); setHsl(rgbToHsl(r2.r,r2.g,r2.b));
  }
  function fromHsl(field, val) {
    const n=Number(val); const r2={...hsl,[field]:n}; setHsl(r2);
    const rgb2=hslToRgb(r2.h,r2.s,r2.l); setRgb(rgb2); setHex(rgbToHex(rgb2.r,rgb2.g,rgb2.b));
  }
  function copy(text, id) { navigator.clipboard.writeText(text).catch(()=>{}); setCopied(id); setTimeout(()=>setCopied(null),1500); }

  const hexStr = hex; const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`; const hslStr = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return (
    <div className="tool-page fade-in">
      <SEOHead title="Color Converter — HEX, RGB, HSL" description="Convert colors between HEX, RGB, and HSL formats instantly. Live color preview. Free tool." path="/tools/color-converter" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="Color Converter" category="Creative" categoryPath="/?cat=creative" />
        <h1 className="tool-title">🎨 Color Converter</h1>
        <p className="tool-description">Convert colors between HEX, RGB, and HSL formats with a live preview.</p>

        {/* Preview */}
        <div style={{ width:"100%", height:"120px", background:hex, borderRadius:"16px", marginBottom:"24px", boxShadow:"0 8px 30px rgba(0,0,0,0.3)", transition:"background 0.3s ease", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ fontWeight:700, fontSize:"18px", color: hsl.l > 50 ? "#000" : "#fff", fontFamily:"JetBrains Mono, monospace" }}>{hex.toUpperCase()}</span>
        </div>

        {error && <p role="alert" style={{color:"var(--danger)",marginBottom:"12px",fontSize:"14px"}}>⚠️ {error}</p>}

        <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
          {/* HEX */}
          <div className="tool-box">
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"8px" }}>
              <label className="label" style={{marginBottom:0}}>HEX</label>
              <button className="btn-secondary" style={{padding:"3px 10px",fontSize:"12px"}} onClick={()=>copy(hexStr,"hex")}>{copied==="hex"?"✅":"📋"}</button>
            </div>
            <div style={{ display:"flex",alignItems:"center",gap:"10px" }}>
              <input type="color" value={hex} onChange={(e)=>fromHex(e.target.value)} style={{width:"48px",height:"42px",border:"none",borderRadius:"8px",cursor:"pointer"}} />
              <input className="input-field" value={hex} onChange={(e)=>fromHex(e.target.value)} style={{fontFamily:"JetBrains Mono, monospace",letterSpacing:"1px"}} maxLength={7} />
            </div>
          </div>

          {/* RGB */}
          <div className="tool-box">
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>
              <label className="label" style={{marginBottom:0}}>RGB</label>
              <button className="btn-secondary" style={{padding:"3px 10px",fontSize:"12px"}} onClick={()=>copy(rgbStr,"rgb")}>{copied==="rgb"?"✅":"📋"}</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
              {["r","g","b"].map(f=>(
                <div key={f}><label className="label" style={{marginBottom:"4px"}}>{f.toUpperCase()}</label>
                  <input className="input-field" type="number" min={0} max={255} value={rgb[f]} onChange={(e)=>fromRgb(f,e.target.value)} style={{fontFamily:"JetBrains Mono, monospace"}} /></div>
              ))}
            </div>
          </div>

          {/* HSL */}
          <div className="tool-box">
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"8px"}}>
              <label className="label" style={{marginBottom:0}}>HSL</label>
              <button className="btn-secondary" style={{padding:"3px 10px",fontSize:"12px"}} onClick={()=>copy(hslStr,"hsl")}>{copied==="hsl"?"✅":"📋"}</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"10px"}}>
              {[{f:"h",max:360,unit:"°"},{f:"s",max:100,unit:"%"},{f:"l",max:100,unit:"%"}].map(({f,max,unit})=>(
                <div key={f}><label className="label" style={{marginBottom:"4px"}}>{f.toUpperCase()} {unit}</label>
                  <input className="input-field" type="number" min={0} max={max} value={hsl[f]} onChange={(e)=>fromHsl(f,Number(e.target.value))} style={{fontFamily:"JetBrains Mono, monospace"}} /></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorConverter;
