import type { Metadata } from "next";
import { practices, seasonMilestones, team, nextEvent, games, gameTimePattern, gameExceptions } from "@/lib/team-data";
import ShawParkMap from "../components/ShawParkMap";

export const metadata: Metadata = {
  title: "Schedule — Meramec Kindergarten Purple Popsicles",
};

export default function SchedulePage() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <p className="text-xs uppercase tracking-widest text-orange-700 font-bold mb-2">
        {team.season}
      </p>
      <h1 className="font-display text-5xl text-navy-900 mb-3">Schedule</h1>
      <p className="text-text-muted max-w-2xl mb-10">
        Practices happen every week at Shaw Park. Games start the weekend of
        August 29th — the full slate is live on TeamSideline.
      </p>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-white border border-navy-100 p-7 shadow-sm">
            <h2 className="font-display text-xl text-navy-900 mb-5 border-b-2 border-orange-600 pb-2">
              Practices
            </h2>
            <div className="space-y-5">
              {practices.map((p) => (
                <div key={p.day} className="flex gap-4">
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

          <section className="bg-white border border-navy-100 p-7 shadow-sm">
            <h2 className="font-display text-xl text-navy-900 mb-4 border-b-2 border-orange-600 pb-2">
              Games
            </h2>

            {games.length > 0 && (
              <div className="space-y-3 mb-5">
                {games.map((g) => (
                  <div key={g.date} className="flex gap-4">
                    <span className="font-display text-3xl text-orange-600 leading-none w-14 shrink-0">
                      {g.field}
                    </span>
                    <div>
                      <p className="font-bold text-navy-900">
                        {g.date} · {g.time}
                      </p>
                      <p className="text-sm text-navy-700 font-semibold">{g.location}</p>
                      {g.opponent && <p className="text-sm text-navy-700">vs. {g.opponent}</p>}
                      {g.note && <p className="text-sm text-text-muted mt-0.5">{g.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <p className="text-xs font-bold uppercase tracking-wide text-text-muted mb-2">
              Beyond that, the recurring pattern
            </p>
            <ul className="space-y-2 text-sm text-navy-700 mb-4">
              {gameTimePattern.map((line) => (
                <li key={line}>• {line}</li>
              ))}
              <li>• Snack rotation sign-up shared once game dates are set</li>
            </ul>

            {gameExceptions.length > 0 && (
              <div className="bg-orange-100 border border-orange-600/30 rounded p-3 mb-4">
                <p className="text-xs font-bold uppercase tracking-wide text-orange-700 mb-1">
                  Schedule Exception
                </p>
                {gameExceptions.map((g) => (
                  <p key={g.date} className="text-sm text-navy-900">
                    <strong>{g.date} · {g.time}</strong> — {g.note}
                  </p>
                ))}
              </div>
            )}

            <a
              href={team.teamSidelineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-orange-700 underline hover:text-orange-600 text-sm"
            >
              View the full schedule on TeamSideline →
            </a>
          </section>

          <section className="bg-navy-900 text-white p-7">
            <h2 className="font-display text-lg mb-2">Weather &amp; Cancellations</h2>
            <p className="text-navy-100/85 text-sm leading-relaxed">
              Call the Sports Hotline at{" "}
              <span className="font-bold text-white">{team.weatherHotline}</span> —
              it&apos;s updated about two hours before any practice or game. The
              coaches also email as soon as they know either way, and you can opt
              into text alerts on TeamSideline.
            </p>
          </section>
        </div>

        <aside className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-navy-100 p-5">
            <ShawParkMap activeField={nextEvent.field} />
            <p className="text-xs text-text-muted mt-3">
              Official Shaw Park field map (City of Clayton) — Field {nextEvent.field} is
              pinned for the next {nextEvent.kind.toLowerCase()} ({nextEvent.day}).
            </p>
          </div>

          <div className="bg-navy-50 border border-navy-100 p-6">
            <h3 className="font-display text-base text-navy-900 mb-4">Season at a Glance</h3>
            <dl className="space-y-3 text-sm">
              {seasonMilestones.map((m) => (
                <div key={m.label} className="flex justify-between gap-4">
                  <dt className="text-text-muted">{m.label}</dt>
                  <dd className="text-navy-900 font-bold text-right">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
