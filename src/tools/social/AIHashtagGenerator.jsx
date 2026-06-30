// AIHashtagGenerator.jsx — Hashtag generator based on keywords
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

const PLATFORM_SETS = {
  Instagram: { max:30, popular: ["instagood","photooftheday","love","follow","instagram","style","trending","viral","reels","explore"] },
  Twitter:   { max:3,  popular: ["trending","viral","thread","news","tips"] },
  LinkedIn:  { max:5,  popular: ["leadership","growth","career","networking","professional"] },
  YouTube:   { max:15, popular: ["shorts","viral","trending","tutorial","howto"] },
  TikTok:    { max:10, popular: ["fyp","foryou","viral","trending","tiktok"] },
};

function generateHashtags(keyword, platform) {
  const base = keyword.toLowerCase().replace(/\s+/g,"");
  const words = keyword.toLowerCase().split(/\s+/);
  const plat = PLATFORM_SETS[platform];
  const tags = new Set();
  tags.add(base);
  words.forEach(w=>{ if(w.length>2) tags.add(w); });
  tags.add(`${base}tips`);
  tags.add(`${base}community`);
  tags.add(`${base}life`);
  tags.add(`best${base}`);
  tags.add(`${base}expert`);
  plat.popular.slice(0, Math.min(plat.max - tags.size, plat.popular.length)).forEach(t=>tags.add(t));
  return [...tags].slice(0, plat.max).map(t=>`#${t}`);
}

function AIHashtagGenerator() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("ai-hashtag-generator"); }, [trackTool]);

  const [keyword,  setKeyword]  = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [hashtags, setHashtags] = useState([]);
  const [copied,   setCopied]   = useState(false);

  function generate() {
    if (!keyword.trim()) return;
    setHashtags(generateHashtags(keyword.trim(), platform));
    setCopied(false);
  }

  function copy() {
    navigator.clipboard.writeText(hashtags.join(" ")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="tool-page fade-in">
      <SEOHead title="AI Hashtag Generator" description="Generate relevant hashtags for Instagram, Twitter, LinkedIn, YouTube, and TikTok based on your keywords." path="/tools/ai-hashtag-generator" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="AI Hashtag Generator" category="AI Tools" categoryPath="/?cat=ai" />
        <h1 className="tool-title">#️⃣ AI Hashtag Generator</h1>
        <p className="tool-description">Generate platform-optimized hashtags for Instagram, Twitter, LinkedIn, YouTube, and TikTok.</p>

        <div className="tool-box">
          <div style={{ marginBottom:"16px" }}>
            <label className="label" htmlFor="hashtag-keyword">Topic or Keyword</label>
            <input id="hashtag-keyword" className="input-field" value={keyword} onChange={(e)=>setKeyword(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&generate()} placeholder="e.g. fitness, travel photography, web development…" />
          </div>

          <div style={{ marginBottom:"20px" }}>
            <label className="label">Platform</label>
            <div style={{ display:"flex",gap:"8px",flexWrap:"wrap" }}>
              {Object.keys(PLATFORM_SETS).map(p=>(
                <button key={p} onClick={()=>setPlatform(p)} style={{ padding:"7px 16px",borderRadius:"20px",border:"1px solid var(--border)",background:platform===p?"var(--primary)":"transparent",color:platform===p?"white":"var(--text-secondary)",cursor:"pointer",fontSize:"13px",fontWeight:500,transition:"all 0.2s" }}>
                  {p}
                </button>
              ))}
            </div>
            <p style={{ fontSize:"12px",color:"var(--text-muted)",marginTop:"6px" }}>Max {PLATFORM_SETS[platform].max} hashtags for {platform}</p>
          </div>

          <button id="generate-hashtag-btn" className="btn-primary" onClick={generate} style={{ width:"100%" }}>
            #️⃣ Generate Hashtags
          </button>
        </div>

        {hashtags.length > 0 && (
          <div className="tool-box" style={{ marginTop:"20px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"14px" }}>
              <p className="label" style={{ marginBottom:0 }}>{hashtags.length} Hashtags for {platform}</p>
              <button className="btn-secondary" style={{ padding:"4px 12px",fontSize:"12px" }} onClick={copy}>{copied?"✅ Copied!":"📋 Copy All"}</button>
            </div>
            <div style={{ display:"flex",flexWrap:"wrap",gap:"8px" }}>
              {hashtags.map(tag=>(
                <span key={tag} onClick={()=>{ navigator.clipboard.writeText(tag).catch(()=>{}); }}
                  style={{ padding:"6px 14px",borderRadius:"20px",background:"rgba(124,58,237,0.12)",border:"1px solid rgba(124,58,237,0.2)",color:"var(--primary-light)",fontSize:"13px",fontWeight:500,cursor:"pointer",transition:"all 0.2s" }}
                  title="Click to copy">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIHashtagGenerator;
