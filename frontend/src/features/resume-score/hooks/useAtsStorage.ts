/**
 * Custom hook for persisting ATS results in LocalStorage.
 * Keeps React Query mutation state intact — this is purely a
 * client-side cache layer for page-refresh persistence.
 */
import { useState, useCallback } from 'react';
import type { ResumeScoreResponse, ResumeScoreRequest } from '../types/index';

const STORAGE_KEY = 'hirepilot:ats_result';

interface StoredAts {
  result: ResumeScoreResponse;
  request: ResumeScoreRequest;
  savedAt: string; // ISO string
}

function loadStored(): StoredAts | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAts;
  } catch {
    return null;
  }
}

function saveStored(data: StoredAts): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // quota exceeded or private-mode restriction — silently ignore
  }
}

function clearStored(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export interface UseAtsStorageReturn {
  /** Last persisted ATS result (null if none saved). */
  stored: StoredAts | null;
  /** Persist a new result to LocalStorage. */
  persist: (result: ResumeScoreResponse, request: ResumeScoreRequest) => void;
  /** Clear the stored result from LocalStorage. */
  clear: () => void;
}

export function useAtsStorage(): UseAtsStorageReturn {
  // Initialise once from LocalStorage on mount
  const [stored, setStored] = useState<StoredAts | null>(() => loadStored());

  const persist = useCallback(
    (result: ResumeScoreResponse, request: ResumeScoreRequest) => {
      const entry: StoredAts = { result, request, savedAt: new Date().toISOString() };
      saveStored(entry);
      setStored(entry);
    },
    []
  );

  const clear = useCallback(() => {
    clearStored();
    setStored(null);
  }, []);

  return { stored, persist, clear };
}
