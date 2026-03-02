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

const AdminBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchBookings = useCallback(async () => {
    let query = supabase.from('bookings').select('*', { count: 'exact' });
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
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Service Interest</TableHead>
              <TableHead>Income Range</TableHead>
              <TableHead>Language</TableHead>
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
                <TableCell>{b.service_interest?.join(', ') || '-'}</TableCell>
                <TableCell>{b.monthly_income_range || '-'}</TableCell>
                <TableCell>{b.preferred_language}</TableCell>
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
            {bookings.length === 0 && <TableRow><TableCell colSpan={10} className="text-center text-stone/40 py-8">No bookings found</TableCell></TableRow>}
          </TableBody>
        </Table>
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
