import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  Settings,
} from 'lucide-react';
import AdminDashboard from './AdminDashboard';
import AdminBookings from './AdminBookings';
import AdminSubscribers from './AdminSubscribers';
import AdminContent from './AdminContent';
import AdminCalculatorLeads from './AdminCalculatorLeads';
import AdminSettings from './AdminSettings';

const navItems = [
  { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { key: 'bookings', icon: Calendar, label: 'Bookings' },
  { key: 'subscribers', icon: Users, label: 'Subscribers' },
  { key: 'content', icon: FileText, label: 'Content' },
  { key: 'leads', icon: TrendingUp, label: 'Calculator Leads' },
  { key: 'settings', icon: Settings, label: 'Settings' },
];

const Admin = () => {
  const [active, setActive] = useState('dashboard');
  const { t } = useTranslation();

  const renderContent = () => {
    switch (active) {
      case 'dashboard': return <AdminDashboard />;
      case 'bookings': return <AdminBookings />;
      case 'subscribers': return <AdminSubscribers />;
      case 'content': return <AdminContent />;
      case 'leads': return <AdminCalculatorLeads />;
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
