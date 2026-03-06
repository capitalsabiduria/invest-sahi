import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'] as const;
const PAGE_SIZE = 20;

const formatService = (s: string) =>
  s.replace('book.service.', '')
   .split('.')
   .map(w => w.charAt(0).toUpperCase() + w.slice(1))
   .join(' ');

const connectLabel = (val: string) => {
  if (val === 'whatsapp') return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">WhatsApp</span>;
  if (val === 'call' || val === 'phone') return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Phone Call</span>;
  if (val === 'visit') return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Visit Office</span>;
  return <span>{val || '—'}</span>;
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchBookings = useCallback(async () => {
    let query = supabase
      .from('bookings')
      .select('id, name, email, phone, service_interest, monthly_income_range, message, preferred_contact, source, status, created_at', { count: 'exact' });
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    query = query.order('created_at', { ascending: false }).range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    const { data, count } = await query;
    setBookings(data ?? []);
    setTotal(count ?? 0);
  }, [statusFilter, search, page]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateStatus = async (id: string, newStatus: string) => {
    await supabase.from('bookings').update({ status: newStatus }).eq('id', id);
    fetchBookings();
  };

  const exportCSV = async () => {
    let query = supabase
      .from('bookings')
      .select('id, name, email, phone, service_interest, monthly_income_range, message, preferred_contact, source, status, created_at');
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    if (search) query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    query = query.order('created_at', { ascending: false });

    const { data } = await query;
    if (!data || data.length === 0) return;
    const headers = [
      'Name', 'Email', 'Phone', 'Service Interest',
      'Monthly Surplus', 'Connect Via',
      'Source', 'Status', 'Notes', 'Date'
    ];
    const rows = data.map(b => [
      b.name,
      b.email,
      b.phone,
      (b.service_interest || []).map(formatService).join(' | '),
      b.monthly_income_range || '',
      b.preferred_contact || '',
      b.source || '',
      b.status || '',
      (b.message || '').replace(/\n/g, ' '),
      new Date(b.created_at).toLocaleString('en-IN'),
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investsahi-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const statusColors: Record<string, string> = {
    pending: 'bg-amber/10 text-amber',
    confirmed: 'bg-green-light text-green',
    completed: 'bg-blue-light text-blue',
    cancelled: 'bg-stone/10 text-stone/50',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Bookings</h1>
      <div className="flex gap-4 mb-4">
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-48 bg-white"><SelectValue placeholder="Filter by status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {STATUSES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
          </SelectContent>
        </Select>
        <Input placeholder="Search name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="max-w-xs bg-white" />
        <Button variant="outline" onClick={exportCSV} className="ml-auto flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1v9M5 7l3 3 3-3M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Export CSV
        </Button>
      </div>

      {/* Desktop table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Service Interest</TableHead>
              <TableHead>Monthly Surplus</TableHead>
              <TableHead>Connect Via</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b.id}>
                <TableCell>{b.name}</TableCell>
                <TableCell>{b.email}</TableCell>
                <TableCell>{b.phone}</TableCell>
                <TableCell>{(b.service_interest || []).map(formatService).join(', ')}</TableCell>
                <TableCell>{b.monthly_income_range || '—'}</TableCell>
                <TableCell>{connectLabel(b.preferred_contact)}</TableCell>
                <TableCell title={b.message || ''} className="text-xs text-muted-foreground max-w-[120px] truncate">
                  {b.message ? (b.message.length > 40 ? b.message.slice(0, 40) + '...' : b.message) : '—'}
                </TableCell>
                <TableCell>{b.source}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[b.status] || ''}`}>{b.status}</span>
                </TableCell>
                <TableCell className="text-sm text-stone/60">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {STATUSES.filter(s => s !== b.status).map(s => (
                        <DropdownMenuItem key={s} onClick={() => updateStatus(b.id, s)} className="capitalize">Mark {s}</DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {bookings.length === 0 && <TableRow><TableCell colSpan={11} className="text-center text-stone/40 py-8">No bookings found</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="bg-white rounded-xl shadow-sm p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground">{b.name}</p>
                <p className="text-sm text-muted-foreground">{b.email}</p>
                <p className="text-sm text-muted-foreground">{b.phone}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[b.status] || ''}`}>{b.status}</span>
            </div>
            <p className="text-xs text-muted-foreground"><strong>Services:</strong> {(b.service_interest || []).map(formatService).join(', ') || '—'}</p>
            <p className="text-xs text-muted-foreground"><strong>Monthly Surplus:</strong> {b.monthly_income_range || '—'}</p>
            <div className="text-xs text-muted-foreground flex items-center gap-1"><strong>Connect Via:</strong> {connectLabel(b.preferred_contact)}</div>
            {b.message && <p className="text-xs text-muted-foreground"><strong>Notes:</strong> {b.message.length > 80 ? b.message.slice(0, 80) + '...' : b.message}</p>}
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{new Date(b.created_at).toLocaleDateString()}</p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                <DropdownMenuContent>
                  {STATUSES.filter(s => s !== b.status).map(s => (
                    <DropdownMenuItem key={s} onClick={() => updateStatus(b.id, s)} className="capitalize">Mark {s}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        {bookings.length === 0 && <p className="text-center text-stone/40 py-8">No bookings found</p>}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-stone/60">Page {page + 1} of {totalPages} ({total} total)</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
