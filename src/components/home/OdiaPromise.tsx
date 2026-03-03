import { useTranslation } from 'react-i18next';
import RevealSection from '@/components/RevealSection';

const CoinPlantIcon = () => (
  <svg width="96" height="96" viewBox="0 0 96 96" fill="none" aria-hidden="true">
    {/* Coin shadow */}
    <ellipse cx="44" cy="76" rx="26" ry="8" fill="#E8820C" fillOpacity="0.3" />
    {/* Coin side */}
    <rect x="18" y="56" width="52" height="20" rx="3" fill="#E8820C" fillOpacity="0.65" />
    {/* Coin face top */}
    <ellipse cx="44" cy="56" rx="26" ry="9" fill="#E8820C" />
    {/* Inner ring */}
    <ellipse cx="44" cy="56" rx="18" ry="6" fill="#E8820C" fillOpacity="0.6" />
    {/* Shine */}
    <ellipse cx="44" cy="56" rx="9" ry="3" fill="white" fillOpacity="0.22" />
    {/* Plant stem */}
    <path d="M44 56 L44 22" stroke="#1B6B3A" strokeWidth="3.5" strokeLinecap="round" />
    {/* Left leaf */}
    <path d="M44 42 Q27 33 25 16 Q40 25 44 40" fill="#1B6B3A" />
    {/* Right leaf */}
    <path d="M44 33 Q61 24 63 7 Q48 16 44 31" fill="#1B6B3A" fillOpacity="0.8" />
    {/* Bud */}
    <circle cx="44" cy="20" r="6" fill="#1B6B3A" />
    <circle cx="44" cy="14" r="5" fill="#E8820C" fillOpacity="0.8" />
  </svg>
);

const OdiaPromise = () => {
  const { t, i18n } = useTranslation();
  const switchLang = (l: string) => {
    i18n.changeLanguage(l);
    localStorage.setItem('investsahi-lang', l);
  };
  const currentLang = i18n.language;
  return (
    <section className="bg-card py-20">
      <RevealSection className="max-w-2xl mx-auto px-4 text-center">
        <div className="flex justify-center mb-6">
          <CoinPlantIcon />
        </div>
        <h2 className="font-odia text-3xl md:text-4xl text-foreground mb-3">{t('odia.headline', 'odia.headline')}</h2>
        <p className="font-body italic text-muted-foreground mb-6">{t('odia.translation', 'odia.translation')}</p>
        <p className="font-body text-[17px] text-foreground leading-relaxed mb-8">{t('odia.body', 'odia.body')}</p>
        <div className="inline-flex rounded-full border border-saffron overflow-hidden">
          <button onClick={() => switchLang('en')} className={`px-5 py-2 text-sm font-body font-medium ${currentLang === 'en' ? 'bg-saffron text-white' : 'text-saffron'}`}>
            English
          </button>
          <button onClick={() => switchLang('or')} className={`px-5 py-2 text-sm font-odia font-medium ${currentLang === 'or' ? 'bg-saffron text-white' : 'text-saffron'}`}>
            ଓଡ଼ିଆ
          </button>
        </div>
      </RevealSection>
    </section>
  );
};

export default OdiaPromise;
