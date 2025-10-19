import Link from 'next/link';
import { CaseForm } from '@/components/forms/case-form';

export default function NewCasePage() {
  return (
    <main className="min-h-screen space-y-10 bg-gray-50 px-4 py-10 sm:px-8">
      <Link href="/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900">
        ← Back to dashboard
      </Link>
      <CaseForm />
    </main>
  );
}
