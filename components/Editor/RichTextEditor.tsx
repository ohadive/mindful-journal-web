'use client';

import React, { useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import Underline from '@tiptap/extension-underline';
import { 
  FaBold, 
  FaItalic, 
  FaUnderline,
  FaListUl, 
  FaListOl,
  FaQuoteLeft,
  FaCode,
  FaLink,
  FaUnlink,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaHeading,
  FaParagraph,
  FaUndo,
  FaRedo,
  FaStrikethrough
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
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount.configure({
        limit: 100000, // 100k character limit
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 hover:text-blue-800 underline cursor-pointer',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right'],
      }),
      Typography,
      Underline,
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[60vh] lg:min-h-[70vh] p-6 lg:p-8 dark:prose-invert prose-headings:!text-white prose-p:!text-white prose-ul:!text-white prose-ol:!text-white prose-li:!text-white prose-blockquote:!text-white prose-strong:!text-white prose-em:!text-white prose-a:!text-blue-400',
        spellcheck: 'true',
      },
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
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

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor?.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);



  if (!editor) {
    return null;
  }

  return (
    <div className="w-full border border-border rounded-lg shadow-sm bg-card">
      {/* Main Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-3 lg:p-4 border-b border-border bg-muted">
        {/* Undo/Redo */}
        <div className="flex items-center gap-1 mr-2">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground"
            title="Undo (Ctrl+Z)"
          >
            <FaUndo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground"
            title="Redo (Ctrl+Y)"
          >
            <FaRedo className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-6 bg-border mx-2" />
        
        {/* Text Formatting */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive('bold') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Bold (Ctrl+B)"
          >
            <FaBold className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive('italic') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Italic (Ctrl+I)"
          >
            <FaItalic className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive('underline') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Underline (Ctrl+U)"
          >
            <FaUnderline className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive('strike') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Strikethrough (Ctrl+Shift+X)"
          >
            <FaStrikethrough className="w-4 h-4" />
          </button>
        </div>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        {/* Headings */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`px-3 py-1 rounded text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive('paragraph') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Paragraph"
          >
            <FaParagraph className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`px-3 py-1 rounded text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Heading 1 (Ctrl+1)"
          >
            H1
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`px-3 py-1 rounded text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Heading 2 (Ctrl+2)"
          >
            H2
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`px-3 py-1 rounded text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Heading 3 (Ctrl+3)"
          >
            H3
          </button>
        </div>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        {/* Lists */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive('bulletList') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Bullet List (Ctrl+Shift+8)"
          >
            <FaListUl className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive('orderedList') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Numbered List (Ctrl+Shift+7)"
          >
            <FaListOl className="w-4 h-4" />
          </button>
        </div>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        {/* Content Blocks */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive('blockquote') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Quote (Ctrl+Shift+Q)"
          >
            <FaQuoteLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive('code') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Inline Code (Ctrl+Shift+C)"
          >
            <FaCode className="w-4 h-4" />
          </button>
        </div>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        {/* Text Alignment */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Align Left"
          >
            <FaAlignLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Align Center"
          >
            <FaAlignCenter className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Align Right"
          >
            <FaAlignRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        {/* Links */}
        <div className="flex items-center gap-1">
          <button
            onClick={setLink}
            className={`p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors ${
              editor.isActive('link') ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
            title="Add Link (Ctrl+K)"
          >
            <FaLink className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive('link')}
            className="p-2 rounded hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-muted-foreground"
            title="Remove Link"
          >
            <FaUnlink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <EditorContent 
          editor={editor} 
          className="prose-editor"
        />
        
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center p-3 lg:p-4 border-t border-border bg-muted">
        <div className="text-sm text-muted-foreground">
          <span className="hidden sm:inline">Ready to write • </span>
          <span>Auto-saves while you type</span>
          {editor.storage.characterCount.characters() > 50000 && (
            <span className="ml-2 text-orange-600">• Large document</span>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{editor.storage.characterCount.words()} words</span>
          <span>{editor.storage.characterCount.characters()} characters</span>
        </div>
      </div>

      <style jsx>{`
        .prose-editor .ProseMirror {
          outline: none;
          padding: 1.5rem;
          min-height: 60vh;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.7;
          font-size: 1.125rem;
          color: #374151 !important;
          background-color: #ffffff;
          caret-color: #374151 !important;
        }
        
        .dark .prose-editor .ProseMirror {
          color: #ffffff !important;
          background-color: #1f2937;
          caret-color: #ffffff !important;
        }
        
        @media (min-width: 1024px) {
          .prose-editor .ProseMirror {
            padding: 2rem 3rem;
            min-height: 70vh;
            font-size: 1.25rem;
            line-height: 1.8;
          }
        }

        .prose-editor .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        
        .dark .prose-editor .ProseMirror p.is-editor-empty:first-child::before {
          color: #6b7280;
        }

        .prose-editor .ProseMirror h1 {
          font-size: 2.25rem;
          font-weight: 700;
          margin-top: 0;
          margin-bottom: 1.5rem;
          color: #374151 !important;
        }

        .prose-editor .ProseMirror h2 {
          font-size: 1.875rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #374151 !important;
        }

        .prose-editor .ProseMirror h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #374151 !important;
        }
        
        .dark .prose-editor .ProseMirror h1,
        .dark .prose-editor .ProseMirror h2,
        .dark .prose-editor .ProseMirror h3 {
          color: #ffffff !important;
        }

        .prose-editor .ProseMirror p {
          margin-bottom: 1.25rem;
          color: #374151 !important;
        }
        
        .dark .prose-editor .ProseMirror p {
          color: #ffffff !important;
        }
        
        @media (min-width: 1024px) {
          .prose-editor .ProseMirror h1 {
            font-size: 2.5rem;
            margin-bottom: 2rem;
          }

          .prose-editor .ProseMirror h2 {
            font-size: 2rem;
            margin-top: 2.5rem;
            margin-bottom: 1.25rem;
          }

          .prose-editor .ProseMirror h3 {
            font-size: 1.625rem;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }

          .prose-editor .ProseMirror p {
            margin-bottom: 1.5rem;
          }
        }

        .prose-editor .ProseMirror ul,
        .prose-editor .ProseMirror ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
          color: #374151 !important;
        }

        .prose-editor .ProseMirror li {
          margin-bottom: 0.25rem;
          color: #374151 !important;
        }
        
        .dark .prose-editor .ProseMirror ul,
        .dark .prose-editor .ProseMirror ol,
        .dark .prose-editor .ProseMirror li {
          color: #ffffff !important;
        }

        .prose-editor .ProseMirror strong {
          font-weight: 600;
          color: inherit !important;
        }

        .prose-editor .ProseMirror em {
          font-style: italic;
          color: inherit !important;
        }

        .prose-editor .ProseMirror code {
          background-color: #f3f4f6;
          color: #1f2937;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'JetBrains Mono', 'Consolas', 'Monaco', monospace;
          font-size: 0.875em;
        }

        .dark .prose-editor .ProseMirror code {
          background-color: #374151;
          color: #f9fafb;
        }

        .prose-editor .ProseMirror blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280 !important;
        }

        .dark .prose-editor .ProseMirror blockquote {
          border-left-color: #4b5563;
          color: #d1d5db !important;
        }

        .prose-editor .ProseMirror:focus {
          outline: none;
        }

        .prose-editor .ProseMirror::selection {
          background-color: rgba(59, 130, 246, 0.2);
        }

        .prose-editor .ProseMirror *::selection {
          background-color: rgba(59, 130, 246, 0.2);
        }

        .dark .prose-editor .ProseMirror::selection {
          background-color: rgba(96, 165, 250, 0.2);
        }

        .dark .prose-editor .ProseMirror *::selection {
          background-color: rgba(96, 165, 250, 0.2);
        }

        /* TipTap class targeting with enhanced dark mode visibility - using higher specificity */
        .prose-editor .ProseMirror {
          color: #374151 !important;
          caret-color: #374151 !important;
        }
        
        .dark .prose-editor .ProseMirror {
          color: #ffffff !important;
          caret-color: #ffffff !important;
        }
        
        /* All text elements - light mode with higher specificity */
        .prose-editor .ProseMirror p, .prose-editor .ProseMirror h1, .prose-editor .ProseMirror h2, .prose-editor .ProseMirror h3,
        .prose-editor .ProseMirror ul, .prose-editor .ProseMirror ol, .prose-editor .ProseMirror li, 
        .prose-editor .ProseMirror strong, .prose-editor .ProseMirror em {
          color: #374151 !important;
        }
        
        .prose-editor .ProseMirror blockquote {
          color: #6b7280 !important;
        }
        
        /* All text elements - dark mode with bright white and higher specificity */
        .dark .prose-editor .ProseMirror p, .dark .prose-editor .ProseMirror h1, .dark .prose-editor .ProseMirror h2, .dark .prose-editor .ProseMirror h3,
        .dark .prose-editor .ProseMirror ul, .dark .prose-editor .ProseMirror ol, .dark .prose-editor .ProseMirror li, 
        .dark .prose-editor .ProseMirror strong, .dark .prose-editor .ProseMirror em {
          color: #ffffff !important;
        }
        
        .dark .prose-editor .ProseMirror blockquote {
          color: #ffffff !important;
        }
        
        /* Ensure links are blue in dark mode */
        .dark .prose-editor .ProseMirror a {
          color: #60a5fa !important;
        }
        
        /* Override prose classes with even higher specificity */
        .prose-editor .prose.prose-lg .ProseMirror * {
          color: inherit !important;
        }
        
        .dark .prose-editor .prose.prose-lg .ProseMirror * {
          color: #ffffff !important;
        }

        /* Remove any design mode behaviors */
        .prose-editor .ProseMirror[contenteditable="true"] {
          -webkit-user-modify: read-write-plaintext-only;
        }

        /* Ensure proper text editing behavior */
        .prose-editor .ProseMirror * {
          -webkit-user-select: text;
          -moz-user-select: text;
          -ms-user-select: text;
          user-select: text;
        }

        /* Typography improvements */
        .prose-editor .ProseMirror {
          text-rendering: optimizeLegibility;
          -webkit-font-feature-settings: "liga" 1, "kern" 1;
          font-feature-settings: "liga" 1, "kern" 1;
        }

        /* Better link styling */
        .prose-editor .ProseMirror a {
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 2px;
        }

        .prose-editor .ProseMirror a:hover {
          text-decoration-thickness: 2px;
        }
      `}</style>
    </div>
  );
}