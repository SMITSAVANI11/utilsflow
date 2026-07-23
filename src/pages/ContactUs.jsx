import SEOHead from "../components/SEOHead";
import { Mail, Phone, MapPin, Send, HelpCircle } from "lucide-react";

const contactDetails = [
  { icon: Mail, label: "Email Address", value: "savanismt11@gmail.com", href: "mailto:savanismt11@gmail.com" },
  { icon: Phone, label: "Phone Number", value: "+91 87589 38736", href: "tel:+918758938736" },
  { icon: MapPin, label: "Location", value: "Katargam, Surat, Gujarat, India — 395004", href: null },
];

const faqs = [
  {
    q: "Are all tools on UtilsFlow free?",
    a: "Yes, every single tool on UtilsFlow is completely free to use. No subscriptions, credit cards, or hidden fees.",
  },
  {
    q: "Do I need to create an account?",
    a: "No. UtilsFlow requires zero registration. Open any tool and start using it immediately.",
  },
  {
    q: "Is my data safe when using your tools?",
    a: "Absolutely. All tools run locally inside your browser. Your files and data are never uploaded to or stored on our servers.",
  },
  {
    q: "How can I request a new tool?",
    a: "Send us an email with your tool idea. We review all suggestions and regularly add top-requested utilities.",
  },
];

export default function ContactUs() {
  return (
    <div className="min-h-screen pt-[100px] px-5 pb-[80px]" style={{ animation: "fadeIn 0.45s ease forwards" }}>
      <SEOHead
        title="Contact Us"
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
            We're Here to <span className="text-primary-light">Help You</span>
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed max-w-[580px] mx-auto">
            Have a question, suggestion, or bug report? Send us a message and we'll respond promptly.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          {contactDetails.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="bg-bg-card border border-border/80 rounded-2xl p-6 text-center hover:border-primary/30 hover:bg-bg-card-hover transition-all duration-300 flex flex-col items-center justify-between"
              >
                <div className="w-10 h-10 rounded-xl bg-primary-glow-heavy border border-primary/20 flex items-center justify-center text-primary mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs uppercase tracking-widest text-text-muted font-semibold mb-2">{c.label}</div>
                {c.href ? (
                  <a href={c.href} className="text-primary-light font-semibold text-sm hover:underline break-all">
                    {c.value}
                  </a>
                ) : (
                  <span className="text-text-secondary text-sm">{c.value}</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Email CTA Block */}
        <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-2xl p-8 md:p-10 text-center mb-14">
          <div className="w-12 h-12 rounded-2xl bg-primary-glow-heavy border border-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
            <Send className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">Send Us an Email</h2>
          <p className="text-text-secondary mb-6 max-w-[480px] mx-auto">
            For support, bug reports, or feature requests, email us directly and we will respond within 1–2 business days.
          </p>
          <a
            href="mailto:savanismt11@gmail.com"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-semibold px-7 py-3 rounded-xl transition-all duration-200 hover:-translate-y-0.5 no-underline"
          >
            <Mail className="w-4.5 h-4.5" />
            <span>savanismt11@gmail.com</span>
          </a>
        </div>

        {/* FAQ */}
        <h2 className="text-2xl font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
        <div className="flex flex-col gap-4">
          {faqs.map((f, i) => (
            <div
              key={i}
              className="bg-bg-card border border-border/80 rounded-2xl p-6 hover:border-primary/20 transition-all duration-300"
            >
              <h3 className="text-base font-bold text-text-primary mb-2 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-primary shrink-0" />
                <span>{f.q}</span>
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed pl-6">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
