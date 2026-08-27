import { team } from "@/lib/team-data";

export default function Footer() {
  return (
    <footer className="mt-20">
      <div className="h-2 stripe-edge" />
      <div className="bg-navy-900 text-navy-100">
        <div className="max-w-5xl mx-auto px-5 py-12 grid gap-8 sm:grid-cols-3 text-sm">
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/mustangs-logo.png" alt="Mustangs crest" className="w-12 h-12 object-contain shrink-0" />
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
              Full game schedule with times, opponents, and fields is on the{" "}
              <a
                href="/schedule"
                className="underline decoration-silver-600/60 text-white hover:text-silver-600"
              >
                Schedule
              </a>{" "}
              page.
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
