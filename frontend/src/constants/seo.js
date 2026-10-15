// Single source of truth for public page metadata.
// Imported by the React SEO component AND by scripts/prerender.mjs at build time,
// so the original HTML response and the rendered page always agree.
// Keep this file plain JS (no JSX, no browser APIs).

export const SITE_URL = 'https://www.thismagicmomentnj.com';
export const SITE_NAME = 'This Magic Moment';
export const DEFAULT_OG_IMAGE = {
  url: `${SITE_URL}/images/og-image.jpg`,
  width: 1200,
  height: 630,
  alt: 'Guests dancing with raised hands on a crowded dance floor',
};

export const PAGE_SEO = {
  guides: {
    path: '/blog/categories/party-dj',
    title: 'NJ DJ & Party Planning Guides | This Magic Moment',
    description: 'Plan wedding entertainment, Bar and Bat Mitzvah celebrations and Sweet 16 music with practical DJ planning guides from This Magic Moment in New Jersey.',
    h1: 'New Jersey DJ & Party Planning Guides',
  },
  home: {
    path: '/',
    title: 'New Jersey DJ & Event Entertainment | This Magic Moment',
    description:
      'Plan your New Jersey wedding, Sweet 16 or private event with DJ Adam. Explore DJ, photo booth, photography and video options. Request a custom quote.',
    h1: 'New Jersey DJ & Event Entertainment',
    intro:
      'DJ Adam and This Magic Moment provide DJ, MC, photo booth, photography and videography services for weddings, Sweet 16s, birthdays and private events across New Jersey and the Tri-State area.',
  },
  about: {
    path: '/about',
    title: 'DJ Adam, New Jersey Event DJ | This Magic Moment',
    description:
      'Meet DJ Adam, the New Jersey DJ behind This Magic Moment. Learn about his approach to weddings, Sweet 16s and private events, and book a free consultation.',
    h1: 'Meet DJ Adam, Your New Jersey Event DJ',
    intro:
      'DJ Adam is the New Jersey DJ and MC behind This Magic Moment, planning music and event flow for weddings, Sweet 16s, birthdays and private celebrations.',
  },
  services: {
    path: '/services',
    title: 'DJ & Event Services in NJ | This Magic Moment',
    description:
      'Explore NJ wedding and Sweet 16 DJ services, birthday and private event entertainment, photo booths, photography and videography. Ask for a custom quote.',
    h1: 'DJ & Event Services in New Jersey',
    intro:
      'Wedding DJ, Sweet 16 DJ, birthday parties, private events, photo booth, photography and videography from This Magic Moment, serving New Jersey and the Tri-State area.',
  },
  testimonials: {
    path: '/testimonials',
    title: 'New Jersey DJ Reviews | This Magic Moment',
    description:
      'Read reviews of DJ Adam and This Magic Moment from New Jersey weddings, Sweet 16s and other celebrations. Explore client stories and plan your event.',
    h1: 'New Jersey DJ Reviews from Our Clients',
    intro:
      'Client reviews of DJ Adam and This Magic Moment from weddings, Sweet 16s, birthdays and private events, with links to The Knot and WeddingWire.',
  },
  contact: {
    path: '/contact',
    title: 'Contact DJ Adam in New Jersey | This Magic Moment',
    description:
      'Contact DJ Adam to check your event date and request a custom quote for DJ, photo booth, photography or videography in New Jersey and surrounding areas.',
    h1: 'Contact DJ Adam for Your New Jersey Event',
    intro:
      'Call or text 732 829 2344, email thismagicmomentllc@gmail.com, or send the event inquiry form to check your date and request a custom quote.',
  },
};

export const NOT_FOUND_SEO = {
  title: 'Page Not Found | This Magic Moment',
  description: 'The page you requested could not be found. Explore DJ and event services from This Magic Moment.',
};

export const absoluteUrl = (path = '/') => (path === '/' ? `${SITE_URL}/` : `${SITE_URL}${path}`);

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      logo: `${SITE_URL}/logo.png`,
      telephone: '+17328292344',
      email: 'thismagicmomentllc@gmail.com',
      areaServed: ['New Jersey', 'New York', 'Pennsylvania', 'Connecticut'],
      // Add confirmed business-profile URLs only (never a placeholder platform root).
      sameAs: ['https://instagram.com/this_magic_moment_nj'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};
