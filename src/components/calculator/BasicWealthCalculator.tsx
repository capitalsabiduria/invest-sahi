import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { formatCurrency, calculateSIPCorpus } from '@/utils/sipCalculator';
import { WHATSAPP_URL } from '@/config/constants';
import type { GoalType } from './GoalSelector';

interface BasicWealthCalculatorProps {
  goal: Exclude<GoalType, 'education'>;
  onBack: () => void;
}

const GOAL_HEADINGS: Record<string, string> = {
  home: 'Plan Your Home Purchase',
  retirement: 'Plan Your Early Retirement',
  wealth: 'Build Your Wealth Systematically',
};

const GOAL_HEADING_KEYS: Record<string, string> = {
  home: 'goals.calc.home.heading',
  retirement: 'goals.calc.retirement.heading',
  wealth: 'goals.calc.wealth.heading',
};

const WHATSAPP_MESSAGES: Record<string, string> = {
  home: "Hi, I'd like to plan my home purchase with InvestSahi",
  retirement: "Hi, I'd like to plan my early retirement with InvestSahi",
  wealth: "Hi, I'd like to build a wealth plan with InvestSahi",
};

const BasicWealthCalculator = ({ goal, onBack }: BasicWealthCalculatorProps) => {
  const { t } = useTranslation();
  const [monthly, setMonthly] = useState(2500);
  const [years, setYears] = useState(15);

  const calc = useMemo(() => {
    const n = years * 12;
    const corpus = Math.round(calculateSIPCorpus(monthly, n));
    const totalInvested = monthly * n;
    const gained = corpus - totalInvested;
    return { corpus, totalInvested, gained };
  }, [monthly, years]);

  const formatCorpus = (n: number) => {
    if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} crore`;
    if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)} lakh`;
    return formatCurrency(n);
  };

  const waMessage = encodeURIComponent(WHATSAPP_MESSAGES[goal]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-body text-muted-foreground
            hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          {t('goals.calc.back', 'Change Goal')}
        </button>

        <h2 className="font-heading font-bold text-3xl text-foreground mb-8">
          {t(GOAL_HEADING_KEYS[goal], GOAL_HEADINGS[goal])}
        </h2>

        <div className="bg-card rounded-2xl p-6 shadow-sm space-y-6 mb-6">
          {/* Monthly SIP */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-body text-muted-foreground">
                {t('goals.calc.monthly', 'Monthly SIP Amount')}
              </label>
              <span className="font-heading font-semibold text-foreground">
                {formatCurrency(monthly)}/mo
              </span>
            </div>
            <Slider
              value={[monthly]}
              onValueChange={([v]) => setMonthly(v)}
              min={500}
              max={50000}
              step={500}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>₹500</span><span>₹50,000</span>
            </div>
          </div>

          {/* Years */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-body text-muted-foreground">
                {t('goals.calc.years', 'Investment Period')}
              </label>
              <span className="font-heading font-semibold text-foreground">
                {years} {t('goals.calc.years_label', 'years')}
              </span>
            </div>
            <Slider
              value={[years]}
              onValueChange={([v]) => setYears(v)}
              min={1}
              max={30}
              step={1}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 yr</span><span>30 yrs</span>
            </div>
          </div>

          {/* Fixed rate note */}
          <p className="text-xs text-muted-foreground font-body">
            {t('goals.calc.rate_note', 'Assumed return: 12% per annum (historical equity average). Not guaranteed.')}
          </p>
        </div>

        {/* Result Card */}
        <motion.div
          key={calc.corpus}
          initial={{ opacity: 0.7, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="bg-green rounded-2xl p-6 text-white mb-6"
        >
          <p className="text-sm text-white/70 font-body mb-1">
            {t('goals.calc.corpus_label', 'Estimated Corpus')}
          </p>
          <p className="font-heading font-bold text-5xl mb-6">
            {formatCorpus(calc.corpus)}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-white/60 font-body">
                {t('goals.calc.invested', 'Total Invested')}
              </p>
              <p className="font-heading font-semibold text-xl">
                {formatCorpus(calc.totalInvested)}
              </p>
            </div>
            <div>
              <p className="text-xs text-white/60 font-body">
                {t('goals.calc.gained', 'Wealth Gained')}
              </p>
              <p className="font-heading font-semibold text-xl text-saffron">
                {formatCorpus(calc.gained)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* WhatsApp CTA */}
        <a
          href={`${WHATSAPP_URL}?text=${waMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl
            font-heading font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#25D366' }}
        >
          <MessageCircle size={20} />
          {t('goals.calc.cta', 'Get a Personalised Plan on WhatsApp →')}
        </a>
      </motion.div>
    </div>
  );
};

export default BasicWealthCalculator;
