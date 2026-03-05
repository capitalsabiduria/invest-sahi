import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Check, TrendingUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, calculateSIPCorpus } from '@/utils/sipCalculator';
import { useRelevantGuide } from '@/hooks/useRelevantGuide';
import { WHATSAPP_URL } from '@/config/constants';
import HomeCalculator from './HomeCalculator';
import RetirementCalculator from './RetirementCalculator';
import type { GoalType } from './GoalSelector';

interface BasicWealthCalculatorProps {
  goal: Exclude<GoalType, 'education'>;
  onBack: () => void;
}

const WealthCalculator = ({ onBack }: { onBack: () => void }) => {
  const { toast } = useToast();
  const [monthly, setMonthly] = useState(2500);
  const [years, setYears] = useState(15);
  const [stepUp, setStepUp] = useState(false);
  const relevantGuide = useRelevantGuide('wealth');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const calc = useMemo(() => {
    let corpus: number;
    let totalInvested: number;
    if (stepUp) {
      // 10% annual step-up SIP
      let total = 0;
      let currentSIP = monthly;
      for (let yr = 0; yr < years; yr++) {
        const yearFV = calculateSIPCorpus(currentSIP, 12);
        total = total * Math.pow(1.12, 1) + yearFV;
        currentSIP = Math.round(currentSIP * 1.1);
      }
      corpus = Math.round(total);
      let inv = 0, s = monthly;
      for (let yr = 0; yr < years; yr++) { inv += s * 12; s = Math.round(s * 1.1); }
      totalInvested = inv;
    } else {
      const n = years * 12;
      corpus = Math.round(calculateSIPCorpus(monthly, n));
      totalInvested = monthly * n;
    }
    const gained = corpus - totalInvested;
    return { corpus, totalInvested, gained };
  }, [monthly, years, stepUp]);

  const formatCorpus = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} crore`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)} lakh`;
    return formatCurrency(n);
  };

  const handleSubmit = async () => {
    if (!phone && !email) return;
    try {
      await supabase.from('calculator_leads').insert({
        calculator_type: 'wealth',
        lead_name: name,
        target_institution: 'Wealth Building',
        investment_years: years,
        step_up: stepUp,
        monthly_sip_needed: monthly,
        user_monthly_budget: monthly,
        email,
        phone,
      } as any);
    } catch {}

    setSubmitted(true);
    toast({ title: 'Plan submitted!' });
  };

  const waText = encodeURIComponent(
    `Hi, I want to build wealth systematically. I can invest ${formatCurrency(monthly)}/month for ${years} years${stepUp ? ' with 10% annual step-up' : ''}. Expected corpus: ${formatCorpus(calc.corpus)}. Please send me a personalised wealth plan.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
      <div className="lg:col-span-3 space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
          ← Change Goal
        </button>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
          {/* Step 1: Monthly SIP */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              Step 1: How much can you invest monthly?
            </h2>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-body text-muted-foreground">Monthly SIP</span>
              <span className="font-heading font-semibold text-foreground">{formatCurrency(monthly)}/mo</span>
            </div>
            <Slider value={[monthly]} onValueChange={([v]) => setMonthly(v)} min={500} max={100000} step={500} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>₹500</span><span>₹1,00,000</span>
            </div>
            <div className="bg-muted rounded-lg px-4 py-3 mt-3">
              <p className="text-sm font-body text-muted-foreground">
                {formatCurrency(monthly)} is less than{' '}
                {monthly <= 500 ? 'a plate of Dalma at a restaurant' :
                 monthly <= 1000 ? 'a monthly mobile recharge' :
                 monthly <= 2500 ? 'a movie outing for two' :
                 monthly <= 5000 ? 'one month of petrol' :
                 'a short family trip'}.
                {' '}Money that would otherwise vanish.
              </p>
            </div>
          </div>

          {/* Step 2: Investment Period */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              Step 2: For how many years?
            </h2>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-body text-muted-foreground">Investment period</span>
              <span className="font-heading font-semibold text-foreground">{years} years</span>
            </div>
            <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={1} max={30} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 year</span><span>30 years</span>
            </div>
          </div>

          {/* Step 3: Step-up toggle */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              Step 3: Will you increase your SIP each year?
            </h2>
            <div className="flex items-center justify-between bg-muted rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-body text-foreground">Increase by 10% each year</p>
                <p className="text-xs text-muted-foreground font-body mt-0.5">
                  As your salary grows, your SIP grows too
                </p>
              </div>
              <Switch checked={stepUp} onCheckedChange={setStepUp} />
            </div>
          </div>

          {/* Live Result */}
          <motion.div
            className="bg-green rounded-xl p-6 text-white"
            key={`${calc.corpus}-${years}-${monthly}`}
            initial={{ opacity: 0.8 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-white/70 font-body mb-2">
              {formatCurrency(monthly)}/mo for {years} years{stepUp ? ' with 10% annual step-up' : ''} at 12% avg return
            </p>
            <p className="font-heading font-bold text-5xl mb-6">
              {formatCorpus(calc.corpus)}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-white/60 font-body">Total invested</p>
                <p className="font-heading font-semibold text-xl">{formatCorpus(calc.totalInvested)}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 font-body">Wealth gained</p>
                <p className="font-heading font-semibold text-xl text-saffron">
                  {formatCorpus(calc.gained)}
                </p>
              </div>
            </div>
            <p className="text-xs text-white/50 font-body mt-4">
              Assumed 12% annual return. Not guaranteed. Past performance is not indicative of future results.
            </p>
          </motion.div>

          {/* Step 4: Get Plan */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">
              Step 4: Get Your Personalised Wealth Plan
            </h2>
            {!submitted ? (
              <div className="space-y-3">
                <Input placeholder="Your name (e.g. Rahul)" value={name} onChange={e => setName(e.target.value)} />
                <Input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
                <Input type="tel" placeholder="WhatsApp (e.g. 98XXXXXXXX)" value={phone} onChange={e => setPhone(e.target.value)} />
                <p className="text-xs text-muted-foreground font-body">
                  We'll send you: the right mutual funds to invest in, a month-by-month SIP plan,
                  tax-saving strategies under 80C, and a review every 6 months.
                </p>
                <button onClick={handleSubmit}
                  className="w-full bg-saffron text-white font-heading font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
                  Send My {formatCurrency(monthly)}/mo Wealth Plan →
                </button>
                <a href={`${WHATSAPP_URL}?text=${waText}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-heading font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#25D366' }}>
                  <MessageCircle size={18} /> Discuss on WhatsApp instead
                </a>
              </div>
            ) : (
              <div className="text-center py-6">
                <Check className="mx-auto text-green mb-2" size={40} />
                <p className="font-heading font-semibold text-lg text-foreground">Your wealth plan is on its way!</p>
                <p className="text-sm text-muted-foreground font-body mb-2">We'll call you within 24 hours.</p>
                {relevantGuide && (
                  <p className="text-sm font-body mb-5">
                    In the meantime &mdash;{' '}
                    <a
                      href={`/en/learn/${relevantGuide.slug}`}
                      className="text-saffron underline underline-offset-2 hover:opacity-80 transition-opacity font-semibold"
                    >
                      {relevantGuide.title_en} &rarr;
                    </a>
                  </p>
                )}
                <a href={`${WHATSAPP_URL}?text=${waText}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-heading font-semibold"
                  style={{ backgroundColor: '#25D366' }}>
                  <MessageCircle size={20} /> Discuss on WhatsApp
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Right sidebar */}
      <div className="lg:col-span-2 space-y-6 lg:sticky lg:top-20 lg:self-start">
        <div className="bg-card rounded-xl p-5 shadow-sm">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
            The power of starting early
          </h3>
          <p className="text-xs text-muted-foreground mb-3">₹2,000/month invested at different ages (12% return, retire at 60):</p>
          <div className="space-y-2 text-sm">
            {[
              { age: 25, corpus: '₹3.5 Cr' },
              { age: 30, corpus: '₹1.9 Cr' },
              { age: 35, corpus: '₹1.0 Cr' },
              { age: 40, corpus: '₹49 L' },
            ].map(r => (
              <div key={r.age} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span className="font-body text-foreground">Start at age {r.age}</span>
                <span className="font-heading font-bold text-green">{r.corpus}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-saffron-light rounded-xl p-5">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
            ₹500 comparison
          </h3>
          <div className="space-y-2 text-sm font-body text-muted-foreground">
            <p>₹500/mo in SIP for 20 years = <strong className="text-foreground">₹49 lakh</strong></p>
            <p>₹500/mo on tea &amp; snacks for 20 years = <strong className="text-foreground">₹0</strong></p>
            <p className="text-xs pt-1 border-t border-saffron/20">
              Same money. Very different outcomes. That's the entire case for InvestSahi.
            </p>
          </div>
        </div>
        <div className="bg-green rounded-xl p-5 text-white text-center">
          <TrendingUp className="mx-auto mb-2" size={28} />
          <h3 className="font-heading font-semibold text-lg mb-2">Not sure where to start?</h3>
          <p className="text-sm text-white/80 font-body mb-3">Talk to us in English or Odia. No jargon, no pressure.</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-white text-green font-heading font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            Chat Now →
          </a>
        </div>
      </div>
    </div>
  );
};

const BasicWealthCalculator = ({ goal, onBack }: BasicWealthCalculatorProps) => {
  if (goal === 'home') return <HomeCalculator onBack={onBack} />;
  if (goal === 'retirement') return <RetirementCalculator onBack={onBack} />;
  return <WealthCalculator onBack={onBack} />;
};

export default BasicWealthCalculator;
