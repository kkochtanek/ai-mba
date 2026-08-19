import type { Metadata } from "next";
import { news, team } from "@/lib/team-data";

export const metadata: Metadata = {
  title: "News — Meramec Kindergarten Purple Team",
};

const tagStyles: Record<string, string> = {
  Practice: "bg-purple-100 text-purple-700",
  Announcement: "bg-gold/20 text-amber-700",
  Coaches: "bg-grass/15 text-emerald-700",
  Schedule: "bg-purple-100 text-purple-700",
};

export default function NewsPage() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <p className="text-xs uppercase tracking-wide text-purple-500 font-semibold mb-2">
        {team.season}
      </p>
      <h1 className="font-heading text-4xl text-purple-900 mb-3">Team News</h1>
      <p className="text-purple-600 mb-10">
        Practice updates and season announcements from the coaches, newest first.
      </p>

      <ol className="relative border-l-2 border-purple-100 pl-8 space-y-10">
        {news.map((n) => (
          <li key={n.title} className="relative">
            <span className="absolute -left-[38px] top-1 w-4 h-4 rounded-full bg-purple-600 ring-4 ring-white" />
            <p className="text-xs font-semibold text-purple-500 uppercase tracking-wide mb-1">
              {n.date}
            </p>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <h2 className="font-heading text-xl text-purple-900">{n.title}</h2>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${tagStyles[n.tag]}`}>
                {n.tag}
              </span>
            </div>
            <p className="text-sm text-purple-600 leading-relaxed">{n.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
