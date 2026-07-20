// Footer.jsx — High-fidelity, multi-column footer
import { Link } from "react-router-dom";
import { tools } from "../data/tools";
import logoImg from "../assets/UtilsflowLogo.png";
import CategoryIcon from "./CategoryIcon";
import { Info, ShieldCheck, FileText, Mail } from "lucide-react";

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
        </div>

        {/* Categories Column 1 */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2 relative">Popular Hubs</h3>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5 items-center md:items-start">
            <li>
              <Link to="/?cat=image" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                <CategoryIcon categoryId="image" className="w-3.5 h-3.5 text-primary" /> Image Tools
              </Link>
            </li>
            <li>
              <Link to="/?cat=pdf" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                <CategoryIcon categoryId="pdf" className="w-3.5 h-3.5 text-primary" /> PDF Tools
              </Link>
            </li>
            <li>
              <Link to="/?cat=seo" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                <CategoryIcon categoryId="seo" className="w-3.5 h-3.5 text-primary" /> SEO Tools
              </Link>
            </li>
            <li>
              <Link to="/?cat=developer" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                <CategoryIcon categoryId="developer" className="w-3.5 h-3.5 text-primary" /> Developer Tools
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
                <CategoryIcon categoryId="math" className="w-3.5 h-3.5 text-primary" /> Math & Calc
              </Link>
            </li>
            <li>
              <Link to="/?cat=text" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                <CategoryIcon categoryId="text" className="w-3.5 h-3.5 text-primary" /> Text Tools
              </Link>
            </li>
            <li>
              <Link to="/?cat=security" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                <CategoryIcon categoryId="security" className="w-3.5 h-3.5 text-primary" /> Security Tools
              </Link>
            </li>
            <li>
              <Link to="/?cat=misc" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                <CategoryIcon categoryId="misc" className="w-3.5 h-3.5 text-primary" /> Miscellaneous
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
                <Info className="w-3.5 h-3.5 text-primary" /> About Us
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                <FileText className="w-3.5 h-3.5 text-primary" /> Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-text-secondary text-[13.5px] no-underline transition-all duration-200 flex items-center gap-2 hover:text-primary-light hover:pl-0 md:hover:pl-1">
                <Mail className="w-3.5 h-3.5 text-primary" /> Contact Support
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/40 pt-8 max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <p className="text-text-muted text-xs">
          © {new Date().getFullYear()} UtilsFlow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
