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
  phone?: string;
};

export const coaches: Coach[] = [
  { name: "Dan Combest", initials: "DC", role: "Head Coach" },
  { name: "Joel Brightfield", initials: "JB", role: "Assistant Coach" },
  { name: "Kyle Kochtanek", initials: "KK", role: "Assistant Coach" },
  { name: "Ilijas G.", initials: "IG", role: "Assistant Coach" },
];

export type Guardian = {
  name?: string;
  email: string;
  phone?: string;
};

export type Family = {
  guardians: Guardian[];
};

/** Guardian contacts confirmed so far from coach emails and the snack sign-up sheet — 9 of 16 families. More to add as they come in. Kids' names are intentionally left off this public site. */
export const families: Family[] = [
  { guardians: [{ name: "Dan Combest", email: "dan.combest@gmail.com" }] },
  {
    guardians: [
      { name: "Joel Brightfield", email: "jbrightf@gmail.com" },
      { name: "Rachael Brightfield", email: "rachael.brightfield@gmail.com" },
    ],
  },
  { guardians: [{ name: "Ilijas G.", email: "ilijasg@gmail.com" }] },
  {
    guardians: [
      { name: "Kyle Kochtanek", email: "kkochtanek@gmail.com" },
      { name: "Ali Kochtanek", email: "alyssa.kochtanek@gmail.com" },
    ],
  },
  { guardians: [{ name: "Rachel Pa", email: "rjoypa@gmail.com" }] },
  { guardians: [{ name: "John Brenner", email: "johnlbrenner@gmail.com" }] },
  { guardians: [{ email: "egerson@ameren.com" }] },
  { guardians: [{ name: "Alicia Bauer", email: "aliciabauer@hotmail.com" }] },
  {
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
  home: boolean;
  opponent: string;
  time: string;
  location: string;
  result?: string;
  note?: string;
};

export type ByeWeek = {
  week: number;
  label: string;
  note?: string;
};

/** Full schedule confirmed from TeamSideline (Clayton / Combest), revised Aug 18, 2026. */
export const games: Game[] = [
  {
    week: 1,
    date: "Saturday, August 29, 2026",
    time: "10:00 AM",
    home: true,
    opponent: "Clayton (Saliba/Courter)",
    location: "Shaw Park, Field 5B",
    result: "Final: tied 2–2",
    note: "Season opener — snack: Combest family",
  },
  {
    week: 3,
    date: "Saturday, September 12, 2026",
    time: "11:00 AM",
    home: true,
    opponent: "Community School (Mason/Maritz)",
    location: "Shaw Park, Field 5B",
    note: "Snack: Pa family",
  },
  {
    week: 5,
    date: "Saturday, September 26, 2026",
    time: "12:00 PM",
    home: false,
    opponent: "U-City (Ousterhout)",
    location: "Shaw Park, Field 5B",
    note: "Snack: Gerson family",
  },
  {
    week: 6,
    date: "Sunday, October 4, 2026",
    time: "2:00 PM",
    home: false,
    opponent: "College School (Flavin)",
    location: "Shaw Park, Field 5B",
    note: "Snack: Levy family",
  },
  {
    week: 7,
    date: "Saturday, October 10, 2026",
    time: "12:00 PM",
    home: true,
    opponent: "MRH (Theby)",
    location: "Shaw Park, Field 5B",
    note: "Snack sheet lists Bauer family for Oct 11 — closest game is this one, worth confirming with Coach Dan.",
  },
  {
    week: 8,
    date: "Saturday, October 17, 2026",
    time: "11:00 AM",
    home: false,
    opponent: "Central Christian (Lohrman)",
    location: "Shaw Park, Field 5B",
    note: "Snack: Brightfield family",
  },
  {
    week: 9,
    date: "Saturday, October 24, 2026",
    time: "11:00 AM",
    home: true,
    opponent: "New City (Upton)",
    location: "Shaw Park, Field 5B",
    note: "Snack: G. family",
  },
  {
    week: 10,
    date: "Sunday, November 1, 2026",
    time: "3:00 PM",
    home: true,
    opponent: "U-City (Ousterhout)",
    location: "Shaw Park, Field 5B",
    note: "Rescheduled from the original Week 4 date — snack sign-up not yet confirmed for this one.",
  },
];

export const byeWeeks: ByeWeek[] = [
  { week: 2, label: "Off — Labor Day weekend" },
  {
    week: 4,
    label: "Bye",
    note: "This week's game was moved to November (now the Nov 1 game, Week 10) when Clayton Sports revised the schedule.",
  },
  { week: 11, label: "Bye — regular season finale" },
];

export const seasonMilestones = [
  { label: "First practice", value: "Wednesday, August 12, 2026" },
  { label: "Games begin", value: "Saturday, August 29, 2026" },
  { label: "Regular season ends", value: "Sunday, November 1, 2026" },
  { label: "TeamSideline", value: "Clayton / Combest" },
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
    date: "August 29, 2026",
    title: "Season opener: Mustangs tie 2–2",
    body: "The Mustangs opened the season with a 2–2 tie at Shaw Park #5B. Coach Dan said if everyone shows up, every player gets at least 50% playing time — good energy for game one.",
    tag: "Announcement",
  },
  {
    date: "August 27, 2026",
    title: "First game, jersey collection, and a schedule update",
    body: "Coach Dan previewed the season opener (Sat 8/29, 10:00 AM, Shaw Park #5B) and asked players to bring an extra shirt to the game so jerseys can be collected afterward, get names added to the back, and be washed and returned before the next game. Reminder to bring water and shin guards to every practice and game. Clayton Sports also revised the schedule — Week 4 is now a bye, with that game moved to November.",
    tag: "Schedule",
  },
  {
    date: "August 21, 2026",
    title: "Jerseys arriving — add a last name?",
    body: "Coach Dan let parents know jerseys are on the way, with the option to add last names to the back. Rachael Brightfield and Stephanie Goette are coordinating the sign-up for anyone who wants in.",
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
    body: "Coach Dan's season kickoff email: 16 kids on the roster, playing 8v8 with a goalie. Practices start Wednesday, August 12th at Shaw Park. Coach Dan is joined by assistant coaches Joel, Kyle, and Ilijas.",
    tag: "Announcement",
  },
];
