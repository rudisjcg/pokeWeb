"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { strings } from "@/lib/strings";
import { useAuth } from "./auth/AuthProvider";
import Button from "./ui/Button";

const links = [
  { href: "/pokedex", title: strings.nav.pokedex },
  { href: "/mylist", title: strings.nav.myList },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/pokedex") return pathname.startsWith("/pokedex") || pathname.startsWith("/pokemon");
  return pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { profile, loading, openLogin, openSignUp } = useAuth();

  // The mobile menu covers the page; lock scrolling behind it.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  /** "Mi lista" needs an account: signed-out visitors get the login instead of the page. */
  function guardLink(event: MouseEvent<HTMLAnchorElement>, href: string) {
    setMenuOpen(false);
    if (href === "/mylist" && !loading && !profile) {
      event.preventDefault();
      openLogin();
    }
  }

  const account = loading ? null : profile ? (
    <Link
      href="/mylist"
      data-testid="nav-user"
      onClick={() => setMenuOpen(false)}
      className="flex items-center gap-2 min-h-[44px] pl-1 pr-4 bg-ink-700 rounded-full font-medium"
    >
      {profile.avatarUrl && (
        <img src={profile.avatarUrl} alt="" className="w-9 h-9 rounded-full object-contain bg-ink-950" />
      )}
      <span>{profile.username}</span>
    </Link>
  ) : (
    <>
      <Button
        variant="ghost"
        onClick={() => {
          setMenuOpen(false);
          openLogin();
        }}
      >
        {strings.auth.logIn}
      </Button>
      <Button
        onClick={() => {
          setMenuOpen(false);
          openSignUp();
        }}
      >
        {strings.auth.signUp}
      </Button>
    </>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-30 h-[var(--nav-height)] bg-ink-900/85 backdrop-blur-md border-b border-line">
      <nav
        aria-label={strings.nav.main}
        className="h-full max-w-page mx-auto px-4 sm:px-6 flex items-center justify-between gap-6"
      >
        <Link href="/" className="flex items-center gap-2 min-h-[44px]" onClick={() => setMenuOpen(false)}>
          <img src="/assets/logo.svg" alt="" className="w-[72px] h-8 object-contain" />
          <span className="font-display font-bold text-[20px]">Wiki</span>
        </Link>

        <ul className="hidden md:flex items-stretch h-full gap-2">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href} className="flex">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={(event) => guardLink(event, link.href)}
                  className={`relative flex items-center px-4 font-display font-semibold text-[16px] transition-colors ${
                    active ? "text-fg" : "text-muted hover:text-fg"
                  }`}
                >
                  {link.title}
                  {active && <span className="absolute inset-x-3 bottom-0 h-[3px] bg-volt -skew-x-[30deg]" />}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden md:flex items-center gap-3 min-w-[180px] justify-end">{account}</div>

        <button
          type="button"
          className="md:hidden w-11 h-11 grid place-items-center"
          aria-label={menuOpen ? strings.nav.closeMenu : strings.nav.menu}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <img src={menuOpen ? "/assets/close.svg" : "/assets/menu.svg"} alt="" className="w-7 h-7" />
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[var(--nav-height)] bottom-0 bg-ink-950 px-6 py-8 flex flex-col gap-8 overflow-y-auto">
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href} className="border-b border-line">
                <Link
                  href={link.href}
                  aria-current={isActive(pathname, link.href) ? "page" : undefined}
                  onClick={(event) => guardLink(event, link.href)}
                  className="flex items-center min-h-[64px] font-display font-bold text-[28px]"
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3">{account}</div>
        </div>
      )}
    </header>
  );
}
