import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";

const stats = [
  { label: "Free Tools", value: "140+" },
  { label: "Happy Users", value: "50K+" },
  { label: "No Login Required", value: "100%" },
  { label: "Browser-Based", value: "Always" },
];

const values = [
  {
    icon: "🔒",
    title: "Privacy First",
    desc: "All our tools run directly in your browser. Your data never leaves your device or touches our servers.",
  },
  {
    icon: "⚡",
    title: "Always Free",
    desc: "Every single tool on UtilsFlow is free to use — no hidden fees, no subscriptions, no credit card required.",
  },
  {
    icon: "🚀",
    title: "No Sign-up Needed",
    desc: "Open any tool and start working instantly. We believe in reducing friction, not creating it.",
  },
  {
    icon: "🌍",
    title: "Built for Everyone",
    desc: "From students and developers to designers and businesses — UtilsFlow has a tool for every need.",
  },
];

export default function AboutUs() {
  return (
    <div className="min-h-screen pt-[100px] px-5 pb-[80px]" style={{ animation: "fadeIn 0.45s ease forwards" }}>
      <SEOHead
        title="About Us — UtilsFlow"
        description="Learn about UtilsFlow, the free online utility platform offering 140+ browser-based tools with no login, no tracking, and no cost."
        path="/about"
      />

      <div className="max-w-[860px] mx-auto">

        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs font-semibold text-primary-light mb-6 uppercase tracking-widest">
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight mb-5">
            We Build Tools That{" "}
            <span className="text-primary-light">Work for You</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-[640px] mx-auto">
            UtilsFlow is a free, privacy-first platform offering 140+ online utilities — from image converters and PDF tools to SEO analysers and developer helpers. No login. No tracking. No cost. Ever.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="text-3xl font-extrabold text-primary-light mb-1">{s.value}</div>
              <div className="text-text-secondary text-sm">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-8 md:p-10 mb-10">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Our Mission</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            We started UtilsFlow with a simple belief: powerful web tools should be accessible to everyone, for free, with zero barriers. Too many utility websites hide their best features behind paywalls, require account creation, or harvest user data.
          </p>
          <p className="text-text-secondary leading-relaxed">
            UtilsFlow is our answer to that problem. Every tool is designed to run entirely within your browser — meaning your files, data, and activity stay completely private on your own device. We are committed to keeping this platform free and open forever.
          </p>
        </div>

        {/* Values */}
        <h2 className="text-2xl font-bold text-text-primary mb-6">What We Stand For</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{v.icon}</div>
              <h3 className="text-base font-bold text-text-primary mb-2">{v.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-text-primary mb-3">Have Questions?</h2>
          <p className="text-text-secondary mb-6">
            We'd love to hear from you. Reach out to us for support, feedback, or tool requests.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 no-underline"
          >
            📧 Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
