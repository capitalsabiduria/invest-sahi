import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const SIPCard = () => {
  const { t } = useTranslation();
  const { ref, visible } = useScrollReveal(0.2);

  const count1 = useCountUp(41274, visible, 1200);
  const count2 = useCountUp(116170, visible, 1200);
  const count3 = useCountUp(494964, visible, 1200);

  const rows = [
    { label: t('landing.card.row1label', 'After 5 years'), count: count1, color: 'text-green', bar: 'bg-green', pct: 8, delay: 0 },
    { label: t('landing.card.row2label', 'After 10 years'), count: count2, color: 'text-green', bar: 'bg-green', pct: 23, delay: 0.3, large: true },
    { label: t('landing.card.row3label', 'After 20 years'), count: count3, color: 'text-saffron font-bold text-2xl', bar: 'bg-saffron', pct: 100, delay: 0.6 },
  ];

  return (
    <div ref={ref} className="bg-card rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-1">
        <Wallet className="text-saffron" size={22} />
        <h3 className="font-heading font-semibold text-lg text-foreground">
          {t('landing.card.title', '₹500/month SIP')}
        </h3>
      </div>
      <p className="text-sm text-muted-foreground font-body mb-5">
        {t('landing.card.subtitle', 'Started today, growing every month')}
      </p>

      {rows.map((row, i) => (
        <div key={i} className="mb-4">
          <div className="flex justify-between items-baseline mb-1">
            <span className="text-sm text-muted-foreground font-body">{row.label}</span>
            <span className={`font-heading ${row.large ? 'text-xl' : ''} ${row.color}`}>
              {fmt(row.count)}
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
        {t('landing.card.disclaimer', 'At 12% annual return. Not guaranteed. Past performance may vary.')}
      </p>

      <div className="bg-muted rounded-lg px-4 py-3 mt-4">
        <p className="text-sm font-body text-foreground">
          {(() => {
            const full = t('landing.card.footer', 'Your ₹500 invested = ₹41,274 profit after 5 years');
            const [before, after] = full.split('₹41,274');
            return <>
              {before}
              <span className="text-green font-semibold">₹41,274</span>
              {after}
            </>;
          })()}
        </p>
      </div>
    </div>
  );
};

const LandingHero = ({ lang }: { lang: string }) => {
  const { t } = useTranslation();

  const trustPills = [
    t('landing.trust1', 'SEBI Registered'),
    t('landing.trust2', 'AMFI Certified'),
    t('landing.trust3', 'IRDAI Licensed'),
  ];

  return (
    <section className="min-h-screen bg-background flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 grid grid-cols-1 md:grid-cols-5 gap-12 items-center">

        {/* LEFT — brand story (3/5) */}
        <div className="md:col-span-3">
          <span className="inline-block bg-saffron text-white text-xs font-medium font-body px-3 py-1 rounded-full mb-5">
            {t('landing.tag', "Odisha's Homegrown Financial Services Platform")}
          </span>

          <h1 className="font-heading font-bold text-4xl md:text-[52px] leading-tight text-foreground mb-5">
            {t('landing.headline1', 'Wealth is not about how much you earn.')}<br />
            <span className="text-saffron">
              {t('landing.headline2', "It's about what you do with it.")}
            </span>
          </h1>

          <p className="font-body text-lg text-muted-foreground max-w-lg mb-6">
            {t('landing.body', 'A school teacher in Kendrapara earning ₹28,000/month can build a ₹25 lakh education fund for her daughter. An HR Manager in Bhubaneswar earning ₹55,000/month can retire at 55 with a ₹2 crore corpus. InvestSahi exists to show them how.')}
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
              {t('landing.cta1', 'Start with ₹500 →')}
            </Link>
            <Link
              to={`/${lang}/book`}
              className="text-saffron font-body text-sm hover:underline"
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
