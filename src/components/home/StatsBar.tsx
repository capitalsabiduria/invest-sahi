import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCountUp } from '@/hooks/useCountUp';

export const StatItem = ({ stat, active }: { stat: { number: number; suffix: string; label: string }; active: boolean }) => {
  const count = useCountUp(stat.number, active);
  return (
    <div className="md:border-r last:border-0 border-white/30">
      <p className="font-heading font-bold text-4xl text-white">{count}{stat.suffix}</p>
      <p className="font-body text-sm text-white/80 mt-1">{stat.label}</p>
    </div>
  );
};

const StatsBar = () => {
  const { t } = useTranslation();
  const { ref, visible } = useScrollReveal();
  const stats = [
    { number: 500, suffix: '+', label: t('stats.label1', 'Families Served') },
    { number: 15, suffix: '+', label: t('stats.label2', 'Years Experience') },
    { number: 50, suffix: 'Cr+', label: t('stats.label3', 'Assets Managed') },
    { number: 98, suffix: '%', label: t('stats.label4', 'Client Retention') },
  ];
  return (
    <section ref={ref} className="bg-saffron py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => (
          <StatItem key={i} stat={s} active={visible} />
        ))}
      </div>
    </section>
  );
};

export default StatsBar;
