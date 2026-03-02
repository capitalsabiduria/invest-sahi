import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageSync = ({ children }: { children: React.ReactNode }) => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    const targetLang = lang === 'or' ? 'or' : 'en';
    if (i18n.language !== targetLang) {
      i18n.changeLanguage(targetLang);
      localStorage.setItem('investsahi-lang', targetLang);
    }
  }, [lang, i18n]);

  return <>{children}</>;
};

export default LanguageSync;
