import type { Metadata } from "next";
import { coaches, families, team } from "@/lib/team-data";

export const metadata: Metadata = {
  title: "Team — Meramec 2nd Grade Mustangs",
};

export default function TeamPage() {
  const missing = team.roster - families.length;

  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <p className="text-xs uppercase tracking-widest text-silver-700 font-bold mb-2">
        {team.season}
      </p>
      <h1 className="font-display text-5xl text-navy-900 mb-3">Team Directory</h1>
      <p className="text-text-muted max-w-2xl mb-10">
        Coaches and team families for the Mustangs. Kids&apos; names are left off
        this public site — reach out to a coach for the full roster.
      </p>

      <section className="mb-14">
        <h2 className="font-display text-xl text-navy-900 mb-4 border-b-2 border-silver-600 pb-2">
          Coaches
        </h2>
        <div className="divide-y divide-navy-100 border-t border-navy-100">
          {coaches.map((c) => (
            <div key={c.name} className="py-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <div className="flex items-baseline gap-3">
                <span className="font-bold text-navy-900">{c.name}</span>
                <span className="text-xs font-bold uppercase tracking-wide text-silver-700">{c.role}</span>
              </div>
              {c.phone && <span className="text-sm text-text-muted">{c.phone}</span>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-xl text-navy-900 mb-4 border-b-2 border-silver-600 pb-2">
          Team Families
        </h2>
        <div className="divide-y divide-navy-100 border-t border-navy-100">
          {families.map((f, i) => (
            <div key={i} className="py-4 space-y-1">
              {f.guardians.map((g, j) => (
                <div
                  key={j}
                  className="text-sm text-text-muted flex flex-wrap gap-x-3 gap-y-0.5"
                >
                  {g.name && <span className="font-semibold text-navy-700">{g.name}</span>}
                  <a href={`mailto:${g.email}`} className="hover:text-navy-900 underline decoration-navy-100">
                    {g.email}
                  </a>
                  {g.phone && <span>{g.phone}</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
        {missing > 0 && (
          <p className="text-sm text-text-muted mt-6">
            {missing} more {missing === 1 ? "family" : "families"} on the {team.roster}-kid
            roster {missing === 1 ? "hasn't" : "haven't"} been confirmed yet —
            they&apos;ll be added here once we hear from Coach Dan.
          </p>
        )}
      </section>
    </div>
  );
}
