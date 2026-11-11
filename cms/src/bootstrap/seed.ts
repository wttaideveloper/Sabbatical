import path from 'path';
import fs from 'fs';
import type { Core } from '@strapi/strapi';

const ASSETS_DIR = path.join(process.cwd(), '..', 'public', 'assets');

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
};

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function uploadAsset(strapi: Core.Strapi, filename: string): Promise<number | undefined> {
  const existing = await strapi.query('plugin::upload.file').findOne({ where: { name: filename } });
  if (existing) return existing.id;

  const filepath = path.join(ASSETS_DIR, filename);
  if (!fs.existsSync(filepath)) {
    strapi.log.warn(`[seed] Asset not found, skipping: ${filepath}`);
    return undefined;
  }
  const ext = path.extname(filename).toLowerCase();
  const stats = fs.statSync(filepath);

  const uploadService = strapi.plugin('upload').service('upload');
  const uploaded = await uploadService.upload({
    data: {},
    files: {
      filepath,
      originalFilename: filename,
      mimetype: MIME_BY_EXT[ext] || 'application/octet-stream',
      size: stats.size,
    },
  });

  const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;
  return file?.id;
}

/**
 * Seeding publishes sample content (placeholder blog posts, invented product and service
 * prices, "#" social links). It must NEVER run against a real site, so it requires BOTH:
 *   - NODE_ENV is not "production", and
 *   - STRAPI_SEED=true (explicit opt-in; the default is off).
 */
export function isSeedEnabled(): boolean {
  return (
    process.env.NODE_ENV !== 'production' &&
    (process.env.STRAPI_SEED ?? '').trim().toLowerCase() === 'true'
  );
}

export default async function seed({ strapi }: { strapi: Core.Strapi }) {
  // Defence in depth: callers already check this, but the function refuses on its own too.
  if (!isSeedEnabled()) {
    strapi.log.warn('[seed] Refusing to seed: requires NODE_ENV!=production and STRAPI_SEED=true.');
    return;
  }

  strapi.log.info('[seed] Checking seed state...');

  const logoId = await uploadAsset(strapi, 'logo-transparent.png');
  const logoReversedId = await uploadAsset(strapi, 'logo-reversed.jpg');
  const heroImageId = await uploadAsset(strapi, 'erika-hero.png');
  const portraitId = await uploadAsset(strapi, 'erika-portrait.png');
  const hikingId = await uploadAsset(strapi, 'erika-hiking.jpg');
  const dogId = await uploadAsset(strapi, 'erika-dog.jpg');

  const siteSettingExists = await strapi.documents('api::site-setting.site-setting').findFirst();
  if (!siteSettingExists) {
    strapi.log.info('[seed] Creating site-setting...');
    await strapi.documents('api::site-setting.site-setting').create({
      data: {
        logo: logoId,
        logoReversed: logoReversedId,
        footerTagline: 'Sexual Wellness Education',
        contactEmail: 'hello@intimatesabbatical.com',
        instagramUrl: '#',
        youtubeUrl: '#',
        footerDisclaimer:
          'Education only. Not a substitute for individualized medical diagnosis or treatment.',
      } as never,
      status: 'published',
    });
  }

  const homePageExists = await strapi.documents('api::home-page.home-page').findFirst();
  if (!homePageExists) {
    strapi.log.info('[seed] Creating home-page...');
    await strapi.documents('api::home-page.home-page').create({
      data: {
        heroEyebrow: 'Intimate Sabbatical',
        heroTitle: 'Rediscover Intimacy. Reclaim You.',
        heroSubtitle:
          'Science-based education and compassionate support for women navigating perimenopause and beyond.',
        heroImage: heroImageId,
        heroPrimaryLabel: 'Work With Me',
        heroPrimaryHref: '/booking',
        heroSecondaryLabel: 'Explore Resources',
        heroSecondaryHref: '#services',
        introEyebrow: 'One Place, Whole Picture',
        introTitle: 'One place where the whole person is considered.',
        introBody:
          'Intimate Sabbatical was created to close a gap: a place where sexual health is understood in context—not separated into disconnected symptoms.\n\nThe work is grounded in biological science and, when requested, informed by faith. Body, mind, relationships, history, beliefs, and the season of life you are in all belong in the same conversation.',
        modelEyebrow: 'The Biopsychosocial Model',
        modelTitle: 'Your sexuality lives at the intersection of three worlds.',
        modelNote:
          'Sexuality is not "just in your head." At midlife, biology often begins to drive more of the story—and understanding the biology can change how everything else makes sense.',
        restoreEyebrow: 'A Space to Understand',
        restoreTitle: "Understand what changed. Restore what's possible.",
        restoreBody:
          'An integrated biopsychosocial approach looks at the whole picture together. We begin with the body, mind, and relationships rather than making you decide which specialist owns the problem before you even understand it.\n\nFor women who want it, a faith lens can be part of the conversation so education can reflect both biology and belief.',
        aboutTeaserEyebrow: 'Meet Erika',
        aboutTeaserTitle: 'Nurse Practitioner. Sexual Health Educator. Your Guide.',
        aboutTeaserBody:
          'My clinical career has centered on complex neurologic, pelvic, urologic, and sexual health concerns. Over time, one need became impossible to miss: people often need more room to slow down, learn, connect the dots, and understand what their bodies are telling them.\n\nI created Intimate Sabbatical to make sexual health understandable—to replace guessing with context, connect symptoms that are often treated separately, and help people feel less broken by changes they were never taught to expect.',
        aboutTeaserImage: portraitId,
        ctaEyebrow: 'Ready When You Are',
        ctaTitle: "You don't have to keep guessing at this.",
        ctaBody:
          "Wherever you're starting from, there is a way to begin: one conversation, one session, one weekend at a time.",
      } as never,
      status: 'published',
    });
  }

  const aboutPageExists = await strapi.documents('api::about-page.about-page').findFirst();
  if (!aboutPageExists) {
    strapi.log.info('[seed] Creating about-page...');
    await strapi.documents('api::about-page.about-page').create({
      data: {
        heroEyebrow: 'About',
        heroTitle: "Hi, I'm Erika.",
        heroLead:
          'Nurse Practitioner. Sexual Health Educator. Your guide to understanding what changed—and what may still be possible.',
        heroPhoto: portraitId,
        whyEyebrow: 'Why Intimate Sabbatical',
        whyTitle: 'Sexual health deserves more time, context, and clarity.',
        whyBody:
          'My clinical career has centered on complex neurologic, pelvic, urologic, and sexual health concerns. I have seen how often people are left trying to make sense of symptoms that cross multiple systems—and how rarely anyone has enough time to put the whole story together.\n\nI created Intimate Sabbatical to slow the conversation down, connect the dots, teach the biology, and make sexual health understandable.',
        goalEyebrow: 'The Goal',
        goalTitle: 'Less guessing. Less shame. More understanding.',
        goalBody:
          'Changes in desire, arousal, orgasm, comfort, pelvic health, bladder function, and intimacy can feel deeply personal. But they are also health information. Understanding the biology can make the experience feel far less mysterious—and far less like a personal failure.',
        values: [
          {
            number: '01',
            title: 'Clinically Grounded',
            body: 'Education rooted in anatomy, physiology, pelvic health, urologic health, nervous system function, medications, hormones, and the medical story.',
          },
          {
            number: '02',
            title: 'Whole-Person',
            body: 'Body, mind, relationships, history, stress, beliefs, and the season of life are considered together rather than in isolation.',
          },
          {
            number: '03',
            title: 'Faith-Informed When Desired',
            body: 'For those who want it, faith can be included as part of the conversation without replacing biological science.',
          },
        ],
        beyondEyebrow: 'Beyond the Clinic',
        beyondTitle: 'Still curious. Still exploring.',
        beyondBody:
          'The same curiosity that shows up in a consult shows up everywhere else, too—on a trail with a view worth the climb, or getting tackled by an enormous, deeply unserious Great Dane. Whole-person care starts with living like one.',
        hikingPhoto: hikingId,
        dogPhoto: dogId,
        ctaEyebrow: 'Where to Begin',
        ctaTitle: 'Choose the format that fits you best.',
      } as never,
      status: 'published',
    });
  }

  const ecPageExists = await strapi
    .documents('api::educational-consults-page.educational-consults-page')
    .findFirst();
  if (!ecPageExists) {
    strapi.log.info('[seed] Creating educational-consults-page...');
    await strapi.documents('api::educational-consults-page.educational-consults-page').create({
      data: {
        heroEyebrow: 'Clinically Guided Educational Consults',
        heroTitle: 'One conversation. The whole picture.',
        heroLead:
          'A private educational session designed to help you understand what may be changing, what questions to ask, and what options are worth exploring next.',
        whatEyebrow: 'What This Is',
        whatTitle: 'Education with clinical context.',
        whatBody:
          'Sexual health concerns rarely live in one category. A change in desire may intersect with hormones, sleep, stress, medications, pelvic pain, bladder symptoms, relationship dynamics, body image, or life stage.\n\nIn a clinically guided educational consult, body, mind, and relationships are all on the table. The goal is not to diagnose or prescribe. The goal is to help you understand the landscape so you can ask better questions and make more informed decisions.',
        exploreEyebrow: 'We May Explore',
        exploreTitle: 'The pieces that can shape sexual health.',
        exploreItems: [
          {
            title: 'Body',
            body: 'Hormones, anatomy, pelvic floor, bladder health, pain, circulation, sleep, medications, neurologic factors, and medical history.',
          },
          {
            title: 'Mind',
            body: 'Stress, mood, attention, self-image, beliefs, expectations, and past experiences.',
          },
          {
            title: 'Relationships',
            body: 'Communication, connection, desire discrepancy, partnership dynamics, safety, faith, and life circumstances.',
          },
          {
            title: 'Next Questions',
            body: 'What to bring to your clinician, what type of specialist may be appropriate, and what options or resources may be worth discussing.',
          },
        ],
        fitEyebrow: 'This May Be a Good Fit If',
        fitTitle: 'You know something changed—but you cannot yet tell why.',
        fitItems: [
          { body: 'Desire or arousal feels different than it used to.' },
          { body: 'Orgasm has become harder, weaker, delayed, or less predictable.' },
          { body: 'Sex has become painful, uncomfortable, dry, or anxiety-provoking.' },
          { body: 'Bladder or pelvic symptoms seem connected to intimacy.' },
          {
            body: 'You have received fragmented advice and want help seeing the whole picture.',
          },
          { body: 'You want a faith-aware conversation that still stays grounded in science.' },
        ],
        ctaEyebrow: 'Ready When You Are',
        ctaTitle: 'Start with one conversation.',
        ctaBody:
          'Bring your questions, your timeline, and what you have already tried. We will use the session to make the picture clearer.',
      } as never,
      status: 'published',
    });
  }

  const gsPageExists = await strapi
    .documents('api::group-sessions-page.group-sessions-page')
    .findFirst();
  if (!gsPageExists) {
    strapi.log.info('[seed] Creating group-sessions-page...');
    await strapi.documents('api::group-sessions-page.group-sessions-page').create({
      data: {
        heroEyebrow: 'Live Group Sessions',
        heroTitle: 'Learn the science. Ask the questions.',
        heroLead:
          'Small live series—typically three or four sessions—designed to make sexual health understandable, practical, and less awkward to talk about.',
        howEyebrow: 'How It Works',
        howTitle: 'Structured teaching with live Q&A.',
        howBody:
          'Each group series goes deep enough to be useful without turning into a medical-school lecture. We build the biology first, then layer in the psychological, relational, and real-life pieces.\n\nSessions are delivered live, with dedicated time for questions so you can hear the answers to things many women are wondering but rarely have an opportunity to ask.',
        seriesEyebrow: 'A Sample Series',
        seriesTitle: 'Three or four evenings. One connected story.',
        sessions: [
          {
            number: '01',
            title: 'The Biology of Sex',
            body: 'Desire, arousal, blood flow, nerves, hormones, attention, context, and what changes across the lifespan.',
          },
          {
            number: '02',
            title: 'Comfort, Lubrication & Orgasm',
            body: 'Why dryness, pain, pelvic floor changes, and orgasm shifts happen—and how to think about the options.',
          },
          {
            number: '03',
            title: 'Partner Dynamics & Desire',
            body: 'Responsive desire, mismatched desire, communication, context, expectations, and why "just try harder" does not work.',
          },
          {
            number: '04',
            title: 'Putting It Together',
            body: 'An optional fourth session focused on questions, patterns, practical next steps, and integrating body, mind, and relationships.',
          },
        ],
        designedEyebrow: 'Designed For',
        designedTitle: 'Women who want more than a sound bite.',
        designedBody:
          'You do not need to have a diagnosis, a partner, or a specific sexual concern to participate. These sessions are for anyone who wants a better working understanding of sexual health, especially during seasons of hormonal and life transition.\n\nGroup education is not individualized medical care. It is a way to learn the framework, hear common questions answered, and become better prepared for your own conversations with clinicians and partners.',
        ctaEyebrow: 'Upcoming Series',
        ctaTitle: 'Join the next live group.',
        ctaBody: 'Dates and topics can be added here as soon as your next series is scheduled.',
      } as never,
      status: 'published',
    });
  }

  const srPageExists = await strapi
    .documents('api::speaking-retreats-page.speaking-retreats-page')
    .findFirst();
  if (!srPageExists) {
    strapi.log.info('[seed] Creating speaking-retreats-page...');
    await strapi.documents('api::speaking-retreats-page.speaking-retreats-page').create({
      data: {
        heroEyebrow: 'Speaking & Retreats',
        heroTitle: 'Bring the conversation into the room.',
        heroLead:
          "Evidence-informed, engaging sexual-health education for conferences, women's groups, professional audiences, churches, organizations, and weekend retreats.",
        forGroupsEyebrow: 'For Groups & Gatherings',
        forGroupsTitle: 'Serious science. Human language.',
        forGroupsBody:
          "Sexual health can be taught clearly without being clinical in tone, sensational, or embarrassing. Talks are designed to give audiences language for what they are experiencing and a framework for understanding why it may be happening.\n\nPrograms can be tailored for a single keynote, a breakout session, a women's ministry event, a professional audience, or a full weekend retreat.",
        topicsEyebrow: 'Topic Areas',
        topicsTitle: 'Talks that connect biology, intimacy, and real life.',
        topics: [
          {
            title: 'Hormones & Midlife',
            body: 'Perimenopause, menopause, desire, arousal, sleep, mood, pelvic health, and what changes biologically.',
          },
          {
            title: 'Pelvic & Sexual Health',
            body: 'Bladder health, pelvic floor function, pain, comfort, lubrication, anatomy, and orgasm.',
          },
          {
            title: 'Relationships & Intimacy',
            body: 'Desire discrepancy, responsive desire, communication, connection, expectations, and context.',
          },
          {
            title: 'Faith & Sexuality',
            body: 'For faith-based groups that want a thoughtful conversation grounded in biology while making room for belief, meaning, and values.',
          },
        ],
        formatsEyebrow: 'Formats',
        formatsTitle: 'From one hour to a full weekend.',
        formats: [
          {
            number: '01',
            title: 'Keynote / Featured Talk',
            body: 'A focused session built around one clear question or theme, designed for larger audiences.',
            note: 'Best for conferences and large gatherings.',
          },
          {
            number: '02',
            title: 'Workshop / Breakout',
            body: 'More interactive teaching with room for questions, discussion, and practical application.',
            note: 'Best for smaller, focused groups.',
          },
          {
            number: '03',
            title: 'Weekend Retreat',
            body: 'A connected sequence of sessions that lets a group go deeper into body, mind, relationships, faith, and sexual health across the lifespan.',
            note: 'Best for a full immersive experience.',
          },
        ],
        ctaEyebrow: 'Start a Conversation',
        ctaTitle: 'Planning an event?',
        ctaBody:
          'Share the audience, setting, timing, and topics you are considering, and we can shape the right format for your group.',
      } as never,
      status: 'published',
    });
  }

  const blogPostExists = await strapi.documents('api::blog-post.blog-post').findFirst();
  if (!blogPostExists) {
    strapi.log.info('[seed] Creating blog posts...');
    const blogPosts = [
      {
        title: 'Why Desire Changes Before Anything Else Does',
        category: 'Perimenopause',
        excerpt:
          "For many women, a dip in desire is the very first sign that hormones are shifting—long before a missed period ever shows up. Here's the biology behind it.",
        readTime: '6 min read',
        publishedDate: '2026-03-12',
        body: "This is a sample post used to preview the blog template—the content below is illustrative, not published editorial.\n\nLong before a missed period or a hot flash ever shows up, many women notice something quieter: sex just doesn't feel the same. Desire that used to arrive on its own seems to have gone somewhere else.\n\n## The hormone doing the quiet work\n\nEstrogen and progesterone get most of the attention, but testosterone—yes, women produce it too—plays an outsized role in desire, sensation, and energy.",
      },
      {
        title: "Painful Sex Isn't Something You Have to Live With",
        category: 'Pelvic Health',
        excerpt:
          "Dryness, tightness, and pain during intimacy are common—but common doesn't mean permanent. A look at what's actually happening in the pelvic floor.",
        readTime: '5 min read',
        publishedDate: '2026-02-26',
        body: 'Sample post content. Dryness, tightness, and pain during intimacy are common—but common does not mean permanent.',
      },
      {
        title: 'Responsive Desire: The Piece Nobody Explains',
        category: 'Relationships',
        excerpt:
          'Not everyone experiences desire the same way. Understanding the difference between spontaneous and responsive desire can change how you see your own body.',
        readTime: '7 min read',
        publishedDate: '2026-02-09',
        body: 'Sample post content on responsive versus spontaneous desire.',
      },
      {
        title: 'What Your Bladder Has to Do With Your Hormones',
        category: 'Hormones',
        excerpt:
          'Frequent urges, leaks, recurring UTIs—bladder symptoms at midlife are rarely just a bladder problem.',
        readTime: '4 min read',
        publishedDate: '2026-01-22',
        body: 'Sample post content connecting bladder symptoms to hormonal shifts.',
      },
      {
        title: 'Holding Faith and Biology in the Same Conversation',
        category: 'Faith & Sexuality',
        excerpt:
          "You don't have to choose between science and belief. A look at how both can inform a fuller understanding of your body and your intimacy.",
        readTime: '6 min read',
        publishedDate: '2026-01-08',
        body: 'Sample post content on faith-aware, science-grounded education.',
      },
      {
        title: 'The Symptoms Nobody Warned You About',
        category: 'Midlife',
        excerpt:
          'Brain fog, joint aches, mood swings, and changes in intimacy rarely get connected to one another. They are more related than you would think.',
        readTime: '8 min read',
        publishedDate: '2025-12-18',
        body: 'Sample post content on the connected symptoms of midlife hormonal change.',
      },
    ];

    for (const post of blogPosts) {
      await strapi.documents('api::blog-post.blog-post').create({
        data: { ...post, slug: slugify(post.title), coverImage: portraitId } as never,
        status: 'published',
      });
    }
  }

  const productExists = await strapi.documents('api::product.product').findFirst();
  if (!productExists) {
    strapi.log.info('[seed] Creating products...');
    const products = [
      {
        name: 'Understanding Perimenopause Guide',
        category: 'Digital Guide',
        price: 28,
        blurb: 'A plain-language walkthrough of the hormonal shifts behind midlife symptoms.',
        order: 1,
      },
      {
        name: 'Pelvic Floor Foundations',
        category: 'Video Course',
        price: 64,
        blurb: 'Self-paced lessons on pelvic health, comfort, and function at any age.',
        order: 2,
      },
      {
        name: 'Intimacy Journal',
        category: 'Print + Digital',
        price: 22,
        blurb: 'Guided prompts for tracking symptoms, patterns, and conversations worth having.',
        order: 3,
      },
      {
        name: 'Desire Discrepancy Workbook',
        category: 'Digital Guide',
        price: 32,
        blurb: 'A couples-friendly workbook for navigating mismatched desire with less friction.',
        order: 4,
      },
      {
        name: 'Hormone Lab Checklist',
        category: 'Printable',
        price: 12,
        blurb: 'The exact panel to request from your clinician, explained in plain English.',
        order: 5,
      },
      {
        name: 'Faith & Sexuality Workshop Replay',
        category: 'Video',
        price: 45,
        blurb: 'A recorded workshop session for those who want a faith-aware, science-grounded lens.',
        order: 6,
      },
    ];

    for (const product of products) {
      await strapi.documents('api::product.product').create({
        data: product as never,
        status: 'published',
      });
    }
  }

  const bookingServiceExists = await strapi
    .documents('api::booking-service.booking-service')
    .findFirst();
  if (!bookingServiceExists) {
    strapi.log.info('[seed] Creating booking services...');
    const bookingServices = [
      {
        title: 'Educational Consult',
        duration: '60 minutes',
        price: '$185',
        description: 'A private one-on-one session covering body, mind, and relationships.',
        order: 1,
      },
      {
        title: 'Follow-Up Session',
        duration: '30 minutes',
        price: '$95',
        description: 'For returning clients continuing an existing conversation.',
        order: 2,
      },
      {
        title: 'Group Series Enrollment',
        duration: '3–4 sessions',
        price: '$220',
        description: 'Reserve a seat in the next live group series.',
        order: 3,
      },
    ];

    for (const service of bookingServices) {
      await strapi.documents('api::booking-service.booking-service').create({
        data: service as never,
        status: 'published',
      });
    }
  }

  const menuItemExists = await strapi.documents('api::menu-item.menu-item').findFirst();
  if (!menuItemExists) {
    strapi.log.info('[seed] Creating menu items...');
    const menuItems = [
      { label: 'Home', href: '/', group: 'primary', order: 0 },
      { label: 'About', href: '/about', group: 'primary', order: 1 },
      { label: 'Educational Consults', href: '/educational-consults', group: 'services', order: 0 },
      { label: 'Group Sessions', href: '/group-sessions', group: 'services', order: 1 },
      { label: 'Speaking & Retreats', href: '/speaking-retreats', group: 'services', order: 2 },
      { label: 'All Resources', href: '/resources', group: 'resources', order: 0 },
      { label: 'Blog', href: '/blog', group: 'resources', order: 1 },
      { label: 'Videos', href: '/videos', group: 'resources', order: 2 },
      { label: 'FAQ', href: '/faq', group: 'resources', order: 3 },
      { label: 'Shop', href: '/shop', group: 'secondary', order: 0 },
      { label: 'Contact', href: '/contact', group: 'secondary', order: 1 },
    ];

    for (const item of menuItems) {
      await strapi.documents('api::menu-item.menu-item').create({
        data: item as never,
        status: 'published',
      });
    }
  }

  strapi.log.info('[seed] Done.');
}
