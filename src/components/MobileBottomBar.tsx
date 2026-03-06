import { MessageCircle, Phone } from 'lucide-react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WHATSAPP_URL } from '@/config/constants';

const MobileBottomBar = () => {
  const { lang } = useParams<{ lang: string }>();
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const currentLang = lang || 'en';
  const bookingUrl = `/${currentLang}/book`;

  const switchLanguage = () => {
    const newLang = currentLang === 'en' ? 'or' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('investsahi-lang', newLang);
    const newPath = currentLang === 'en'
      ? location.pathname.replace('/en/', '/or/') + location.search
      : location.pathname.replace('/or/', '/en/') + location.search;
    navigate(newPath);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="flex items-stretch shadow-2xl" style={{ height: '56px' }}>
        {/* Book a Free Call — saffron/orange */}
        <a
          href={bookingUrl}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 font-heading font-semibold text-sm text-white"
          style={{ backgroundColor: '#E8820C' }}
        >
          <Phone size={16} />
          {t('mobilebar.book', 'Book a Free Call')}
        </a>
        {/* Contact on WhatsApp — green */}
        <a
          href={`${WHATSAPP_URL}?text=${encodeURIComponent(t('mobilebar.waText', "Hi, I'd like to know more about InvestSahi"))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 font-heading font-semibold text-sm text-white"
          style={{ backgroundColor: '#1B6B3A' }}
        >
          <MessageCircle size={16} />
          {t('mobilebar.whatsapp', 'WhatsApp Us')}
        </a>
        {/* Language switch */}
        <button
          onClick={switchLanguage}
          className="flex-1 flex flex-col items-center justify-center gap-0.5"
          style={{ backgroundColor: '#2C1810' }}
        >
          {currentLang === 'en' ? (
            <>
              <span style={{ fontFamily: "'Noto Sans Oriya', sans-serif", fontSize: '14px', color: '#E8820C', fontWeight: 700 }}>ଓଡ଼ିଆ</span>
              <span style={{ fontSize: '9px', color: 'rgba(245,237,216,0.6)' }}>Read in Odia</span>
            </>
          ) : (
            <>
              <span style={{ fontSize: '13px', color: '#E8820C', fontWeight: 700 }}>EN</span>
              <span style={{ fontSize: '9px', color: 'rgba(245,237,216,0.6)' }}>Read in English</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileBottomBar;
