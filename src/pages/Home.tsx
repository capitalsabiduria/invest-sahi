import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">{t('home.title', 'InvestSahi')}</h1>
    </div>
  );
};

export default Home;
