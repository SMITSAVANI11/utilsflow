// Footer.jsx — High-fidelity, multi-column footer
import { Link } from "react-router-dom";
import { tools } from "../data/tools";
import logoImg from "../assets/UtilsflowLogo.png";
function Footer() {
  return (
    <footer className="border-t border-border pt-16 px-6 pb-8 backdrop-blur-md text-text-primary bg-[var(--footer-bg,rgba(13,13,18,0.7))]" role="contentinfo">
      <div className="max-w-[1200px] mx-auto grid gap-10 mb-12 grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] text-center md:text-left">
        {/* Brand Column */}
        <div className="flex flex-col gap-4 max-w-full md:max-w-[360px] items-center md:items-start">
          <Link to="/" className="flex items-center no-underline">
            <img src={logoImg} alt="UtilsFlow" className="footer-logo-img h-[42px] w-auto block object-contain" />
          </Link>
          <p className="text-text-secondary text-sm leading-relaxed">
            Your instant, privacy-focused hub of {tools.length}+ free online tools. All utilities run locally in your browser for maximum privacy and zero tracking.
          </p>
          <div className="flex gap-4 mt-2 justify-center md:justify-start">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 no-underline text-[18px] transition-all duration-200 hover:bg-primary hover:border-primary-light hover:-translate-y-0.5"
            >
              🐙
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 no-underline text-[18px] transition-all duration-200 hover:bg-primary hover:border-primary-light hover:-translate-y-0.5"
            >
              🐦
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-white/10 no-underline text-[18px] transition-all duration-200 hover:bg-primary hover:border-primary-light hover:-translate-y-0.5"
            >
              💼
            </a>
          </div>
        </div>

        {/* Categories Column 1 */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2 relative">Popular Hubs</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5 items-center md:items-start">
            <li>
              <Link to="/?cat=image" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                📸 Image Tools
              </Link>
            </li>
            <li>
              <Link to="/?cat=pdf" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                📄 PDF Tools
              </Link>
            </li>
            <li>
              <Link to="/?cat=seo" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                🔍 SEO Tools
              </Link>
            </li>
            <li>
              <Link to="/?cat=developer" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                💻 Developer Tools
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories Column 2 */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2 relative">Utilities</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5 items-center md:items-start">
            <li>
              <Link to="/?cat=math" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                📐 Math & Calc
              </Link>
            </li>
            <li>
              <Link to="/?cat=text" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                ✍️ Text Tools
              </Link>
            </li>
            <li>
              <Link to="/?cat=security" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                🔒 Security Tools
              </Link>
            </li>
            <li>
              <Link to="/?cat=misc" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                ⚙️ Miscellaneous
              </Link>
            </li>
          </ul>
        </div>

        {/* Info Column */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2 relative">Company</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5 items-center md:items-start">
            <li>
              <Link to="/about" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                ℹ️ About Us
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                🔒 Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                📄 Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                📧 Contact Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/40 pt-8 max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-text-muted text-xs">
          © {new Date().getFullYear()} UtilsFlow — 100% free, no login, no tracking. Made with ❤️
        </p>
      </div>
    </footer>
  );
}

export default Footer;
