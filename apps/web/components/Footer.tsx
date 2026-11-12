import Link from "next/link";
import { strings } from "@/lib/strings";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink-900 mt-24">
      <div className="max-w-page mx-auto px-4 sm:px-6 py-10 grid gap-8 md:grid-cols-[1fr_auto]">
        <div className="max-w-[60ch]">
          <p className="font-display font-bold text-[20px]">{strings.meta.title}</p>
          <p className="text-muted mt-1">{strings.footer.tagline}</p>
          <p className="text-muted text-[13px] mt-6">
            {strings.footer.disclaimer} {strings.footer.data}
          </p>
        </div>
        <ul className="flex md:flex-col gap-x-6 gap-y-1 font-medium">
          <li>
            <Link className="inline-flex items-center min-h-[44px] hover:text-volt" href="/pokedex">
              {strings.nav.pokedex}
            </Link>
          </li>
          <li>
            <Link className="inline-flex items-center min-h-[44px] hover:text-volt" href="/mylist">
              {strings.nav.myList}
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
