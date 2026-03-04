import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
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

function buildSchema({ page, content, baseSlug }: { page: SeoPage; content: GuideContent; baseSlug: string }) {
  return {
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
    },
    ...(content.faqs && content.faqs.length > 0 && {
      "mainEntity": content.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": { "@type": "Answer", "text": faq.answer }
      }))
    })
  };
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

  const isOdia = location.pathname.startsWith('/or/');
  const language = isOdia ? 'or' : 'en';
  const isOdiaFormal = slug?.endsWith('-odia');
  const audience_style = !isOdia ? 'standard' : isOdiaFormal ? 'pure_odia' : 'mixed';
  const baseSlug = isOdiaFormal ? slug!.replace(/-odia$/, '') : slug!;

  const t = {
    caseStudyHeading: audience_style === 'pure_odia' ? 'ଆମେ କିପରି ସାହାଯ୍ୟ କଲୁ — ଏକ ବାସ୍ତବ ଉଦାହରଣ' : 'How We Helped — A Real Example',
    challenge: audience_style === 'pure_odia' ? 'ଆହ୍ୱାନ' : 'The Challenge',
    whatWeDid: audience_style === 'pure_odia' ? 'ଆମେ ଯାହା କଲୁ' : 'What We Did',
    result: audience_style === 'pure_odia' ? 'ଫଳାଫଳ' : 'The Result',
    howItWorks: audience_style === 'pure_odia' ? 'ଏହା କିପରି କାମ କରେ' : 'How It Works',
    freeConversation: audience_style === 'pure_odia' ? 'ମାଗଣା କଥାବାର୍ତ୍ତା' : 'Free conversation',
    personalPlan: audience_style === 'pure_odia' ? 'ଆପଣଙ୍କ ଯୋଜନା' : 'Your personal plan',
    startFrom: audience_style === 'pure_odia' ? '₹500 ରୁ ଆରମ୍ଭ' : 'Start from ₹500',
    servicesHeading: audience_style === 'pure_odia' ? 'ଆମେ ଆପଣଙ୍କୁ କେଉଁ ବିଷୟରେ ସାହାଯ୍ୟ କରୁ' : 'What We Help You With',
    faqHeading: audience_style === 'pure_odia' ? 'ସାଧାରଣ ପ୍ରଶ୍ନ' : 'Frequently Asked Questions',
    bookConsultation: audience_style === 'pure_odia' ? 'ମାଗଣା ପରାମର୍ଶ ବୁକ୍ କରନ୍ତୁ →' : 'Book Free Consultation →',
    bookCall: audience_style === 'pure_odia' ? 'ମାଗଣା କଲ୍ ବୁକ୍ କରନ୍ତୁ' : 'Book a Free Call',
    whatsapp: audience_style === 'pure_odia' ? 'WhatsApp କରନ୍ତୁ' : 'WhatsApp Us',
    heroCtaPrimary: audience_style === 'pure_odia' ? 'ମାଗଣା ପରାମର୍ଶ ବୁକ୍ କରନ୍ତୁ →' : 'Book Free Consultation →',
    heroCtaSecondary: audience_style === 'pure_odia' ? 'SIP କ୍ୟାଲକୁଲେଟର ଦେଖନ୍ତୁ →' : 'Try the SIP Calculator →',
    storyAttribution: audience_style === 'pure_odia' ? '— ଓଡ଼ିଶାର ଏକ କାହାଣୀ। ଗୋପନୀୟତା ପାଇଁ ନାମ ପରିବର୍ତ୍ତନ କରାଯାଇଛି।' : '— A story from Odisha. Names changed for privacy.',
    localInsightLabel: audience_style === 'pure_odia' ? 'ସ୍ଥାନୀୟ ଜ୍ଞାନ' : 'Local Insight',
    chatWhatsapp: audience_style === 'pure_odia' ? 'WhatsApp ରେ କଥା ହୁଅନ୍ତୁ' : 'Chat with us on WhatsApp',
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

  if (loading) return <LoadingSpinner />;
  if (notFound || !page) return <NotFound />;

  const content = page.content as GuideContent | null;

  if (!content) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EDD8] gap-4 px-4">
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
        schema={buildSchema({ page, content: content as GuideContent, baseSlug })}
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5EDD8] border-b border-[#E8820C]/20 px-4 md:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-heading font-bold">
          <span style={{ color: '#E8820C' }}>Invest</span>
          <span style={{ color: '#2C1810' }}>Sahi</span>
          <span style={{ color: '#1B6B3A', fontSize: '0.6em' }}>.in</span>
        </Link>
        <Link to={BOOKING_FORM_URL}
          className="bg-[#E8820C] text-white font-body text-sm px-4 py-2 rounded-lg hover:bg-[#C45C00] transition-colors">
          <span className="sm:hidden">Book a Call →</span>
          <span className="hidden sm:inline">Book a Free Call →</span>
        </Link>
      </header>

      <main className="pt-16 pb-20 md:pb-0" lang={language}>

        {/* Hero */}
        <section className="bg-[#F5EDD8] py-12 md:py-24 px-4 md:px-8 min-h-[60vh] flex items-center">
          <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="font-heading font-bold text-3xl md:text-5xl text-[#2C1810] leading-tight mb-4">
                {content.hero_headline}
              </h1>
              <p className="font-body text-lg text-[#2C1810] opacity-80 mb-8 max-w-xl">
                {content.hero_subline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href={BRAND.social.whatsapp_link} target="_blank" rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center bg-[#E8820C] text-white font-body font-semibold px-6 py-3 rounded-lg hover:bg-[#C45C00] transition-colors duration-200">
                  {t.heroCtaPrimary}
                </a>
                <button
                  onClick={() => { window.location.href = `/${language}/calculator`; }}
                  className="w-full sm:w-auto text-center border-2 border-[#1B6B3A] text-[#1B6B3A] font-body font-semibold px-6 py-3 rounded-lg hover:bg-[#1B6B3A] hover:text-white transition-colors duration-200"
                >
                  {t.heroCtaSecondary}
                </button>
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
                  <a href={BRAND.social.whatsapp_link} target="_blank" rel="noopener noreferrer"
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
                    {openFaq === i && (
                      <div className="px-4 py-4 bg-white">
                        <p className="font-body text-[#2C1810] opacity-80 leading-relaxed text-sm">{faq.answer}</p>
                      </div>
                    )}
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
              {['SEBI Registered', 'AMFI Certified', 'IRDAI Licensed'].map(badge => (
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
              <a href={BRAND.social.whatsapp_link} target="_blank" rel="noopener noreferrer"
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

      {/* Mobile WhatsApp sticky bar */}
      <a href={BRAND.social.whatsapp_link} target="_blank" rel="noopener noreferrer"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#1B6B3A] text-white font-body font-semibold text-base py-4 px-6 flex items-center justify-center gap-3 shadow-lg">
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 1C5.477 1 1 5.477 1 11c0 1.89.525 3.655 1.438 5.163L1 21l4.837-1.438A9.956 9.956 0 0011 21c5.523 0 10-4.477 10-10S16.523 1 11 1z" fill="white" opacity="0.2" stroke="white" strokeWidth="1.5"/>
          <path d="M7.5 8.5c.5 1 1.5 2.5 3 3.5s2.5 1.5 3 1.5c.3-.5.8-1.5.5-2-.5-.5-1.5-.5-1.5-.5s-.5 0-1 .5c-.3-.3-1-1-1.5-1.5-.5-.5-.5-1-.5-1s0-1-.5-1.5c-.5-.3-1.5 0-2 .5-.3.5 0 1.5 0 1.5z" fill="white"/>
        </svg>
        {t.chatWhatsapp}
      </a>
    </>
  );
}
