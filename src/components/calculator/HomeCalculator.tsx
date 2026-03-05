import { useState, useMemo } from 'react';
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

const CITIES = ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Berhampur', 'Other'];

const PROPERTY_TYPES = [
  { id: 'flat_2bhk', label: '2BHK Flat', emoji: '🏢' },
  { id: 'flat_3bhk', label: '3BHK Flat', emoji: '🏬' },
  { id: 'flat_4bhk', label: '4BHK / Luxury', emoji: '🏙️' },
  { id: 'house', label: 'Independent House', emoji: '🏡' },
  { id: 'plot', label: 'Plot of Land', emoji: '🌿' },
  { id: 'villa', label: 'Villa / Duplex', emoji: '🏘️' },
];

interface HomeCalculatorProps {
  onBack: () => void;
}

const HomeCalculator = ({ onBack }: HomeCalculatorProps) => {
  const { toast } = useToast();
  const relevantGuide = useRelevantGuide('home');

  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [years, setYears] = useState(5);
  const [propertyBudget, setPropertyBudget] = useState(6000000);
  const [existingSavings, setExistingSavings] = useState(0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const calc = useMemo(() => {
    const downPayment = Math.round(propertyBudget * 0.20);
    const savingsCapped = Math.min(existingSavings, downPayment);
    const remaining = Math.max(0, downPayment - existingSavings);
    const n = years * 12;
    const sipNeeded = remaining > 0 && n > 0
      ? Math.round(remaining / (((Math.pow(1 + 0.01, n) - 1) / 0.01) * 1.01))
      : 0;
    // percentCovered = what fraction of the down payment is already
    // covered by existing savings alone (before any SIP)
    const percentCovered = Math.min(100, Math.round((savingsCapped / downPayment) * 100));
    return { downPayment, remaining, sipNeeded, percentCovered };
  }, [propertyBudget, existingSavings, years]);

  const formatAmount = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(0)} L`;
    return formatCurrency(n);
  };

  const handleSubmit = async () => {
    if (!phone && !email) return;
    const propertyLabel = PROPERTY_TYPES.find(p => p.id === propertyType)?.label || propertyType;
    try {
      await supabase.from('calculator_leads').insert({
        calculator_type: 'home',
        lead_name: name,
        target_institution: `Home: ${propertyLabel} in ${city || 'Odisha'}`,
        property_type: propertyType,
        property_city: city,
        property_budget: propertyBudget,
        existing_savings: existingSavings,
        timeline_years: years,
        monthly_sip_needed: calc.sipNeeded,
        user_monthly_budget: calc.sipNeeded,
        email,
        phone,
      } as any);
    } catch {}

    setSubmitted(true);
    toast({ title: 'Plan submitted!' });
  };

  const waText = encodeURIComponent(
    `Hi, I want to buy a ${PROPERTY_TYPES.find(p => p.id === propertyType)?.label || 'property'} in ${city || 'Odisha'} within ${years} years. Budget ₹${formatAmount(propertyBudget)}. I have ₹${formatAmount(existingSavings)} saved. Please send my home buying plan.`
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-5 gap-10">
      <div className="lg:col-span-3 space-y-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} /> Change Goal
        </button>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="space-y-6">
          {/* Step 1: City */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Step 1: Where in Odisha?</h2>
            <div className="grid grid-cols-3 gap-2">
              {CITIES.map(c => (
                <button key={c} onClick={() => setCity(c)}
                  className={`rounded-xl border-2 py-2.5 px-3 text-sm font-body font-medium transition-all ${
                    city === c ? 'border-saffron bg-saffron/5 text-foreground' : 'border-border text-muted-foreground hover:border-muted-foreground'
                  }`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Property Type */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Step 2: What are you buying?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {PROPERTY_TYPES.map(p => (
                <button key={p.id} onClick={() => setPropertyType(p.id)}
                  className={`rounded-xl border-2 p-4 text-left transition-all ${
                    propertyType === p.id ? 'border-saffron shadow-sm' : 'border-border hover:border-muted-foreground'
                  }`}>
                  <span className="text-2xl block mb-1">{p.emoji}</span>
                  <p className="font-heading font-semibold text-sm text-foreground">{p.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Timeline */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Step 3: When do you want to buy?</h2>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-body text-muted-foreground">Target timeline</span>
              <span className="font-heading font-semibold text-foreground">{years} years from now</span>
            </div>
            <Slider value={[years]} onValueChange={([v]) => setYears(v)} min={2} max={10} step={1} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>2 years</span><span>10 years</span></div>
          </div>

          {/* Step 4: Property Budget */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Step 4: Estimated property budget</h2>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-body text-muted-foreground">Budget</span>
              <span className="font-heading font-semibold text-foreground">{formatAmount(propertyBudget)}</span>
            </div>
            <Slider value={[propertyBudget]} onValueChange={([v]) => setPropertyBudget(v)} min={2000000} max={100000000} step={2500000} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹20L</span><span>₹10Cr</span></div>
            <div className="bg-muted rounded-lg px-4 py-3 mt-3">
              <p className="text-sm font-body text-muted-foreground">
                Down payment needed (20%): <strong className="text-foreground">{formatAmount(calc.downPayment)}</strong>
              </p>
            </div>
          </div>

          {/* Step 5: Existing Savings */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Step 5: How much have you saved toward this already?</h2>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-body text-muted-foreground">Current savings</span>
              <span className="font-heading font-semibold text-foreground">{formatAmount(existingSavings)}</span>
            </div>
            <Slider value={[existingSavings]} onValueChange={([v]) => setExistingSavings(v)} min={0} max={50000000} step={500000} />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹0</span><span>₹5Cr</span></div>
          </div>

          {/* Live Result */}
          <motion.div
            className="bg-green rounded-xl p-6 text-white"
            key={`${calc.sipNeeded}-${calc.downPayment}`}
            initial={{ opacity: 0.8 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-white/70 font-body mb-3">
              Your {PROPERTY_TYPES.find(p => p.id === propertyType)?.label || 'home'}{city ? ` in ${city}` : ''} plan
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-white/60">Down payment needed</p>
                <p className="font-heading font-bold text-3xl">{formatAmount(calc.downPayment)}</p>
              </div>
              <div>
                <p className="text-xs text-white/60">Monthly SIP to reach it</p>
                <p className="font-heading font-bold text-3xl text-saffron">{formatAmount(calc.sipNeeded)}/mo</p>
              </div>
            </div>
            <Progress value={calc.percentCovered} className="h-3 bg-white/20 mb-1" />
            <div className="flex justify-between text-xs text-white/50 font-body mt-1">
              <span>₹0 saved</span>
              <span>Halfway there</span>
              <span>Down payment ready ✓</span>
            </div>
          </motion.div>

          {/* Step 6: Get Plan */}
          <div className="bg-card rounded-xl p-6 shadow-sm">
            <h2 className="font-heading font-semibold text-xl text-foreground mb-4">Step 6: Get Your Home Buying Roadmap</h2>
            {!submitted ? (
              <div className="space-y-3">
                <Input placeholder="Your name (e.g. Priya)" value={name} onChange={e => setName(e.target.value)} />
                <Input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
                <Input type="tel" placeholder="WhatsApp (e.g. 98XXXXXXXX)" value={phone} onChange={e => setPhone(e.target.value)} />
                <p className="text-xs text-muted-foreground font-body">
                  We'll send you: SIP plan to reach your down payment, home loan eligibility estimate, and the best time to buy based on your savings rate.
                </p>
                <button onClick={handleSubmit}
                  className="w-full bg-saffron text-white font-heading font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
                  Send My {formatAmount(calc.sipNeeded)}/mo Home Plan →
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
                <p className="font-heading font-semibold text-lg text-foreground">Your home buying plan is ready!</p>
                <p className="text-sm text-muted-foreground font-body mb-2">We'll call you within 24 hours to walk through it together.</p>
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
          <h3 className="font-heading font-semibold text-lg text-foreground mb-3">Typical prices in Odisha (2025)</h3>
          <div className="space-y-2 text-sm">
            {[
              { city: 'Bhubaneswar (Patia/Nayapalli)', price: '₹50L – ₹1.2Cr' },
              { city: 'Cuttack (CDA)', price: '₹35L – ₹80L' },
              { city: 'Rourkela', price: '₹25L – ₹60L' },
              { city: 'Sambalpur', price: '₹20L – ₹50L' },
              { city: 'Berhampur', price: '₹20L – ₹55L' },
            ].map(r => (
              <div key={r.city} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span className="font-body text-foreground">{r.city}</span>
                <span className="font-semibold text-saffron">{r.price}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-saffron-light rounded-xl p-5">
          <h3 className="font-heading font-semibold text-lg text-foreground mb-2">The 20% rule</h3>
          <p className="text-sm font-body text-muted-foreground">
            Banks typically require 20% down payment. On a ₹60L flat, that's ₹12L upfront. Starting a SIP today means you arrive at the bank with cash — not scrambling for a personal loan.
          </p>
        </div>
        <div className="bg-green rounded-xl p-5 text-white text-center">
          <MessageCircle className="mx-auto mb-2" size={28} />
          <h3 className="font-heading font-semibold text-lg mb-2">Talk to a home loan expert</h3>
          <p className="text-sm text-white/80 font-body mb-3">We help with SIP planning + home loan eligibility</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="inline-block bg-white text-green font-heading font-semibold px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity">
            Chat Now →
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomeCalculator;
