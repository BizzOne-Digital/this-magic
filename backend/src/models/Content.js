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
        default: 'https://images.unsplash.com/photo-1571266028247-4d2a4b4e4b3a?w=1920&q=80',
      },
      publicId: { type: String, default: '' },
      primaryCta: { type: String, default: 'Book Your Date' },
      secondaryCta: { type: String, default: 'Check Availability' },
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
      email: { type: String, default: 'djadam@thismagicmomentnj.com' },
      phone: { type: String, default: '732-829-2344' },
      website: { type: String, default: 'www.thismagicmomentnj.com' },
      address: { type: String, default: 'New Jersey & Tri-State Area' },
      serviceArea: { type: String, default: 'Serving New Jersey, New York, Pennsylvania & Connecticut' },
    },
    social: {
      instagram: { type: String, default: 'this_magic_moment_nj' },
      facebook: { type: String, default: 'Adam Aronow' },
      instagramUrl: { type: String, default: 'https://instagram.com/this_magic_moment_nj' },
      facebookUrl: { type: String, default: 'https://facebook.com' },
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
      homeTitle: { type: String, default: 'This Magic Moment | Premium DJ & Event Entertainment | Adam Aronow' },
      homeDescription: {
        type: String,
        default: 'Professional DJ services for weddings, Sweet 16s, birthdays & private events in New Jersey. Photo booth, photography & videography available.',
      },
      aboutTitle: { type: String, default: 'About Adam Aronow | This Magic Moment DJ' },
      aboutDescription: {
        type: String,
        default: 'Meet Adam Aronow — a professional DJ and event entertainer dedicated to creating unforgettable moments across New Jersey.',
      },
      testimonialsTitle: { type: String, default: 'Client Testimonials | This Magic Moment' },
      testimonialsDescription: {
        type: String,
        default: 'Read what couples, families, and event planners say about This Magic Moment DJ services.',
      },
      contactTitle: { type: String, default: 'Contact & Book Your Date | This Magic Moment' },
      contactDescription: {
        type: String,
        default: 'Get a quote, check availability, and book Adam Aronow for your next wedding, Sweet 16, or celebration.',
      },
    },
    aboutPage: {
      heroTitle: { type: String, default: 'About Adam Aronow' },
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
