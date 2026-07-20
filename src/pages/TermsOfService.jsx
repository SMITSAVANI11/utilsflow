import { Link } from "react-router-dom";
import { XCircle } from "lucide-react";
import SEOHead from "../components/SEOHead";

const LAST_UPDATED = "July 1, 2026";
const WEBSITE = "https://utilsflow.web.app";
const EMAIL = "savanismt11@gmail.com";

const sections = [
  {
    id: "acceptance",
    title: "1. Acceptance of Terms",
    content: (
      <p className="text-text-secondary leading-relaxed">
        By accessing and using UtilsFlow ("{WEBSITE}"), you accept and agree to be bound by these Terms of Service and our{" "}
        <Link to="/privacy" className="text-primary-light hover:underline">Privacy Policy</Link>. If you do not agree to these terms, please do not use our website.
      </p>
    ),
  },
  {
    id: "description",
    title: "2. Description of Service",
    content: (
      <div className="text-text-secondary leading-relaxed space-y-3">
        <p>
          UtilsFlow is a free, browser-based utility platform that provides 140+ online tools including image converters, PDF utilities, SEO tools, developer helpers, calculators, and more.
        </p>
        <p>
          All tools are provided free of charge, without requiring user registration. Most tools operate entirely within your browser, meaning your files and data are processed locally on your device and are not uploaded to our servers.
        </p>
      </div>
    ),
  },
  {
    id: "acceptable-use",
    title: "3. Acceptable Use",
    content: (
      <div className="text-text-secondary leading-relaxed space-y-4">
        <p>You agree to use UtilsFlow only for lawful purposes. You agree <strong className="text-text-primary">not</strong> to:</p>
        <ul className="list-none flex flex-col gap-2 text-sm">
          {[
            "Use the service for any illegal, fraudulent, or harmful activity",
            "Attempt to disrupt, hack, or gain unauthorized access to our website or servers",
            "Use automated bots or scrapers to overload or abuse our services",
            "Circumvent, disable, or interfere with security-related features of the website",
            "Upload, post, or transmit any content that is unlawful, defamatory, abusive, or otherwise objectionable",
            "Use the service to infringe upon the intellectual property rights of any third party",
            "Misrepresent your identity or affiliation when contacting us",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "intellectual-property",
    title: "4. Intellectual Property",
    content: (
      <div className="text-text-secondary leading-relaxed space-y-3">
        <p>
          All content, design, code, logos, and trademarks on UtilsFlow are the property of UtilsFlow and its operators, protected under applicable copyright and intellectual property laws.
        </p>
        <p>
          You may not copy, reproduce, distribute, or create derivative works from any content on this website without our prior written permission.
        </p>
        <p>
          The tools provided on UtilsFlow are made available for personal and professional use. You may use the <em>output</em> of our tools (e.g., converted files, generated text) for any lawful purpose.
        </p>
      </div>
    ),
  },
  {
    id: "advertising",
    title: "5. Advertising",
    content: (
      <div className="text-text-secondary leading-relaxed space-y-3">
        <p>
          UtilsFlow is a free service supported by advertising revenue through <strong className="text-text-primary">Google AdSense</strong>. By using our website, you acknowledge that:
        </p>
        <ul className="list-none flex flex-col gap-2 text-sm">
          {[
            "Advertisements may be displayed on various pages of the website",
            "UtilsFlow does not endorse the products or services advertised",
            "Clicking on ads is voluntary and UtilsFlow bears no responsibility for third-party ad content",
            "You should not interact with ads that appear deceptive or harmful",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-primary-light mt-0.5">✓</span> {item}
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "disclaimer",
    title: "6. Disclaimer of Warranties",
    content: (
      <div className="text-text-secondary leading-relaxed space-y-3">
        <p>
          UtilsFlow is provided <strong className="text-text-primary">"as is"</strong> and <strong className="text-text-primary">"as available"</strong> without any warranties, express or implied. We do not warrant that:
        </p>
        <ul className="list-none flex flex-col gap-2 text-sm">
          {[
            "The service will be uninterrupted, error-free, or completely secure",
            "The results obtained from using any tool will be accurate or reliable",
            "Any errors or defects will be corrected",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-yellow-400 mt-0.5">⚠</span> {item}
            </li>
          ))}
        </ul>
        <p>
          Use the tools at your own risk. Always verify important results independently.
        </p>
      </div>
    ),
  },
  {
    id: "limitation",
    title: "7. Limitation of Liability",
    content: (
      <p className="text-text-secondary leading-relaxed">
        To the fullest extent permitted by applicable law, UtilsFlow and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of, or inability to use, the service. This includes but is not limited to loss of data, loss of profits, or any damages resulting from errors in our tools.
      </p>
    ),
  },
  {
    id: "third-party-links",
    title: "8. Third-Party Links",
    content: (
      <p className="text-text-secondary leading-relaxed">
        Our website may contain links to third-party websites. These links are provided for your convenience only. UtilsFlow has no control over the content, privacy policies, or practices of third-party websites and expressly disclaims any responsibility for them. We encourage you to review the privacy policy and terms of any website you visit.
      </p>
    ),
  },
  {
    id: "modifications",
    title: "9. Modifications to Service & Terms",
    content: (
      <p className="text-text-secondary leading-relaxed">
        We reserve the right to modify, suspend, or discontinue any part of the UtilsFlow service at any time without notice. We also reserve the right to update these Terms of Service at any time. Continued use of the website after any changes constitutes your acceptance of the new terms. The "Last Updated" date at the top of this page will always reflect the most recent revision.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "10. Governing Law",
    content: (
      <p className="text-text-secondary leading-relaxed">
        These Terms of Service shall be governed by and construed in accordance with the laws of <strong className="text-text-primary">India</strong>, specifically the Information Technology Act, 2000 and its amendments. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of <strong className="text-text-primary">Surat, Gujarat, India</strong>.
      </p>
    ),
  },
  {
    id: "contact",
    title: "11. Contact Information",
    content: (
      <div className="text-text-secondary leading-relaxed space-y-3">
        <p>If you have any questions about these Terms of Service, please contact us:</p>
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 text-sm space-y-2">
          <p><span className="text-text-primary font-semibold">Website:</span>{" "}
            <a href={WEBSITE} className="text-primary-light hover:underline">{WEBSITE}</a>
          </p>
          <p><span className="text-text-primary font-semibold">Email:</span>{" "}
            <a href={`mailto:${EMAIL}`} className="text-primary-light hover:underline">{EMAIL}</a>
          </p>
          <p><span className="text-text-primary font-semibold">Phone:</span> +91 87589 38736</p>
          <p><span className="text-text-primary font-semibold">Address:</span> Katargam, Surat, Gujarat, India — 395004</p>
        </div>
      </div>
    ),
  },
];

export default function TermsOfService() {
  return (
    <div className="min-h-screen pt-[100px] px-5 pb-[80px]" style={{ animation: "fadeIn 0.45s ease forwards" }}>
      <SEOHead
        title="Terms of Service — UtilsFlow"
        description="Read the UtilsFlow Terms of Service to understand the rules and conditions governing your use of our free online tools platform."
        path="/terms"
      />

      <div className="max-w-[860px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs font-semibold text-primary-light mb-6 uppercase tracking-widest">
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight mb-5">
            Terms of Service
          </h1>
          <p className="text-text-secondary">
            <strong className="text-text-primary">Last Updated:</strong> {LAST_UPDATED} &nbsp;|&nbsp;
            <strong className="text-text-primary">Effective Date:</strong> {LAST_UPDATED}
          </p>
          <p className="text-text-secondary mt-3 leading-relaxed max-w-[640px]">
            Please read these Terms of Service carefully before using <strong className="text-text-primary">UtilsFlow</strong>. These terms govern your access to and use of our website and tools.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-10">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Table of Contents</h2>
          <ul className="list-none flex flex-col gap-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-primary-light text-sm hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-8">
          {sections.map((s) => (
            <section
              key={s.id}
              id={s.id}
              className="bg-white/[0.02] border border-white/10 rounded-2xl p-7 scroll-mt-28"
            >
              <h2 className="text-xl font-bold text-text-primary mb-5 pb-3 border-b border-white/10">
                {s.title}
              </h2>
              {s.content}
            </section>
          ))}
        </div>

        {/* Footer Nav */}
        <div className="mt-12 text-center">
          <Link to="/contact" className="text-primary-light hover:underline text-sm mr-6">Contact Us</Link>
          <Link to="/privacy" className="text-primary-light hover:underline text-sm mr-6">Privacy Policy</Link>
          <Link to="/" className="text-primary-light hover:underline text-sm">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
