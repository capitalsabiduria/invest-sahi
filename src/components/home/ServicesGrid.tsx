import { useTranslation } from 'react-i18next';
import {
  TrendingUp, Shield, Heart, Briefcase, Home as HomeIcon, Car, Umbrella,
  Wallet, PiggyBank, Landmark, Star, Baby, BookOpen, GraduationCap,
} from 'lucide-react';
import RevealSection from '@/components/RevealSection';

export const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, Shield, Heart, Briefcase, HomeIcon, Car, Umbrella, Wallet, PiggyBank, Landmark, Star, Baby, BookOpen, GraduationCap,
};

export const SERVICES = [
  { nameKey: 'services.s1.name', amountKey: 'services.s1.amount', descKey: 'services.s1.desc', iconName: 'TrendingUp', iconColor: 'text-saffron', iconBg: 'bg-saffron-light' },
  { nameKey: 'services.s2.name', amountKey: 'services.s2.amount', descKey: 'services.s2.desc', iconName: 'PiggyBank', iconColor: 'text-green', iconBg: 'bg-green-light' },
  { nameKey: 'services.s3.name', amountKey: 'services.s3.amount', descKey: 'services.s3.desc', iconName: 'Shield', iconColor: 'text-blue', iconBg: 'bg-blue-light' },
  { nameKey: 'services.s4.name', amountKey: 'services.s4.amount', descKey: 'services.s4.desc', iconName: 'GraduationCap', iconColor: 'text-saffron', iconBg: 'bg-saffron-light' },
  { nameKey: 'services.s5.name', amountKey: 'services.s5.amount', descKey: 'services.s5.desc', iconName: 'Heart', iconColor: 'text-green', iconBg: 'bg-green-light' },
  { nameKey: 'services.s6.name', amountKey: 'services.s6.amount', descKey: 'services.s6.desc', iconName: 'Umbrella', iconColor: 'text-blue', iconBg: 'bg-blue-light' },
  { nameKey: 'services.s7.name', amountKey: 'services.s7.amount', descKey: 'services.s7.desc', iconName: 'Star', iconColor: 'text-saffron', iconBg: 'bg-saffron-light' },
  { nameKey: 'services.s8.name', amountKey: 'services.s8.amount', descKey: 'services.s8.desc', iconName: 'HomeIcon', iconColor: 'text-green', iconBg: 'bg-green-light' },
  { nameKey: 'services.s10.name', amountKey: 'services.s10.amount', descKey: 'services.s10.desc', iconName: 'Wallet', iconColor: 'text-saffron', iconBg: 'bg-saffron-light' },
  { nameKey: 'services.s11.name', amountKey: 'services.s11.amount', descKey: 'services.s11.desc', iconName: 'Landmark', iconColor: 'text-green', iconBg: 'bg-green-light' },
  { nameKey: 'services.s12.name', amountKey: 'services.s12.amount', descKey: 'services.s12.desc', iconName: 'Briefcase', iconColor: 'text-blue', iconBg: 'bg-blue-light' },
];

const ServicesGrid = () => {
  const { t } = useTranslation();
  return (
    <section className="py-20" style={{ backgroundColor: '#F5F5F0' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <RevealSection className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl text-foreground">{t('servicesGrid.title', 'servicesGrid.title')}</h2>
          <p className="font-body text-muted-foreground mt-2">{t('servicesGrid.subtitle', 'servicesGrid.subtitle')}</p>
        </RevealSection>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SERVICES.map((svc, i) => {
            const Icon = ICON_MAP[svc.iconName] || TrendingUp;
            return (
              <RevealSection key={i} delay={i * 0.05}>
                <div className="bg-card rounded-xl border border-border p-5 hover:border-l-4 hover:border-l-saffron hover:shadow-md transition-all h-full">
                  <div className={`w-10 h-10 ${svc.iconBg} rounded-full flex items-center justify-center mb-3`}>
                    <Icon className={svc.iconColor} size={20} />
                  </div>
                  <h3 className="font-heading font-semibold text-sm text-foreground">{t(svc.nameKey, svc.nameKey)}</h3>
                  <p className="font-heading font-bold text-saffron text-sm mt-1">{t(svc.amountKey, svc.amountKey)}</p>
                  <p className="text-xs text-muted-foreground font-body mt-1">{t(svc.descKey, svc.descKey)}</p>
                </div>
              </RevealSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
