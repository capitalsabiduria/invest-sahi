import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import HeroSection from '@/components/home/HeroSection';
import StatsBar from '@/components/home/StatsBar';
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
      <Navbar />
      <HeroSection lang={currentLang} />
      <StatsBar />
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
