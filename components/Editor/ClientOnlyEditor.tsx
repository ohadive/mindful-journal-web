'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

interface RichTextEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

// Dynamically import RichTextEditor with SSR disabled
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => <EditorLoadingPlaceholder />
});

// Loading placeholder component
function EditorLoadingPlaceholder() {
  return (
    <div className="w-full max-w-4xl mx-auto border border-border rounded-lg shadow-sm bg-card animate-pulse">
      {/* Toolbar Skeleton */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-muted">
        <div className="w-8 h-8 bg-muted-foreground/20 rounded"></div>
        <div className="w-8 h-8 bg-muted-foreground/20 rounded"></div>
        <div className="w-px h-6 bg-border mx-1"></div>
        <div className="w-8 h-8 bg-muted-foreground/20 rounded"></div>
        <div className="w-8 h-8 bg-muted-foreground/20 rounded"></div>
      </div>

      {/* Editor Content Skeleton */}
      <div className="p-4 min-h-[200px] space-y-3">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        <div className="h-4 bg-muted rounded w-4/6"></div>
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>

      {/* Character Count Skeleton */}
      <div className="flex justify-end p-3 border-t border-border bg-muted">
        <div className="h-4 bg-muted-foreground/20 rounded w-24"></div>
      </div>
    </div>
  );
}

export default function ClientOnlyEditor({
  content = '',
  onChange,
  placeholder = 'Start writing your thoughts...'
}: RichTextEditorProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Ensure component only renders on client side after hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering anything on server
  if (!isMounted) {
    return <EditorLoadingPlaceholder />;
  }

  return (
    <RichTextEditor
      content={content}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
}