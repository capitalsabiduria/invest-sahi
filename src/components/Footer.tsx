import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { WHATSAPP_URL, AMFI_ARN, IRDAI_REG } from '@/config/constants';

const Footer = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const serviceLinks = [
    { key: 'footer.services.mutualFunds', to: `/${currentLang}/services` },
    { key: 'footer.services.sip', to: `/${currentLang}/services` },
    { key: 'footer.services.insurance', to: `/${currentLang}/services` },
    { key: 'footer.services.childEducation', to: `/${currentLang}/services` },
    { key: 'footer.services.retirement', to: `/${currentLang}/services#retirement` },
    { key: 'footer.services.tax', to: `/${currentLang}/services#retirement` },
    { key: 'footer.services.gold', to: `/${currentLang}/services#retirement` },
  ];

  const learnLinks = [
    { key: 'footer.learn.stories', to: `/${currentLang}/learn?tab=stories` },
    { key: 'footer.learn.glossary', to: `/${currentLang}/learn?tab=glossary` },
    { key: 'footer.learn.guides', to: `/${currentLang}/learn?tab=guides` },
    { key: 'footer.learn.eduCalc', to: `/${currentLang}/calculators?goal=education` },
    { key: 'footer.learn.homeCalc', to: `/${currentLang}/calculators?goal=home` },
    { key: 'footer.learn.retirementCalc', to: `/${currentLang}/calculators?goal=retirement` },
    { key: 'footer.learn.wealthCalc', to: `/${currentLang}/calculators?goal=wealth` },
  ];

  const aboutLinks = [
    { key: 'footer.about.about', to: `/${currentLang}/about` },
    { key: 'footer.about.team', to: `/${currentLang}/about#team` },
    { key: 'footer.about.contact', to: `/${currentLang}/contact` },
    { key: 'footer.about.privacy', to: `/${currentLang}/privacy` },
  ];

  return (
    <footer className="text-white" style={{ backgroundColor: '#3D2314' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Col 1 - Logo */}
          <div>
            <img
              src="/investsahi-logo.png"
              alt="InvestSahi"
              className="h-8 w-auto mb-3"
            />
            <p className="text-sm text-white/70 font-body mb-4">{t('footer.tagline', 'footer.tagline')}</p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white"
              style={{ backgroundColor: '#25D366' }}
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
            <div className="mt-4 text-xs text-white/50 font-body leading-relaxed">
              <p>Bhubaneswar, Odisha, India</p>
              <p className="mt-1">{t('footer.sebi', 'SEBI Registered Investment Advisor')}</p>
            </div>
          </div>

          {/* Col 2 - Services */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-4">{t('footer.ourServices', 'Our Services')}</h4>
            <ul className="space-y-2">
              {serviceLinks.map((link) => (
                <li key={link.key}>
                  <Link to={link.to} className="text-sm text-white/70 hover:text-saffron transition-colors font-body">
                    {t(link.key, link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Learn */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-4">
              {t('footer.learnInOdia.en', 'Learn in Odia')} —{' '}
              <span className="font-odia">{t('footer.learnInOdia.or', 'ଶିଖନ୍ତୁ')}</span>
            </h4>
            <ul className="space-y-2">
              {learnLinks.map((link) => (
                <li key={link.key}>
                  <Link to={link.to} className="text-sm text-white/70 hover:text-saffron transition-colors font-body">
                    {t(link.key, link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - About */}
          <div>
            <h4 className="font-heading font-semibold text-base mb-4">{t('footer.aboutTitle', 'About')}</h4>
            <ul className="space-y-2">
              {aboutLinks.map((link) => (
                <li key={link.key}>
                  <Link to={link.to} className="text-sm text-white/70 hover:text-saffron transition-colors font-body">
                    {t(link.key, link.key)}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://sabiduriacapital.com"
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
            <span>ARN: {AMFI_ARN}</span>
            <span>IRDAI: {IRDAI_REG}</span>
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
