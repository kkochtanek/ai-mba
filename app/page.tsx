import Link from "next/link";
import SoccerBall from "./components/SoccerBall";
import { team, seasonMilestones, news, practices } from "@/lib/team-data";

export default function Home() {
  const latestNews = news.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-700 to-purple-900 text-white">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="relative max-w-5xl mx-auto px-5 py-20 sm:py-28 text-center">
          <span className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <SoccerBall className="w-4 h-4" />
            {team.league}
          </span>
          <h1 className="font-heading text-4xl sm:text-6xl leading-tight mb-4">
            Go Purple!
          </h1>
          <p className="text-lg sm:text-xl text-purple-100 max-w-2xl mx-auto mb-8">
            The Meramec Kindergarten Purple Team — {team.roster} kindergartners from{" "}
            {team.school} playing their very first season of soccer together at Shaw
            Park, {team.city}.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/schedule"
              className="bg-gold text-purple-900 font-bold px-6 py-3 rounded-full shadow hover:brightness-105 transition-all"
            >
              View Schedule
            </Link>
            <Link
              href="/team"
              className="bg-white/10 border border-white/40 font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition-all"
            >
              Meet the Coaches
            </Link>
          </div>
        </div>
      </section>

      {/* Quick facts */}
      <section className="max-w-5xl mx-auto px-5 -mt-10 relative">
        <div className="bg-white rounded-3xl shadow-lg border border-purple-100 grid grid-cols-2 sm:grid-cols-4 divide-x divide-purple-100">
          {seasonMilestones.map((m) => (
            <div key={m.label} className="px-4 py-6 text-center">
              <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold mb-1">
                {m.label}
              </p>
              <p className="font-heading text-purple-900 text-sm sm:text-base">{m.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Next up + featured player */}
      <section className="max-w-5xl mx-auto px-5 py-16 grid gap-6 sm:grid-cols-5">
        <div className="sm:col-span-3 bg-purple-50 rounded-3xl p-7 border border-purple-100">
          <h2 className="font-heading text-2xl text-purple-900 mb-4">This Week</h2>
          <ul className="space-y-4">
            {practices.map((p) => (
              <li key={p.day} className="flex gap-4 items-start">
                <span className="mt-0.5 flex items-center justify-center w-9 h-9 rounded-full bg-purple-600 text-white shrink-0">
                  <SoccerBall className="w-4.5 h-4.5" />
                </span>
                <div>
                  <p className="font-semibold text-purple-900">
                    {p.day} Practice · {p.time}
                  </p>
                  <p className="text-sm text-purple-700">{p.location}</p>
                  <p className="text-sm text-purple-500">{p.note}</p>
                </div>
              </li>
            ))}
          </ul>
          <Link
            href="/schedule"
            className="inline-block mt-5 text-sm font-semibold text-purple-700 hover:text-purple-900"
          >
            Full schedule &amp; game info →
          </Link>
        </div>

        <div className="sm:col-span-2 bg-white rounded-3xl p-7 border border-purple-100">
          <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold mb-2">
            Featured Player
          </p>
          <h2 className="font-heading text-2xl text-purple-900 mb-1">Kennedy K.</h2>
          <p className="text-purple-700 text-sm mb-4">
            Incoming Kindergartner, {team.school}
          </p>
          <p className="text-sm text-purple-600 leading-relaxed">
            Kennedy&apos;s dad Kyle joined the coaching staff this season — you&apos;ll
            find him on the sideline at every practice and game, cheering on the whole
            Purple Team.
          </p>
        </div>
      </section>

      {/* News preview */}
      <section className="max-w-5xl mx-auto px-5 pb-20">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-2xl text-purple-900">Latest News</h2>
          <Link href="/news" className="text-sm font-semibold text-purple-700 hover:text-purple-900">
            See all →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {latestNews.map((n) => (
            <div key={n.title} className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
              <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-1">
                {n.date}
              </p>
              <p className="font-heading text-purple-900 mb-1.5">{n.title}</p>
              <p className="text-sm text-purple-600 leading-relaxed">{n.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
