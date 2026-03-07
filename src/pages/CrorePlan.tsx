import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { WHATSAPP_URL } from '@/config/constants';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import MobileBottomBar from '@/components/MobileBottomBar';
import SEO from '@/components/SEO';
import { TrendingUp, Target, Clock, CheckCircle, ChevronRight, Phone, MessageCircle } from 'lucide-react';

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatCorpus = (val: number): string => {
  if (val >= 10000000) {
    const cr = val / 10000000;
    return cr % 1 === 0 ? `₹${cr} Crore` : `₹${cr.toFixed(1)} Crore`;
  }
  if (val >= 100000) return `₹${(val / 100000).toFixed(0)} Lakh`;
  return `₹${val.toLocaleString('en-IN')}`;
};

const formatShort = (val: number): string => {
  if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(0)}K`;
  return `₹${val}`;
};

const corpusAt = (years: number, monthly: number): number => {
  const r = 0.12 / 12;
  const n = years * 12;
  return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r));
};

const savingsAt = (years: number, monthly: number): number => {
  const r = 0.035 / 12;
  const n = years * 12;
  return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r));
};

// ─── Animated Number ─────────────────────────────────────────────────────────

const AnimatedNumber = ({ value }: { value: number }) => {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const duration = 600;
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
    prevValue.current = end;
  }, [value]);

  return <span>{formatShort(display)}</span>;
};

// ─── FAQ Item ─────────────────────────────────────────────────────────────────

const FAQItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#2C1810]/10 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center text-left gap-4"
      >
        <span className="font-heading font-semibold text-base text-[#2C1810]">{q}</span>
        <ChevronRight
          size={18}
          className="flex-shrink-0 text-[#E8820C] transition-transform duration-200"
          style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && (
        <p className="font-body text-sm text-[#2C1810]/60 leading-relaxed pt-3">{a}</p>
      )}
    </div>
  );
};

// ─── Target options ───────────────────────────────────────────────────────────

const targets = [
  { label: '₹25 Lakh', value: 2500000 },
  { label: '₹50 Lakh', value: 5000000 },
  { label: '₹1 Crore', value: 10000000 },
  { label: '₹2 Crore', value: 20000000 },
];

const contextCards: Record<number, { icon: string; headingEN: string; headingOR: string; bodyEN: string; bodyOR: string }[]> = {
  2500000: [
    { icon: '🛡️', headingEN: 'Emergency Fund', headingOR: 'ଜରୁରୀ ସ୍ଥିତି ପାଣ୍ଠି', bodyEN: 'Six months of expenses, covered. Never scramble for money during a crisis again.', bodyOR: 'ଛଅ ମାସର ଖର୍ଚ୍ଚ, ସୁରକ୍ଷିତ। ଆଉ କୌଣସି ଜରୁରୀ ସ୍ଥିତିରେ ଅର୍ଥ ପାଇଁ ଦୌଡ଼ ନ ହୁଅ।' },
    { icon: '🎓', headingEN: "Child's School Fees", headingOR: 'ଶିଶୁର ବିଦ୍ୟାଳୟ ଶୁଳ୍କ', bodyEN: "Cover your child's schooling from Class 1 to 12 at a top private school in Odisha — fully funded.", bodyOR: 'ଓଡ଼ିଶାର ଏକ ଉତ୍ତମ ଘରୋଇ ବିଦ୍ୟାଳୟରେ Class 1 ଠାରୁ 12 ପର୍ଯ୍ୟନ୍ତ ଆପଣଙ୍କ ସନ୍ତାନର ଶିକ୍ଷା — ସମ୍ପୂର୍ଣ୍ଣ ଖର୍ଚ୍ଚ।' },
    { icon: '🏠', headingEN: 'Home Renovation', headingOR: 'ଘର ସଂସ୍କାର', bodyEN: 'Transform your home — new roof, kitchen, or an extra room — without a single loan.', bodyOR: 'ଆପଣଙ୍କ ଘରକୁ ନୂଆ ରୂପ ଦିଅନ୍ତୁ — ଛାଦ, ରୋଷେଇ ଘର, ବା ଅତିରିକ୍ତ ଘର — ଏକ ଟଙ୍କା ଋଣ ବିନା।' },
  ],
  5000000: [
    { icon: '🏠', headingEN: 'Down Payment on a Home', headingOR: 'ଘର ପାଇଁ Down Payment', bodyEN: 'A 50% down payment on a comfortable home in Bhubaneswar. Your EMI stays manageable.', bodyOR: 'ଭୁବନେଶ୍ୱରରେ ଏକ ଆରାମଦାୟକ ଘରର 50% Down Payment। ଆପଣଙ୍କ EMI ସହଜ ରହିବ।' },
    { icon: '🎓', headingEN: "Child's Higher Education", headingOR: 'ଶିଶୁର ଉଚ୍ଚ ଶିକ୍ଷା', bodyEN: "Fund a full engineering or medical degree — NIT, SCB Medical, or a private college — without loans.", bodyOR: 'ଇଞ୍ଜିନିୟରିଂ ବା ଡାକ୍ତରୀ ଡିଗ୍ରି — NIT, SCB Medical, ବା ଘରୋଇ କଲେଜ — ଋଣ ବିନା ସମ୍ଭବ।' },
    { icon: '💼', headingEN: 'Start a Business', headingOR: 'ବ୍ୟବସାୟ ଆରମ୍ଭ', bodyEN: 'The capital to start a retail shop, service business, or franchise in Odisha — without risking family savings.', bodyOR: 'ଓଡ଼ିଶାରେ ଏକ ଦୋକାନ, ସେବା ବ୍ୟବସାୟ, ବା franchise ଆରମ୍ଭ ପାଇଁ ପୁଞ୍ଜି — ପରିବାରର ସଞ୍ଚୟ ବିନା ଜୋଖ।' },
  ],
  10000000: [
    { icon: '🎓', headingEN: 'Complete Education', headingOR: 'ସମ୍ପୂର୍ଣ୍ଣ ଶିକ୍ଷା', bodyEN: "Your child's education at any college in India — NIT, AIIMS, IIT — fully funded with no loan needed.", bodyOR: 'ଭାରତର ଯେକୌଣସି କଲେଜ — NIT, AIIMS, IIT — ଆପଣଙ୍କ ସନ୍ତାନର ସମ୍ପୂର୍ଣ୍ଣ ଶିକ୍ଷା ଋଣ ବିନା ସମ୍ଭବ।' },
    { icon: '🏠', headingEN: 'A Home in Bhubaneswar', headingOR: 'ଭୁବନେଶ୍ୱରରେ ଏକ ଘର', bodyEN: 'A comfortable home in Bhubaneswar or any Tier 2 city in Odisha — owned outright, no EMI burden.', bodyOR: 'ଭୁବନେଶ୍ୱର ବା ଓଡ଼ିଶାର ଯେକୌଣସି Tier 2 ସହରରେ ଏକ ଆରାମଦାୟକ ଘର — EMI ବୋଝ ବିନା।' },
    { icon: '🌅', headingEN: '20 Years of Retirement', headingOR: '୨୦ ବର୍ଷର ଅବସର', bodyEN: '₹40,000 every month for 20 years after you retire. Live with dignity, on your own terms.', bodyOR: 'ଅବସର ପରେ ୨୦ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ପ୍ରତି ମାସ ₹୪୦,୦୦୦। ଆପଣଙ୍କ ଶର୍ତ୍ତରେ, ଆପଣଙ୍କ ମର୍ଯ୍ୟାଦାରେ ବଞ୍ଚନ୍ତୁ।' },
  ],
  20000000: [
    { icon: '🌅', headingEN: 'Full Retirement Corpus', headingOR: 'ସମ୍ପୂର୍ଣ୍ଣ ଅବସର ପାଣ୍ଠି', bodyEN: '₹80,000 every month for 20+ years. Complete financial independence in retirement.', bodyOR: '20+ ବର୍ଷ ପର୍ଯ୍ୟନ୍ତ ପ୍ରତି ମାସ ₹80,000। ଅବସରରେ ସମ୍ପୂର୍ଣ୍ଣ ଆର୍ଥିକ ସ୍ୱାଧୀନତା।' },
    { icon: '💍', headingEN: "Children's Weddings", headingOR: 'ଶିଶୁମାନଙ୍କ ବିବାହ', bodyEN: 'Give your children a memorable start to their married life without borrowing a single rupee.', bodyOR: 'ଏକ ଟଙ୍କା ଋଣ ନ ନେଇ ଆପଣଙ୍କ ସନ୍ତାନମାନଙ୍କୁ ଏକ ଅବିସ୍ମରଣୀୟ ବୈବାହିକ ଜୀବନ ଆରମ୍ଭ ଦିଅନ୍ତୁ।' },
    { icon: '🏛️', headingEN: 'Leave a Legacy', headingOR: 'ଉତ୍ତରାଧିକାର ଛାଡ଼ନ୍ତୁ', bodyEN: 'A meaningful inheritance for your children and grandchildren. Your wealth becomes generational.', bodyOR: 'ଆପଣଙ୍କ ପୁତ୍ରପୌତ୍ର ପାଇଁ ଏକ ଅର୍ଥବହ ଉତ୍ତରାଧିକାର। ଆପଣଙ୍କ ସମ୍ପଦ ପିଢ଼ି ପରେ ପିଢ଼ି ଚଲୁଥିବ।' },
  ],
};

// ─── Main Component ───────────────────────────────────────────────────────────

const CrorePlan = () => {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const isEN = currentLang !== 'or';

  const [age, setAge] = useState(28);
  const [monthlyInvestment, setMonthlyInvestment] = useState(2500);
  const [targetCorpus, setTargetCorpus] = useState(10000000);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customAmount, setCustomAmount] = useState('');

  const [chartData, setChartData] = useState<{ year: number; age: number; corpus: number; savingsCorpus: number }[]>([]);
  const [yearsToGoal, setYearsToGoal] = useState<number | null>(null);
  const [ageAtGoal, setAgeAtGoal] = useState<number | null>(null);

  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadPreference, setLeadPreference] = useState<'whatsapp' | 'call'>('whatsapp');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ── Calculation ────────────────────────────────────────────────────────────
  useEffect(() => {
    const annualReturn = 0.12;
    const monthlyReturn = annualReturn / 12;
    const savingsReturn = 0.035 / 12;
    const data: { year: number; age: number; corpus: number; savingsCorpus: number }[] = [];
    let corpus = 0;
    let savings = 0;
    let goalYear: number | null = null;
    let goalAge: number | null = null;

    for (let month = 1; month <= 600; month++) {
      corpus = corpus * (1 + monthlyReturn) + monthlyInvestment;
      savings = savings * (1 + savingsReturn) + monthlyInvestment;
      if (month % 12 === 0) {
        const year = month / 12;
        const currentAge = age + year;
        data.push({
          year,
          age: currentAge,
          corpus: Math.round(corpus),
          savingsCorpus: Math.round(savings),
        });
        if (goalYear === null && corpus >= targetCorpus) {
          goalYear = year;
          goalAge = currentAge;
        }
        if (currentAge >= 75) break;
      }
    }

    setChartData(data);
    setYearsToGoal(goalYear);
    setAgeAtGoal(goalAge);

    if (!submitted) {
      const timer = setTimeout(() => setShowLeadForm(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [age, monthlyInvestment, targetCorpus]);

  // ── Lead submit ────────────────────────────────────────────────────────────
  const handleLeadSubmit = async () => {
    if (!leadPhone.trim()) return;
    setSubmitting(true);
    try {
      await (supabase as any).from('crore_plan_leads').insert({
        name: leadName.trim() || null,
        phone: leadPhone.trim(),
        current_age: age,
        monthly_investment: monthlyInvestment,
        target_corpus: targetCorpus,
        years_to_goal: yearsToGoal,
        projected_corpus: chartData[chartData.length - 1]?.corpus || null,
        preferred_contact: leadPreference,
        source: `crore-plan-${currentLang}`,
        status: 'new',
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Lead submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Milestones ─────────────────────────────────────────────────────────────
  const milestones = chartData.filter((_, i) => (i + 1) % 5 === 0).slice(0, 6);
  let milestoneGoalMarked = false;

  // ── Comparison numbers ─────────────────────────────────────────────────────
  const compYears = yearsToGoal || 20;
  const sipValue = corpusAt(compYears, monthlyInvestment);
  const savingsValue = savingsAt(compYears, monthlyInvestment);
  const difference = sipValue - savingsValue;

  const seoTitle = isEN
    ? 'Build ₹1 Crore — Your Personal Wealth Plan | InvestSahi'
    : '₹1 କୋଟି ଗଢ଼ନ୍ତୁ — ଆପଣଙ୍କ ବ୍ୟକ୍ତିଗତ ସମ୍ପଦ ଯୋଜନା | InvestSahi';
  const seoDesc = isEN
    ? "Find out exactly how much you need to invest every month to build ₹1 crore. Free personalised calculator from InvestSahi, Odisha's trusted financial platform."
    : 'ଆପଣ ପ୍ରତି ମାସ କେତେ ବିନିଯୋଗ କଲେ ₹1 କୋଟି ଗଢ଼ି ପାରିବେ ତାହା ଜାଣନ୍ତୁ।';

  const cards10Cr = contextCards[targetCorpus] || contextCards[10000000];

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDesc}
        url={`/${currentLang}/crore-plan`}
        lang={currentLang as 'en' | 'or'}
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-12 pb-28 md:pb-16">

          {/* ── SECTION 1: Story hook ─────────────────────────────────────── */}
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 bg-[#E8820C]/10 text-[#E8820C] text-xs font-semibold font-heading px-3 py-1.5 rounded-full mb-4">
              💰 {isEN ? 'Most families can get there' : 'ଅଧିକାଂଶ ପରିବାର ସେଠାରେ ପହଞ୍ଚି ପାରିବେ'}
            </span>
            <h1 className="font-heading font-bold text-4xl md:text-5xl text-[#2C1810] mb-4 leading-tight">
              {isEN ? (
                <>
                  Build ₹1 Crore.{' '}
                  <span style={{ color: '#E8820C' }}>Find out how.</span>
                </>
              ) : (
                <>
                  ₹1 କୋଟି ଗଢ଼ନ୍ତୁ।{' '}
                  <span style={{ color: '#E8820C' }}>କିପରି, ଜାଣନ୍ତୁ।</span>
                </>
              )}
            </h1>
            <p className="font-body text-lg text-[#2C1810]/70 max-w-xl mx-auto mb-8">
              {isEN
                ? 'Mamata is a school teacher in Kendrapara. She earns ₹28,000 a month. She started a ₹2,000 SIP at age 27. She will retire at 55 with over ₹1 crore. Use the calculator below to find your version of her story.'
                : 'ମମତା Kendrapara ର ଜଣେ ଶିକ୍ଷୟିତ୍ରୀ। ତାଙ୍କ ମାସ ରୋଜଗାର ₹28,000। ୨୭ ବର୍ଷ ବୟସରୁ ₹2,000 SIP ଆରମ୍ଭ କଲେ। ୫୫ ବର୍ଷ ବୟସରେ ₹1 କୋଟିରୁ ଅଧିକ ନେଇ ଅବସର ନେବେ।'}
            </p>
          </div>

          {/* ── SECTION 2: Calculator card ────────────────────────────────── */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#E8820C]/10 mb-6">

            {/* 2A — Target */}
            <div className="mb-8">
              <p className="font-heading font-semibold text-sm text-[#2C1810]/60 uppercase tracking-wide mb-3">
                {isEN ? 'Your target' : 'ଆପଣଙ୍କ ଲକ୍ଷ୍ୟ'}
              </p>
              <div className="flex flex-wrap gap-2">
                {targets.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTargetCorpus(t.value)}
                    className="px-5 py-2.5 rounded-full text-sm font-semibold font-heading transition-all duration-200"
                    style={
                      targetCorpus === t.value
                        ? { backgroundColor: '#E8820C', color: 'white' }
                        : { backgroundColor: '#F5EDD8', color: '#2C1810' }
                    }
                    onMouseEnter={(e) => {
                      if (targetCorpus !== t.value) e.currentTarget.style.backgroundColor = 'rgba(232,130,12,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (targetCorpus !== t.value) e.currentTarget.style.backgroundColor = '#F5EDD8';
                    }}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2B — Age slider */}
            <div className="mb-8">
              <p className="font-body font-medium text-sm text-[#2C1810]/70 mb-3">
                {isEN ? 'Your current age:' : 'ଆପଣଙ୍କ ବର୍ତ୍ତମାନ ବୟସ:'}{' '}
                <span className="font-heading font-bold text-[#E8820C] text-lg">{age}</span>
              </p>
              <input
                type="range"
                min={18}
                max={55}
                step={1}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  accentColor: '#E8820C',
                  background: `linear-gradient(to right, #E8820C ${((age - 18) / (55 - 18)) * 100}%, #e5e7eb ${((age - 18) / (55 - 18)) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-xs text-[#2C1810]/40 mt-1">
                <span>18</span>
                <span>55</span>
              </div>
            </div>

            {/* 2C — Monthly investment */}
            <div>
              <p className="font-body font-medium text-sm text-[#2C1810]/70 mb-3">
                {isEN ? 'Monthly investment:' : 'ମାସିକ ବିନିଯୋଗ:'}{' '}
                <span className="font-heading font-bold text-[#E8820C] text-lg">
                  ₹{monthlyInvestment.toLocaleString('en-IN')}
                </span>
              </p>
              <input
                type="range"
                min={500}
                max={500000}
                step={1000}
                value={monthlyInvestment}
                onChange={(e) => {
                  setMonthlyInvestment(Number(e.target.value));
                  setCustomAmount('');
                }}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  accentColor: '#E8820C',
                  background: `linear-gradient(to right, #E8820C ${((monthlyInvestment - 500) / (500000 - 500)) * 100}%, #e5e7eb ${((monthlyInvestment - 500) / (500000 - 500)) * 100}%)`,
                }}
              />
              <div className="flex justify-between text-xs text-[#2C1810]/40 mt-1">
                <span>₹500</span>
                <span>₹5,00,000</span>
              </div>
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="mt-3 text-xs font-semibold cursor-pointer"
                style={{ color: '#1A6B9A' }}
              >
                {showCustomInput
                  ? (isEN ? '↑ Hide custom amount' : '↑ ଲୁଚାନ୍ତୁ')
                  : (isEN ? 'Enter a custom amount ↓' : 'ନିଜ ପରିମାଣ ଦିଅନ୍ତୁ ↓')}
              </button>
              {showCustomInput && (
                <input
                  type="number"
                  placeholder={isEN ? 'Enter your monthly amount e.g. 7500' : 'ଆପଣଙ୍କ ମାସିକ ପରିମାଣ ଲେଖନ୍ତୁ'}
                  value={customAmount}
                  min={500}
                  max={10000000}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    const num = Number(e.target.value);
                    if (num >= 500 && num <= 10000000) setMonthlyInvestment(num);
                  }}
                  className="w-full mt-2 px-4 py-3 rounded-xl border font-body text-sm focus:outline-none focus:ring-2 focus:ring-[#E8820C] bg-[#F5EDD8]"
                  style={{ borderColor: 'rgba(232,130,12,0.3)' }}
                />
              )}
            </div>
          </div>

          {/* ── SECTION 4: Result callout ─────────────────────────────────── */}
          <div
            className="rounded-3xl p-6 md:p-8 mb-6 text-center"
            style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #145530 100%)' }}
          >
            {yearsToGoal !== null ? (
              <>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-2">
                  {isEN ? 'Your personalised result' : 'ଆପଣଙ୍କ ଫଳାଫଳ'}
                </p>
                <p className="font-heading font-bold text-5xl md:text-6xl text-white mb-2">
                  {isEN ? `Age ${ageAtGoal}` : `${ageAtGoal} ବର୍ଷ`}
                </p>
                <p className="text-white/80 text-lg font-body">
                  {isEN
                    ? `You reach ${formatCorpus(targetCorpus)} by age ${ageAtGoal}`
                    : `ଆପଣ ${ageAtGoal} ବର୍ଷ ବୟସରେ ${formatCorpus(targetCorpus)} ପାଇ ପାରିବେ`}
                </p>
                <p className="text-white/60 text-sm mt-2">
                  {isEN
                    ? `That's in ${yearsToGoal} years — investing ₹${monthlyInvestment.toLocaleString('en-IN')} every month`
                    : `ତାହା ${yearsToGoal} ବର୍ଷ ମଧ୍ୟରେ — ପ୍ରତି ମାସ ₹${monthlyInvestment.toLocaleString('en-IN')} ବିନିଯୋଗ`}
                </p>
              </>
            ) : (
              <p className="font-heading font-semibold text-xl text-white">
                {isEN
                  ? 'Increase your monthly investment to reach your target within your lifetime'
                  : 'ଆପଣଙ୍କ ଜୀବଦ୍ଦଶାରେ ଲକ୍ଷ୍ୟ ପାଇ ମାସିକ ବିନିଯୋଗ ବଢ଼ାନ୍ତୁ'}
              </p>
            )}
          </div>

          {/* ── SECTION 5: Milestone timeline ────────────────────────────── */}
          {milestones.length > 0 && (
            <div className="mb-10">
              <h2 className="font-heading font-bold text-2xl text-[#2C1810] mb-6">
                {isEN
                  ? `Your journey to ${formatCorpus(targetCorpus)}`
                  : `${formatCorpus(targetCorpus)} ର ଆପଣଙ୍କ ଯାତ୍ରା`}
              </h2>
              <div className="relative flex overflow-x-auto md:justify-center gap-0 pb-4">
                {/* Horizontal connector line */}
                <div
                  className="absolute hidden md:block"
                  style={{
                    top: '36px',
                    left: '40px',
                    right: '40px',
                    height: '2px',
                    background: 'repeating-linear-gradient(to right, #E8820C 0, #E8820C 8px, transparent 8px, transparent 16px)',
                    opacity: 0.3,
                  }}
                />
                {milestones.map((m, idx) => {
                  const isGoal = ageAtGoal !== null && m.age >= ageAtGoal && !milestoneGoalMarked;
                  if (isGoal) milestoneGoalMarked = true;
                  return (
                    <div key={idx} className="flex flex-col items-center min-w-[80px] md:min-w-[100px] flex-shrink-0 relative z-10">
                      {isGoal ? (
                        <span className="text-[10px] font-bold text-[#E8820C] mb-1 font-heading">Goal!</span>
                      ) : (
                        <span className="text-[10px] mb-1 opacity-0">·</span>
                      )}
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center"
                        style={
                          isGoal
                            ? { backgroundColor: '#E8820C', boxShadow: '0 4px 16px rgba(232,130,12,0.4)' }
                            : { backgroundColor: 'white', border: '2px solid rgba(232,130,12,0.3)' }
                        }
                      >
                        {isGoal ? (
                          <span className="text-xl">🎉</span>
                        ) : (
                          <span className="font-heading font-bold text-sm text-[#2C1810]">{m.age}</span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-[#2C1810] mt-2">
                        {isEN ? `Age ${m.age}` : `${m.age} ବର୍ଷ`}
                      </p>
                      <p className="text-xs text-[#2C1810]/60">{formatShort(m.corpus)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── SECTION 6: Animated stat cards ───────────────────────────── */}
          <div className="mb-10">
            <h2 className="font-heading font-bold text-2xl text-[#2C1810] mb-2">
              {isEN ? 'Watch your money grow' : 'ଆପଣଙ୍କ ଅର୍ଥ ବଢ଼ିବା ଦେଖନ୍ତୁ'}
            </h2>
            <p className="text-sm text-[#2C1810]/60 mb-6 font-body">
              {isEN
                ? `At ₹${monthlyInvestment.toLocaleString('en-IN')}/month with 12% average annual return`
                : `₹${monthlyInvestment.toLocaleString('en-IN')}/ମାସ ଏବଂ 12% ଗଡ଼ ବାର୍ଷିକ ଲାଭ ସହ`}
            </p>
            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {[
                { years: 10, icon: <Clock size={18} color="#E8820C" />, label: '10 Years', isGoal: false },
                { years: 20, icon: <TrendingUp size={18} color="#E8820C" />, label: '20 Years', isGoal: false },
                {
                  years: yearsToGoal || 30,
                  icon: <Target size={18} color="#E8820C" />,
                  label: yearsToGoal ? `${yearsToGoal} Years` : '30 Years',
                  isGoal: !!yearsToGoal,
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 md:p-5 border text-center"
                  style={{
                    borderColor: card.isGoal ? 'rgba(232,130,12,0.3)' : 'rgba(232,130,12,0.1)',
                    boxShadow: card.isGoal ? '0 0 0 1px rgba(232,130,12,0.3)' : undefined,
                  }}
                >
                  <div className="flex justify-center mb-2">{card.icon}</div>
                  <p className="text-xs text-[#2C1810]/50 font-semibold uppercase tracking-wide mb-1">
                    {card.label}
                  </p>
                  <p
                    className="font-heading font-bold text-lg md:text-xl"
                    style={{ color: card.isGoal ? '#E8820C' : '#1B6B3A' }}
                  >
                    <AnimatedNumber value={corpusAt(card.years, monthlyInvestment)} />
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#2C1810]/40 italic text-center mt-3">
              {isEN
                ? 'Assumes 12% average annual return. Not guaranteed. Actual returns vary.'
                : '12% ଗଡ଼ ବାର୍ଷିକ ଲାଭ ଧରି ହିସାବ। ନିଶ୍ଚିତ ନୁହେଁ।'}
            </p>
          </div>

          {/* ── SECTION 7: SIP vs Savings ─────────────────────────────────── */}
          <div className="mb-10">
            <h2 className="font-heading font-bold text-2xl text-[#2C1810] mb-2">
              {isEN ? 'Why SIP beats a savings account' : 'SIP ସଞ୍ଚୟ ଖାତାଠୁ ଭଲ କାହିଁକି'}
            </h2>
            <p className="text-sm text-[#2C1810]/60 mb-6 font-body">
              {isEN
                ? `Same ₹${monthlyInvestment.toLocaleString('en-IN')}/month. Completely different outcome.`
                : `ସମାନ ₹${monthlyInvestment.toLocaleString('en-IN')}/ମାସ। ସম्पूर्ण ଭିନ୍ନ ଫଳ।`}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Savings card */}
              <div className="rounded-2xl p-5 border-2 border-[#2C1810]/10 bg-white/60">
                <p className="text-xs text-[#2C1810]/40 font-semibold mb-3">
                  {isEN ? 'Savings Account' : 'ସଞ୍ଚୟ ଖାତା'}
                </p>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(44,24,16,0.05)', color: 'rgba(44,24,16,0.4)' }}
                >
                  3.5% p.a.
                </span>
                <p className="font-heading font-bold text-2xl md:text-3xl text-[#2C1810]/50 my-3">
                  <AnimatedNumber value={savingsValue} />
                </p>
                <p className="text-xs text-[#2C1810]/40">
                  {isEN ? `after ${compYears} years` : `${compYears} ବର୍ଷ ପରେ`}
                </p>
              </div>
              {/* SIP card */}
              <div className="rounded-2xl p-5 border-2 text-white" style={{ borderColor: '#E8820C', backgroundColor: '#E8820C' }}>
                <p className="text-xs text-white/70 font-semibold mb-3">
                  {isEN ? 'SIP Investment' : 'SIP ବିନିଯୋଗ'}
                </p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white">
                  12% avg p.a.
                </span>
                <p className="font-heading font-bold text-2xl md:text-3xl text-white my-3">
                  <AnimatedNumber value={sipValue} />
                </p>
                <p className="text-xs text-white/70">
                  {isEN ? `after ${compYears} years` : `${compYears} ବର୍ଷ ପରେ`}
                </p>
              </div>
            </div>
            {/* Gap callout */}
            <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: '#1B6B3A' }}>
              <p className="font-heading font-bold text-white text-lg">
                {isEN ? `The difference: ${formatCorpus(difference)}` : `ଫରକ: ${formatCorpus(difference)}`}
              </p>
              <p className="text-white/70 text-xs mt-1">
                {isEN
                  ? `That extra money is what SIP does for you over ${compYears} years`
                  : `SIP ଆପଣଙ୍କ ପାଇ ${compYears} ବର୍ଷ ମଧ୍ୟରେ ଏହି ଅତିରିକ୍ତ ଅର୍ଥ ଦିଏ`}
              </p>
            </div>
          </div>

          {/* ── SECTION 8: What target means ─────────────────────────────── */}
          <div className="mb-10">
            <h2 className="font-heading font-bold text-2xl text-[#2C1810] mb-6">
              {isEN
                ? `What ${formatCorpus(targetCorpus)} means for your family`
                : `${formatCorpus(targetCorpus)} ଆପଣଙ୍କ ପରିବାର ପାଇ କ'ଣ ଅର୍ଥ ରଖେ`}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {cards10Cr.map((card, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-[#E8820C]/10 text-center"
                >
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <p className="font-heading font-bold text-base text-[#2C1810] mb-1">{isEN ? card.headingEN : card.headingOR}</p>
                  <p className="text-sm text-[#2C1810]/60 font-body">{isEN ? card.bodyEN : card.bodyOR}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── SECTION 9: Lead capture form ─────────────────────────────── */}
          {showLeadForm && !submitted && (
            <div
              className="bg-white rounded-3xl p-6 md:p-8 border-2 mb-8"
              style={{ borderColor: '#E8820C' }}
            >
              <span className="inline-flex items-center gap-2 bg-[#E8820C]/10 text-[#E8820C] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                ✨ {isEN ? 'Get your free personalised plan' : 'ନିଃଶୁଳ୍କ ବ୍ୟକ୍ତିଗତ ଯୋଜନା ପାଆନ୍ତୁ'}
              </span>
              <h2 className="font-heading font-bold text-2xl text-[#2C1810] mb-2">
                {isEN ? 'Want us to walk you through this?' : 'ଆମେ ଆପଣଙ୍କୁ ବୁଝାଇ ଦେବୁ?'}
              </h2>
              <p className="text-sm text-[#2C1810]/60 font-body mb-6">
                {isEN
                  ? 'Leave your number. One of our advisors will call you and build your exact investment roadmap — which funds, how much, when to start. No obligation, no pressure.'
                  : 'ଆପଣଙ୍କ ନମ୍ବର ଦିଅନ୍ତୁ। ଆମ advisor ଆପଣଙ୍କୁ call କରି ଆପଣଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ବିନିଯୋଗ ଯୋଜନା ବୁଝାଇ ଦେବେ।'}
              </p>
              <input
                type="text"
                placeholder={isEN ? 'Your name — optional' : 'ଆପଣଙ୍କ ନାମ — ଐଚ୍ଛିକ'}
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-[#E8820C] mb-3 bg-[#F5EDD8]"
                style={{ border: '1px solid rgba(44,24,16,0.15)' }}
              />
              <input
                type="tel"
                placeholder={isEN ? 'Your phone number' : 'ଆପଣଙ୍କ ଫୋନ ନମ୍ବର'}
                value={leadPhone}
                onChange={(e) => setLeadPhone(e.target.value)}
                className="w-full rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:ring-2 focus:ring-[#E8820C] mb-3 bg-[#F5EDD8]"
                style={{ border: '1px solid rgba(44,24,16,0.15)' }}
              />
              <p className="text-xs font-body text-[#2C1810]/50 mb-2">
                {isEN ? 'How would you like us to reach you?' : 'ଆମେ ଆପଣଙ୍କୁ କିପରି ଯୋଗାଯୋଗ କରିବୁ?'}
              </p>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setLeadPreference('whatsapp')}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold font-heading transition-all"
                  style={
                    leadPreference === 'whatsapp'
                      ? { backgroundColor: '#1B6B3A', color: 'white', border: '1px solid transparent' }
                      : { backgroundColor: 'white', color: '#2C1810', border: '1px solid rgba(44,24,16,0.15)' }
                  }
                >
                  💬 WhatsApp
                </button>
                <button
                  onClick={() => setLeadPreference('call')}
                  className="flex-1 py-3 rounded-xl text-sm font-semibold font-heading transition-all"
                  style={
                    leadPreference === 'call'
                      ? { backgroundColor: '#1B6B3A', color: 'white', border: '1px solid transparent' }
                      : { backgroundColor: 'white', color: '#2C1810', border: '1px solid rgba(44,24,16,0.15)' }
                  }
                >
                  📞 {isEN ? 'Call me' : 'Call କରନ୍ତୁ'}
                </button>
              </div>
              <button
                onClick={handleLeadSubmit}
                disabled={submitting || !leadPhone.trim()}
                className="w-full py-4 rounded-xl text-white font-heading font-bold text-base disabled:opacity-70 transition-opacity"
                style={{ background: 'linear-gradient(135deg, #E8820C 0%, #C45C00 100%)' }}
              >
                {submitting
                  ? (isEN ? 'Saving your plan...' : 'ସଞ୍ଚୟ ହେଉଛି...')
                  : (isEN ? 'Get My Free Roadmap →' : 'ମୋ ଯୋଜନା ପାଆନ୍ତୁ →')}
              </button>
            </div>
          )}

          {/* ── Success state ─────────────────────────────────────────────── */}
          {submitted && (
            <div
              className="bg-white rounded-3xl p-6 md:p-8 border-2 mb-8 text-center"
              style={{ borderColor: '#1B6B3A' }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: '#1B6B3A' }}
              >
                <CheckCircle size={32} color="white" />
              </div>
              <h2 className="font-heading font-bold text-2xl text-[#2C1810] mb-2">
                {isEN ? "We'll be in touch soon!" : 'ଆମେ ଶୀଘ୍ର ଯୋଗାଯୋଗ କରିବୁ!'}
              </h2>
              <p className="text-sm text-[#2C1810]/60 font-body mb-6">
                {isEN
                  ? "Our advisor will be in touch within one working day. If you'd like to chat sooner, message us on WhatsApp."
                  : 'ଆମ advisor ଗୋଟିଏ କାର୍ଯ୍ୟ ଦିନ ମଧ୍ୟରେ ଯୋଗାଯୋଗ କରିବ। ଯଦି ଆଗରୁ କଥା ହେବାକୁ ଚାହୁଁଛନ୍ତି, WhatsApp ରେ ବାର୍ତ୍ତା ପଠାନ୍ତୁ।'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center">
                <a
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent(isEN ? 'Hi! I just submitted my ₹1 Crore plan on InvestSahi. Can we chat about next steps?' : 'ନମସ୍କାର! ମୁଁ InvestSahi ରେ ମୋ ₹1 Crore ଯୋଜନା ଦାଖଲ କଲି। ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ ବିଷୟରେ କଥା ହେବା?')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl font-heading font-semibold text-white text-sm"
                  style={{ backgroundColor: '#1B6B3A' }}
                >
                  {isEN ? 'Chat with us instantly on WhatsApp' : 'WhatsApp ରେ ତୁରନ୍ତ କଥା ହୁଅନ୍ତୁ'}
                </a>
              </div>
            </div>
          )}

          {/* ── SECTION 10: FAQ ───────────────────────────────────────────── */}
          <div className="mb-10">
            <h2 className="font-heading font-bold text-2xl text-[#2C1810] mb-6">
              {isEN ? 'Common questions' : 'ସାଧାରଣ ପ୍ରଶ୍ନ'}
            </h2>
            <FAQItem
              q={isEN ? 'Is 12% annual return realistic?' : '12% ବାର୍ଷିକ ଲାଭ ବାସ୍ତବ କି?'}
              a={isEN
                ? 'Historically, diversified equity mutual funds in India have delivered 12–15% returns over long periods of 10 years or more. Past performance does not guarantee future results. We use 12% as a conservative long-term estimate. Your actual returns will vary based on the funds you choose and market conditions.'
                : 'ଐତିହାସିକ ଭାବେ ଭାରତୀୟ ଇକ୍ୟୁଇଟି ମ୍ୟୁଚୁଆଲ ଫଣ୍ଡ 10 ବର୍ଷ ବା ତଦୁର୍ଦ୍ଧ ମଧ୍ୟରେ 12-15% ଲାଭ ଦେଇଛନ୍ତି। ଅତୀତ ଫଳ ଭବିଷ୍ୟତ ସ୍ଥିର କରେ ନାହିଁ।'}
            />
            <FAQItem
              q={isEN ? "What if I miss a month's investment?" : 'ଯଦି ମୁଁ ଏକ ମାସ ଛାଡ଼େ?'}
              a={isEN
                ? 'Missing one month has minimal impact on a long-term plan. Most SIPs allow you to pause for a month without penalty. What matters is the overall consistency over years, not any single month. A ₹500 SIP paused for one month loses roughly ₹500 — a small fraction of your long-term corpus.'
                : 'ଗୋଟିଏ ମାସ ଛାଡ଼ିଲେ ଦୀର୍ଘ ମିଆଦ ଯୋଜନାରେ ଅଳ୍ପ ପ୍ରଭାବ ପଡ଼େ। ଅଧିକାଂଶ SIP ଗୋଟିଏ ମାସ ପ୍ରଦାନ ଛାଡ଼ ଅନୁମତି ଦିଏ।'}
            />
            <FAQItem
              q={isEN ? 'How do I actually start?' : 'ମୁଁ ଆସଲରେ କିପରି ଆରମ୍ଭ କରିବି?'}
              a={isEN
                ? 'The simplest path: book a free 30-minute call with our advisor. They will recommend 2–3 specific mutual funds suited to your age and risk profile, help you set up the SIP online, and check in with you every quarter. The whole setup takes less than one afternoon.'
                : 'ସবୁଠୁ ସରଳ ଉପାୟ: ଆମ advisor ସହ ଗୋଟିଏ ନିଃଶୁଳ୍କ 30 ମିନିଟ call ବୁକ କରନ୍ତୁ। ସେ ଆପଣଙ୍କ ବୟସ ଏବଂ ଜୋଖ ଅନୁଯାୟୀ 2-3 ଫଣ୍ଡ ସୁପାରିଶ କରିବ।'}
            />
          </div>

          {/* ── SECTION 11: Final CTA ──────────────────────────────────────── */}
          <div
            className="rounded-3xl p-8 text-center mt-8"
            style={{ background: 'linear-gradient(135deg, #1B6B3A 0%, #145530 100%)' }}
          >
            <h2 className="font-heading font-bold text-3xl text-white mb-2">
              {isEN ? 'Ready to start building?' : 'ଆରମ୍ଭ କରିବାକୁ ପ୍ରସ୍ତୁତ?'}
            </h2>
            <p className="text-white/70 font-body mb-8">
              {isEN
                ? `Your first step takes 5 minutes. Your ${formatCorpus(targetCorpus)} takes ${yearsToGoal || '20+'} years. Start today.`
                : `ଆପଣଙ୍କ ପ୍ରଥମ ପଦକ୍ଷେପ 5 ମିନିଟ। ଆଜି ଆରମ୍ଭ କରନ୍ତୁ।`}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={`/${currentLang}/book`}
                className="bg-white font-heading font-bold px-8 py-4 rounded-xl text-base transition-opacity hover:opacity-90"
                style={{ color: '#E8820C' }}
              >
                {isEN ? 'Book a Free Call →' : 'ନିଃଶୁଳ୍କ Call ବୁକ କରନ୍ତୁ →'}
              </Link>
              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(isEN ? 'Hi! I want to start building my ₹1 Crore plan with InvestSahi. Can you help me get started?' : 'ନମସ୍କାର! ମୁଁ InvestSahi ସହ ମୋ ₹1 Crore ଯୋଜନା ଆରମ୍ଭ କରିବାକୁ ଚାହୁଁଛି।')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white font-heading font-semibold px-8 py-4 rounded-xl text-base hover:bg-white/10 transition-colors"
              >
                {isEN ? 'WhatsApp Us' : 'WhatsApp କରନ୍ତୁ'}
              </a>
            </div>
          </div>

        </div>
        <Footer />
        <WhatsAppFAB />
        <MobileBottomBar />
      </div>
    </>
  );
};

export default CrorePlan;
