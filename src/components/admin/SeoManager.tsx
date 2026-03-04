import { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Pencil, Trash2, Copy, ChevronLeft, ChevronRight, X, ChevronDown, ExternalLink, Check, Eye } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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

const VERSION_DEFS = [
  { lang: 'en', style: 'standard', label: 'EN' },
  { lang: 'or', style: 'mixed', label: 'OR' },
  { lang: 'or', style: 'pure_odia', label: 'OR+' },
] as const;

/* ── Sub-components ────────────────────────────────────────── */

type StatFilter = 'all' | 'live-en' | 'live-or' | 'pending';

const StatCard = ({
  label,
  value,
  color,
  active,
  onClick,
}: {
  label: string;
  value: number | string;
  color?: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`bg-white rounded-xl p-4 shadow-sm text-left transition-all ${
      active ? 'border-2 border-[#E8820C] shadow-md' : 'border-2 border-transparent hover:shadow-md'
    }`}
  >
    <p className="text-2xl font-bold font-heading" style={color ? { color } : undefined}>
      {value}
    </p>
    <p className="text-xs text-stone/50 mt-0.5">{label}</p>
  </button>
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

/* ── View All URLs modal ────────────────────────────────────── */

const ViewAllModal = ({
  page,
  onClose,
}: {
  page: SeoPage | null;
  onClose: () => void;
}) => {
  if (!page) return null;

  const urls = [
    { label: 'EN', url: `https://investsahi.in/en/${page.slug}`, version: page.versions.find(v => v.language === 'en' && v.audience_style === 'standard') },
    { label: 'OR', url: `https://investsahi.in/or/${page.slug}`, version: page.versions.find(v => v.language === 'or' && v.audience_style === 'mixed') },
    { label: 'OR+', url: `https://investsahi.in/or/${page.slug}-odia`, version: page.versions.find(v => v.language === 'or' && v.audience_style === 'pure_odia') },
  ];

  return (
    <Dialog open={!!page} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading">All URLs for /{page.slug}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {urls.map(({ label, url, version }) => (
            <div key={label} className="flex items-center gap-3 p-3 rounded-lg bg-stone/5">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                version?.status === 'live'
                  ? 'bg-green-100 text-green-700 border-green-200'
                  : version?.status === 'pending_review'
                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
              }`}>
                {label}
              </span>
              <span className="font-mono text-xs text-stone/60 flex-1 truncate">{url}</span>
              <span className="text-xs text-stone/40 capitalize">{version?.status ?? 'draft'}</span>
              <button
                onClick={() => { navigator.clipboard.writeText(url); toast.success('Copied!'); }}
                className="p-1 rounded hover:bg-stone/10 text-stone/50"
                title="Copy URL"
              >
                <Copy size={12} />
              </button>
              {version?.status === 'live' && (
                <a href={url} target="_blank" rel="noopener noreferrer" className="p-1 rounded hover:bg-stone/10 text-stone/50">
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          ))}
        </div>
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
  justGenerated,
}: {
  page: SeoPage;
  generatingId: string | null;
  onGenerate: (page: SeoPage, lang: string, style: string) => void;
  justGenerated: string | null;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isPageGenerating = generatingId !== null && generatingId.startsWith(page.id + '-');
  const showCheck = justGenerated !== null && justGenerated.startsWith(page.id + '-');

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
        style={{ color: showCheck ? '#16a34a' : isPageGenerating ? '#6B21A8' : '#9333EA' }}
      >
        {showCheck
          ? <Check size={14} />
          : isPageGenerating
            ? <span className="inline-block w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            : <Sparkles size={14} />}
        <ChevronDown size={10} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 bg-white rounded-xl shadow-lg border border-stone/10 py-1 min-w-[190px]">
          {GENERATE_OPTIONS.map(opt => {
            const key = `${page.id}-${opt.lang}-${opt.style}`;
            const isGenerating = generatingId === key;
            return (
              <button
                key={opt.label}
                onClick={() => { setOpen(false); onGenerate(page, opt.lang, opt.style); }}
                disabled={generatingId !== null}
                className="w-full text-left px-4 py-2 text-sm hover:bg-stone/5 disabled:opacity-40 transition-colors flex items-center gap-2"
              >
                {isGenerating && <span className="inline-block w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />}
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ── Content status helpers ─────────────────────────────────── */

function getContentStatus(page: SeoPage) {
  let count = 0;
  for (const def of VERSION_DEFS) {
    const v = page.versions.find(ver => ver.language === def.lang && ver.audience_style === def.style);
    if (v?.content) count++;
  }
  return count;
}

function getContentTooltip(page: SeoPage) {
  return VERSION_DEFS.map(def => {
    const v = page.versions.find(ver => ver.language === def.lang && ver.audience_style === def.style);
    return `${def.label} ${v?.content ? '✓' : '✗'}`;
  }).join('  ');
}

/* ── Filter pill with count ─────────────────────────────────── */

const FilterPill = ({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`text-xs px-3 py-1.5 rounded-full border transition-all capitalize inline-flex items-center gap-1.5 ${
      active
        ? 'bg-[#2C1810] text-white border-transparent'
        : 'border-stone/20 text-stone/60 hover:border-stone/40'
    }`}
  >
    {label}
    {count !== undefined && (
      <span className={`text-[10px] px-1.5 py-0 rounded-full ${
        active ? 'bg-white/20 text-white' : 'bg-stone/10 text-stone/40'
      }`}>
        {count}
      </span>
    )}
  </button>
);

/* ── Main SeoManager ────────────────────────────────────────── */

type LangFilter = 'all' | 'en' | 'or-mixed' | 'or-pure_odia';
type ContentFilter = 'all' | 'has-content' | 'missing-content' | 'live' | 'pending';
const PAGE_SIZES = [20, 50, 100] as const;

const SeoManager = () => {
  const { toast: uiToast } = useToast();

  /* data */
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  /* filters */
  const [statFilter, setStatFilter] = useState<StatFilter>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | PageType>('all');
  const [langFilter, setLangFilter] = useState<LangFilter>('all');
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(20);

  /* modals */
  const [showAdd, setShowAdd] = useState(false);
  const [editPage, setEditPage] = useState<SeoPage | null>(null);
  const [deletePage, setDeletePage] = useState<SeoPage | null>(null);
  const [viewAllPage, setViewAllPage] = useState<SeoPage | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [justGenerated, setJustGenerated] = useState<string | null>(null);

  const hasAnyFilter = statFilter !== 'all' || typeFilter !== 'all' || langFilter !== 'all' || contentFilter !== 'all' || search !== '';

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
    // Stat filter
    if (statFilter === 'live-en') {
      if (!p.versions.some(v => v.language === 'en' && v.status === 'live')) return false;
    } else if (statFilter === 'live-or') {
      if (!p.versions.some(v => v.language === 'or' && v.status === 'live')) return false;
    } else if (statFilter === 'pending') {
      if (!p.versions.some(v => v.status === 'pending_review')) return false;
    }

    // Type filter
    if (typeFilter !== 'all' && p.type !== typeFilter) return false;

    // Language filter
    if (langFilter !== 'all') {
      const [lang, style] = langFilter === 'en'
        ? ['en', 'standard']
        : langFilter === 'or-mixed'
          ? ['or', 'mixed']
          : ['or', 'pure_odia'];
      if (!p.versions.some(v => v.language === lang && v.audience_style === style)) return false;
    }

    // Content filter
    if (contentFilter !== 'all') {
      const count = getContentStatus(p);
      if (contentFilter === 'has-content' && count === 0) return false;
      if (contentFilter === 'missing-content' && count === 3) return false;
      if (contentFilter === 'live' && !p.versions.some(v => v.status === 'live')) return false;
      if (contentFilter === 'pending' && !p.versions.some(v => v.status === 'pending_review')) return false;
    }

    // Search
    if (search) {
      const q = search.toLowerCase();
      if (!p.slug.includes(q) && !(p.title || '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const totalFiltered = filtered.length;
  const pageCount = Math.ceil(totalFiltered / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  /* Count helpers for filter pills */
  const countByType = (type: PageType) => pages.filter(p => p.type === type).length;
  const countByContent = (f: ContentFilter) => {
    if (f === 'all') return pages.length;
    return pages.filter(p => {
      const c = getContentStatus(p);
      if (f === 'has-content') return c > 0;
      if (f === 'missing-content') return c < 3;
      if (f === 'live') return p.versions.some(v => v.status === 'live');
      if (f === 'pending') return p.versions.some(v => v.status === 'pending_review');
      return true;
    }).length;
  };

  /* reset to page 1 on filter change */
  useEffect(() => { setCurrentPage(1); }, [typeFilter, langFilter, contentFilter, search, statFilter, perPage]);

  /* ── copy slug ── */
  const copySlug = (slug: string) => {
    navigator.clipboard.writeText(`/en/${slug}`);
    toast.success(`Copied /en/${slug}`);
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
      setJustGenerated(key);
      setTimeout(() => setJustGenerated(null), 2000);
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

  const versionStatusColor = (status: string | undefined) => ({
    live: 'bg-green-100 text-green-700 border-green-200',
    pending_review: 'bg-amber-100 text-amber-700 border-amber-200',
    draft: 'bg-gray-100 text-gray-500 border-gray-200',
  }[status ?? 'draft'] ?? 'bg-gray-100 text-gray-500 border-gray-200');

  const clearAllFilters = () => {
    setStatFilter('all');
    setTypeFilter('all');
    setLangFilter('all');
    setContentFilter('all');
    setSearch('');
  };

  /* ── render helpers ── */
  const startIdx = (currentPage - 1) * perPage + 1;
  const endIdx = Math.min(currentPage * perPage, totalFiltered);

  const ContentDot = ({ page }: { page: SeoPage }) => {
    const count = getContentStatus(page);
    const color = count === 3 ? 'bg-green-500' : count > 0 ? 'bg-amber-500' : 'bg-red-500';
    const tip = getContentTooltip(page);
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className={`inline-block w-2.5 h-2.5 rounded-full ${color}`} />
          </TooltipTrigger>
          <TooltipContent className="text-xs font-mono">{tip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const VersionBadges = ({ page }: { page: SeoPage }) => (
    <div className="flex items-center gap-2">
      {VERSION_DEFS.map(({ lang, style, label }) => {
        const version = page.versions.find(v => v.language === lang && v.audience_style === style);
        const hasContent = !!version?.content;
        return (
          <div key={label} className="flex flex-col items-center gap-0.5">
            <button
              onClick={() => handleVersionStatusToggle(page.id, version?.id, lang, style, version?.status ?? 'draft')}
              className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
                hasContent
                  ? `border ${versionStatusColor(version?.status)}`
                  : 'border border-dashed border-gray-300 text-gray-400 bg-transparent'
              }`}
              title={`${label}: ${version?.status ?? 'draft'}${hasContent ? '' : ' (no content)'}`}
            >
              {label}
            </button>
            {version?.updated_at && (
              <span className="text-[10px] text-stone/40 leading-none">{timeAgo(version.updated_at)}</span>
            )}
          </div>
        );
      })}
    </div>
  );

  const LiveLinks = ({ page }: { page: SeoPage }) => {
    const links = [
      { label: 'EN', url: `https://investsahi.in/en/${page.slug}`, version: page.versions.find(v => v.language === 'en' && v.audience_style === 'standard') },
      { label: 'OR', url: `https://investsahi.in/or/${page.slug}`, version: page.versions.find(v => v.language === 'or' && v.audience_style === 'mixed') },
      { label: 'OR+', url: `https://investsahi.in/or/${page.slug}-odia`, version: page.versions.find(v => v.language === 'or' && v.audience_style === 'pure_odia') },
    ];
    return (
      <div className="flex items-center gap-1">
        {links.map(({ label, url, version }) => (
          version?.status === 'live' ? (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              title={url}
            >
              {label}
            </a>
          ) : (
            <span key={label} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-stone/5 text-stone/20">
              {label}
            </span>
          )
        ))}
      </div>
    );
  };

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

      {/* Stats — clickable filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Total Slugs"
          value={totalSlugs}
          active={statFilter === 'all'}
          onClick={() => setStatFilter(s => s === 'all' ? 'all' : 'all')}
        />
        <StatCard
          label="Live EN"
          value={liveEN}
          color="#1B6B3A"
          active={statFilter === 'live-en'}
          onClick={() => setStatFilter(s => s === 'live-en' ? 'all' : 'live-en')}
        />
        <StatCard
          label="Live Odia"
          value={liveOdia}
          color="#1A6B9A"
          active={statFilter === 'live-or'}
          onClick={() => setStatFilter(s => s === 'live-or' ? 'all' : 'live-or')}
        />
        <StatCard
          label="Pending Review"
          value={pendingReview}
          color="#D97706"
          active={statFilter === 'pending'}
          onClick={() => setStatFilter(s => s === 'pending' ? 'all' : 'pending')}
        />
      </div>

      {/* Unified filter bar */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 space-y-3">
        {/* Row 1 — Type */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-stone/40 uppercase tracking-wider font-medium w-12 shrink-0">Type</span>
          <FilterPill label="All" count={totalSlugs} active={typeFilter === 'all'} onClick={() => setTypeFilter('all')} />
          {PAGE_TYPES.map(t => (
            <FilterPill key={t} label={t} count={countByType(t)} active={typeFilter === t} onClick={() => setTypeFilter(t)} />
          ))}
        </div>

        {/* Row 2 — Content status */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-stone/40 uppercase tracking-wider font-medium w-12 shrink-0">Status</span>
          {([
            { value: 'all' as ContentFilter, label: 'All' },
            { value: 'has-content' as ContentFilter, label: 'Has Content' },
            { value: 'missing-content' as ContentFilter, label: 'Missing Content' },
            { value: 'live' as ContentFilter, label: 'Live' },
            { value: 'pending' as ContentFilter, label: 'Pending Review' },
          ]).map(({ value, label }) => (
            <FilterPill key={value} label={label} count={countByContent(value)} active={contentFilter === value} onClick={() => setContentFilter(value)} />
          ))}
        </div>

        {/* Row 3 — Language */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] text-stone/40 uppercase tracking-wider font-medium w-12 shrink-0">Lang</span>
          {([
            { value: 'all' as LangFilter, label: 'All' },
            { value: 'en' as LangFilter, label: 'English' },
            { value: 'or-mixed' as LangFilter, label: 'Odia Urban' },
            { value: 'or-pure_odia' as LangFilter, label: 'Odia Formal' },
          ]).map(({ value, label }) => (
            <FilterPill key={value} label={label} active={langFilter === value} onClick={() => setLangFilter(value)} />
          ))}
        </div>

        {/* Search + Clear */}
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search slug or title…"
            className="text-sm px-3 py-1.5 rounded-lg border border-stone/20 outline-none focus:border-[#E8820C] font-body flex-1 min-w-[180px]"
          />
          {hasAnyFilter && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-stone/50 hover:text-[#E8820C] underline transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
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
          <div className="py-16 text-center font-body">
            <p className="text-stone/40 text-sm">No pages match your filters.</p>
            {hasAnyFilter && (
              <button onClick={clearAllFilters} className="mt-2 text-sm text-[#E8820C] hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone/10 text-xs text-stone/50 uppercase tracking-wide">
                <th className="text-left px-4 py-3 font-medium w-20">Type</th>
                <th className="text-left px-4 py-3 font-medium max-w-[280px]">Page</th>
                <th className="text-center px-4 py-3 font-medium w-16">Content</th>
                <th className="text-left px-4 py-3 font-medium">Versions</th>
                <th className="text-center px-4 py-3 font-medium w-20">Live</th>
                <th className="text-left px-4 py-3 font-medium w-32">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((page) => (
                <tr key={page.id} className="border-b border-stone/5 hover:bg-[#F5EDD8]/50 transition-colors">
                  <td className="px-4 py-3">
                    <TypeBadge type={page.type} />
                  </td>
                  <td className="px-4 py-3 max-w-[280px]">
                    <button
                      onClick={() => copySlug(page.slug)}
                      className="font-mono text-xs text-stone/50 hover:text-[#E8820C] transition-colors flex items-center gap-1 truncate max-w-full"
                      title="Click to copy"
                    >
                      /en/{page.slug}
                      <Copy size={10} className="opacity-40 shrink-0" />
                    </button>
                    <p className="font-body text-sm text-stone truncate mt-0.5" title={page.title}>
                      {page.title}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <ContentDot page={page} />
                  </td>
                  <td className="px-4 py-3">
                    <VersionBadges page={page} />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <LiveLinks page={page} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <GenerateDropdown
                        page={page}
                        generatingId={generatingId}
                        onGenerate={handleGenerate}
                        justGenerated={justGenerated}
                      />
                      <button
                        onClick={() => setViewAllPage(page)}
                        className="p-1.5 rounded hover:bg-stone/10 text-stone/50 transition-colors"
                        title="View all URLs"
                      >
                        <Eye size={14} />
                      </button>
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
          <div className="text-center py-10">
            <p className="text-stone/40 text-sm">No pages match your filters.</p>
            {hasAnyFilter && (
              <button onClick={clearAllFilters} className="mt-2 text-sm text-[#E8820C] hover:underline">
                Clear filters
              </button>
            )}
          </div>
        ) : (
          paginated.map((page) => (
            <div key={page.id} className="bg-white rounded-xl shadow-sm p-4 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <TypeBadge type={page.type} />
                  <ContentDot page={page} />
                </div>
                <div className="flex items-center gap-1">
                  <GenerateDropdown page={page} generatingId={generatingId} onGenerate={handleGenerate} justGenerated={justGenerated} />
                  <button onClick={() => setViewAllPage(page)} className="p-1.5 rounded hover:bg-stone/10 text-stone/50" title="View all URLs">
                    <Eye size={14} />
                  </button>
                  <button onClick={() => setEditPage(page)} className="p-1.5 rounded hover:bg-stone/10 text-stone/60" title="Edit">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeletePage(page)} className="p-1.5 rounded hover:bg-red-50 text-red-400" title="Delete">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <button
                onClick={() => copySlug(page.slug)}
                className="font-mono text-xs text-stone/50 hover:text-[#E8820C] transition-colors flex items-center gap-1 truncate max-w-full"
              >
                /en/{page.slug} <Copy size={10} className="opacity-40 shrink-0" />
              </button>
              <div className="flex items-center gap-1.5 pt-1">
                {VERSION_DEFS.map(({ lang, style, label }) => {
                  const version = page.versions.find(v => v.language === lang && v.audience_style === style);
                  const hasContent = !!version?.content;
                  return (
                    <button
                      key={label}
                      onClick={() => handleVersionStatusToggle(page.id, version?.id, lang, style, version?.status ?? 'draft')}
                      className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
                        hasContent
                          ? `border ${versionStatusColor(version?.status)}`
                          : 'border border-dashed border-gray-300 text-gray-400 bg-transparent'
                      }`}
                      title={`${label}: ${version?.status ?? 'draft'}`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-stone/50 flex-wrap gap-2">
        <span className="text-xs">
          {totalFiltered > 0
            ? `Showing ${startIdx}–${endIdx} of ${totalFiltered} pages`
            : `${totalFiltered} pages`}
        </span>
        <div className="flex items-center gap-3">
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="text-xs border border-stone/20 rounded px-2 py-1 bg-white outline-none"
          >
            {PAGE_SIZES.map(s => (
              <option key={s} value={s}>{s} / page</option>
            ))}
          </select>
          {pageCount > 1 && (
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
          )}
        </div>
      </div>

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
      <ViewAllModal
        page={viewAllPage}
        onClose={() => setViewAllPage(null)}
      />
    </div>
  );
};

export default SeoManager;
