import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

const SESSION_KEY = 'odia_toast_dismissed';

const OdiaLanguageToast = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const currentLang = location.pathname.startsWith('/or') ? 'or' : 'en';

  useEffect(() => {
    if (currentLang !== 'en') return;
    if (sessionStorage.getItem(SESSION_KEY) === 'true') return;
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [currentLang]);

  const dismiss = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setVisible(false);
  };

  const switchToOdia = () => {
    const newPath = location.pathname.replace(/^\/en(\/|$)/, '/or$1');
    navigate(newPath + location.search);
    dismiss();
  };

  if (!visible || currentLang !== 'en') return null;

  return (
    <div className="hidden lg:flex fixed bottom-6 right-6 z-50 items-start gap-3 bg-stone text-white rounded-2xl shadow-xl px-5 py-4 max-w-xs">
      <div className="flex-1">
        <p className="font-heading font-semibold text-sm text-saffron mb-1">
          ଓଡ଼ିଆରେ ପଢ଼ନ୍ତୁ
        </p>
        <p className="font-body text-xs text-white/70 leading-relaxed mb-3">
          This site is also available in Odia. Switch to read everything in your language.
        </p>
        <button
          onClick={switchToOdia}
          className="bg-saffron text-white font-heading font-semibold text-xs px-4 py-2 rounded-lg hover:bg-saffron/90 transition-colors"
        >
          Switch to Odia →
        </button>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="mt-0.5 text-white/50 hover:text-white transition-colors flex-shrink-0"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default OdiaLanguageToast;
