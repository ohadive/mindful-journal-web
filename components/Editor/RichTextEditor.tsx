'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import { 
  FaBold, 
  FaItalic, 
  FaListUl, 
  FaListOl 
} from 'react-icons/fa';

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  content = '',
  onChange,
  placeholder = 'Start writing your thoughts...'
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      CharacterCount,
      Typography,
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4',
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  useEffect(() => {
    if (editor) {
      editor.commands.focus();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto border border-border rounded-lg shadow-sm bg-card">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-muted">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
            editor.isActive('bold') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
          }`}
          title="Bold"
        >
          <FaBold className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
            editor.isActive('italic') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
          }`}
          title="Italic"
        >
          <FaItalic className="w-4 h-4" />
        </button>
        
        <div className="w-px h-6 bg-border mx-1" />
        
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
            editor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
          }`}
          title="Bullet List"
        >
          <FaListUl className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
            editor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
          }`}
          title="Numbered List"
        >
          <FaListOl className="w-4 h-4" />
        </button>
      </div>

      {/* Editor */}
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="prose-editor"
        />
      </div>

      {/* Character Count */}
      <div className="flex justify-end p-3 border-t border-border bg-muted">
        <span className="text-sm text-muted-foreground">
          {editor.storage.characterCount.characters()} characters
        </span>
      </div>

      <style jsx>{`
        .prose-editor .ProseMirror {
          outline: none;
          padding: 1rem;
          min-height: 200px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: hsl(var(--foreground));
          background-color: hsl(var(--card));
        }

        .prose-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          height: 0;
        }

        .prose-editor .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 0;
          margin-bottom: 1rem;
          color: hsl(var(--foreground));
        }

        .prose-editor .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: hsl(var(--foreground));
        }

        .prose-editor .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
          color: hsl(var(--foreground));
        }

        .prose-editor .ProseMirror p {
          margin-bottom: 1rem;
        }

        .prose-editor .ProseMirror ul,
        .prose-editor .ProseMirror ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }

        .prose-editor .ProseMirror li {
          margin-bottom: 0.25rem;
        }

        .prose-editor .ProseMirror strong {
          font-weight: 600;
        }

        .prose-editor .ProseMirror em {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}