// SEOHead.jsx — Per-page SEO using react-helmet-async
import { Helmet } from "react-helmet-async";

const SITE = "https://utilsflow.web.app";
const SITE_NAME = "UtilsFlow";

/**
 * @param {string} title - Page title (without site name suffix)
 * @param {string} description - Meta description
 * @param {string} path - URL path e.g. "/tools/qr-generator"
 * @param {string} ogImage - OG image path, defaults to /og-image.png
 * @param {string} toolName - If this is a tool page, its display name (for JSON-LD)
 * @param {string} toolDescription - Full description for JSON-LD (falls back to description)
 */
function SEOHead({
  title,
  description,
  path = "",
  ogImage = "/og-image.png",
  toolName = null,
  toolDescription = null,
}) {
  const fullTitle = title
    ? `${title} — ${SITE_NAME}`
    : `${SITE_NAME} — 140+ Free Online Utilities`;
  const url = `${SITE}${path}`;
  const ogImageFull = `${SITE}${ogImage}`;

  // JSON-LD for individual tool pages
  const toolSchema = toolName
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: toolName,
        url: url,
        description: toolDescription || description,
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        provider: {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE,
        },
      }
    : null;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImageFull} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@utilsflow" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageFull} />

      {/* Tool-specific JSON-LD */}
      {toolSchema && (
        <script type="application/ld+json">
          {JSON.stringify(toolSchema)}
        </script>
      )}
    </Helmet>
  );
}

export default SEOHead;