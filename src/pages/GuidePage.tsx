import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BRAND } from "@/constants/brand";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import GuideSkeletonLoader from "@/components/guide/GuideSkeletonLoader";
import ScrollProgressBar from "@/components/guide/ScrollProgressBar";
import BackToTopButton from "@/components/guide/BackToTopButton";

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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<SeoPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { progress, showBackToTop, scrollToTop } = useScrollProgress();

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

      setPage(data as unknown as SeoPage);
      document.title = `${(data as any).title} | InvestSahi`;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', (data as any).meta_description);

      (supabase.rpc as any)('increment_seo_view', { page_slug: slug });
      setLoading(false);
    }

    fetchPage();
  }, [slug]);

  if (loading) return <GuideSkeletonLoader />;

  if (notFound || !page) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4 animate-fade-in">
        <Link to="/" className="text-2xl font-heading font-bold">
          <span className="text-primary">Invest</span>
          <span className="text-foreground">Sahi</span>
          <span className="text-secondary text-[0.6em]">.in</span>
        </Link>
        <h1 className="font-heading font-bold text-2xl text-foreground">Page not found</h1>
        <p className="font-body text-foreground opacity-70">This page doesn't exist or hasn't been published yet.</p>
        <Link to="/" className="bg-primary text-primary-foreground font-body px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200">
          Go to Homepage
        </Link>
      </div>
    );
  }

  const content = page.content as GuideContent | null;

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-4 animate-fade-in">
        <Link to="/" className="text-2xl font-heading font-bold">
          <span className="text-primary">Invest</span>
          <span className="text-foreground">Sahi</span>
          <span className="text-secondary text-[0.6em]">.in</span>
        </Link>
        <h1 className="font-heading font-bold text-xl text-foreground">Content coming soon</h1>
        <p className="font-body text-foreground opacity-70">We're working on this page. Check back shortly.</p>
        <Link to="/" className="bg-primary text-primary-foreground font-body px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200">
          Go to Homepage
        </Link>
      </div>
    );
  }

  return (
    <>
      <SchemaMarkup page={page} content={content} />
      <ScrollProgressBar progress={progress} />
      <BackToTopButton visible={showBackToTop} onClick={scrollToTop} />

      {/* Header */}
      <header className="fixed top-[3px] left-0 right-0 z-50 bg-background border-b border-primary/20 px-4 md:px-8 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-heading font-bold">
          <span className="text-primary">Invest</span>
          <span className="text-foreground">Sahi</span>
          <span className="text-secondary text-[0.6em]">.in</span>
        </Link>
        <Link
          to="/en/book"
          className="bg-primary text-primary-foreground font-body text-sm px-4 py-2 rounded-lg hover:scale-105 transition-all duration-200 whitespace-nowrap"
        >
          <span className="sm:hidden">Book a Call →</span>
          <span className="hidden sm:inline">Book a Free Call →</span>
        </Link>
      </header>

      <main className="pt-16 pb-20 md:pb-0 animate-fade-in">

        {/* Hero */}
        <section id="guide-hero" className="bg-background py-12 md:py-24 px-4 md:px-8 min-h-[60vh] flex items-center">
          <div className="max-w-6xl mx-auto w-full flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1">
              <h1 className="font-heading font-bold text-3xl md:text-5xl text-foreground leading-tight mb-4">
                {content.hero_headline}
              </h1>
              <p className="font-body text-lg text-foreground opacity-80 mb-8 max-w-xl">
                {content.hero_subline}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={BRAND.social.whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto text-center bg-primary text-primary-foreground font-body px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200"
                >
                  Start with ₹500 →
                </a>
                <Link
                  to="/#calculator"
                  className="w-full sm:w-auto text-center border-2 border-secondary text-secondary font-body px-6 py-3 rounded-lg hover:bg-secondary hover:text-secondary-foreground transition-all duration-200"
                >
                  Calculate Your Fund →
                </Link>
              </div>
            </div>
            <div className="flex-shrink-0 opacity-15">
              <svg width="180" height="180" viewBox="0 0 180 180" fill="none">
                <circle cx="90" cy="90" r="12" fill="#E8820C" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <line key={i} x1="90" y1="22" x2="90" y2={i % 2 === 0 ? "38" : "32"} stroke="#E8820C" strokeWidth="3" strokeLinecap="round" transform={`rotate(${angle} 90 90)`} />
                ))}
                <circle cx="90" cy="90" r="70" stroke="#E8820C" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
        </section>

        {/* Story */}
        {content.story_paragraph && (
          <section id="guide-story" className="bg-card py-14 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-4">
                <div className="text-6xl text-primary opacity-20 font-serif leading-none flex-shrink-0 mt-[-8px]">"</div>
                <div>
                  <p className="font-body text-lg text-foreground leading-relaxed italic">
                    {content.story_paragraph}
                  </p>
                  <p className="font-body text-sm text-foreground opacity-50 mt-3">
                    — A story from Odisha. Names changed for privacy.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Case Study */}
        {content.case_study && (
          <section id="guide-case-study" className="bg-background py-14 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading font-bold text-2xl text-foreground mb-8 text-center">
                How We Helped — A Real Example
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'The Challenge', text: content.case_study.challenge, color: 'text-amber' },
                  { label: 'What We Did', text: content.case_study.strategy, color: 'text-blue' },
                  { label: 'The Result', text: content.case_study.result, color: 'text-secondary' },
                ].map((item) => (
                  <div key={item.label} className="bg-card rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-transform duration-200">
                    <div className={`font-heading font-bold text-sm mb-2 ${item.color}`}>
                      {item.label}
                    </div>
                    <p className="font-body text-foreground text-sm leading-relaxed">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        {content.how_it_works && (
          <section id="guide-how-it-works" className="bg-card py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-heading font-bold text-2xl text-foreground mb-6">How It Works</h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                {['Free conversation', 'Your personal plan', 'Start from ₹500'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-heading font-bold text-sm flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <span className="font-body text-sm text-foreground">{step}</span>
                    {i < 2 && <span className="hidden md:block text-foreground opacity-30">→</span>}
                  </div>
                ))}
              </div>
              <p className="font-body text-foreground opacity-75 text-base max-w-xl mx-auto">
                {content.how_it_works}
              </p>
            </div>
          </section>
        )}

        {/* Why Section */}
        <section id="guide-why" className="bg-background py-10 md:py-14 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground text-center mb-10">
              {content.why_section.heading}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.why_section.points.map((point, i) => (
                <div key={i} className="bg-card rounded-xl p-6 shadow-sm hover:-translate-y-1 transition-transform duration-200">
                  <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center mb-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8l3.5 3.5L13 4.5" stroke="hsl(var(--secondary))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="font-body text-foreground text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Local Insight */}
        {content.local_insight && (
          <section id="guide-local-insight" className="py-12 px-4 md:px-8 bg-blue-light">
            <div className="max-w-3xl mx-auto flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <circle cx="14" cy="14" r="13" stroke="hsl(var(--ring))" strokeWidth="1.5" />
                  <path d="M14 9v5M14 17v2" stroke="hsl(var(--ring))" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="font-heading font-bold text-sm text-blue mb-2 uppercase tracking-wide">
                  Local Insight
                </div>
                <p className="font-body text-foreground leading-relaxed">{content.local_insight}</p>
              </div>
            </div>
          </section>
        )}

        {/* Services */}
        <section id="guide-services" className="bg-background py-10 md:py-14 px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-heading font-bold text-2xl text-foreground text-center mb-10">
              What We Help You With
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.services.map((service, i) => (
                <div key={i} className="bg-card rounded-xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-bold text-foreground mb-2">{service.name}</h3>
                    <p className="font-body text-foreground opacity-75 text-sm leading-relaxed">{service.description}</p>
                  </div>
                  <a
                    href={BRAND.social.whatsapp_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 w-full text-center bg-background hover:bg-primary text-primary hover:text-primary-foreground font-body text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 border border-primary"
                  >
                    Book Free Consultation →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs — smooth accordion */}
        {content.faqs && content.faqs.length > 0 && (
          <section id="guide-faqs" className="bg-card py-14 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading font-bold text-2xl text-foreground text-center mb-10">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3">
                {content.faqs.map((faq, i) => (
                  <div key={i} className="border border-primary/20 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full text-left px-4 py-5 min-h-[52px] flex items-center justify-between bg-background hover:bg-primary/5 transition-colors duration-200"
                    >
                      <span className="font-body font-semibold text-foreground pr-4 text-sm md:text-base">{faq.question}</span>
                      <span className={`text-primary flex-shrink-0 text-xl font-bold transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>
                        +
                      </span>
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-300 ease-in-out"
                      style={{
                        maxHeight: openFaq === i ? '500px' : '0',
                        opacity: openFaq === i ? 1 : 0,
                      }}
                    >
                      <div className="px-4 py-4 bg-card">
                        <p className="font-body text-foreground opacity-80 leading-relaxed text-sm">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Trust */}
        <section id="guide-trust" className="bg-blue-light py-12 px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-4">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <path d="M18 3L4 9v10c0 8.3 6 16 14 18 8-2 14-9.7 14-18V9L18 3z" fill="#1A6B9A" opacity="0.15" stroke="#1A6B9A" strokeWidth="1.5" />
                <path d="M12 18l4 4 8-8" stroke="#1A6B9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="font-body text-foreground mb-6 max-w-xl mx-auto">{content.trust_note}</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['SEBI Registered', 'AMFI Certified', 'IRDAI Licensed'].map(badge => (
                <div key={badge} className="flex items-center gap-2 bg-card px-4 py-2 rounded-full shadow-sm">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <circle cx="7" cy="7" r="6" fill="#1B6B3A" opacity="0.15" />
                    <path d="M4 7l2 2 4-4" stroke="#1B6B3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="font-body text-xs text-foreground font-medium">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="guide-cta" className="bg-primary py-16 px-4 md:px-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="font-heading font-bold text-3xl text-primary-foreground mb-3">
              {content.cta_headline}
            </h2>
            <p className="font-body text-primary-foreground opacity-90 mb-8">{content.cta_subline}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/en/book"
                className="bg-card text-primary font-body font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200"
              >
                Book a Free Call
              </Link>
              <a
                href={BRAND.social.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-primary-foreground text-primary-foreground font-body px-6 py-3 rounded-lg hover:bg-card hover:text-primary transition-all duration-200"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-background py-8 px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <p className="font-body text-xs text-foreground opacity-60 mb-1 break-words px-4">
              © {new Date().getFullYear()} InvestSahi · Part of Sabiduria Capital Group
            </p>
            <p className="font-body text-xs text-foreground opacity-60 mb-1 break-words px-4">
              {BRAND.registration.amfi_arn} · IRDAI Reg: {BRAND.registration.irdai_reg}
            </p>
            <p className="font-body text-xs text-foreground opacity-50 break-words px-4">
              {BRAND.address.full} · Based in Bhubaneswar. Serving all of Odisha — in person and online.
            </p>
          </div>
        </footer>

      </main>

      {/* WhatsApp sticky bar — mobile only */}
      <a
        href={BRAND.social.whatsapp_link}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-secondary text-secondary-foreground font-body font-semibold text-base py-4 px-6 flex items-center justify-center gap-3 shadow-lg"
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 1C5.477 1 1 5.477 1 11c0 1.89.525 3.655 1.438 5.163L1 21l4.837-1.438A9.956 9.956 0 0011 21c5.523 0 10-4.477 10-10S16.523 1 11 1z" fill="white" opacity="0.2" stroke="white" strokeWidth="1.5"/>
          <path d="M7.5 8.5c.5 1 1.5 2.5 3 3.5s2.5 1.5 3 1.5c.3-.5.8-1.5.5-2-.5-.5-1.5-.5-1.5-.5s-.5 0-1 .5c-.3-.3-1-1-1.5-1.5-.5-.5-.5-1-.5-1s0-1-.5-1.5c-.5-.3-1.5 0-2 .5-.3.5 0 1.5 0 1.5z" fill="white"/>
        </svg>
        Chat with us on WhatsApp
      </a>
    </>
  );
}
