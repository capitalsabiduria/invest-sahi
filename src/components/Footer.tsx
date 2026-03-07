import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import { MessageCircle, Phone } from 'lucide-react';
import { WHATSAPP_URL, AMFI_ARN, IRDAI_REG } from '@/config/constants';

const Footer = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  const serviceLinks = [
    { key: 'footer.services.mutualFunds', to: `/${currentLang}/services?expand=sip-mutual-funds#family` },
    { key: 'footer.services.sip', to: `/${currentLang}/services?expand=sip-mutual-funds#family` },
    { key: 'footer.services.insurance', to: `/${currentLang}/services?expand=term-life-insurance#family` },
    { key: 'footer.services.childEducation', to: `/${currentLang}/services?expand=education-loans#family` },
    { key: 'footer.services.retirement', to: `/${currentLang}/services?expand=national-pension-system#retirement` },
    { key: 'footer.services.tax', to: `/${currentLang}/services?expand=national-pension-system#retirement` },
    { key: 'footer.services.gold', to: `/${currentLang}/services?expand=sovereign-gold-bonds#retirement` },
  ];

  const learnLinks = [
    { key: 'footer.learn.stories', to: `/${currentLang}/learn?tab=stories` },
    { key: 'footer.learn.glossary', to: `/${currentLang}/learn?tab=glossary` },
    { key: 'footer.learn.guides', to: `/${currentLang}/learn?tab=guides` },
    { key: 'footer.learn.eduCalc', to: `/${currentLang}/calculator?goal=education` },
    { key: 'footer.learn.homeCalc', to: `/${currentLang}/calculator?goal=home` },
    { key: 'footer.learn.retirementCalc', to: `/${currentLang}/calculator?goal=retirement` },
    { key: 'footer.learn.wealthCalc', to: `/${currentLang}/calculator?goal=wealth` },
  ];

  const aboutLinks = [
    { key: 'footer.about.story', to: `/${currentLang}/about` },
    { key: 'footer.about.contact', to: `/${currentLang}/contact` },
    { key: 'footer.about.privacy', to: `/${currentLang}/privacy` },
  ];

  return (
    <footer className="text-white" style={{ backgroundColor: '#1A2E1A' }}>
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
              {t('footer.whatsapp', 'Contact us on WhatsApp')}
            </a>
            <a
              href="tel:+919337370992"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white mt-2"
              style={{ backgroundColor: '#E8820C' }}
            >
              <Phone size={18} />
              {currentLang === 'or' ? 'ଆମକୁ Call କରନ୍ତୁ' : 'Call Us Now'}
            </a>
            <div className="mt-4 text-xs text-white/50 font-body leading-relaxed">
              <p>604A, 6th Floor, Nexus Esplanade Mall</p>
              <p>Rasulgarh, Bhubaneswar — 751010</p>
            </div>
            <div className="mt-3 rounded-xl overflow-hidden" style={{ height: '120px' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3742.3!2d85.8245!3d20.2961!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a190906f6c0a4b1%3A0x7b1b1b1b1b1b1b1b!2sNexus%20Esplanade%20Mall%2C%20Rasulgarh%2C%20Bhubaneswar%2C%20Odisha%20751010!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="120"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="InvestSahi Office Location"
              />
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
      <div className="border-t border-white/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/50 font-body">
            © {new Date().getFullYear()} InvestSahi. {t('footer.rights', 'All rights reserved.')}
          </p>
          <div className="flex items-center gap-4 text-xs text-white/50 font-body">
            <span>ARN: {AMFI_ARN}</span>
            <span>IRDAI Compliant</span>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pb-6">
          <p className="text-xs text-white/50 font-body leading-relaxed">
            {t('footer.disclaimer', 'Mutual fund investments are subject to market risks. Read all scheme related documents carefully before investing. Past performance is not indicative of future returns.')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
