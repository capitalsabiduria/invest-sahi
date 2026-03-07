import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';


const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const currentLang = lang || 'en';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (currentLang !== 'en') return;
    if (sessionStorage.getItem('lang_pulse_shown') === 'true') return;
    const pulseTimer = setTimeout(() => {
      setShowPulse(true);
      setShowTooltip(true);
    }, 2000);
    // Stop pulse and tooltip after 8 seconds
    const stopTimer = setTimeout(() => {
      setShowPulse(false);
      setShowTooltip(false);
      sessionStorage.setItem('lang_pulse_shown', 'true');
    }, 10000);
    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(stopTimer);
    };
  }, [currentLang]);

  const dismissPulse = () => {
    setShowPulse(false);
    setShowTooltip(false);
    sessionStorage.setItem('lang_pulse_shown', 'true');
  };

  const switchLang = (newLang: string) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem('investsahi-lang', newLang);
    const path = window.location.pathname;
    const rest = path.replace(/^\/(en|or)/, '');
    navigate(`/${newLang}${rest || ''}`);
    setMobileOpen(false);
  };

  const navLinks = [
    { key: 'nav.mission', fallback: 'Our Mission', href: `/${currentLang}/about` },
    { key: 'nav.offer', fallback: 'What We Offer', href: `/${currentLang}/services` },
    { key: 'nav.plan', fallback: 'Plan My Future', href: `/${currentLang}/calculator` },
    { key: 'nav.learn', fallback: 'Money School', href: `/${currentLang}/learn` },
  ];

  const LanguagePill = () => (
    <div className="flex rounded-full border border-saffron overflow-hidden">
      <button
        onClick={() => switchLang('en')}
        className={`h-11 px-4 text-sm font-body font-medium transition-colors ${
          currentLang === 'en'
            ? 'bg-saffron text-white'
            : 'text-saffron hover:bg-saffron/10'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLang('or')}
        className={`h-11 px-4 text-sm font-odia font-medium transition-colors ${
          currentLang === 'or'
            ? 'bg-saffron text-white'
            : 'text-saffron hover:bg-saffron/10'
        }`}
      >
        ଓଡ଼ିଆ
      </button>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes pulseRing {
          0% { transform: scale(1); opacity: 0.7; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <motion.nav
        className="sticky top-0 z-50 h-[72px] flex items-center px-4 md:px-8"
        style={{ backgroundColor: '#FAF6EF' }}
        animate={{ boxShadow: scrolled ? '0 2px 16px rgba(44,24,16,0.08)' : '0 0 0 rgba(0,0,0,0)' }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to={`/${currentLang}`}>
            <img
              src="/investsahi-logo.png"
              alt="InvestSahi"
              className="h-14 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.href}
                className="font-body font-medium text-[15px] text-stone hover:text-saffron transition-colors"
              >
                {t(link.key, link.fallback)}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to={`/${currentLang}/crore-plan`}
              className="hidden lg:flex items-center gap-1 font-heading font-semibold text-sm px-3 py-2 rounded-lg border transition-colors hover:bg-[#E8820C]/10"
              style={{ borderColor: '#E8820C', color: '#E8820C' }}
            >
              {t('nav.crorePlan', 'Build ₹1 Crore')}
            </Link>
            <div className="relative hidden lg:flex items-center">
              {/* Pulse rings — only render when showPulse is true */}
              {showPulse && (
                <>
                  <span
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      border: '2px solid #E8820C',
                      animation: 'pulseRing 1.8s ease-out infinite',
                      opacity: 0,
                    }}
                  />
                  <span
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      border: '2px solid #E8820C',
                      animation: 'pulseRing 1.8s ease-out 0.6s infinite',
                      opacity: 0,
                    }}
                  />
                </>
              )}
              {/* Existing language pill — styling unchanged */}
              <LanguagePill />
              {/* Tooltip — only render when showTooltip is true */}
              {showTooltip && (
                <div
                  className="absolute top-full mt-2 right-0 z-50 bg-[#2C1810] text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg flex items-center gap-2"
                  style={{ animation: 'fadeInDown 0.3s ease both' }}
                >
                  <span>Also available in ଓଡ଼ିଆ</span>
                  <button
                    onClick={dismissPulse}
                    className="text-white/50 hover:text-white ml-1 text-sm leading-none"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                  {/* Tooltip arrow pointing up */}
                  <span
                    className="absolute bottom-full right-4"
                    style={{
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderBottom: '5px solid #2C1810',
                    }}
                  />
                </div>
              )}
            </div>
            <Link
              to={`/${currentLang}/book`}
              className="bg-saffron text-white font-heading font-semibold text-sm px-5 py-2 rounded-lg hover:bg-saffron/90 transition-colors"
            >
              {t('nav.book', 'Book a Free Call')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-stone p-3"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-sand flex flex-col items-center justify-center gap-8"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.key}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-heading text-2xl text-stone hover:text-saffron transition-colors"
              >
                {t(link.key, link.fallback)}
              </Link>
            ))}
            <LanguagePill />
            <Link
              to={`/${currentLang}/book`}
              onClick={() => setMobileOpen(false)}
              className="bg-saffron text-white font-heading font-semibold text-lg px-8 py-3 rounded-lg"
            >
              {t('nav.book', 'Book a Free Call')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
