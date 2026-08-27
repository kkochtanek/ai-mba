import { team, coaches } from "@/lib/team-data";
import Crest from "./Crest";

export default function Footer() {
  const headCoach = coaches[0];

  return (
    <footer className="mt-20">
      <div className="h-2 stripe-edge" />
      <div className="bg-navy-900 text-navy-100">
        <div className="max-w-5xl mx-auto px-5 py-12 grid gap-8 sm:grid-cols-3 text-sm">
          <div className="flex gap-3">
            <Crest className="w-10 h-10 shrink-0" />
            <div>
              <p className="font-display text-white text-base tracking-wide mb-2">
                Meramec 2nd Grade · Mustangs
              </p>
              <p className="text-navy-100/80">
                {team.league}
                <br />
                Shaw Park, {team.city}
              </p>
            </div>
          </div>
          <div>
            <p className="font-bold text-silver-600 uppercase tracking-wide text-xs mb-2">
              Weather &amp; Cancellations
            </p>
            <p className="text-navy-100/80">
              Sports Hotline: {team.weatherHotline}
              <br />
              Updated ~2 hours before any practice or game.
            </p>
          </div>
          <div>
            <p className="font-bold text-silver-600 uppercase tracking-wide text-xs mb-2">
              Schedule Questions
            </p>
            <p className="text-navy-100/80">
              Coach Dan has the full game schedule with times, opponents, and
              fields —{" "}
              <a
                href={`mailto:${headCoach.email}`}
                className="underline decoration-silver-600/60 text-white hover:text-silver-600"
              >
                {headCoach.email}
              </a>
              .
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-navy-100/60 font-semibold uppercase tracking-wide">
          Go Mustangs! · {team.season}
        </div>
      </div>
    </footer>
  );
}
