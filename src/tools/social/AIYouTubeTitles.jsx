// AIYouTubeTitles.jsx — YouTube title generator
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

const FORMULAS = [
  (t,k) => `How to ${t} in 2025 (Step-by-Step)`,
  (t,k) => `${t}: Everything You Need to Know`,
  (t,k) => `I Tried ${t} for 30 Days — Here's What Happened`,
  (t,k) => `The ULTIMATE Guide to ${t} for Beginners`,
  (t,k) => `5 Mistakes Everyone Makes With ${t}`,
  (t,k) => `Why ${t} Will Change Your Life in 2025`,
  (t,k) => `${t} Tutorial for Beginners (FREE)`,
  (t,k) => `${t} vs [ALTERNATIVE] — Which is Better?`,
  (t,k) => `I Tested Every ${t} Method So You Don't Have To`,
  (t,k) => `The Truth About ${t} Nobody Tells You`,
  (t,k) => `${k ? k + " — " : ""}Complete ${t} Masterclass`,
  (t,k) => `10 ${t} Tips That Will Blow Your Mind`,
];

function AIYouTubeTitles() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("ai-youtube-titles"); }, [trackTool]);

  const [topic,   setTopic]   = useState("");
  const [keyword, setKeyword] = useState("");
  const [titles,  setTitles]  = useState([]);
  const [copied,  setCopied]  = useState(null);

  function generate() {
    if (!topic.trim()) return;
    const generated = FORMULAS.map(f => f(topic.trim(), keyword.trim()));
    setTitles(generated);
    setCopied(null);
  }

  function copy(title, i) {
    navigator.clipboard.writeText(title).catch(() => {});
    setCopied(i); setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="tool-page fade-in">
      <SEOHead title="AI YouTube Title Generator" description="Generate click-worthy YouTube titles using proven formulas. Get 12 title ideas instantly for any topic." path="/tools/ai-youtube-titles" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="AI YouTube Title Generator" category="AI Tools" categoryPath="/?cat=ai" />
        <h1 className="tool-title">🎬 AI YouTube Title Generator</h1>
        <p className="tool-description">Generate 12 click-worthy YouTube titles using proven high-CTR formulas. Enter your topic and keyword.</p>

        <div className="tool-box">
          <div style={{marginBottom:"14px"}}>
            <label className="label" htmlFor="yt-topic">Video Topic</label>
            <input id="yt-topic" className="input-field" value={topic} onChange={(e)=>setTopic(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&generate()} placeholder="e.g. React.js, Weight Loss, Investing, Photography…" />
          </div>
          <div style={{marginBottom:"20px"}}>
            <label className="label" htmlFor="yt-keyword">Target Keyword (optional)</label>
            <input id="yt-keyword" className="input-field" value={keyword} onChange={(e)=>setKeyword(e.target.value)} placeholder="e.g. for beginners, 2025, free…" />
          </div>
          <button id="generate-yt-btn" className="btn-primary" onClick={generate} style={{width:"100%"}}>🎬 Generate 12 Titles</button>
        </div>

        {titles.length > 0 && (
          <div style={{marginTop:"20px",display:"flex",flexDirection:"column",gap:"8px"}}>
            {titles.map((title, i) => (
              <div key={i} style={{display:"flex",alignItems:"center",gap:"12px",padding:"14px 16px",background:"var(--bg-card)",border:"1px solid var(--border)",borderRadius:"10px",transition:"border-color 0.2s"}}
                onMouseEnter={(e)=>e.currentTarget.style.borderColor="rgba(124,58,237,0.3)"}
                onMouseLeave={(e)=>e.currentTarget.style.borderColor="var(--border)"}>
                <span style={{fontSize:"12px",color:"var(--text-muted)",fontWeight:700,minWidth:"20px"}}>#{i+1}</span>
                <p style={{flex:1,fontSize:"14px",fontWeight:500,lineHeight:"1.4"}}>{title}</p>
                <button className="btn-secondary" style={{padding:"4px 10px",fontSize:"12px",flexShrink:0}} onClick={()=>copy(title,i)}>{copied===i?"✅":"📋"}</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AIYouTubeTitles;
