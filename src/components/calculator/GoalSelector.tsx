import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export type GoalType = 'home' | 'education' | 'retirement' | 'wealth';

interface GoalSelectorProps {
  onGoalSelect: (goal: GoalType) => void;
}

const GOALS = [
  { id: 'home' as GoalType, emoji: '🏡', titleFallback: 'Buying a Home', subtitleFallback: 'Plan your down payment and EMI budget' },
  { id: 'education' as GoalType, emoji: '🎓', titleFallback: "Child's Education", subtitleFallback: 'Fund NIT, IIT, AIIMS — name the college' },
  { id: 'retirement' as GoalType, emoji: '🌴', titleFallback: 'Early Retirement', subtitleFallback: 'Build the corpus to retire on your terms' },
  { id: 'wealth' as GoalType, emoji: '💰', titleFallback: 'Building Wealth', subtitleFallback: 'Grow your savings systematically' },
];

const GoalSelector = ({ onGoalSelect }: GoalSelectorProps) => {
  const { t } = useTranslation();
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-foreground text-center mb-3">
          {t('goals.heading', 'What is your primary focus right now?')}
        </h2>
        <p className="font-body text-muted-foreground text-center mb-10">
          {t('goals.subheading', "We'll build a personalised plan around your goal.")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GOALS.map((goal, idx) => (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              onClick={() => onGoalSelect(goal.id)}
              className="group relative bg-card rounded-2xl border-2 border-border hover:border-saffron hover:shadow-md transition-all duration-200 p-6 text-left w-full"
            >
              <span className="text-4xl mb-3 block">{goal.emoji}</span>
              <h3 className="font-heading font-semibold text-lg text-foreground mb-1">{t(`goals.${goal.id}.title`, goal.titleFallback)}</h3>
              <p className="font-body text-sm text-muted-foreground">{t(`goals.${goal.id}.subtitle`, goal.subtitleFallback)}</p>
              <span className="absolute top-4 right-4 w-6 h-6 rounded-full bg-saffron text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </motion.button>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-8 font-body">
          {t('goals.hint', "Not sure? Start with Building Wealth — you can always refine later.")}
        </p>
      </motion.div>
    </div>
  );
};

export default GoalSelector;
