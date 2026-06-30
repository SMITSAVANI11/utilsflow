// EmojiFinder.jsx — Search and copy emojis
import { useState, useEffect, useMemo } from "react";
import SEOHead from "../../components/SEOHead";
import Breadcrumb from "../../components/Breadcrumb";
import { useAppContext } from "../../context/AppContext";

const EMOJIS = [
  {e:"😀",n:"grinning face",t:["happy","smile","face"]},{e:"😂",n:"tears of joy",t:["funny","laugh","lol"]},{e:"🥰",n:"smiling face with hearts",t:["love","cute","heart"]},{e:"😎",n:"cool face",t:["cool","sunglasses","awesome"]},{e:"🤔",n:"thinking face",t:["think","hmm","question"]},{e:"😴",n:"sleeping face",t:["sleep","tired","zzz"]},{e:"🔥",n:"fire",t:["fire","hot","trending","lit"]},{e:"💯",n:"hundred points",t:["100","perfect","great"]},{e:"🎉",n:"party popper",t:["party","celebrate","congrats"]},{e:"❤️",n:"red heart",t:["love","heart","red"]},{e:"💙",n:"blue heart",t:["blue","heart","love"]},{e:"💚",n:"green heart",t:["green","heart","nature"]},{e:"⭐",n:"star",t:["star","favorite","rating"]},{e:"🌙",n:"moon",t:["moon","night","dark"]},{e:"☀️",n:"sun",t:["sun","day","bright","light"]},{e:"🌈",n:"rainbow",t:["rainbow","color","pride"]},{e:"🎨",n:"artist palette",t:["art","design","color","creative"]},{e:"💻",n:"laptop",t:["computer","tech","code","work"]},{e:"📱",n:"mobile phone",t:["phone","mobile","smartphone"]},{e:"🚀",n:"rocket",t:["rocket","launch","fast","startup"]},{e:"💡",n:"light bulb",t:["idea","light","tip"]},{e:"🎯",n:"bullseye",t:["target","goal","aim","focus"]},{e:"✅",n:"check mark button",t:["check","done","complete","yes"]},{e:"❌",n:"cross mark",t:["no","wrong","close","error"]},{e:"⚠️",n:"warning",t:["warning","caution","alert"]},{e:"🔑",n:"key",t:["key","unlock","access","password"]},{e:"🏆",n:"trophy",t:["trophy","win","award","champion"]},{e:"💰",n:"money bag",t:["money","cash","rich","finance"]},{e:"📊",n:"bar chart",t:["chart","data","analytics","stats"]},{e:"🌍",n:"globe",t:["world","global","earth","international"]},{e:"🎵",n:"musical note",t:["music","song","note"]},{e:"📚",n:"books",t:["books","study","education","read"]},{e:"🍕",n:"pizza",t:["pizza","food","eat","delicious"]},{e:"☕",n:"coffee",t:["coffee","cafe","morning","drink"]},{e:"🏠",n:"house",t:["home","house","building"]},{e:"🚗",n:"car",t:["car","drive","vehicle","transport"]},{e:"✈️",n:"airplane",t:["plane","travel","fly","trip"]},{e:"💪",n:"flexed biceps",t:["strong","muscle","gym","power"]},{e:"🧠",n:"brain",t:["brain","smart","think","mind"]},{e:"🎮",n:"video game",t:["game","gaming","controller","play"]},{e:"👍",n:"thumbs up",t:["like","good","yes","approve"]},{e:"👎",n:"thumbs down",t:["dislike","bad","no","disapprove"]},{e:"🤝",n:"handshake",t:["deal","agree","partner","handshake"]},{e:"👋",n:"waving hand",t:["hello","bye","wave","hi"]},{e:"🎓",n:"graduation cap",t:["graduate","study","education","degree"]},{e:"🔒",n:"locked",t:["secure","lock","private","safety"]},{e:"🌟",n:"glowing star",t:["star","glow","special","featured"]},{e:"⚡",n:"lightning",t:["fast","electric","power","energy"]},{e:"🦋",n:"butterfly",t:["butterfly","nature","beautiful","transform"]},{e:"🌺",n:"hibiscus",t:["flower","nature","beautiful","spring"]},
];

function EmojiFinder() {
  const { trackTool } = useAppContext();
  useEffect(() => { trackTool("emoji-finder"); }, [trackTool]);

  const [search,  setSearch]  = useState("");
  const [copied,  setCopied]  = useState(null);
  const [recent,  setRecent]  = useState([]);

  const filtered = useMemo(() =>
    search ? EMOJIS.filter(e => e.n.includes(search.toLowerCase()) || e.t.some(t=>t.includes(search.toLowerCase()))) : EMOJIS,
  [search]);

  function copy(emoji) {
    navigator.clipboard.writeText(emoji.e).catch(() => {});
    setCopied(emoji.e);
    setRecent(prev => [emoji, ...prev.filter(e=>e.e!==emoji.e)].slice(0,8));
    setTimeout(() => setCopied(null), 1000);
  }

  const EmojiBtn = ({ emoji }) => (
    <button onClick={() => copy(emoji)} title={emoji.n}
      style={{ width:"56px",height:"56px",fontSize:"28px",background:copied===emoji.e?"rgba(16,185,129,0.15)":"var(--bg-card)",border:`1px solid ${copied===emoji.e?"rgba(16,185,129,0.4)":"var(--border)"}`,borderRadius:"12px",cursor:"pointer",transition:"all 0.2s",display:"flex",alignItems:"center",justifyContent:"center" }}
      onMouseEnter={(e)=>{e.currentTarget.style.transform="scale(1.2)";e.currentTarget.style.borderColor="rgba(124,58,237,0.4)";}}
      onMouseLeave={(e)=>{e.currentTarget.style.transform="";e.currentTarget.style.borderColor=copied===emoji.e?"rgba(16,185,129,0.4)":"var(--border)";}}>
      {emoji.e}
    </button>
  );

  return (
    <div className="tool-page fade-in">
      <SEOHead title="Emoji Finder & Picker" description="Search and copy emojis instantly. Find any emoji by name or keyword. Free online emoji picker." path="/tools/emoji-finder" />
      <div className="tool-page-inner" style={{maxWidth:"900px"}}>
        <Breadcrumb toolName="Emoji Finder" category="Creative" categoryPath="/?cat=creative" />
        <h1 className="tool-title">😀 Emoji Finder</h1>
        <p className="tool-description">Search and copy any emoji instantly. Click an emoji to copy it to your clipboard.</p>

        <div className="tool-box">
          <input className="input-field" value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search emojis… (e.g. 'fire', 'love', 'star', 'rocket')" style={{marginBottom:"20px"}} />

          {recent.length > 0 && !search && (
            <div style={{marginBottom:"20px"}}>
              <p className="label">Recently Copied</p>
              <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
                {recent.map(e=><EmojiBtn key={e.e} emoji={e} />)}
              </div>
            </div>
          )}

          <p className="label">{search ? `Results (${filtered.length})` : `All Emojis (${EMOJIS.length})`}</p>
          <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
            {filtered.map(e=><EmojiBtn key={e.e} emoji={e} />)}
            {filtered.length===0 && <p style={{color:"var(--text-secondary)",fontSize:"14px"}}>No emojis found for "{search}"</p>}
          </div>
        </div>
        {copied && <div style={{position:"fixed",bottom:"80px",left:"50%",transform:"translateX(-50%)",background:"var(--primary)",color:"white",padding:"8px 20px",borderRadius:"20px",fontSize:"14px",fontWeight:600,boxShadow:"0 4px 20px rgba(124,58,237,0.4)",zIndex:1000}}>Copied {copied}!</div>}
      </div>
    </div>
  );
}

export default EmojiFinder;
