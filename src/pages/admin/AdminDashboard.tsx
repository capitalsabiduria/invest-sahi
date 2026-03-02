import { useEffect, useState } from 'react';
import { Calendar, Users, TrendingUp, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

const StatCard = ({ icon: Icon, label, count, color }: { icon: any; label: string; count: number; color: string }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 flex items-start gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-4xl font-bold font-heading">{count}</p>
      <p className="text-sm text-stone/60 mt-1">{label}</p>
      <p className="text-xs text-stone/40">this month</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ bookings: 0, subscribers: 0, leads: 0, content: 0 });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentSubs, setRecentSubs] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [b, s, l, c] = await Promise.all([
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
        supabase.from('calculator_leads').select('*', { count: 'exact', head: true }),
        supabase.from('content_items').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      ]);
      setStats({
        bookings: b.count ?? 0,
        subscribers: s.count ?? 0,
        leads: l.count ?? 0,
        content: c.count ?? 0,
      });

      const { data: bookings } = await supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(5);
      const { data: subs } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false }).limit(5);
      setRecentBookings(bookings ?? []);
      setRecentSubs(subs ?? []);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Calendar} label="Total Bookings" count={stats.bookings} color="bg-saffron" />
        <StatCard icon={Users} label="Subscribers" count={stats.subscribers} color="bg-green" />
        <StatCard icon={TrendingUp} label="Calculator Leads" count={stats.leads} color="bg-blue" />
        <StatCard icon={FileText} label="Published Content" count={stats.content} color="bg-stone" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-heading font-semibold mb-4">Recent Bookings</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentBookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.name}</TableCell>
                  <TableCell>{b.service_interest?.join(', ') || '-'}</TableCell>
                  <TableCell>
                    <StatusPill status={b.status} />
                  </TableCell>
                  <TableCell className="text-sm text-stone/60">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {recentBookings.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-stone/40">No bookings yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-heading font-semibold mb-4">Recent Subscribers</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Language</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSubs.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.language_preference === 'or' ? 'Odia' : 'English'}</TableCell>
                  <TableCell className="text-sm text-stone/60">{new Date(s.subscribed_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
              {recentSubs.length === 0 && (
                <TableRow><TableCell colSpan={3} className="text-center text-stone/40">No subscribers yet</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

const StatusPill = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    pending: 'bg-amber/10 text-amber',
    confirmed: 'bg-green-light text-green',
    completed: 'bg-blue-light text-blue',
    cancelled: 'bg-stone/10 text-stone/50',
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${colors[status] || 'bg-stone/10 text-stone/50'}`}>
      {status}
    </span>
  );
};

export default AdminDashboard;
