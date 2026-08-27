export const team = {
  name: "Meramec 2nd Grade Soccer",
  shortName: "Mustangs",
  season: "2026 Season",
  league: "City of Clayton Parks & Recreation Youth Soccer",
  school: "Meramec Elementary",
  city: "Clayton, MO",
  roster: 16,
  grade: "2nd Grade",
  weatherHotline: "314-290-8515",
};

export type Coach = {
  name: string;
  initials: string;
  role: string;
  email: string;
  phone?: string;
  note?: string;
};

export const coaches: Coach[] = [
  { name: "Dan Combest", initials: "DC", role: "Head Coach", email: "dan.combest@gmail.com", note: "Sam's dad" },
  { name: "Joel Brightfield", initials: "JB", role: "Assistant Coach", email: "jbrightf@gmail.com", note: "Ollie's dad" },
  { name: "Kyle Kochtanek", initials: "KK", role: "Assistant Coach", email: "kkochtanek@gmail.com", note: "Leo's dad" },
  { name: "Ilijas G.", initials: "IG", role: "Assistant Coach", email: "ilijasg@gmail.com", note: "Adam's dad" },
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

/** Confirmed so far from coach emails and the snack sign-up sheet — 9 of 16. More to add as they come in. */
export const players: Player[] = [
  { name: "Sam Combest", guardians: [{ name: "Dan Combest", email: "dan.combest@gmail.com" }] },
  {
    name: "Ollie Brightfield",
    guardians: [
      { name: "Joel Brightfield", email: "jbrightf@gmail.com" },
      { name: "Rachael Brightfield", email: "rachael.brightfield@gmail.com" },
    ],
  },
  { name: "Adam G.", guardians: [{ name: "Ilijas G.", email: "ilijasg@gmail.com" }] },
  {
    name: "Leo Kochtanek",
    guardians: [
      { name: "Kyle Kochtanek", email: "kkochtanek@gmail.com" },
      { name: "Ali Kochtanek", email: "alyssa.kochtanek@gmail.com" },
    ],
  },
  { name: "Pierce Pa", guardians: [{ name: "Rachel Pa", email: "rjoypa@gmail.com" }] },
  { name: "Ben Brenner", guardians: [{ name: "John Brenner", email: "johnlbrenner@gmail.com" }] },
  { name: "Louis Gerson", guardians: [{ email: "egerson@ameren.com" }] },
  { name: "Ford Bauer", guardians: [{ name: "Alicia Bauer", email: "aliciabauer@hotmail.com" }] },
  {
    name: "Joey Levy",
    guardians: [
      { name: "Katie Kovács", email: "katherine.j.kovacs@gmail.com" },
      { name: "David Levy", email: "david.f.levy@gmail.com" },
    ],
  },
];

export const practices = [
  {
    day: "Wednesday",
    time: "6:00 – 7:15 PM",
    location: "Shaw Park, Field 3",
    field: "3" as const,
    note: "Every Wednesday, all season long.",
  },
];

export type Game = {
  week: number;
  date: string;
  opponent?: string;
  time?: string;
  location?: string;
  note?: string;
};

export type ByeWeek = {
  week: number;
  label: string;
};

/**
 * Game dates confirmed via the team snack sign-up sheet. Dan's schedule PDF has the
 * exact times, opponents, and fields for each — not yet transcribed here.
 */
export const games: Game[] = [
  { week: 1, date: "Saturday, August 29, 2026", note: "Season opener — snack: Combest family" },
  { week: 3, date: "Saturday, September 12, 2026", note: "Snack: Pa family" },
  { week: 4, date: "Sunday, September 20, 2026", note: "Snack: Brenner family" },
  { week: 5, date: "Saturday, September 26, 2026", note: "Snack: Gerson family" },
  { week: 6, date: "Sunday, October 4, 2026", note: "Snack: Levy family" },
  { week: 7, date: "Sunday, October 11, 2026", note: "Snack: Bauer family" },
  { week: 8, date: "Saturday, October 17, 2026", note: "Snack: Brightfield family" },
  { week: 9, date: "Saturday, October 24, 2026", note: "Snack: Adam's family" },
];

export const byeWeeks: ByeWeek[] = [
  { week: 2, label: "Off — Labor Day weekend" },
  { week: 10, label: "Bye" },
  { week: 11, label: "Bye — regular season finale" },
];

export const seasonMilestones = [
  { label: "First practice", value: "Wednesday, August 12, 2026" },
  { label: "Games begin", value: "Saturday, August 29, 2026" },
  { label: "Regular season ends", value: "Week of October 24, 2026" },
  { label: "Full schedule", value: "See Dan's schedule email" },
];

export const equipment = [
  "Cleats (no metal studs)",
  "Shin guards",
  "A water bottle",
  "Balls and uniforms are provided by the league — write your kid's name on anything they bring from home.",
];

/** Next scheduled team activity, shown with the field map on the homepage. */
export const nextEvent = {
  kind: "Practice" as const,
  day: "Wednesdays",
  time: "6:00 – 7:15 PM",
  field: "3" as const,
  location: "Shaw Park, Field 3",
  note: "Every Wednesday, all season long.",
};

export type NewsItem = {
  date: string;
  title: string;
  body: string;
  tag: "Practice" | "Announcement" | "Coaches" | "Schedule";
};

export const news: NewsItem[] = [
  {
    date: "August 21, 2026",
    title: "Jerseys arriving — add a last name?",
    body: "Coach Dan let parents know jerseys are on the way, with the option to add last names to the back. Rachael Brightfield and Stephanie Goette are coordinating — $20 via Venmo (@stephgoette) if you want in.",
    tag: "Announcement",
  },
  {
    date: "August 14, 2026",
    title: "Schedule, snacks, and one more preseason practice",
    body: "Coach Dan sent the season schedule and the Shaw Park field map, plus the snack sign-up for game days (peanut and dairy allergies on the team — please plan accordingly). One more Sunday practice, 9:00–10:15 AM on Field 5B.",
    tag: "Schedule",
  },
  {
    date: "August 12, 2026",
    title: "First practice — cut short by lightning",
    body: "The season kicked off with a shortened practice (6:00–6:40 PM, Field 3) with Coach Joel and Ilijas running things. A later practice that evening got called off when lightning moved into the area.",
    tag: "Practice",
  },
  {
    date: "August 2, 2026",
    title: "Welcome to 2nd Grade Meramec Soccer!",
    body: "Coach Dan's season kickoff email: 16 kids on the roster, playing 8v8 with a goalie. Practices start Wednesday, August 12th at Shaw Park. Coach Dan is joined by Joel (Ollie's dad), Kyle (Leo's dad), and Ilijas (Adam's dad).",
    tag: "Announcement",
  },
];
