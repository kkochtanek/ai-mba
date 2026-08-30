import type { Metadata } from "next";
import { practices, seasonMilestones, team, nextEvent, games, byeWeeks } from "@/lib/team-data";
import ShawParkMap from "../components/ShawParkMap";

export const metadata: Metadata = {
  title: "Schedule — Meramec 2nd Grade Mustangs",
};

type Row =
  | { kind: "game"; week: number; game: (typeof games)[number] }
  | { kind: "bye"; week: number; bye: (typeof byeWeeks)[number] };

export default function SchedulePage() {
  const rows: Row[] = [
    ...games.map((game) => ({ kind: "game" as const, week: game.week, game })),
    ...byeWeeks.map((bye) => ({ kind: "bye" as const, week: bye.week, bye })),
  ].sort((a, b) => a.week - b.week);

  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <p className="text-xs uppercase tracking-widest text-silver-700 font-bold mb-2">
        {team.season}
      </p>
      <h1 className="font-display text-5xl text-navy-900 mb-3">Schedule</h1>
      <p className="text-text-muted max-w-2xl mb-10">
        Wednesday practices continue all season. Full 2026 game slate below,
        from TeamSideline (Clayton / Combest).
      </p>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-white border border-navy-100 p-7 shadow-sm">
            <h2 className="font-display text-xl text-navy-900 mb-5 border-b-2 border-silver-600 pb-2">
              Practices
            </h2>
            <div className="space-y-5">
              {practices.map((p) => (
                <div key={p.day} className="flex gap-4">
                  <span className="font-display text-3xl text-silver-700 leading-none w-12 shrink-0">
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
            <h2 className="font-display text-xl text-navy-900 mb-5 border-b-2 border-silver-600 pb-2">
              Games
            </h2>
            <div className="divide-y divide-navy-100">
              {rows.map((row) =>
                row.kind === "game" ? (
                  <div key={`g-${row.week}`} className="py-4 flex gap-4">
                    <span className="font-display text-2xl text-silver-700 leading-none w-14 shrink-0 pt-0.5">
                      W{row.week}
                    </span>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <p className="font-bold text-navy-900">{row.game.date}</p>
                        <span className="text-xs font-bold uppercase tracking-wide text-silver-700">
                          {row.game.home ? "Home" : "Away"}
                        </span>
                        {row.game.result && (
                          <span className="text-xs font-bold uppercase tracking-wide text-navy-700">
                            {row.game.result}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-navy-700">
                        {row.game.time} vs. <strong>{row.game.opponent}</strong>
                      </p>
                      <p className="text-sm text-text-muted mt-0.5">{row.game.location}</p>
                      {row.game.note && (
                        <p className="text-sm text-silver-700 mt-1 font-semibold">{row.game.note}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div key={`b-${row.week}`} className="py-3 flex gap-4 items-baseline">
                    <span className="font-display text-lg text-navy-100 w-14 shrink-0">—</span>
                    <p className="text-sm text-text-muted">
                      Week {row.week}: <span className="font-semibold text-navy-700">{row.bye.label}</span>
                      {row.bye.note ? ` — ${row.bye.note}` : ""}
                    </p>
                  </div>
                )
              )}
            </div>
          </section>

          <section className="bg-navy-900 text-white p-7">
            <h2 className="font-display text-lg mb-2">Weather &amp; Cancellations</h2>
            <p className="text-navy-100/85 text-sm leading-relaxed">
              Call the Sports Hotline at{" "}
              <span className="font-bold text-white">{team.weatherHotline}</span> —
              it&apos;s updated about two hours before any practice or game. The
              coaches also email as soon as they know either way.
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
