import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const OdiaLanguageToast = () => {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const location = useLocation();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (currentLang !== 'en') return;
    if (sessionStorage.getItem('odia_toast_dismissed') === 'true') return;
    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, [currentLang]);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setDismissed(true);
      sessionStorage.setItem('odia_toast_dismissed', 'true');
    }, 8000);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible || dismissed || currentLang !== 'en') return null;

  const switchToOdia = () => {
    sessionStorage.setItem('odia_toast_dismissed', 'true');
    navigate(location.pathname.replace('/en/', '/or/') + location.search);
  };

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('odia_toast_dismissed', 'true');
  };

  return (
    <div className="hidden lg:block">
      <style>{`
        @keyframes shrinkProgress {
          from { width: 100%; }
          to { width: 0%; }
        }
        @keyframes slideInToast {
          from { opacity: 0; transform: translateY(16px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div
        className="fixed bottom-6 right-6 z-50 bg-white rounded-xl shadow-xl border border-gray-100 p-4 w-72 relative overflow-hidden"
        style={{ animation: 'slideInToast 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
      >
        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-gray-400 text-sm cursor-pointer hover:text-gray-600"
        >
          ✕
        </button>

        {/* Top row */}
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: '#F5EDD8' }}>
            <span style={{ fontSize: '18px' }}>🌐</span>
          </div>
          <div>
            <p className="font-heading font-bold text-sm" style={{ color: '#2C1810' }}>
              Available in <span className="font-odia" style={{ color: '#E8820C' }}>ଓଡ଼ିଆ</span>
            </p>
            <p className="text-xs text-gray-500 mt-1 mb-3">
              This site is fully available in Odia language
            </p>
            <div className="flex items-center">
              <button
                onClick={switchToOdia}
                className="text-white text-xs font-semibold px-3 py-2 rounded-lg"
                style={{ backgroundColor: '#E8820C' }}
              >
                Switch to Odia →
              </button>
              <button onClick={dismiss} className="text-xs text-gray-400 ml-3 cursor-pointer hover:text-gray-600">
                Not now
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 h-1 rounded-none"
          style={{ backgroundColor: '#E8820C', animation: 'shrinkProgress 8s linear forwards' }}
        />
      </div>
    </div>
  );
};

export default OdiaLanguageToast;
