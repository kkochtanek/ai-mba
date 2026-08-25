import type { Metadata } from "next";
import { coaches, team } from "@/lib/team-data";

export const metadata: Metadata = {
  title: "Contact — Meramec Kindergarten Purple Popsicles",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <p className="text-xs uppercase tracking-widest text-orange-700 font-bold mb-2">
        {team.season}
      </p>
      <h1 className="font-display text-5xl text-navy-900 mb-3">Contact</h1>
      <p className="text-text-muted mb-10">
        Reach out to a coach directly, or see the full{" "}
        <a href="/team" className="font-bold text-orange-700 underline">
          team directory
        </a>{" "}
        for every family&apos;s contact info.
      </p>

      <section className="bg-white border border-navy-100 p-7 shadow-sm mb-6">
        <h2 className="font-display text-lg text-navy-900 mb-4 border-b-2 border-orange-600 pb-2">
          Coaching Staff
        </h2>
        <ul className="divide-y divide-navy-100">
          {coaches.map((c) => (
            <li key={c.name} className="py-3 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <div>
                <span className="font-bold text-navy-900">{c.name}</span>{" "}
                <span className="text-xs font-bold uppercase tracking-wide text-orange-700">{c.role}</span>
              </div>
              <div className="text-sm text-text-muted flex gap-4">
                <a href={`mailto:${c.email}`} className="hover:text-navy-900 underline decoration-navy-100">
                  {c.email}
                </a>
                {c.phone && <span>{c.phone}</span>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-white border border-navy-100 p-7 shadow-sm mb-6">
        <h2 className="font-display text-lg text-navy-900 mb-3">League Office</h2>
        <p className="text-sm text-text-muted leading-relaxed">
          {team.league} handles registration, rosters, and field assignments
          for all Clayton youth soccer teams, including ours.
        </p>
      </section>

      <section className="bg-navy-900 text-white p-7">
        <h2 className="font-display text-lg mb-3">Weather Hotline</h2>
        <p className="text-navy-100/85 text-sm leading-relaxed mb-4">
          For same-day practice or game cancellations, call{" "}
          <span className="font-bold text-white">{team.weatherHotline}</span>.
          It&apos;s updated about two hours before start time.
        </p>
        <a
          href={team.teamSidelineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-orange-600 text-white font-bold uppercase tracking-wide text-sm px-5 py-3 hover:bg-orange-700 transition-colors"
        >
          Visit TeamSideline →
        </a>
      </section>
    </div>
  );
}
