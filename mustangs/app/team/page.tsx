import type { Metadata } from "next";
import { coaches, team } from "@/lib/team-data";

export const metadata: Metadata = {
  title: "Team — Meramec 2nd Grade Mustangs",
};

export default function TeamPage() {
  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <p className="text-xs uppercase tracking-widest text-silver-700 font-bold mb-2">
        {team.season}
      </p>
      <h1 className="font-display text-5xl text-navy-900 mb-3">Team Directory</h1>
      <p className="text-text-muted max-w-2xl mb-10">
        Coaches for the Mustangs. Player names and family contact info stay
        off this public site — the full roster and family directory go out
        directly from Coach Dan.
      </p>

      <section>
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
    </div>
  );
}
