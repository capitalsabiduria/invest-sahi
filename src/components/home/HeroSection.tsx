import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Clock, Shield, Check } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { AMFI_ARN, IRDAI_REG } from '@/config/constants';

export const heroStates = [
  { tag: 'hero.state1.tag', tagColor: 'bg-saffron', headline: 'hero.state1.headline', subline: 'hero.state1.subline', ctaText: 'hero.state1.cta', ctaColor: 'bg-saffron', secondaryText: 'hero.state1.secondary', cardType: 'education' as const },
  { tag: 'hero.state2.tag', tagColor: 'bg-green', headline: 'hero.state2.headline', subline: 'hero.state2.subline', ctaText: 'hero.state2.cta', ctaColor: 'bg-green', secondaryText: 'hero.state2.secondary', cardType: 'growth' as const },
  { tag: 'hero.state3.tag', tagColor: 'bg-blue', headline: 'hero.state3.headline', subline: 'hero.state3.subline', ctaText: 'hero.state3.cta', ctaColor: 'bg-blue', secondaryText: 'hero.state3.secondary', cardType: 'trust' as const },
];

export const EducationCard = ({ lang }: { lang: string }) => {
  const { t } = useTranslation();
  const rows = [
    { label: t('hero.card1.childAge', 'Child Age'), value: '7 yrs' },
    { label: t('hero.card1.institution', 'Institution'), value: 'NIT Rourkela' },
    { label: t('hero.card1.monthlySip', 'Monthly SIP'), value: '₹3,000' },
    { label: t('hero.card1.years', 'Years to Goal'), value: '11' },
    { label: t('hero.card1.corpus', 'Projected Corpus'), value: '₹8,42,000' },
  ];
  return (
    <div className="bg-card rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="text-saffron" size={24} />
        <h3 className="font-heading font-semibold text-lg text-foreground">{t('hero.card1.title', 'Education Planner')}</h3>
      </div>
      {rows.map((r, i) => (
        <div key={i} className="flex justify-between py-2 border-b border-border last:border-0">
          <span className="text-sm text-muted-foreground font-body">{r.label}</span>
          <span className="text-sm font-semibold font-heading text-foreground">{r.value}</span>
        </div>
      ))}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-xs bg-green-light text-green px-2 py-0.5 rounded-full font-medium">✓ On Track</span>
      </div>
      <Link to={`/${lang}/calculator`} className="text-sm text-saffron font-medium mt-3 inline-block hover:underline">
        {t('hero.card1.link', 'Try calculator →')}
      </Link>
    </div>
  );
};

export const GrowthCard = () => {
  const { t } = useTranslation();
  const bars = [
    { label: t('hero.card2.row1', '5 Years'), amount: '₹41,000', width: 25 },
    { label: t('hero.card2.row2', '10 Years'), amount: '₹2,32,000', width: 55 },
    { label: t('hero.card2.row3', '20 Years'), amount: '₹9,89,000', width: 90 },
  ];
  const { ref, visible } = useScrollReveal(0.3);
  return (
    <div ref={ref} className="bg-card rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="text-green" size={24} />
        <h3 className="font-heading font-semibold text-lg text-foreground">{t('hero.card2.title', 'Power of Compounding')}</h3>
      </div>
      {bars.map((b, i) => (
        <div key={i} className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground font-body">{b.label}</span>
            <span className="font-semibold font-heading text-foreground">{b.amount}</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-green rounded-full"
              initial={{ width: 0 }}
              animate={visible ? { width: `${b.width}%` } : {}}
              transition={{ duration: 1, delay: i * 0.2 }}
            />
          </div>
        </div>
      ))}
      <p className="text-[11px] text-muted-foreground font-body">{t('hero.card2.disclaimer', 'Assuming 12% annual returns. Past performance...')}</p>
    </div>
  );
};

export const TrustCard = () => {
  const { t } = useTranslation();
  const items = [
    t('hero.card3.item1', 'SEBI Registered'),
    t('hero.card3.item2', 'AMFI Certified'),
    t('hero.card3.item3', 'IRDAI Licensed'),
    t('hero.card3.item4', 'Zero Hidden Charges'),
  ];
  return (
    <div className="bg-blue-light rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="text-blue" size={24} />
        <h3 className="font-heading font-semibold text-lg text-foreground">{t('hero.card3.title', 'Why Trust Us')}</h3>
      </div>
      <ul className="space-y-3 mb-4">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2 text-sm font-body text-foreground">
            <Check className="text-green" size={18} /> {item}
          </li>
        ))}
      </ul>
      <div className="flex gap-3">
        <div className="bg-card rounded-lg px-4 py-2 text-center flex-1">
          <span className="text-xs text-muted-foreground font-body">AMFI</span>
          <p className="font-heading font-semibold text-sm text-foreground">ARN-{AMFI_ARN}</p>
        </div>
        <div className="bg-card rounded-lg px-4 py-2 text-center flex-1">
          <span className="text-xs text-muted-foreground font-body">IRDAI</span>
          <p className="font-heading font-semibold text-sm text-foreground">REG-{IRDAI_REG}</p>
        </div>
      </div>
    </div>
  );
};

const HeroSection = ({ lang }: { lang: string }) => {
  const { t } = useTranslation();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((p) => (p + 1) % heroStates.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const state = heroStates[active];
  const cardMap = {
    education: <EducationCard lang={lang} />,
    growth: <GrowthCard />,
    trust: <TrustCard />,
  };

  return (
    <section className="min-h-screen bg-background flex items-center">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-medium font-body mb-4 ${state.tagColor}`}>
                {t(state.tag, state.tag)}
              </span>
              <h1 className="font-heading font-bold text-4xl md:text-[56px] leading-tight text-foreground mb-4">
                {t(state.headline, state.headline)}
              </h1>
              <p className="font-body text-lg text-muted-foreground mb-6 max-w-lg">
                {t(state.subline, state.subline)}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to={`/${lang}/book`}
                  className={`${state.ctaColor} text-white font-heading font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity`}
                >
                  {t(state.ctaText, state.ctaText)}
                </Link>
                <Link to={`/${lang}/learn`} className="text-sm text-muted-foreground font-body hover:text-saffron transition-colors">
                  {t(state.secondaryText, state.secondaryText)} →
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Dots */}
          <div className="flex gap-2 mt-8">
            {heroStates.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-3 h-3 rounded-full transition-colors ${i === active ? 'bg-saffron' : 'bg-muted'}`}
              />
            ))}
          </div>
        </div>
        <div className="md:col-span-2">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={state.cardType}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                {cardMap[state.cardType]}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
