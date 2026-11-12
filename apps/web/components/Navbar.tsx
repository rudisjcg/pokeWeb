"use client";

import Link from "next/link";
import { useState } from "react";
import { styles } from "@/lib/constants";
import { strings } from "@/lib/strings";

const links = [
  { href: "/", title: strings.nav.home },
  { href: "/pokedex", title: strings.nav.pokedex },
  { href: "/mylist", title: strings.nav.myList },
] as const;

const desktopLinkClass =
  "hover:text-white transition-all hover:scale-110 text-[18px] font-medium cursor-pointer";

export default function Navbar() {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);

  return (
    <nav className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-primary`}>
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 animate-fade-right "
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/logo.svg"
            alt=""
            className="w-20 h-9 object-contain hover:scale-110 transition-all"
          />
          <p className="text-white text-[18px] font-bold cursor pointer flex hover:scale-110 transition-all">
            {strings.nav.brand} &nbsp; <span className="sm:block hidden">{strings.nav.brandSuffix}</span>
          </p>
        </Link>

        <ul className="list-none hidden sm:flex flex-row gap-10 animate-fade-left">
          {links.map((link) => (
            <li key={link.href} className={desktopLinkClass}>
              <Link href={link.href}>{link.title}</Link>
            </li>
          ))}
        </ul>

        <div className="sm:hidden flex flex-1 justify-end items-center">
          <button type="button" aria-label={strings.nav.menu} aria-expanded={toggle} onClick={() => setToggle(!toggle)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={toggle ? "/assets/close.svg" : "/assets/menu.svg"}
              alt=""
              className="w-[28px] h-[28px] object-contain cursor-pointer"
            />
          </button>
          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
          >
            <ul className="list-none flex justify-end flex-col gap-4">
              {links.slice(1).map((link) => (
                <li
                  key={link.href}
                  className={`${
                    active === link.title ? "text-white" : "text-secondary"
                  } font-poppins font-medium cursor-pointer text-[16px]`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(link.title);
                  }}
                >
                  <Link href={link.href}>{link.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
