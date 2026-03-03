import HomeCalculator from './HomeCalculator';
import RetirementCalculator from './RetirementCalculator';
import type { GoalType } from './GoalSelector';

interface BasicWealthCalculatorProps {
  goal: Exclude<GoalType, 'education'>;
  onBack: () => void;
}

const BasicWealthCalculator = ({ goal, onBack }: BasicWealthCalculatorProps) => {
  if (goal === 'home') return <HomeCalculator onBack={onBack} />;
  if (goal === 'retirement') return <RetirementCalculator onBack={onBack} />;
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <p className="text-muted-foreground font-body">
        General wealth builder coming soon. Use the WhatsApp button to talk to us directly.
      </p>
    </div>
  );
};

export default BasicWealthCalculator;
