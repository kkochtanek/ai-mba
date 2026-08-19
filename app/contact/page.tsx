import type { Metadata } from "next";
import { coaches, team } from "@/lib/team-data";

export const metadata: Metadata = {
  title: "Contact — Meramec Kindergarten Purple Team",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold mb-2">
        {team.season}
      </p>
      <h1 className="font-heading text-4xl text-purple-900 mb-3">Contact</h1>
      <p className="text-purple-600 mb-10">
        Reach out through the team email list for anything about practices,
        games, or the roster.
      </p>

      <section className="bg-white rounded-3xl border border-purple-100 p-7 shadow-sm mb-6">
        <h2 className="font-heading text-xl text-purple-900 mb-4">Coaching Staff</h2>
        <ul className="divide-y divide-purple-100">
          {coaches.map((c) => (
            <li key={c.name} className="py-3 flex items-center justify-between gap-4">
              <span className="font-semibold text-purple-900">{c.name}</span>
              <span className="text-sm text-purple-500">{c.role}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white rounded-3xl border border-purple-100 p-7 shadow-sm mb-6">
        <h2 className="font-heading text-xl text-purple-900 mb-3">League Office</h2>
        <p className="text-sm text-purple-600 leading-relaxed">
          {team.league} handles registration, rosters, and field assignments
          for all Clayton youth soccer teams, including ours.
        </p>
      </section>

      <section className="bg-purple-900 text-white rounded-3xl p-7">
        <h2 className="font-heading text-xl mb-3">Weather Hotline</h2>
        <p className="text-purple-100 text-sm leading-relaxed mb-4">
          For same-day practice or game cancellations, call{" "}
          <span className="font-semibold text-white">{team.weatherHotline}</span>.
          It&apos;s updated about two hours before start time.
        </p>
        <a
          href={team.teamSidelineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-gold text-purple-900 font-bold px-5 py-2.5 rounded-full text-sm hover:brightness-105 transition-all"
        >
          Visit TeamSideline →
        </a>
      </section>
    </div>
  );
}
