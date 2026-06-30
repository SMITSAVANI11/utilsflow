// ============================================================
// BioGenerator.jsx — Professional Bio Generator
// ============================================================
// Fill in your info → get a ready-to-use bio for social media
// ============================================================

import { useState } from "react";

// Bio templates — {name}, {role}, {company}, {skill}, {hobby} are placeholders
const templates = [
  (d) => `👋 Hi, I'm ${d.name}! I'm a passionate ${d.role} at ${d.company}. I specialize in ${d.skill} and love helping people through technology. When not working, I enjoy ${d.hobby}. Let's connect! 🚀`,
  (d) => `${d.name} | ${d.role} at ${d.company}. Turning ideas into reality with ${d.skill}. Passionate about innovation and growth. 💡 Outside work, you'll find me ${d.hobby}.`,
  (d) => `🌟 ${d.name} here! Currently working as a ${d.role} at ${d.company}. My expertise is in ${d.skill}. I'm always learning something new. Fun fact: I love ${d.hobby}! DM me anytime.`,
];

function BioGenerator() {
  const [form, setForm] = useState({
    name:    "",
    role:    "",
    company: "",
    skill:   "",
    hobby:   "",
  });
  const [templateIndex, setTemplateIndex] = useState(0);
  const [bio,    setBio]    = useState("");
  const [copied, setCopied] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function generateBio() {
    const d = {
      name:    form.name    || "Your Name",
      role:    form.role    || "Professional",
      company: form.company || "My Company",
      skill:   form.skill   || "my craft",
      hobby:   form.hobby   || "exploring new things",
    };
    setBio(templates[templateIndex](d));
  }

  function copyBio() {
    navigator.clipboard.writeText(bio);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="tool-page fade-in">
      <div className="tool-page-inner">
        <h1 className="tool-title">👤 Bio Generator</h1>
        <p className="tool-description">
          Fill in your details and get a professional bio for LinkedIn, Twitter, or Instagram.
        </p>

        <div className="tool-box">
          {/* Form fields */}
          {[
            { name: "name",    label: "Your Name",         placeholder: "e.g. Smit Savani" },
            { name: "role",    label: "Your Job Role",     placeholder: "e.g. Frontend Developer" },
            { name: "company", label: "Company / Freelance",placeholder: "e.g. TechCorp / Freelancer" },
            { name: "skill",   label: "Main Skill",        placeholder: "e.g. React, UI Design, Finance" },
            { name: "hobby",   label: "Hobby / Interest",  placeholder: "e.g. reading, hiking, cooking" },
          ].map(field => (
            <div key={field.name} style={{ marginBottom: "14px" }}>
              <label className="label">{field.label}</label>
              <input
                id={`bio-${field.name}`}
                type="text"
                name={field.name}
                className="input-field"
                placeholder={field.placeholder}
                value={form[field.name]}
                onChange={handleChange}
              />
            </div>
          ))}

          {/* Template selector */}
          <div style={{ marginBottom: "20px" }}>
            <label className="label">Bio Style</label>
            <div style={{ display: "flex", gap: "8px" }}>
              {templates.map((_, i) => (
                <button
                  key={i}
                  className={templateIndex === i ? "btn-primary" : "btn-secondary"}
                  style={{ padding: "8px 16px", fontSize: "13px" }}
                  onClick={() => setTemplateIndex(i)}
                >
                  Style {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button id="generate-bio-btn" className="btn-primary" onClick={generateBio} style={{ width: "100%", marginBottom: "20px" }}>
            ✨ Generate Bio
          </button>

          {/* Generated bio output */}
          {bio && (
            <div>
              <label className="label">Your Bio</label>
              <div className="result-box" style={{ fontSize: "15px", lineHeight: "1.8" }}>
                {bio}
              </div>
              <button id="copy-bio-btn" className="btn-secondary" onClick={copyBio} style={{ marginTop: "12px" }}>
                {copied ? "✅ Copied!" : "📋 Copy Bio"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BioGenerator;
