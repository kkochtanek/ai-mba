import { team } from "@/lib/team-data";
import Crest from "./Crest";

export default function Footer() {
  return (
    <footer className="mt-20">
      <div className="h-2 stripe-edge" />
      <div className="bg-navy-900 text-navy-100">
        <div className="max-w-5xl mx-auto px-5 py-12 grid gap-8 sm:grid-cols-3 text-sm">
          <div className="flex gap-3">
            <Crest className="w-9 h-9 shrink-0" />
            <div>
              <p className="font-display text-white text-base tracking-wide mb-2">
                Meramec Kindergarten · Purple Team
              </p>
              <p className="text-navy-100/80">
                {team.league}
                <br />
                Shaw Park, {team.city}
              </p>
            </div>
          </div>
          <div>
            <p className="font-bold text-orange-600 uppercase tracking-wide text-xs mb-2">
              Weather &amp; Cancellations
            </p>
            <p className="text-navy-100/80">
              Sports Hotline: {team.weatherHotline}
              <br />
              Updated ~2 hours before any practice or game.
            </p>
          </div>
          <div>
            <p className="font-bold text-orange-600 uppercase tracking-wide text-xs mb-2">
              Schedule &amp; Alerts
            </p>
            <p className="text-navy-100/80">
              Full schedule and cancellation sign-up on{" "}
              <a
                href={team.teamSidelineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-orange-600/60 text-white hover:text-orange-600"
              >
                TeamSideline
              </a>
              .
            </p>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-navy-100/60 font-semibold uppercase tracking-wide">
          Go Purple! · {team.season}
        </div>
      </div>
    </footer>
  );
}
