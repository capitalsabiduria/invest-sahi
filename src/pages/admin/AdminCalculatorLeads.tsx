import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PAGE_SIZE = 20;

const AdminCalculatorLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);

  const fetchLeads = useCallback(async () => {
    const { data, count } = await supabase.from('calculator_leads').select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    setLeads(data ?? []);
    setTotal(count ?? 0);
  }, [page]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div>
      <h1 className="text-2xl font-bold font-heading mb-6">Calculator Leads</h1>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Child Age</TableHead>
              <TableHead>Institution</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>SIP Needed</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{l.email || '-'}</TableCell>
                <TableCell>{l.phone || '-'}</TableCell>
                <TableCell>{l.child_age ?? '-'}</TableCell>
                <TableCell>{l.target_institution || '-'}</TableCell>
                <TableCell>{l.user_monthly_budget ? `₹${l.user_monthly_budget}` : '-'}</TableCell>
                <TableCell>{l.monthly_sip_needed ? `₹${l.monthly_sip_needed}` : '-'}</TableCell>
                <TableCell className="text-sm text-stone/60">{new Date(l.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
            {leads.length === 0 && <TableRow><TableCell colSpan={7} className="text-center text-stone/40 py-8">No leads yet</TableCell></TableRow>}
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

export default AdminCalculatorLeads;
