import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Settings,
  Globe,
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminBookings from './AdminBookings';
import AdminSubscribers from './AdminSubscribers';
import AdminContent from './AdminContent';
import AdminCalculatorLeads from './AdminCalculatorLeads';
import AdminSettings from './AdminSettings';
import SeoManager from '@/components/admin/SeoManager';
import CrorePlanLeadsTab from '@/components/admin/CrorePlanLeadsTab';
import { supabase } from '@/integrations/supabase/client';

const navItems = [
  { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'bookings', icon: Calendar, label: 'Bookings' },
  { key: 'subscribers', icon: Users, label: 'Subscribers' },
  { key: 'content', icon: FileText, label: 'Content' },
  { key: 'leads', icon: TrendingUp, label: 'Calculator Leads' },
  { key: 'crore', icon: TrendingUp, label: 'Crore Plan' },
  { key: 'seo', icon: Globe, label: 'SEO Pages' },
  { key: 'settings', icon: Settings, label: 'Settings' },
];

const Admin = () => {
  const [active, setActive] = useState('dashboard');
  const [livePageCount, setLivePageCount] = useState<number | null>(null);
  const [newCroreLeadsCount, setNewCroreLeadsCount] = useState<number | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    (supabase as any)
      .from('seo_pages')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'live')
      .then(({ count }: { count: number | null }) => setLivePageCount(count ?? 0));
    (supabase as any)
      .from('crore_plan_leads')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new')
      .then(({ count }: { count: number | null }) => setNewCroreLeadsCount(count ?? 0));
  }, []);

  const renderContent = () => {
    switch (active) {
      case 'dashboard': return <AdminDashboard />;
      case 'bookings': return <AdminBookings />;
      case 'subscribers': return <AdminSubscribers />;
      case 'content': return <AdminContent />;
      case 'leads': return <AdminCalculatorLeads />;
      case 'crore': return <CrorePlanLeadsTab />;
      case 'seo': return <SeoManager />;
      case 'settings': return <AdminSettings />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-60 bg-stone text-white flex flex-col shrink-0">
        <div className="p-6">
          <h2 className="text-xl font-bold font-heading text-saffron">InvestSahi</h2>
          <p className="text-xs text-white/50 mt-1">{t('admin.panel', 'Admin Panel')}</p>
        </div>
        <nav className="flex-1 mt-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                active === item.key
                  ? 'text-saffron border-l-4 border-saffron bg-white/5'
                  : 'text-white/70 hover:text-white hover:bg-white/5 border-l-4 border-transparent'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.key === 'seo' && livePageCount !== null && livePageCount > 0 && (
                <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full bg-green text-white leading-none">
                  {livePageCount}
                </span>
              )}
              {item.key === 'crore' && newCroreLeadsCount !== null && newCroreLeadsCount > 0 && (
                <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full bg-green text-white leading-none">
                  {newCroreLeadsCount}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-sand p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Admin;
