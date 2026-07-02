import{n as e}from"./rolldown-runtime-Bh1tDfsg.js";import{r as t}from"./helmet-DCGcZJuj.js";import{l as n}from"./vendor-aVKic6MI.js";import{r}from"./index-BCQsYB4s.js";import{t as i}from"./SEOHead-DVHCF5Y9.js";import{t as a}from"./Breadcrumb-CdOCCUbe.js";import{t as o}from"./markdown-CtaBI5gJ.js";var s=e(t(),1),c=n(),l=`# Welcome to Markdown Previewer

## Features
- **Bold text** and *italic text*
- ~~Strikethrough~~ text
- [Links](https://utilsflow.web.app)
- Inline \`code\` and code blocks

## Code Example
\`\`\`javascript
function hello() {
  return "Hello, UtilsFlow!";
}
\`\`\`

## Table
| Tool | Category | Free |
|------|----------|------|
| JSON Formatter | Developer | ✅ |
| QR Generator | Image | ✅ |

> Blockquote: All tools are 100% free!
`;function u(){let{trackTool:e}=r();(0,s.useEffect)(()=>{e(`markdown-previewer`)},[e]);let[t,n]=(0,s.useState)(l),[u,d]=(0,s.useState)(`split`),[f,p]=(0,s.useState)(!1),m=(0,s.useMemo)(()=>o(t,{breaks:!0,gfm:!0}),[t]);function h(){navigator.clipboard.writeText(t).catch(()=>{}),p(!0),setTimeout(()=>p(!1),1500)}return(0,c.jsxs)(`div`,{className:`tool-page fade-in`,children:[(0,c.jsx)(i,{title:`Markdown Previewer`,description:`Write and preview Markdown in real-time. Supports GFM tables, code blocks, and more. Free online tool.`,path:`/tools/markdown-previewer`}),(0,c.jsxs)(`div`,{className:`tool-page-inner`,style:{maxWidth:`1100px`},children:[(0,c.jsx)(a,{toolName:`Markdown Previewer`,category:`Text & Writing`,categoryPath:`/?cat=text`}),(0,c.jsx)(`h1`,{className:`tool-title`,children:`📝 Markdown Previewer`}),(0,c.jsx)(`p`,{className:`tool-description`,children:`Write Markdown on the left and see the rendered preview on the right in real-time.`}),(0,c.jsxs)(`div`,{className:`tool-box`,style:{marginBottom:`12px`,display:`flex`,gap:`8px`,alignItems:`center`,flexWrap:`wrap`},children:[[`split`,`edit`,`preview`].map(e=>(0,c.jsx)(`button`,{onClick:()=>d(e),className:u===e?`btn-primary`:`btn-secondary`,style:{fontSize:`13px`,padding:`7px 14px`,textTransform:`capitalize`},children:e===`split`?`⚡ Split`:e===`edit`?`✏️ Edit`:`👁️ Preview`},e)),(0,c.jsx)(`button`,{className:`btn-secondary`,style:{fontSize:`13px`,padding:`7px 14px`,marginLeft:`auto`},onClick:h,children:f?`✅ Copied!`:`📋 Copy MD`})]}),(0,c.jsxs)(`div`,{style:{display:`grid`,gridTemplateColumns:u===`split`?`1fr 1fr`:`1fr`,gap:`16px`},children:[u!==`preview`&&(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`label`,{className:`label`,htmlFor:`md-input`,children:`Markdown`}),(0,c.jsx)(`textarea`,{id:`md-input`,className:`input-field`,value:t,onChange:e=>n(e.target.value),style:{minHeight:`500px`,fontFamily:`JetBrains Mono, monospace`,fontSize:`13px`,resize:`vertical`,lineHeight:`1.7`}})]}),u!==`edit`&&(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`label`,{className:`label`,children:`Preview`}),(0,c.jsx)(`div`,{className:`tool-box`,style:{minHeight:`500px`,overflow:`auto`},dangerouslySetInnerHTML:{__html:m}})]})]}),(0,c.jsx)(`style`,{children:`
          .tool-box h1, .tool-box h2, .tool-box h3 { margin: 16px 0 8px; color: var(--text-primary); }
          .tool-box p { margin: 0 0 12px; color: var(--text-secondary); }
          .tool-box code { font-family: JetBrains Mono, monospace; background: rgba(124,58,237,0.15); padding: 2px 6px; border-radius: 4px; font-size: 13px; color: var(--primary-light); }
          .tool-box pre { background: rgba(0,0,0,0.3); border: 1px solid var(--border); border-radius: 8px; padding: 16px; overflow-x: auto; margin: 12px 0; }
          .tool-box pre code { background: none; padding: 0; }
          .tool-box table { border-collapse: collapse; width: 100%; margin: 12px 0; }
          .tool-box th, .tool-box td { border: 1px solid var(--border); padding: 8px 12px; text-align: left; font-size: 14px; }
          .tool-box th { background: rgba(124,58,237,0.1); font-weight: 600; }
          .tool-box blockquote { border-left: 3px solid var(--primary); margin: 12px 0; padding: 8px 16px; background: rgba(124,58,237,0.05); color: var(--text-secondary); }
          .tool-box ul, .tool-box ol { padding-left: 20px; margin: 8px 0; color: var(--text-secondary); }
          .tool-box a { color: var(--primary-light); }
        `})]})]})}export{u as default};