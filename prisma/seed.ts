import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "change-me-now";

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Admin",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  await prisma.siteSetting.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  const services = [
    { name: "Website Design", slug: "website-design", category: "Web", priceFrom: "£450", featured: true, summary: "Fast, mobile-friendly websites built around your business.", description: "A custom website designed to look professional and turn visitors into enquiries. Includes responsive layout, contact form and basic SEO set-up." },
    { name: "Website Maintenance", slug: "website-maintenance", category: "Web", priceFrom: "£30/mo", featured: true, summary: "Updates, backups and small changes so your site stays healthy.", description: "Monthly care for your site: security updates, backups, uptime checks and a set number of content changes." },
    { name: "Social Media Management", slug: "social-media-management", category: "Marketing", priceFrom: "£120/mo", featured: false, summary: "Consistent posting that keeps your brand visible.", description: "Content calendars, captions and posting across the platforms your customers use." },
    { name: "Copywriting", slug: "copywriting", category: "Content", priceFrom: "£60", featured: false, summary: "Clear words that explain what you do and why it matters.", description: "Website copy, service descriptions and calls to action written in your voice." },
    { name: "SEO Services", slug: "seo-services", category: "Marketing", priceFrom: "£150", featured: false, summary: "Help local customers find you on Google.", description: "Keyword research, on-page fixes and local listing set-up." },
    { name: "Photography", slug: "photography", category: "Creative", priceFrom: "Coming soon", featured: false, summary: "Business, product and team photos.", description: "Professional photography for your website and social channels. Coming soon." },
  ];
  for (const [i, s] of services.entries()) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: { ...s, sortOrder: i } });
  }

  const samples = [
    { title: "Iron Forge Gym", slug: "iron-forge-gym", clientName: "Iron Forge Gym (sample)", industry: "Fitness", description: "Membership and class timetable site for a local gym.", challenge: "A local gym needed a modern online presence.", solution: "Responsive website with membership information and class timetable.", result: "Clear mobile experience and an enquiry form that works.", tech: "Next.js, Tailwind CSS, PostgreSQL" },
    { title: "Summit Roofing", slug: "summit-roofing", clientName: "Summit Roofing (sample)", industry: "Trades", description: "Quote-request site for a roofing company.", challenge: "No website, relying on word of mouth.", solution: "Simple service pages with a quote request form.", result: "Enquiries land in one place and can be followed up.", tech: "Next.js, Tailwind CSS, Prisma" },
  ];
  for (const p of samples) {
    await prisma.portfolioItem.upsert({ where: { slug: p.slug }, update: {}, create: { ...p, featured: true } });
  }

  await prisma.blogPost.upsert({
    where: { slug: "why-your-small-business-needs-a-website" },
    update: {},
    create: {
      title: "Why your small business needs a website",
      slug: "why-your-small-business-needs-a-website",
      excerpt: "Customers search online before they call. Here's what a simple site does for you.",
      content:
        "Most customers look a business up online before they get in touch.\n\nA simple, fast website answers the questions they have: what you do, where you are, and how to reach you.\n\nThis is a sample post. Edit or delete it in the admin dashboard.",
      author: "Tino Digital Studio",
      category: "Websites",
      published: true,
      publishedAt: new Date(),
    },
  });

  console.log(`Seeded. Admin login: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
