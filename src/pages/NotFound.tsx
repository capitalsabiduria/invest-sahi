import { Link, useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const NotFound = () => {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <h1 className="font-odia text-4xl text-foreground mb-2">ଏହି ପୃଷ୍ଠା ମିଳିଲା ନାହିଁ</h1>
        <p className="font-body text-xl text-muted-foreground mb-8">This page doesn't exist</p>
        <Link
          to={`/${currentLang}`}
          className="bg-saffron text-white font-heading font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
