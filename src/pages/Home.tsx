import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap, Clock, Shield, ArrowRight, Check,
  TrendingUp, Heart, Briefcase, Home as HomeIcon, Car, Umbrella,
  Wallet, PiggyBank, Landmark, Star, Baby, BookOpen,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCountUp } from '@/hooks/useCountUp';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RevealSection from '@/components/RevealSection';
import { INSTITUTIONS, INSTITUTION_COSTS } from '@/data/institutions';
import { calculateProjectedCost, calculateRequiredSIP, calculateSIPCorpus, formatCurrency } from '@/utils/sipCalculator';

// ─── SECTION 1: HERO ───
const heroStates = [
  { tag: 'hero.state1.tag', tagColor: 'bg-saffron', headline: 'hero.state1.headline', subline: 'hero.state1.subline', ctaText: 'hero.state1.cta', ctaColor: 'bg-saffron', secondaryText: 'hero.state1.secondary', cardType: 'education' as const },
  { tag: 'hero.state2.tag', tagColor: 'bg-green', headline: 'hero.state2.headline', subline: 'hero.state2.subline', ctaText: 'hero.state2.cta', ctaColor: 'bg-green', secondaryText: 'hero.state2.secondary', cardType: 'growth' as const },
  { tag: 'hero.state3.tag', tagColor: 'bg-blue', headline: 'hero.state3.headline', subline: 'hero.state3.subline', ctaText: 'hero.state3.cta', ctaColor: 'bg-blue', secondaryText: 'hero.state3.secondary', cardType: 'trust' as const },
];

const EducationCard = ({ lang }: { lang: string }) => {
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

const GrowthCard = () => {
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

const TrustCard = () => {
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
          <p className="font-heading font-semibold text-sm text-foreground">ARN-XXXXX</p>
        </div>
        <div className="bg-card rounded-lg px-4 py-2 text-center flex-1">
          <span className="text-xs text-muted-foreground font-body">IRDAI</span>
          <p className="font-heading font-semibold text-sm text-foreground">REG-XXXXX</p>
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

// ─── SECTION 2: STATS BAR ───
const StatsBar = () => {
  const { t } = useTranslation();
  const { ref, visible } = useScrollReveal();
  const stats = [
    { number: 500, suffix: '+', label: t('stats.label1', 'Families Served') },
    { number: 15, suffix: '+', label: t('stats.label2', 'Years Experience') },
    { number: 50, suffix: 'Cr+', label: t('stats.label3', 'Assets Managed') },
    { number: 98, suffix: '%', label: t('stats.label4', 'Client Retention') },
  ];
  return (
    <section ref={ref} className="bg-saffron py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => (
          <StatItem key={i} stat={s} active={visible} />
        ))}
      </div>
    </section>
  );
};

const StatItem = ({ stat, active }: { stat: { number: number; suffix: string; label: string }; active: boolean }) => {
  const count = useCountUp(stat.number, active);
  return (
    <div className="md:border-r last:border-0 border-white/30">
      <p className="font-heading font-bold text-4xl text-white">{count}{stat.suffix}</p>
      <p className="font-body text-sm text-white/80 mt-1">{stat.label}</p>
    </div>
  );
};

// ─── SECTION 3: GOAL CARDS ───
const GoalCards = ({ lang }: { lang: string }) => {
  const { t } = useTranslation();
  const goalCards = [
    {
      accent: 'border-saffron', iconBg: 'bg-saffron-light', iconColor: 'text-saffron',
      Icon: Heart, titleKey: 'goals.card1.title', sublineKey: 'goals.card1.subline',
      goals: ['goals.card1.goal1', 'goals.card1.goal2', 'goals.card1.goal3', 'goals.card1.goal4'],
      ctaKey: 'goals.card1.cta', ctaHref: `/${lang}/services`,
    },
    {
      accent: 'border-green', iconBg: 'bg-green-light', iconColor: 'text-green',
      Icon: Briefcase, titleKey: 'goals.card2.title', sublineKey: 'goals.card2.subline',
      goals: ['goals.card2.goal1', 'goals.card2.goal2', 'goals.card2.goal3', 'goals.card2.goal4'],
      ctaKey: 'goals.card2.cta', ctaHref: `/${lang}/services`,
    },
    {
      accent: 'border-blue', iconBg: 'bg-blue-light', iconColor: 'text-blue',
      Icon: GraduationCap, titleKey: 'goals.card3.title', sublineKey: 'goals.card3.subline',
      goals: ['goals.card3.goal1', 'goals.card3.goal2', 'goals.card3.goal3', 'goals.card3.goal4'],
      ctaKey: 'goals.card3.cta', ctaHref: `/${lang}/calculator`,
    },
  ];
  return (
    <section className="bg-card py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {goalCards.map((card, i) => (
          <RevealSection key={i} delay={i * 0.15}>
            <div className={`bg-card rounded-xl border-l-4 ${card.accent} p-6 shadow-sm h-full`}>
              <div className={`w-12 h-12 ${card.iconBg} rounded-full flex items-center justify-center mb-4`}>
                <card.Icon className={card.iconColor} size={24} />
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-2">{t(card.titleKey, card.titleKey)}</h3>
              <p className="text-sm text-muted-foreground font-body mb-4">{t(card.sublineKey, card.sublineKey)}</p>
              <ul className="space-y-2 mb-4">
                {card.goals.map((g) => (
                  <li key={g} className="flex items-center gap-2 text-sm font-body text-foreground">
                    <ArrowRight size={14} className="text-muted-foreground" /> {t(g, g)}
                  </li>
                ))}
              </ul>
              <Link to={card.ctaHref} className={`text-sm font-medium ${card.iconColor} hover:underline`}>
                {t(card.ctaKey, card.ctaKey)} →
              </Link>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
};

// ─── SECTION 4: EDUCATION TEASER + MINI CALC ───

const EducationTeaser = ({ lang }: { lang: string }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [childAge, setChildAge] = useState(7);
  const [institution, setInstitution] = useState('NIT Rourkela');
  const [budget, setBudget] = useState(2000);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const baseCost = INSTITUTION_COSTS[institution] || INSTITUTION_COSTS['NIT Rourkela'];
  const calc = useMemo(() => {
    const months = (18 - childAge) * 12;
    const years = 18 - childAge;
    if (months <= 0) return { projected: 0, target: 0, gap: 0 };
    const projected = calculateSIPCorpus(budget, months);
    const target = calculateProjectedCost(baseCost, years);
    return { projected: Math.round(projected), target: Math.round(target), gap: Math.round(target - projected) };
  }, [childAge, budget, baseCost]);

  const onTrack = calc.projected >= calc.target;
  const years = 18 - childAge;
  const extraNeeded = !onTrack && years > 0 ? Math.round(calculateRequiredSIP(calc.gap, years * 12)) : 0;

  const handleLeadSubmit = async () => {
    if (!email && !phone) return;
    await supabase.from('calculator_leads').insert({
      child_age: childAge,
      target_institution: institution,
      monthly_sip_needed: onTrack ? budget : budget + extraNeeded,
      user_monthly_budget: budget,
      email, phone,
    });
    setSubmitted(true);
    toast({ title: t('calc.success', 'Thank you!'), description: t('calc.successDesc', "We'll reach out soon.") });
  };

  const institutionCosts = [
    { name: 'NIT Rourkela', cost: '₹6L', years: '4 yrs' },
    { name: 'AIIMS Bhubaneswar', cost: '₹4L', years: '5 yrs' },
    { name: 'IIT Bhubaneswar', cost: '₹8L', years: '4 yrs' },
    { name: 'Private Engineering', cost: '₹12L', years: '4 yrs' },
  ];

  return (
    <section className="bg-green-light py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-11 gap-10 items-start">
        {/* Left */}
        <RevealSection className="md:col-span-6">
          <span className="inline-block bg-green text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
            {t('edu.tag', 'edu.tag')}
          </span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">{t('edu.headline', 'edu.headline')}</h2>
          <p className="font-body text-muted-foreground mb-6">{t('edu.body', 'edu.body')}</p>
          <div className="space-y-3 mb-6">
            {institutionCosts.map((ic) => (
              <div key={ic.name} className="flex items-center justify-between bg-card rounded-lg px-4 py-3">
                <span className="font-body text-sm text-foreground">{ic.name}</span>
                <div className="flex gap-4">
                  <span className="font-heading font-semibold text-sm text-saffron">{ic.cost}</span>
                  <span className="text-xs text-muted-foreground">{ic.years}</span>
                </div>
              </div>
            ))}
          </div>
          <Link to={`/${lang}/calculator`} className="bg-green text-white font-heading font-semibold px-6 py-3 rounded-lg inline-block hover:opacity-90 transition-opacity">
            {t('edu.cta', 'edu.cta')} →
          </Link>
        </RevealSection>

        {/* Right - Mini Calculator */}
        <RevealSection className="md:col-span-5" delay={0.2}>
          <div className="bg-card rounded-xl shadow-lg p-6">
            <h3 className="font-heading font-semibold text-lg text-foreground mb-5">{t('calc.quickEstimate', 'Quick Estimate')}</h3>

            <div className="mb-5">
              <label className="text-sm font-body text-muted-foreground mb-2 block">{t('calc.childAge', "Child's Age")}: <span className="font-semibold text-foreground">{childAge} years</span></label>
              <Slider value={[childAge]} onValueChange={([v]) => setChildAge(v)} min={1} max={15} step={1} />
            </div>

            <div className="mb-5">
              <label className="text-sm font-body text-muted-foreground mb-2 block">{t('calc.institution', 'Institution')}</label>
              <Select value={institution} onValueChange={setInstitution}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {INSTITUTIONS.map((inst) => (
                    <SelectItem key={inst.id} value={inst.name}>{inst.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="mb-6">
              <label className="text-sm font-body text-muted-foreground mb-2 block">{t('calc.budget', 'Monthly Budget')}: <span className="font-semibold text-foreground">{formatCurrency(budget)}/month</span></label>
              <Slider value={[budget]} onValueChange={([v]) => setBudget(v)} min={500} max={10000} step={500} />
            </div>

            <div className="bg-muted rounded-lg p-4 mb-4">
              <p className="text-sm text-muted-foreground font-body mb-1">
                {t('calc.investing', 'Investing')} {formatCurrency(budget)}/mo {t('calc.for', 'for')} {years} {t('calc.years', 'years')}
              </p>
              <motion.p
                className="font-heading font-bold text-2xl text-green"
                key={calc.projected}
                initial={{ opacity: 0.5, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {t('calc.youllHave', "You'll have")}: {formatCurrency(calc.projected)}
              </motion.p>
              <p className="text-sm text-muted-foreground font-body mt-1">
                {t('calc.target', 'Target for')} {institution}: ~{formatCurrency(calc.target)}
              </p>
              <div className="mt-2">
                {onTrack ? (
                  <span className="text-xs bg-green-light text-green px-2 py-0.5 rounded-full font-medium">✓ {t('calc.onTrack', 'On track')}</span>
                ) : (
                  <span className="text-xs bg-saffron-light text-amber px-2 py-0.5 rounded-full font-medium">
                    {formatCurrency(extraNeeded)} {t('calc.moreNeeded', 'more/month needed')}
                  </span>
                )}
              </div>
            </div>

            {!showForm && !submitted && (
              <button
                onClick={() => setShowForm(true)}
                className="text-sm text-saffron font-medium hover:underline"
              >
                {t('calc.getFullPlan', 'Get full plan →')}
              </button>
            )}

            {showForm && !submitted && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3 mt-2">
                <Input placeholder={t('calc.email', 'Email')} value={email} onChange={(e) => setEmail(e.target.value)} />
                <Input placeholder={t('calc.phone', 'Phone')} value={phone} onChange={(e) => setPhone(e.target.value)} />
                <button onClick={handleLeadSubmit} className="w-full bg-saffron text-white font-heading font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity">
                  {t('calc.submit', 'Get My Plan')}
                </button>
              </motion.div>
            )}

            {submitted && (
              <div className="text-center py-3">
                <Check className="text-green mx-auto mb-1" size={28} />
                <p className="text-sm font-body text-foreground">{t('calc.thankyou', 'Thank you! We will contact you soon.')}</p>
              </div>
            )}
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

// ─── SECTION 5: ARTHA KATHA STORIES ───
const STORIES = [
  { id: '1', categoryKey: 'stories.cat1', categoryColor: 'bg-saffron', nameKey: 'stories.name1', professionKey: 'stories.prof1', previewKey: 'stories.preview1', slug: 'story-1' },
  { id: '2', categoryKey: 'stories.cat2', categoryColor: 'bg-green', nameKey: 'stories.name2', professionKey: 'stories.prof2', previewKey: 'stories.preview2', slug: 'story-2' },
  { id: '3', categoryKey: 'stories.cat3', categoryColor: 'bg-blue', nameKey: 'stories.name3', professionKey: 'stories.prof3', previewKey: 'stories.preview3', slug: 'story-3' },
];

const StoriesSection = ({ lang }: { lang: string }) => {
  const { t } = useTranslation();
  return (
    <section className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <RevealSection className="text-center mb-12">
          <h2 className="font-odia text-3xl md:text-[32px] text-foreground mb-1">ଓଡ଼ିଶାର ଅର୍ଥ କଥା</h2>
          <p className="font-body text-muted-foreground">{t('stories.subtitle', 'Real money stories from Odisha')}</p>
        </RevealSection>
        <div className="flex gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none md:grid md:grid-cols-3">
          {STORIES.map((story, i) => (
            <RevealSection key={story.id} delay={i * 0.15} className="min-w-[300px] md:min-w-0 snap-start">
              <div className="bg-card rounded-xl p-6 shadow-sm h-full flex flex-col">
                <span className={`inline-block w-fit px-2 py-0.5 rounded-full text-white text-xs font-medium mb-3 ${story.categoryColor}`}>
                  {t(story.categoryKey, story.categoryKey)}
                </span>
                <h3 className="font-heading font-semibold text-lg text-foreground">{t(story.nameKey, story.nameKey)}</h3>
                <p className="text-sm text-muted-foreground font-body mb-2">{t(story.professionKey, story.professionKey)}</p>
                <p className="text-sm font-body text-foreground line-clamp-3 flex-1">{t(story.previewKey, story.previewKey)}</p>
                <div className="flex gap-2 mt-3 mb-3">
                  <span className="text-xs border border-border rounded px-2 py-0.5 text-muted-foreground">EN</span>
                  <span className="text-xs border border-border rounded px-2 py-0.5 text-muted-foreground font-odia">ଓଡ଼ିଆ</span>
                </div>
                <Link to={`/${lang}/learn`} className="text-sm text-saffron font-medium hover:underline">
                  {t('stories.readMore', 'Read story')} →
                </Link>
              </div>
            </RevealSection>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to={`/${lang}/learn`} className="text-sm font-medium text-saffron hover:underline">
            {t('stories.readAll', 'Read all stories')} →
          </Link>
        </div>
      </div>
    </section>
  );
};

// ─── SECTION 6: ODIA PROMISE ───
const OdiaPromise = () => {
  const { t, i18n } = useTranslation();
  const switchLang = (l: string) => {
    i18n.changeLanguage(l);
    localStorage.setItem('investsahi-lang', l);
  };
  const currentLang = i18n.language;
  return (
    <section className="bg-card py-20">
      <RevealSection className="max-w-2xl mx-auto px-4 text-center">
        <h2 className="font-odia text-3xl md:text-4xl text-foreground mb-3">{t('odia.headline', 'odia.headline')}</h2>
        <p className="font-body italic text-muted-foreground mb-6">{t('odia.translation', 'odia.translation')}</p>
        <p className="font-body text-[17px] text-foreground leading-relaxed mb-8">{t('odia.body', 'odia.body')}</p>
        <div className="inline-flex rounded-full border border-saffron overflow-hidden">
          <button onClick={() => switchLang('en')} className={`px-5 py-2 text-sm font-body font-medium ${currentLang === 'en' ? 'bg-saffron text-white' : 'text-saffron'}`}>
            English
          </button>
          <button onClick={() => switchLang('or')} className={`px-5 py-2 text-sm font-odia font-medium ${currentLang === 'or' ? 'bg-saffron text-white' : 'text-saffron'}`}>
            ଓଡ଼ିଆ
          </button>
        </div>
      </RevealSection>
    </section>
  );
};

// ─── SECTION 7: SERVICES GRID ───
const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, Shield, Heart, Briefcase, HomeIcon, Car, Umbrella, Wallet, PiggyBank, Landmark, Star, Baby, BookOpen, GraduationCap,
};

const SERVICES = [
  { nameKey: 'services.s1.name', amountKey: 'services.s1.amount', descKey: 'services.s1.desc', iconName: 'TrendingUp', iconColor: 'text-saffron', iconBg: 'bg-saffron-light' },
  { nameKey: 'services.s2.name', amountKey: 'services.s2.amount', descKey: 'services.s2.desc', iconName: 'PiggyBank', iconColor: 'text-green', iconBg: 'bg-green-light' },
  { nameKey: 'services.s3.name', amountKey: 'services.s3.amount', descKey: 'services.s3.desc', iconName: 'Shield', iconColor: 'text-blue', iconBg: 'bg-blue-light' },
  { nameKey: 'services.s4.name', amountKey: 'services.s4.amount', descKey: 'services.s4.desc', iconName: 'GraduationCap', iconColor: 'text-saffron', iconBg: 'bg-saffron-light' },
  { nameKey: 'services.s5.name', amountKey: 'services.s5.amount', descKey: 'services.s5.desc', iconName: 'Heart', iconColor: 'text-green', iconBg: 'bg-green-light' },
  { nameKey: 'services.s6.name', amountKey: 'services.s6.amount', descKey: 'services.s6.desc', iconName: 'Umbrella', iconColor: 'text-blue', iconBg: 'bg-blue-light' },
  { nameKey: 'services.s7.name', amountKey: 'services.s7.amount', descKey: 'services.s7.desc', iconName: 'Briefcase', iconColor: 'text-saffron', iconBg: 'bg-saffron-light' },
  { nameKey: 'services.s8.name', amountKey: 'services.s8.amount', descKey: 'services.s8.desc', iconName: 'HomeIcon', iconColor: 'text-green', iconBg: 'bg-green-light' },
  { nameKey: 'services.s9.name', amountKey: 'services.s9.amount', descKey: 'services.s9.desc', iconName: 'Car', iconColor: 'text-blue', iconBg: 'bg-blue-light' },
  { nameKey: 'services.s10.name', amountKey: 'services.s10.amount', descKey: 'services.s10.desc', iconName: 'Wallet', iconColor: 'text-saffron', iconBg: 'bg-saffron-light' },
  { nameKey: 'services.s11.name', amountKey: 'services.s11.amount', descKey: 'services.s11.desc', iconName: 'Landmark', iconColor: 'text-green', iconBg: 'bg-green-light' },
  { nameKey: 'services.s12.name', amountKey: 'services.s12.amount', descKey: 'services.s12.desc', iconName: 'Star', iconColor: 'text-blue', iconBg: 'bg-blue-light' },
];

const ServicesGrid = () => {
  const { t } = useTranslation();
  return (
    <section className="py-20" style={{ backgroundColor: '#F5F5F0' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <RevealSection className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl text-foreground">{t('servicesGrid.title', 'servicesGrid.title')}</h2>
          <p className="font-body text-muted-foreground mt-2">{t('servicesGrid.subtitle', 'servicesGrid.subtitle')}</p>
        </RevealSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SERVICES.map((svc, i) => {
            const Icon = ICON_MAP[svc.iconName] || TrendingUp;
            return (
              <RevealSection key={i} delay={i * 0.05}>
                <div className="bg-card rounded-xl border border-border p-5 hover:border-l-4 hover:border-l-saffron hover:shadow-md transition-all h-full">
                  <div className={`w-10 h-10 ${svc.iconBg} rounded-full flex items-center justify-center mb-3`}>
                    <Icon className={svc.iconColor} size={20} />
                  </div>
                  <h3 className="font-heading font-semibold text-sm text-foreground">{t(svc.nameKey, svc.nameKey)}</h3>
                  <p className="font-heading font-bold text-saffron text-sm mt-1">{t(svc.amountKey, svc.amountKey)}</p>
                  <p className="text-xs text-muted-foreground font-body mt-1">{t(svc.descKey, svc.descKey)}</p>
                </div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ─── SECTION 8: TRUST SIGNALS ───
const TRUST_ITEMS = [
  { Icon: Shield, color: 'text-saffron', titleKey: 'trust.t1.title', lines: ['trust.t1.line1', 'trust.t1.line2', 'trust.t1.line3'], noteKey: 'trust.t1.note' },
  { Icon: Landmark, color: 'text-green', titleKey: 'trust.t2.title', lines: ['trust.t2.line1', 'trust.t2.line2', 'trust.t2.line3'], noteKey: 'trust.t2.note' },
  { Icon: Heart, color: 'text-blue', titleKey: 'trust.t3.title', lines: ['trust.t3.line1', 'trust.t3.line2', 'trust.t3.line3'], noteKey: 'trust.t3.note' },
];

const TrustSignals = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {TRUST_ITEMS.map((item, i) => (
          <RevealSection key={i} delay={i * 0.15} className="text-center">
            <item.Icon className={`${item.color} mx-auto mb-4`} size={36} />
            <h3 className="font-heading font-semibold text-xl text-foreground mb-3">{t(item.titleKey, item.titleKey)}</h3>
            <ul className="space-y-1.5 mb-3">
              {item.lines.map((l) => (
                <li key={l} className="text-sm font-body text-muted-foreground">{t(l, l)}</li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground font-body italic">{t(item.noteKey, item.noteKey)}</p>
          </RevealSection>
        ))}
      </div>
    </section>
  );
};

// ─── SECTION 9: NEWSLETTER ───
const Newsletter = () => {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [nlEmail, setNlEmail] = useState('');
  const [nlLang, setNlLang] = useState(i18n.language);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlEmail) return;
    const { error } = await supabase.from('newsletter_subscribers').insert({
      email: nlEmail, name: name || null, language_preference: nlLang,
    });
    if (error?.code === '23505') {
      toast({ title: t('newsletter.duplicate', 'Already subscribed!'), variant: 'destructive' });
      return;
    }
    if (error) {
      toast({ title: t('newsletter.error', 'Something went wrong'), variant: 'destructive' });
      return;
    }
    setSuccess(true);
  };

  return (
    <section className="bg-green py-20">
      <RevealSection className="max-w-xl mx-auto px-4 text-center">
        {!success ? (
          <>
            <h2 className="font-heading font-bold text-3xl text-white mb-2">{t('newsletter.headline', 'newsletter.headline')}</h2>
            <p className="font-body text-white/80 mb-6">{t('newsletter.subline', 'newsletter.subline')}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder={t('newsletter.name', 'Your name')}
                value={name} onChange={(e) => setName(e.target.value)}
                className="bg-white/90 border-0"
              />
              <Input
                type="email" required
                placeholder={t('newsletter.email', 'Email address')}
                value={nlEmail} onChange={(e) => setNlEmail(e.target.value)}
                className="bg-white/90 border-0"
              />
              <div className="flex justify-center gap-2">
                <button type="button" onClick={() => setNlLang('en')}
                  className={`px-3 py-1 rounded-full text-sm ${nlLang === 'en' ? 'bg-white text-green' : 'border border-white/50 text-white'}`}>
                  EN
                </button>
                <button type="button" onClick={() => setNlLang('or')}
                  className={`px-3 py-1 rounded-full text-sm font-odia ${nlLang === 'or' ? 'bg-white text-green' : 'border border-white/50 text-white'}`}>
                  ଓଡ଼ିଆ
                </button>
              </div>
              <button type="submit" className="w-full bg-saffron text-white font-heading font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
                {t('newsletter.subscribe', 'Subscribe')}
              </button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Check className="text-white mx-auto mb-3" size={48} />
            <p className="font-heading text-2xl text-white mb-1">{t('newsletter.success', 'Subscribed!')}</p>
            <p className="font-odia text-xl text-white/80">ଧନ୍ୟବାଦ!</p>
          </motion.div>
        )}
      </RevealSection>
    </section>
  );
};

// ─── HOME PAGE ───
const Home = () => {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection lang={currentLang} />
      <StatsBar />
      <GoalCards lang={currentLang} />
      <EducationTeaser lang={currentLang} />
      <StoriesSection lang={currentLang} />
      <OdiaPromise />
      <ServicesGrid />
      <TrustSignals />
      <Newsletter />
      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default Home;
