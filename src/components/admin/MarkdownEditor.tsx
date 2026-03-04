import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  isOdia?: boolean;
  label: string;
};

export default function MarkdownEditor({ value, onChange, placeholder, isOdia, label }: Props) {
  const [tab, setTab] = useState<'write' | 'preview'>('write');
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;

  return (
    <div className="border border-stone/20 rounded-lg overflow-hidden">
      {/* Tab bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-stone/5 border-b border-stone/10">
        <span className="text-xs font-semibold text-stone/60 uppercase tracking-wide">{label}</span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-stone/40">{wordCount} words</span>
          <div className="flex rounded-md overflow-hidden border border-stone/20">
            <button
              onClick={() => setTab('write')}
              className={`text-xs px-3 py-1 transition-colors ${tab === 'write' ? 'bg-saffron text-white' : 'bg-white text-stone/50 hover:bg-stone/5'}`}
            >
              Write
            </button>
            <button
              onClick={() => setTab('preview')}
              className={`text-xs px-3 py-1 transition-colors ${tab === 'preview' ? 'bg-saffron text-white' : 'bg-white text-stone/50 hover:bg-stone/5'}`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Write pane */}
      {tab === 'write' && (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[300px] p-3 text-sm font-mono outline-none resize-y bg-white text-stone leading-relaxed"
          style={isOdia ? { fontFamily: "'Noto Sans Oriya', sans-serif", fontSize: '15px' } : undefined}
        />
      )}

      {/* Preview pane */}
      {tab === 'preview' && (
        <div
          className="min-h-[300px] p-4 prose prose-sm max-w-none bg-white text-stone"
          style={isOdia ? { fontFamily: "'Noto Sans Oriya', sans-serif" } : undefined}
        >
          {value
            ? <ReactMarkdown>{value}</ReactMarkdown>
            : <p className="text-stone/30 italic text-sm">Nothing to preview yet.</p>
          }
        </div>
      )}
    </div>
  );
}
