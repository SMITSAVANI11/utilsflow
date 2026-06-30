// AIPromptGenerator.jsx — Template-based AI prompt builder
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

const TEMPLATES = {
  "Write content": { prompt: "Write a [TYPE] about [TOPIC] for [AUDIENCE]. The tone should be [TONE]. Include [DETAILS]. Keep it around [LENGTH] words.", vars: ["TYPE","TOPIC","AUDIENCE","TONE","DETAILS","LENGTH"], defaults: ["blog post","artificial intelligence","tech enthusiasts","professional yet engaging","3 key points with examples","500"] },
  "Code assistant": { prompt: "Write [LANGUAGE] code that [TASK]. It should handle [EDGE_CASES]. Follow best practices and add comments. Also explain how it works.", vars: ["LANGUAGE","TASK","EDGE_CASES"], defaults: ["JavaScript","sorts an array of objects by date","null values and empty arrays"] },
  "Summarize text": { prompt: "Summarize the following text in [FORMAT]. Focus on the [FOCUS]. The summary should be suitable for [AUDIENCE].\n\nText: [TEXT]", vars: ["FORMAT","FOCUS","AUDIENCE","TEXT"], defaults: ["5 bullet points","key insights and actionable takeaways","busy professionals","Paste your text here"] },
  "Email writer": { prompt: "Write a professional email to [RECIPIENT] about [SUBJECT]. The purpose is to [PURPOSE]. The tone should be [TONE]. End with [CTA].", vars: ["RECIPIENT","SUBJECT","PURPOSE","TONE","CTA"], defaults: ["a potential client","our new product launch","introduce our services and request a meeting","friendly and confident","a clear call to action for a 15-min call"] },
  "Explain concept": { prompt: "Explain [CONCEPT] to someone who [BACKGROUND]. Use simple language, analogies, and [EXAMPLES]. Break it down step by step.", vars: ["CONCEPT","BACKGROUND","EXAMPLES"], defaults: ["machine learning","has no technical background","real-world examples like Netflix recommendations"] },
  "SEO article": { prompt: "Write an SEO-optimized article about [TOPIC] targeting the keyword '[KEYWORD]'. Include: intro, [SECTIONS] H2 sections, FAQ, and conclusion. Aim for [WORDS] words.", vars: ["TOPIC","KEYWORD","SECTIONS","WORDS"], defaults: ["remote work productivity","work from home tips","5","1500"] },
};

function AIPromptGenerator() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("ai-prompt-generator"); }, [trackTool]);

  const [selected,  setSelected]  = useState("Write content");
  const [vars,      setVars]      = useState({});
  const [output,    setOutput]    = useState("");
  const [copied,    setCopied]    = useState(false);

  const template = TEMPLATES[selected];

  useEffect(() => {
    const defaults = {};
    template.vars.forEach((v, i) => { defaults[v] = template.defaults[i] || ""; });
    setVars(defaults);
    setOutput("");
  }, [selected]);

  function generate() {
    let prompt = template.prompt;
    template.vars.forEach((v) => { prompt = prompt.replace(`[${v}]`, vars[v] || `[${v}]`); });
    setOutput(prompt);
    setCopied(false);
  }

  function copy() {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="tool-page fade-in">
      <SEOHead title="AI Prompt Generator" description="Generate optimized AI prompts for ChatGPT, Gemini, and Claude. Templates for writing, coding, email, SEO, and more." path="/tools/ai-prompt-generator" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="AI Prompt Generator" category="AI Tools" categoryPath="/?cat=ai" />
        <h1 className="tool-title">🤖 AI Prompt Generator</h1>
        <p className="tool-description">Build optimized prompts for ChatGPT, Gemini, Claude, and other AI tools. Choose a template, fill in the details, and copy your prompt.</p>

        <div className="tool-box">
          <div style={{ marginBottom:"20px" }}>
            <label className="label">Prompt Template</label>
            <div style={{ display:"flex",gap:"8px",flexWrap:"wrap" }}>
              {Object.keys(TEMPLATES).map(t=>(
                <button key={t} onClick={()=>setSelected(t)}
                  style={{ padding:"7px 14px",borderRadius:"20px",border:"1px solid var(--border)",background:selected===t?"var(--primary)":"transparent",color:selected===t?"white":"var(--text-secondary)",cursor:"pointer",fontSize:"13px",fontWeight:500,transition:"all 0.2s" }}>{t}</button>
              ))}
            </div>
          </div>

          <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"20px" }}>
            {template.vars.map((v) => (
              <div key={v}>
                <label className="label" htmlFor={`pv-${v}`}>{v.replace(/_/g," ")}</label>
                <input id={`pv-${v}`} className="input-field" value={vars[v]||""} onChange={(e)=>setVars(p=>({...p,[v]:e.target.value}))} placeholder={template.defaults[template.vars.indexOf(v)]} />
              </div>
            ))}
          </div>

          <button id="generate-prompt-btn" className="btn-primary" onClick={generate} style={{ width:"100%" }}>🤖 Generate Prompt</button>
        </div>

        {output && (
          <div className="tool-box" style={{ marginTop:"20px" }}>
            <div style={{ display:"flex",justifyContent:"space-between",marginBottom:"10px" }}>
              <p className="label" style={{ marginBottom:0 }}>Your AI Prompt</p>
              <button className="btn-secondary" style={{ padding:"4px 12px",fontSize:"12px" }} onClick={copy}>{copied?"✅ Copied!":"📋 Copy Prompt"}</button>
            </div>
            <div className="result-box" style={{ marginTop:0,lineHeight:"1.8",fontSize:"14px" }}>{output}</div>
            <p style={{ fontSize:"12px",color:"var(--text-secondary)",marginTop:"10px" }}>💡 Paste this prompt into ChatGPT, Gemini, Claude, or any AI assistant.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIPromptGenerator;
