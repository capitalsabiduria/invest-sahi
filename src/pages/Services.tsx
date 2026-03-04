import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Sun, Briefcase, TrendingUp, Shield, Heart, GraduationCap,
  Umbrella, PiggyBank, Landmark, Wallet, Car, ChevronDown, MessageCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import RevealSection from '@/components/RevealSection';
import { WHATSAPP_URL } from '@/config/constants';

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, Shield, Heart, GraduationCap, Umbrella, PiggyBank, Landmark, Wallet, Car, Briefcase, Home, Sun,
};

type ServiceItem = {
  nameKey: string; descKey: string; whoKey: string; minEntry: string;
  benefitKey: string; iconName: string; iconColor: string; iconBg: string;
  guideSlug: string;
};

const FAMILY_SERVICES: ServiceItem[] = [
  { nameKey: 'svc.fam.sip.name', descKey: 'svc.fam.sip.desc', whoKey: 'svc.fam.sip.who', minEntry: 'Start from ₹500/mo', benefitKey: 'svc.fam.sip.benefit', iconName: 'TrendingUp', iconColor: 'text-green', iconBg: 'bg-green-light', guideSlug: 'sip-mutual-funds' },
  { nameKey: 'svc.fam.term.name', descKey: 'svc.fam.term.desc', whoKey: 'svc.fam.term.who', minEntry: 'Start from ₹600/mo', benefitKey: 'svc.fam.term.benefit', iconName: 'Shield', iconColor: 'text-green', iconBg: 'bg-green-light', guideSlug: 'term-life-insurance' },
  { nameKey: 'svc.fam.health.name', descKey: 'svc.fam.health.desc', whoKey: 'svc.fam.health.who', minEntry: 'Start from ₹400/mo', benefitKey: 'svc.fam.health.benefit', iconName: 'Heart', iconColor: 'text-green', iconBg: 'bg-green-light', guideSlug: 'health-insurance' },
  { nameKey: 'svc.fam.sukanya.name', descKey: 'svc.fam.sukanya.desc', whoKey: 'svc.fam.sukanya.who', minEntry: 'Free Advisory', benefitKey: 'svc.fam.sukanya.benefit', iconName: 'GraduationCap', iconColor: 'text-green', iconBg: 'bg-green-light', guideSlug: 'sukanya-samriddhi-yojana' },
  { nameKey: 'svc.fam.ppf.name', descKey: 'svc.fam.ppf.desc', whoKey: 'svc.fam.ppf.who', minEntry: 'Free Advisory', benefitKey: 'svc.fam.ppf.benefit', iconName: 'PiggyBank', iconColor: 'text-green', iconBg: 'bg-green-light', guideSlug: 'public-provident-fund' },
  { nameKey: 'svc.fam.eduLoan.name', descKey: 'svc.fam.eduLoan.desc', whoKey: 'svc.fam.eduLoan.who', minEntry: 'Start from ₹1L', benefitKey: 'svc.fam.eduLoan.benefit', iconName: 'Landmark', iconColor: 'text-green', iconBg: 'bg-green-light', guideSlug: 'education-loans' },
];

const FUTURE_SERVICES: ServiceItem[] = [
  { nameKey: 'svc.fut.nps.name', descKey: 'svc.fut.nps.desc', whoKey: 'svc.fut.nps.who', minEntry: 'Start from ₹500/mo', benefitKey: 'svc.fut.nps.benefit', iconName: 'Umbrella', iconColor: 'text-saffron', iconBg: 'bg-saffron-light', guideSlug: 'national-pension-system' },
  { nameKey: 'svc.fut.atal.name', descKey: 'svc.fut.atal.desc', whoKey: 'svc.fut.atal.who', minEntry: 'Free Advisory', benefitKey: 'svc.fut.atal.benefit', iconName: 'Shield', iconColor: 'text-saffron', iconBg: 'bg-saffron-light', guideSlug: 'atal-pension-yojana' },
  { nameKey: 'svc.fut.fd.name', descKey: 'svc.fut.fd.desc', whoKey: 'svc.fut.fd.who', minEntry: 'Start from ₹1,000', benefitKey: 'svc.fut.fd.benefit', iconName: 'Landmark', iconColor: 'text-saffron', iconBg: 'bg-saffron-light', guideSlug: 'fixed-deposits' },
  { nameKey: 'svc.fut.sgb.name', descKey: 'svc.fut.sgb.desc', whoKey: 'svc.fut.sgb.who', minEntry: 'Free Advisory', benefitKey: 'svc.fut.sgb.benefit', iconName: 'Wallet', iconColor: 'text-saffron', iconBg: 'bg-saffron-light', guideSlug: 'sovereign-gold-bonds' },
  { nameKey: 'svc.fut.ulip.name', descKey: 'svc.fut.ulip.desc', whoKey: 'svc.fut.ulip.who', minEntry: 'Start from ₹2,500/mo', benefitKey: 'svc.fut.ulip.benefit', iconName: 'TrendingUp', iconColor: 'text-saffron', iconBg: 'bg-saffron-light', guideSlug: 'investment-insurance' },
];

const BUSINESS_SERVICES: ServiceItem[] = [
  { nameKey: 'svc.biz.mudra.name', descKey: 'svc.biz.mudra.desc', whoKey: 'svc.biz.mudra.who', minEntry: 'Free Advisory', benefitKey: 'svc.biz.mudra.benefit', iconName: 'Briefcase', iconColor: 'text-blue', iconBg: 'bg-blue-light', guideSlug: 'mudra-loans' },
  { nameKey: 'svc.biz.shop.name', descKey: 'svc.biz.shop.desc', whoKey: 'svc.biz.shop.who', minEntry: 'Start from ₹2,000/yr', benefitKey: 'svc.biz.shop.benefit', iconName: 'Home', iconColor: 'text-blue', iconBg: 'bg-blue-light', guideSlug: 'shop-insurance' },
  { nameKey: 'svc.biz.accident.name', descKey: 'svc.biz.accident.desc', whoKey: 'svc.biz.accident.who', minEntry: 'Start from ₹300/yr', benefitKey: 'svc.biz.accident.benefit', iconName: 'Shield', iconColor: 'text-blue', iconBg: 'bg-blue-light', guideSlug: 'personal-accident-cover' },
  { nameKey: 'svc.biz.home.name', descKey: 'svc.biz.home.desc', whoKey: 'svc.biz.home.who', minEntry: 'Start from ₹1,500/yr', benefitKey: 'svc.biz.home.benefit', iconName: 'Home', iconColor: 'text-blue', iconBg: 'bg-blue-light', guideSlug: 'home-insurance' },
  { nameKey: 'svc.biz.personal.name', descKey: 'svc.biz.personal.desc', whoKey: 'svc.biz.personal.who', minEntry: 'Start from ₹50,000', benefitKey: 'svc.biz.personal.benefit', iconName: 'Wallet', iconColor: 'text-blue', iconBg: 'bg-blue-light', guideSlug: 'personal-loans' },
];

const ServiceCard = ({ svc, lang }: { svc: ServiceItem; lang: string; }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const Icon = ICON_MAP[svc.iconName] || TrendingUp;

  return (
    <div
      className={`bg-card rounded-xl border border-border p-5 cursor-pointer transition-all ${expanded ? 'shadow-md border-l-4 border-l-saffron' : 'hover:shadow-sm'}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 ${svc.iconBg} rounded-full flex items-center justify-center shrink-0`}>
            <Icon className={svc.iconColor} size={20} />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-foreground">{t(svc.nameKey, svc.nameKey)}</h3>
            <p className="text-sm text-saffron font-heading font-bold mt-0.5">{svc.minEntry}</p>
          </div>
        </div>
        <ChevronDown size={20} className={`text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-border space-y-3">
              <p className="text-sm font-body text-foreground">{t(svc.descKey, svc.descKey)}</p>
              <p className="text-xs text-muted-foreground font-body"><strong>{t('svc.whoLabel', 'Who it\'s for')}:</strong> {t(svc.whoKey, svc.whoKey)}</p>
              <p className="text-xs text-muted-foreground font-body"><strong>{t('svc.benefitLabel', 'Key benefit')}:</strong> {t(svc.benefitKey, svc.benefitKey)}</p>
              <div className="flex gap-2 pt-3">
                <Link
                  to={`/${lang}/book`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 text-center bg-saffron text-white text-xs font-semibold px-3 py-2 rounded-full hover:opacity-90 transition-opacity"
                >
                  {t('svc.bookCta', 'Schedule a Free Consultation')} →
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex-1 flex items-center justify-center gap-1 text-xs font-medium border border-green bg-green text-white px-3 py-2 rounded-full hover:bg-transparent hover:text-green transition-all"
                >
                  <MessageCircle size={13} /> {t('svc.whatsappCta', 'Chat Now on WhatsApp')}
                </a>
              </div>
              <Link
                to={`/${lang}/learn/${svc.guideSlug}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 mt-2.5 text-sm font-semibold hover:underline"
                style={{ color: '#1A6B9A' }}
              >
                {t('svc.guideCta', 'Read our guide')} →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

type Filter = 'all' | 'family' | 'future' | 'business';

const ServiceCategory = ({ title, services, accent, IconComp, lang }: {
  title: string; services: ServiceItem[]; accent: string; IconComp: React.ElementType; lang: string;
}) => {
  const { t } = useTranslation();
  return (
    <RevealSection className="mb-12">
      <div className={`border-t-4 ${accent} pt-6`}>
        <div className="flex items-center gap-2 mb-6">
          <IconComp className="text-foreground" size={24} />
          <h2 className="font-heading font-bold text-2xl text-foreground">{t(title, title)}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((svc, i) => (
            <ServiceCard key={i} svc={svc} lang={lang} />
          ))}
        </div>
      </div>
    </RevealSection>
  );
};

const Services = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const [filter, setFilter] = useState<Filter>('all');

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t('services.filter.all', 'All') },
    { key: 'family', label: t('services.filter.family', 'For Your Family') },
    { key: 'future', label: t('services.filter.future', 'For Your Future') },
    { key: 'business', label: t('services.filter.business', 'For Your Business') },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title={currentLang === 'or'
          ? "ଆର୍ଥିକ ସେବା — SIP, Insurance, NPS ଏବଂ ଅଧିକ"
          : "Financial Services — SIP, Insurance, NPS, and more"}
        description={currentLang === 'or'
          ? "InvestSahi ର ଆର୍ଥିକ ସେବା ଦେଖନ୍ତୁ — ₹500 ରୁ SIP ଆରମ୍ଭ କରନ୍ତୁ, term insurance ନିଅନ୍ତୁ, NPS ସହ ଅବସର ଯୋଜନା କରନ୍ତୁ।"
          : "Explore InvestSahi's financial services — start a SIP from ₹500, get term insurance, plan for retirement with NPS. Serving Odisha families."}
        url={`/${currentLang}/services`}
        lang={currentLang as 'en' | 'or'}
      />
      <Navbar />
      <section className="bg-background py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-4">{t('services.hero.headline', 'services.hero.headline')}</h1>
          <p className="font-body text-lg text-muted-foreground mb-8">{t('services.hero.subline', 'services.hero.subline')}</p>
          <div className="flex flex-wrap justify-center gap-3">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium font-body transition-colors ${
                  filter === f.key ? 'bg-saffron text-white' : 'border border-border text-foreground hover:border-saffron'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {(filter === 'all' || filter === 'family') && (
          <ServiceCategory title="svc.family.title" services={FAMILY_SERVICES} accent="border-green" IconComp={Home} lang={currentLang} />
        )}
        {(filter === 'all' || filter === 'future') && (
          <ServiceCategory title="svc.future.title" services={FUTURE_SERVICES} accent="border-saffron" IconComp={Sun} lang={currentLang} />
        )}
        {(filter === 'all' || filter === 'business') && (
          <ServiceCategory title="svc.business.title" services={BUSINESS_SERVICES} accent="border-blue" IconComp={Briefcase} lang={currentLang} />
        )}
      </div>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default Services;
