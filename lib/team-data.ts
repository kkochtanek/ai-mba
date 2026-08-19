export const team = {
  name: "Meramec Kindergarten Soccer",
  shortName: "Purple Team",
  season: "2026 Season",
  league: "City of Clayton Parks & Recreation Youth Soccer",
  school: "Meramec Elementary",
  city: "Clayton, MO",
  color: "Purple",
  roster: 11,
  grade: "Kindergarten",
  weatherHotline: "314-290-8515",
  teamSidelineUrl: "https://www.teamsideline.com/sites/claytonmo/home",
};

export const coaches = [
  {
    name: "Caitlin & Craig McGrath",
    initials: "CM",
    role: "Head Coaches",
    blurb: "Parents of Gemma (Kindergarten) and Audrey (3rd grade) at Meramec.",
  },
  {
    name: "Kyle Kochtanek",
    initials: "KK",
    role: "Assistant Coach",
    blurb: "Kennedy's dad. Signed on to help out at practices and games this fall.",
  },
  {
    name: "Matt Hynes",
    initials: "MH",
    role: "Assistant Coach",
    blurb: "Helping the Purple Team out at practices, games, and rainy-day calls.",
  },
];

export const practices = [
  {
    day: "Monday",
    time: "6:00 – 7:00 PM",
    location: "Shaw Park, Field 5",
    note: "Every Monday, all season long.",
  },
  {
    day: "Saturday",
    time: "2:00 – 3:15 PM",
    location: "Shaw Park, Field 3",
    note: "Preseason only — August 15 & August 22. Wraps up once games begin.",
  },
];

export const seasonMilestones = [
  { label: "First practice", value: "Monday, August 10, 2026" },
  { label: "Games begin", value: "Weekend of August 29 – 30, 2026" },
  { label: "Game days", value: "Saturdays & Sundays" },
  { label: "Full schedule", value: "Posted on TeamSideline" },
];

export const equipment = [
  "Cleats or athletic shoes",
  "Shin guards",
  "A water bottle",
  "Everything else — jerseys, balls, and gear — is provided by the league.",
];

export type NewsItem = {
  date: string;
  title: string;
  body: string;
  tag: "Practice" | "Announcement" | "Coaches" | "Schedule";
};

export const news: NewsItem[] = [
  {
    date: "August 17, 2026",
    title: "Monday practice canceled — wet field",
    body: "Coach Matt let the team know practice was called off on short notice after the recent rain left the field unplayable. Back at it Wednesday... er, next Monday!",
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
    body: "The Purple Team hit the field at Shaw Park for the very first practice of the 2026 season. Eleven kindergartners, lots of energy, and a great start.",
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
    body: "Coach Caitlin sent the season kickoff email: 11 kiddos on the roster, practices starting the following Monday at Shaw Park, and a call for a few more parents to help coach. No soccer knowledge required!",
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
