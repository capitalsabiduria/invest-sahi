import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

const PAGE_SIZE = 20;

const AdminSubscribers = () => {
  const [subs, setSubs] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');

  const fetchSubs = useCallback(async () => {
    let query = supabase.from('newsletter_subscribers').select('*', { count: 'exact' });
    if (search) query = query.ilike('email', `%${search}%`);
    query = query.order('subscribed_at', { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    const { data, count } = await query;
    setSubs(data ?? []);
    setTotal(count ?? 0);
  }, [search, page]);

  useEffect(() => { fetchSubs(); }, [fetchSubs]);

  const exportCSV = async () => {
    const { data } = await supabase.from('newsletter_subscribers').select('*').order('subscribed_at', { ascending: false });
    if (!data?.length) return;
    const headers = ['Email', 'Name', 'Language', 'Source', 'Date'];
    const rows = data.map(s => [s.email, s.name || '', s.language_preference, s.source, new Date(s.subscribed_at).toLocaleDateString()]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'subscribers.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Subscribers</h1>
        <Button onClick={exportCSV} className="bg-saffron hover:bg-saffron/90 text-white">
          <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
      </div>
      <Input placeholder="Search by email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="max-w-xs bg-white mb-4" />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subs.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.email}</TableCell>
                <TableCell>{s.name || '-'}</TableCell>
                <TableCell>{s.language_preference === 'or' ? 'Odia' : 'English'}</TableCell>
                <TableCell>{s.source}</TableCell>
                <TableCell className="text-sm text-stone/60">{new Date(s.subscribed_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {subs.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-stone/40 py-8">No subscribers found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-stone/60">Page {page + 1} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSubscribers;
