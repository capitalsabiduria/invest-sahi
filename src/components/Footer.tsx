import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const switchLang = (newLang: string) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem('investsahi-lang', newLang);
  };

  const serviceLinks = [
    'footer.services.mutualFunds',
    'footer.services.sip',
    'footer.services.insurance',
    'footer.services.childEducation',
    'footer.services.retirement',
    'footer.services.tax',
    'footer.services.gold',
  ];

  const learnLinks = [
    'footer.learn.stories',
    'footer.learn.glossary',
    'footer.learn.guides',
    'footer.learn.calculators',
    'footer.learn.whatsapp',
    'footer.learn.videos',
  ];

  const aboutLinks = [
    'footer.about.about',
    'footer.about.team',
    'footer.about.contact',
    'footer.about.careers',
    'footer.about.privacy',
  ];

  return (
    <footer className="bg-stone text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1 - Logo */}
          <div>
            <div className="flex items-baseline mb-1">
              <span className="font-heading text-xl text-saffron">Invest</span>
              <span className="font-heading text-xl font-semibold text-white">Sahi</span>
              <span className="font-heading text-sm text-green-light ml-0.5">.in</span>
            </div>
            <p className="font-odia text-sm text-blue-light mb-3">ଇନ୍ଭେଷ୍ଟ ସହି</p>
            <p className="text-sm text-white/70 font-body mb-4">{t('footer.tagline', 'footer.tagline')}</p>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>

          {/* Col 2 - Services */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-4">{t('footer.ourServices', 'Our Services')}</h4>
            <ul className="space-y-2">
              {serviceLinks.map((key) => (
                <li key={key}>
                  <Link to={`/${currentLang}/services`} className="text-sm text-white/70 hover:text-saffron transition-colors font-body">
                    {t(key, key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Learn */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-4">{t('footer.learnInOdia', 'Learn in Odia')}</h4>
            <ul className="space-y-2">
              {learnLinks.map((key) => (
                <li key={key}>
                  <Link to={`/${currentLang}/learn`} className="text-sm text-white/70 hover:text-saffron transition-colors font-body">
                    {t(key, key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - About */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-4">{t('footer.aboutTitle', 'About')}</h4>
            <ul className="space-y-2">
              {aboutLinks.map((key) => (
                <li key={key}>
                  <Link to={`/${currentLang}`} className="text-sm text-white/70 hover:text-saffron transition-colors font-body">
                    {t(key, key)}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://sabiduracapital.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-saffron transition-colors font-body"
                >
                  ↗ Sabiduria Capital Group
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50 font-body">
            © {new Date().getFullYear()} InvestSahi. {t('footer.rights', 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-4 text-xs text-white/50 font-body">
            <span>ARN: XXXXXX</span>
            <span>IRDAI: XXXXXX</span>
            <div className="flex rounded-full border border-white/30 overflow-hidden">
              <button
                onClick={() => switchLang('en')}
                className={`px-2 py-0.5 text-xs ${currentLang === 'en' ? 'bg-saffron text-white' : 'text-white/60'}`}
              >
                EN
              </button>
              <button
                onClick={() => switchLang('or')}
                className={`px-2 py-0.5 text-xs font-odia ${currentLang === 'or' ? 'bg-saffron text-white' : 'text-white/60'}`}
              >
                ଓଡ଼ିଆ
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-6">
          <p className="text-[10px] text-white/30 font-body leading-relaxed">
            {t('footer.disclaimer', 'Mutual fund investments are subject to market risks. Read all scheme related documents carefully before investing. Past performance is not indicative of future returns.')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
