import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const formatValue = (n: number) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)} crore`
    : `₹${n.toLocaleString('en-IN')}`;

const SIPCard = () => {
  const { t } = useTranslation();
  const { ref, visible } = useScrollReveal(0.2);

  const count1 = useCountUp(206000, visible, 1200);
  const count2 = useCountUp(618000, visible, 1200);
  const count3 = useCountUp(10800000, visible, 1200);

  const rows = [
    { label: t('landing.card.row1label', 'After 5 years'), count: count1, color: 'text-green', bar: 'bg-green', pct: 19, delay: 0 },
    { label: t('landing.card.row2label', 'After 10 years'), count: count2, color: 'text-green text-xl', bar: 'bg-green', pct: 57, delay: 0.3 },
    { label: t('landing.card.row3label', 'After 20 years'), count: count3, color: 'text-saffron font-bold text-2xl', bar: 'bg-saffron', pct: 100, delay: 0.6 },
  ];

  return (
    <div ref={ref} className="bg-card rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-1">
        <Wallet className="text-saffron" size={22} />
        <h3 className="font-heading font-semibold text-lg text-foreground">
          {t('landing.card.title', '₹2,500/month SIP')}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground font-body mb-5">
        {t('landing.card.subtitle', 'With 10% annual step-up from ₹500/month')}
      </p>

      {rows.map((row, i) => (
        <div key={i} className="mb-4">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm text-muted-foreground font-body">{row.label}</span>
            <span className={`font-heading ${row.color}`}>
              {formatValue(row.count)}
            </span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${row.bar} rounded-full`}
              initial={{ width: 0 }}
              animate={visible ? { width: `${row.pct}%` } : {}}
              transition={{ duration: 1.2, delay: row.delay }}
            />
          </div>
        </div>
      ))}

      <hr className="border-border my-3" />
      <p className="text-xs text-muted-foreground italic">
        {t('landing.card.disclaimer', '₹2,500/month starting SIP, 10% step-up yearly, 12% annual return. Not guaranteed.')}
      </p>

      <div className="bg-muted rounded-lg px-4 py-3 mt-4">
        <p className="text-sm font-body text-foreground">
          {t('landing.card.footer', 'Start at ₹500. Step up yearly. Build ₹1 crore.')}
        </p>
      </div>
    </div>
  );
};

const LandingHero = ({ lang }: { lang: string }) => {
  const { t } = useTranslation();

  const trustPills = [
    t('landing.trust1', 'SEBI Compliant'),
    t('landing.trust2', 'AMFI Certified'),
    t('landing.trust3', 'IRDAI Licensed'),
  ];

  return (
    <section className="relative overflow-hidden min-h-0 md:min-h-screen bg-background flex items-center">
      {/* Konark chakra watermark */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-[-60px] left-[-60px] w-[480px] h-[480px] pointer-events-none select-none"
        style={{ opacity: 0.045, color: '#2C1810', zIndex: 0 }}
      >
        <circle cx="100" cy="100" r="90" stroke="#2C1810" strokeWidth="3"/>
        <circle cx="100" cy="100" r="12" fill="#2C1810"/>
        <line x1="100" y1="88" x2="100" y2="15" stroke="#2C1810" strokeWidth="2.5"/>
        <line x1="100" y1="112" x2="100" y2="185" stroke="#2C1810" strokeWidth="2.5"/>
        <line x1="88" y1="100" x2="15" y2="100" stroke="#2C1810" strokeWidth="2.5"/>
        <line x1="112" y1="100" x2="185" y2="100" stroke="#2C1810" strokeWidth="2.5"/>
        <line x1="108" y1="92" x2="154" y2="46" stroke="#2C1810" strokeWidth="2"/>
        <line x1="92" y1="108" x2="46" y2="154" stroke="#2C1810" strokeWidth="2"/>
        <line x1="92" y1="92" x2="46" y2="46" stroke="#2C1810" strokeWidth="2"/>
        <line x1="108" y1="108" x2="154" y2="154" stroke="#2C1810" strokeWidth="2"/>
        <circle cx="100" cy="12" r="3" fill="#2C1810"/>
        <circle cx="100" cy="188" r="3" fill="#2C1810"/>
        <circle cx="12" cy="100" r="3" fill="#2C1810"/>
        <circle cx="188" cy="100" r="3" fill="#2C1810"/>
        <circle cx="154" cy="46" r="2.5" fill="#2C1810"/>
        <circle cx="46" cy="154" r="2.5" fill="#2C1810"/>
        <circle cx="46" cy="46" r="2.5" fill="#2C1810"/>
        <circle cx="154" cy="154" r="2.5" fill="#2C1810"/>
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-20 grid grid-cols-1 md:grid-cols-5 gap-12 items-center">

        {/* LEFT — brand story (3/5) */}
        <div className="md:col-span-3">
          <div className="mb-6">
            <img
              src="/investsahi-logo.png"
              alt="InvestSahi"
              className="h-16 w-auto"
            />
          </div>
          <span className="inline-block px-4 py-1.5 rounded-full bg-saffron text-white text-sm font-semibold font-body mb-6 tracking-wide">
            {t('landing.tag', "Odisha's Homegrown Financial Services Platform")}
          </span>

          <div className="mb-6">
            <h1 className="font-body font-bold text-3xl md:text-[38px] leading-tight text-foreground mb-0">
              {t('landing.headline1', 'Most people wait until they\'re "rich enough" to start investing.')}
            </h1>
            <h2 className="font-body font-bold text-3xl md:text-[38px] leading-tight text-saffron mt-1">
              {t('landing.headline2', 'InvestSahi was built right here in Odisha to prove them wrong.')}
            </h2>
          </div>

          <p className="font-body text-lg text-muted-foreground max-w-lg mb-6">
            {t('landing.body', 'Most people wait until they\'re "rich enough" to start investing. InvestSahi was built right here in Odisha to prove them wrong.')}
          </p>

          <div className="flex flex-wrap gap-2 mb-7">
            {trustPills.map((pill, i) => (
              <span key={i} className="border border-border text-xs font-body text-foreground px-3 py-1 rounded-full">
                {pill}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to={`/${lang}/calculator`}
              className="bg-saffron text-white font-heading font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              {t('landing.cta1', 'Build Your Wealth Plan →')}
            </Link>
            {/* Mobile only — Build ₹1 Crore button */}
            <Link
              to={`/${lang}/crore-plan`}
              className="md:hidden font-heading font-semibold px-6 py-3 rounded-lg transition-opacity hover:opacity-90 text-white"
              style={{ backgroundColor: '#1B6B3A' }}
            >
              {lang === 'or' ? 'Build ₹1 Crore →' : 'Build ₹1 Crore →'}
            </Link>
            {/* Desktop only — Book a free consultation as outlined button */}
            <Link
              to={`/${lang}/book`}
              className="hidden md:inline-flex items-center font-heading font-semibold px-6 py-3 rounded-lg border-2 text-sm transition-colors hover:bg-saffron hover:text-white"
              style={{ borderColor: '#E8820C', color: '#E8820C' }}
            >
              {t('landing.cta2', 'Book a free consultation')}
            </Link>
          </div>
        </div>

        {/* RIGHT — SIP card (2/5) */}
        <div className="md:col-span-2">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          >
            <SIPCard />
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default LandingHero;
