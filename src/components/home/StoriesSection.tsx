import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import RevealSection from '@/components/RevealSection';

/* --- Avatar illustrations --- */

const TeacherAvatar = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
    <circle cx="28" cy="28" r="28" fill="#FFF3E3" />
    {/* Hair */}
    <path d="M17 22 Q17 11 28 11 Q39 11 39 22 Q36 17 28 17 Q20 17 17 22Z" fill="#2C1810" />
    {/* Face */}
    <circle cx="28" cy="23" r="10" fill="#F5C09A" />
    {/* Bindi */}
    <circle cx="28" cy="18" r="1.5" fill="#E8820C" />
    {/* Sari body */}
    <path d="M13 56 L13 38 Q13 33 28 33 Q43 33 43 38 L43 56 Z" fill="#E8820C" />
    {/* Sari drape fold */}
    <path d="M17 38 Q28 36 39 40 L39 56 L17 56 Z" fill="#E8820C" fillOpacity="0.55" />
    {/* Book held at right side */}
    <rect x="33" y="39" width="11" height="9" rx="1.5" fill="#1B6B3A" />
    <line x1="38.5" y1="39" x2="38.5" y2="48" stroke="white" strokeWidth="1" strokeOpacity="0.65" />
  </svg>
);

const DriverAvatar = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
    <circle cx="28" cy="28" r="28" fill="#E8F5EE" />
    {/* Hair */}
    <path d="M17 21 Q17 10 28 10 Q39 10 39 21 Q36 16 28 16 Q20 16 17 21Z" fill="#2C1810" />
    {/* Face */}
    <circle cx="28" cy="22" r="10" fill="#C8956A" />
    {/* Shirt */}
    <path d="M13 56 L13 37 Q13 32 28 32 Q43 32 43 37 L43 56 Z" fill="#1B6B3A" />
    {/* Steering wheel ring */}
    <circle cx="28" cy="46" r="9" stroke="white" strokeWidth="2.2" fill="none" strokeOpacity="0.85" />
    {/* Steering wheel hub */}
    <circle cx="28" cy="46" r="2.5" fill="white" fillOpacity="0.9" />
    {/* Steering wheel spokes */}
    <line x1="28" y1="37" x2="28" y2="43.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85" />
    <line x1="20.2" y1="41" x2="25.8" y2="44.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85" />
    <line x1="35.8" y1="41" x2="30.2" y2="44.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.85" />
  </svg>
);

const JawanAvatar = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
    <circle cx="28" cy="28" r="28" fill="#E3EEF5" />
    {/* Beret */}
    <path d="M17 21 Q17 10 28 10 Q39 10 39 21 Q39 17 28 16 Q17 17 17 21Z" fill="#1A6B9A" />
    <rect x="15" y="20" width="26" height="3" rx="1.5" fill="#1A6B9A" />
    {/* Cap star */}
    <path d="M28 12.5 l1.1 2.4 2.6.4 -1.9 1.8 .5 2.6 -2.3-1.2 -2.3 1.2 .5-2.6 -1.9-1.8 2.6-.4z" fill="#E8820C" />
    {/* Face */}
    <circle cx="28" cy="24" r="9" fill="#C8956A" />
    {/* Uniform */}
    <path d="M13 56 L13 37 Q13 33 28 33 Q43 33 43 37 L43 56 Z" fill="#1A6B9A" />
    {/* Chest pocket / badge */}
    <rect x="24" y="39" width="8" height="6" rx="1" fill="white" fillOpacity="0.35" />
    {/* Collar detail */}
    <path d="M22 33 L28 40 L34 33" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5" fill="none" />
  </svg>
);

/* --- Stories data --- */

const STORIES = [
  { id: '1', categoryKey: 'stories.cat1', categoryColor: 'bg-saffron', nameKey: 'stories.name1', professionKey: 'stories.prof1', previewKey: 'stories.preview1', slug: 'story-1', Avatar: TeacherAvatar },
  { id: '2', categoryKey: 'stories.cat2', categoryColor: 'bg-green', nameKey: 'stories.name2', professionKey: 'stories.prof2', previewKey: 'stories.preview2', slug: 'story-2', Avatar: DriverAvatar },
  { id: '3', categoryKey: 'stories.cat3', categoryColor: 'bg-blue', nameKey: 'stories.name3', professionKey: 'stories.prof3', previewKey: 'stories.preview3', slug: 'story-3', Avatar: JawanAvatar },
];

const StoriesSection = ({ lang }: { lang: string }) => {
  const { t } = useTranslation();
  return (
    <section className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <RevealSection className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-[32px] text-foreground mb-1">{t('stories.heading.en', "Odisha's Money Stories")}</h2>
          <p className="font-body text-muted-foreground text-xl">{t('stories.heading.or', 'ଓଡ଼ିଶାର ଅର୍ଥ କଥା')}</p>
          <p className="font-body text-muted-foreground">{t('stories.subtitle', 'Real money stories from Odisha')}</p>
        </RevealSection>
        <div className="flex gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none md:grid md:grid-cols-3">
          {STORIES.map((story, i) => (
            <RevealSection key={story.id} delay={i * 0.15} className="min-w-[300px] md:min-w-0 snap-start">
              <div className="bg-card rounded-xl p-6 shadow-sm h-full flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <story.Avatar />
                  <div>
                    <span className={`inline-block w-fit px-2 py-0.5 rounded-full text-white text-xs font-medium mb-1 ${story.categoryColor}`}>
                      {t(story.categoryKey, story.categoryKey)}
                    </span>
                    <h3 className="font-heading font-semibold text-lg text-foreground leading-tight">{t(story.nameKey, story.nameKey)}</h3>
                    <p className="text-sm text-muted-foreground font-body">{t(story.professionKey, story.professionKey)}</p>
                  </div>
                </div>
                <p className="text-sm font-body text-foreground line-clamp-3 flex-1">{t(story.previewKey, story.previewKey)}</p>
                <div className="flex gap-2 mt-3 mb-3">
                  <span className="text-xs border border-border rounded px-2 py-0.5 text-muted-foreground">EN</span>
                  <span className="text-xs border border-border rounded px-2 py-0.5 text-muted-foreground font-odia">ଓଡ଼ିଆ</span>
                </div>
                <Link to={`/${lang}/learn`} className="text-sm text-saffron font-medium hover:underline">
                  {t('stories.readMore', 'Read story')} →
                </Link>
              </div>
            </RevealSection>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to={`/${lang}/learn`} className="text-sm font-medium text-saffron hover:underline">
            {t('stories.readAll', 'Read all stories')} →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default StoriesSection;
