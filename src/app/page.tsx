import Link from 'next/link';
import Image from 'next/image';
import { ParallaxBackground } from '@/components/layout/parallax-background';

export default function LandingPage() {
  return (
    <main id="landing-scroll" className="relative h-[calc(100vh-56px)] overflow-y-auto snap-y snap-mandatory">
      <ParallaxBackground scrollContainerId="landing-scroll" />
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-300/40 via-fuchsia-300/30 to-blue-300/30 blur-3xl" />
        <svg aria-hidden className="absolute inset-x-0 top-0 -z-10 h-[500px] w-full stroke-gray-200">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Hero */}
      <section className="relative h-full snap-start flex flex-col items-center justify-center">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-14 px-6 py-20 sm:px-8 md:grid-cols-2 md:py-28">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 shadow-sm">
              <span>💊 Clinical Posting Companion</span>
              <span className="hidden text-gray-400 sm:inline">•</span>
              <span className="hidden text-gray-600 sm:inline">Local-first MVP</span>
            </div>
            <h1 className="text-balance text-6xl font-bold tracking-tight text-gray-900 sm:text-7xl">
              Safer prescriptions. Smarter case logs.
            </h1>
            <p className="max-w-2xl text-pretty text-xl leading-relaxed text-gray-600">
              Replace messy logbooks with an elegant workspace that checks interactions, highlights dose issues, and helps you learn faster.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/student/cases/new"
                className="inline-flex items-center rounded-md bg-black px-8 py-4 text-base font-semibold text-white shadow-sm transition hover:scale-[1.01] hover:bg-gray-900"
              >
                Log your first case
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-md border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-900 shadow-sm transition hover:bg-gray-100"
              >
                View dashboard
              </Link>
            </div>
            <div className="flex flex-wrap gap-6 pt-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" /> 100% local for MVP</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> AI feedback in seconds</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-fuchsia-500" /> Faculty-ready summaries</div>
            </div>
          </div>

          {/* Showcase Card */}
          <div className="relative">
            <div className="mx-auto w-full max-w-2xl rounded-2xl border border-gray-200 bg-white/80 p-6 shadow-xl backdrop-blur">
              <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-indigo-50 via-blue-50 to-fuchsia-50 p-5">
                <div className="h-80 w-full rounded-lg border border-dashed border-gray-300/70 bg-white/50" />
              </div>
              <div className="mt-5 grid grid-cols-3 gap-4 text-sm">
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-lg font-semibold text-gray-900">2×</p>
                  <p className="text-gray-600">Faster logging</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-lg font-semibold text-gray-900">Instant</p>
                  <p className="text-gray-600">AI feedback</p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-lg font-semibold text-gray-900">Local</p>
                  <p className="text-gray-600">Data only</p>
                </div>
              </div>
            </div>

            {/* Floating cards */}
            <div className="pointer-events-none absolute -right-8 -top-8 hidden w-52 rotate-3 md:block">
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-md">
                <p className="text-xs font-semibold text-gray-700">AI Summary</p>
                <p className="mt-1 text-xs text-gray-600">Ibuprofen + Metformin: monitor renal function.</p>
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-8 -left-8 hidden w-56 -rotate-2 md:block">
              <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-md">
                <p className="text-xs font-semibold text-gray-700">Dose Flag</p>
                <p className="mt-1 text-xs text-gray-600">Zopiclone caution in ≥65 years.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos / Social proof */}
      <section className="h-full snap-start flex flex-col items-center justify-center border-y border-gray-200 bg-white/50">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center gap-16 px-6 py-8 sm:px-8">
          {[
            { src: '/vercel.svg', alt: 'Vercel' },
            { src: '/next.svg', alt: 'Next.js' },
            { src: '/globe.svg', alt: 'Clinical' },
            { src: '/window.svg', alt: 'UI' },
            { src: '/file.svg', alt: 'Docs' },
          ].map((logo) => (
            <div key={logo.alt} className="flex items-center opacity-60 transition hover:opacity-90">
              <Image src={logo.src} alt={logo.alt} width={120} height={32} className="h-8 w-auto grayscale" />
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="h-full snap-start flex flex-col items-center justify-center mx-auto w-full max-w-7xl px-6 py-20 sm:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight">Everything you need for clinical postings</h2>
          <p className="mt-3 text-lg text-gray-600">
            Clean inputs, smart checks, and a focused review flow — designed for students and faculty.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            { icon: '🗂️', title: 'Structured logging', desc: 'Capture patient basics, diagnoses, and meds with instant validation.' },
            { icon: '🤖', title: 'AI safety check', desc: 'Find interactions, dosage issues, and missing data in seconds.' },
            { icon: '🧑‍🏫', title: 'Faculty workflow', desc: 'Approve or request changes with one click and clear comments.' },
            { icon: '🔒', title: 'Local-first', desc: 'Data stays on this device in the MVP; sync is coming.' },
            { icon: '⚡', title: 'Fast onboarding', desc: 'No accounts yet — start logging instantly.' },
            { icon: '🔌', title: 'Ready to grow', desc: 'Planned auth, DB, and licensed drug data integrations.' },
          ].map((f) => (
            <div key={f.title} className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-md">
              <div className="mb-4 text-3xl">{f.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-base text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="h-full snap-start flex flex-col items-center justify-center mx-auto w-full max-w-7xl px-6 pb-20 sm:px-8">
        <div className="grid items-start gap-10 md:grid-cols-2">
          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight">How it works</h2>
            <p className="text-lg text-gray-600">Three simple steps from patient encounter to faculty-ready case.</p>
          </div>
          <div className="grid gap-5">
            {[
              { n: 1, t: 'Log the case', d: 'Enter patient basics, history, diagnoses, and prescribed medications.' },
              { n: 2, t: 'Run AI check', d: 'We flag potential interactions, dose issues, and missing info.' },
              { n: 3, t: 'Submit for review', d: 'Share a clear, structured summary for quick faculty feedback.' },
            ].map((s) => (
              <div key={s.n} className="flex gap-5 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-base font-semibold text-white">{s.n}</div>
                <div>
                  <p className="text-lg font-medium text-gray-900">{s.t}</p>
                  <p className="text-base text-gray-600">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Split benefits: Students vs Faculty */}
      <section className="h-full snap-start flex flex-col items-center justify-center mx-auto w-full max-w-7xl px-6 pb-20 sm:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-3 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
              For Students
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Focus on learning, not formatting</h3>
            <ul className="mt-4 space-y-2 text-base text-gray-700">
              <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" /> Guided case inputs with instant validation</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-blue-500" /> AI flags interactions and dose issues</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-fuchsia-500" /> Export clean summaries for posting logs</li>
            </ul>
            <div className="mt-5">
              <Link href="/student/cases/new" className="inline-flex items-center rounded-md bg-black px-5 py-3 text-base font-semibold text-white hover:bg-gray-900">Start logging</Link>
            </div>
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-100/60 blur-2xl" />
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="mb-3 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-600">
              For Faculty
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Review more, type less</h3>
            <ul className="mt-4 space-y-2 text-base text-gray-700">
              <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-amber-500" /> Consistent case structure for quick scanning</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-purple-500" /> Clear flags and rationales to discuss in rounds</li>
              <li className="flex items-start gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-rose-500" /> Approve or request changes in one pass</li>
            </ul>
            <div className="mt-5">
              <Link href="/faculty/cases" className="inline-flex items-center rounded-md border border-gray-200 bg-white px-5 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100">See faculty view</Link>
            </div>
            <div className="pointer-events-none absolute -left-16 -bottom-16 h-40 w-40 rounded-full bg-fuchsia-100/60 blur-2xl" />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="h-full snap-start flex flex-col items-center justify-center mx-auto w-full max-w-7xl px-6 pb-10 sm:px-8">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold tracking-tight">FAQs</h2>
          <div className="mt-5 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
            {[
              {
                q: 'Where is my data stored?',
                a: 'In this MVP, everything stays on your device (local-first). Planned roadmap includes secure sync with authentication.',
              },
              {
                q: 'How does the AI check work?',
                a: 'We analyze your inputs to surface potential interactions, dose considerations, and missing data for you to verify with guidelines.',
              },
              {
                q: 'Can faculty use this for grading?',
                a: 'It helps standardize submissions and highlight discussion points. Final grading remains at faculty discretion.',
              },
            ].map((item) => (
              <details key={item.q} className="group px-6 py-5 open:bg-gray-50">
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-gray-900">
                  {item.q}
                  <span className="ml-4 inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-300 text-gray-500 group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-base text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="h-full snap-start flex flex-col items-center justify-center mx-auto w-full max-w-7xl px-6 pb-20 sm:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-12 shadow-sm md:p-14">
          <blockquote className="max-w-4xl text-balance text-2xl leading-relaxed text-gray-800">
            “The AI check helped me catch an interaction before presenting to my mentor. I spend less time formatting and more time understanding therapy.”
          </blockquote>
          <div className="mt-5 text-base text-gray-600">— Pharm D Student, Internal Medicine Posting</div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="h-full snap-start flex flex-col items-center justify-center mx-auto w-full max-w-7xl px-6 pb-24 sm:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50 via-blue-50 to-fuchsia-50 p-12 shadow-sm md:p-14">
          <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-3xl font-semibold text-gray-900">Start your first case now</h3>
              <p className="text-base text-gray-700">It takes under a minute to set up a patient file and run an AI safety check.</p>
            </div>
            <div className="flex gap-4">
              <Link href="/student/cases/new" className="inline-flex items-center rounded-md bg-black px-6 py-3 text-base font-semibold text-white hover:bg-gray-900">Log a case</Link>
              <Link href="/dashboard" className="inline-flex items-center rounded-md border border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-900 hover:bg-gray-100">View dashboard</Link>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/40 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/40 blur-2xl" />
        </div>
      </section>
    </main>
  );
}
