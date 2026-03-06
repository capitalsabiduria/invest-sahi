import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
} from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import MobileBottomBar from '@/components/MobileBottomBar';
import SEO from '@/components/SEO';
import { WHATSAPP_URL } from '@/config/constants';
import { Link } from 'react-router-dom';

const targets = [
  { label: '₹25L', value: 2500000 },
  { label: '₹50L', value: 5000000 },
  { label: '₹1 Crore', value: 10000000 },
  { label: '₹2 Crore', value: 20000000 },
];

const formatCorpus = (val: number) => {
  if (val >= 10000000) return `₹${val / 10000000} Crore`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
  return `₹${val.toLocaleString('en-IN')}`;
};

const savingsCorpus = (years: number, monthlyInvestment: number) => {
  const r = 0.035 / 12;
  const n = years * 12;
  return Math.round(monthlyInvestment * ((Math.pow(1 + r, n) - 1) / r));
};

const CrorePlan = () => {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const [age, setAge] = useState(28);
  const [monthlyInvestment, setMonthlyInvestment] = useState(2500);
  const [targetCorpus, setTargetCorpus] = useState(10000000);
  const [chartData, setChartData] = useState<{ year: number; age: number; corpus: number }[]>([]);
  const [yearsToGoal, setYearsToGoal] = useState<number | null>(null);
  const [ageAtGoal, setAgeAtGoal] = useState<number | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadPreference, setLeadPreference] = useState<'whatsapp' | 'call'>('whatsapp');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const annualReturn = 0.12;
    const monthlyReturn = annualReturn / 12;
    const data: { year: number; age: number; corpus: number }[] = [];
    let corpus = 0;
    let goalYear: number | null = null;
    let goalAge: number | null = null;

    for (let month = 1; month <= 600; month++) {
      corpus = corpus * (1 + monthlyReturn) + monthlyInvestment;
      if (month % 12 === 0) {
        const year = month / 12;
        const currentAge = age + year;
        data.push({ year, age: currentAge, corpus: Math.round(corpus) });
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
      const timer = setTimeout(() => setShowLeadForm(true), 4000);
      return () => clearTimeout(timer);
    }
  }, [age, monthlyInvestment, targetCorpus]);

  const handleLeadSubmit = async () => {
    if (!leadPhone) return;
    setSubmitting(true);
    try {
      await (supabase as any).from('crore_plan_leads').insert({
        name: leadName || null,
        phone: leadPhone,
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
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const isEN = currentLang !== 'or';

  // Build milestones
  let milestoneGoalAdded = false;
  const milestones = chartData
    .filter((_, i) => i % 5 === 4)
    .slice(0, 5)
    .map((d) => {
      const isGoal =
        yearsToGoal !== null && ageAtGoal !== null && d.age >= ageAtGoal && !milestoneGoalAdded;
      if (isGoal) milestoneGoalAdded = true;
      return { age: d.age, corpus: d.corpus, isGoal };
    });

  const comparisonYears = yearsToGoal || 20;
  const savingsResult = savingsCorpus(comparisonYears, monthlyInvestment);

  const seoTitle = isEN
    ? 'Your Path to ₹1 Crore — InvestSahi'
    : '₹1 କୋଟିର ଆପଣଙ୍କ ରାସ୍ତା — InvestSahi';
  const seoDescription = isEN
    ? "Find out exactly how much you need to invest every month to reach ₹1 crore. Free personalised plan from InvestSahi, Odisha's trusted financial platform."
    : 'ଆପଣ ପ୍ରତି ମାସ କେତେ ବିନିଯୋଗ କଲେ ₹1 କୋଟି ପାଇ ପାରିବେ ତାହା ଜାଣନ୍ତୁ।';

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDescription}
        url={`/${currentLang}/crore-plan`}
        lang={currentLang as 'en' | 'or'}
      />
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12 pb-24 md:pb-12">
        {/* Section 1 — Header */}
        <div className="text-center mb-10">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-3">
            {isEN ? 'Your Path to ₹1 Crore' : '₹1 କୋଟିର ଆପଣଙ୍କ ରାସ୍ତା'}
          </h1>
          <p className="font-body text-muted-foreground text-lg">
            {isEN
              ? 'Most families can get there. Find out exactly how.'
              : 'ଅଧିକାଂଶ ପରିବାର ସେଠାରେ ପହଞ୍ଚି ପାରିବେ। ଆପଣଙ୍କ ରାସ୍ତା ଜାଣନ୍ତୁ।'}
          </p>
        </div>

        {/* Section 2 — Calculator inputs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border mb-6">
          {/* Input 1 — Age */}
          <div className="mb-6">
            <label className="block font-body font-medium text-sm text-foreground mb-2">
              {isEN ? `Your current age: ${age} years` : `ଆପଣଙ୍କ ବର୍ତ୍ତମାନ ବୟସ: ${age} ବର୍ଷ`}
            </label>
            <input
              type="range"
              min={18}
              max={55}
              step={1}
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #E8820C ${((age - 18) / (55 - 18)) * 100}%, #e5e7eb ${((age - 18) / (55 - 18)) * 100}%)`,
                accentColor: '#E8820C',
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>18</span>
              <span>55</span>
            </div>
          </div>

          {/* Input 2 — Monthly Investment */}
          <div className="mb-6">
            <label className="block font-body font-medium text-sm text-foreground mb-2">
              {isEN
                ? `Monthly investment: ₹${monthlyInvestment.toLocaleString('en-IN')}`
                : `ମାସିକ ବିନିଯୋଗ: ₹${monthlyInvestment.toLocaleString('en-IN')}`}
            </label>
            <input
              type="range"
              min={500}
              max={50000}
              step={500}
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #E8820C ${((monthlyInvestment - 500) / (50000 - 500)) * 100}%, #e5e7eb ${((monthlyInvestment - 500) / (50000 - 500)) * 100}%)`,
                accentColor: '#E8820C',
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>₹500</span>
              <span>₹50,000</span>
            </div>
          </div>

          {/* Input 3 — Target Corpus */}
          <div>
            <label className="block font-body font-medium text-sm text-foreground mb-2">
              {isEN ? 'Your target:' : 'ଆପଣଙ୍କ ଲକ୍ଷ୍ୟ:'}
            </label>
            <div className="flex flex-wrap gap-2">
              {targets.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTargetCorpus(t.value)}
                  className="px-4 py-2 rounded-full text-sm font-semibold font-heading transition-colors"
                  style={
                    targetCorpus === t.value
                      ? { backgroundColor: '#E8820C', color: 'white' }
                      : { backgroundColor: 'white', border: '1px solid #e5e7eb', color: '#1a1a1a' }
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4 — Result callout */}
        <div
          className="rounded-2xl p-6 mb-6 text-center"
          style={{ backgroundColor: '#1B6B3A', color: 'white' }}
        >
          {yearsToGoal !== null ? (
            <>
              <p className="font-heading font-bold text-2xl mb-1">
                {isEN
                  ? `You will reach ${formatCorpus(targetCorpus)} by age ${ageAtGoal}`
                  : `ଆପଣ ${ageAtGoal} ବର୍ଷ ବୟସରେ ${formatCorpus(targetCorpus)} ପାଇ ପାରିବେ`}
              </p>
              <p className="font-body text-white/80 text-sm">
                {isEN
                  ? `That's in ${yearsToGoal} years — investing ₹${monthlyInvestment.toLocaleString('en-IN')} every month`
                  : `ତାହା ${yearsToGoal} ବର୍ଷ ମଧ୍ୟରେ — ପ୍ରତି ମାସ ₹${monthlyInvestment.toLocaleString('en-IN')} ବିନିଯୋଗ କରି`}
              </p>
            </>
          ) : (
            <p className="font-heading font-bold text-xl">
              {isEN
                ? 'Increase your monthly investment to reach your target faster'
                : 'ଆପଣଙ୍କ ଲକ୍ଷ୍ୟ ଶୀଘ୍ର ପାଇ ମାସିକ ବିନିଯୋଗ ବଢ଼ାନ୍ତୁ'}
            </p>
          )}
        </div>

        {/* Section 5 — Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-border mb-6">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0e8d8" />
              <XAxis
                dataKey="age"
                label={{ value: 'Age', position: 'insideBottom', offset: -2, fontSize: 11 }}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                tickFormatter={(val) => {
                  if (val >= 10000000) return `₹${val / 10000000}Cr`;
                  if (val >= 100000) return `₹${val / 100000}L`;
                  return `₹${val / 1000}K`;
                }}
                tick={{ fontSize: 10 }}
                width={55}
              />
              <Tooltip
                formatter={(val: number) => [`₹${val.toLocaleString('en-IN')}`, 'Corpus']}
                labelFormatter={(label) => `Age ${label}`}
              />
              <ReferenceLine
                y={targetCorpus}
                stroke="#E8820C"
                strokeDasharray="5 5"
                label={{
                  value: `Target ${formatCorpus(targetCorpus)}`,
                  fill: '#E8820C',
                  fontSize: 10,
                  position: 'right',
                }}
              />
              <Line
                type="monotone"
                dataKey="corpus"
                stroke="#1B6B3A"
                strokeWidth={2.5}
                dot={false}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-muted-foreground italic mt-2">
            {isEN
              ? 'Assumes 12% annual return. Actual returns vary. This is not guaranteed.'
              : '12% ବାର୍ଷିକ ଲାଭ ଧରି ହିସାବ। ପ୍ରକୃତ ଲାଭ ଭିନ୍ନ ହୋଇ ପାରେ।'}
          </p>
        </div>

        {/* Section 6 — Comparison cards */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">
              ₹{monthlyInvestment.toLocaleString('en-IN')}/month in savings account
            </p>
            <p className="font-heading font-bold text-xl text-[#2C1810]">
              ₹{savingsResult.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              after {comparisonYears} years at 3.5%
            </p>
          </div>
          <div className="rounded-xl p-4 text-white text-center" style={{ backgroundColor: '#E8820C' }}>
            <p className="text-xs text-white/80 mb-1">
              ₹{monthlyInvestment.toLocaleString('en-IN')}/month in SIP
            </p>
            <p className="font-heading font-bold text-xl">{formatCorpus(targetCorpus)}</p>
            <p className="text-xs text-white/80 mt-1">
              after {comparisonYears} years at 12%
            </p>
          </div>
        </div>

        {/* Section 7 — Lead capture form */}
        {showLeadForm && !submitted && (
          <div
            className="rounded-2xl p-6 border mb-6"
            style={{ backgroundColor: '#F5EDD8', borderColor: 'rgba(232,130,12,0.2)' }}
          >
            <h2 className="font-heading font-bold text-xl text-foreground mb-1">
              {isEN ? 'Want a personalised plan?' : 'ବ୍ୟକ୍ତିଗତ ଯୋଜନା ଚାହୁଁଛନ୍ତି କି?'}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              {isEN
                ? 'Leave your number. We will call you and walk you through your exact investment roadmap. No obligation.'
                : 'ଆପଣଙ୍କ ନମ୍ବର ଦିଅନ୍ତୁ। ଆମେ ଆପଣଙ୍କୁ call କରି ଆପଣଙ୍କ ବିନିଯୋଗ ଯୋଜନା ବୁଝାଇବୁ।'}
            </p>
            <input
              type="text"
              placeholder={isEN ? 'Your name' : 'ଆପଣଙ୍କ ନାମ'}
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              className="w-full rounded-xl border border-border px-4 py-3 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-[#E8820C] mb-3"
            />
            <input
              type="tel"
              placeholder={isEN ? 'Your phone number' : 'ଆପଣଙ୍କ ଫୋନ ନମ୍ବର'}
              value={leadPhone}
              onChange={(e) => setLeadPhone(e.target.value)}
              className="w-full rounded-xl border border-border px-4 py-3 text-sm font-body bg-white focus:outline-none focus:ring-2 focus:ring-[#E8820C] mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setLeadPreference('whatsapp')}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-heading transition-colors"
                style={
                  leadPreference === 'whatsapp'
                    ? { backgroundColor: '#1B6B3A', color: 'white' }
                    : { backgroundColor: 'white', border: '1px solid #e5e7eb', color: '#1a1a1a' }
                }
              >
                WhatsApp
              </button>
              <button
                onClick={() => setLeadPreference('call')}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold font-heading transition-colors"
                style={
                  leadPreference === 'call'
                    ? { backgroundColor: '#1B6B3A', color: 'white' }
                    : { backgroundColor: 'white', border: '1px solid #e5e7eb', color: '#1a1a1a' }
                }
              >
                {isEN ? 'Call me' : 'Call କରନ୍ତୁ'}
              </button>
            </div>
            <button
              onClick={handleLeadSubmit}
              disabled={submitting || !leadPhone}
              className="w-full mt-4 font-heading font-bold py-3 rounded-xl text-sm text-white disabled:opacity-60"
              style={{ backgroundColor: '#E8820C' }}
            >
              {submitting
                ? isEN ? 'Saving...' : 'ସଞ୍ଚୟ ହେଉଛି...'
                : isEN ? 'Get My Free Plan →' : 'ମୋ ଯୋଜନା ପାଆନ୍ତୁ →'}
            </button>
          </div>
        )}

        {/* Success state */}
        {submitted && (
          <div
            className="rounded-2xl p-6 border mb-6 text-center"
            style={{ backgroundColor: '#F5EDD8', borderColor: 'rgba(232,130,12,0.2)' }}
          >
            <div className="text-3xl mb-2">✓</div>
            <p className="font-heading font-semibold text-foreground mb-4">
              {isEN ? 'Thank you! We will be in touch shortly.' : 'ଧନ୍ୟବାଦ! ଆମେ ଶୀଘ୍ର ଆପଣଙ୍କ ସହ ଯୋଗାଯୋଗ କରିବୁ।'}
            </p>
            <div className="flex gap-3">
              <Link
                to={`/${currentLang}/book`}
                className="flex-1 py-3 rounded-xl font-heading font-bold text-sm text-white text-center"
                style={{ backgroundColor: '#E8820C' }}
              >
                {isEN ? 'Book a Free Call' : 'ନିଃଶୁଳ୍କ Call ବୁକ କରନ୍ତୁ'}
              </Link>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl font-heading font-bold text-sm text-white text-center"
                style={{ backgroundColor: '#1B6B3A' }}
              >
                {isEN ? 'WhatsApp Us' : 'WhatsApp କରନ୍ତୁ'}
              </a>
            </div>
          </div>
        )}

        {/* Section 8 — Milestone timeline */}
        {yearsToGoal !== null && milestones.length > 0 && (
          <div className="mb-8">
            <h2 className="font-heading font-bold text-xl mb-6">
              {isEN ? 'Your journey' : 'ଆପଣଙ୍କ ଯାତ୍ରା'}
            </h2>
            <div className="relative flex overflow-x-auto md:overflow-visible gap-0 pb-4">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center min-w-[80px]">
                    {m.isGoal && <span className="text-lg mb-1">🎉</span>}
                    {!m.isGoal && <span className="text-lg mb-1 opacity-0">🎉</span>}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-heading font-bold text-sm"
                      style={
                        m.isGoal
                          ? { backgroundColor: '#E8820C', color: 'white' }
                          : {
                              backgroundColor: '#F5EDD8',
                              color: '#2C1810',
                              border: '2px solid rgba(232,130,12,0.3)',
                            }
                      }
                    >
                      {m.age}
                    </div>
                    <p className="text-xs font-semibold mt-2 text-foreground">
                      {isEN ? `Age ${m.age}` : `${m.age} ବର୍ଷ`}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatCorpus(m.corpus)}</p>
                  </div>
                  {idx < milestones.length - 1 && (
                    <div className="flex-1 h-0.5 bg-[#E8820C]/20 mx-2 min-w-[16px]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
      <WhatsAppFAB />
      <MobileBottomBar />
    </>
  );
};

export default CrorePlan;
