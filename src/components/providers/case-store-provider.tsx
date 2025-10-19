'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CaseRecord } from '@/lib/types';

interface CaseStoreValue {
  cases: CaseRecord[];
  addCase: (record: CaseRecord) => void;
  updateCase: (id: string, updater: (existing: CaseRecord) => CaseRecord) => void;
  removeCase: (id: string) => void;
  isReady: boolean;
}

const STORAGE_KEY = 'pharmacheck.cases';

const CaseStoreContext = createContext<CaseStoreValue | null>(null);

function loadFromStorage(): CaseRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as CaseRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Failed to load cases from storage', error);
    return [];
  }
}

function persistToStorage(records: CaseRecord[]) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.warn('Failed to persist cases to storage', error);
  }
}

export function CaseStoreProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<CaseRecord[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setCases(loadFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      persistToStorage(cases);
    }
  }, [cases, isHydrated]);

  const value = useMemo<CaseStoreValue>(
    () => ({
      cases,
      isReady: isHydrated,
      addCase: (record) => {
        setCases((prev) => {
          const existingIndex = prev.findIndex((item) => item.id === record.id);
          if (existingIndex >= 0) {
            const copy = [...prev];
            copy[existingIndex] = record;
            return copy;
          }

          return [record, ...prev];
        });
      },
      updateCase: (id, updater) => {
        setCases((prev) => {
          const index = prev.findIndex((item) => item.id === id);
          if (index === -1) {
            return prev;
          }
          const copy = [...prev];
          copy[index] = updater(copy[index]);
          return copy;
        });
      },
      removeCase: (id) => {
        setCases((prev) => prev.filter((item) => item.id !== id));
      },
    }),
    [cases, isHydrated]
  );

  return <CaseStoreContext.Provider value={value}>{children}</CaseStoreContext.Provider>;
}

export function useCaseStore(): CaseStoreValue {
  const context = useContext(CaseStoreContext);
  if (!context) {
    throw new Error('useCaseStore must be used within a CaseStoreProvider');
  }
  return context;
}
