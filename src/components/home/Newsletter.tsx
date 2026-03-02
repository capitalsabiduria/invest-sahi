import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import RevealSection from '@/components/RevealSection';

const Newsletter = () => {
  const { t, i18n } = useTranslation();
  const [name, setName] = useState('');
  const [nlEmail, setNlEmail] = useState('');
  const [nlLang, setNlLang] = useState(i18n.language);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlEmail) return;
    const { error } = await supabase.from('newsletter_subscribers').insert({
      email: nlEmail, name: name || null, language_preference: nlLang,
    });
    if (error?.code === '23505') {
      toast({ title: t('newsletter.duplicate', 'Already subscribed!'), variant: 'destructive' });
      return;
    }
    if (error) {
      toast({ title: t('newsletter.error', 'Something went wrong'), variant: 'destructive' });
      return;
    }
    setSuccess(true);
  };

  return (
    <section className="bg-green py-20">
      <RevealSection className="max-w-xl mx-auto px-4 text-center">
        {!success ? (
          <>
            <h2 className="font-heading font-bold text-3xl text-white mb-2">{t('newsletter.headline', 'newsletter.headline')}</h2>
            <p className="font-body text-white/80 mb-6">{t('newsletter.subline', 'newsletter.subline')}</p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                placeholder={t('newsletter.name', 'Your name')}
                value={name} onChange={(e) => setName(e.target.value)}
                className="bg-white/90 border-0"
              />
              <Input
                type="email" required
                placeholder={t('newsletter.email', 'Email address')}
                value={nlEmail} onChange={(e) => setNlEmail(e.target.value)}
                className="bg-white/90 border-0"
              />
              <div className="flex justify-center gap-2">
                <button type="button" onClick={() => setNlLang('en')}
                  className={`px-3 py-1 rounded-full text-sm ${nlLang === 'en' ? 'bg-white text-green' : 'border border-white/50 text-white'}`}>
                  EN
                </button>
                <button type="button" onClick={() => setNlLang('or')}
                  className={`px-3 py-1 rounded-full text-sm font-odia ${nlLang === 'or' ? 'bg-white text-green' : 'border border-white/50 text-white'}`}>
                  ଓଡ଼ିଆ
                </button>
              </div>
              <button type="submit" className="w-full bg-saffron text-white font-heading font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity">
                {t('newsletter.subscribe', 'Subscribe')}
              </button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <Check className="text-white mx-auto mb-3" size={48} />
            <p className="font-heading text-2xl text-white mb-1">{t('newsletter.success', 'Subscribed!')}</p>
            <p className="font-odia text-xl text-white/80">ଧନ୍ୟବାଦ!</p>
          </motion.div>
        )}
      </RevealSection>
    </section>
  );
};

export default Newsletter;
