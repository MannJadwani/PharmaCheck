export function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} PharmaCheck. For education only.</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <a className="hover:text-gray-900" href="#">Privacy</a>
            <a className="hover:text-gray-900" href="#">Terms</a>
            <a className="hover:text-gray-900" href="#">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

