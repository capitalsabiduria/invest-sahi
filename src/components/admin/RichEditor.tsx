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
import { useEffect, useState, useCallback } from 'react';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Quote, Link as LinkIcon, Image as ImageIcon, Minus, Undo, Redo,
} from 'lucide-react';

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  isOdia?: boolean;
  label: string;
};

function Btn({ onClick, active, title, children }: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      title={title}
      className={`px-1.5 py-1 rounded text-xs transition-colors ${
        active ? 'bg-orange-100 text-orange-700 font-semibold' : 'text-gray-500 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

export default function RichEditor({ value, onChange, placeholder, isOdia, label }: Props) {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImage, setShowImage] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight,
      Placeholder.configure({ placeholder: placeholder || 'Start writing…' }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
      const text = editor.getText();
      setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[280px] px-4 py-3 text-sm leading-relaxed',
        ...(isOdia ? { style: "font-family: 'Noto Sans Oriya', sans-serif;" } : {}),
      },
    },
  });

  // Sync external value changes into editor (e.g. after AI generation or opening existing item)
  useEffect(() => {
    if (!editor || editor.isDestroyed) return;
    const current = editor.getHTML();
    const incoming = value || '';
    // Avoid resetting cursor if content is the same
    if (current !== incoming && incoming !== '<p></p>' && incoming !== '') {
      editor.commands.setContent(incoming, false);
    }
  }, [value]); // intentionally only value, not editor

  const insertLink = useCallback(() => {
    if (linkUrl) {
      editor?.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
    }
    setShowLink(false);
  }, [editor, linkUrl]);

  const insertImage = useCallback(() => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
    }
    setShowImage(false);
  }, [editor, imageUrl]);

  if (!editor) return null;

  const h = (level: 1 | 2 | 3) => editor.isActive('heading', { level });

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden flex flex-col bg-white">

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-50 border-b border-gray-200">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
        <span className="text-[10px] text-gray-300">{wordCount} words</span>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1 bg-white border-b border-gray-100">

        <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo"><Undo size={13} /></Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo"><Redo size={13} /></Btn>
        <span className="w-px h-4 bg-gray-200 mx-0.5" />

        {/* Headings — these are the critical ones */}
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={h(1)} title="Heading 1">H1</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={h(2)} title="Heading 2">H2</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={h(3)} title="Heading 3">H3</Btn>
        <Btn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive('paragraph')} title="Paragraph">¶</Btn>
        <span className="w-px h-4 bg-gray-200 mx-0.5" />

        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><Bold size={13} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><Italic size={13} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline"><UnderlineIcon size={13} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strike"><Strikethrough size={13} /></Btn>
        <span className="w-px h-4 bg-gray-200 mx-0.5" />

        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list"><List size={13} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list"><ListOrdered size={13} /></Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote"><Quote size={13} /></Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider"><Minus size={13} /></Btn>
        <span className="w-px h-4 bg-gray-200 mx-0.5" />

        <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Left"><AlignLeft size={13} /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Center"><AlignCenter size={13} /></Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Right"><AlignRight size={13} /></Btn>
        <span className="w-px h-4 bg-gray-200 mx-0.5" />

        <Btn onClick={() => { setShowLink(v => !v); setShowImage(false); }} active={editor.isActive('link')} title="Link"><LinkIcon size={13} /></Btn>
        <Btn onClick={() => { setShowImage(v => !v); setShowLink(false); }} title="Image"><ImageIcon size={13} /></Btn>
      </div>

      {/* Link input */}
      {showLink && (
        <div className="flex gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
          <input
            type="url"
            value={linkUrl}
            onChange={e => setLinkUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && insertLink()}
            placeholder="https://..."
            autoFocus
            className="flex-1 text-xs px-2 py-1 border border-gray-200 rounded outline-none"
          />
          <button onClick={insertLink} className="text-xs px-3 py-1 bg-orange-500 text-white rounded">Insert</button>
          <button onClick={() => setShowLink(false)} className="text-xs text-gray-400">✕</button>
        </div>
      )}

      {/* Image input */}
      {showImage && (
        <div className="flex gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100">
          <input
            type="url"
            value={imageUrl}
            onChange={e => setImageUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && insertImage()}
            placeholder="Paste image or GIF URL…"
            autoFocus
            className="flex-1 text-xs px-2 py-1 border border-gray-200 rounded outline-none"
          />
          <button onClick={insertImage} className="text-xs px-3 py-1 bg-orange-500 text-white rounded">Insert</button>
          <button onClick={() => setShowImage(false)} className="text-xs text-gray-400">✕</button>
        </div>
      )}

      {/* Editor area */}
      <div className="flex-1 [&_.ProseMirror_h1]:text-2xl [&_.ProseMirror_h1]:font-bold [&_.ProseMirror_h1]:mt-4 [&_.ProseMirror_h1]:mb-2 [&_.ProseMirror_h2]:text-xl [&_.ProseMirror_h2]:font-bold [&_.ProseMirror_h2]:mt-3 [&_.ProseMirror_h2]:mb-1.5 [&_.ProseMirror_h3]:text-lg [&_.ProseMirror_h3]:font-semibold [&_.ProseMirror_h3]:mt-2 [&_.ProseMirror_h3]:mb-1 [&_.ProseMirror_blockquote]:border-l-4 [&_.ProseMirror_blockquote]:border-orange-300 [&_.ProseMirror_blockquote]:pl-3 [&_.ProseMirror_blockquote]:italic [&_.ProseMirror_blockquote]:text-gray-500 [&_.ProseMirror_ul]:list-disc [&_.ProseMirror_ul]:pl-5 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ol]:pl-5 [&_.ProseMirror_p.is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child]:before:text-gray-300 [&_.ProseMirror_p.is-editor-empty:first-child]:before:pointer-events-none [&_.ProseMirror_p.is-editor-empty:first-child]:before:float-left">
        <EditorContent editor={editor} />
      </div>

    </div>
  );
}
