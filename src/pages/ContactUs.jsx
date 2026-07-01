import SEOHead from "../components/SEOHead";

const contactDetails = [
  { icon: "📧", label: "Email Address", value: "savanismt11@gmail.com", href: "mailto:savanismt11@gmail.com" },
  { icon: "📱", label: "Phone Number", value: "+91 87589 38736", href: "tel:+918758938736" },
  { icon: "📍", label: "Location", value: "Katargam, Surat, Gujarat, India — 395004", href: null },
];

const faqs = [
  {
    q: "Are all tools on UtilsFlow free?",
    a: "Yes, every single tool on UtilsFlow is completely free to use. No subscription, no credit card, no hidden fees.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. UtilsFlow requires zero registration. Just open any tool and start using it immediately.",
  },
  {
    q: "Is my data safe when I use your tools?",
    a: "Absolutely. All tools run locally in your browser. Your files and data are never uploaded to or stored on our servers.",
  },
  {
    q: "How can I request a new tool?",
    a: "Send us an email at savanismt11@gmail.com with your tool idea. We review all suggestions and try to add the most requested ones.",
  },
];

export default function ContactUs() {
  return (
    <div className="min-h-screen pt-[100px] px-5 pb-[80px]" style={{ animation: "fadeIn 0.45s ease forwards" }}>
      <SEOHead
        title="Contact Us — UtilsFlow"
        description="Get in touch with the UtilsFlow team for support, feedback, or tool requests. We're happy to help."
        path="/contact"
      />

      <div className="max-w-[860px] mx-auto">

        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs font-semibold text-primary-light mb-6 uppercase tracking-widest">
            Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight mb-5">
            We're Here to{" "}
            <span className="text-primary-light">Help You</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-[580px] mx-auto">
            Have a question, a suggestion, or found a bug? Send us a message and we'll get back to you as soon as possible.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {contactDetails.map((c) => (
            <div
              key={c.label}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 text-center hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-2">{c.label}</div>
              {c.href ? (
                <a href={c.href} className="text-primary-light font-semibold text-sm hover:underline break-all">
                  {c.value}
                </a>
              ) : (
                <span className="text-text-secondary text-sm">{c.value}</span>
              )}
            </div>
          ))}
        </div>

        {/* Email CTA Block */}
        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-8 md:p-10 text-center mb-14">
          <div className="text-4xl mb-4">✉️</div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">Send Us an Email</h2>
          <p className="text-text-secondary mb-6 max-w-[480px] mx-auto">
            For support, bug reports, tool requests, or any general queries, simply email us and we will respond within 1–2 business days.
          </p>
          <a
            href="mailto:savanismt11@gmail.com"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 no-underline"
          >
            📧 savanismt11@gmail.com
          </a>
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 hover:border-primary/20 transition-all duration-300"
            >
              <h3 className="text-base font-bold text-text-primary mb-2">❓ {f.q}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
