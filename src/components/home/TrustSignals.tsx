import { useTranslation } from 'react-i18next';
import { Shield, Heart, Landmark } from 'lucide-react';
import RevealSection from '@/components/RevealSection';

const TRUST_ITEMS = [
  { Icon: Shield, color: 'text-saffron', titleKey: 'trust.t1.title', lines: ['trust.t1.line1', 'trust.t1.line2', 'trust.t1.line3'], noteKey: 'trust.t1.note' },
  { Icon: Landmark, color: 'text-green', titleKey: 'trust.t2.title', lines: ['trust.t2.line1', 'trust.t2.line2', 'trust.t2.line3'], noteKey: 'trust.t2.note' },
  { Icon: Heart, color: 'text-blue', titleKey: 'trust.t3.title', lines: ['trust.t3.line1', 'trust.t3.line2', 'trust.t3.line3'], noteKey: 'trust.t3.note' },
];

const TrustSignals = () => {
  const { t } = useTranslation();
  return (
    <section className="bg-background py-20">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {TRUST_ITEMS.map((item, i) => (
          <RevealSection key={i} delay={i * 0.15} className="text-center">
            <item.Icon className={`${item.color} mx-auto mb-4`} size={36} />
            <h3 className="font-heading font-semibold text-xl text-foreground mb-3">{t(item.titleKey, item.titleKey)}</h3>
            <ul className="space-y-1.5 mb-3">
              {item.lines.map((l) => (
                <li key={l} className="text-sm font-body text-muted-foreground">{t(l, l)}</li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground font-body italic">{t(item.noteKey, item.noteKey)}</p>
          </RevealSection>
        ))}
      </div>
    </section>
  );
};

export default TrustSignals;
