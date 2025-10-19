'use client';

import { useMemo, useState } from 'react';
import { useCaseStore } from '@/components/providers/case-store-provider';
import { CaseRecord } from '@/lib/types';

const decisionLabels = {
  approve: 'Approve case',
  needsRevision: 'Request revision',
};

export function FacultyCaseList() {
  const { cases, isReady, updateCase } = useCaseStore();
  const [revisionNotesById, setRevisionNotesById] = useState<Record<string, string>>({});

  const reviewQueue = useMemo(
    () =>
      cases.filter((record) => record.status === 'submitted' || record.status === 'needs_revision'),
    [cases]
  );

  const handleDecision = (
    record: CaseRecord,
    decision: 'approve' | 'needsRevision',
    notes?: string
  ) => {
    const now = new Date().toISOString();
    updateCase(record.id, (existing) => ({
      ...existing,
      status: decision === 'approve' ? 'approved' : 'needs_revision',
      facultyFeedback: {
        reviewer: 'Faculty Reviewer',
        decision: decision === 'approve' ? 'approved' : 'needs_revision',
        notes:
          decision === 'approve'
            ? 'Looks good. Ensure follow-up labs are documented in the next visit.'
            : (notes && notes.trim().length > 0
                ? notes
                : 'Please provide more details.'),
        reviewedAt: now,
      },
      updatedAt: now,
    }));
  };

  if (!isReady) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-sm text-gray-500">
        Loading case submissions...
      </div>
    );
  }

  if (reviewQueue.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 p-10 text-center text-sm text-gray-500">
        No cases waiting for review. Encourage students to submit new encounters.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviewQueue.map((record) => (
        <article key={record.id} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <header className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500">{record.studentName}</p>
              <h2 className="text-lg font-semibold">Patient {record.patient.patientCode}</h2>
              <p className="text-sm text-gray-600">Batch {record.studentBatch}</p>
            </div>
            <p className="text-xs text-gray-500">Submitted {new Date(record.createdAt).toLocaleString()}</p>
          </header>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 text-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">Chief complaints</p>
              <p className="leading-relaxed text-gray-700">{record.chiefComplaints}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500">History</p>
              <p className="leading-relaxed text-gray-700">{record.history}</p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-xs uppercase tracking-wide text-gray-500">Prescriptions</p>
              <ul className="space-y-2">
                {record.medications.map((med, index) => (
                  <li key={`${record.id}-med-${index}`} className="rounded-md border border-gray-200 bg-gray-50 p-3">
                    <p className="font-medium text-gray-800">{med.name}</p>
                    <p className="text-xs text-gray-600">
                      {med.dose} · {med.route} · {med.frequency} · {med.duration}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Student analysis</h3>
              <p className="text-sm text-gray-700">{record.analysis.rationale || 'No rationale supplied.'}</p>
              {record.analysis.interventions && (
                <p className="text-sm text-gray-700">Suggested: {record.analysis.interventions}</p>
              )}
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">AI summary</h3>
              {record.aiReport.interactions.length ? (
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700">
                  {record.aiReport.interactions.map((interaction, index) => (
                    <li key={`${record.id}-ai-${index}`}>
                      <span className="font-medium capitalize">{interaction.drugs.join(' + ')}</span> — Severity {interaction.severity}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No interactions flagged.</p>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Feedback for revision</label>
              <textarea
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                placeholder="Write actionable feedback for the student..."
                value={revisionNotesById[record.id] || ''}
                onChange={(e) =>
                  setRevisionNotesById((prev) => ({ ...prev, [record.id]: e.target.value }))
                }
                rows={3}
              />
            </div>

            <footer className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                onClick={() => handleDecision(record, 'approve')}
              >
                {decisionLabels.approve}
              </button>
              <button
                type="button"
                className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={!((revisionNotesById[record.id] || '').trim().length)}
                onClick={() => handleDecision(record, 'needsRevision', revisionNotesById[record.id] || '')}
                title={!((revisionNotesById[record.id] || '').trim().length) ? 'Add feedback to request revision' : ''}
              >
                {decisionLabels.needsRevision}
              </button>
            </footer>
          </section>
        </article>
      ))}
    </div>
  );
}
