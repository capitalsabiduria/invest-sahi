import { useParams } from 'react-router-dom';
import SEO from '@/components/SEO';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import LandingHero from '@/components/home/LandingHero';
import HeroSection from '@/components/home/HeroSection';
import GoalCards from '@/components/home/GoalCards';
import EducationTeaser from '@/components/home/EducationTeaser';
import StoriesSection from '@/components/home/StoriesSection';
import OdiaPromise from '@/components/home/OdiaPromise';
import ServicesGrid from '@/components/home/ServicesGrid';
import TrustSignals from '@/components/home/TrustSignals';
import Newsletter from '@/components/home/Newsletter';

const Home = () => {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  return (
    <div className="min-h-screen">
      <SEO
        title="Investing is for everyone — Start with ₹500"
        description="InvestSahi helps middle-class families in Odisha start investing with ₹500/month. Mutual funds, insurance, NPS — in English and Odia."
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
      <TrustSignals />
      <Newsletter />
      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default Home;
