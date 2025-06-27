import { useState, useEffect, useCallback, useRef } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface UseAutoSaveOptions {
  content: string;
  onSave: (content: string) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export interface UseAutoSaveReturn {
  saveStatus: SaveStatus;
  forceSave: () => Promise<void>;
  resetStatus: () => void;
}

export function useAutoSave({
  content,
  onSave,
  delay = 10000, // 10 seconds
  enabled = true
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedContentRef = useRef<string>('');
  const isMountedRef = useRef<boolean>(true);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const performSave = useCallback(async (contentToSave: string) => {
    if (!isMountedRef.current) return;
    
    try {
      setSaveStatus('saving');
      await onSave(contentToSave);
      
      if (isMountedRef.current) {
        lastSavedContentRef.current = contentToSave;
        setSaveStatus('saved');
        
        // Reset to idle after 2 seconds
        setTimeout(() => {
          if (isMountedRef.current) {
            setSaveStatus('idle');
          }
        }, 2000);
      }
    } catch (error) {
      if (isMountedRef.current) {
        setSaveStatus('error');
        console.error('Auto-save failed:', error);
        
        // Reset to idle after 3 seconds on error
        setTimeout(() => {
          if (isMountedRef.current) {
            setSaveStatus('idle');
          }
        }, 3000);
      }
    }
  }, [onSave]);

  const forceSave = useCallback(async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    
    if (content !== lastSavedContentRef.current) {
      await performSave(content);
    }
  }, [content, performSave]);

  const resetStatus = useCallback(() => {
    setSaveStatus('idle');
  }, []);

  // Debounced auto-save effect
  useEffect(() => {
    if (!enabled || !content || content === lastSavedContentRef.current) {
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debounced save
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current && content !== lastSavedContentRef.current) {
        performSave(content);
      }
    }, delay);

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [content, delay, enabled, performSave]);

  return {
    saveStatus,
    forceSave,
    resetStatus
  };
}