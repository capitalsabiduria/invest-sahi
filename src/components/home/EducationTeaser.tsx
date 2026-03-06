import { useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, MessageCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RevealSection from '@/components/RevealSection';
import { INSTITUTIONS, INSTITUTION_COSTS } from '@/data/institutions';
import { calculateProjectedCost, calculateRequiredSIP, calculateSIPCorpus, formatCurrency } from '@/utils/sipCalculator';
import { WHATSAPP_URL } from '@/config/constants';

const institutionPills = [
  { name: 'NIT Rourkela', cost: '₹6L', years: '4 yrs' },
  { name: 'AIIMS Bhubaneswar', cost: '₹4L', years: '5 yrs' },
  { name: 'IIT Bhubaneswar', cost: '₹8L', years: '4 yrs' },
  { name: 'Private Engineering', cost: '₹12L', years: '4 yrs' },
];

const EducationTeaser = ({ lang }: { lang: string }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const calcRef = useRef<HTMLDivElement>(null);

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

  const handlePillClick = (name: string) => {
    setInstitution(name);
    calcRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

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

  return (
    <section className="py-20" style={{ background: '#E8F5EE' }}>
      <RevealSection>
        <div className="max-w-2xl mx-auto px-4" style={{ maxWidth: '680px' }}>

          {/* Heading */}
          <div className="text-center mb-6">
            <span className="inline-block bg-[#1B6B3A] text-white text-xs font-medium px-3 py-1 rounded-full mb-4">
              {t('edu.tag', 'Most Popular Tool')}
            </span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3 whitespace-pre-line">
              {t('edu.headline', "Your child's dream college.\nHow much do you need?")}
            </h2>
            <p className="font-body text-muted-foreground">
              {t('edu.body', "NIT Rourkela. AIIMS Bhubaneswar. VSSUT Burla. We've calculated what each costs when your child is 18 — and exactly what monthly SIP gets you there.")}
            </p>
          </div>

          {/* Institution pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {institutionPills.map((pill) => {
              const selected = institution === pill.name;
              return (
                <button
                  key={pill.name}
                  onClick={() => handlePillClick(pill.name)}
                  className={`rounded-full px-4 py-2 text-sm border transition-colors ${
                    selected
                      ? 'bg-[#1B6B3A] text-white border-[#1B6B3A]'
                      : 'bg-white text-foreground border-[#1B6B3A]/20 hover:border-[#1B6B3A]/50'
                  }`}
                >
                  <span className="font-medium">{pill.name}</span>
                  <span className={`ml-2 ${selected ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {pill.cost} · {pill.years}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Calculator card */}
          <div ref={calcRef} className="bg-white rounded-2xl shadow-md px-8 py-8 mb-6">
            <h3 className="font-heading font-semibold text-lg text-foreground mb-5">
              {t('calc.quickEstimate', 'Quick Estimate')}
            </h3>

            <div className="mb-5">
              <label className="text-sm font-body text-muted-foreground mb-2 block">
                {t('calc.childAge', "Child's current age")}: <span className="font-semibold text-foreground">{childAge} years</span>
              </label>
              <Slider value={[childAge]} onValueChange={([v]) => setChildAge(v)} min={1} max={15} step={1} />
            </div>

            <div className="mb-5">
              <label className="text-sm font-body text-muted-foreground mb-2 block">
                {t('calc.institution', 'Dream institution')}
              </label>
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
              <label className="text-sm font-body text-muted-foreground mb-2 block">
                {t('calc.budget', 'Monthly Budget')}: <span className="font-semibold text-foreground">{formatCurrency(budget)}/month</span>
              </label>
              <Slider value={[budget]} onValueChange={([v]) => setBudget(v)} min={500} max={10000} step={500} />
            </div>

            {/* Result panel */}
            <motion.div
              key={`${onTrack}-${calc.projected}`}
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl p-5 mb-4"
              style={{ background: onTrack ? '#E8F5EE' : '#FFF3E0' }}
            >
              {onTrack ? (
                <>
                  <div className="flex items-center gap-2 mb-1">
                    <Check size={18} className="text-[#1B6B3A]" />
                    <p className="font-heading font-bold text-[#1B6B3A]">
                      {lang === 'or'
                        ? `${institution} ପାଇଁ ଆପଣ ସଠିକ୍ ରାସ୍ତାରେ ✓`
                        : `You're on track for ${institution} ✓`}
                    </p>
                  </div>
                  <p className="text-sm font-body text-muted-foreground">
                    {lang === 'or'
                      ? `${formatCurrency(budget)}/ମାସରେ ଆପଣ ${formatCurrency(calc.projected)} ପାଇବେ — ଯଥେଷ୍ଟ ଅଧିକ।`
                      : `At ${formatCurrency(budget)}/month you'll have ${formatCurrency(calc.projected)} — more than enough.`}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-heading font-bold text-2xl text-[#2C1810] mb-1">
                    {t('calc.youllHave', "You'll have:")} {formatCurrency(calc.projected)}
                  </p>
                  <p className="text-sm font-body text-muted-foreground mb-2">
                    {t('calc.target', '{{institution}} fees in {{year}}:', {
                      institution,
                      year: new Date().getFullYear() + years,
                    })} ~{formatCurrency(calc.target)}
                  </p>
                  <span className="inline-block rounded-full px-3 py-1 text-xs font-medium bg-[#C45C00]/10 text-[#C45C00]">
                    {t('calc.moreNeeded', '₹{{amount}} more/month needed', {
                      amount: extraNeeded.toLocaleString('en-IN'),
                    })}
                  </span>
                </>
              )}
            </motion.div>

            {/* CTA — book a call */}
            <Link
              to={`/${lang}/book`}
              className="block w-full text-center bg-[#E8820C] text-white font-heading font-semibold rounded-xl py-3 hover:opacity-90 transition-opacity mb-4"
            >
              {onTrack
                ? (lang === 'or' ? 'ନିଃଶୁଳ୍କ Call ବୁକ କରନ୍ତୁ — ଆସନ୍ତୁ ଅଫିସିଆଲ କରୁ' : "Book a free call — let's make it official")
                : (lang === 'or' ? 'ନିଃଶୁଳ୍କ Call ବୁକ କରନ୍ତୁ — ଆମେ ଆପଣଙ୍କ ଯୋଜନା ତିଆରି କରିବୁ' : "Book a free call — we'll build your plan")}
            </Link>
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(t('home.educalc.whatsappText', "Hi, I'd like help planning my child's education fund"))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-sm font-heading font-semibold mt-2"
              style={{ color: '#1B6B3A' }}
            >
              <MessageCircle size={14} />
              {t('home.educalc.whatsappCta', 'Prefer to chat? WhatsApp us →')}
            </a>

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

        </div>
      </RevealSection>
    </section>
  );
};

export default EducationTeaser;
