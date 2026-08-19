"use client";

import Link from "next/link";
import { useState } from "react";
import Crest from "./Crest";

const links = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/team", label: "Team" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-navy-900 border-b-[3px] border-orange-600">
      <div className="max-w-5xl mx-auto px-5 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <Crest className="w-9 h-9" />
          <span className="leading-tight">
            <span className="block font-display text-white text-base tracking-wide">
              Meramec Kindergarten
            </span>
            <span className="block text-[0.65rem] font-bold tracking-[0.14em] text-orange-600 uppercase">
              Purple Team · 2026
            </span>
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 text-sm font-bold uppercase tracking-wide text-navy-100 hover:text-white hover:bg-white/10 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="sm:hidden w-10 h-10 flex items-center justify-center text-white"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="sm:hidden border-t border-white/10 bg-navy-900 px-5 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-navy-100 hover:text-white transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
