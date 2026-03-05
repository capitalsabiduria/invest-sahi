import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, MessageCircle, Phone, Building2, MapPin, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { WHATSAPP_URL, OFFICE_PHONE, OFFICE_ADDRESS } from '@/config/constants';

const SERVICE_OPTIONS = [
  'book.service.sip',
  'book.service.term',
  'book.service.health',
  'book.service.nps',
  'book.service.education',
  'book.service.business',
  'book.service.other',
];

const INCOME_RANGES = [
  { value: 'below-20k', labelKey: 'book.income.below20' },
  { value: '20k-40k', labelKey: 'book.income.20to40' },
  { value: '40k-75k', labelKey: 'book.income.40to75' },
  { value: 'above-75k', labelKey: 'book.income.above75' },
];

const CONTACT_METHODS = [
  { value: 'whatsapp', icon: MessageCircle, labelKey: 'book.contact.whatsapp' },
  { value: 'phone', icon: Phone, labelKey: 'book.contact.phone' },
  { value: 'office', icon: Building2, labelKey: 'book.contact.office' },
];

const Book = () => {
  const { t, i18n } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const { toast } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [income, setIncome] = useState('');
  const [contact, setContact] = useState('whatsapp');
  const [prefLang, setPrefLang] = useState(currentLang);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const toggleService = (svc: string) => {
    setServices((prev) => prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;
    setSubmitting(true);
    const { error } = await supabase.from('bookings').insert({
      name, email, phone,
      service_interest: services,
      monthly_income_range: income,
      preferred_contact: contact,
      preferred_language: prefLang,
      message: message || null,
      source: `website-${currentLang}`,
    });
    setSubmitting(false);
    if (error) {
      console.error('Booking insert error:', error.message, error.details, error.hint);
      toast({
        title: 'Something went wrong',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-11 gap-10">
        <div className="lg:col-span-6">
          {!submitted ? (
            <>
              <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-2">{t('book.headline', 'book.headline')}</h1>
              <p className="font-body text-muted-foreground mb-8">{t('book.subline', 'book.subline')}</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Input required placeholder={t('book.name', 'Full Name *')} value={name} onChange={(e) => setName(e.target.value)} />
                  <Input required type="email" placeholder={t('book.email', 'Email *')} value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Input required type="tel" placeholder={t('book.phone', 'Phone / WhatsApp *')} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>

                <div>
                  <label className="font-heading font-semibold text-sm text-foreground mb-3 block">{t('book.whatHelp', 'What do you need help with?')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {SERVICE_OPTIONS.map((svc) => (
                      <label key={svc} className="flex items-center gap-2 cursor-pointer">
                        <Checkbox checked={services.includes(svc)} onCheckedChange={() => toggleService(svc)} />
                        <span className="text-sm font-body text-foreground">{t(svc, svc)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-heading font-semibold text-sm text-foreground mb-3 block">{t('book.incomeLabel', 'Monthly household income')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    {INCOME_RANGES.map((ir) => (
                      <button
                        key={ir.value}
                        type="button"
                        onClick={() => setIncome(ir.value)}
                        className={`rounded-lg border-2 px-3 py-2 text-sm font-body transition-all text-left ${
                          income === ir.value ? 'border-saffron bg-saffron-light text-foreground' : 'border-border text-muted-foreground hover:border-muted-foreground'
                        }`}
                      >
                        {t(ir.labelKey, ir.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-heading font-semibold text-sm text-foreground mb-3 block">{t('book.contactLabel', 'How would you like to connect?')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {CONTACT_METHODS.map((cm) => (
                      <button
                        key={cm.value}
                        type="button"
                        onClick={() => setContact(cm.value)}
                        className={`rounded-lg border-2 p-3 text-center transition-all ${
                          contact === cm.value ? 'border-saffron bg-saffron-light' : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <cm.icon className={`mx-auto mb-1 ${contact === cm.value ? 'text-saffron' : 'text-muted-foreground'}`} size={20} />
                        <span className="text-xs font-body text-foreground">{t(cm.labelKey, cm.labelKey)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-heading font-semibold text-sm text-foreground mb-3 block">{t('book.langLabel', 'Language preference')}</label>
                  <div className="flex rounded-full border border-saffron overflow-hidden w-fit">
                    <button type="button" onClick={() => setPrefLang('en')} className={`px-4 py-1.5 text-sm font-body ${prefLang === 'en' ? 'bg-saffron text-white' : 'text-saffron'}`}>EN</button>
                    <button type="button" onClick={() => setPrefLang('or')} className={`px-4 py-1.5 text-sm font-odia ${prefLang === 'or' ? 'bg-saffron text-white' : 'text-saffron'}`}>ଓଡ଼ିଆ</button>
                  </div>
                </div>

                <Textarea
                  placeholder={t('book.message', 'Anything specific you\'d like to discuss? (optional)')}
                  value={message} onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                />

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-saffron text-white font-heading font-semibold text-lg py-3.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-60"
                >
                  {submitting ? t('book.submitting', 'Submitting...') : t('book.submit', 'Book My Free Meeting →')}
                </button>
              </form>
            </>
          ) : (
            <motion.div className="text-center py-16" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <div className="w-16 h-16 bg-green rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="text-white" size={32} />
              </div>
              <h2 className="font-heading font-bold text-3xl text-foreground mb-2">{t('book.success.headline', 'book.success.headline')}</h2>
              <p className="font-body text-muted-foreground mb-6">{t('book.success.subline', 'book.success.subline')}</p>
              <a
                href={`${WHATSAPP_URL}?text=${encodeURIComponent(t('book.whatsappMsg', 'Hi, I just booked a meeting on InvestSahi. Looking forward to connecting!'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-lg text-white font-heading font-semibold text-lg"
                style={{ backgroundColor: '#25D366' }}
              >
                <MessageCircle size={22} /> {t('book.startChat', 'Start chatting now →')}
              </a>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="bg-green rounded-xl p-6 text-white">
            <h3 className="font-heading font-semibold text-xl mb-4">{t('book.expect.title', 'What to expect')}</h3>
            {[
              { num: '1', text: t('book.expect.step1', 'We review your details (within 24 hours)') },
              { num: '2', text: t('book.expect.step2', 'We call/WhatsApp you at your preferred time') },
              { num: '3', text: t('book.expect.step3', 'Free 30-min consultation, no obligation') },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-3 mb-3 last:mb-0">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-heading font-bold shrink-0">{step.num}</div>
                <p className="text-sm font-body text-white/90">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="bg-background rounded-xl p-6">
            <h3 className="font-heading font-semibold text-xl text-foreground mb-4">{t('book.promise.title', 'Our promise')}</h3>
            {[
              t('book.promise.1', 'No pressure to buy anything'),
              t('book.promise.2', 'Advice in Odia or English'),
              t('book.promise.3', 'Same advisor every time'),
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
                <Check className="text-green shrink-0" size={18} />
                <span className="text-sm font-body text-foreground">{item}</span>
              </div>
            ))}
          </div>

          <div className="bg-card rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="text-saffron" size={20} />
              <h3 className="font-heading font-semibold text-foreground">{t('book.office.title', `Our ${OFFICE_ADDRESS.split(',')[0]} Office`)}</h3>
            </div>
            <p className="text-sm text-muted-foreground font-body mb-2">{t('book.office.address', `Address placeholder, ${OFFICE_ADDRESS}`)}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-2">
              <Phone size={14} /> {t('book.office.phone', OFFICE_PHONE)}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-4">
              <Clock size={14} /> {t('book.office.hours', 'Mon-Sat, 10 AM - 6 PM')}
            </div>
            <div className="bg-muted rounded-lg h-[200px] flex items-center justify-center">
              <span className="text-sm text-muted-foreground">{t('book.office.map', 'Google Maps placeholder')}</span>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <WhatsAppFAB />
    </div>
  );
};

export default Book;
