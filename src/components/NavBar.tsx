import Link from "next/link";

export function NavBar() {
  return (
    <header className="border-b border-line bg-paper-raised">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl text-ink">
          Vantage <span className="text-amber-deep">College</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-slate">
          <Link href="/colleges" className="hover:text-ink transition-colors">
            Explore colleges
          </Link>
          <Link href="/compare" className="hover:text-ink transition-colors">
            Compare
          </Link>
        </nav>
      </div>
    </header>
  );
}
