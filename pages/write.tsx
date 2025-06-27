import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { requireAuth, AuthenticatedPageProps } from '../lib/auth-utils';
import ClientOnlyEditor from '../components/Editor/ClientOnlyEditor';
import { useAutoSave } from '../hooks/useAutoSave';
import { 
  FaArrowLeft, 
  FaCheck, 
  FaSpinner, 
  FaExclamationTriangle,
  FaKeyboard 
} from 'react-icons/fa';

export default function WritePage({ session }: AuthenticatedPageProps) {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [showKeyboardHints, setShowKeyboardHints] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Ensure proper client-side hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mock save function - replace with actual API call
  const handleSave = async (contentToSave: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock API call to save journal entry
    console.log('Saving content:', contentToSave);
    
    // In real implementation, you would call your API:
    // await fetch('/api/journal/entries', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ content: contentToSave, userId: session.user.id })
    // });
  };

  const { saveStatus, forceSave } = useAutoSave({
    content,
    onSave: handleSave,
    delay: 10000, // 10 seconds
    enabled: isMounted && content.length > 0
  });

  // Keyboard shortcuts
  useEffect(() => {
    if (!isMounted) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+S or Cmd+S to save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        forceSave();
      }
      
      // Escape to go back to dashboard
      if (e.key === 'Escape') {
        router.push('/');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [forceSave, router, isMounted]);

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <FaSpinner className="animate-spin text-blue-500" />;
      case 'saved':
        return <FaCheck className="text-green-500" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return null;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'error':
        return 'Save failed';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              title="Back to Dashboard (Esc)"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                New Journal Entry
              </h1>
              <button
                onClick={() => setShowKeyboardHints(!showKeyboardHints)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Keyboard shortcuts"
              >
                <FaKeyboard className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Save Status */}
          <div className="flex items-center gap-2 text-sm">
            {getSaveStatusIcon()}
            <span className={`
              ${saveStatus === 'saved' ? 'text-green-600 dark:text-green-400' : ''}
              ${saveStatus === 'saving' ? 'text-blue-600 dark:text-blue-400' : ''}
              ${saveStatus === 'error' ? 'text-red-600 dark:text-red-400' : ''}
              ${saveStatus === 'idle' ? 'text-gray-500 dark:text-gray-400' : ''}
            `}>
              {getSaveStatusText()}
            </span>
          </div>
        </div>

        {/* Keyboard Hints */}
        {showKeyboardHints && (
          <div className="max-w-7xl mx-auto mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded text-xs">
                  Ctrl+S
                </kbd>
                <span>Save now</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded text-xs">
                  Esc
                </kbd>
                <span>Back to dashboard</span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Auto-saves every 10 seconds
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <ClientOnlyEditor
            content={content}
            onChange={setContent}
            placeholder="Start writing your thoughts, feelings, or reflections..."
          />
        </div>

        {/* Writing Stats */}
        {isMounted && (
          <div className="mt-4 flex justify-center">
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span>{content.replace(/<[^>]*>/g, '').length} characters</span>
              <span>{content.replace(/<[^>]*>/g, '').split(/\s+/).filter(word => word.length > 0).length} words</span>
              <span>Started {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Save Status Indicator */}
      <div className="fixed bottom-6 right-6 z-50">
        {saveStatus !== 'idle' && (
          <div className={`
            flex items-center gap-2 px-4 py-2 rounded-full shadow-lg backdrop-blur-sm
            ${saveStatus === 'saved' ? 'bg-green-100 dark:bg-green-900/80 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700' : ''}
            ${saveStatus === 'saving' ? 'bg-blue-100 dark:bg-blue-900/80 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700' : ''}
            ${saveStatus === 'error' ? 'bg-red-100 dark:bg-red-900/80 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-700' : ''}
            animate-fade-in
          `}>
            {getSaveStatusIcon()}
            <span className="text-sm font-medium">{getSaveStatusText()}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = requireAuth();