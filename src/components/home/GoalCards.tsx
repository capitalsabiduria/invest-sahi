import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Briefcase, GraduationCap } from 'lucide-react';
import RevealSection from '@/components/RevealSection';

const goalCards = [
  {
    accent: 'border-saffron', iconBg: 'bg-saffron-light', iconColor: 'text-saffron',
    Icon: Heart, titleKey: 'goals.card1.title', sublineKey: 'goals.card1.subline',
    goals: ['goals.card1.goal1', 'goals.card1.goal2', 'goals.card1.goal3', 'goals.card1.goal4'],
    ctaKeySuffix: 'card1',
  },
  {
    accent: 'border-green', iconBg: 'bg-green-light', iconColor: 'text-green',
    Icon: Briefcase, titleKey: 'goals.card2.title', sublineKey: 'goals.card2.subline',
    goals: ['goals.card2.goal1', 'goals.card2.goal2', 'goals.card2.goal3', 'goals.card2.goal4'],
    ctaKeySuffix: 'card2',
  },
  {
    accent: 'border-blue', iconBg: 'bg-blue-light', iconColor: 'text-blue',
    Icon: GraduationCap, titleKey: 'goals.card3.title', sublineKey: 'goals.card3.subline',
    goals: ['goals.card3.goal1', 'goals.card3.goal2', 'goals.card3.goal3', 'goals.card3.goal4'],
    ctaKeySuffix: 'card3',
  },
];

const GoalCards = ({ lang }: { lang: string }) => {
  const { t } = useTranslation();
  const ctaHrefs: Record<string, string> = {
    card1: `/${lang}/services`,
    card2: `/${lang}/services`,
    card3: `/${lang}/calculator`,
  };
  return (
    <section className="bg-card py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {goalCards.map((card, i) => (
          <RevealSection key={i} delay={i * 0.15}>
            <div className={`bg-card rounded-xl border-l-4 ${card.accent} p-6 shadow-sm h-full`}>
              <div className={`w-12 h-12 ${card.iconBg} rounded-full flex items-center justify-center mb-4`}>
                <card.Icon className={card.iconColor} size={24} />
              </div>
              <h3 className="font-heading font-semibold text-xl text-foreground mb-2">{t(card.titleKey, card.titleKey)}</h3>
              <p className="text-sm text-muted-foreground font-body mb-4">{t(card.sublineKey, card.sublineKey)}</p>
              <ul className="space-y-2 mb-4">
                {card.goals.map((g) => (
                  <li key={g} className="flex items-center gap-2 text-sm font-body text-foreground">
                    <ArrowRight size={14} className="text-muted-foreground" /> {t(g, g)}
                  </li>
                ))}
              </ul>
              <Link to={ctaHrefs[card.ctaKeySuffix]} className={`text-sm font-medium ${card.iconColor} hover:underline`}>
                {t(`goals.${card.ctaKeySuffix}.cta`, `goals.${card.ctaKeySuffix}.cta`)} →
              </Link>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
};

export default GoalCards;
