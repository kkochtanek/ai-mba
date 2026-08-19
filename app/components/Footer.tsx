import { team } from "@/lib/team-data";

export default function Footer() {
  return (
    <footer className="bg-purple-900 text-purple-100 mt-20">
      <div className="max-w-5xl mx-auto px-5 py-10 grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <p className="font-heading text-white text-lg mb-2">Meramec Kindergarten · Purple Team</p>
          <p className="text-purple-200">
            {team.league}
            <br />
            Shaw Park, {team.city}
          </p>
        </div>
        <div>
          <p className="font-semibold text-white mb-2">Weather &amp; Cancellations</p>
          <p className="text-purple-200">
            Sports Hotline: {team.weatherHotline}
            <br />
            Updated ~2 hours before any practice or game.
          </p>
        </div>
        <div>
          <p className="font-semibold text-white mb-2">Schedule &amp; Alerts</p>
          <p className="text-purple-200">
            Full schedule and cancellation sign-up on{" "}
            <a
              href={team.teamSidelineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-purple-400 hover:text-white"
            >
              TeamSideline
            </a>
            .
          </p>
        </div>
      </div>
      <div className="border-t border-purple-800/60 py-4 text-center text-xs text-purple-300">
        Go Purple! · {team.season}
      </div>
    </footer>
  );
}
