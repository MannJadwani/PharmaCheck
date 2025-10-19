'use client';

import { useMemo } from 'react';
import { useCaseStore } from '@/components/providers/case-store-provider';
import { CaseRecord } from '@/lib/types';

const statusPalette: Record<CaseRecord['status'], string> = {
  draft: 'bg-slate-200 text-slate-800',
  submitted: 'bg-blue-100 text-blue-700',
  approved: 'bg-green-100 text-green-700',
  needs_revision: 'bg-amber-100 text-amber-700',
};

const statusLabel: Record<CaseRecord['status'], string> = {
  draft: 'Draft',
  submitted: 'Awaiting Review',
  approved: 'Approved',
  needs_revision: 'Needs Revision',
};

export function StudentCaseList() {
  const { cases, isReady, removeCase } = useCaseStore();

  const sortedCases = useMemo(
    () => [...cases].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [cases]
  );

  if (!isReady) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-gray-500">
        Loading saved cases...
      </div>
    );
  }

  if (sortedCases.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 p-10 text-center text-sm text-gray-500">
        No cases logged yet. Use the “Log a Case” button to capture your first patient record.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {sortedCases.map((record) => (
        <article
          key={record.id}
          className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">{record.studentName} · {record.studentBatch}</p>
              <h2 className="text-lg font-semibold">Patient {record.patient.patientCode}</h2>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusPalette[record.status]}`}>
              {statusLabel[record.status]}
            </span>
          </header>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1 text-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">Patient</p>
              <p>{record.patient.age} yrs · {record.patient.gender}</p>
              {record.patient.ward && <p className="text-gray-500">Ward: {record.patient.ward}</p>}
              <p className="text-gray-500">Admitted on {new Date(record.patient.admissionDate).toLocaleDateString()}</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">Chief Complaints</p>
              <p className="leading-relaxed">{record.chiefComplaints}</p>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">Diagnoses</p>
              <p className="leading-relaxed">{record.diagnoses.length ? record.diagnoses.join(', ') : 'Not documented'}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">AI Summary</h3>
              {record.aiReport.interactions.length ? (
                <ul className="list-disc space-y-1 pl-5 text-sm">
                  {record.aiReport.interactions.map((interaction, index) => (
                    <li key={`${record.id}-interaction-${index}`}>
                      <span className="font-medium capitalize">{interaction.drugs.join(' + ')}</span> · Severity: {interaction.severity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No interactions flagged.</p>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Faculty Feedback</h3>
              {record.facultyFeedback ? (
                <div className="rounded-md border border-gray-200 bg-gray-100 p-3 text-sm">
                  <p className="font-medium">{record.facultyFeedback.reviewer}</p>
                  <p className="text-xs text-gray-500">
                    {statusLabel[record.facultyFeedback.decision]}
                  </p>
                  <p className="mt-2 leading-relaxed">{record.facultyFeedback.notes}</p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Awaiting faculty review.</p>
              )}
            </div>
          </div>

          <footer className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
            <p>Logged on {new Date(record.createdAt).toLocaleString()}</p>
            <button
              type="button"
              className="rounded-md border border-gray-200 px-3 py-2 font-medium text-gray-900 hover:bg-gray-100"
              onClick={() => removeCase(record.id)}
            >
              Delete from local history
            </button>
          </footer>
        </article>
      ))}
    </div>
  );
}
