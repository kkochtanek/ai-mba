"use client";

import Link from "next/link";
import { useState } from "react";
import SoccerBall from "./SoccerBall";

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
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-purple-100">
      <div className="max-w-5xl mx-auto px-5 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-purple-600 text-white">
            <SoccerBall className="w-5 h-5" />
          </span>
          <span className="font-heading text-lg text-purple-900 leading-tight">
            Meramec Kindergarten
            <span className="block text-xs font-sans font-semibold tracking-wide text-purple-600 uppercase">
              Purple Team · 2026
            </span>
          </span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-4 py-2 rounded-full text-sm font-semibold text-purple-900 hover:bg-purple-50 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="sm:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-purple-50 text-purple-900"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <nav className="sm:hidden border-t border-purple-100 bg-white px-5 py-3 flex flex-col gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-semibold text-purple-900 hover:bg-purple-50 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
