import { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Pencil, Trash2, Copy, ChevronLeft, ChevronRight, X, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/* ── Types ─────────────────────────────────────────────────── */

type PageType = 'district' | 'institution' | 'service' | 'community';

interface PageVersion {
  id: string;
  language: string;
  audience_style: string;
  url_suffix: string;
  status: string;
  content: any;
  view_count: number;
  updated_at: string;
}

interface SeoPage {
  id: string;
  slug: string;
  title: string;
  meta_description: string;
  type: PageType;
  keywords: string[];
  versions: PageVersion[];
}

interface PageForm {
  type: PageType;
  slug: string;
  title: string;
  meta_description: string;
  keywords: string[];
  keywordInput: string;
}

/* ── Helper utilities ──────────────────────────────────────── */

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
}

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug);
}

/* ── Badge helpers ─────────────────────────────────────────── */

const TYPE_COLORS: Record<PageType, string> = {
  district: '#1A6B9A',
  institution: '#E8820C',
  service: '#1B6B3A',
  community: '#2C1810',
};

const TypeBadge = ({ type }: { type: PageType }) => (
  <span
    className="inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize text-white"
    style={{ background: TYPE_COLORS[type] }}
  >
    {type}
  </span>
);

/* ── Form helpers ──────────────────────────────────────────── */

const emptyForm = (): PageForm => ({
  type: 'district',
  slug: '',
  title: '',
  meta_description: '',
  keywords: [],
  keywordInput: '',
});

const PAGE_TYPES: PageType[] = ['district', 'institution', 'service', 'community'];
const PER_PAGE = 20;

/* ── Sub-components ────────────────────────────────────────── */

const StatMini = ({ label, value, color }: { label: string; value: number | string; color?: string }) => (
  <div className="bg-white rounded-xl p-4 shadow-sm">
    <p className="text-2xl font-bold font-heading" style={color ? { color } : undefined}>{value}</p>
    <p className="text-xs text-stone/50 mt-0.5">{label}</p>
  </div>
);

/* ── Page form modal ────────────────────────────────────────── */

const PageFormModal = ({
  open,
  onClose,
  onSave,
  initial,
  editSlug,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (form: PageForm) => Promise<void>;
  initial: PageForm;
  editSlug?: string;
}) => {
  const [form, setForm] = useState<PageForm>(initial);
  const [saving, setSaving] = useState(false);
  const [slugError, setSlugError] = useState('');
  const { toast: uiToast } = useToast();

  useEffect(() => { if (open) setForm(initial); }, [open, initial]);

  const set = <K extends keyof PageForm>(k: K, v: PageForm[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const addKeyword = () => {
    const kw = form.keywordInput.trim();
    if (!kw || form.keywords.length >= 5 || form.keywords.includes(kw)) return;
    set('keywords', [...form.keywords, kw]);
    set('keywordInput', '');
  };

  const removeKeyword = (kw: string) =>
    set('keywords', form.keywords.filter((k) => k !== kw));

  const handleSave = async () => {
    if (!form.title.trim()) { uiToast({ title: 'Title required', variant: 'destructive' }); return; }
    if (!form.slug.trim()) { uiToast({ title: 'Slug required', variant: 'destructive' }); return; }
    if (!isValidSlug(form.slug)) {
      setSlugError('Slug must be lowercase letters, numbers, and hyphens only');
      return;
    }
    setSlugError('');
    setSaving(true);
    try {
      await onSave(form);
    } finally {
      setSaving(false);
    }
  };

  const liveUrl = `investsahi.in/en/${form.slug}`;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading">{editSlug ? 'Edit Page' : 'Add New Page'}</DialogTitle>
        </DialogHeader>

        {/* Type selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone/60 uppercase tracking-wide">Page Type</label>
          <div className="flex flex-wrap gap-2">
            {PAGE_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => set('type', t)}
                className="text-sm px-3 py-1.5 rounded-full border transition-all capitalize"
                style={
                  form.type === t
                    ? { background: TYPE_COLORS[t], color: 'white', borderColor: TYPE_COLORS[t] }
                    : { borderColor: '#D1D5DB', color: '#6B7280' }
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Slug */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone/60 uppercase tracking-wide">Slug</label>
          <Input
            value={form.slug}
            onChange={(e) => { set('slug', e.target.value.toLowerCase()); setSlugError(''); }}
            placeholder="use-hyphens-lowercase"
            disabled={!!editSlug}
            className="font-mono text-sm"
          />
          {slugError && <p className="text-xs text-red-500">{slugError}</p>}
          {editSlug && (
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs text-stone/50 flex-1 truncate">{liveUrl}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(liveUrl); }}
                className="text-xs text-stone/50 hover:text-stone"
              >
                <Copy size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-stone/60 uppercase tracking-wide">Title</label>
            <span className="text-xs text-stone/40">{form.title.length}/60</span>
          </div>
          <Input
            value={form.title}
            onChange={(e) => set('title', e.target.value.slice(0, 60))}
            placeholder="Page title (SEO-optimised)"
          />
        </div>

        {/* Meta description */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-stone/60 uppercase tracking-wide">Meta Description</label>
            <span className="text-xs text-stone/40">{form.meta_description.length}/160</span>
          </div>
          <Textarea
            value={form.meta_description}
            onChange={(e) => set('meta_description', e.target.value.slice(0, 160))}
            placeholder="Brief description for search engines"
            rows={3}
          />
        </div>

        {/* Keywords */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-stone/60 uppercase tracking-wide">
            Keywords <span className="font-normal">(max 5, comma-separated)</span>
          </label>
          <div className="flex gap-2">
            <Input
              value={form.keywordInput}
              onChange={(e) => set('keywordInput', e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addKeyword(); } }}
              placeholder="Add keyword and press Enter"
              disabled={form.keywords.length >= 5}
            />
            <button
              onClick={addKeyword}
              disabled={form.keywords.length >= 5}
              className="text-sm px-3 rounded-lg bg-stone text-white disabled:opacity-40"
            >
              Add
            </button>
          </div>
          {form.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {form.keywords.map((kw) => (
                <span
                  key={kw}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-sand text-stone"
                >
                  {kw}
                  <button onClick={() => removeKeyword(kw)} className="hover:text-red-500"><X size={10} /></button>
                </span>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 mt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-stone/60 hover:bg-stone/10">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
            style={{ background: '#E8820C' }}
          >
            {saving ? 'Saving…' : 'Save as Draft'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ── Delete modal ───────────────────────────────────────────── */

const DeleteModal = ({
  page,
  onClose,
  onConfirm,
}: {
  page: SeoPage | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) => {
  const [deleting, setDeleting] = useState(false);
  return (
    <Dialog open={!!page} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading text-red-600">Delete Page</DialogTitle>
        </DialogHeader>
        <p className="font-body text-sm text-stone/70">
          Are you sure you want to delete{' '}
          <code className="font-mono text-xs bg-stone/10 px-1 rounded">/en/{page?.slug}</code>?{' '}
          This cannot be undone.
        </p>
        <DialogFooter className="gap-2 mt-2">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-stone/60 hover:bg-stone/10">
            Cancel
          </button>
          <button
            onClick={async () => { setDeleting(true); await onConfirm(); setDeleting(false); }}
            disabled={deleting}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60"
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ── Generate dropdown ──────────────────────────────────────── */

const GENERATE_OPTIONS = [
  { label: '🇬🇧 Generate English', lang: 'en', style: 'standard' },
  { label: '🔤 Generate Odia (Urban)', lang: 'or', style: 'mixed' },
  { label: '📜 Generate Odia (Formal)', lang: 'or', style: 'pure_odia' },
  { label: '⚡ Generate All 3', lang: 'all', style: '' },
] as const;

const GenerateDropdown = ({
  page,
  generatingId,
  onGenerate,
}: {
  page: SeoPage;
  generatingId: string | null;
  onGenerate: (page: SeoPage, lang: string, style: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isPageGenerating = generatingId !== null && generatingId.startsWith(page.id + '-');

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        disabled={generatingId !== null}
        title="Generate AI content"
        className="flex items-center gap-0.5 p-1.5 rounded hover:bg-purple-50 disabled:opacity-40 transition-colors"
        style={{ color: isPageGenerating ? '#6B21A8' : '#9333EA' }}
      >
        {isPageGenerating
          ? <span className="inline-block w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
          : <Sparkles size={14} />}
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 bg-white rounded-xl shadow-lg border border-stone/10 py-1 min-w-[190px]">
          {GENERATE_OPTIONS.map(opt => (
            <button
              key={opt.label}
              onClick={() => { setOpen(false); onGenerate(page, opt.lang, opt.style); }}
              disabled={generatingId !== null}
              className="w-full text-left px-4 py-2 text-sm hover:bg-stone/5 disabled:opacity-40 transition-colors"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main SeoManager ────────────────────────────────────────── */

type LangFilter = 'all' | 'en' | 'or-mixed' | 'or-pure_odia';

const SeoManager = () => {
  const { toast: uiToast } = useToast();

  /* data */
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  /* filters */
  const [typeFilter, setTypeFilter] = useState<'all' | PageType>('all');
  const [langFilter, setLangFilter] = useState<LangFilter>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  /* modals */
  const [showAdd, setShowAdd] = useState(false);
  const [editPage, setEditPage] = useState<SeoPage | null>(null);
  const [deletePage, setDeletePage] = useState<SeoPage | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);

  /* ── fetch ── */
  const fetchPages = useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    const { data, error } = await supabase
      .from('seo_pages' as any)
      .select(`
        id, slug, title, meta_description, type, keywords,
        page_versions (
          id, language, audience_style, url_suffix,
          status, content, view_count, updated_at
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SeoManager] fetch failed:', error);
      setFetchError(`${error.message} (code: ${error.code})`);
      setPages([]);
    } else {
      const mapped = ((data as any[]) || []).map(p => ({
        ...p,
        versions: p.page_versions || [],
      }));
      setPages(mapped as SeoPage[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPages(); }, [fetchPages]);

  /* ── derived stats ── */
  const totalSlugs = pages.length;
  const liveEN = pages.reduce((sum, p) =>
    sum + p.versions.filter(v => v.language === 'en' && v.status === 'live').length, 0);
  const liveOdia = pages.reduce((sum, p) =>
    sum + p.versions.filter(v => v.language === 'or' && v.status === 'live').length, 0);
  const pendingReview = pages.reduce((sum, p) =>
    sum + p.versions.filter(v => v.status === 'pending_review').length, 0);

  /* ── filtered + paginated ── */
  const filtered = pages.filter((p) => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;
    if (langFilter !== 'all') {
      const [lang, style] = langFilter === 'en'
        ? ['en', 'standard']
        : langFilter === 'or-mixed'
          ? ['or', 'mixed']
          : ['or', 'pure_odia'];
      if (!p.versions.some(v => v.language === lang && v.audience_style === style)) return false;
    }
    if (search) {
      const q = search.toLowerCase();
      if (!p.slug.includes(q) && !p.title.toLowerCase().includes(q)) return false;
    }
    return true;
  });
  const totalFiltered = filtered.length;
  const pageCount = Math.ceil(totalFiltered / PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  /* reset to page 1 on filter change */
  useEffect(() => { setCurrentPage(1); }, [typeFilter, langFilter, search]);

  /* ── copy slug ── */
  const copySlug = (slug: string) => {
    navigator.clipboard.writeText(`/en/${slug}`);
    uiToast({ title: 'Copied!', description: `/en/${slug}` });
  };

  /* ── add page ── */
  const handleAdd = async (form: PageForm) => {
    const { data: newPage, error } = await supabase.from('seo_pages' as any).insert({
      slug: form.slug,
      title: form.title,
      meta_description: form.meta_description,
      type: form.type,
      keywords: form.keywords,
      status: 'draft',
    }).select('id').single();

    if (error || !newPage) {
      uiToast({ title: 'Save failed', description: error?.message, variant: 'destructive' });
      return;
    }

    // Create 3 version rows (draft, no content)
    const versionRows = [
      { page_id: (newPage as any).id, language: 'en', audience_style: 'standard', url_suffix: `/en/${form.slug}`, status: 'draft' },
      { page_id: (newPage as any).id, language: 'or', audience_style: 'mixed', url_suffix: `/or/${form.slug}`, status: 'draft' },
      { page_id: (newPage as any).id, language: 'or', audience_style: 'pure_odia', url_suffix: `/or/${form.slug}-odia`, status: 'draft' },
    ];
    await supabase.from('page_versions' as any).insert(versionRows);

    uiToast({ title: 'Page created', description: `/en/${form.slug}` });
    setShowAdd(false);
    fetchPages();
  };

  /* ── edit page ── */
  const handleEdit = async (form: PageForm) => {
    if (!editPage) return;
    const { error } = await supabase.from('seo_pages' as any).update({
      title: form.title,
      meta_description: form.meta_description,
      type: form.type,
      keywords: form.keywords,
    }).eq('id', editPage.id);
    if (error) {
      uiToast({ title: 'Update failed', description: error.message, variant: 'destructive' });
      return;
    }
    uiToast({ title: 'Page updated' });
    setEditPage(null);
    fetchPages();
  };

  /* ── delete page ── */
  const handleDelete = async () => {
    if (!deletePage) return;
    const { error } = await supabase.from('seo_pages' as any).delete().eq('id', deletePage.id);
    if (error) {
      uiToast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
      return;
    }
    uiToast({ title: 'Page deleted', description: `/en/${deletePage.slug}` });
    setDeletePage(null);
    setPages((prev) => prev.filter((p) => p.id !== deletePage.id));
  };

  /* ── version status toggle ── */
  async function handleVersionStatusToggle(
    pageId: string,
    versionId: string | undefined,
    language: string,
    audience_style: string,
    currentStatus: string,
  ) {
    const cycle: Record<string, string> = { draft: 'pending_review', pending_review: 'live', live: 'draft' };
    const nextStatus = cycle[currentStatus];

    if (nextStatus === 'live' && language === 'or') {
      toast('Ensure this Odia page has been reviewed by a native speaker before going live.', { icon: '⚠️' });
    }

    if (!versionId) return;

    await supabase
      .from('page_versions' as any)
      .update({ status: nextStatus })
      .eq('id', versionId);

    await fetchPages();
    toast.success(`${language.toUpperCase()} version → ${nextStatus}`);
  }

  /* ── generate content ── */
  async function generateSingleVersion(page: SeoPage, language: string, audience_style: string) {
    const key = `${page.id}-${language}-${audience_style}`;
    setGeneratingId(key);
    try {
      const { data, error } = await supabase.functions.invoke('generate-seo-content', {
        body: {
          type: page.type,
          slug: page.slug,
          title: page.title,
          meta_description: page.meta_description,
          keywords: page.keywords,
          language,
          audience_style,
        },
      });

      if (error || !data?.content) throw new Error(error?.message || 'Generation failed');

      const version = page.versions.find(v => v.language === language && v.audience_style === audience_style);
      if (!version) throw new Error('Version row not found');

      await supabase
        .from('page_versions' as any)
        .update({ content: data.content, updated_at: new Date().toISOString() })
        .eq('id', version.id);

      const label = language === 'en' ? 'English' : audience_style === 'mixed' ? 'Odia (Urban)' : 'Odia (Formal)';
      toast.success(`${label} version generated`);
      await fetchPages();
    } catch (err: any) {
      toast.error(`Generation failed: ${err.message}`);
    } finally {
      setGeneratingId(null);
    }
  }

  async function handleGenerate(page: SeoPage, language: string, audience_style: string) {
    if (language === 'all') {
      const versions = [
        { lang: 'en', style: 'standard' },
        { lang: 'or', style: 'mixed' },
        { lang: 'or', style: 'pure_odia' },
      ];
      for (const v of versions) {
        await generateSingleVersion(page, v.lang, v.style);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      toast.success('All 3 versions generated');
    } else {
      await generateSingleVersion(page, language, audience_style);
    }
  }

  /* ── form initial for edit ── */
  const editFormInit = editPage
    ? {
        type: editPage.type,
        slug: editPage.slug,
        title: editPage.title,
        meta_description: editPage.meta_description,
        keywords: editPage.keywords ?? [],
        keywordInput: '',
      }
    : emptyForm();

  /* ── version badges ── */
  const VERSION_DEFS = [
    { lang: 'en', style: 'standard', label: 'EN' },
    { lang: 'or', style: 'mixed', label: 'OR' },
    { lang: 'or', style: 'pure_odia', label: 'OR+' },
  ] as const;

  const versionStatusColor = (status: string | undefined) => ({
    live: 'bg-green-100 text-green-700 border-green-200',
    pending_review: 'bg-amber-100 text-amber-700 border-amber-200',
    draft: 'bg-gray-100 text-gray-500 border-gray-200',
  }[status ?? 'draft'] ?? 'bg-gray-100 text-gray-500 border-gray-200');

  /* ── render ── */
  return (
    <div>
      {/* Header row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold font-heading">SEO Pages</h2>
          <p className="text-sm text-stone/50 mt-0.5">Manage programmatic landing pages</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
          style={{ background: '#E8820C' }}
        >
          + Add New Page
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatMini label="Total Slugs" value={totalSlugs} />
        <StatMini label="Live EN" value={liveEN} color="#1B6B3A" />
        <StatMini label="Live Odia" value={liveOdia} color="#1A6B9A" />
        <StatMini label="Pending Review" value={pendingReview} color="#D97706" />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
        {/* Type filter */}
        <div className="flex gap-1.5 flex-wrap">
          {(['all', ...PAGE_TYPES] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className="text-xs px-3 py-1.5 rounded-full border capitalize transition-all"
              style={
                typeFilter === t
                  ? { background: t === 'all' ? '#2C1810' : TYPE_COLORS[t as PageType], color: 'white', borderColor: 'transparent' }
                  : { borderColor: '#D1D5DB', color: '#6B7280' }
              }
            >
              {t}
            </button>
          ))}
        </div>

        {/* Language filter */}
        <div className="flex gap-1.5 flex-wrap">
          {([
            { value: 'all', label: 'All' },
            { value: 'en', label: 'English' },
            { value: 'or-mixed', label: 'Odia Urban' },
            { value: 'or-pure_odia', label: 'Odia Formal' },
          ] as const).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setLangFilter(value)}
              className="text-xs px-3 py-1.5 rounded-full border transition-all"
              style={
                langFilter === value
                  ? { background: '#1A6B9A', color: 'white', borderColor: 'transparent' }
                  : { borderColor: '#D1D5DB', color: '#6B7280' }
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search slug or title…"
          className="ml-auto text-sm px-3 py-1.5 rounded-lg border border-stone/20 outline-none focus:border-saffron font-body"
        />
      </div>

      {/* Fetch error banner */}
      {fetchError && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-body text-red-700">
          <strong className="font-semibold">Data fetch failed:</strong> {fetchError}
          <br />
          <span className="text-xs text-red-500 mt-1 block">
            Check Supabase RLS policies — the anon role may not have SELECT on seo_pages. See browser console for full error.
          </span>
          <button
            onClick={fetchPages}
            className="mt-2 text-xs underline hover:no-underline text-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table — desktop */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-stone/40 font-body text-sm">Loading…</div>
        ) : paginated.length === 0 ? (
          <div className="py-16 text-center text-stone/40 font-body text-sm">No pages found</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone/10 text-xs text-stone/50 uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Slug</th>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Versions</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((page) => (
                <tr key={page.id} className="border-b border-stone/5 hover:bg-stone/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <TypeBadge type={page.type} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => copySlug(page.slug)}
                      className="font-mono text-xs text-stone/60 hover:text-saffron transition-colors flex items-center gap-1"
                      title="Click to copy"
                    >
                      /en/{page.slug}
                      <Copy size={10} className="opacity-40" />
                    </button>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <span className="font-body text-stone truncate block" title={page.title}>
                      {page.title.length > 55 ? page.title.slice(0, 55) + '…' : page.title}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {VERSION_DEFS.map(({ lang, style, label }) => {
                        const version = page.versions.find(v => v.language === lang && v.audience_style === style);
                        return (
                          <button
                            key={label}
                            onClick={() => handleVersionStatusToggle(page.id, version?.id, lang, style, version?.status ?? 'draft')}
                            className={`text-xs font-bold px-2 py-1 rounded-full border transition-colors ${versionStatusColor(version?.status)}`}
                            title={`${label}: ${version?.status ?? 'draft'}`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <GenerateDropdown
                        page={page}
                        generatingId={generatingId}
                        onGenerate={handleGenerate}
                      />
                      <button
                        onClick={() => setEditPage(page)}
                        className="p-1.5 rounded hover:bg-stone/10 text-stone/50 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeletePage(page)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Card list — mobile */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <p className="text-center py-10 text-stone/40 text-sm">Loading…</p>
        ) : paginated.length === 0 ? (
          <p className="text-center py-10 text-stone/40 text-sm">No pages found</p>
        ) : (
          paginated.map((page) => (
            <div key={page.id} className="bg-white rounded-xl shadow-sm p-4 space-y-2">
              <div className="flex items-center justify-between">
                <TypeBadge type={page.type} />
                <div className="flex items-center gap-1">
                  {VERSION_DEFS.map(({ lang, style, label }) => {
                    const version = page.versions.find(v => v.language === lang && v.audience_style === style);
                    return (
                      <button
                        key={label}
                        onClick={() => handleVersionStatusToggle(page.id, version?.id, lang, style, version?.status ?? 'draft')}
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border transition-colors ${versionStatusColor(version?.status)}`}
                        title={`${label}: ${version?.status ?? 'draft'}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <p className="font-mono text-xs text-stone/60 truncate">/en/{page.slug}</p>
              <p className="font-body text-sm font-medium text-stone line-clamp-1">{page.title}</p>
              <div className="flex items-center justify-end gap-1 pt-1">
                <GenerateDropdown page={page} generatingId={generatingId} onGenerate={handleGenerate} />
                <button onClick={() => setEditPage(page)} className="p-1.5 rounded hover:bg-stone/10 text-stone/60" title="Edit">
                  <Pencil size={14} />
                </button>
                <button onClick={() => setDeletePage(page)} className="p-1.5 rounded hover:bg-red-50 text-red-400" title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pageCount > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-stone/50">
          <span>{totalFiltered} pages</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded hover:bg-stone/10 disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs">{currentPage} / {pageCount}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
              disabled={currentPage === pageCount}
              className="p-1.5 rounded hover:bg-stone/10 disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <PageFormModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onSave={handleAdd}
        initial={emptyForm()}
      />
      <PageFormModal
        open={!!editPage}
        onClose={() => setEditPage(null)}
        onSave={handleEdit}
        initial={editFormInit}
        editSlug={editPage?.slug}
      />
      <DeleteModal
        page={deletePage}
        onClose={() => setDeletePage(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default SeoManager;
