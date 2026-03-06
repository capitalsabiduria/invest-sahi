import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

const STATUSES = ['new', 'contacted', 'converted'] as const;

const formatCorpus = (val: number) => {
  if (val >= 10000000) return `₹${val / 10000000} Crore`;
  if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
  return `₹${val.toLocaleString('en-IN')}`;
};

const statusColors: Record<string, string> = {
  new: 'bg-stone/10 text-stone',
  contacted: 'bg-amber-100 text-amber-700',
  converted: 'bg-green-100 text-green-700',
};

const connectLabel = (val: string) => {
  if (val === 'whatsapp') return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">WhatsApp</span>;
  if (val === 'call') return <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Call</span>;
  return <span>{val || '—'}</span>;
};

const CrorePlanLeadsTab = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from('crore_plan_leads')
      .select('*')
      .order('created_at', { ascending: false });
    setLeads(data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateStatus = async (id: string, newStatus: string) => {
    await (supabase as any).from('crore_plan_leads').update({ status: newStatus }).eq('id', id);
    fetchLeads();
  };

  const deleteLead = async (id: string) => {
    await (supabase as any).from('crore_plan_leads').delete().eq('id', id);
    fetchLeads();
  };

  const exportCSV = () => {
    if (!leads.length) return;
    const headers = [
      'Name', 'Phone', 'Age', 'Monthly Investment', 'Target Corpus',
      'Years to Goal', 'Projected Corpus', 'Connect Via', 'Status', 'Source', 'Date'
    ];
    const rows = leads.map((l) => [
      l.name || '',
      l.phone || '',
      l.current_age ?? '',
      l.monthly_investment ? `₹${Number(l.monthly_investment).toLocaleString('en-IN')}` : '',
      l.target_corpus ? formatCorpus(Number(l.target_corpus)) : '',
      l.years_to_goal ?? '',
      l.projected_corpus ? `₹${Number(l.projected_corpus).toLocaleString('en-IN')}` : '',
      l.preferred_contact || '',
      l.status || '',
      l.source || '',
      l.created_at ? new Date(l.created_at).toLocaleString('en-IN') : '',
    ]);
    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crore-plan-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalLeads = leads.length;
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const leadsThisWeek = leads.filter((l) => new Date(l.created_at) >= oneWeekAgo).length;
  const targetCounts: Record<string, number> = {};
  leads.forEach((l) => {
    if (l.target_corpus != null) {
      const key = formatCorpus(Number(l.target_corpus));
      targetCounts[key] = (targetCounts[key] || 0) + 1;
    }
  });
  const mostCommonTarget = Object.entries(targetCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Crore Plan Leads</h1>
        <Button variant="outline" onClick={exportCSV} className="flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 1v9M5 7l3 3 3-3M2 11v2a1 1 0 001 1h10a1 1 0 001-1v-2"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
          Export CSV
        </Button>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border text-center">
          <p className="text-2xl font-heading font-bold text-foreground">{totalLeads}</p>
          <p className="text-xs text-muted-foreground mt-1">Total Leads</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border text-center">
          <p className="text-2xl font-heading font-bold text-foreground">{leadsThisWeek}</p>
          <p className="text-xs text-muted-foreground mt-1">This Week</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-border text-center">
          <p className="text-2xl font-heading font-bold text-foreground">{mostCommonTarget}</p>
          <p className="text-xs text-muted-foreground mt-1">Top Target</p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Monthly Investment</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Years to Goal</TableHead>
              <TableHead>Connect Via</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{l.name || '—'}</TableCell>
                <TableCell>{l.phone || '—'}</TableCell>
                <TableCell>{l.current_age ?? '—'}</TableCell>
                <TableCell>
                  {l.monthly_investment != null
                    ? `₹${Number(l.monthly_investment).toLocaleString('en-IN')}`
                    : '—'}
                </TableCell>
                <TableCell>
                  {l.target_corpus != null ? formatCorpus(Number(l.target_corpus)) : '—'}
                </TableCell>
                <TableCell>{l.years_to_goal ?? '—'}</TableCell>
                <TableCell>{connectLabel(l.preferred_contact)}</TableCell>
                <TableCell>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[l.status] || ''}`}
                  >
                    {l.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-stone/60">
                  {l.created_at ? new Date(l.created_at).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {STATUSES.filter((s) => s !== l.status).map((s) => (
                        <DropdownMenuItem
                          key={s}
                          onClick={() => updateStatus(l.id, s)}
                          className="capitalize"
                        >
                          Mark {s}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuItem
                        onClick={() => deleteLead(l.id)}
                        className="text-red-600"
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-stone/40 py-8">
                  No leads found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-4">
        {leads.map((l) => (
          <div key={l.id} className="bg-white rounded-xl shadow-sm p-4 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-foreground">{l.name || '—'}</p>
                <p className="text-sm text-muted-foreground">{l.phone}</p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${statusColors[l.status] || ''}`}
              >
                {l.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              <strong>Age:</strong> {l.current_age ?? '—'}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Monthly:</strong>{' '}
              {l.monthly_investment != null
                ? `₹${Number(l.monthly_investment).toLocaleString('en-IN')}`
                : '—'}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Target:</strong>{' '}
              {l.target_corpus != null ? formatCorpus(Number(l.target_corpus)) : '—'}
            </p>
            <p className="text-xs text-muted-foreground">
              <strong>Years to Goal:</strong> {l.years_to_goal ?? '—'}
            </p>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <strong>Connect Via:</strong> {connectLabel(l.preferred_contact)}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {l.created_at ? new Date(l.created_at).toLocaleDateString() : '—'}
              </p>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {STATUSES.filter((s) => s !== l.status).map((s) => (
                    <DropdownMenuItem
                      key={s}
                      onClick={() => updateStatus(l.id, s)}
                      className="capitalize"
                    >
                      Mark {s}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem onClick={() => deleteLead(l.id)} className="text-red-600">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
        {leads.length === 0 && !loading && (
          <p className="text-center text-stone/40 py-8">No leads found</p>
        )}
      </div>
    </div>
  );
};

export default CrorePlanLeadsTab;
