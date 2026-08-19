import type { Metadata } from "next";
import { practices, seasonMilestones, team } from "@/lib/team-data";
import SoccerBall from "../components/SoccerBall";

export const metadata: Metadata = {
  title: "Schedule — Meramec Kindergarten Purple Team",
};

export default function SchedulePage() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold mb-2">
        {team.season}
      </p>
      <h1 className="font-heading text-4xl text-purple-900 mb-3">Schedule</h1>
      <p className="text-purple-600 max-w-2xl mb-10">
        Practices happen every week at Shaw Park. Games start the weekend of
        August 29th — the full slate posts to TeamSideline once the league
        releases it.
      </p>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-white rounded-3xl border border-purple-100 p-7 shadow-sm">
            <h2 className="font-heading text-2xl text-purple-900 mb-5">Practices</h2>
            <div className="space-y-5">
              {practices.map((p) => (
                <div key={p.day} className="flex gap-4">
                  <span className="mt-0.5 flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 text-white shrink-0">
                    <SoccerBall className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-purple-900">
                      {p.day}s · {p.time}
                    </p>
                    <p className="text-sm text-purple-700">{p.location}</p>
                    <p className="text-sm text-purple-500 mt-0.5">{p.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-purple-100 p-7 shadow-sm">
            <h2 className="font-heading text-2xl text-purple-900 mb-4">Games</h2>
            <ul className="space-y-2 text-sm text-purple-700">
              <li>• Begin the weekend of August 29 – 30, 2026</li>
              <li>• Played Saturdays &amp; Sundays</li>
              <li>
                • Full schedule posted on{" "}
                <a
                  href={team.teamSidelineUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-purple-700 underline hover:text-purple-900"
                >
                  TeamSideline
                </a>
              </li>
              <li>• Snack rotation sign-up shared once game dates are set</li>
            </ul>
          </section>

          <section className="bg-purple-900 text-white rounded-3xl p-7">
            <h2 className="font-heading text-xl mb-2">Weather &amp; Cancellations</h2>
            <p className="text-purple-100 text-sm leading-relaxed">
              Call the Sports Hotline at{" "}
              <span className="font-semibold text-white">{team.weatherHotline}</span> —
              it&apos;s updated about two hours before any practice or game. The
              coaches also email as soon as they know either way, and you can opt
              into text alerts on TeamSideline.
            </p>
          </section>
        </div>

        <aside className="lg:col-span-2 space-y-6">
          <div className="bg-purple-50 rounded-3xl border border-purple-100 p-6">
            <h3 className="font-heading text-lg text-purple-900 mb-4">Season at a Glance</h3>
            <dl className="space-y-3 text-sm">
              {seasonMilestones.map((m) => (
                <div key={m.label} className="flex justify-between gap-4">
                  <dt className="text-purple-500">{m.label}</dt>
                  <dd className="text-purple-900 font-semibold text-right">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white rounded-3xl border border-purple-100 p-6">
            <h3 className="font-heading text-lg text-purple-900 mb-2">Where to Play</h3>
            <p className="text-sm text-purple-600 leading-relaxed">
              All practices and home games are at <strong>Shaw Park</strong> in{" "}
              {team.city} — Fields 3, 5, and 5B. Check the posted field map at the
              park entrance if you&apos;re not sure which field is which.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
