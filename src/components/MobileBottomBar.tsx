import { MessageCircle, Phone, Globe } from 'lucide-react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { WHATSAPP_URL } from '@/config/constants';

const MobileBottomBar = () => {
  const { lang } = useParams<{ lang: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const currentLang = location.pathname.startsWith('/or') ? 'or' : 'en';
  const bookingUrl = `/${lang || 'en'}/book`;

  const switchLanguage = () => {
    const { pathname, search } = location;
    let newPath: string;

    if (currentLang === 'en') {
      newPath = pathname.replace(/^\/en(\/|$)/, '/or$1');
    } else {
      newPath = pathname.replace(/^\/or(\/|$)/, '/en$1');
    }

    navigate(newPath + search);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="flex items-stretch shadow-2xl" style={{ height: '56px' }}>
        {/* Book a Free Call — saffron/orange */}
        <a
          href={bookingUrl}
          className="flex-1 flex items-center justify-center gap-2 font-heading font-semibold text-sm text-white"
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
          className="flex-1 flex items-center justify-center gap-2 font-heading font-semibold text-sm text-white"
          style={{ backgroundColor: '#1B6B3A' }}
        >
          <MessageCircle size={16} />
          {t('mobilebar.whatsapp', 'WhatsApp Us')}
        </a>
        {/* Language switch — stone/dark */}
        <button
          onClick={switchLanguage}
          className="flex-1 flex items-center justify-center gap-1.5 font-heading font-semibold text-xs text-white"
          style={{ backgroundColor: '#2C1810' }}
        >
          <Globe size={14} />
          {currentLang === 'en' ? (
            <span style={{ fontFamily: 'Noto Sans Oriya, sans-serif' }}>
              {t('mobilebar.odia', 'ଓଡ଼ିଆରେ ପଢ଼ନ୍ତୁ')}
            </span>
          ) : (
            <span>{t('mobilebar.english', 'Read in English')}</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default MobileBottomBar;
