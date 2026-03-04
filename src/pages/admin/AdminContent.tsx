import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ChevronRight, Plus, X, Trash2, Pencil } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import RichEditor from '@/components/admin/RichEditor';

const TYPES = ['story', 'glossary', 'guide', 'whatsapp_post'] as const;
const PAGE_SIZE = 20;

type ContentItem = {
  id: string;
  type: string;
  slug: string;
  title_en: string | null;
  title_or: string | null;
  preview_en: string | null;
  preview_or: string | null;
  body_en: string | null;
  body_or: string | null;
  category: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
};

const emptyItem = (): Partial<ContentItem> => ({
  type: 'story',
  slug: '',
  title_en: '',
  title_or: '',
  preview_en: '',
  preview_or: '',
  body_en: '',
  body_or: '',
  category: '',
  status: 'draft',
});

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const AdminContent = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Partial<ContentItem> | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingStage, setGeneratingStage] = useState<null | 'english' | 'odia'>(null);

  const fetchItems = useCallback(async () => {
    let query = supabase.from('content_items').select('*', { count: 'exact' });
    if (typeFilter !== 'all') query = query.eq('type', typeFilter);
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    if (search) query = query.ilike('title_en', `%${search}%`);
    query = query
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    const { data, count } = await query;
    setItems((data as ContentItem[]) ?? []);
    setTotal(count ?? 0);
  }, [typeFilter, statusFilter, search, page]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const handleSave = async (publish?: boolean) => {
    if (!editing) return;
    const item = { ...editing };
    if (publish) {
      item.status = 'published';
      item.published_at = new Date().toISOString();
    }
    const { id, created_at, ...rest } = item as any;
    if (id) {
      await supabase.from('content_items').update(rest).eq('id', id);
    } else {
      await supabase.from('content_items').insert(rest);
    }
    setEditing(null);
    fetchItems();
    toast.success(publish ? 'Published!' : 'Saved as draft');
  };

  const togglePublish = async (item: ContentItem) => {
    const newStatus = item.status === 'published' ? 'draft' : 'published';
    await supabase.from('content_items').update({
      status: newStatus,
      published_at: newStatus === 'published' ? new Date().toISOString() : null,
    }).eq('id', item.id);
    fetchItems();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from('content_items').delete().eq('id', deleteId);
    setDeleteId(null);
    fetchItems();
    toast.success('Deleted');
  };

  const handleGenerateContent = async () => {
    if (!aiPrompt.trim() || !editing) return;
    setGeneratingStage('english');
    const stageTimer = setTimeout(() => setGeneratingStage('odia'), 4000);
    try {
      const { data, error } = await supabase.functions.invoke('generate-content-item', {
        body: {
          type: editing.type,
          category: editing.category || '',
          slug: editing.slug || '',
          prompt: aiPrompt,
        },
      });
      if (error || !data) throw new Error(error?.message || 'Generation failed');
      setEditing(prev => ({
        ...prev!,
        title_en: data.title_en,
        title_or: data.title_or,
        preview_en: data.preview_en,
        preview_or: data.preview_or,
        body_en: data.body_en,
        body_or: data.body_or,
        slug: prev?.slug || slugify(data.title_en),
      }));
      setAiPrompt('');
      toast.success('Content generated — review and edit, then save');
    } catch (err: any) {
      toast.error(`Generation failed: ${err.message}`);
    } finally {
      clearTimeout(stageTimer);
      setGeneratingStage(null);
    }
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Content</h1>
        <Button onClick={() => { setEditing(emptyItem()); setAiPrompt(''); }} className="bg-saffron hover:bg-saffron/90 text-white">
          <Plus className="h-4 w-4 mr-2" /> New Content
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setPage(0); }}>
          <SelectTrigger className="w-48 bg-white"><SelectValue placeholder="Type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace('_', ' ')}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0); }}>
          <SelectTrigger className="w-40 bg-white"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
        <Input
          placeholder="Search title..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="max-w-xs bg-white"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title (EN)</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="max-w-[240px]">
                  <p className="truncate font-medium">{item.title_en || '—'}</p>
                  {item.preview_en && (
                    <p className="text-xs text-stone/40 truncate mt-0.5">{item.preview_en}</p>
                  )}
                </TableCell>
                <TableCell className="capitalize">{item.type.replace('_', ' ')}</TableCell>
                <TableCell>{item.category || '—'}</TableCell>
                <TableCell>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    item.status === 'published'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-stone/10 text-stone/50'
                  }`}>
                    {item.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-stone/60">
                  {item.published_at ? new Date(item.published_at).toLocaleDateString() : '—'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(item); setAiPrompt(''); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => togglePublish(item)}>
                      <span className="text-xs">{item.status === 'published' ? 'Unpub' : 'Pub'}</span>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-stone/40 py-8">No content found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-stone/60">Page {page + 1} of {totalPages}</p>
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

      {/* Slide-over */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setEditing(null)} />
          <div className="relative w-full max-w-[920px] bg-white shadow-xl overflow-y-auto p-6 space-y-5">

            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold font-heading">{editing.id ? 'Edit Content' : 'New Content'}</h2>
              <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
            </div>

            {/* Type + Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-stone/50 uppercase tracking-wide">Type</Label>
                <Select value={editing.type} onValueChange={(v) => setEditing({ ...editing, type: v })}>
                  <SelectTrigger className="bg-white mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {TYPES.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace('_', ' ')}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-stone/50 uppercase tracking-wide">Category</Label>
                <Input
                  value={editing.category || ''}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="mt-1"
                  placeholder="e.g. Mutual Funds, Insurance…"
                />
              </div>
            </div>

            {/* Slug + Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-stone/50 uppercase tracking-wide">Slug</Label>
                <Input
                  value={editing.slug || ''}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  className="mt-1 font-mono text-sm"
                  placeholder="url-safe-slug"
                />
              </div>
              <div className="flex items-end gap-2 pb-1">
                <Switch
                  checked={editing.status === 'published'}
                  onCheckedChange={(checked) => setEditing({ ...editing, status: checked ? 'published' : 'draft' })}
                />
                <Label>{editing.status === 'published' ? 'Published' : 'Draft'}</Label>
              </div>
            </div>

            {/* AI Generation */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-purple-800">✨ Generate with AI</span>
                <span className="text-xs text-purple-400">Gemini 2.5 Flash · two sequential calls · EN then OR</span>
              </div>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe what this content should cover. Be specific — mention the target audience, key concepts, Odisha places, rupee amounts you want included…"
                className="w-full text-sm p-3 rounded-lg border border-purple-200 outline-none focus:border-purple-400 bg-white resize-none min-h-[72px] font-body"
              />
              <button
                onClick={handleGenerateContent}
                disabled={generatingStage !== null || !aiPrompt.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50 transition-opacity"
                style={{ background: '#7C3AED' }}
              >
                {generatingStage === 'english'
                  ? <><span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating English…</>
                  : generatingStage === 'odia'
                  ? <><span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating Odia…</>
                  : '✨ Generate EN + OR Content'
                }
              </button>
            </div>

            {/* Titles */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-stone/50 uppercase tracking-wide">Title (EN)</Label>
                <Input
                  value={editing.title_en || ''}
                  onChange={(e) => setEditing({
                    ...editing,
                    title_en: e.target.value,
                    slug: editing.slug || slugify(e.target.value),
                  })}
                  className="mt-1"
                  placeholder="English title"
                />
              </div>
              <div>
                <Label className="text-xs text-stone/50 uppercase tracking-wide">Title (OR)</Label>
                <Input
                  value={editing.title_or || ''}
                  onChange={(e) => setEditing({ ...editing, title_or: e.target.value })}
                  className="mt-1"
                  style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}
                  placeholder="ଓଡ଼ିଆ ଶୀର୍ଷକ"
                />
              </div>
            </div>

            {/* Previews */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-stone/50 uppercase tracking-wide">
                  Preview (EN) <span className="font-normal normal-case text-stone/30">· card teaser, max 120 chars</span>
                </Label>
                <Input
                  value={editing.preview_en || ''}
                  onChange={(e) => setEditing({ ...editing, preview_en: e.target.value })}
                  className="mt-1"
                  placeholder="One punchy sentence with a rupee amount…"
                  maxLength={120}
                />
              </div>
              <div>
                <Label className="text-xs text-stone/50 uppercase tracking-wide">
                  Preview (OR) <span className="font-normal normal-case text-stone/30">· max 120 chars</span>
                </Label>
                <Input
                  value={editing.preview_or || ''}
                  onChange={(e) => setEditing({ ...editing, preview_or: e.target.value })}
                  className="mt-1"
                  style={{ fontFamily: "'Noto Sans Oriya', sans-serif" }}
                  placeholder="ଓଡ଼ିଆ ସଂକ୍ଷିପ୍ତ…"
                  maxLength={120}
                />
              </div>
            </div>

            {/* Rich editors side by side */}
            <div className="grid grid-cols-2 gap-4">
              <RichEditor
                label="Body · English"
                value={editing.body_en || ''}
                onChange={(html) => setEditing({ ...editing, body_en: html })}
                placeholder="Write or generate English content…"
              />
              <RichEditor
                label="Body · Odia"
                value={editing.body_or || ''}
                onChange={(html) => setEditing({ ...editing, body_or: html })}
                placeholder="ଓଡ଼ିଆ ବିଷୟବସ୍ତୁ ଲେଖନ୍ତୁ…"
                isOdia
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t border-stone/10">
              <Button variant="outline" onClick={() => handleSave(false)}>Save Draft</Button>
              <Button onClick={() => handleSave(true)} className="bg-saffron hover:bg-saffron/90 text-white">
                Publish
              </Button>
            </div>

          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Content</DialogTitle>
            <DialogDescription>Are you sure you want to delete this content item? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminContent;
