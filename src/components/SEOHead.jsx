// SEOHead.jsx — Per-page SEO using react-helmet-async
import { Helmet } from "react-helmet-async";

const SITE = "https://utilsflow.com";

function SEOHead({ title, description, path = "", ogImage = "/og-image.png" }) {
  const fullTitle = title ? `${title} — UtilsFlow` : "UtilsFlow — 140+ Free Online Utilities";
  const url = `${SITE}${path}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={`${SITE}${ogImage}`} />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${SITE}${ogImage}`} />
    </Helmet>
  );
}

export default SEOHead;
