export const team = {
  name: "Meramec Kindergarten Soccer",
  shortName: "Purple Popsicles",
  season: "2026 Season",
  league: "City of Clayton Parks & Recreation Youth Soccer",
  school: "Meramec Elementary",
  city: "Clayton, MO",
  roster: 12,
  grade: "Kindergarten",
  weatherHotline: "314-290-8515",
  teamSidelineUrl: "https://teamsideline.com/sites/claytonmo/schedule/736715/Kindergarten-Red",
};

export type Coach = {
  name: string;
  initials: string;
  role: string;
  email: string;
  phone?: string;
};

export const coaches: Coach[] = [
  { name: "Caitlin McGrath", initials: "CM", role: "Head Coach", email: "cmcgrath410@gmail.com", phone: "618-971-6747" },
  { name: "Craig McGrath", initials: "CM", role: "Head Coach", email: "craigmcgrath12@gmail.com", phone: "847-858-2090" },
  { name: "Kyle Kochtanek", initials: "KK", role: "Assistant Coach", email: "kkochtanek@gmail.com" },
  { name: "Matt Hynes", initials: "MH", role: "Assistant Coach", email: "mhynes57@gmail.com", phone: "314-899-7105" },
];

export type Guardian = {
  name?: string;
  email: string;
  phone?: string;
};

export type Player = {
  name: string;
  guardians: Guardian[];
};

export const players: Player[] = [
  { name: "Zoe Aronson", guardians: [{ name: "Julie Laronson", email: "julielaronson@gmail.com" }] },
  { name: "Danaran Asusing", guardians: [{ email: "asusing@gmail.com" }] },
  { name: "Caden Goette", guardians: [{ email: "srgoette@gmail.com" }] },
  {
    name: "Finnegan Hynes",
    guardians: [
      { name: "Matt Hynes", email: "mhynes57@gmail.com", phone: "314-899-7105" },
      { name: "Kelleigh Briden", email: "kelleigh.briden@gmail.com", phone: "401-419-5974" },
    ],
  },
  {
    name: "Lily Kao-Rabinowitz",
    guardians: [
      { name: "Mimi Kao", email: "cmimikao@gmail.com", phone: "513-305-5747" },
      { name: "Edon Rabinowitz", email: "ejrabin@gmail.com", phone: "516-510-8499" },
    ],
  },
  {
    name: "Kennedy Kochtanek",
    guardians: [
      { name: "Ali Kochtanek", email: "alyssa.kochtanek@gmail.com", phone: "314-795-1765" },
      { name: "Kyle Kochtanek", email: "kkochtanek@gmail.com" },
    ],
  },
  {
    name: "Mikhail “Misha” Makarov",
    guardians: [
      { name: "Katy Cole", email: "kmcole1105@gmail.com", phone: "660-998-2138" },
      { name: "Konstantin Makarov", email: "makarovestates@gmail.com", phone: "573-823-1880" },
    ],
  },
  {
    name: "Gemma McGrath",
    guardians: [
      { name: "Caitlin McGrath", email: "cmcgrath410@gmail.com", phone: "618-971-6747" },
      { name: "Craig McGrath", email: "craigmcgrath12@gmail.com", phone: "847-858-2090" },
    ],
  },
  {
    name: "Leighton Mosbacher",
    guardians: [
      { name: "Heidi Morris-Mosbacher", email: "morris.heidi.l@gmail.com", phone: "314-484-1996" },
      { name: "J.T. Mosbacher", email: "jtmosbacher@gmail.com", phone: "314-401-9471" },
    ],
  },
  {
    name: "Matthew Ralko",
    guardians: [
      { name: "Charis Ralko", email: "charisfischer@gmail.com", phone: "973-951-1660" },
      { name: "Adam Ralko", email: "amralko@gmail.com", phone: "734-634-7215" },
    ],
  },
  {
    name: "Hallie Shipe",
    guardians: [
      { name: "Jaime Hook", email: "hoojp@hotmail.com", phone: "314-566-5087" },
      { name: "Matthew Shipe", email: "mashipe@wustl.edu", phone: "314-540-7315" },
    ],
  },
  { name: "Emily Young", guardians: [{ email: "jenniferrkieffer@gmail.com" }] },
];

export const practices = [
  {
    day: "Monday",
    time: "6:00 – 7:00 PM",
    location: "Shaw Park, Field 6",
    field: "6" as const,
    note: "Every Monday, all season long.",
  },
];

export type Game = {
  date: string;
  time: string;
  field: "6D" | "3" | "5" | "5B";
  location: string;
  opponent?: string;
  note?: string;
};

/** Confirmed games, pulled from coach emails as they come in. Full slate is on TeamSideline. */
export const games: Game[] = [
  {
    date: "Saturday, August 29, 2026",
    time: "9:00 – 10:00 AM",
    field: "6D",
    location: "Shaw Park, Field 6D",
    note: "First game of the season! Arrive ~8:40 AM — a few uniforms still need to be handed out.",
  },
];

export const seasonMilestones = [
  { label: "First practice", value: "Monday, August 10, 2026" },
  { label: "Games begin", value: "Weekend of August 29 – 30, 2026" },
  { label: "Game days", value: "Sat mornings & Sun afternoons" },
  { label: "Full schedule", value: "Live on TeamSideline" },
];

/** Recurring game-time pattern, per Coach Caitlin's Aug 20 email. One-off exceptions listed separately. */
export const gameTimePattern = [
  "Most Saturdays: 9:00 AM or 10:00 AM",
  "Most Sundays: early afternoon",
];

export const gameExceptions = [
  { date: "Monday, September 14", time: "6:00 PM", note: "The one weekday game — falls during a normal practice slot." },
];

export const equipment = [
  "Cleats or athletic shoes",
  "Shin guards",
  "A water bottle",
  "Everything else — jerseys, balls, and gear — is provided by the league.",
];

/** Next scheduled team activity, shown with the field map on the homepage. */
export const nextEvent = {
  kind: "Game" as const,
  day: "Saturday, August 29",
  time: "9:00 – 10:00 AM",
  field: "6D" as const,
  location: "Shaw Park, Field 6D",
  note: "First game of the season! Arrive ~8:40 AM.",
};

export type NewsItem = {
  date: string;
  title: string;
  body: string;
  tag: "Practice" | "Announcement" | "Coaches" | "Schedule";
};

export const news: NewsItem[] = [
  {
    date: "August 24, 2026",
    title: "First game set — Saturday, Field 6D at 9 AM",
    body: "Monday's practice got rained out, but Coach Caitlin confirmed the season opener: Saturday, August 29th, 9:00–10:00 AM at Field 6D. Arrive around 8:40 to help pass out any remaining uniforms before kickoff.",
    tag: "Schedule",
  },
  {
    date: "August 24, 2026",
    title: "It's official: the Purple Popsicles!",
    body: "The team picked its name at Monday practice, uniforms arrived and got handed out, and snack sign-up for game days is open. Go Purple Popsicles!",
    tag: "Announcement",
  },
  {
    date: "August 20, 2026",
    title: "Game schedule is live — team name coming Monday",
    body: "Coach Caitlin posted the full game schedule to TeamSideline (and the shared team calendar). Most games are Saturday mornings (9 or 10 AM) and Sunday early afternoons, with one exception — a Monday, September 14th game at 6 PM. Next up: Saturday practice at 2 PM, then the kids pick the team name at Monday 8/24 practice — uniforms should be in by then, too.",
    tag: "Schedule",
  },
  {
    date: "August 17, 2026",
    title: "Monday practice canceled — field locked",
    body: "Short-notice cancellation: Coach Matt found the field too wet to use, and the team later learned the gate had been locked following the rain. Apologies for the late word — back at it the following Monday.",
    tag: "Practice",
  },
  {
    date: "August 15, 2026",
    title: "Saturday practice canceled — heat advisory",
    body: "Coach Caitlin canceled the Saturday session for the heat. Good news: the forecast cools off for Monday. Also — start thinking of team name ideas, players!",
    tag: "Practice",
  },
  {
    date: "August 11, 2026",
    title: "Game schedule live on TeamSideline",
    body: "Registration and the 2026 game schedule are now posted on TeamSideline. Games kick off the weekend of August 29th — Saturdays and Sundays. Sign up there for weather-cancellation alerts, too.",
    tag: "Schedule",
  },
  {
    date: "August 10, 2026",
    title: "First practice of the season!",
    body: "The Purple Team hit the field at Shaw Park for the very first practice of the 2026 season. Twelve kindergartners, lots of energy, and a great start.",
    tag: "Practice",
  },
  {
    date: "August 2, 2026",
    title: "Kyle Kochtanek joins as assistant coach",
    body: "Kennedy's dad Kyle stepped up to help Coach Caitlin and Coach Craig out this season — forms are in, and the coaching discount is processed. Welcome to the sideline, Coach Kyle!",
    tag: "Coaches",
  },
  {
    date: "August 1, 2026",
    title: "Welcome to Kindergarten Soccer, Purple Team!",
    body: "Coach Caitlin sent the season kickoff email: kiddos on the roster, practices starting the following Monday at Shaw Park, and a call for a few more parents to help coach. No soccer knowledge required!",
    tag: "Announcement",
  },
];

export const contacts = {
  league: {
    name: team.league,
    note: "Youth soccer scheduling, rosters, and field assignments for the City of Clayton.",
  },
  hotline: team.weatherHotline,
};
