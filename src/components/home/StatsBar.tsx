import { useTranslation } from 'react-i18next';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useCountUp } from '@/hooks/useCountUp';

const FamiliesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {/* Left adult */}
    <circle cx="8" cy="9" r="4" fill="white" fillOpacity="0.85" />
    <path d="M2 28 L2 18 Q2 14 8 14 Q14 14 14 18 L14 28 Z" fill="white" fillOpacity="0.75" />
    {/* Child (centre) */}
    <circle cx="16" cy="11" r="3" fill="white" fillOpacity="0.9" />
    <path d="M12 28 L12 20 Q12 16.5 16 16.5 Q20 16.5 20 20 L20 28 Z" fill="white" fillOpacity="0.8" />
    {/* Right adult */}
    <circle cx="24" cy="9" r="4" fill="white" fillOpacity="0.85" />
    <path d="M18 28 L18 18 Q18 14 24 14 Q30 14 30 18 L30 28 Z" fill="white" fillOpacity="0.75" />
  </svg>
);

const ExperienceIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {/* Calendar body */}
    <rect x="4" y="8" width="24" height="20" rx="3" fill="white" fillOpacity="0.75" />
    {/* Calendar header band */}
    <rect x="4" y="8" width="24" height="7" rx="3" fill="white" fillOpacity="0.4" />
    {/* Binding pegs */}
    <rect x="10" y="5" width="2.5" height="6" rx="1.25" fill="white" fillOpacity="0.9" />
    <rect x="19.5" y="5" width="2.5" height="6" rx="1.25" fill="white" fillOpacity="0.9" />
    {/* Star */}
    <path d="M16 16.5 l1.3 2.7 3 .4 -2.15 2.1 .5 3 -2.65-1.4 -2.65 1.4 .5-3 -2.15-2.1 3-.4z" fill="white" fillOpacity="0.95" />
  </svg>
);

const AssetsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {/* Bottom coin */}
    <rect x="5" y="22" width="22" height="5" fill="white" fillOpacity="0.55" />
    <ellipse cx="16" cy="22" rx="11" ry="3.5" fill="white" fillOpacity="0.65" />
    <ellipse cx="16" cy="27" rx="11" ry="3.5" fill="white" fillOpacity="0.5" />
    {/* Middle coin */}
    <rect x="5" y="16" width="22" height="5" fill="white" fillOpacity="0.7" />
    <ellipse cx="16" cy="16" rx="11" ry="3.5" fill="white" fillOpacity="0.8" />
    <ellipse cx="16" cy="21" rx="11" ry="3.5" fill="white" fillOpacity="0.65" />
    {/* Top coin */}
    <rect x="5" y="10" width="22" height="5" fill="white" fillOpacity="0.85" />
    <ellipse cx="16" cy="10" rx="11" ry="3.5" fill="white" fillOpacity="0.95" />
    <ellipse cx="16" cy="15" rx="11" ry="3.5" fill="white" fillOpacity="0.8" />
  </svg>
);

const RetentionIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    {/* Heart */}
    <path d="M16 27 C16 27 4 19.5 4 11.5 C4 8 7 5 10.5 5 C12.8 5 14.5 6.2 16 8 C17.5 6.2 19.2 5 21.5 5 C25 5 28 8 28 11.5 C28 19.5 16 27 16 27Z" fill="white" fillOpacity="0.85" />
    {/* Checkmark on heart */}
    <path d="M10.5 14.5 L14.5 18.5 L21.5 11" stroke="#E8820C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const StatItem = ({ stat, active, icon }: { stat: { number: number; suffix: string; label: string }; active: boolean; icon: JSX.Element }) => {
  const count = useCountUp(stat.number, active);
  return (
    <div className="md:border-r last:border-0 border-white/30">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="font-heading font-bold text-4xl text-white">{count}{stat.suffix}</p>
      <p className="font-body text-sm text-white/80 mt-1">{stat.label}</p>
    </div>
  );
};

const StatsBar = () => {
  const { t } = useTranslation();
  const { ref, visible } = useScrollReveal();
  const stats = [
    { number: 500, suffix: '+', label: t('stats.label1', 'Families Served'), icon: <FamiliesIcon /> },
    { number: 15, suffix: '+', label: t('stats.label2', 'Years Experience'), icon: <ExperienceIcon /> },
    { number: 50, suffix: 'Cr+', label: t('stats.label3', 'Assets Managed'), icon: <AssetsIcon /> },
    { number: 98, suffix: '%', label: t('stats.label4', 'Client Retention'), icon: <RetentionIcon /> },
  ];
  return (
    <section ref={ref} className="bg-saffron py-10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => (
          <StatItem key={i} stat={s} active={visible} icon={s.icon} />
        ))}
      </div>
    </section>
  );
};

export default StatsBar;
