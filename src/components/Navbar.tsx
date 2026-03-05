import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const SunWheel = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* 8 spokes alternating long/short */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const isLong = i % 2 === 0;
      const len = isLong ? 15 : 10;
      const rad = (angle * Math.PI) / 180;
      const x2 = 18 + len * Math.cos(rad);
      const y2 = 18 + len * Math.sin(rad);
      return (
        <line
          key={angle}
          x1="18" y1="18" x2={x2} y2={y2}
          stroke="#E8820C" strokeWidth={isLong ? 2.5 : 2} strokeLinecap="round"
        />
      );
    })}
    <circle cx="18" cy="18" r="5" fill="#E8820C" />
    <circle cx="18" cy="18" r="16" stroke="#E8820C" strokeWidth="2" fill="none" />
  </svg>
);

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentLang = lang || 'en';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLang = (newLang: string) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem('investsahi-lang', newLang);
    const path = window.location.pathname;
    const rest = path.replace(/^\/(en|or)/, '');
    navigate(`/${newLang}${rest || ''}`);
    setMobileOpen(false);
  };

  const navLinks = [
    { key: 'nav.offer', fallback: 'What We Offer', href: `/${currentLang}/services` },
    { key: 'nav.plan', fallback: 'Build Your Free Wealth Plan', href: `/${currentLang}/calculator` },
    { key: 'nav.learn', fallback: 'Money School', href: `/${currentLang}/learn` },
  ];

  const LanguagePill = () => (
    <div className="flex rounded-full border border-saffron overflow-hidden">
      <button
        onClick={() => switchLang('en')}
        className={`px-3 py-1 text-sm font-body font-medium transition-colors ${
          currentLang === 'en'
            ? 'bg-saffron text-white'
            : 'text-saffron hover:bg-saffron/10'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => switchLang('or')}
        className={`px-3 py-1 text-sm font-odia font-medium transition-colors ${
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
      <motion.nav
        className="sticky top-0 z-50 h-[72px] flex items-center px-4 md:px-8"
        style={{ backgroundColor: '#FAF6EF' }}
        animate={{ boxShadow: scrolled ? '0 2px 16px rgba(44,24,16,0.08)' : '0 0 0 rgba(0,0,0,0)' }}
        transition={{ duration: 0.3 }}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to={`/${currentLang}`} className="flex items-center gap-2">
            <SunWheel />
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="font-heading text-[22px] text-saffron">Invest</span>
                <span className="font-heading text-[22px] font-semibold text-stone">Sahi</span>
                <span className="font-heading text-[16px] text-green ml-0.5">.in</span>
              </div>
              <span className="font-odia text-[13px] text-blue -mt-1">ଇନ୍ଭେଷ୍ଟ ସହି</span>
            </div>
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
            <LanguagePill />
            <Link
              to={`/${currentLang}/book`}
              className="bg-saffron text-white font-heading font-semibold text-sm px-5 py-2 rounded-lg hover:bg-saffron/90 transition-colors"
            >
              {t('nav.book', 'Book a Free Call')}
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-stone"
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
