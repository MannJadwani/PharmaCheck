'use client';

import { useMemo } from 'react';
import { useCaseStore } from '@/components/providers/case-store-provider';
import { CaseStatus } from '@/lib/types';

const statusLabels: Record<CaseStatus, string> = {
  draft: 'Draft',
  submitted: 'Awaiting Review',
  approved: 'Approved',
  needs_revision: 'Needs Revision',
};

export function CaseSummary() {
  const { cases, isReady } = useCaseStore();

  const stats = useMemo(() => {
    const base = {
      total: cases.length,
      byStatus: {
        draft: 0,
        submitted: 0,
        approved: 0,
        needs_revision: 0,
      } as Record<CaseStatus, number>,
    };

    cases.forEach((record) => {
      base.byStatus[record.status] += 1;
    });

    return base;
  }, [cases]);

  if (!isReady) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-6 text-sm text-gray-500">
        Syncing local cases...
      </div>
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-4">
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-gray-500">Cases Logged</p>
        <p className="mt-2 text-3xl font-semibold">{stats.total}</p>
      </div>
      {Object.entries(stats.byStatus).map(([status, value]) => (
        <div key={status} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-gray-500">{statusLabels[status as CaseStatus]}</p>
          <p className="mt-2 text-3xl font-semibold">{value}</p>
        </div>
      ))}
    </section>
  );
}
