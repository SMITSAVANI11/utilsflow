// App.jsx — Main Router with lazy-loaded routes
import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useAppContext } from "./context/AppContext";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import CommandPalette from "./components/CommandPalette.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

// Pages
const Home = lazy(() => import("./pages/Home.jsx"));

// 📸 Image Tools
const ColorPalette = lazy(() => import("./tools/image/ColorPalette.jsx"));
const GradientGenerator = lazy(() => import("./tools/image/GradientGenerator.jsx"));
const MemeGenerator = lazy(() => import("./tools/image/MemeGenerator.jsx"));
const ColorConverter = lazy(() => import("./tools/image/ColorConverter.jsx"));
const QRGenerator = lazy(() => import("./tools/image/QRGenerator.jsx"));
const AspectRatio = lazy(() => import("./tools/image/AspectRatio.jsx"));
const PNGToJPG = lazy(() => import("./tools/image/PNGToJPG.jsx"));
const ImageToPNG = lazy(() => import("./tools/image/ImageToPNG.jsx"));
const ImageToJPG = lazy(() => import("./tools/image/ImageToJPG.jsx"));
const WebPToPNG = lazy(() => import("./tools/image/WebPToPNG.jsx"));
const IconConverter = lazy(() => import("./tools/image/IconConverter.jsx"));
const ImageCropper = lazy(() => import("./tools/image/ImageCropper.jsx"));
const ImageResizer = lazy(() => import("./tools/image/ImageResizer.jsx"));
const ImageRotator = lazy(() => import("./tools/image/ImageRotator.jsx"));
const BrightnessAdjuster = lazy(() => import("./tools/image/BrightnessAdjuster.jsx"));
const ImageBlur = lazy(() => import("./tools/image/ImageBlur.jsx"));
const ImageSharpen = lazy(() => import("./tools/image/ImageSharpen.jsx"));
const WatermarkAdder = lazy(() => import("./tools/image/WatermarkAdder.jsx"));
const ImageMetadataViewer = lazy(() => import("./tools/image/ImageMetadataViewer.jsx"));
const GIFMaker = lazy(() => import("./tools/image/GIFMaker.jsx"));
const PhotoCollage = lazy(() => import("./tools/image/PhotoCollage.jsx"));

// 📄 PDF Tools
const PDFViewer = lazy(() => import("./tools/pdf/PDFViewer.jsx"));
const PDFMerge = lazy(() => import("./tools/pdf/PDFMerge.jsx"));
const PDFSplit = lazy(() => import("./tools/pdf/PDFSplit.jsx"));
const PDFExtract = lazy(() => import("./tools/pdf/PDFExtract.jsx"));
const ImageToPDF = lazy(() => import("./tools/pdf/ImageToPDF.jsx"));
const DigitalSignature = lazy(() => import("./tools/pdf/DigitalSignature.jsx"));
const PasswordProtectPDF = lazy(() => import("./tools/pdf/PasswordProtectPDF.jsx"));

// 🔍 SEO Tools
const LongTailGenerator = lazy(() => import("./tools/seo/LongTailGenerator.jsx"));
const QuestionKeywordFinder = lazy(() => import("./tools/seo/QuestionKeywordFinder.jsx"));
const RelatedKeywordsGenerator = lazy(() => import("./tools/seo/RelatedKeywordsGenerator.jsx"));
const LSIKeywordGenerator = lazy(() => import("./tools/seo/LSIKeywordGenerator.jsx"));
const KeywordClusteringTool = lazy(() => import("./tools/seo/KeywordClusteringTool.jsx"));
const KeywordIntentAnalyzer = lazy(() => import("./tools/seo/KeywordIntentAnalyzer.jsx"));
const NicheKeywordFinder = lazy(() => import("./tools/seo/NicheKeywordFinder.jsx"));
const LocalKeywordGenerator = lazy(() => import("./tools/seo/LocalKeywordGenerator.jsx"));
const SERPPreviewTool = lazy(() => import("./tools/seo/SERPPreviewTool.jsx"));
const RichResultsTester = lazy(() => import("./tools/seo/RichResultsTester.jsx"));
const MetaTitleGenerator = lazy(() => import("./tools/seo/MetaTitleGenerator.jsx"));
const MetaDescriptionGenerator = lazy(() => import("./tools/seo/MetaDescriptionGenerator.jsx"));
const MetaTagAnalyzer = lazy(() => import("./tools/seo/MetaTagAnalyzer.jsx"));
const OpenGraphGenerator = lazy(() => import("./tools/seo/OpenGraphGenerator.jsx"));
const TwitterCardGenerator = lazy(() => import("./tools/seo/TwitterCardGenerator.jsx"));
const RobotsMetaTagGenerator = lazy(() => import("./tools/seo/RobotsMetaTagGenerator.jsx"));
const CanonicalTagGenerator = lazy(() => import("./tools/seo/CanonicalTagGenerator.jsx"));
const HreflangTagGenerator = lazy(() => import("./tools/seo/HreflangTagGenerator.jsx"));
const SEOContentAnalyzer = lazy(() => import("./tools/seo/SEOContentAnalyzer.jsx"));
const ReadabilityChecker = lazy(() => import("./tools/seo/ReadabilityChecker.jsx"));
const ContentGapAnalyzer = lazy(() => import("./tools/seo/ContentGapAnalyzer.jsx"));
const DuplicateContentChecker = lazy(() => import("./tools/seo/DuplicateContentChecker.jsx"));
const HeadingStructureAnalyzer = lazy(() => import("./tools/seo/HeadingStructureAnalyzer.jsx"));
const InternalLinkSuggestionTool = lazy(() => import("./tools/seo/InternalLinkSuggestionTool.jsx"));
const ImageAltTextGenerator = lazy(() => import("./tools/seo/ImageAltTextGenerator.jsx"));
const RobotsTxtGenerator = lazy(() => import("./tools/seo/RobotsTxtGenerator.jsx"));
const XMLSitemapGenerator = lazy(() => import("./tools/seo/XMLSitemapGenerator.jsx"));
const SitemapURLExtractor = lazy(() => import("./tools/seo/SitemapURLExtractor.jsx"));
const SchemaGenerator = lazy(() => import("./tools/seo/SchemaGenerator.jsx"));
const FAQSchemaGenerator = lazy(() => import("./tools/seo/FAQSchemaGenerator.jsx"));
const MobileFriendlyChecker = lazy(() => import("./tools/seo/MobileFriendlyChecker.jsx"));
const URLParser = lazy(() => import("./tools/seo/URLParser.jsx"));
const URLRewriting = lazy(() => import("./tools/seo/URLRewriting.jsx"));
const UTMBuilder = lazy(() => import("./tools/seo/UTMBuilder.jsx"));
const UTMAnalyzer = lazy(() => import("./tools/seo/UTMAnalyzer.jsx"));
const YouTubeTagGenerator = lazy(() => import("./tools/seo/YouTubeTagGenerator.jsx"));
const YouTubeKeywordTool = lazy(() => import("./tools/seo/YouTubeKeywordTool.jsx"));
const YouTubeTitleGenerator = lazy(() => import("./tools/seo/YouTubeTitleGenerator.jsx"));
const YouTubeDescriptionGenerator = lazy(() => import("./tools/seo/YouTubeDescriptionGenerator.jsx"));
const YouTubeHashtagGenerator = lazy(() => import("./tools/seo/YouTubeHashtagGenerator.jsx"));
const YouTubeThumbnailDownloader = lazy(() => import("./tools/seo/YouTubeThumbnailDownloader.jsx"));
const LinkedInSharePreview = lazy(() => import("./tools/seo/LinkedInSharePreview.jsx"));
const RobotsTxtValidator = lazy(() => import("./tools/seo/RobotsTxtValidator.jsx"));
const XMLSitemapValidator = lazy(() => import("./tools/seo/XMLSitemapValidator.jsx"));
const LocalBusinessSchemaGenerator = lazy(() => import("./tools/seo/LocalBusinessSchemaGenerator.jsx"));
const ReviewSchemaGenerator = lazy(() => import("./tools/seo/ReviewSchemaGenerator.jsx"));
const EventSchemaGenerator = lazy(() => import("./tools/seo/EventSchemaGenerator.jsx"));
const RecipeSchemaGenerator = lazy(() => import("./tools/seo/RecipeSchemaGenerator.jsx"));
const BreadcrumbSchemaGenerator = lazy(() => import("./tools/seo/BreadcrumbSchemaGenerator.jsx"));
const ImageSitemapGenerator = lazy(() => import("./tools/seo/ImageSitemapGenerator.jsx"));

// ✍️ Text Tools
const WordCounter = lazy(() => import("./tools/text/WordCounter.jsx"));
const BusinessNameGenerator = lazy(() => import("./tools/text/BusinessNameGenerator.jsx"));
const TextCaseConverter = lazy(() => import("./tools/text/TextCaseConverter.jsx"));
const LoremIpsumGenerator = lazy(() => import("./tools/text/LoremIpsumGenerator.jsx"));
const MarkdownPreviewer = lazy(() => import("./tools/text/MarkdownPreviewer.jsx"));
const AIPromptGenerator = lazy(() => import("./tools/text/AIPromptGenerator.jsx"));
const AIEmailWriter = lazy(() => import("./tools/text/AIEmailWriter.jsx"));
const CharacterCounter = lazy(() => import("./tools/text/CharacterCounter.jsx"));
const SentenceCounter = lazy(() => import("./tools/text/SentenceCounter.jsx"));
const ParagraphCounter = lazy(() => import("./tools/text/ParagraphCounter.jsx"));
const LineCounter = lazy(() => import("./tools/text/LineCounter.jsx"));
const TextCleaner = lazy(() => import("./tools/text/TextCleaner.jsx"));
const TextReverser = lazy(() => import("./tools/text/TextReverser.jsx"));
const TextToBinary = lazy(() => import("./tools/text/TextToBinary.jsx"));
const TextToASCII = lazy(() => import("./tools/text/TextToASCII.jsx"));
const TextToMorseCode = lazy(() => import("./tools/text/TextToMorseCode.jsx"));
const WordFrequencyAnalyzer = lazy(() => import("./tools/text/WordFrequencyAnalyzer.jsx"));
const NGramAnalyzer = lazy(() => import("./tools/text/NGramAnalyzer.jsx"));
const ReadingEaseCalculator = lazy(() => import("./tools/text/ReadingEaseCalculator.jsx"));
const ClickbaitTitleGenerator = lazy(() => import("./tools/text/ClickbaitTitleGenerator.jsx"));
const HookGenerator = lazy(() => import("./tools/text/HookGenerator.jsx"));

// 💻 Developer Tools
const JSONFormatter = lazy(() => import("./tools/developer/JSONFormatter.jsx"));
const Base64Tool = lazy(() => import("./tools/developer/Base64Tool.jsx"));
const UUIDGenerator = lazy(() => import("./tools/developer/UUIDGenerator.jsx"));
const RegexTester = lazy(() => import("./tools/developer/RegexTester.jsx"));
const URLEncoderDecoder = lazy(() => import("./tools/developer/URLEncoderDecoder.jsx"));
const HTTPStatusExplorer = lazy(() => import("./tools/developer/HTTPStatusExplorer.jsx"));
const NumberConverter = lazy(() => import("./tools/developer/NumberConverter.jsx"));
const HTMLBeautifier = lazy(() => import("./tools/developer/HTMLBeautifier.jsx"));
const CSSBeautifier = lazy(() => import("./tools/developer/CSSBeautifier.jsx"));
const JavaScriptBeautifier = lazy(() => import("./tools/developer/JavaScriptBeautifier.jsx"));
const JSONtoXMLConverter = lazy(() => import("./tools/developer/JSONtoXMLConverter.jsx"));
const XMLtoJSONConverter = lazy(() => import("./tools/developer/XMLtoJSONConverter.jsx"));
const SubnetCalculator = lazy(() => import("./tools/developer/SubnetCalculator.jsx"));
const CronExpressionGenerator = lazy(() => import("./tools/developer/CronExpressionGenerator.jsx"));
const CronExpressionTester = lazy(() => import("./tools/developer/CronExpressionTester.jsx"));

// 📐 Math & Calculators
const SIPCalculator = lazy(() => import("./tools/math/SIPCalculator.jsx"));
const EMICalculator = lazy(() => import("./tools/math/EMICalculator.jsx"));
const ExpenseSplitter = lazy(() => import("./tools/math/ExpenseSplitter.jsx"));
const TipCalculator = lazy(() => import("./tools/math/TipCalculator.jsx"));
const GSTCalculator = lazy(() => import("./tools/math/GSTCalculator.jsx"));
const FreelanceRateCalc = lazy(() => import("./tools/math/FreelanceRateCalc.jsx"));
const GSTInvoice = lazy(() => import("./tools/math/GSTInvoice.jsx"));
const AgeCalculator = lazy(() => import("./tools/math/AgeCalculator.jsx"));
const BMICalculator = lazy(() => import("./tools/math/BMICalculator.jsx"));
const ScientificCalculator = lazy(() => import("./tools/math/ScientificCalculator.jsx"));
const PercentageCalculator = lazy(() => import("./tools/math/PercentageCalculator.jsx"));

// 📏 Unit Converters
const UnitConverter = lazy(() => import("./tools/unit-converter/UnitConverter.jsx"));
const CurrencyConverter = lazy(() => import("./tools/unit-converter/CurrencyConverter.jsx"));
const TimeZoneConverter = lazy(() => import("./tools/unit-converter/TimeZoneConverter.jsx"));

// 🔒 Security Tools
const PasswordGenerator = lazy(() => import("./tools/security/PasswordGenerator.jsx"));
const HashGenerator = lazy(() => import("./tools/security/HashGenerator.jsx"));
const JWTDecoder = lazy(() => import("./tools/security/JWTDecoder.jsx"));

// 📱 Social Media Tools
const BioGenerator = lazy(() => import("./tools/social/BioGenerator.jsx"));
const AIHashtagGenerator = lazy(() => import("./tools/social/AIHashtagGenerator.jsx"));
const AIYouTubeTitles = lazy(() => import("./tools/social/AIYouTubeTitles.jsx"));

// ⚙️ Miscellaneous Tools
const EmojiFinder = lazy(() => import("./tools/misc/EmojiFinder.jsx"));
const PomodoroTimer = lazy(() => import("./tools/misc/PomodoroTimer.jsx"));
const CountdownTimer = lazy(() => import("./tools/misc/CountdownTimer.jsx"));
const HabitTracker = lazy(() => import("./tools/misc/HabitTracker.jsx"));
const TypingTest = lazy(() => import("./tools/misc/TypingTest.jsx"));
const ComplimentGenerator = lazy(() => import("./tools/misc/ComplimentGenerator.jsx"));
const QuizApp = lazy(() => import("./tools/misc/QuizApp.jsx"));

// 404
function NotFound() {
  return (
    <div className="tool-page fade-in" style={{ textAlign: "center" }}>
      <div className="tool-page-inner">
        <p style={{ fontSize: "80px" }}>🔭</p>
        <h1 className="tool-title" style={{ marginTop: "16px" }}>
          404 — Page Not Found
        </h1>
        <p className="tool-description">This page doesn't exist in this universe.</p>
        <a href="/" className="btn-primary" style={{ display: "inline-flex", marginTop: "20px" }}>
          🏠 Go Home
        </a>
      </div>
    </div>
  );
}

// Scroll restoration on route change
function RouteAwareScrollTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  return null;
}

// Command palette keyboard listener
function GlobalKeyListener() {
  const { setCommandPaletteOpen } = useAppContext();
  useEffect(() => {
    function handler(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setCommandPaletteOpen]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <RouteAwareScrollTop />
      <GlobalKeyListener />
      <Navbar />
      <CommandPalette />
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />

              {/* 🎨 Creative */}
              <Route path="/tools/color-palette" element={<ColorPalette />} />
              <Route path="/tools/gradient-generator" element={<GradientGenerator />} />
              <Route path="/tools/meme-generator" element={<MemeGenerator />} />
              <Route path="/tools/color-converter" element={<ColorConverter />} />
              <Route path="/tools/emoji-finder" element={<EmojiFinder />} />

              {/* ✍️ Text */}
              <Route path="/tools/word-counter" element={<WordCounter />} />
              <Route path="/tools/password-generator" element={<PasswordGenerator />} />
              <Route path="/tools/bio-generator" element={<BioGenerator />} />
              <Route path="/tools/business-name-generator" element={<BusinessNameGenerator />} />
              <Route path="/tools/text-case-converter" element={<TextCaseConverter />} />
              <Route path="/tools/lorem-ipsum" element={<LoremIpsumGenerator />} />
              <Route path="/tools/markdown-previewer" element={<MarkdownPreviewer />} />
              <Route path="/tools/character-counter" element={<CharacterCounter />} />
              <Route path="/tools/sentence-counter" element={<SentenceCounter />} />
              <Route path="/tools/paragraph-counter" element={<ParagraphCounter />} />
              <Route path="/tools/line-counter" element={<LineCounter />} />
              <Route path="/tools/text-cleaner" element={<TextCleaner />} />
              <Route path="/tools/text-reverser" element={<TextReverser />} />
              <Route path="/tools/text-to-binary" element={<TextToBinary />} />
              <Route path="/tools/text-to-ascii" element={<TextToASCII />} />
              <Route path="/tools/text-to-morse" element={<TextToMorseCode />} />
              <Route path="/tools/word-frequency" element={<WordFrequencyAnalyzer />} />
              <Route path="/tools/ngram-analyzer" element={<NGramAnalyzer />} />
              <Route path="/tools/reading-ease" element={<ReadingEaseCalculator />} />
              <Route path="/tools/clickbait-generator" element={<ClickbaitTitleGenerator />} />
              <Route path="/tools/hook-generator" element={<HookGenerator />} />

              {/* 📸 Image */}
              <Route path="/tools/qr-generator" element={<QRGenerator />} />
              <Route path="/tools/aspect-ratio" element={<AspectRatio />} />
              <Route path="/tools/png-to-jpg" element={<PNGToJPG />} />
              <Route path="/tools/image-to-png" element={<ImageToPNG />} />
              <Route path="/tools/image-to-jpg" element={<ImageToJPG />} />
              <Route path="/tools/webp-to-png" element={<WebPToPNG />} />
              <Route path="/tools/icon-converter" element={<IconConverter />} />
              <Route path="/tools/image-cropper" element={<ImageCropper />} />
              <Route path="/tools/image-resizer" element={<ImageResizer />} />
              <Route path="/tools/image-rotator" element={<ImageRotator />} />
              <Route path="/tools/brightness-adjuster" element={<BrightnessAdjuster />} />
              <Route path="/tools/image-blur" element={<ImageBlur />} />
              <Route path="/tools/image-sharpen" element={<ImageSharpen />} />
              <Route path="/tools/watermark-adder" element={<WatermarkAdder />} />
              <Route path="/tools/image-metadata-viewer" element={<ImageMetadataViewer />} />
              <Route path="/tools/gif-maker" element={<GIFMaker />} />
              <Route path="/tools/photo-collage" element={<PhotoCollage />} />

              {/* 📄 PDF */}
              <Route path="/tools/pdf-viewer" element={<PDFViewer />} />
              <Route path="/tools/pdf-merge" element={<PDFMerge />} />
              <Route path="/tools/pdf-split" element={<PDFSplit />} />
              <Route path="/tools/pdf-extract" element={<PDFExtract />} />
              <Route path="/tools/image-to-pdf" element={<ImageToPDF />} />
              <Route path="/tools/digital-signature" element={<DigitalSignature />} />
              <Route path="/tools/password-protect-pdf" element={<PasswordProtectPDF />} />

              {/* 🔍 SEO */}
              <Route path="/tools/long-tail" element={<LongTailGenerator />} />
              <Route path="/tools/question-keyword" element={<QuestionKeywordFinder />} />
              <Route path="/tools/related-keywords" element={<RelatedKeywordsGenerator />} />
              <Route path="/tools/lsi-keywords" element={<LSIKeywordGenerator />} />
              <Route path="/tools/keyword-clustering" element={<KeywordClusteringTool />} />
              <Route path="/tools/keyword-intent" element={<KeywordIntentAnalyzer />} />
              <Route path="/tools/niche-keywords" element={<NicheKeywordFinder />} />
              <Route path="/tools/local-keywords" element={<LocalKeywordGenerator />} />
              <Route path="/tools/serp-preview" element={<SERPPreviewTool />} />
              <Route path="/tools/rich-results" element={<RichResultsTester />} />
              <Route path="/tools/meta-title" element={<MetaTitleGenerator />} />
              <Route path="/tools/meta-description" element={<MetaDescriptionGenerator />} />
              <Route path="/tools/meta-analyzer" element={<MetaTagAnalyzer />} />
              <Route path="/tools/open-graph" element={<OpenGraphGenerator />} />
              <Route path="/tools/twitter-card" element={<TwitterCardGenerator />} />
              <Route path="/tools/robots-meta" element={<RobotsMetaTagGenerator />} />
              <Route path="/tools/canonical-tag" element={<CanonicalTagGenerator />} />
              <Route path="/tools/hreflang-tag" element={<HreflangTagGenerator />} />
              <Route path="/tools/seo-content-analyzer" element={<SEOContentAnalyzer />} />
              <Route path="/tools/readability-checker" element={<ReadabilityChecker />} />
              <Route path="/tools/content-gap" element={<ContentGapAnalyzer />} />
              <Route path="/tools/duplicate-content" element={<DuplicateContentChecker />} />
              <Route path="/tools/heading-structure" element={<HeadingStructureAnalyzer />} />
              <Route path="/tools/internal-link" element={<InternalLinkSuggestionTool />} />
              <Route path="/tools/faq-schema" element={<FAQSchemaGenerator />} />
              <Route path="/tools/robots-generator" element={<RobotsTxtGenerator />} />
              <Route path="/tools/xml-sitemap" element={<XMLSitemapGenerator />} />
              <Route path="/tools/sitemap-extractor" element={<SitemapURLExtractor />} />
              <Route path="/tools/mobile-friendly" element={<MobileFriendlyChecker />} />
              <Route path="/tools/url-parser" element={<URLParser />} />
              <Route path="/tools/url-rewriting" element={<URLRewriting />} />
              <Route path="/tools/utm-builder" element={<UTMBuilder />} />
              <Route path="/tools/utm-analyzer" element={<UTMAnalyzer />} />
              <Route path="/tools/schema-generator" element={<SchemaGenerator />} />
              <Route path="/tools/image-alt" element={<ImageAltTextGenerator />} />
              <Route path="/tools/yt-tags" element={<YouTubeTagGenerator />} />
              <Route path="/tools/yt-keywords" element={<YouTubeKeywordTool />} />
              <Route path="/tools/yt-title" element={<YouTubeTitleGenerator />} />
              <Route path="/tools/yt-description" element={<YouTubeDescriptionGenerator />} />
              <Route path="/tools/yt-hashtags" element={<YouTubeHashtagGenerator />} />
              <Route path="/tools/yt-thumbnail" element={<YouTubeThumbnailDownloader />} />
              <Route path="/tools/social-preview" element={<LinkedInSharePreview />} />
              <Route path="/tools/robots-validator" element={<RobotsTxtValidator />} />
              <Route path="/tools/xml-sitemap-validator" element={<XMLSitemapValidator />} />
              <Route path="/tools/local-business-schema" element={<LocalBusinessSchemaGenerator />} />
              <Route path="/tools/review-schema" element={<ReviewSchemaGenerator />} />
              <Route path="/tools/event-schema" element={<EventSchemaGenerator />} />
              <Route path="/tools/recipe-schema" element={<RecipeSchemaGenerator />} />
              <Route path="/tools/breadcrumb-schema" element={<BreadcrumbSchemaGenerator />} />
              <Route path="/tools/image-sitemap" element={<ImageSitemapGenerator />} />

              {/* 💰 Finance */}
              <Route path="/tools/sip-calculator" element={<SIPCalculator />} />
              <Route path="/tools/emi-calculator" element={<EMICalculator />} />
              <Route path="/tools/expense-splitter" element={<ExpenseSplitter />} />
              <Route path="/tools/tip-calculator" element={<TipCalculator />} />
              <Route path="/tools/gst-calculator" element={<GSTCalculator />} />
              <Route path="/tools/freelance-rate-calculator" element={<FreelanceRateCalc />} />
              <Route path="/tools/gst-invoice" element={<GSTInvoice />} />

              {/* 📅 Productivity */}
              <Route path="/tools/pomodoro-timer" element={<PomodoroTimer />} />
              <Route path="/tools/age-calculator" element={<AgeCalculator />} />
              <Route path="/tools/habit-tracker" element={<HabitTracker />} />
              <Route path="/tools/unit-converter" element={<UnitConverter />} />
              <Route path="/tools/countdown-timer" element={<CountdownTimer />} />
              <Route path="/tools/bmi-calculator" element={<BMICalculator />} />

              {/* 🎮 Fun */}
              <Route path="/tools/typing-test" element={<TypingTest />} />
              <Route path="/tools/compliment-generator" element={<ComplimentGenerator />} />
              <Route path="/tools/quiz-app" element={<QuizApp />} />

              {/* 💻 Developer */}
              <Route path="/tools/json-formatter" element={<JSONFormatter />} />
              <Route path="/tools/base64-tool" element={<Base64Tool />} />
              <Route path="/tools/uuid-generator" element={<UUIDGenerator />} />
              <Route path="/tools/hash-generator" element={<HashGenerator />} />
              <Route path="/tools/regex-tester" element={<RegexTester />} />
              <Route path="/tools/url-encoder" element={<URLEncoderDecoder />} />
              <Route path="/tools/jwt-decoder" element={<JWTDecoder />} />
              <Route path="/tools/http-status" element={<HTTPStatusExplorer />} />
              <Route path="/tools/number-converter" element={<NumberConverter />} />
              <Route path="/tools/html-beautifier" element={<HTMLBeautifier />} />
              <Route path="/tools/css-beautifier" element={<CSSBeautifier />} />
              <Route path="/tools/js-beautifier" element={<JavaScriptBeautifier />} />
              <Route path="/tools/json-to-xml" element={<JSONtoXMLConverter />} />
              <Route path="/tools/xml-to-json" element={<XMLtoJSONConverter />} />
              <Route path="/tools/subnet-calculator" element={<SubnetCalculator />} />
              <Route path="/tools/cron-generator" element={<CronExpressionGenerator />} />
              <Route path="/tools/cron-tester" element={<CronExpressionTester />} />

              {/* 📐 Math */}
              <Route path="/tools/scientific-calculator" element={<ScientificCalculator />} />
              <Route path="/tools/percentage-calculator" element={<PercentageCalculator />} />

              {/* 📏 Unit Converters */}
              <Route path="/tools/currency-converter" element={<CurrencyConverter />} />
              <Route path="/tools/timezone-converter" element={<TimeZoneConverter />} />

              {/* 🤖 AI */}
              <Route path="/tools/ai-prompt-generator" element={<AIPromptGenerator />} />
              <Route path="/tools/ai-hashtag-generator" element={<AIHashtagGenerator />} />
              <Route path="/tools/ai-email-writer" element={<AIEmailWriter />} />
              <Route path="/tools/ai-youtube-titles" element={<AIYouTubeTitles />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </Suspense>
      </ErrorBoundary>
      <Footer />
      <ScrollToTop />
    </BrowserRouter>
  );
}

export default App;
