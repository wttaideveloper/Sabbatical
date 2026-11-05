export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "sample-post",
    category: "Perimenopause",
    title: "Why Desire Changes Before Anything Else Does",
    excerpt:
      "For many women, a dip in desire is the very first sign that hormones are shifting—long before a missed period ever shows up. Here's the biology behind it.",
    date: "March 12, 2026",
    readTime: "6 min read",
  },
  {
    slug: "sample-post",
    category: "Pelvic Health",
    title: "Painful Sex Isn't Something You Have to Live With",
    excerpt:
      "Dryness, tightness, and pain during intimacy are common—but common doesn't mean permanent. A look at what's actually happening in the pelvic floor.",
    date: "February 26, 2026",
    readTime: "5 min read",
  },
  {
    slug: "sample-post",
    category: "Relationships",
    title: "Responsive Desire: The Piece Nobody Explains",
    excerpt:
      "Not everyone experiences desire the same way. Understanding the difference between spontaneous and responsive desire can change how you see your own body.",
    date: "February 9, 2026",
    readTime: "7 min read",
  },
  {
    slug: "sample-post",
    category: "Hormones",
    title: "What Your Bladder Has to Do With Your Hormones",
    excerpt:
      "Frequent urges, leaks, recurring UTIs—bladder symptoms at midlife are rarely just a bladder problem. Here's the connection most people miss.",
    date: "January 22, 2026",
    readTime: "4 min read",
  },
  {
    slug: "sample-post",
    category: "Faith & Sexuality",
    title: "Holding Faith and Biology in the Same Conversation",
    excerpt:
      "You don't have to choose between science and belief. A look at how both can inform a fuller understanding of your body and your intimacy.",
    date: "January 8, 2026",
    readTime: "6 min read",
  },
  {
    slug: "sample-post",
    category: "Midlife",
    title: "The Symptoms Nobody Warned You About",
    excerpt:
      "Brain fog, joint aches, mood swings, and changes in intimacy rarely get connected to one another. They're more related than you'd think.",
    date: "December 18, 2025",
    readTime: "8 min read",
  },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  blurb: string;
  swatch: string;
  imageUrl?: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Understanding Perimenopause Guide",
    category: "Digital Guide",
    price: 28,
    blurb: "A plain-language walkthrough of the hormonal shifts behind midlife symptoms.",
    swatch: "linear-gradient(135deg, #DD6E4A, #8A3F49)",
  },
  {
    id: "p2",
    name: "Pelvic Floor Foundations",
    category: "Video Course",
    price: 64,
    blurb: "Self-paced lessons on pelvic health, comfort, and function at any age.",
    swatch: "linear-gradient(135deg, #D7928D, #DD6E4A)",
  },
  {
    id: "p3",
    name: "Intimacy Journal",
    category: "Print + Digital",
    price: 22,
    blurb: "Guided prompts for tracking symptoms, patterns, and conversations worth having.",
    swatch: "linear-gradient(135deg, #8A3F49, #5E2A33)",
  },
  {
    id: "p4",
    name: "Desire Discrepancy Workbook",
    category: "Digital Guide",
    price: 32,
    blurb: "A couples-friendly workbook for navigating mismatched desire with less friction.",
    swatch: "linear-gradient(135deg, #5E2A33, #D7928D)",
  },
  {
    id: "p5",
    name: "Hormone Lab Checklist",
    category: "Printable",
    price: 12,
    blurb: "The exact panel to request from your clinician, explained in plain English.",
    swatch: "linear-gradient(135deg, #DD6E4A, #D7928D)",
  },
  {
    id: "p6",
    name: "Faith & Sexuality Workshop Replay",
    category: "Video",
    price: 45,
    blurb: "A recorded workshop session for those who want a faith-aware, science-grounded lens.",
    swatch: "linear-gradient(135deg, #8A3F49, #DD6E4A)",
  },
];

export type BookingService = {
  id: string;
  title: string;
  duration: string;
  price: string;
  description: string;
};

export const BOOKING_SERVICES: BookingService[] = [
  {
    id: "consult",
    title: "Educational Consult",
    duration: "60 minutes",
    price: "$185",
    description: "A private one-on-one session covering body, mind, and relationships.",
  },
  {
    id: "followup",
    title: "Follow-Up Session",
    duration: "30 minutes",
    price: "$95",
    description: "For returning clients continuing an existing conversation.",
  },
  {
    id: "group",
    title: "Group Series Enrollment",
    duration: "3–4 sessions",
    price: "$220",
    description: "Reserve a seat in the next live group series.",
  },
];

export const BOOKING_TIMES = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "4:30 PM"];

function getUpcomingDates(count: number) {
  const days = [];
  const today = new Date();
  for (let i = 1; days.length < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0) continue; // skip Sundays
    days.push(d);
  }
  return days;
}

export const BOOKING_DATES = getUpcomingDates(6).map((d) => ({
  iso: d.toISOString(),
  weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
  day: d.getDate(),
  month: d.toLocaleDateString("en-US", { month: "short" }),
}));
