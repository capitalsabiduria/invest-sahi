import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import RevealSection from '@/components/RevealSection';

const STORIES = [
  { id: '1', categoryKey: 'stories.cat1', categoryColor: 'bg-saffron', nameKey: 'stories.name1', professionKey: 'stories.prof1', previewKey: 'stories.preview1', slug: 'story-1' },
  { id: '2', categoryKey: 'stories.cat2', categoryColor: 'bg-green', nameKey: 'stories.name2', professionKey: 'stories.prof2', previewKey: 'stories.preview2', slug: 'story-2' },
  { id: '3', categoryKey: 'stories.cat3', categoryColor: 'bg-blue', nameKey: 'stories.name3', professionKey: 'stories.prof3', previewKey: 'stories.preview3', slug: 'story-3' },
];

const StoriesSection = ({ lang }: { lang: string }) => {
  const { t } = useTranslation();
  return (
    <section className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <RevealSection className="text-center mb-12">
          <h2 className="font-odia text-3xl md:text-[32px] text-foreground mb-1">ଓଡ଼ିଶାର ଅର୍ଥ କଥା</h2>
          <p className="font-body text-muted-foreground">{t('stories.subtitle', 'Real money stories from Odisha')}</p>
        </RevealSection>
        <div className="flex gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory md:snap-none md:grid md:grid-cols-3">
          {STORIES.map((story, i) => (
            <RevealSection key={story.id} delay={i * 0.15} className="min-w-[300px] md:min-w-0 snap-start">
              <div className="bg-card rounded-xl p-6 shadow-sm h-full flex flex-col">
                <span className={`inline-block w-fit px-2 py-0.5 rounded-full text-white text-xs font-medium mb-3 ${story.categoryColor}`}>
                  {t(story.categoryKey, story.categoryKey)}
                </span>
                <h3 className="font-heading font-semibold text-lg text-foreground">{t(story.nameKey, story.nameKey)}</h3>
                <p className="text-sm text-muted-foreground font-body mb-2">{t(story.professionKey, story.professionKey)}</p>
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
