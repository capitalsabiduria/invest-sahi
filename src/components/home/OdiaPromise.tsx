import { useTranslation } from 'react-i18next';
import RevealSection from '@/components/RevealSection';

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
