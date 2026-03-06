import { MessageCircle, Phone, Globe } from 'lucide-react';
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
    const { pathname, search } = location;
    const newPath = currentLang === 'en'
      ? pathname.replace(/^\/en(\/|$)/, '/or$1')
      : pathname.replace(/^\/or(\/|$)/, '/en$1');
    navigate(newPath + search);
  };

  const divider = (
    <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'stretch', margin: '10px 0' }} />
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden" style={{ borderTop: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 -4px 20px rgba(0,0,0,0.15)' }}>
      <div className="flex items-stretch" style={{ height: '60px' }}>

        {/* Book a Free Call — saffron/orange */}
        <a
          href={bookingUrl}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 font-heading font-semibold text-white"
          style={{ backgroundColor: '#E8820C', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}
        >
          <Phone size={15} />
          <span className="text-xs font-semibold">{t('mobilebar.book', 'Book a Call')}</span>
        </a>

        {divider}

        {/* Contact on WhatsApp — green */}
        <a
          href={`${WHATSAPP_URL}?text=${encodeURIComponent(t('mobilebar.waText', "Hi, I'd like to know more about InvestSahi"))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 font-heading font-semibold text-white"
          style={{ backgroundColor: '#1B6B3A', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2)' }}
        >
          <MessageCircle size={15} />
          <span className="text-xs font-semibold">{t('mobilebar.whatsapp', 'WhatsApp Us')}</span>
        </a>

        {divider}

        {/* Language switch */}
        <button
          onClick={switchLanguage}
          className="flex-1 flex flex-col items-center justify-center gap-0.5"
          style={{ backgroundColor: '#2C1810' }}
        >
          <div
            className="flex flex-col items-center justify-center gap-0.5"
            style={{ backgroundColor: 'rgba(232,130,12,0.15)', borderRadius: 20, paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3 }}
          >
            <Globe size={13} color="#E8820C" />
            {currentLang === 'en' ? (
              <span style={{ fontFamily: 'Noto Sans Oriya, sans-serif', fontSize: 12, color: '#E8820C', fontWeight: 700, lineHeight: 1 }}>
                {t('mobilebar.odia', 'ଓଡ଼ିଆ')}
              </span>
            ) : (
              <span style={{ fontSize: 12, color: '#E8820C', fontWeight: 700, lineHeight: 1 }}>
                {t('mobilebar.english', 'English')}
              </span>
            )}
          </div>
        </button>

      </div>
    </div>
  );
};

export default MobileBottomBar;

