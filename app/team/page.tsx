import type { Metadata } from "next";
import { coaches, equipment, team } from "@/lib/team-data";

export const metadata: Metadata = {
  title: "Team — Meramec Kindergarten Purple Team",
};

export default function TeamPage() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold mb-2">
        {team.season}
      </p>
      <h1 className="font-heading text-4xl text-purple-900 mb-3">Our Team</h1>
      <p className="text-purple-600 max-w-2xl mb-10">
        {team.roster} kindergartners from {team.school}, playing in the{" "}
        {team.league}. Everybody&apos;s new to organized soccer this year — the
        goal is simple: have fun, learn the game, and be good teammates.
      </p>

      <section className="mb-14">
        <h2 className="font-heading text-2xl text-purple-900 mb-5">Coaches</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {coaches.map((c) => (
            <div key={c.name} className="bg-white rounded-3xl border border-purple-100 p-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 font-heading text-lg flex items-center justify-center mb-4">
                {c.initials}
              </div>
              <p className="font-heading text-purple-900 text-lg mb-0.5">{c.name}</p>
              <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-3">
                {c.role}
              </p>
              <p className="text-sm text-purple-600 leading-relaxed">{c.blurb}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 mb-14">
        <section className="bg-purple-50 rounded-3xl border border-purple-100 p-7">
          <h2 className="font-heading text-xl text-purple-900 mb-3">The Roster</h2>
          <p className="text-sm text-purple-600 leading-relaxed mb-3">
            {team.roster} kindergartners make up the Purple Team this season,
            including Kennedy K., an incoming kindergartner at {team.school}.
          </p>
          <p className="text-sm text-purple-600 leading-relaxed">
            Team name: still being decided! The players have been asked to bring
            their best ideas to practice — stay tuned.
          </p>
        </section>

        <section className="bg-white rounded-3xl border border-purple-100 p-7">
          <h2 className="font-heading text-xl text-purple-900 mb-3">What to Bring</h2>
          <ul className="space-y-2 text-sm text-purple-700">
            {equipment.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-purple-400">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="bg-purple-900 text-white rounded-3xl p-8 text-center">
        <h2 className="font-heading text-2xl mb-2">Want to help coach?</h2>
        <p className="text-purple-100 max-w-xl mx-auto text-sm">
          No soccer experience needed — the team is always glad for another set
          of hands at practices and games. Reach out through the team contact
          list if you&apos;d like to join the sideline.
        </p>
      </section>
    </div>
  );
}
