import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import RevealSection from '@/components/RevealSection';

/* --- SVG scene illustrations --- */

const FamilyScene = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
    {/* Background circle */}
    <circle cx="36" cy="36" r="36" fill="#FFF3E3" />
    {/* Adult figure – left */}
    <circle cx="22" cy="21" r="8" fill="#E8820C" />
    <path d="M13 54 L13 34 Q13 28 22 28 Q31 28 31 34 L31 54 Z" fill="#E8820C" />
    {/* Child figure – right */}
    <circle cx="48" cy="25" r="6" fill="#E8820C" fillOpacity="0.68" />
    <path d="M41 54 L41 37 Q41 32 48 32 Q55 32 55 37 L55 54 Z" fill="#E8820C" fillOpacity="0.68" />
    {/* Joined hands */}
    <circle cx="34" cy="42" r="3" fill="#E8820C" />
    <circle cx="40" cy="42" r="3" fill="#E8820C" fillOpacity="0.68" />
    {/* Ground line */}
    <path d="M10 54 L62 54" stroke="#E8820C" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
  </svg>
);

const ShopfrontScene = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
    {/* Background circle */}
    <circle cx="36" cy="36" r="36" fill="#E8F5EE" />
    {/* Building walls */}
    <rect x="13" y="32" width="46" height="26" rx="2" fill="#1B6B3A" fillOpacity="0.7" />
    {/* Awning */}
    <path d="M10 32 Q10 23 36 23 Q62 23 62 32 Z" fill="#1B6B3A" />
    {/* Sign strip on awning */}
    <rect x="19" y="25" width="34" height="5" rx="2" fill="white" fillOpacity="0.25" />
    {/* Door */}
    <rect x="29" y="43" width="14" height="15" rx="2" fill="white" fillOpacity="0.8" />
    <circle cx="41" cy="51" r="1.5" fill="#1B6B3A" fillOpacity="0.6" />
    {/* Left window */}
    <rect x="15" y="37" width="11" height="9" rx="1.5" fill="white" fillOpacity="0.65" />
    {/* Right window */}
    <rect x="46" y="37" width="11" height="9" rx="1.5" fill="white" fillOpacity="0.65" />
  </svg>
);

const GradCapScene = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
    {/* Background circle */}
    <circle cx="36" cy="36" r="36" fill="#E3EEF5" />
    {/* Cap board (diamond top) */}
    <path d="M36 16 L60 27 L36 38 L12 27 Z" fill="#1A6B9A" />
    {/* Cap base cylinder */}
    <rect x="24" y="37" width="24" height="12" rx="2" fill="#1A6B9A" fillOpacity="0.65" />
    <ellipse cx="36" cy="49" rx="12" ry="4" fill="#1A6B9A" fillOpacity="0.5" />
    {/* Tassel cord */}
    <line x1="58" y1="27" x2="58" y2="42" stroke="#1A6B9A" strokeWidth="2" strokeLinecap="round" />
    <circle cx="58" cy="43" r="4" fill="#1A6B9A" fillOpacity="0.8" />
    {/* Star accent */}
    <path d="M36 20 l1.5 3.2 3.5.5 -2.5 2.5 .6 3.5 -3.1-1.6 -3.1 1.6 .6-3.5 -2.5-2.5 3.5-.5z" fill="#E8820C" fillOpacity="0.85" />
  </svg>
);

/* --- Card definitions --- */

const goalCards = [
  {
    accent: 'border-saffron', iconBg: 'bg-saffron-light', iconColor: 'text-saffron',
    Scene: FamilyScene, titleKey: 'goals.card1.title', sublineKey: 'goals.card1.subline',
    goals: ['goals.card1.goal1', 'goals.card1.goal2', 'goals.card1.goal3', 'goals.card1.goal4'],
    ctaKeySuffix: 'card1',
  },
  {
    accent: 'border-green', iconBg: 'bg-green-light', iconColor: 'text-green',
    Scene: ShopfrontScene, titleKey: 'goals.card2.title', sublineKey: 'goals.card2.subline',
    goals: ['goals.card2.goal1', 'goals.card2.goal2', 'goals.card2.goal3', 'goals.card2.goal4'],
    ctaKeySuffix: 'card2',
  },
  {
    accent: 'border-blue', iconBg: 'bg-blue-light', iconColor: 'text-blue',
    Scene: GradCapScene, titleKey: 'goals.card3.title', sublineKey: 'goals.card3.subline',
    goals: ['goals.card3.goal1', 'goals.card3.goal2', 'goals.card3.goal3', 'goals.card3.goal4'],
    ctaKeySuffix: 'card3',
  },
];

const GoalCards = ({ lang }: { lang: string }) => {
  const { t } = useTranslation();
  const ctaHrefs: Record<string, string> = {
    card1: `/${lang}/services#family`,
    card2: `/${lang}/services`,
    card3: `/${lang}/services#retirement`,
  };
  return (
    <section className="bg-card py-10 md:py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {goalCards.map((card, i) => (
          <RevealSection key={i} delay={i * 0.15}>
            <div className={`bg-card rounded-xl border-l-4 ${card.accent} p-4 md:p-6 shadow-sm h-full`}>
              <div className="mb-2 md:mb-4">
                <card.Scene />
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
