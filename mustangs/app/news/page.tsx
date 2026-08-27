import type { Metadata } from "next";
import { news, team } from "@/lib/team-data";

export const metadata: Metadata = {
  title: "News — Meramec 2nd Grade Mustangs",
};

const tagStyles: Record<string, string> = {
  Practice: "bg-navy-100 text-navy-700",
  Announcement: "bg-silver-100 text-silver-700",
  Coaches: "bg-navy-900 text-white",
  Schedule: "bg-navy-100 text-navy-700",
};

export default function NewsPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <p className="text-xs uppercase tracking-widest text-silver-700 font-bold mb-2">
        {team.season}
      </p>
      <h1 className="font-display text-5xl text-navy-900 mb-3">Team News</h1>
      <p className="text-text-muted mb-10">
        Practice updates and season announcements from the coaches, newest first.
      </p>

      <ol className="relative border-l-2 border-navy-100 pl-8 space-y-10">
        {news.map((n) => (
          <li key={n.title} className="relative">
            <span className="absolute -left-[39px] top-1 w-4 h-4 bg-silver-600 ring-4 ring-[var(--background)]" />
            <p className="text-xs font-bold text-silver-700 uppercase tracking-wide mb-1">
              {n.date}
            </p>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h2 className="font-display text-xl text-navy-900">{n.title}</h2>
              <span className={`text-xs font-bold uppercase px-2.5 py-0.5 ${tagStyles[n.tag]}`}>
                {n.tag}
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">{n.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
