import { useTranslation } from 'react-i18next';

const Book = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">{t('book.title', 'Book a Consultation')}</h1>
    </div>
  );
};

export default Book;
