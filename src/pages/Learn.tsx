import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFAB from '@/components/WhatsAppFAB';
import MobileBottomBar from '@/components/MobileBottomBar';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';


const RevealSection = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const { ref, visible } = useScrollReveal();
  return (
    <motion.div ref={ref} className={className} initial={{ opacity: 0, y: 30 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay }}>
      {children}
    </motion.div>
  );
};

type ContentItem = {
  id: string; type: string; slug: string; title_en: string | null; title_or: string | null;
  preview_en: string | null; preview_or: string | null;
  body_en: string | null; body_or: string | null; category: string | null;
  status: string | null; published_at: string | null; created_at: string | null;
};

const TYPE_COLORS: Record<string, string> = {
  story: 'bg-saffron',
  glossary: 'bg-green',
  guide: 'bg-blue',
  whatsapp_post: 'bg-amber',
};

const TYPE_LABELS: Record<string, string> = {
  story: 'learn.type.story',
  glossary: 'learn.type.glossary',
  guide: 'learn.type.guide',
  whatsapp_post: 'learn.type.whatsapp',
};

const LearnCTA = ({ slug, category, lang }: { slug: string; category: string | null; lang: string }) => {
  const isOdia = lang === 'or';

  const getCTA = () => {
    const s = slug?.toLowerCase() || '';
    const c = category?.toLowerCase() || '';

    if (s.includes('sip') || s.includes('mutual-fund') || c.includes('mutual')) {
      return {
        heading: isOdia ? 'SIP ଆରମ୍ଭ କରିବାକୁ ପ୍ରସ୍ତୁତ?' : 'Ready to start your first SIP?',
        sub: isOdia ? '₹500 ରୁ ଆରମ୍ଭ କରନ୍ତୁ — ଆଜି ବିନାମୂଲ୍ୟ call book କରନ୍ତୁ' : 'Start with ₹500/month. Takes 10 minutes. Book a free call.',
        primary: isOdia ? 'ବିନାମୂଲ୍ୟ Call Book କରନ୍ତୁ' : 'Book a Free Call',
        secondary: isOdia ? 'WhatsApp ରେ ପଚାରନ୍ତୁ' : 'Ask on WhatsApp',
      };
    }
    if (s.includes('term') || s.includes('insurance') || c.includes('insurance')) {
      return {
        heading: isOdia ? 'ଆପଣଙ୍କ ପରିବାର ସୁରକ୍ଷିତ ଅଛି?' : 'Is your family protected?',
        sub: isOdia ? 'Term Insurance ବିଷୟରେ ବିଶେଷଜ୍ଞଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ' : 'Talk to an advisor about the right term cover for your family.',
        primary: isOdia ? 'ବିନାମୂଲ୍ୟ Call Book କରନ୍ତୁ' : 'Get Term Insurance Advice',
        secondary: isOdia ? 'WhatsApp ରେ ପଚାରନ୍ତୁ' : 'Ask on WhatsApp',
      };
    }
    if (s.includes('nps') || s.includes('retirement') || s.includes('pension')) {
      return {
        heading: isOdia ? 'ଅବସର ପାଇଁ ଯୋଜନା କରିଛନ୍ତି?' : 'Planning for a comfortable retirement?',
        sub: isOdia ? 'NPS ଓ APY ବିଷୟରେ ଆଜି ଜାଣନ୍ତୁ' : 'See how NPS can save you ₹50,000 in tax every year.',
        primary: isOdia ? 'ବିନାମୂଲ୍ୟ Call Book କରନ୍ତୁ' : 'Book a Free NPS Review',
        secondary: isOdia ? 'WhatsApp ରେ ପଚାରନ୍ତୁ' : 'Ask on WhatsApp',
      };
    }
    if (s.includes('education') || s.includes('child') || s.includes('sukanya')) {
      return {
        heading: isOdia ? 'ଆପଣଙ୍କ ସନ୍ତାନର ସ୍ୱପ୍ନ ପୂରଣ କରନ୍ତୁ' : "Build your child's education fund today",
        sub: isOdia ? 'NIT Rourkela, AIIMS ପାଇଁ ₹2,000/month ଯଥେଷ୍ଟ' : '₹2,000/month today can fund NIT Rourkela. Let us show you the math.',
        primary: isOdia ? 'Education Calculator ଦେଖନ୍ତୁ' : 'Try Education Calculator',
        secondary: isOdia ? 'WhatsApp ରେ ପଚାରନ୍ତୁ' : 'Ask on WhatsApp',
        primaryLink: `/${lang}/calculators`,
      };
    }
    if (s.includes('ppf') || s.includes('fd') || s.includes('post-office') || s.includes('savings')) {
      return {
        heading: isOdia ? 'ସଠିକ୍ Savings Plan ବାଛନ୍ତୁ' : 'Find the right savings plan for you',
        sub: isOdia ? 'PPF, FD, ବା SIP — ଆପଣଙ୍କ ପାଇଁ କଣ ଠିକ୍? ଆଜି ଜାଣନ୍ତୁ' : 'PPF, FD, or SIP — which one fits your goal? Talk to us free.',
        primary: isOdia ? 'ବିନାମୂଲ୍ୟ Call Book କରନ୍ତୁ' : 'Book a Free Call',
        secondary: isOdia ? 'WhatsApp ରେ ପଚାରନ୍ତୁ' : 'Ask on WhatsApp',
      };
    }
    return {
      heading: isOdia ? 'ପ୍ରଶ୍ନ ଅଛି?' : 'Have questions about this?',
      sub: isOdia ? 'ଆମ ସହ ବିନାମୂଲ୍ୟ ପରାମର୍ଶ ନିଅନ୍ତୁ' : "Talk to an InvestSahi advisor — it's free and there's no obligation.",
      primary: isOdia ? 'ବିନାମୂଲ୍ୟ Call Book କରନ୍ତୁ' : 'Book a Free Call',
      secondary: isOdia ? 'WhatsApp ରେ ପଚାରନ୍ତୁ' : 'Ask on WhatsApp',
    };
  };

  const cta = getCTA();
  const bookingLink = `/${lang}/book`;
  const whatsappLink = 'https://wa.me/917978987403';

  return (
    <div className="mt-12 rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-br from-saffron to-[#C45C00] px-8 py-8 text-white text-center">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-75 mb-2">
          {isOdia ? 'ପରବର୍ତ୍ତୀ ପଦକ୍ଷେପ' : 'Your next step'}
        </p>
        <h3 className={`text-xl font-bold font-heading mb-2 ${isOdia ? 'font-odia' : ''}`}>
          {cta.heading}
        </h3>
        <p className={`text-sm opacity-85 mb-6 max-w-sm mx-auto ${isOdia ? 'font-odia' : ''}`}>
          {cta.sub}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={(cta as { primaryLink?: string }).primaryLink || bookingLink}
            className={`inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-white text-saffron font-semibold text-sm hover:bg-sand transition-colors ${isOdia ? 'font-odia' : ''}`}
          >
            {cta.primary}
          </a>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border-2 border-white/60 text-white font-semibold text-sm hover:bg-white/10 transition-colors ${isOdia ? 'font-odia' : ''}`}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.565 4.14 1.54 5.877L.057 23.885l6.168-1.497A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.034-1.39l-.36-.214-3.731.905.967-3.617-.236-.374A9.818 9.818 0 1112 21.818z" />
            </svg>
            {cta.secondary}
          </a>
        </div>
      </div>
      <div className="bg-stone/5 border border-stone/10 px-6 py-3 flex flex-wrap items-center justify-center gap-4 text-xs text-stone/50">
        <span>✓ {isOdia ? 'SEBI Registered' : 'SEBI Registered Advisor'}</span>
        <span>✓ {isOdia ? 'ବିନାମୂଲ୍ୟ ପ୍ରଥମ Call' : 'First call is free'}</span>
        <span>✓ {isOdia ? 'କୌଣସି Hidden Charge ନାହିଁ' : 'No hidden charges'}</span>
        <span>✓ {isOdia ? 'Bhubaneswar ରେ Office' : 'Office in Bhubaneswar'}</span>
      </div>
    </div>
  );
};

const LearnList = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'en';
  const { toast } = useToast();

  const [filter, setFilter] = useState('all');
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const tab = searchParams.get('tab');
    const tabMap: Record<string, string> = { stories: 'story', glossary: 'glossary', guides: 'guide' };
    if (tab && tabMap[tab]) {
      setFilter(tabMap[tab]);
    }
  }, [searchParams]);
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [nlEmail, setNlEmail] = useState('');

  const filters = [
    { key: 'all', label: t('learn.filter.all', 'All') },
    { key: 'story', label: t('learn.filter.stories', 'Stories') },
    { key: 'glossary', label: t('learn.filter.glossary', 'Glossary') },
    { key: 'guide', label: t('learn.filter.guides', 'Guides') },
    { key: 'whatsapp_post', label: t('learn.filter.schemes', 'Schemes') },
  ];

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from('content_items')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      setContent(data || []);
      setLoading(false);
    };
    fetchContent();
  }, []);

  const filtered = filter === 'all' ? content : content.filter((c) => c.type === filter);

  const getTitle = (item: ContentItem) => (currentLang === 'or' ? item.title_or : item.title_en) || item.title_en || '';
  const getBody = (item: ContentItem) => (currentLang === 'or' ? item.body_or : item.body_en) || item.body_en || '';

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlEmail) return;
    const { error } = await supabase.from('newsletter_subscribers').insert({ email: nlEmail, language_preference: currentLang });
    if (error?.code === '23505') {
      toast({ title: t('newsletter.duplicate', 'Already subscribed!'), variant: 'destructive' });
    } else if (!error) {
      toast({ title: t('newsletter.success', 'Subscribed!') });
      setNlEmail('');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="bg-background py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-3">
            {t('learn.hero.headline', 'Money School')}
            <span className="font-odia text-2xl md:text-3xl text-saffron ml-3">— ଅର୍ଥ ବିଦ୍ୟାଳୟ</span>
          </h1>
          <p className="font-body text-muted-foreground">
            {t('learn.hero.subline', 'Your guide to smarter money decisions. In Odia and English.')}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
        <div className="flex flex-wrap gap-2 justify-center">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-3 rounded-full text-sm font-medium font-body transition-colors ${
                filter === f.key ? 'bg-saffron text-white' : 'border border-border text-foreground hover:border-saffron'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-muted rounded w-20 mb-3" />
                <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-full mb-1" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="mx-auto text-muted-foreground mb-4" size={48} />
            <h3 className="font-heading font-semibold text-xl text-foreground mb-2">{t('learn.empty.headline', 'Stories coming soon')}</h3>
            <p className="font-body text-muted-foreground mb-6">{t('learn.empty.subline', 'Subscribe to be notified when new content is published')}</p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
              <Input type="email" required placeholder={t('learn.empty.email', 'Your email')} value={nlEmail} onChange={(e) => setNlEmail(e.target.value)} />
              <button type="submit" className="w-full sm:w-auto bg-saffron text-white font-heading font-semibold px-6 py-2 rounded-lg whitespace-nowrap hover:opacity-90">
                {t('learn.empty.subscribe', 'Notify me')}
              </button>
            </form>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item, i) => (
              <RevealSection key={item.id} delay={i * 0.08}>
                <Link to={`/${currentLang}/learn/${item.slug}`} className="block h-full">
                  <div className="bg-card rounded-xl p-6 shadow-sm h-full flex flex-col hover:shadow-md transition-shadow">
                    <span className={`inline-block w-fit px-2 py-0.5 rounded-full text-white text-xs font-medium mb-3 ${TYPE_COLORS[item.type] || 'bg-muted'}`}>
                      {t(TYPE_LABELS[item.type] || 'learn.type.other', item.type)}
                    </span>
                    <h3 className="font-heading font-semibold text-lg text-foreground mb-1">{getTitle(item)}</h3>
                    {item.category && <span className="text-xs text-muted-foreground font-body mb-2">{item.category}</span>}
                    <p className="text-sm font-body text-muted-foreground line-clamp-2 flex-1">
                      {(currentLang === 'or' ? item.preview_or : item.preview_en) || getBody(item).replace(/<[^>]+>/g, '').slice(0, 120)}
                    </p>
                    <div className="flex gap-2 mt-3">
                      {item.title_en && <span className="text-xs border border-border rounded px-2 py-0.5 text-muted-foreground">EN</span>}
                      {item.title_or && <span className="text-xs border border-border rounded px-2 py-0.5 text-muted-foreground font-odia">ଓଡ଼ିଆ</span>}
                    </div>
                  </div>
                </Link>
              </RevealSection>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <WhatsAppFAB />
      <MobileBottomBar />
    </div>
  );
};

const LearnDetail = () => {
  const { t } = useTranslation();
  const { lang, slug } = useParams<{ lang: string; slug: string }>();
  const currentLang = lang || 'en';

  const [item, setItem] = useState<ContentItem | null>(null);
  const [related, setRelated] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewLang, setViewLang] = useState(currentLang);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('content_items')
        .select('*')
        .eq('slug', slug!)
        .eq('status', 'published')
        .maybeSingle();
      setItem(data);
      if (data?.category) {
        const { data: rel } = await supabase
          .from('content_items')
          .select('*')
          .eq('status', 'published')
          .eq('category', data.category)
          .neq('id', data.id)
          .limit(3);
        setRelated(rel || []);
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-muted rounded w-1/2 mx-auto mb-4" />
          <div className="h-4 bg-muted rounded w-full mb-2" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>
      </div>
    </div>
  );

  if (!item) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <h2 className="font-heading font-bold text-2xl text-foreground mb-4">{t('learn.notFound', 'Content not found')}</h2>
        <Link to={`/${currentLang}/learn`} className="text-saffron font-medium hover:underline">← {t('learn.backToAll', 'Back to all content')}</Link>
      </div>
    </div>
  );

  const title = viewLang === 'or' ? (item.title_or || item.title_en) : (item.title_en || item.title_or);
  const body = viewLang === 'or' ? (item.body_or || item.body_en) : (item.body_en || item.body_or);

  return (
    <div className="min-h-screen">
      <SEO
        title={currentLang === 'or' ? (item?.title_or || item?.title_en || '') : (item?.title_en || '')}
        description={currentLang === 'or' ? (item?.preview_or || item?.preview_en || '') : (item?.preview_en || '')}
        url={`/${currentLang}/learn/${slug}`}
        lang={currentLang as 'en' | 'or'}
        slug={slug}
        type="article"
        publishedAt={item?.published_at ?? undefined}
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": currentLang === 'or' ? (item?.title_or || item?.title_en) : item?.title_en,
          "description": item?.preview_en,
          "url": `https://investsahi.in/${currentLang}/learn/${slug}`,
          "publisher": {
            "@type": "Organization",
            "name": "InvestSahi",
            "url": "https://investsahi.in"
          },
          "datePublished": item?.published_at,
          "inLanguage": currentLang === 'or' ? 'or-IN' : 'en-IN'
        }}
      />
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <article className="lg:col-span-2">
          <Link to={`/${currentLang}/learn`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-saffron mb-4">
            <ArrowLeft size={16} /> {t('learn.back', 'Back')}
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span className={`px-2 py-0.5 rounded-full text-white text-xs font-medium ${TYPE_COLORS[item.type] || 'bg-muted'}`}>
              {t(TYPE_LABELS[item.type] || '', item.type)}
            </span>
            {item.category && <span className="text-xs text-muted-foreground">{item.category}</span>}
            <div className="ml-auto flex rounded-full border border-saffron overflow-hidden">
              {item.title_en && (
                <button onClick={() => setViewLang('en')} className={`px-3 py-1 text-xs ${viewLang === 'en' ? 'bg-saffron text-white' : 'text-saffron'}`}>EN</button>
              )}
              {item.title_or && (
                <button onClick={() => setViewLang('or')} className={`px-3 py-1 text-xs font-odia ${viewLang === 'or' ? 'bg-saffron text-white' : 'text-saffron'}`}>ଓଡ଼ିଆ</button>
              )}
            </div>
          </div>

          <h1 className={`font-heading font-bold text-3xl text-foreground mb-6 ${viewLang === 'or' ? 'font-odia' : ''}`}>{title}</h1>
          <div
            className={`prose prose-lg max-w-none
              prose-headings:font-heading prose-headings:text-stone
              prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
              prose-p:text-stone/80 prose-p:leading-relaxed
              prose-strong:text-stone prose-strong:font-semibold
              prose-blockquote:border-l-4 prose-blockquote:border-saffron
              prose-blockquote:bg-saffron/5 prose-blockquote:rounded-r-lg
              prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:not-italic
              prose-blockquote:text-stone/70
              prose-ul:text-stone/80 prose-ol:text-stone/80
              prose-li:marker:text-saffron
              prose-a:text-blue prose-a:no-underline hover:prose-a:underline
              ${viewLang === 'or' ? 'font-odia' : ''}`}
            dangerouslySetInnerHTML={{ __html: body || '' }}
          />

          <LearnCTA slug={slug!} category={item?.category ?? null} lang={viewLang} />
        </article>

        <aside className="space-y-4">
          <h3 className="font-heading font-semibold text-lg text-foreground">{t('learn.related', 'Related')}</h3>
          {related.length === 0 && <p className="text-sm text-muted-foreground">{t('learn.noRelated', 'No related content yet')}</p>}
          {related.map((r) => (
            <Link key={r.id} to={`/${currentLang}/learn/${r.slug}`} className="block bg-card rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <span className={`inline-block px-2 py-0.5 rounded-full text-white text-[10px] font-medium mb-1 ${TYPE_COLORS[r.type] || 'bg-muted'}`}>
                {t(TYPE_LABELS[r.type] || '', r.type)}
              </span>
              <p className="font-heading font-semibold text-sm text-foreground">
                {currentLang === 'or' ? (r.title_or || r.title_en) : (r.title_en || r.title_or)}
              </p>
            </Link>
          ))}
        </aside>
      </div>
      <Footer />
      <WhatsAppFAB />
      <MobileBottomBar />
    </div>
  );
};

const Learn = () => {
  const { slug } = useParams<{ slug?: string }>();
  return slug ? <LearnDetail /> : <LearnList />;
};

export default Learn;
