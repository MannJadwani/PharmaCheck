import Link from 'next/link';
import { CaseSummary } from '@/components/dashboard/case-summary';
import { StudentCaseList } from '@/components/case-list/student-case-list';

export default function DashboardPage() {
  return (
    <main className="px-4 py-10 sm:px-6">
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-4 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <p className="text-xs uppercase tracking-wide text-gray-500">Clinical Posting Companion</p>
        <h1 className="text-3xl font-semibold sm:text-4xl">Your dashboard</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-gray-600">
          Track cases, see AI flags at a glance, and jump back into your clinical logging.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/student/cases/new"
            className="inline-flex items-center rounded-md bg-black px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-900"
          >
            Log a case
          </Link>
          <Link
            href="/faculty/cases"
            className="inline-flex items-center rounded-md border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
          >
            Faculty view
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-10 w-full max-w-6xl space-y-8">
        <CaseSummary />
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Your cases</h2>
            <Link href="/student/cases/new" className="text-sm font-medium text-blue-600 hover:underline">
              Add another
            </Link>
          </div>
          <StudentCaseList />
        </div>
      </section>
    </main>
  );
}

