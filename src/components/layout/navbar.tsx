'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinkBase =
  'inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100';

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/' && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`${navLinkBase} ${active ? 'text-gray-900 bg-gray-100' : ''}`}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-black text-white">💊</span>
            <span className="text-sm font-semibold tracking-tight text-gray-900">PharmaCheck</span>
          </Link>
        </div>
        <nav className="hidden items-center gap-2 sm:flex">
          <NavLink href="/" label="Home" />
          <NavLink href="/dashboard" label="Dashboard" />
          <NavLink href="/student/cases/new" label="Log a Case" />
          <NavLink href="/faculty/cases" label="Faculty" />
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/student/cases/new"
            className="inline-flex items-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white hover:bg-gray-900"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}

