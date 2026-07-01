import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";

const LAST_UPDATED = "July 1, 2026";
const WEBSITE = "https://utilsflow.web.app";
const EMAIL = "savanismt11@gmail.com";

const sections = [
  {
    id: "information-we-collect",
    title: "1. Information We Collect",
    content: (
      <>
        <p className="text-text-secondary leading-relaxed mb-4">
          UtilsFlow is designed to protect your privacy. The vast majority of our tools operate entirely within your browser — your files and data are <strong className="text-text-primary">never uploaded to or stored on our servers</strong>.
        </p>
        <p className="text-text-secondary leading-relaxed mb-3">We may collect the following limited, non-personal information automatically:</p>
        <ul className="list-none flex flex-col gap-2 text-text-secondary text-sm">
          {[
            "Browser type and version (e.g., Chrome, Firefox)",
            "Operating system type (e.g., Windows, macOS, Android)",
            "Approximate geographic region (country/city level only, via IP address)",
            "Pages visited on UtilsFlow and time spent on each page",
            "Referring website (the website you came from before visiting UtilsFlow)",
            "Device type (desktop, tablet, mobile)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-primary-light mt-0.5">✓</span> {item}
            </li>
          ))}
        </ul>
        <p className="text-text-secondary leading-relaxed mt-4">
          We do <strong className="text-text-primary">not</strong> collect your name, email, phone number, or any personally identifiable information unless you voluntarily contact us by email.
        </p>
      </>
    ),
  },
  {
    id: "google-adsense-cookies",
    title: "2. Google AdSense & Advertising Cookies",
    content: (
      <>
        <p className="text-text-secondary leading-relaxed mb-4">
          UtilsFlow displays advertisements through <strong className="text-text-primary">Google AdSense</strong>, a third-party advertising service operated by Google LLC. To serve relevant ads, Google may use cookies and similar tracking technologies.
        </p>
        <p className="text-text-secondary leading-relaxed mb-4">
          Google AdSense may collect and use data to show you personalised advertisements based on your browsing history, interests, and demographics. This is governed by{" "}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">
            Google's Privacy Policy
          </a>.
        </p>
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 my-4">
          <p className="text-text-secondary text-sm leading-relaxed">
            <strong className="text-text-primary">⚠️ Important:</strong> Google uses the DoubleClick cookie to serve ads based on a user's previous visits to our website and other websites on the Internet. You may opt out of the use of the DoubleClick cookie for interest-based advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">
              Google Ads Settings
            </a>.
          </p>
        </div>
        <p className="text-text-secondary leading-relaxed">
          Alternatively, you can opt out of third-party vendor cookie tracking by visiting{" "}
          <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">
            www.aboutads.info/choices
          </a>.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "3. Cookies & Local Storage",
    content: (
      <div className="text-text-secondary leading-relaxed space-y-4">
        <p>
          UtilsFlow uses browser cookies and local storage for the following limited purposes:
        </p>
        <ul className="list-none flex flex-col gap-2 text-sm">
          {[
            "Remembering your preferences (such as recently used tools and favourite tools)",
            "Analytics data via Google Analytics to understand site usage and improve the platform",
            "Advertising personalisation via Google AdSense (as described in Section 2)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-primary-light mt-0.5">✓</span> {item}
            </li>
          ))}
        </ul>
        <p>
          You can disable cookies at any time through your browser settings. However, doing so may affect some functionality on UtilsFlow. Note that disabling cookies will not prevent us from serving ads, but it may prevent them from being personalised to your interests.
        </p>
      </div>
    ),
  },
  {
    id: "how-we-use-data",
    title: "4. How We Use Your Information",
    content: (
      <div className="text-text-secondary leading-relaxed space-y-4">
        <p>The limited, non-personal data we collect is used strictly for:</p>
        <ul className="list-none flex flex-col gap-2 text-sm">
          {[
            "Understanding how visitors use the website so we can improve our tools and content",
            "Monitoring site performance and fixing technical issues",
            "Displaying relevant advertisements through Google AdSense to support the free operation of this platform",
            "Preventing abuse, fraud, or misuse of our services",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-primary-light mt-0.5">✓</span> {item}
            </li>
          ))}
        </ul>
        <p>
          We do <strong className="text-text-primary">not</strong> sell your data to any third party. We do <strong className="text-text-primary">not</strong> use your data for any purpose other than those listed above.
        </p>
      </div>
    ),
  },
  {
    id: "third-party",
    title: "5. Third-Party Services",
    content: (
      <div className="text-text-secondary leading-relaxed space-y-3">
        <p>UtilsFlow integrates with the following third-party services, each governed by their own privacy policies:</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="text-left text-text-primary font-semibold p-3 border border-white/10 rounded-tl-lg">Service</th>
                <th className="text-left text-text-primary font-semibold p-3 border border-white/10">Purpose</th>
                <th className="text-left text-text-primary font-semibold p-3 border border-white/10 rounded-tr-lg">Privacy Policy</th>
              </tr>
            </thead>
            <tbody>
              {[
                { service: "Google AdSense", purpose: "Advertising", link: "https://policies.google.com/privacy" },
                { service: "Google Analytics", purpose: "Usage analytics", link: "https://policies.google.com/privacy" },
                { service: "Google Fonts", purpose: "Typography", link: "https://policies.google.com/privacy" },
              ].map((row) => (
                <tr key={row.service} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-3 border border-white/10 text-text-primary">{row.service}</td>
                  <td className="p-3 border border-white/10">{row.purpose}</td>
                  <td className="p-3 border border-white/10">
                    <a href={row.link} target="_blank" rel="noopener noreferrer" className="text-primary-light hover:underline">View Policy ↗</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
  {
    id: "data-retention",
    title: "6. Data Retention",
    content: (
      <p className="text-text-secondary leading-relaxed">
        Since UtilsFlow does not collect personally identifiable information from users, there is no personal data stored on our servers that would need to be retained or deleted. Any anonymised analytics data retained by third-party providers (such as Google Analytics) is governed by their own data retention policies.
      </p>
    ),
  },
  {
    id: "childrens-privacy",
    title: "7. Children's Privacy",
    content: (
      <p className="text-text-secondary leading-relaxed">
        UtilsFlow is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at{" "}
        <a href={`mailto:${EMAIL}`} className="text-primary-light hover:underline">{EMAIL}</a>{" "}
        and we will take immediate steps to remove such information.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "8. Your Rights",
    content: (
      <div className="text-text-secondary leading-relaxed space-y-3">
        <p>Depending on your location, you may have the right to:</p>
        <ul className="list-none flex flex-col gap-2 text-sm">
          {[
            "Request access to the data we hold about you",
            "Request that we delete any personal data associated with you",
            "Object to the processing of your data for advertising purposes",
            "Opt out of personalised advertising (see Section 2)",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="text-primary-light mt-0.5">✓</span> {item}
            </li>
          ))}
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href={`mailto:${EMAIL}`} className="text-primary-light hover:underline">{EMAIL}</a>.
        </p>
      </div>
    ),
  },
  {
    id: "changes",
    title: "9. Changes to This Privacy Policy",
    content: (
      <p className="text-text-secondary leading-relaxed">
        We reserve the right to update this Privacy Policy at any time. When we do, we will revise the "Last Updated" date at the top of this page. We encourage you to review this page periodically to stay informed about how we are protecting your information.
      </p>
    ),
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: (
      <div className="text-text-secondary leading-relaxed space-y-3">
        <p>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</p>
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

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen pt-[100px] px-5 pb-[80px]" style={{ animation: "fadeIn 0.45s ease forwards" }}>
      <SEOHead
        title="Privacy Policy — UtilsFlow"
        description="Read the UtilsFlow Privacy Policy to understand how we collect, use, and protect your information, including our use of Google AdSense."
        path="/privacy"
      />

      <div className="max-w-[860px] mx-auto">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 text-xs font-semibold text-primary-light mb-6 uppercase tracking-widest">
            Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary leading-tight mb-5">
            Privacy Policy
          </h1>
          <p className="text-text-secondary">
            <strong className="text-text-primary">Last Updated:</strong> {LAST_UPDATED} &nbsp;|&nbsp;
            <strong className="text-text-primary">Effective Date:</strong> {LAST_UPDATED}
          </p>
          <p className="text-text-secondary mt-3 leading-relaxed max-w-[640px]">
            This Privacy Policy describes how <strong className="text-text-primary">UtilsFlow</strong> ("{WEBSITE}") collects, uses, and shares information when you use our website and tools. By using UtilsFlow, you agree to the terms described in this policy.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 mb-10">
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Table of Contents</h2>
          <ul className="list-none flex flex-col gap-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-primary-light text-sm hover:underline"
                >
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
          <Link to="/terms" className="text-primary-light hover:underline text-sm mr-6">Terms of Service</Link>
          <Link to="/" className="text-primary-light hover:underline text-sm">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
