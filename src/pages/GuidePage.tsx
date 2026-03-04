import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BRAND } from "@/constants/brand";

interface GuideContent {
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
  title: string;
  meta_description: string;
  type: string;
  slug: string;
  content: GuideContent | null;
}

function SchemaMarkup({ page, content }: { page: SeoPage; content: GuideContent }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialService",
    "name": BRAND.name,
    "description": page.meta_description,
    "url": `https://investsahi.in/guide/${page.slug}`,
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
    "areaServed": {
      "@type": "State",
      "name": "Odisha"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Financial Services",
      "itemListElement": content.services.map(s => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": s.name,
          "description": s.description
        }
      }))
    },
    ...(content.faqs && content.faqs.length > 0 && {
      "mainEntity": content.faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5EDD8]">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="animate-spin">
        <circle cx="24" cy="24" r="20" stroke="#E8820C" strokeWidth="3" strokeDasharray="31.4 94.2" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <line
            key={i}
            x1="24" y1="4"
            x2="24" y2={i % 2 === 0 ? "10" : "8"}
            stroke="#E8820C"
            strokeWidth="2"
            transform={`rotate(${angle} 24 24)`}
          />
        ))}
      </svg>
    </div>
  );
}

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<SeoPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchPage() {
      const { data, error } = await supabase
        .from('seo_pages' as any)
        .select('title, meta_description, type, slug, content')
        .eq('slug', slug)
        .eq('status', 'live')
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setPage(data as SeoPage);
      document.title = `${data.title} | InvestSahi`;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', data.meta_description);

      // Fire-and-forget view count
      supabase.rpc('increment_seo_view', { page_slug: slug });
      setLoading(false);
    }

    fetchPage();
  }, [slug]);

  if (loading) return <LoadingSpinner />;

  if (notFound || !page) {
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

  const content = page.content as GuideContent | null;

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EDD8] gap-4 px-4">
        <Link to="/" className="text-2xl font-heading font-bold">
          <span style={{ color: '#E8820C' }}>Invest</span>
          <span style={{ color: '#2C1810' }}>Sahi</span>
          <span style={{ color: '#1B6B3A', fontSize: '0.6em' }}>.in</span>
        </Link>
        <h1 className="font-heading font-bold text-xl text-[#2C1810]">Content coming soon</h1>
        <p className="font-body text-[#2C1810] opacity-70">We're working on this page. Check back shortly.</p>
        <Link to="/" className="bg-[#E8820C] text-white font-body px-6 py-3 rounded-lg hover:bg-[#C45C00] transition-colors">
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <>
      <SchemaMarkup page={page} content={content} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#F5EDD8] border-b border-[#E8820C]/20 px-4 md:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-heading font-bold">
          <span style={{ color: '#E8820C' }}>Invest</span>
          <span style={{ color: '#2C1810' }}>Sahi</span>
          <span style={{ color: '#1B6B3A', fontSize: '0.6em' }}>.in</span>
        </Link>
        <a
          href={BRAND.social.whatsapp_link}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#E8820C] text-white font-body text-sm px-4 py-2 rounded-lg hover:bg-[#C45C00] transition-colors"
        >
          Book a Free Call →
        </a>
      </header>

      <main className="pt-16">

        {/* Hero */}
        <section className="bg-[#F5EDD8] py-16 md:py-24 px-4 md:px-8 min-h-[60vh] flex items-center">
          <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="font-heading font-bold text-4xl md:text-5xl text-[#2C1810] leading-tight mb-4">
                {content.hero_headline}
              </h1>
              <p className="font-body text-lg text-[#2C1810] opacity-80 mb-8 max-w-xl">
                {content.hero_subline}
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href={BRAND.social.whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#E8820C] text-white font-body px-6 py-3 rounded-lg hover:bg-[#C45C00] transition-colors"
                >
                  Start with ₹500 →
                </a>
                <Link
                  to="/#calculator"
                  className="border-2 border-[#1B6B3A] text-[#1B6B3A] font-body px-6 py-3 rounded-lg hover:bg-[#1B6B3A] hover:text-white transition-colors"
                >
                  Calculate Your Fund →
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 opacity-15">
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                <circle cx="90" cy="90" r="12" fill="#E8820C" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <line
                    key={i}
                    x1="90" y1="22"
                    x2="90" y2={i % 2 === 0 ? "38" : "32"}
                    stroke="#E8820C"
                    strokeWidth="3"
                    strokeLinecap="round"
                    transform={`rotate(${angle} 90 90)`}
                  />
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
                  <p className="font-body text-lg text-[#2C1810] leading-relaxed italic">
                    {content.story_paragraph}
                  </p>
                  <p className="font-body text-sm text-[#2C1810] opacity-50 mt-3">
                    — A story from Odisha. Names changed for privacy.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Case Study */}
        {content.case_study && (
          <section className="bg-[#F5EDD8] py-14 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading font-bold text-2xl text-[#2C1810] mb-8 text-center">
                How We Helped — A Real Example
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'The Challenge', text: content.case_study.challenge, color: '#C45C00' },
                  { label: 'What We Did', text: content.case_study.strategy, color: '#1A6B9A' },
                  { label: 'The Result', text: content.case_study.result, color: '#1B6B3A' },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="font-heading font-bold text-sm mb-2" style={{ color: item.color }}>
                      {item.label}
                    </div>
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
              <h2 className="font-heading font-bold text-2xl text-[#2C1810] mb-6">How It Works</h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                {['Free conversation', 'Your personal plan', 'Start from ₹500'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#E8820C] text-white font-heading font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="font-body text-sm text-[#2C1810]">{step}</span>
                    {i < 2 && <span className="hidden md:block text-[#2C1810] opacity-30">→</span>}
                  </div>
                ))}
              </div>
              <p className="font-body text-[#2C1810] opacity-75 text-base max-w-xl mx-auto">
                {content.how_it_works}
              </p>
            </div>
          </section>
        )}

        {/* Why Section */}
        <section className="bg-[#F5EDD8] py-14 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-[#2C1810] text-center mb-10">
              {content.why_section.heading}
            </h2>
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
                <div className="font-heading font-bold text-sm text-[#1A6B9A] mb-2 uppercase tracking-wide">
                  Local Insight
                </div>
                <p className="font-body text-[#2C1810] leading-relaxed">{content.local_insight}</p>
              </div>
            </div>
          </section>
        )}

        {/* Services */}
        <section className="bg-[#F5EDD8] py-14 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl text-[#2C1810] text-center mb-10">
              What We Help You With
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.services.map((service, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-[#2C1810] mb-2">{service.name}</h3>
                    <p className="font-body text-[#2C1810] opacity-75 text-sm leading-relaxed">{service.description}</p>
                  </div>
                  <a
                    href={BRAND.social.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full text-center bg-[#F5EDD8] hover:bg-[#E8820C] text-[#E8820C] hover:text-white font-body text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 border border-[#E8820C]"
                  >
                    Book Free Consultation →
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
              <h2 className="font-heading font-bold text-2xl text-[#2C1810] text-center mb-10">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {content.faqs.map((faq, i) => (
                  <div key={i} className="border border-[#E8820C]/20 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between bg-[#F5EDD8] hover:bg-[#E8820C]/5 transition-colors"
                    >
                      <span className="font-body font-semibold text-[#2C1810] pr-4">{faq.question}</span>
                      <span className="text-[#E8820C] flex-shrink-0 text-xl font-bold">
                        {openFaq === i ? '−' : '+'}
                      </span>
                    </button>
                    {openFaq === i && (
                      <div className="px-6 py-4 bg-white">
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
        <section className="bg-[#EAF4FB] py-12 px-4 md:px-8">
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
            <h2 className="font-heading font-bold text-3xl text-white mb-3">
              {content.cta_headline}
            </h2>
            <p className="font-body text-white opacity-90 mb-8">{content.cta_subline}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={BRAND.social.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#E8820C] font-body font-semibold px-6 py-3 rounded-lg hover:bg-[#F5EDD8] transition-colors"
              >
                Book a Free Call
              </a>
              <a
                href={BRAND.social.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white font-body px-6 py-3 rounded-lg hover:bg-white hover:text-[#E8820C] transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#F5EDD8] py-8 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-body text-xs text-[#2C1810] opacity-60 mb-1">
              © {new Date().getFullYear()} InvestSahi · Part of Sabiduria Capital Group
            </p>
            <p className="font-body text-xs text-[#2C1810] opacity-60 mb-1">
              {BRAND.registration.amfi_arn} · IRDAI Reg: {BRAND.registration.irdai_reg}
            </p>
            <p className="font-body text-xs text-[#2C1810] opacity-50">
              {BRAND.address.full} · Based in Bhubaneswar. Serving all of Odisha — in person and online.
            </p>
          </div>
        </footer>

      </main>
    </>
  );
}
