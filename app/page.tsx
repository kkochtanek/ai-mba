import Link from "next/link";
import ShawParkMap from "./components/ShawParkMap";
import { team, seasonMilestones, news, practices, nextEvent } from "@/lib/team-data";

export default function Home() {
  const latestNews = news.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-900 text-white">
        <div className="absolute inset-0 bg-dot-pattern opacity-[0.08]" />
        <div className="absolute top-0 right-0 w-40 h-3 stripe-edge -rotate-12 translate-x-10 -translate-y-1 opacity-80" />
        <div className="relative max-w-5xl mx-auto px-5 py-20 sm:py-28 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/purple-popsicles-logo.jpg"
            alt="Purple Popsicles crest"
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-orange-600 shadow-lg mx-auto mb-6"
          />
          <span className="inline-flex items-center gap-2 border border-orange-600 text-orange-600 rounded-none px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6">
            {team.league}
          </span>
          <h1 className="font-display text-5xl sm:text-7xl leading-[0.95] mb-5">
            Go Purple Popsicles!
          </h1>
          <p className="text-lg sm:text-xl text-navy-100/85 max-w-2xl mx-auto mb-8 font-medium">
            The Meramec Kindergarten Purple Popsicles — {team.roster} kindergartners from{" "}
            {team.school} playing their very first season of soccer together at Shaw
            Park, {team.city}.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/schedule"
              className="bg-orange-600 text-white font-bold uppercase tracking-wide text-sm px-7 py-3.5 shadow hover:bg-orange-700 transition-colors"
            >
              View Schedule
            </Link>
            <Link
              href="/team"
              className="border border-white/40 font-bold uppercase tracking-wide text-sm px-7 py-3.5 hover:bg-white/10 transition-colors"
            >
              Meet the Team
            </Link>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="max-w-5xl mx-auto px-5 -mt-9 relative">
        <div className="bg-white shadow-lg border border-navy-100 grid grid-cols-2 sm:grid-cols-4 divide-x divide-navy-100">
          {seasonMilestones.map((m) => (
            <div key={m.label} className="px-4 py-6 text-center">
              <p className="text-[0.65rem] uppercase tracking-widest text-orange-700 font-bold mb-1">
                {m.label}
              </p>
              <p className="font-bold text-navy-900 text-sm sm:text-base">{m.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Next up + map */}
      <section className="max-w-5xl mx-auto px-5 py-16 grid gap-6 sm:grid-cols-5">
        <div className="sm:col-span-2 bg-navy-900 text-white p-7 flex flex-col">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-orange-600 mb-2">
            Next Up
          </p>
          <h2 className="font-display text-3xl mb-1">{nextEvent.kind}</h2>
          <p className="text-navy-100/90 font-semibold mb-4">{nextEvent.day}</p>
          <dl className="space-y-3 text-sm mb-6">
            <div className="flex justify-between gap-3 border-t border-white/10 pt-3">
              <dt className="text-navy-100/70">Time</dt>
              <dd className="font-bold">{nextEvent.time}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-white/10 pt-3">
              <dt className="text-navy-100/70">Where</dt>
              <dd className="font-bold text-right">{nextEvent.location}</dd>
            </div>
          </dl>
          <p className="text-sm text-navy-100/70 mt-auto">{nextEvent.note}</p>
          <Link
            href="/schedule"
            className="inline-block mt-5 text-sm font-bold uppercase tracking-wide text-orange-600 hover:text-orange-100"
          >
            Full schedule →
          </Link>
        </div>

        <div className="sm:col-span-3 bg-white border border-navy-100 p-5">
          <ShawParkMap activeField={nextEvent.field} />
          <p className="text-xs text-text-muted mt-3">
            Official Shaw Park field map (City of Clayton) — Field {nextEvent.field} is
            pinned for the next {nextEvent.kind.toLowerCase()}.
          </p>
        </div>
      </section>

      {/* Weekly practice */}
      <section className="max-w-5xl mx-auto px-5 pb-16">
        <h2 className="font-display text-2xl text-navy-900 mb-5">Weekly Practice</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {practices.map((p) => (
            <div key={p.day} className="bg-navy-50 border border-navy-100 p-5 flex gap-4">
              <span className="font-display text-3xl text-orange-600 leading-none w-12 shrink-0">
                {p.field}
              </span>
              <div>
                <p className="font-bold text-navy-900">
                  {p.day}s · {p.time}
                </p>
                <p className="text-sm text-navy-700 font-semibold">{p.location}</p>
                <p className="text-sm text-text-muted mt-0.5">{p.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* News preview */}
      <section className="max-w-5xl mx-auto px-5 pb-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl text-navy-900">Latest News</h2>
          <Link href="/news" className="text-sm font-bold uppercase tracking-wide text-orange-700 hover:text-orange-600">
            See all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {latestNews.map((n) => (
            <div key={n.title} className="bg-white border border-navy-100 p-5 shadow-sm">
              <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-1">
                {n.date}
              </p>
              <p className="font-display text-lg text-navy-900 mb-1.5 leading-snug">{n.title}</p>
              <p className="text-sm text-text-muted leading-relaxed">{n.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
