import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import {
  HeroSection, StatsBar, GoalCards, EducationTeaser, StoriesSection,
  OdiaPromise, ServicesGrid, TrustSignals, Newsletter,
} from '@/components/home';

const Home = () => {
  const currentLang = useParams<{ lang: string }>().lang || 'en';
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
