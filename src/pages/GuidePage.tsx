import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { AMFI_ARN, IRDAI_REG, WHATSAPP_URL } from '@/config/constants';

/* ── Types ─────────────────────────────────────────────────── */

interface GuideContent {
  hero_headline: string;
  hero_subline: string;
  why_section: { heading: string; points: string[] };
  services: Array<{ name: string; entry: string; description: string }>;
  trust_note: string;
  cta_headline: string;
  cta_subline: string;
}

interface SeoPage {
  id: string;
  slug: string;
  title: string;
  meta_description: string;
  content: GuideContent | null;
  status: string;
  type: string;
  view_count: number | null;
  keywords: string[] | null;
  created_at: string;
  updated_at: string;
}

/* ── Shared SVG atoms ───────────────────────────────────────── */

const SunWheel = ({ size = 160, opacity = 0.15 }: { size?: number; opacity?: number }) => {
  const spokes = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
    >
      {spokes.map((angle, i) => {
        const isLong = i % 2 === 0;
        const len = isLong ? 44 : 32;
        const rad = (angle * Math.PI) / 180;
        const x2 = 50 + len * Math.cos(rad);
        const y2 = 50 + len * Math.sin(rad);
        return (
          <line
            key={angle}
            x1="50" y1="50" x2={x2} y2={y2}
            stroke="#E8820C"
            strokeWidth={isLong ? 2 : 1.5}
            strokeLinecap="round"
            opacity={opacity}
          />
        );
      })}
      <circle cx="50" cy="50" r="12" fill="#E8820C" opacity={opacity} />
      <circle cx="50" cy="50" r="46" stroke="#E8820C" strokeWidth="2" fill="none" opacity={opacity} />
    </svg>
  );
};

const CheckCircle = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true" className="shrink-0">
    <circle cx="14" cy="14" r="14" fill="#1B6B3A" fillOpacity="0.12" />
    <circle cx="14" cy="14" r="10" fill="#1B6B3A" fillOpacity="0.18" />
    <path d="M9 14.5 L12.5 18 L19 11" stroke="#1B6B3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true" className="shrink-0">
    <path d="M20 4 L34 10 L34 20 C34 28 27 35 20 38 C13 35 6 28 6 20 L6 10 Z" fill="#1A6B9A" fillOpacity="0.15" />
    <path d="M20 4 L34 10 L34 20 C34 28 27 35 20 38 C13 35 6 28 6 20 L6 10 Z" stroke="#1A6B9A" strokeWidth="2" strokeLinejoin="round" fill="none" />
    <path d="M13 20.5 L17.5 25 L27 15" stroke="#1A6B9A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SmallCheck = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
    <circle cx="8" cy="8" r="8" fill="#1B6B3A" fillOpacity="0.15" />
    <path d="M5 8.5 L7 10.5 L11 6.5" stroke="#1B6B3A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ── Loading spinner ────────────────────────────────────────── */

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#F5EDD8' }}>
    <div style={{ animation: 'spin 3s linear infinite' }}>
      <SunWheel size={48} opacity={1} />
    </div>
    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ── 404 page ───────────────────────────────────────────────── */

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: '#F5EDD8' }}>
    <span className="font-heading font-bold text-2xl" style={{ color: '#E8820C' }}>Invest</span>
    <span className="font-heading font-semibold text-2xl" style={{ color: '#2C1810' }}>Sahi</span>
    <p className="font-heading text-lg mt-4" style={{ color: '#2C1810' }}>Page not found</p>
    <Link to="/en" className="mt-2 font-body text-sm" style={{ color: '#E8820C' }}>
      Go to Homepage →
    </Link>
  </div>
);

/* ── Guide header ───────────────────────────────────────────── */

const GuideHeader = () => (
  <header
    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14"
    style={{ background: 'white', borderBottom: '1px solid #E5E7EB' }}
  >
    <Link to="/en" className="flex items-baseline gap-0.5">
      <span className="font-heading font-bold text-xl" style={{ color: '#E8820C' }}>Invest</span>
      <span className="font-heading font-semibold text-xl" style={{ color: '#2C1810' }}>Sahi</span>
      <span className="font-heading text-xs font-medium" style={{ color: '#1B6B3A' }}>.in</span>
    </Link>
    <Link
      to="/en/book"
      onClick={() => window.scrollTo({ top: 0 })}
      className="font-heading font-semibold text-sm px-4 py-2 rounded-lg text-white"
      style={{ background: '#E8820C' }}
    >
      Book a Free Call →
    </Link>
  </header>
);

/* ── Section 1: Hero ───────────────────────────────────────── */

const HeroSection = ({ content }: { content: GuideContent }) => (
  <section
    className="pt-14"
    style={{ background: '#F5EDD8', minHeight: '60vh', display: 'flex', alignItems: 'center' }}
  >
    <div className="max-w-6xl mx-auto px-6 py-16 w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div>
        <h1
          className="font-heading font-bold leading-tight mb-4"
          style={{ fontSize: 'clamp(2.25rem, 5vw, 3rem)', color: '#2C1810' }}
        >
          {content.hero_headline}
        </h1>
        <p className="font-body mb-8" style={{ fontSize: '18px', color: '#6B6B6B' }}>
          {content.hero_subline}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/en/book"
            onClick={() => window.scrollTo({ top: 0 })}
            className="font-heading font-semibold px-6 py-3 rounded-lg text-white transition-opacity hover:opacity-90"
            style={{ background: '#E8820C' }}
          >
            Start with ₹500 →
          </Link>
          <Link
            to="/en/calculator"
            onClick={() => window.scrollTo({ top: 0 })}
            className="font-heading font-semibold px-6 py-3 rounded-lg transition-opacity hover:opacity-80"
            style={{ border: '2px solid #1B6B3A', color: '#1B6B3A', background: 'transparent' }}
          >
            Calculate Your Fund →
          </Link>
        </div>
      </div>
      <div className="hidden md:flex items-center justify-center">
        <SunWheel size={280} opacity={0.18} />
      </div>
    </div>
  </section>
);

/* ── Section 2: Why section ────────────────────────────────── */

const WhySection = ({ content }: { content: GuideContent }) => (
  <section style={{ background: 'white' }} className="py-16">
    <div className="max-w-3xl mx-auto px-6">
      <motion.h2
        className="font-heading font-bold text-center mb-10"
        style={{ fontSize: '28px', color: '#2C1810' }}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {content.why_section.heading}
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {content.why_section.points.map((point, i) => (
          <motion.div
            key={i}
            className="rounded-xl p-5 flex flex-col items-start gap-3"
            style={{ background: '#F5EDD8' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.12 }}
          >
            <CheckCircle />
            <p className="font-body" style={{ fontSize: '16px', color: '#2C1810' }}>{point}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Section 3: Services grid ──────────────────────────────── */

const ServicesSection = ({ content }: { content: GuideContent }) => (
  <section style={{ background: '#F5EDD8' }} className="py-16">
    <div className="max-w-5xl mx-auto px-6">
      <h2 className="font-heading font-bold text-center mb-10" style={{ fontSize: '28px', color: '#2C1810' }}>
        What We Offer
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {content.services.map((svc, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-2 transition-shadow hover:shadow-md cursor-default"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-heading font-semibold text-base" style={{ color: '#2C1810' }}>
                {svc.name}
              </h3>
              <span
                className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full text-white"
                style={{ background: '#E8820C' }}
              >
                {svc.entry}
              </span>
            </div>
            <p className="font-body text-sm" style={{ color: '#6B6B6B' }}>{svc.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

/* ── Section 4: Trust note ─────────────────────────────────── */

const TrustSection = ({ content }: { content: GuideContent }) => (
  <section style={{ background: '#EAF4FB' }} className="py-14">
    <div className="max-w-3xl mx-auto px-6">
      <div className="flex items-start gap-4 mb-6">
        <ShieldIcon />
        <p className="font-body text-base leading-relaxed" style={{ color: '#2C1810' }}>
          {content.trust_note}
        </p>
      </div>
      <div className="flex flex-wrap gap-3">
        {['SEBI Registered', 'AMFI Certified', 'IRDAI Licensed'].map((badge) => (
          <span
            key={badge}
            className="flex items-center gap-1.5 font-body text-sm px-3 py-1.5 rounded-full"
            style={{ background: 'white', color: '#2C1810', border: '1px solid #D0E8F5' }}
          >
            <SmallCheck />
            {badge}
          </span>
        ))}
      </div>
    </div>
  </section>
);

/* ── Section 5: CTA block ──────────────────────────────────── */

const CtaSection = ({ content }: { content: GuideContent }) => (
  <section style={{ background: '#E8820C' }} className="py-16">
    <div className="max-w-2xl mx-auto px-6 text-center">
      <h2 className="font-heading font-bold mb-3" style={{ fontSize: '32px', color: 'white' }}>
        {content.cta_headline}
      </h2>
      <p className="font-body mb-8" style={{ color: 'rgba(255,255,255,0.85)' }}>
        {content.cta_subline}
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/en/book"
          onClick={() => window.scrollTo({ top: 0 })}
          className="font-heading font-semibold px-6 py-3 rounded-lg transition-opacity hover:opacity-90"
          style={{ background: 'white', color: '#E8820C' }}
        >
          Book a Free Call
        </Link>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-heading font-semibold px-6 py-3 rounded-lg transition-opacity hover:opacity-90"
          style={{ border: '2px solid white', color: 'white', background: 'transparent' }}
        >
          WhatsApp Us
        </a>
      </div>
    </div>
  </section>
);

/* ── Guide footer ───────────────────────────────────────────── */

const GuideFooter = () => (
  <footer style={{ background: '#F5EDD8' }} className="py-5 text-center">
    <p className="font-body text-xs" style={{ color: '#6B6B6B' }}>
      © 2025 InvestSahi · Part of Sabiduria Capital Group · AMFI ARN-{AMFI_ARN} · IRDAI REG-{IRDAI_REG}
    </p>
  </footer>
);

/* ── Main page component ───────────────────────────────────── */

const GuidePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState<SeoPage | null>(null);
  const [notFound, setNotFound] = useState(false);
  const didFireView = useRef(false);

  useEffect(() => {
    if (!slug) { setNotFound(true); setLoading(false); return; }

    (async () => {
      const { data, error } = await (supabase as any)
        .from('seo_pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'live')
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setPage(data as SeoPage);
      }
      setLoading(false);
    })();
  }, [slug]);

  /* fire-and-forget view increment (once per mount) */
  useEffect(() => {
    if (page && !didFireView.current) {
      didFireView.current = true;
      (supabase as any).rpc('increment_seo_view', { page_slug: page.slug });
    }
  }, [page]);

  /* set meta tags */
  useEffect(() => {
    if (!page) return;
    document.title = page.title;
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = page.meta_description;
  }, [page]);

  if (loading) return <LoadingSpinner />;
  if (notFound || !page) return <NotFoundPage />;

  const content = page.content;
  if (!content) {
    /* page exists but no content yet — show minimal holding state */
    return (
      <div className="min-h-screen" style={{ background: '#F5EDD8' }}>
        <GuideHeader />
        <div className="pt-14 flex items-center justify-center min-h-screen">
          <p className="font-heading text-lg" style={{ color: '#2C1810' }}>Content coming soon.</p>
        </div>
        <GuideFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <GuideHeader />
      <HeroSection content={content} />
      <WhySection content={content} />
      <ServicesSection content={content} />
      <TrustSection content={content} />
      <CtaSection content={content} />
      <GuideFooter />
    </div>
  );
};

export default GuidePage;
