// AIEmailWriter.jsx — Template-based professional email writer
import { useState, useEffect } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

const TONES = ["Professional","Friendly","Formal","Casual","Urgent","Persuasive"];

const buildEmail = (type, f) => {
  const n = f.name || "[YOUR_NAME]", t = f.topic || "[TOPIC]", v = f.value || "[KEY_POINT]", g = f.goal || "[GOAL]", s = f.skill || "[SKILL]";
  const emails = {
    "Cold Outreach": `Hi [NAME],\n\nMy name is ${n}, and I specialize in ${s}.\n\nI came across your company and was impressed by [SPECIFIC_DETAIL]. I believe I can help you ${g}.\n\nI'd love a 15-minute call. Would [DATE/TIME] work?\n\nBest regards,\n${n}`,
    "Follow Up": `Hi [NAME],\n\nFollowing up on my previous email about ${t}.\n\n${v}\n\nDo you have 10 minutes this week?\n\nLooking forward to hearing from you,\n${n}`,
    "Thank You": `Hi [NAME],\n\nThank you for speaking with me about ${t}. I enjoyed our conversation.\n\nI'm particularly excited about ${v}. My background in ${s} aligns well.\n\nLooking forward to next steps.\n\nWarm regards,\n${n}`,
    "Request": `Hi [NAME],\n\nI'm writing to request ${t}.\n\nReason: ${v}. This will help me ${g}.\n\nCould you respond by [DEADLINE]?\n\nThank you,\n${n}`,
    "Apology": `Hi [NAME],\n\nI sincerely apologize for ${t}. I take full responsibility.\n\nTo resolve this: ${v}. I am committed to ensuring ${g}.\n\nSorry for the inconvenience.\n\nSincerely,\n${n}`,
  };
  return emails[type] || emails["Cold Outreach"];
};

function AIEmailWriter() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("ai-email-writer"); }, [trackTool]);

  const [emailType, setEmailType] = useState("Cold Outreach");
  const [tone, setTone] = useState("Professional");
  const [fields, setFields] = useState({ name:"", topic:"", value:"", goal:"", skill:"" });
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  function generate() {
    let body = buildEmail(emailType, fields);
    if (tone === "Casual") body = body.replace(/I am /g,"I'm ").replace(/You are /g,"You're ");
    setOutput(body); setCopied(false);
  }

  function copy() {
    navigator.clipboard.writeText(output).catch(() => {});
    setCopied(true); setTimeout(() => setCopied(false), 1500);
  }

  const F = ({ id, label, placeholder }) => (
    <div><label className="label" htmlFor={id}>{label}</label>
      <input id={id} className="input-field" value={fields[id]} onChange={(e)=>setFields(p=>({...p,[id]:e.target.value}))} placeholder={placeholder} /></div>
  );

  return (
    <div className="tool-page fade-in">
      <SEOHead title="AI Email Writer" description="Generate professional emails for cold outreach, follow-ups, and more. Free AI email writing tool." path="/tools/ai-email-writer" />
      <div className="tool-page-inner">
        <Breadcrumb toolName="AI Email Writer" category="AI Tools" categoryPath="/?cat=ai" />
        <h1 className="tool-title">📧 AI Email Writer</h1>
        <p className="tool-description">Generate professional emails in seconds. Choose a template, fill details, copy and send.</p>

        <div className="tool-box">
          <div style={{marginBottom:"14px"}}>
            <label className="label">Email Type</label>
            <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
              {["Cold Outreach","Follow Up","Thank You","Request","Apology"].map(t=>(
                <button key={t} onClick={()=>setEmailType(t)} style={{padding:"7px 14px",borderRadius:"20px",border:"1px solid var(--border)",background:emailType===t?"var(--primary)":"transparent",color:emailType===t?"white":"var(--text-secondary)",cursor:"pointer",fontSize:"13px",transition:"all 0.2s"}}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:"16px"}}>
            <label className="label">Tone</label>
            <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>
              {TONES.map(t=>(
                <button key={t} onClick={()=>setTone(t)} style={{padding:"5px 12px",borderRadius:"20px",border:"1px solid var(--border)",background:tone===t?"rgba(124,58,237,0.2)":"transparent",color:tone===t?"var(--primary-light)":"var(--text-secondary)",cursor:"pointer",fontSize:"12px",transition:"all 0.2s"}}>{t}</button>
              ))}
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"20px"}}>
            <F id="name"  label="Your Name"    placeholder="Alex Smith" />
            <F id="skill" label="Your Skill"   placeholder="Full-stack dev" />
            <F id="topic" label="Topic"        placeholder="project collaboration" />
            <F id="goal"  label="Goal"         placeholder="schedule a call" />
            <div style={{gridColumn:"1/-1"}}><F id="value" label="Key Point" placeholder="I can increase your ROI by 30%" /></div>
          </div>
          <button id="generate-email-btn" className="btn-primary" onClick={generate} style={{width:"100%"}}>📧 Generate Email</button>
        </div>

        {output && (
          <div className="tool-box" style={{marginTop:"20px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:"10px"}}>
              <p className="label" style={{marginBottom:0}}>Generated Email</p>
              <button className="btn-secondary" style={{padding:"4px 12px",fontSize:"12px"}} onClick={copy}>{copied?"✅ Copied!":"📋 Copy"}</button>
            </div>
            <div className="code-block" style={{whiteSpace:"pre-wrap",color:"var(--text-primary)",fontSize:"14px",lineHeight:"1.8",fontFamily:"Inter, sans-serif"}}>{output}</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIEmailWriter;
