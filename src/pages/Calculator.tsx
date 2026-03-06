import { useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { GraduationCap, Stethoscope, Briefcase, BookOpen, Check, MessageCircle, Clock, Wallet, PiggyBank } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import MobileBottomBar from '@/components/MobileBottomBar';
import RevealSection from '@/components/RevealSection';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { INSTITUTIONS } from '@/data/institutions';
import { calculateProjectedCost, calculateRequiredSIP, calculateSIPCorpus, formatCurrency } from '@/utils/sipCalculator';
import { WHATSAPP_URL } from '@/config/constants';
import { useRelevantGuide } from '@/hooks/useRelevantGuide';
import GoalSelector, { type GoalType } from '@/components/calculator/GoalSelector';
import BasicWealthCalculator from '@/components/calculator/BasicWealthCalculator';

const ICON_MAP: Record<string, React.ElementType> = { GraduationCap, Stethoscope, Briefcase, BookOpen };

const Calculator = () => {
  const { t } = useTranslation();
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const goal = searchParams.get('goal') as GoalType | null;
    if (goal && ['home', 'education', 'retirement', 'wealth'].includes(goal)) {
      setSelectedGoal(goal);
    }
  }, [searchParams]);
  const { toast } = useToast();

  const relevantGuide = useRelevantGuide('education', currentLang);

  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState(7);
  const targetAge = 18;
  const yearsToGoal = targetAge - childAge;

  const [selectedInst, setSelectedInst] = useState('nit');
  const [customInst, setCustomInst] = useState('');
  const [customCost, setCustomCost] = useState('');

  const [budget, setBudget] = useState(2000);
  const [stepUp, setStepUp] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappPlan, setWhatsappPlan] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const inst = INSTITUTIONS.find((i) => i.id === selectedInst) || INSTITUTIONS[0];
  const baseCost = selectedInst === 'other' && customCost ? Number(customCost) : inst.baseCost;

  const calc = useMemo(() => {
    if (yearsToGoal <= 0) return { projected: 0, target: 0, totalInvested: 0, percentCovered: 0 };
    const n = yearsToGoal * 12;
    let projected: number;
    if (stepUp) {
      let total = 0;
      let currentBudget = budget;
      for (let yr = 0; yr < yearsToGoal; yr++) {
        const sipFV = calculateSIPCorpus(currentBudget, 12);
        total = total * Math.pow(1 + 0.12, 1) + sipFV;
        currentBudget = Math.round(currentBudget * 1.1);
      }
      projected = Math.round(total);
    } else {
      projected = Math.round(calculateSIPCorpus(budget, n));
    }
    const target = Math.round(calculateProjectedCost(baseCost, yearsToGoal));
    const totalInvested = stepUp
      ? (() => { let t = 0, b = budget; for (let y = 0; y < yearsToGoal; y++) { t += b * 12; b = Math.round(b * 1.1); } return t; })()
      : budget * n;
    const percentCovered = Math.min(100, Math.round((projected / target) * 100));
    return { projected, target, totalInvested, percentCovered };
  }, [childAge, budget, baseCost, stepUp, yearsToGoal]);

  const onTrack = calc.projected >= calc.target;
  const gap = calc.target - calc.projected;
  const extraNeeded = !onTrack && yearsToGoal > 0
    ? Math.round(calculateRequiredSIP(gap, yearsToGoal * 12))
    : 0;

  const waText = encodeURIComponent(
    `Hi, I want to plan for my child's ${selectedInst === 'other' ? customInst || 'education' : inst.name} fund. My child is ${childAge} years old. I can invest ${formatCurrency(budget)}/month${stepUp ? ' with 10% annual step-up' : ''}. Monthly SIP needed: ${formatCurrency(onTrack ? budget : budget + extraNeeded)}. Please send my education plan.`
  );

  const handleSubmit = async () => {
    if (!email && !phone) return;
    await supabase.from('calculator_leads').insert({
      calculator_type: 'education',
      lead_name: name,
      child_age: childAge,
      target_institution: selectedInst === 'other' ? customInst || 'Other' : inst.name,
      monthly_sip_needed: onTrack ? budget : budget + extraNeeded,
      user_monthly_budget: budget,
      whatsapp_message: decodeURIComponent(waText),
      email, phone,
    } as any);
    setSubmitted(true);
    toast({ title: t('calc.successTitle', 'Plan submitted!') });
  };

  const compareAges = [5, 10, 13];
  const compareData = compareAges.map((age) => {
    const n = (18 - age) * 12;
    return { age, corpus: n > 0 ? Math.round(calculateSIPCorpus(2000, n)) : 0 };
  });

  return (
    <div className="min-h-screen">
      <SEO
        title={currentLang === 'or'
          ? "SIP ଏବଂ ଶିକ୍ଷା ଯୋଜନା Calculator"
          : "SIP & Education Planning Calculators"}
        description={currentLang === 'or'
          ? "ଆପଣଙ୍କ ସନ୍ତାନର NIT Rourkela ବା AIIMS ଶିକ୍ଷା ପାଇଁ କେତେ ସଞ୍ଚୟ ଦରକାର ହିସାବ କରନ୍ତୁ। ନିଃଶୁଳ୍କ SIP calculator।"
          : "Calculate how much you need to save for your child's NIT Rourkela or AIIMS education. Free SIP and compound interest calculators."}
        url={`/${currentLang}/calculators`}
        lang={currentLang as 'en' | 'or'}
      />
      <Navbar />

      {/* Goal not yet selected — show Goal Selector */}
      {selectedGoal === null && (
        <>
          <section className="bg-green py-16 text-center">
            <div className="max-w-3xl mx-auto px-4">
              <h1 className="font-heading font-bold text-4xl text-white mb-3">
                {t('goals.page.heading', 'Build Your Wealth Plan')}
              </h1>
              <p className="font-body text-white/80">
                {t('goals.page.subheading', "Tell us your goal — we'll send you the exact plan for free in 24 hours!.")}
              </p>
            </div>
          </section>
          <GoalSelector onGoalSelect={setSelectedGoal} />
        </>
      )}

      {/* Education goal — existing full calculator */}
      {selectedGoal === 'education' && (
        <>
          <section className="bg-green py-16 text-center">
            <div className="max-w-3xl mx-auto px-4">
              <h1 className="font-heading font-bold text-4xl text-white mb-3">
                {t('calc.hero.headline', 'Education Planning Calculator')}
              </h1>
              <p className="font-body text-white/80">
                {t('calc.hero.subline', "Name the college. We'll show you the monthly SIP to get there.")}
              </p>
            </div>
          </section>
          {/* ← Change Goal button */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
            <button
              onClick={() => setSelectedGoal(null)}
              className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              ← {t('goals.calc.back', 'Change Goal')}
            </button>
          </div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 space-y-8">
          {/* Step 1 */}
          <RevealSection>
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h2 className="font-heading font-semibold text-xl text-foreground mb-4">{t('calc.step1', 'Step 1: About Your Child')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-body text-muted-foreground mb-1 block">{t('calc.childName', "Child's name (optional)")}</label>
                  <Input value={childName} onChange={(e) => setChildName(e.target.value)} placeholder={t('calc.childNamePlaceholder', 'e.g., Priya')} />
                </div>
                <div>
                  <label className="text-sm font-body text-muted-foreground mb-1 block">
                    {t('calc.currentAge', "Current age")}: <span className="font-semibold text-foreground">{childAge} {t('calc.yearsOld', 'years')}</span>
                  </label>
                  <Slider value={[childAge]} onValueChange={([v]) => setChildAge(v)} min={0} max={17} step={1} />
                </div>
                <div className="bg-muted rounded-lg px-4 py-3">
                  <span className="text-sm text-muted-foreground font-body">{t('calc.targetAt18', 'Target: when your child turns 18')} → <strong className="text-foreground">{yearsToGoal} {t('calc.yearsAway', 'years away')}</strong></span>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Step 2 */}
          <RevealSection delay={0.1}>
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h2 className="font-heading font-semibold text-xl text-foreground mb-4">{t('calc.step2', 'Step 2: Dream Institution')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {INSTITUTIONS.map((i) => {
                  const Icon = ICON_MAP[i.icon] || GraduationCap;
                  const futureCost = Math.round(calculateProjectedCost(i.baseCost, yearsToGoal));
                  return (
                    <button
                      key={i.id}
                      onClick={() => setSelectedInst(i.id)}
                      className={`rounded-xl border-2 p-3 text-left transition-all ${
                        selectedInst === i.id ? 'border-saffron shadow-sm' : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <Icon size={20} className={selectedInst === i.id ? 'text-saffron' : 'text-muted-foreground'} />
                      <p className="font-heading font-semibold text-sm text-foreground mt-1.5">{i.name}</p>
                      {i.city && <p className="text-xs text-muted-foreground">{i.city}</p>}
                      <p className="text-xs font-semibold text-saffron mt-1">{formatCurrency(futureCost)}</p>
                    </button>
                  );
                })}
              </div>
              {selectedInst === 'other' && (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Input placeholder={t('calc.customInst', 'Institution name')} value={customInst} onChange={(e) => setCustomInst(e.target.value)} />
                  <Input type="number" placeholder={t('calc.customCost', 'Estimated cost (₹)')} value={customCost} onChange={(e) => setCustomCost(e.target.value)} />
                </div>
              )}
            </div>
          </RevealSection>

          {/* Step 3 */}
          <RevealSection delay={0.2}>
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h2 className="font-heading font-semibold text-xl text-foreground mb-4">{t('calc.step3', 'Step 3: Your Investment')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-body text-muted-foreground mb-1 block">
                    {t('calc.monthlyBudget', 'Monthly budget')}: <span className="font-semibold text-foreground">{formatCurrency(budget)}/mo</span>
                  </label>
                  <Slider value={[budget]} onValueChange={([v]) => setBudget(v)} min={500} max={20000} step={500} />
                </div>
                <div className="flex items-center justify-between bg-muted rounded-lg px-4 py-3">
                  <label className="text-sm font-body text-foreground">{t('calc.stepUp', 'Increase by 10% each year?')}</label>
                  <Switch checked={stepUp} onCheckedChange={setStepUp} />
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Live Results */}
          <RevealSection delay={0.3}>
            <motion.div
              className="bg-green rounded-xl p-6 text-white"
              key={`${calc.projected}-${calc.target}`}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-body text-white/80 text-sm mb-1">
                {childName ? `${t('calc.for', 'For')} ${childName}'s ` : ''}{inst.name} {t('calc.fund', 'fund')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-white/70">{t('calc.corpusBuilt', "Corpus you'll build")}</p>
                  <p className="font-heading font-bold text-3xl">{formatCurrency(calc.projected)}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">{t('calc.targetNeeded', 'Target needed')}</p>
                  <p className="font-heading font-bold text-3xl">{formatCurrency(calc.target)}</p>
                </div>
              </div>
              <div className="mb-4">
                {onTrack ? (
                  <span className="bg-white/20 text-white text-sm px-3 py-1 rounded-full">✓ {t('calc.onTrack', "You're on track!")}</span>
                ) : (
                  <span className="bg-saffron text-white text-sm px-3 py-1 rounded-full">
                    {t('calc.moreMonthly', '₹{{amount}} more/month closes the gap', {
                      amount: extraNeeded.toLocaleString('en-IN'),
                    })}
                  </span>
                )}
              </div>
              <Progress value={calc.percentCovered} className="h-3 bg-white/20" />
              <p className="text-xs text-white/60 mt-1">{calc.percentCovered}% {t('calc.covered', 'of target covered')}</p>
            </motion.div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="bg-card rounded-xl p-4 text-center shadow-sm">
                <Clock className="mx-auto text-saffron mb-1" size={20} />
                <p className="font-heading font-bold text-lg text-foreground">{yearsToGoal} yrs</p>
                <p className="text-xs text-muted-foreground">{t('calc.timeToGoal', 'Time to goal')}</p>
              </div>
              <div className="bg-card rounded-xl p-4 text-center shadow-sm">
                <Wallet className="mx-auto text-green mb-1" size={20} />
                <p className="font-heading font-bold text-lg text-foreground">{formatCurrency(budget)}</p>
                <p className="text-xs text-muted-foreground">{t('calc.monthlySip', 'Monthly SIP')}</p>
              </div>
              <div className="bg-card rounded-xl p-4 text-center shadow-sm">
                <PiggyBank className="mx-auto text-blue mb-1" size={20} />
                <p className="font-heading font-bold text-lg text-foreground">{formatCurrency(calc.totalInvested)}</p>
                <p className="text-xs text-muted-foreground">{t('calc.totalInvested', 'Total invested')}</p>
              </div>
            </div>
          </RevealSection>

          {/* Step 4 */}
          <RevealSection delay={0.4}>
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h2 className="font-heading font-semibold text-xl text-foreground mb-4">{t('calc.step4', 'Step 4: Get Your Full Plan')}</h2>
              {!submitted ? (
                <div className="space-y-3">
                  <Input placeholder={t('calc.yourName', 'Your name')} value={name} onChange={(e) => setName(e.target.value)} />
                  <Input type="email" placeholder={t('calc.yourEmail', 'Email')} value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Input type="tel" placeholder={t('calc.yourPhone', 'Phone / WhatsApp')} value={phone} onChange={(e) => setPhone(e.target.value)} />
                  <div className="flex items-center justify-between bg-muted rounded-lg px-4 py-3">
                    <label className="text-sm font-body text-foreground">{t('calc.whatsappPlan', 'WhatsApp me my plan')}</label>
                    <Switch checked={whatsappPlan} onCheckedChange={setWhatsappPlan} />
                  </div>
                  <button onClick={handleSubmit} className="w-full bg-saffron text-white font-heading font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
                    {t('calc.submitPlan', 'Get My Plan')} →
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Check className="mx-auto text-green mb-2" size={40} />
                  <p className="font-heading font-semibold text-lg text-foreground">{t('calc.planReady', 'Your plan is ready!')}</p>
                  <p className="text-sm text-muted-foreground font-body mb-4">{t('calc.planSent', "We'll send it to you.")}</p>
                  {relevantGuide && (
                    <p className="text-sm font-body mb-5">
                      In the meantime &mdash;{' '}
                      <a
                        href={`/${currentLang}/learn/${relevantGuide.slug}`}
                        className="text-saffron underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold"
                      >
                        {relevantGuide.title_en} &rarr;
                      </a>
                    </p>
                  )}
                  <a
                    href={`${WHATSAPP_URL}?text=${waText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-heading font-semibold"
                    style={{ backgroundColor: '#25D366' }}
                  >
                    <MessageCircle size={20} /> {t('calc.discussPlan', 'Discuss my plan on WhatsApp')}
                  </a>
                </div>
              )}
            </div>
          </RevealSection>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="bg-card rounded-xl p-5 shadow-sm">
            <h3 className="font-heading font-semibold text-lg text-foreground mb-3">{t('calc.costRef', 'Institution Costs')}</h3>
            <p className="text-xs text-muted-foreground mb-3">{t('calc.costUpdated', 'Costs updated for 2025-26')}</p>
            <div className="space-y-2">
              {INSTITUTIONS.filter(i => i.id !== 'other').map((i) => {
                const future = Math.round(i.baseCost * Math.pow(1.08, yearsToGoal));
                return (
                  <div key={i.id} className="flex justify-between text-sm py-1.5 border-b border-border last:border-0">
                    <span className="font-body text-foreground">{i.name}</span>
                    <div className="text-right">
                      <span className="text-muted-foreground text-xs">{formatCurrency(i.baseCost)} → </span>
                      <span className="font-semibold text-saffron">{formatCurrency(future)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-saffron-light rounded-xl p-5">
            <h3 className="font-heading font-semibold text-lg text-foreground mb-3">{t('calc.whyNow', 'Why start now?')}</h3>
            <p className="text-xs text-muted-foreground mb-3">{t('calc.whyNowDesc', '₹2,000/month invested at different ages:')}</p>
            {compareData.map((d) => (
              <div key={d.age} className="flex justify-between text-sm py-1.5 border-b border-saffron/20 last:border-0">
                <span className="font-body text-foreground">{t('calc.startAt', 'Start at age')} {d.age}</span>
                <span className="font-heading font-bold text-green">{formatCurrency(d.corpus)}</span>
              </div>
            ))}
          </div>

          <div className="bg-green rounded-xl p-5 text-white text-center">
            <MessageCircle className="mx-auto mb-2" size={28} />
            <h3 className="font-heading font-semibold text-lg mb-2">{t('calc.whatsappCta', 'Need help deciding?')}</h3>
            <p className="text-sm text-white/80 font-body mb-3">{t('calc.whatsappCtaDesc', 'Chat with us in English or Odia')}</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-green font-heading font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              {t('calc.chatNow', 'Chat Now')} →
            </a>
          </div>
        </div>
      </div>
        </>
      )}

      {/* Home / Retirement / Wealth goals */}
      {selectedGoal !== null && selectedGoal !== 'education' && (
        <BasicWealthCalculator
          goal={selectedGoal}
          onBack={() => setSelectedGoal(null)}
        />
      )}

      <Footer />
      <WhatsAppFAB />
      <MobileBottomBar />
    </div>
  );
};

export default Calculator;
