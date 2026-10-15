import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    hero: {
      headline: { type: String, default: 'The Vibe. The Voice. The DJ Your Event Needs.' },
      headlineParts: {
        line1: { type: String, default: 'the vibe' },
        line2: { type: String, default: 'the voice' },
        line3: { type: String, default: 'the dj' },
        scriptLine: { type: String, default: 'your event needs' },
      },
      subheading: {
        type: String,
        default: 'Weddings • Sweet 16s • Birthdays • Private Events • Photo Booth • Photography • Videography',
      },
      imageUrl: {
        type: String,
        default: '/images/event-1-800.webp',
      },
      publicId: { type: String, default: '' },
      primaryCta: { type: String, default: 'Call or Text DJ Adam Today' },
      secondaryCta: { type: String, default: '732 829 2344' },
    },
    about: {
      headline: { type: String, default: 'MAKING MOMENTS' },
      scriptAccent: { type: String, default: 'Unforgettable' },
      paragraphs: [{ type: String }],
      ctaLabel: { type: String, default: 'Learn More' },
      imageUrls: [{ type: String }],
      imagePublicIds: [{ type: String }],
    },
    contact: {
      email: { type: String, default: 'thismagicmomentllc@gmail.com' },
      phone: { type: String, default: '732-829-2344' },
      website: { type: String, default: 'www.thismagicmomentnj.com' },
      address: { type: String, default: 'New Jersey & Tri-State Area' },
      serviceArea: { type: String, default: 'Serving New Jersey, New York, Pennsylvania & Connecticut' },
    },
    social: {
      instagram: { type: String, default: 'this_magic_moment_nj' },
      facebook: { type: String, default: 'Adam Aronow' },
      instagramUrl: { type: String, default: 'https://instagram.com/this_magic_moment_nj' },
      facebookUrl: { type: String, default: '' },
    },
    footer: {
      tagline: { type: String, default: 'Creating unforgettable celebrations across the Tri-State area.' },
      copyright: { type: String, default: '© 2026 This Magic Moment. All Rights Reserved.' },
    },
    logo: {
      imageUrl: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
    seo: {
      // Display copy only: live page metadata comes from frontend/src/constants/seo.js
      // so the prerendered HTML and rendered page always match.
      homeTitle: { type: String, default: 'New Jersey DJ & Event Entertainment | This Magic Moment' },
      homeDescription: {
        type: String,
        default: 'Plan your New Jersey wedding, Sweet 16 or private event with DJ Adam. Explore DJ, photo booth, photography and video options. Request a custom quote.',
      },
      aboutTitle: { type: String, default: 'DJ Adam, New Jersey Event DJ | This Magic Moment' },
      aboutDescription: {
        type: String,
        default: 'Meet DJ Adam, the New Jersey DJ behind This Magic Moment. Learn about his approach to weddings, Sweet 16s and private events, and book a free consultation.',
      },
      testimonialsTitle: { type: String, default: 'New Jersey DJ Reviews | This Magic Moment' },
      testimonialsDescription: {
        type: String,
        default: 'Read reviews of DJ Adam and This Magic Moment from New Jersey weddings, Sweet 16s and other celebrations. Explore client stories and plan your event.',
      },
      contactTitle: { type: String, default: 'Contact DJ Adam in New Jersey | This Magic Moment' },
      contactDescription: {
        type: String,
        default: 'Contact DJ Adam to check your event date and request a custom quote for DJ, photo booth, photography or videography in New Jersey and surrounding areas.',
      },
    },
    aboutPage: {
      heroTitle: { type: String, default: 'About DJ Adam' },
      heroSubtitle: { type: String, default: 'The DJ Who Brings Energy, Elegance & Unforgettable Moments' },
      heroImageUrl: { type: String, default: '' },
      heroPublicId: { type: String, default: '' },
      storyImageUrl: { type: String, default: '' },
      storyPublicId: { type: String, default: '' },
      storyTitle: { type: String, default: 'My Story' },
      storyContent: [{ type: String }],
      missionTitle: { type: String, default: 'My Mission' },
      missionContent: { type: String, default: '' },
      values: [{ title: String, description: String, icon: String }],
      stats: [{ label: String, value: String }],
      whyChooseUs: [{ title: String, description: String }],
    },
    testimonialsPage: {
      heroTitle: { type: String, default: 'What Our Clients Say' },
      heroSubtitle: { type: String, default: 'Real reviews from real celebrations across New Jersey' },
      introText: { type: String, default: '' },
    },
    reviewLinks: {
      theKnot: { type: String, default: '' },
      weddingWire: { type: String, default: '' },
      google: { type: String, default: '' },
    },
    contactPage: {
      heroTitle: { type: String, default: "Let's Connect" },
      heroSubtitle: { type: String, default: 'Ready to create magic? Tell us about your event.' },
      formIntro: { type: String, default: '' },
      faqs: [{ question: String, answer: String }],
    },
    videos: {
      title: { type: String, default: 'See The Magic In Action' },
      scriptAccent: { type: String, default: 'Watch the Energy' },
      subtitle: {
        type: String,
        default:
          'Real event footage from weddings, Sweet 16s, and Bar & Bat Mitzvah celebrations across New Jersey.',
      },
      items: [
        {
          title: String,
          category: String,
          youtubeId: String,
          url: String,
          description: String,
        },
      ],
    },
  },
  { timestamps: true }
);

const Content = mongoose.model('Content', contentSchema);
export default Content;
