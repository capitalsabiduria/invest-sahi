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
    <div ref={ref} className="bg-card rounded-2xl border border-border shadow-xl p-7 md:p-8">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-9 h-9 rounded-lg bg-saffron/10 flex items-center justify-center">
          <Wallet className="text-saffron" size={20} />
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground">
          {t('landing.card.title', '₹2,500/month SIP')}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground font-body mb-6 ml-[2.875rem]">
        {t('landing.card.subtitle', 'With 10% annual step-up from ₹500/month')}
      </p>

      <div className="space-y-5">
        {rows.map((row, i) => (
          <div key={i}>
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-sm text-muted-foreground font-body">{row.label}</span>
              <span className={`font-heading ${row.color}`}>
                {formatValue(row.count)}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${row.bar} rounded-full`}
                initial={{ width: 0 }}
                animate={visible ? { width: `${row.pct}%` } : {}}
                transition={{ duration: 1.2, delay: row.delay }}
              />
            </div>
          </div>
        ))}
      </div>

      <hr className="border-border my-5" />
      <p className="text-xs text-muted-foreground italic leading-relaxed">
        {t('landing.card.disclaimer', '₹2,500/month starting SIP, 10% step-up yearly, 12% annual return. Not guaranteed.')}
      </p>

      <div className="bg-saffron/5 border border-saffron/20 rounded-xl px-5 py-3.5 mt-5">
        <p className="text-sm font-body font-medium text-foreground">
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

      <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-24 grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-16 items-center">

        <div className="md:col-span-3 space-y-7">
          <div>
            <img
              src="/investsahi-logo.png"
              alt="InvestSahi"
              className="h-14 md:h-16 w-auto"
            />
          </div>

          <span className="inline-block px-4 py-1.5 rounded-full bg-saffron/10 text-saffron text-xs font-semibold font-body tracking-wide uppercase border border-saffron/20">
            {t('landing.tag', "Odisha's Homegrown Financial Services Platform")}
          </span>

          <div className="space-y-1">
            <h1 className="font-body font-bold text-2xl md:text-4xl lg:text-[40px] leading-snug text-foreground mb-4">
              {t('landing.headline1', 'Most people wait until they\'re "rich enough" to start investing.')}
            </h1>
            <h2 className="font-body font-bold text-2xl md:text-4xl lg:text-[40px] leading-snug text-saffron">
              {t('landing.headline2', 'InvestSahi was built right here in Odisha to prove them wrong.')}
            </h2>
          </div>

          <p className="font-body text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
            {t('landing.body', 'Most people wait until they\'re "rich enough" to start investing. InvestSahi was built right here in Odisha to prove them wrong.')}
          </p>

          <div className="flex flex-wrap gap-2.5">
            {trustPills.map((pill, i) => (
              <span key={i} className="border border-border bg-card text-xs font-body font-medium text-foreground px-3.5 py-1.5 rounded-full">
                {pill}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
            <Link
              to={`/${lang}/calculator`}
              className="bg-saffron text-white font-heading font-semibold px-7 py-3.5 rounded-lg hover:opacity-90 transition-opacity text-center text-base shadow-md"
            >
              {t('landing.cta1', 'Build Your Wealth Plan →')}
            </Link>
            <Link
              to={`/${lang}/crore-plan`}
              className="md:hidden font-heading font-semibold px-7 py-3.5 rounded-lg transition-opacity hover:opacity-90 text-white text-center text-base"
              style={{ backgroundColor: '#1B6B3A' }}
            >
              {lang === 'or' ? 'Build ₹1 Crore →' : 'Build ₹1 Crore →'}
            </Link>
            <Link
              to={`/${lang}/book`}
              className="hidden md:inline-flex items-center justify-center font-heading font-semibold px-7 py-3.5 rounded-lg border-2 border-saffron text-saffron text-sm transition-colors hover:bg-saffron hover:text-white"
            >
              {t('landing.cta2', 'Book a free consultation')}
            </Link>
          </div>
        </div>

        <div className="md:col-span-2 pt-2 md:pt-0">
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
