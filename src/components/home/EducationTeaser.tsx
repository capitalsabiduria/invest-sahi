import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RevealSection from '@/components/RevealSection';
import { INSTITUTIONS, INSTITUTION_COSTS } from '@/data/institutions';
import { calculateProjectedCost, calculateRequiredSIP, calculateSIPCorpus, formatCurrency } from '@/utils/sipCalculator';

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

export default EducationTeaser;
