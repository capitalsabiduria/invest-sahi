import { useParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import MobileBottomBar from '@/components/MobileBottomBar';
import LandingHero from '@/components/home/LandingHero';
import HeroSection from '@/components/home/HeroSection';
import GoalCards from '@/components/home/GoalCards';
import EducationTeaser from '@/components/home/EducationTeaser';
import StoriesSection from '@/components/home/StoriesSection';
import OdiaPromise from '@/components/home/OdiaPromise';
import ServicesGrid from '@/components/home/ServicesGrid';
import TrustSignals from '@/components/home/TrustSignals';
import { mutualFundLogos, insuranceLogos } from '@/constants/partners';
import Newsletter from '@/components/home/Newsletter';

const Home = () => {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  return (
    <div className="min-h-screen">
      <SEO
        title={currentLang === 'or'
          ? "ସମସ୍ତଙ୍କ ପାଇଁ ବିନିଯୋଗ — ₹500 ରୁ ଆରମ୍ଭ କରନ୍ତୁ"
          : "Investing is for everyone — Start with ₹500"}
        description={currentLang === 'or'
          ? "InvestSahi ଓଡ଼ିଶାର ମଧ୍ୟବିତ୍ତ ପରିବାରଙ୍କୁ ₹500/ମାସରୁ ବିନିଯୋଗ ଆରମ୍ଭ କରିବାରେ ସାହାଯ୍ୟ କରେ। Mutual funds, insurance, NPS — ଓଡ଼ିଆ ଏବଂ ଇଂରାଜୀରେ।"
          : "InvestSahi helps middle-class families in Odisha start investing with ₹500/month. Mutual funds, insurance, NPS — in English and Odia."}
        url={`/${currentLang}`}
        lang={currentLang as 'en' | 'or'}
      />
      <Navbar />
      <LandingHero lang={currentLang} />
      <HeroSection lang={currentLang} />
      <GoalCards lang={currentLang} />
      <EducationTeaser lang={currentLang} />
      <StoriesSection lang={currentLang} />
      <OdiaPromise />
      <ServicesGrid />

      {/* Partner logos ticker — between services and trust section */}
      <section className="py-10 bg-[#F5EDD8] overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 mb-3">
          <p className="text-center text-xs font-body text-[#2C1810] opacity-50 uppercase tracking-widest">
            {currentLang === 'or' ? 'ଆମ ପାର୍ଟନର' : 'Our Partners'}
          </p>
        </div>
        {/* Row 1 — Mutual Funds */}
        <div className="mb-4">
          <div
            className="flex hover:[animation-play-state:paused]"
            style={{ animation: 'ticker 30s linear infinite' }}
          >
            {[...mutualFundLogos, ...mutualFundLogos].map((logo, i) => (
              <div key={i} className="flex-shrink-0 mx-6 flex items-center justify-center" style={{ width: '120px', height: '48px' }}>
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-8 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>
        {/* Row 2 — Insurance */}
        <div>
          <div
            className="flex hover:[animation-play-state:paused]"
            style={{ animation: 'ticker 30s linear infinite' }}
          >
            {[...insuranceLogos, ...insuranceLogos].map((logo, i) => (
              <div key={i} className="flex-shrink-0 mx-6 flex items-center justify-center" style={{ width: '120px', height: '48px' }}>
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="max-h-8 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <TrustSignals />
      <Newsletter />
      <Footer />
      <WhatsAppFAB />
      <MobileBottomBar />
    </div>
  );
};

export default Home;
