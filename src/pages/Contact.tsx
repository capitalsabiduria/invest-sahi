import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Clock, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import MobileBottomBar from '@/components/MobileBottomBar';
import SEO from '@/components/SEO';
import { WHATSAPP_URL } from '@/config/constants';

const Contact = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';

  return (
    <div className="min-h-screen">
      <SEO
        title={currentLang === 'or'
          ? "ଯୋଗାଯୋଗ କରନ୍ତୁ — InvestSahi, Bhubaneswar"
          : "Contact Us — InvestSahi, Bhubaneswar"}
        description={currentLang === 'or'
          ? "InvestSahi ର ଅଫିସ: Nexus Esplanade Mall, Rasulgarh, Bhubaneswar। ଫୋନ ବା WhatsApp କରନ୍ତୁ। ସୋମ-ଶନି, ସକାଳ ୧୦ ରୁ ସଂଧ୍ୟା ୬।"
          : "Visit InvestSahi at 604A, Nexus Esplanade Mall, Rasulgarh, Bhubaneswar. Call or WhatsApp us at +91 93373 70992. Mon-Sat, 10 AM to 6 PM."}
        url={`/${currentLang}/contact`}
        lang={currentLang as 'en' | 'or'}
      />
      <Navbar />
      <section className="bg-background py-16">
        <div className="max-w-5xl mx-auto px-4 md:px-8">
          <h1 className="font-heading font-bold text-4xl text-foreground mb-2">
            {t('contact.title', 'Get in Touch')}
          </h1>
          <p className="font-body text-muted-foreground text-lg mb-12">
            {t('contact.subtitle', "We're based in Bhubaneswar. Come visit, call, or WhatsApp us.")}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left — Contact details */}
            <div>
              <address className="not-italic space-y-8 font-body">
                <div className="flex gap-4">
                  <MapPin className="text-saffron shrink-0 mt-1" size={22} />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 font-heading font-semibold uppercase tracking-wide text-xs">
                      {t('contact.office', 'Our Office')}
                    </p>
                    <p className="font-heading font-semibold text-foreground text-lg">InvestSahi</p>
                    <p className="text-foreground">604A, 6th Floor, Office Units</p>
                    <p className="text-foreground">Nexus Esplanade Mall, Rasulgarh</p>
                    <p className="text-foreground">Bhubaneswar, Odisha — 751010</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Phone className="text-saffron shrink-0 mt-1" size={22} />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 font-heading font-semibold uppercase tracking-wide text-xs">Phone</p>
                    <a
                      href="tel:+919337370992"
                      className="text-foreground font-semibold hover:text-saffron transition-colors text-lg"
                    >
                      +91 93373 70992
                    </a>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Clock className="text-saffron shrink-0 mt-1" size={22} />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 font-heading font-semibold uppercase tracking-wide text-xs">
                      {t('contact.hours', 'Office Hours')}
                    </p>
                    <p className="text-foreground">Monday – Saturday</p>
                    <p className="text-foreground">10:00 AM – 6:00 PM</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <MessageCircle className="text-saffron shrink-0 mt-1" size={22} />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1 font-heading font-semibold uppercase tracking-wide text-xs">Email</p>
                    <a
                      href="mailto:hello@investsahi.in"
                      className="text-foreground hover:text-saffron transition-colors"
                    >
                      hello@investsahi.in
                    </a>
                  </div>
                </div>
              </address>
              <div className="flex flex-col sm:flex-row gap-3 mt-10">
                <a
                  href={`${WHATSAPP_URL}?text=${encodeURIComponent("Hi, I'd like to know more about InvestSahi")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-heading font-semibold text-white"
                  style={{ backgroundColor: '#1B6B3A' }}
                >
                  <MessageCircle size={18} />
                  WhatsApp Us
                </a>
                <Link
                  to={`/${currentLang}/book`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-heading font-semibold text-white"
                  style={{ backgroundColor: '#E8820C' }}
                >
                  <Phone size={18} />
                  Book a Free Call
                </Link>
              </div>
            </div>
            {/* Right — Google Maps */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-border" style={{ height: '440px' }}>
              <iframe
                title="InvestSahi Office — Nexus Esplanade Mall, Bhubaneswar"
                src="https://www.google.com/maps?q=604A,+Nexus+Esplanade+Mall,+Rasulgarh,+Bhubaneswar,+Odisha+751010&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppFAB />
      <MobileBottomBar />
    </div>
  );
};

export default Contact;
