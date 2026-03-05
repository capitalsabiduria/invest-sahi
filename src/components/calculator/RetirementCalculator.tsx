import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, Check } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, calculateSIPCorpus } from '@/utils/sipCalculator';
import { useRelevantGuide } from '@/hooks/useRelevantGuide';
import { WHATSAPP_URL } from '@/config/constants';

interface RetirementCalculatorProps {
  onBack: () => void;
}

const RetirementCalculator = ({ onBack }: RetirementCalculatorProps) => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const { toast } = useToast();
  const [currentAge, setCurrentAge] = useState(30);
  const [retireAge, setRetireAge] = useState(50);
  const [monthlyExpenses, setMonthlyExpenses] = useState(40000);
  const [existingSavings, setExistingSavings] = useState(200000);
  const relevantGuide = useRelevantGuide('retirement', currentLang);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const yearsToRetire = Math.max(1, retireAge - currentAge);

  const calc = useMemo(() => {
    const inflatedMonthly = monthlyExpenses * Math.pow(1.06, yearsToRetire);
    const corpusNeeded = Math.round(inflatedMonthly * 12 * 25);
    const grownSavings = Math.round(existingSavings * Math.pow(1.12, yearsToRetire));
    const remainingCorpus = Math.max(0, corpusNeeded - grownSavings);
    const n = yearsToRetire * 12;
    const sipNeeded = remainingCorpus > 0 && n > 0
      ? Math.round(remainingCorpus / (((Math.pow(1 + 0.01, n) - 1) / 0.01) * 1.01))
      : 0;
    const lateN = Math.max(1, (yearsToRetire - 3)) * 12;
    const lateSipNeeded = remainingCorpus > 0 && lateN > 0
      ? Math.round(remainingCorpus / (((Math.pow(1 + 0.01, lateN) - 1) / 0.01) * 1.01))
      : 0;
    const waitingCost = Math.max(0, lateSipNeeded - sipNeeded);
    const percentSaved = Math.min(100, Math.round((grownSavings / corpusNeeded) * 100));
    return { corpusNeeded, sipNeeded, lateSipNeeded, waitingCost, grownSavings, percentSaved, inflatedMonthly };
  }, [currentAge, retireAge, monthlyExpenses, existingSavings, yearsToRetire]);

  const formatAmount = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} crore`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(1)} lakh`;
    return formatCurrency(n);
  };

  const handleSubmit = async () => {
    if (!phone && !email) return;
    try {
      await supabase.from('calculator_leads').insert({
        calculator_type: 'retirement',
        lead_name: name,
        target_institution: `Retirement at ${retireAge}`,
        current_age: currentAge,
        retire_age: retireAge,
        monthly_expenses: monthlyExpenses,
        existing_savings: existingSavings,
        monthly_sip_needed: calc.sipNeeded,
        user_monthly_budget: calc.sipNeeded,
        whatsapp_message: decodeURIComponent(waText),
        email,
        phone,
      } as any);
    } catch {}

    setSubmitted(true);
    toast({ title: 'Retirement plan submitted!' });
  };

  const waText = encodeURIComponent(
    `Hi, I'm ${currentAge} years old and want to retire at ${retireAge}. My monthly expenses are ₹${monthlyExpenses.toLocaleString('en-IN')} and I have ${formatAmount(existingSavings)} in savings. I need a corpus of ${formatAmount(calc.corpusNeeded)}. Please send my retirement plan.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
      <div className="lg:col-span-3 space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Change Goal
        </button>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
          {/* Step 1: Current Age */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">{t('retirement.step1.title', 'Step 1: How old are you today?')}</h2>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-body text-muted-foreground">{t('retirement.step1.label', 'Current age')}</span>
              <span className="font-heading font-semibold text-foreground">{t('retirement.step1.value', '{{age}} years', { age: currentAge })}</span>
            </div>
            <Slider value={[currentAge]} onValueChange={([v]) => { setCurrentAge(v); if (retireAge <= v + 5) setRetireAge(v + 5); }} min={22} max={55} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>22</span><span>55</span></div>
          </div>

          {/* Step 2: Retirement Age */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">{t('retirement.step2.title', 'Step 2: When do you want to retire?')}</h2>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-body text-muted-foreground">{t('retirement.step2.label', 'Retire at age')}</span>
              <span className="font-heading font-semibold text-foreground">{retireAge} — <span className="text-saffron">{t('retirement.step2.yearsFrom', '{{years}} years from now', { years: yearsToRetire })}</span></span>
            </div>
            <Slider value={[retireAge]} onValueChange={([v]) => setRetireAge(v)} min={currentAge + 5} max={65} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>{currentAge + 5}</span><span>65</span></div>
            <div className="bg-muted rounded-lg px-4 py-3 mt-3">
              <p className="text-sm font-body text-muted-foreground">
                {t('retirement.step2.hint', 'Retiring at {{age}} means {{extra}} extra years of financial freedom compared to retiring at 65.', { age: retireAge, extra: 65 - retireAge })}
              </p>
            </div>
          </div>

          {/* Step 3: Monthly Expenses */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">{t('retirement.step3.title', 'Step 3: What are your current monthly expenses?')}</h2>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-body text-muted-foreground">{t('retirement.step3.label', 'Monthly expenses')}</span>
              <span className="font-heading font-semibold text-foreground">{formatCurrency(monthlyExpenses)}/mo</span>
            </div>
            <Slider value={[monthlyExpenses]} onValueChange={([v]) => setMonthlyExpenses(v)} min={15000} max={500000} step={5000} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹15,000</span><span>₹5,00,000</span></div>
            <div className="bg-muted rounded-lg px-4 py-3 mt-3">
              <p className="text-sm font-body text-muted-foreground">
                {t('retirement.step3.hint', 'By the time you retire at {{age}}, ₹{{expenses}} today will feel like {{future}} — because prices double roughly every 12 years at 6% inflation.', { age: retireAge, expenses: monthlyExpenses.toLocaleString('en-IN'), future: formatCurrency(Math.round(calc.inflatedMonthly)) })}
              </p>
            </div>
          </div>

          {/* Step 4: Existing Savings */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">{t('retirement.step4.title', 'Step 4: What have you saved so far? (EPF, FDs, savings)')}</h2>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-body text-muted-foreground">{t('retirement.step4.label', 'Current savings')}</span>
              <span className="font-heading font-semibold text-foreground">{formatAmount(existingSavings)}</span>
            </div>
            <Slider value={[existingSavings]} onValueChange={([v]) => setExistingSavings(v)} min={0} max={50000000} step={100000} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹0</span><span>₹5 Cr</span></div>
          </div>

          {/* Live Result — waiting cost FIRST */}
          <motion.div
            className="bg-green rounded-xl p-6 text-white"
            key={`${calc.corpusNeeded}-${calc.sipNeeded}`}
            initial={{ opacity: 0.8 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-white/70 font-body mb-4">
              {t('retirement.result.header', 'Your retirement at {{age}} — {{years}} years to build this', { age: retireAge, years: yearsToRetire })}
            </p>
            {calc.waitingCost > 0 && (
              <div className="bg-white/15 border border-white/30 rounded-xl px-4 py-4 mb-5">
                <p className="text-xs text-white/70 uppercase tracking-wide font-body mb-1">{t('retirement.result.waitingCost', 'Cost of waiting 3 more years')}</p>
                <p className="font-heading font-bold text-2xl text-saffron">{t('retirement.result.waitingExtra', '+{{amount}}/month extra', { amount: formatCurrency(calc.waitingCost) })}</p>
                <p className="text-xs text-white/70 font-body mt-1">
                  {t('retirement.result.waitingNote', 'Starting today vs. starting at age {{age}} — same goal, very different monthly commitment.', { age: currentAge + 3 })}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-white/60">{t('retirement.result.corpus', 'Corpus you need')}</p>
                <p className="font-heading font-bold text-3xl">{formatAmount(calc.corpusNeeded)}</p>
              </div>
              <div>
                <p className="text-xs text-white/60">{t('retirement.result.sip', 'Monthly SIP needed')}</p>
                <p className="font-heading font-bold text-3xl text-saffron">{formatCurrency(calc.sipNeeded)}/mo</p>
              </div>
            </div>
            <Progress value={calc.percentSaved} className="h-3 bg-white/20 mb-1" />
            <div className="flex justify-between text-xs text-white/50 font-body mt-1">
              <span>0%</span>
              <span>Halfway there</span>
              <span>Goal reached ✓</span>
            </div>
          </motion.div>

          {/* Step 5: Get Plan */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">{t('retirement.step5.title', 'Step 5: Get Your Retirement Roadmap')}</h2>
            {!submitted ? (
              <div className="space-y-3">
                <Input placeholder={t('retirement.step5.name', 'Your name (e.g. Rahul)')} value={name} onChange={e => setName(e.target.value)} />
                <Input type="email" placeholder={t('retirement.step5.email', 'Email address')} value={email} onChange={e => setEmail(e.target.value)} />
                <Input type="tel" placeholder={t('retirement.step5.phone', 'WhatsApp (e.g. 98XXXXXXXX)')} value={phone} onChange={e => setPhone(e.target.value)} />
                <p className="text-xs text-muted-foreground font-body">
                  {t('retirement.step5.desc', "We'll send you: exact SIP plan, NPS optimisation for your age, investment split across equity/debt, and a month-by-month roadmap to retirement.")}
                </p>
                <button onClick={handleSubmit}
                  className="w-full bg-saffron text-white font-heading font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
                  {t('retirement.step5.submit', 'Send My {{amount}}/mo Retirement Plan →', { amount: formatCurrency(calc.sipNeeded) })}
                </button>
                <a href={`${WHATSAPP_URL}?text=${waText}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-heading font-semibold text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#25D366' }}>
                  <MessageCircle size={18} /> {t('retirement.whatsapp.discuss', 'Discuss on WhatsApp instead')}
                </a>
              </div>
            ) : (
              <div className="text-center py-6">
                <Check className="mx-auto text-green mb-2" size={40} />
                <p className="font-heading font-semibold text-lg text-foreground">{t('retirement.success.title', 'Your retirement plan is on its way!')}</p>
                <p className="text-sm text-muted-foreground font-body mb-2">{t('retirement.success.sub', "We'll call you within 24 hours to walk through it together.")}</p>
                {relevantGuide && (
                  <p className="text-sm font-body mb-5">
                    {t('retirement.success.meanwhile', 'In the meantime —')}{' '}
                    <a
                      href={`/${currentLang}/learn/${relevantGuide.slug}`}
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
          <h3 className="font-heading font-semibold text-lg text-foreground mb-3">{t('retirement.sidebar.rule', 'The 4% Withdrawal Rule')}</h3>
          <p className="text-sm font-body text-muted-foreground mb-3">
            {t('retirement.sidebar.ruleDesc', 'If your corpus earns 12% and inflation runs at 6%, you can safely withdraw 4–6% per year forever. This is why we target 25× your annual expenses.')}
          </p>
          <div className="space-y-2 text-sm">
            {[
              { expenses: '₹30,000/mo', corpus: '₹2.7 Cr' },
              { expenses: '₹50,000/mo', corpus: '₹4.5 Cr' },
              { expenses: '₹75,000/mo', corpus: '₹6.75 Cr' },
              { expenses: '₹1,00,000/mo', corpus: '₹9 Cr' },
            ].map(r => (
              <div key={r.expenses} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span className="font-body text-foreground">{r.expenses} expenses</span>
                <span className="font-semibold text-saffron">{r.corpus} needed</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-saffron-light rounded-xl p-5">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">{t('retirement.sidebar.npsTitle', 'NPS: Your retirement head start')}</h3>
          <p className="text-sm font-body text-muted-foreground">
            {t('retirement.sidebar.npsDesc', "If you're a government employee or salaried professional, NPS gives an extra ₹50,000 tax deduction under 80CCD(1B) — on top of the standard 80C limit. Most people miss this.")}
          </p>
        </div>
        <div className="bg-green rounded-xl p-5 text-white text-center">
          <MessageCircle className="mx-auto mb-2" size={28} />
          <h3 className="font-heading font-semibold text-lg mb-2">{t('retirement.sidebar.chatTitle', 'Talk to a retirement planner')}</h3>
          <p className="text-sm text-white/80 font-body mb-3">{t('retirement.sidebar.chatDesc', 'In English or Odia. No jargon.')}</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-white text-green font-heading font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            Chat Now →
          </a>
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculator;
