import { useTranslation } from 'react-i18next';

const Learn = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">{t('learn.title', 'Learn')}</h1>
    </div>
  );
};

export default Learn;
