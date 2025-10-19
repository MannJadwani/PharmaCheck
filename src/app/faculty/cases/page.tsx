import Link from 'next/link';
import { FacultyCaseList } from '@/components/case-list/faculty-case-list';

export default function FacultyCasesPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">← Back to dashboard</Link>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Faculty review queue</h1>
          <p className="text-sm leading-relaxed text-gray-600">
            Review student submissions, view AI safety summaries, and leave feedback. Decisions are stored locally until we add backend syncing.
          </p>
        </div>
      </div>

      <section className="mx-auto mt-10 w-full max-w-6xl">
        <FacultyCaseList />
      </section>
    </main>
  );
}
