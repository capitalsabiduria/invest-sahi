import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import { marked } from 'marked';
import { useEffect, useState, useCallback } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Heading1, Heading2, Heading3, List, ListOrdered,
  AlignLeft, AlignCenter, AlignRight, Quote, Code,
  Link as LinkIcon, Image as ImageIcon, Highlighter,
  Undo, Redo, Minus,
} from 'lucide-react';

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  isOdia?: boolean;
  label: string;
};

function isMarkdown(str: string): boolean {
  return str.length > 0 && !/<[a-z][\s\S]*>/i.test(str);
}

function ToolbarButton({
  onClick, active, title, children,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? 'bg-saffron/15 text-saffron'
          : 'text-stone/60 hover:bg-stone/10 hover:text-stone'
      }`}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <span className="w-px h-5 bg-stone/15 mx-0.5 inline-block" />;
}

export default function RichEditor({ value, onChange, placeholder, isOdia, label }: Props) {
  const [wordCount, setWordCount] = useState(0);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue underline' } }),
      Image.configure({ HTMLAttributes: { class: 'max-w-full rounded-lg my-2' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing…' }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[300px] px-4 py-3 prose prose-sm max-w-none focus:outline-none',
        ...(isOdia ? { style: "font-family: 'Noto Sans Oriya', sans-serif; font-size: 15px;" } : {}),
      },
    },
  });

  // Convert incoming value (markdown or HTML) and set editor content
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    if (!value) return;

    const html = isMarkdown(value) ? marked(value) as string : value;
    if (editor.getHTML() !== html) {
      editor.commands.setContent(html, false);
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!linkUrl) return;
    editor?.chain().focus().setLink({ href: linkUrl }).run();
    setLinkUrl('');
    setShowLinkInput(false);
  }, [editor, linkUrl]);

  const insertImage = useCallback(() => {
    if (!imageUrl) return;
    editor?.chain().focus().setImage({ src: imageUrl }).run();
    setImageUrl('');
    setShowImageInput(false);
  }, [editor, imageUrl]);

  if (!editor) return null;

  return (
    <div className="border border-stone/20 rounded-lg overflow-hidden flex flex-col">

      {/* Label + word count */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-stone/5 border-b border-stone/10">
        <span className="text-xs font-semibold text-stone/60 uppercase tracking-wide">{label}</span>
        <span className="text-[10px] text-stone/40">{wordCount} words</span>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-white border-b border-stone/10">

        {/* History */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={14} /></ToolbarButton>
        <Divider />

        {/* Block type */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Heading 1"><Heading1 size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2"><Heading2 size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3"><Heading3 size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} title="Normal text">
          <span className="text-[11px] font-medium">¶</span>
        </ToolbarButton>
        <Divider />

        {/* Inline formatting */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><Strikethrough size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight"><Highlighter size={14} /></ToolbarButton>
        <Divider />

        {/* Lists */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><List size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list"><ListOrdered size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code"><Code size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule"><Minus size={14} /></ToolbarButton>
        <Divider />

        {/* Alignment */}
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left"><AlignLeft size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center"><AlignCenter size={14} /></ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right"><AlignRight size={14} /></ToolbarButton>
        <Divider />

        {/* Text colour */}
        <label title="Text colour" className="p-1.5 rounded hover:bg-stone/10 cursor-pointer flex items-center">
          <span className="text-[11px] font-bold text-stone/60">A</span>
          <input
            type="color"
            className="w-0 h-0 opacity-0 absolute"
            onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          />
        </label>
        <Divider />

        {/* Link */}
        <ToolbarButton onClick={() => { setShowLinkInput(v => !v); setShowImageInput(false); }} active={editor.isActive('link')} title="Insert link"><LinkIcon size={14} /></ToolbarButton>
        {editor.isActive('link') && (
          <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} title="Remove link">
            <span className="text-[10px] font-medium">✕link</span>
          </ToolbarButton>
        )}

        {/* Image / GIF */}
        <ToolbarButton onClick={() => { setShowImageInput(v => !v); setShowLinkInput(false); }} title="Insert image or GIF"><ImageIcon size={14} /></ToolbarButton>

      </div>

      {/* Link input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 px-3 py-2 bg-stone/5 border-b border-stone/10">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') setLink(); }}
            placeholder="https://..."
            className="text-xs flex-1 px-2 py-1 rounded border border-stone/20 outline-none focus:border-saffron/50"
            autoFocus
          />
          <button onClick={setLink} className="text-xs px-3 py-1 rounded bg-saffron text-white font-medium">Insert</button>
          <button onClick={() => setShowLinkInput(false)} className="text-xs text-stone/40 hover:text-stone">✕</button>
        </div>
      )}

      {/* Image / GIF input */}
      {showImageInput && (
        <div className="flex items-center gap-2 px-3 py-2 bg-stone/5 border-b border-stone/10">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') insertImage(); }}
            placeholder="Paste image or GIF URL…"
            className="text-xs flex-1 px-2 py-1 rounded border border-stone/20 outline-none focus:border-saffron/50"
            autoFocus
          />
          <button onClick={insertImage} className="text-xs px-3 py-1 rounded bg-saffron text-white font-medium">Insert</button>
          <button onClick={() => setShowImageInput(false)} className="text-xs text-stone/40 hover:text-stone">✕</button>
        </div>
      )}

      {/* Editor content area */}
      <div className="bg-white flex-1">
        <EditorContent editor={editor} />
      </div>

    </div>
  );
}
