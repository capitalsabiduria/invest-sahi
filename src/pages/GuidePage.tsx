import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import { supabase } from "@/integrations/supabase/client";
import { BRAND } from "@/constants/brand";
import SEO from "@/components/SEO";

interface GuideContent {
  meta_description?: string;
  hero_headline: string;
  hero_subline: string;
  story_paragraph?: string;
  case_study?: {
    challenge: string;
    strategy: string;
    result: string;
  };
  how_it_works?: string;
  why_section: {
    heading: string;
    points: string[];
  };
  local_insight?: string;
  services: Array<{
    name: string;
    entry_amount: string;
    description: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  trust_note: string;
  cta_headline: string;
  cta_subline: string;
}

interface SeoPage {
  id: string;
  title: string;
  meta_description: string;
  type: string;
  slug: string;
  content: GuideContent | null;
}

function SchemaMarkup({ page, content, baseSlug }: { page: SeoPage; content: GuideContent; baseSlug: string }) {
  const finSvcSchema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": BRAND.name,
    "description": content.meta_description || page.meta_description,
    "url": `https://investsahi.in/en/${baseSlug}`,
    "telephone": BRAND.contact.phone,
    "email": BRAND.contact.email,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": BRAND.address.street,
      "addressLocality": BRAND.address.city,
      "addressRegion": BRAND.address.state,
      "postalCode": BRAND.address.pin,
      "addressCountry": "IN"
    },
    "areaServed": { "@type": "State", "name": "Odisha" },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Financial Services",
      "itemListElement": content.services.map(s => ({
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": s.name, "description": s.description }
      }))
    }
  };

  const faqSchema = content.faqs && content.faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
    }))
  } : null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(faqSchema ? [finSvcSchema, faqSchema] : finSvcSchema)
      }}
    />
  );
}

function buildWhatsAppUrl(slug: string | undefined, language: string): string {
  const base = 'https://wa.me/919337370992';
  if (!slug) return base;

  let message: string;

  if (slug.includes('how-much-sip-for-1-crore')) {
    const cityRaw = slug.replace('how-much-sip-for-1-crore', '').replace(/^-/, '');
    const city = cityRaw ? cityRaw.charAt(0).toUpperCase() + cityRaw.slice(1) : '';
    if (language === 'or') {
      message = city
        ? `ନମସ୍କାର! ମୁଁ ${city}ରେ ₹1 କୋଟି SIP ଗାଇଡ୍ ଦେଖିଲି। ଆମ ଏକ ଯୋଜନା ବିଷୟରେ କଥା ହୁଅନ୍ତୁ।`
        : `ନମସ୍କାର! ₹1 କୋଟି SIP ଯୋଜନା ବିଷୟରେ ଆଲୋଚନା କରିବାକୁ ଚାହୁଁଛି।`;
    } else {
      message = city
        ? `Hi! I read your guide on how much SIP I need for ₹1 Crore in ${city}. Can we build a plan for me?`
        : `Hi! I read your guide on how much SIP I need for ₹1 Crore. Can we build a plan for me?`;
    }
  } else {
    const readable = slug
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
    if (language === 'or') {
      message = `ନମସ୍କାର! ମୁଁ InvestSahi ଗାଇଡ୍ ଦେଖିଲି (${readable})। ଅଧିକ ଜାଣିବାକୁ ଚାହୁଁଛି।`;
    } else {
      message = `Hi! I found your guide on "${readable}" at InvestSahi. I'd like to learn more about investing.`;
    }
  }

  return `${base}?text=${encodeURIComponent(message)}`;
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EDD8]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="animate-spin">
        <circle cx="24" cy="24" r="20" stroke="#E8820C" strokeWidth="3" strokeDasharray="31.4 94.2" />
      </svg>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EDD8] gap-6 px-4">
      <Link to="/" className="text-2xl font-heading font-bold">
        <span style={{ color: '#E8820C' }}>Invest</span>
        <span style={{ color: '#2C1810' }}>Sahi</span>
        <span style={{ color: '#1B6B3A', fontSize: '0.6em' }}>.in</span>
      </Link>
      <h1 className="font-heading font-bold text-2xl text-[#2C1810]">Page not found</h1>
      <p className="font-body text-[#2C1810] opacity-70">This page doesn't exist or hasn't been published yet.</p>
      <Link to="/" className="bg-[#E8820C] text-white font-body px-6 py-3 rounded-lg hover:bg-[#C45C00] transition-colors">
        Go to Homepage
      </Link>
    </div>
  );
}

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [page, setPage] = useState<SeoPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const isPureOdia = location.pathname.startsWith('/or/');
  const isMixed    = location.pathname.startsWith('/odia/');
  const isOdia     = isPureOdia || isMixed;
  const language   = isOdia ? 'or' : 'en';
  const audience_style = isPureOdia ? 'pure_odia' : isMixed ? 'mixed' : 'standard';
  const baseSlug   = slug!;
  const otherLangUrl = isOdia ? `/en/${slug}` : `/or/${slug}`;

  const t = {
    caseStudyHeading: audience_style === 'pure_odia' ? 'ଆମେ କିପରି ସାହାଯ୍ୟ କଲୁ — ଏକ ବାସ୍ତବ ଉଦାହରଣ' : 'How We Helped — A Real Example',
    challenge: audience_style === 'pure_odia' ? 'ଆହ୍ୱାନ' : 'The Challenge',
    whatWeDid: audience_style === 'pure_odia' ? 'ଆମେ ଯାହା କଲୁ' : 'What We Did',
    result: audience_style === 'pure_odia' ? 'ଫଳାଫଳ' : 'The Result',
    howItWorks: audience_style === 'pure_odia' ? 'ଏହା କିପରି କାମ କରେ' : 'How It Works',
    freeConversation: audience_style === 'pure_odia' ? 'ନିଃଶୁଳ୍କ କଥାବାର୍ତ୍ତା' : 'Free conversation',
    personalPlan: audience_style === 'pure_odia' ? 'ଆପଣଙ୍କ ଯୋଜନା' : 'Your personal plan',
    startFrom: audience_style === 'pure_odia' ? '₹500 ରୁ ଆରମ୍ଭ' : 'Start from ₹500',
    servicesHeading: audience_style === 'pure_odia' ? 'ଆମେ ଆପଣଙ୍କୁ କେଉଁ ବିଷୟରେ ସାହାଯ୍ୟ କରୁ' : 'What We Help You With',
    faqHeading: audience_style === 'pure_odia' ? 'ସାଧାରଣ ପ୍ରଶ୍ନ' : 'Frequently Asked Questions',
    bookConsultation: audience_style === 'pure_odia' ? 'ନିଃଶୁଳ୍କ ପରାମର୍ଶ ବୁକ୍ କରନ୍ତୁ →' : 'Book Free Consultation →',
    bookCall: audience_style === 'pure_odia' ? 'ନିଃଶୁଳ୍କ କଲ୍ ବୁକ୍ କରନ୍ତୁ' : 'Book a Free Call',
    whatsapp: audience_style === 'pure_odia' ? 'WhatsApp କରନ୍ତୁ' : 'WhatsApp Us',
    heroCtaPrimary: audience_style === 'pure_odia' ? 'ନିଃଶୁଳ୍କ ପରାମର୍ଶ ବୁକ୍ କରନ୍ତୁ →' : 'Book Free Consultation →',
    heroCtaSecondary: audience_style === 'pure_odia' ? 'SIP କ୍ୟାଲକୁଲେଟର ଦେଖନ୍ତୁ →' : 'Try the SIP Calculator →',
    storyAttribution: audience_style === 'pure_odia' ? '— ଓଡ଼ିଶାର ଏକ କାହାଣୀ। ଗୋପନୀୟତା ପାଇଁ ନାମ ପରିବର୍ତ୍ତନ କରାଯାଇଛି।' : '— A story from Odisha. Names changed for privacy.',
    localInsightLabel: audience_style === 'pure_odia' ? 'ସ୍ଥାନୀୟ ଜ୍ଞାନ' : 'Local Insight',
    chatWhatsapp: audience_style === 'pure_odia' ? 'WhatsApp ରେ କଥା ହୁଅନ୍ତୁ' : 'Chat with us on WhatsApp',
    ourServicesLabel: audience_style === 'pure_odia' ? 'ଆମ ସେବା:' : 'Our services:',
    missionText: audience_style === 'pure_odia' ? 'Investment ସମସ୍ତଙ୍କ ପାଇଁ। ଆସନ୍ତୁ ପ୍ରମାଣ କରୁ।' : "Investing is for everyone. Let's prove it.",
    ourStory: audience_style === 'pure_odia' ? 'ଆମ କାହାଣୀ →' : 'Our story →',
    slimTagline: audience_style === 'pure_odia' ? 'ଓଡ଼ିଶାର ନିଜ Financial Services Platform' : "Odisha's Homegrown Financial Services Platform",
    servicesNav: audience_style === 'pure_odia' ? 'ସେବା' : 'Services',
    aboutNav: audience_style === 'pure_odia' ? 'ଆମ ବିଷୟରେ' : 'About',
    serviceRibbonItems: audience_style === 'pure_odia'
      ? ['SIP ଏବଂ Mutual Funds', 'Term Insurance', 'NPS ଏବଂ ଅବସର', 'Personal Loan', 'Fixed Deposit']
      : ['SIP & Mutual Funds', 'Term Insurance', 'NPS & Retirement', 'Personal Loan', 'Fixed Deposit'],
    footerAboutItems: audience_style === 'pure_odia'
      ? ['ଆମ କାହାଣୀ', 'ମିଟିଂ ବୁକ୍ କରନ୍ତୁ', 'ଟଙ୍କା ସ୍କୁଲ']
      : ['Our Story', 'Book a Meeting', 'Money School'],
  };

  const BOOKING_FORM_URL = `/${language}/book`;

  useEffect(() => {
    if (!slug) return;

    async function fetchPage() {
      // Get base page
      const { data: pageData, error: pageError } = await supabase
        .from('seo_pages')
        .select('id, title, meta_description, type, slug')
        .eq('slug', baseSlug)
        .single();

      if (pageError || !pageData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // Get specific version
      const { data: versionData, error: versionError } = await supabase
        .from('page_versions')
        .select('content, status, view_count')
        .eq('page_id', pageData.id)
        .eq('language', language)
        .eq('audience_style', audience_style)
        .single();

      if (versionError || !versionData || versionData.status !== 'live') {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setPage({ ...pageData, content: versionData.content as unknown as GuideContent });

      await supabase.rpc('increment_version_view', {
        p_page_id: pageData.id,
        p_language: language,
        p_audience_style: audience_style
      });

      setLoading(false);
    }

    fetchPage();
  }, [slug]);

  if (loading) return (
    <>
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <LoadingSpinner />
    </>
  );
  if (notFound || !page) return <NotFound />;

  const content = page.content as GuideContent | null;

  if (!content) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EDD8] gap-4 px-4">
      <Helmet><meta name="robots" content="noindex" /></Helmet>
      <h1 className="font-heading font-bold text-xl text-[#2C1810]">Content coming soon</h1>
      <Link to="/" className="bg-[#E8820C] text-white font-body px-6 py-3 rounded-lg">Go to Homepage</Link>
    </div>
  );

  return (
    <>
      <SEO
        title={page.title}
        description={(content as GuideContent).meta_description || page.meta_description}
        url={`/${language}/${slug}`}
        lang={language as 'en' | 'or'}
        slug={baseSlug}
      />
      <SchemaMarkup page={page} content={content as GuideContent} baseSlug={baseSlug} />

      {/* Sticky mini-navbar */}
      <div className="sticky top-0 z-50 bg-[#FAF6EF] border-b border-stone/10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href={`/${language}`} className="flex items-center gap-2">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="3" fill="#E8820C"/>
              {[0,45,90,135,180,225,270,315].map((deg, i) => {
                const len = i % 2 === 0 ? 9 : 5;
                const rad = (deg * Math.PI) / 180;
                return (
                  <line
                    key={deg}
                    x1={14 + 4 * Math.cos(rad)}
                    y1={14 + 4 * Math.sin(rad)}
                    x2={14 + (4 + len) * Math.cos(rad)}
                    y2={14 + (4 + len) * Math.sin(rad)}
                    stroke="#E8820C"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
            <span className="font-heading font-semibold text-base" style={{ color: '#2C1810' }}>
              <span style={{ color: '#E8820C' }}>Invest</span>Sahi
            </span>
          </a>
          <div className="flex items-center gap-3">
            <a
              href={otherLangUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
              style={{ background: '#F5EDD8', color: '#1A6B9A', border: '1px solid #1A6B9A33' }}
            >
              <span className="sm:hidden">{isOdia ? 'EN' : 'ଓଡ଼ିଆ'}</span>
              <span className="hidden sm:inline">{isOdia ? 'Read in English →' : 'ଓଡ଼ିଆରେ ପଢ଼ନ୍ତୁ →'}</span>
            </a>
            <a
              href="https://wa.me/919337370992?text=Hi, I found InvestSahi and want to know more"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white"
              style={{ background: '#25D366' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/>
              </svg>
              <span>{t.whatsapp}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Mission strip */}
      <div className="w-full py-2 px-4 text-center text-sm font-medium text-white" style={{ background: '#E8820C' }}>
        {t.missionText}{' '}
        <a href={`/${language}/about`} className="underline underline-offset-2 opacity-90 hover:opacity-100">
          {t.ourStory}
        </a>
      </div>

      <main className="pb-0" lang={language}>

        {/* Hero */}
        <section className="bg-[#F5EDD8] py-12 md:py-16 px-4 md:px-8">
          <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="font-heading font-bold text-3xl md:text-5xl text-[#2C1810] leading-tight mb-4">
                {content.hero_headline}
              </h1>
              <p className="font-body text-lg text-[#2C1810] opacity-80 mb-8 max-w-xl">
                {content.hero_subline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={buildWhatsAppUrl(baseSlug, language)} target="_blank" rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center bg-[#E8820C] text-white font-body font-semibold px-6 py-3 rounded-lg hover:bg-[#C45C00] transition-colors duration-200">
                  {t.heroCtaPrimary}
                </a>
                {slug?.includes('how-much-sip-for-1-crore') ? (
                  <a href={`/${language}/crore-plan`}
                    className="w-full sm:w-auto text-center bg-[#E8820C] text-white font-body font-semibold px-6 py-3 rounded-lg hover:bg-[#C45C00] transition-colors duration-200">
                    Build ₹1 Crore. Find out how.
                  </a>
                ) : (
                  <button
                    onClick={() => { window.location.href = `/${language}/calculator`; }}
                    className="w-full sm:w-auto text-center border-2 border-[#1B6B3A] text-[#1B6B3A] font-body font-semibold px-6 py-3 rounded-lg hover:bg-[#1B6B3A] hover:text-white transition-colors duration-200"
                  >
                    {t.heroCtaSecondary}
                  </button>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 opacity-15">
              <svg width="160" height="160" viewBox="0 0 180 180" fill="none">
                <circle cx="90" cy="90" r="12" fill="#E8820C" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <line key={i} x1="90" y1="22" x2="90" y2={i % 2 === 0 ? "38" : "32"}
                    stroke="#E8820C" strokeWidth="3" strokeLinecap="round"
                    transform={`rotate(${angle} 90 90)`} />
                ))}
                <circle cx="90" cy="90" r="70" stroke="#E8820C" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
        </section>

        {/* Services ribbon */}
        <div className="w-full py-3 border-b border-stone/10 bg-white">
          <div className="max-w-4xl mx-auto px-4 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-stone/40 font-medium mr-1">{t.ourServicesLabel}</span>
            {t.serviceRibbonItems.map((label) => (
              <a
                key={label}
                href={`/${language}/services`}
                className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:border-[#E8820C] hover:text-[#E8820C]"
                style={{ borderColor: '#D1D5DB', color: '#6B7280' }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* Story */}
        {content.story_paragraph && (
          <section className="bg-white py-14 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="text-6xl text-[#E8820C] opacity-20 font-serif leading-none flex-shrink-0 mt-[-8px]">"</div>
                <div>
                  <p className="font-body text-lg text-[#2C1810] leading-relaxed italic">{content.story_paragraph}</p>
                  <p className="font-body text-sm text-[#2C1810] opacity-50 mt-3">{t.storyAttribution}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Case Study */}
        {content.case_study && (
          <section className="bg-[#F5EDD8] py-14 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading font-bold text-2xl text-[#2C1810] mb-8 text-center">{t.caseStudyHeading}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: t.challenge, text: content.case_study.challenge, color: '#C45C00' },
                  { label: t.whatWeDid, text: content.case_study.strategy, color: '#1A6B9A' },
                  { label: t.result, text: content.case_study.result, color: '#1B6B3A' },
                ].map(item => (
                  <div key={item.label} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="font-heading font-bold text-sm mb-2" style={{ color: item.color }}>{item.label}</div>
                    <p className="font-body text-[#2C1810] text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        {content.how_it_works && (
          <section className="bg-white py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading font-bold text-2xl text-[#2C1810] mb-6">{t.howItWorks}</h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                {[t.freeConversation, t.personalPlan, t.startFrom].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E8820C] text-white font-heading font-bold text-sm flex items-center justify-center flex-shrink-0">{i + 1}</div>
                    <span className="font-body text-sm text-[#2C1810]">{step}</span>
                    {i < 2 && <span className="hidden md:block text-[#2C1810] opacity-30">→</span>}
                  </div>
                ))}
              </div>
              <p className="font-body text-[#2C1810] opacity-75 text-base max-w-xl mx-auto">{content.how_it_works}</p>
            </div>
          </section>
        )}

        {/* Why Section */}
        <section className="bg-[#F5EDD8] py-14 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#2C1810] text-center mb-10">{content.why_section.heading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.why_section.points.map((point, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#1B6B3A]/10 flex items-center justify-center mb-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 4.5" stroke="#1B6B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="font-body text-[#2C1810] text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local Insight */}
        {content.local_insight && (
          <section className="py-12 px-4 md:px-8" style={{ backgroundColor: '#EAF4FB' }}>
            <div className="max-w-3xl mx-auto flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="13" stroke="#1A6B9A" strokeWidth="1.5" />
                  <path d="M14 9v5M14 17v2" stroke="#1A6B9A" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="font-heading font-bold text-sm text-[#1A6B9A] mb-2 uppercase tracking-wide">{t.localInsightLabel}</div>
                <p className="font-body text-[#2C1810] leading-relaxed">{content.local_insight}</p>
              </div>
            </div>
          </section>
        )}

        {/* Services */}
        <section className="bg-[#F5EDD8] py-14 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl text-[#2C1810] text-center mb-10">{t.servicesHeading}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.services.map((service, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-[#2C1810] mb-2">{service.name}</h3>
                    <p className="font-body text-[#2C1810] opacity-75 text-sm leading-relaxed">{service.description}</p>
                  </div>
                  <a href={buildWhatsAppUrl(baseSlug, language)} target="_blank" rel="noopener noreferrer"
                    className="mt-5 w-full text-center bg-[#F5EDD8] hover:bg-[#E8820C] text-[#E8820C] hover:text-white font-body text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 border border-[#E8820C]">
                    {t.bookConsultation}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        {content.faqs && content.faqs.length > 0 && (
          <section className="bg-white py-14 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading font-bold text-2xl text-[#2C1810] text-center mb-10">{t.faqHeading}</h2>
              <div className="space-y-3">
                {content.faqs.map((faq, i) => (
                  <div key={i} className="border border-[#E8820C]/20 rounded-xl overflow-hidden">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left px-4 py-5 min-h-[52px] flex items-center justify-between bg-[#F5EDD8] hover:bg-[#E8820C]/5 transition-colors">
                      <span className="font-body font-semibold text-sm md:text-base text-[#2C1810] pr-4">{faq.question}</span>
                      <span className="text-[#E8820C] flex-shrink-0 text-xl font-bold">{openFaq === i ? '−' : '+'}</span>
                    </button>
                    <div className={`px-4 py-4 bg-white transition-all ${openFaq === i ? 'block' : 'hidden'}`}>
                      <p className="font-body text-[#2C1810] opacity-80 leading-relaxed text-sm">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trust */}
        <section className="py-12 px-4 md:px-8" style={{ backgroundColor: '#EAF4FB' }}>
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M18 3L4 9v10c0 8.3 6 16 14 18 8-2 14-9.7 14-18V9L18 3z" fill="#1A6B9A" opacity="0.15" stroke="#1A6B9A" strokeWidth="1.5" />
                <path d="M12 18l4 4 8-8" stroke="#1A6B9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-body text-[#2C1810] mb-6 max-w-xl mx-auto">{content.trust_note}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['SEBI Compliant', 'AMFI Certified', 'IRDAI Licensed'].map(badge => (
                <div key={badge} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" fill="#1B6B3A" opacity="0.15" />
                    <path d="M4 7l2 2 4-4" stroke="#1B6B3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-body text-xs text-[#2C1810] font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <div className="w-full py-4 px-4 rounded-xl mt-8" style={{ background: '#F5EDD8' }}>
          <div className="max-w-4xl mx-auto flex flex-wrap gap-4 justify-center items-center text-center">
            {[
              { icon: '🛡️', label: 'SEBI Compliant', sub: 'AMFI ARN: 322625' },
              { icon: '📍', label: 'Bhubaneswar Office', sub: '604A, 6th Floor, Nexus Esplanade Mall' },
              { icon: '🇮🇳', label: 'Odisha-first', sub: 'Serving families in Odisha' },
              { icon: '💬', label: 'Odia & English', sub: 'Your language, your comfort' },
            ].map(({ icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center gap-0.5 min-w-[120px]">
                <span className="text-xl">{icon}</span>
                <span className="text-xs font-semibold text-stone">{label}</span>
                <span className="text-[10px] text-stone/50">{sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <section className="bg-[#E8820C] py-16 px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading font-bold text-3xl text-white mb-3">{content.cta_headline}</h2>
            <p className="font-body text-white opacity-90 mb-8">{content.cta_subline}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={BOOKING_FORM_URL}
                className="bg-white text-[#E8820C] font-body font-semibold px-6 py-3 rounded-lg hover:bg-[#F5EDD8] transition-colors">
                {t.bookCall}
              </Link>
              <a href={buildWhatsAppUrl(baseSlug, language)} target="_blank" rel="noopener noreferrer"
                className="border-2 border-white text-white font-body px-6 py-3 rounded-lg hover:bg-white hover:text-[#E8820C] transition-colors">
                {t.whatsapp}
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#F5EDD8] py-8 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-body text-xs text-[#2C1810] opacity-60 mb-1 break-words">© {new Date().getFullYear()} InvestSahi · Part of Sabiduria Capital Group</p>
            <p className="font-body text-xs text-[#2C1810] opacity-60 mb-1 break-words">{BRAND.registration.amfi_arn} · IRDAI Reg: {BRAND.registration.irdai_reg}</p>
            <p className="font-body text-xs text-[#2C1810] opacity-50 break-words">{BRAND.address.full} · Based in Bhubaneswar. Serving all of Odisha — in person and online.</p>
          </div>
        </footer>

      </main>


      {/* Slim footer */}
      <footer className="w-full mt-12 py-8 px-4" style={{ background: '#2C1810' }}>
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-between gap-6 mb-6">
            <div>
              <div className="text-white font-heading font-semibold text-base mb-1">
                <span style={{ color: '#E8820C' }}>Invest</span>Sahi
              </div>
              <p className="text-xs text-white/50">{t.slimTagline}</p>
              <a
                href="https://wa.me/919337370992"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full text-xs font-medium text-white"
                style={{ background: '#25D366' }}
              >
                WhatsApp: +91 93373 70992
              </a>
            </div>
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">{t.servicesNav}</p>
                {t.serviceRibbonItems.map(s => (
                  <a key={s} href={`/${language}/services`} className="block text-xs text-white/60 hover:text-white mb-1">{s}</a>
                ))}
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-2">{t.aboutNav}</p>
                {[
                  { label: t.footerAboutItems[0], href: `/${language}/about` },
                  { label: t.footerAboutItems[1], href: `/${language}/book` },
                  { label: t.footerAboutItems[2], href: `/${language}/learn` },
                ].map(({ label, href }) => (
                  <a key={label} href={href} className="block text-xs text-white/60 hover:text-white mb-1">{label}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-4 text-[10px] text-white/30 text-center">
            © 2026 InvestSahi · AMFI ARN: 322625 · Part of Sabiduria Capital Group
            <br />
            Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully.
          </div>
        </div>
      </footer>
    </>
  );
}
