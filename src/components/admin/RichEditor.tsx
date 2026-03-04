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
import Strike from '@tiptap/extension-strike';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import { Label } from '@/components/ui/label';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Link as LinkIcon,
  Unlink, List, ListOrdered, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Image as ImageIcon, Code, Quote, Minus,
} from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  isOdia?: boolean;
  label: string;
}

const ToolbarButton = ({
  onClick,
  isActive = false,
  title,
  children,
}: {
  onClick: () => void;
  isActive?: boolean;
  title: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded hover:bg-stone/10 text-stone/60 text-xs font-medium transition-colors ${
      isActive ? 'bg-saffron/10 text-saffron' : ''
    }`}
  >
    {children}
  </button>
);

const RichEditor = ({ value, onChange, placeholder, isOdia, label }: RichEditorProps) => {
  const [embedHtml, setEmbedHtml] = useState('');
  const [showEmbedArea, setShowEmbedArea] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        strike: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
        orderedList: false,
        bulletList: false,
      }),
      Underline,
      Strike,
      CodeBlock,
      Blockquote,
      HorizontalRule,
      OrderedList,
      BulletList,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      Placeholder.configure({ placeholder: placeholder || 'Write content here…' }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'outline-none min-h-[280px] prose prose-sm max-w-none focus:outline-none',
      },
    },
  });

  // Sync external value changes (e.g. from AI generation)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== value) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addGif = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('Enter GIF URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url, alt: 'gif' }).run();
    }
  }, [editor]);

  const insertEmbed = useCallback(() => {
    if (!editor || !embedHtml.trim()) return;
    editor.chain().focus().insertContent(embedHtml).run();
    setEmbedHtml('');
    setShowEmbedArea(false);
  }, [editor, embedHtml]);

  if (!editor) return null;

  return (
    <div className="space-y-1">
      <Label className="font-semibold">{label}</Label>
      <div className="border border-stone/20 rounded-lg overflow-hidden focus-within:border-saffron/50 transition-colors">
        {/* Toolbar */}
        <div className="border-b border-stone/10 bg-stone/5 px-2 py-1 space-y-1">
          {/* Row 1 — Block formatting */}
          <div className="flex flex-wrap gap-0.5">
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
              H1
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
              H2
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 3">
              H3
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setParagraph().run()} isActive={editor.isActive('paragraph')} title="Normal text">
              P
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Blockquote">
              <Quote size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
              <Code size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
              <Minus size={13} />
            </ToolbarButton>
          </div>

          {/* Row 2 — Inline formatting */}
          <div className="flex flex-wrap gap-0.5 items-center">
            <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
              <Bold size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
              <Italic size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Underline">
              <UnderlineIcon size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive('strike')} title="Strikethrough">
              <Strikethrough size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} title="Highlight">
              <span className="text-[11px] font-bold bg-yellow-200 px-0.5 rounded">H</span>
            </ToolbarButton>
            {/* Text colour picker */}
            <span className="inline-flex items-center p-1 rounded hover:bg-stone/10" title="Text colour">
              <label className="cursor-pointer flex items-center gap-0.5 text-stone/60 text-xs font-medium">
                <span className="text-[11px]">A</span>
                <input
                  type="color"
                  className="w-4 h-4 rounded border-0 cursor-pointer"
                  onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                  title="Text colour"
                />
              </label>
            </span>
            <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Add Link">
              <LinkIcon size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} title="Remove Link">
              <Unlink size={13} />
            </ToolbarButton>
          </div>

          {/* Row 3 — Lists & alignment */}
          <div className="flex flex-wrap gap-0.5">
            <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
              <List size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Ordered List">
              <ListOrdered size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Align Left">
              <AlignLeft size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Align Center">
              <AlignCenter size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Align Right">
              <AlignRight size={13} />
            </ToolbarButton>
          </div>

          {/* Row 4 — Media & embeds */}
          <div className="flex flex-wrap gap-0.5">
            <ToolbarButton onClick={addImage} title="Insert Image">
              <ImageIcon size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={addGif} title="Insert GIF">
              <span className="text-[11px] font-bold">GIF</span>
            </ToolbarButton>
            <ToolbarButton onClick={() => setShowEmbedArea((v) => !v)} isActive={showEmbedArea} title="Insert iframe/embed">
              <span className="text-[11px] font-bold">&lt;/&gt;</span>
            </ToolbarButton>
          </div>

          {/* Embed area */}
          {showEmbedArea && (
            <div className="flex gap-1.5 pt-1">
              <textarea
                className="flex-1 text-xs border border-stone/20 rounded p-1.5 min-h-[48px] resize-none font-mono focus:outline-none focus:border-saffron/50"
                placeholder="Paste embed HTML (iframe, etc.)"
                value={embedHtml}
                onChange={(e) => setEmbedHtml(e.target.value)}
              />
              <button
                type="button"
                onClick={insertEmbed}
                className="px-3 py-1 bg-saffron text-white text-xs rounded font-medium hover:bg-saffron/90 self-end"
              >
                Insert
              </button>
            </div>
          )}

          {/* Row 5 — History */}
          <div className="flex flex-wrap gap-0.5">
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
              <Undo size={13} />
            </ToolbarButton>
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
              <Redo size={13} />
            </ToolbarButton>
          </div>
        </div>

        {/* Editor content area */}
        <EditorContent
          editor={editor}
          className="p-3"
          style={isOdia ? { fontFamily: "'Noto Sans Oriya', sans-serif" } : undefined}
        />
      </div>
    </div>
  );
};

export default RichEditor;
