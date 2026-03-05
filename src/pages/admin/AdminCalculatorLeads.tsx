import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 20;

const TYPE_STYLES: Record<string, string> = {
  home: 'bg-blue-light text-blue',
  education: 'bg-green-light text-green',
  retirement: 'bg-saffron/10 text-saffron',
  wealth: 'bg-stone/10 text-stone',
};

const TYPE_LABELS: Record<string, string> = {
  home: 'Home',
  education: 'Education',
  retirement: 'Retirement',
  wealth: 'Wealth',
};

const FILTER_TYPES = ['all', 'home', 'education', 'retirement', 'wealth'] as const;
type FilterType = typeof FILTER_TYPES[number];

const formatSIP = (n: number | null) => {
  if (!n) return '—';
  return `₹${n.toLocaleString('en-IN')}`;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const TypeBadge = ({ type }: { type: string | null }) => {
  const key = type ?? '';
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${TYPE_STYLES[key] ?? 'bg-stone/10 text-stone/60'}`}>
      {TYPE_LABELS[key] ?? type ?? '—'}
    </span>
  );
};

const AdminCalculatorLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');

  const fetchLeads = useCallback(async () => {
    let query = supabase
      .from('calculator_leads')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (typeFilter !== 'all') {
      query = (query as any).eq('calculator_type', typeFilter);
    }

    const { data, count } = await query;
    setLeads(data ?? []);
    setTotal(count ?? 0);
  }, [page, typeFilter]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Calculator Leads</h1>
        <span className="text-sm text-stone/60">{total} lead{total !== 1 ? 's' : ''}</span>
      </div>

      {/* Type filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {FILTER_TYPES.map(t => (
          <button
            key={t}
            onClick={() => { setTypeFilter(t); setPage(0); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              typeFilter === t
                ? 'bg-stone text-white'
                : 'bg-white text-stone/70 border border-stone/20 hover:border-stone/40'
            }`}
          >
            {t === 'all' ? 'All' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Goal</TableHead>
              <TableHead>Monthly SIP</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((l) => (
              <TableRow key={l.id}>
                <TableCell><TypeBadge type={(l as any).calculator_type ?? null} /></TableCell>
                <TableCell>{(l as any).lead_name || '—'}</TableCell>
                <TableCell>
                  <span className="block">{l.phone || '—'}</span>
                  {l.email && <span className="block text-xs text-stone/50">{l.email}</span>}
                </TableCell>
                <TableCell className="max-w-[200px] truncate">{l.target_institution || '—'}</TableCell>
                <TableCell className="font-heading font-semibold">{formatSIP(l.monthly_sip_needed)}</TableCell>
                <TableCell className="text-sm text-stone/60 whitespace-nowrap">{formatDate(l.created_at)}</TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-stone/40 py-12">
                  No leads yet. Calculator submissions will appear here.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {leads.length === 0 && (
          <p className="text-center text-stone/40 py-12 bg-white rounded-xl">
            No leads yet. Calculator submissions will appear here.
          </p>
        )}
        {leads.map((l) => (
          <div key={l.id} className="bg-white rounded-xl p-4 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <TypeBadge type={(l as any).calculator_type ?? null} />
              <span className="text-xs text-stone/50">{formatDate(l.created_at)}</span>
            </div>
            <p className="font-heading font-semibold text-foreground">{(l as any).lead_name || '—'}</p>
            <p className="text-sm text-stone/70">
              {l.phone || '—'}
              {l.email && <span className="block text-xs text-stone/50">{l.email}</span>}
            </p>
            <p className="text-sm text-muted-foreground truncate">{l.target_institution || '—'}</p>
            <p className="font-heading font-semibold text-green">{formatSIP(l.monthly_sip_needed)}/mo</p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-stone/60">Page {page + 1} of {totalPages} ({total} total)</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCalculatorLeads;
