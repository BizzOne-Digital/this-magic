import './config/env.js';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import { realTestimonials } from '../data/realTestimonials.js';
import Promotion from '../models/Promotion.js';
import Gallery from '../models/Gallery.js';
import Content from '../models/Content.js';
import Settings from '../models/Settings.js';

const seed = async () => {
  try {
    await connectDB();
    console.log('Seeding database...');

    // Clear existing data
    await Promise.all([
      User.deleteMany(),
      Service.deleteMany(),
      Testimonial.deleteMany(),
      Promotion.deleteMany(),
      Gallery.deleteMany(),
      Content.deleteMany(),
      Settings.deleteMany(),
    ]);

    // Admin user
    await User.create({
      name: process.env.ADMIN_NAME || 'Adam Aronow',
      email: process.env.ADMIN_EMAIL_SEED || 'admin@thismagicmomentnj.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    });
    console.log('Admin created: admin@thismagicmomentnj.com / Admin@123456');

    // Services
    const services = [
      {
        title: 'Wedding DJ',
        slug: 'wedding-dj',
        shortDescription: 'Unforgettable celebrations tailored to your love story.',
        description:
          'Your wedding day deserves a DJ who understands that every moment matters — from the walk down the aisle to the last dance. Adam creates a seamless flow of energy, emotion, and elegance, reading the room and keeping your dance floor packed all night long. With professional sound, elegant MC services, and a curated playlist built around your vision, your wedding becomes the celebration you always dreamed of.',
        icon: 'rings',
        ctaLabel: 'Book Your Wedding',
        features: ['Custom playlist consultation', 'Professional MC services', 'Ceremony & reception coverage', 'Wireless microphone system', 'Dance floor lighting', 'Timeline coordination with vendors'],
        order: 1,
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
      },
      {
        title: 'Sweet 16 DJ',
        slug: 'sweet-16-dj',
        shortDescription: 'Epic parties. Lasting memories. Maximum energy.',
        description:
          'Sweet 16s are once-in-a-lifetime celebrations, and Adam brings the perfect mix of high-energy hits, current trends, and crowd-pleasing classics to make your teen\'s party absolutely legendary. From the grand entrance to the candle ceremony and beyond, every moment is handled with professionalism while keeping the energy at maximum levels.',
        icon: 'crown',
        ctaLabel: 'Plan Your Sweet 16',
        features: ['Grand entrance coordination', 'Candle ceremony music', 'Age-appropriate playlists', 'Interactive games & activities', 'Photo moment coordination', 'Parent-approved song lists'],
        order: 2,
        imageUrl: 'https://images.unsplash.com/photo-1530103862673-de8c9debad1d?w=800&q=80',
      },
      {
        title: 'Birthday Parties',
        slug: 'birthday-parties',
        shortDescription: 'Every age, every vibe, every celebration.',
        description:
          'Whether it\'s a milestone 50th birthday bash, a kids\' party, or an intimate gathering of close friends, Adam adapts his style to match your celebration perfectly. From sophisticated cocktail hours to all-out dance parties, every birthday becomes an event people talk about for years.',
        icon: 'cake',
        ctaLabel: 'Celebrate in Style',
        features: ['All ages welcome', 'Custom theme playlists', 'Interactive entertainment', 'Flexible packages', 'Indoor & outdoor setups', 'Special milestone coordination'],
        order: 3,
        imageUrl: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c7b?w=800&q=80',
      },
      {
        title: 'Private Events',
        slug: 'private-events',
        shortDescription: 'Corporate galas, fundraisers, and exclusive celebrations.',
        description:
          'From corporate holiday parties and charity galas to bar mitzvahs, anniversaries, and exclusive private gatherings, Adam delivers polished, professional entertainment that elevates any occasion. Expect seamless execution, appropriate music selection, and a host who knows how to work any room.',
        icon: 'star',
        ctaLabel: 'Plan Your Event',
        features: ['Corporate event expertise', 'Fundraiser & gala experience', 'Bar/Bat Mitzvah celebrations', 'Anniversary parties', 'Holiday parties', 'Fully insured & professional'],
        order: 4,
        imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
      },
      {
        title: 'Photo Booth',
        slug: 'photo-booth',
        shortDescription: 'Fun props. Instant smiles. Unlimited memories.',
        description:
          'Add an extra layer of fun to any event with our premium photo booth experience. Guests love the instant prints, digital copies, and hilarious props that create lasting memories. Perfect as an add-on to DJ services or as a standalone attraction for weddings, Sweet 16s, and corporate events.',
        icon: 'camera',
        ctaLabel: 'Add Photo Booth',
        features: ['Premium props collection', 'Instant print & digital copies', 'Custom photo strip branding', 'Social media sharing station', 'Attendant included', 'Unlimited sessions'],
        order: 5,
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80',
      },
      {
        title: 'Photography',
        slug: 'photography',
        shortDescription: 'Capture every magic moment in stunning detail.',
        description:
          'Professional event photography that captures the candid laughs, tearful toasts, and dance floor chaos that make your celebration unique. Adam\'s photography team works seamlessly alongside DJ services to document your event from every angle without being intrusive.',
        icon: 'photo',
        ctaLabel: 'Book Photography',
        features: ['Candid & posed coverage', 'High-resolution digital gallery', 'Professional editing', 'Quick turnaround times', 'Engagement sessions available', 'Album design options'],
        order: 6,
        imageUrl: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
      },
      {
        title: 'Videography',
        slug: 'videography',
        shortDescription: 'Relive the magic with cinematic event films.',
        description:
          'From highlight reels that capture the energy of your dance floor to cinematic wedding films you\'ll watch for decades, our videography services preserve the emotion, laughter, and magic of your celebration in motion. Perfect paired with DJ and photography for complete event coverage.',
        icon: 'video',
        ctaLabel: 'Book Videography',
        features: ['Cinematic highlight reels', 'Full ceremony coverage', 'Drone footage available', 'Same-day edit options', 'Social media clips', 'Professional color grading'],
        order: 7,
        imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80',
      },
    ];
    await Service.insertMany(services);

    // Testimonials — real client reviews only
    await Testimonial.insertMany(
      realTestimonials.map((t) => ({
        ...t,
        publicId: '',
        status: 'Approved',
        isUserSubmitted: false,
      }))
    );

    // Promotions
    await Promotion.insertMany([
      {
        title: '$500 OFF Weddings for 2026 & 2027',
        description: 'Book your dream wedding DJ package for 2026 or 2027 and save $500! Limited availability — premium dates fill up fast.',
        badge: 'Wedding Special',
        icon: 'tag',
        discountAmount: '$500',
        terms: 'Valid for new bookings only. Minimum 5-hour package required. Cannot be combined with other offers.',
        isFeatured: true,
        isActive: true,
        order: 1,
        expiryDate: new Date('2027-12-31'),
      },
      {
        title: '$250 OFF All 4-Hour Events',
        description: 'Save $250 on any event booking with a 4-hour minimum. Perfect for Sweet 16s, birthdays, anniversaries, and private celebrations.',
        badge: 'Event Special',
        icon: 'gift',
        discountAmount: '$250',
        terms: '4-hour minimum booking required. Valid for Sweet 16s, birthdays, private events, and corporate parties.',
        isFeatured: true,
        isActive: true,
        order: 2,
        expiryDate: new Date('2026-12-31'),
      },
    ]);

    // Gallery (using Unsplash placeholders - admin can replace via Cloudinary)
    const galleryItems = [
      { title: 'Wedding Dance Floor', caption: 'Packed dance floor at a luxury NJ wedding', category: 'Weddings', order: 1, imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80', publicId: 'seed-wedding-1' },
      { title: 'DJ Setup', caption: 'Professional DJ booth with premium sound', category: 'DJ', order: 2, imageUrl: 'https://images.unsplash.com/photo-1571266028247-4d2a4b4e4b3a?w=600&q=80', publicId: 'seed-dj-1' },
      { title: 'Sweet 16 Celebration', caption: 'Epic Sweet 16 party energy', category: 'Sweet 16s', order: 3, imageUrl: 'https://images.unsplash.com/photo-1530103862673-de8c9debad1d?w=600&q=80', publicId: 'seed-sweet16-1' },
      { title: 'Photo Booth Fun', caption: 'Guests loving the photo booth experience', category: 'Photo Booth', order: 4, imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80', publicId: 'seed-photobooth-1' },
      { title: 'Birthday Bash', caption: 'Milestone birthday celebration', category: 'Birthdays', order: 5, imageUrl: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c7b?w=600&q=80', publicId: 'seed-birthday-1' },
      { title: 'Wedding Ceremony', caption: 'Beautiful ceremony moment', category: 'Weddings', order: 6, imageUrl: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', publicId: 'seed-wedding-2' },
      { title: 'Event Photography', caption: 'Capturing candid celebration moments', category: 'Photography', order: 7, imageUrl: 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=600&q=80', publicId: 'seed-photo-1' },
      { title: 'Cinematic Highlights', caption: 'Professional event videography', category: 'Videography', order: 8, imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&q=80', publicId: 'seed-video-1' },
    ];
    await Gallery.insertMany(galleryItems);

    // Website Content
    await Content.create({
      hero: {
        headline: 'The Vibe. The Voice. The DJ Your Event Needs.',
        headlineParts: {
          line1: 'the vibe',
          line2: 'the voice',
          line3: 'the dj',
          scriptLine: 'your event needs',
        },
        subheading: 'Weddings • Sweet 16s • Birthdays • Private Events • Photo Booth • Photography • Videography',
        imageUrl: 'https://images.unsplash.com/photo-1571266028247-4d2a4b4e4b3a?w=1920&q=80',
        primaryCta: 'Book Your Date',
        secondaryCta: 'Check Availability',
      },
      about: {
        headline: 'MAKING MOMENTS',
        scriptAccent: 'Unforgettable',
        paragraphs: [
          'Adam Aronow is a professional DJ and event entertainer based in New Jersey, dedicated to creating celebrations that people remember for a lifetime. With years of experience entertaining at weddings, Sweet 16s, milestone birthdays, and premium private events across the Tri-State area, Adam brings the perfect blend of energy, elegance, and expertise to every occasion.',
          'What sets This Magic Moment apart is the personal touch. Adam doesn\'t just show up and press play — he invests time understanding your vision, curating the perfect soundtrack, and orchestrating the flow of your event from the first note to the last dance. Whether you need a sophisticated wedding MC, a high-energy Sweet 16 host, or complete entertainment with photo booth, photography, and videography, Adam delivers a seamless, stress-free experience.',
          'From intimate gatherings to grand ballroom celebrations, Adam\'s professional-grade sound, dynamic lighting, and intuitive crowd-reading skills ensure your dance floor stays packed and your guests stay engaged. When you book This Magic Moment, you\'re not just hiring a DJ — you\'re partnering with someone who genuinely cares about making your event magical.',
        ],
        ctaLabel: 'Learn More',
        imageUrls: [
          'https://images.unsplash.com/photo-1571266028247-4d2a4b4e4b3a?w=600&q=80',
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=400&q=80',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&q=80',
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80',
        ],
      },
      aboutPage: {
        heroTitle: 'About Adam Aronow',
        heroSubtitle: 'The DJ Who Brings Energy, Elegance & Unforgettable Moments to Every Celebration',
        storyTitle: 'My Story',
        storyContent: [
          'Music has always been my passion. What started as mixing tracks for friends\' parties evolved into a full-time calling — helping people celebrate life\'s most important moments with the perfect soundtrack. Based in New Jersey, I\'ve had the privilege of entertaining at hundreds of weddings, Sweet 16s, corporate events, and private celebrations across the Tri-State area.',
          'Every event is different, and that\'s what I love about this work. A wedding requires a completely different approach than a Sweet 16 or a corporate gala — and I\'ve honed my skills to excel at all of them. I take pride in being more than a DJ. I\'m your event partner, your MC, your timeline coordinator, and the person who makes sure your dance floor is the place everyone wants to be.',
          'When I launched This Magic Moment, I wanted to create an entertainment company that couples and families could trust completely. No cookie-cutter playlists, no inexperienced operators, no surprises. Just professional, personalized entertainment that reflects your unique celebration and exceeds your expectations.',
        ],
        missionTitle: 'My Mission',
        missionContent:
          'To create unforgettable celebrations by combining professional DJ expertise, personalized service, and genuine passion for making people happy. Every event I DJ is treated as if it were my own family\'s celebration — with meticulous preparation, flawless execution, and an energy that keeps guests talking long after the last song.',
        values: [
          { title: 'Personalized Service', description: 'Every playlist, every announcement, every moment is tailored to your vision and your guests.', icon: 'heart' },
          { title: 'Professional Excellence', description: 'Premium sound equipment, backup systems, and years of experience at every event.', icon: 'star' },
          { title: 'Seamless Coordination', description: 'Working harmoniously with your planner, venue, and vendors for a stress-free experience.', icon: 'check' },
          { title: 'Unmatched Energy', description: 'Reading the room and adapting in real-time to keep your celebration at peak excitement.', icon: 'zap' },
        ],
        stats: [
          { label: 'Events DJ\'d', value: '500+' },
          { label: 'Years Experience', value: '10+' },
          { label: '5-Star Reviews', value: '100+' },
          { label: 'Tri-State Events', value: '1000+' },
        ],
        whyChooseUs: [
          { title: 'One-Stop Entertainment', description: 'DJ, photo booth, photography, and videography — everything you need from one trusted provider.' },
          { title: 'Fully Insured & Licensed', description: 'Complete peace of mind with full liability insurance and professional business credentials.' },
          { title: 'Free Consultation', description: 'Every booking starts with a complimentary consultation to understand your vision and answer all your questions.' },
          { title: 'Flexible Packages', description: 'Customizable packages for every budget and event type — no hidden fees, no surprises.' },
          { title: 'Premium Equipment', description: 'Professional-grade sound systems, wireless microphones, and dynamic lighting included in every package.' },
          { title: 'Responsive Communication', description: 'Quick responses, detailed planning documents, and a dedicated point of contact from booking to event day.' },
        ],
      },
      testimonialsPage: {
        heroTitle: 'What Our Clients Say',
        heroSubtitle: 'Real reviews from real celebrations across New Jersey and the Tri-State area',
        introText:
          'Nothing makes us happier than hearing from couples, families, and event planners who trusted This Magic Moment with their special day. Read what our clients have to say about their experience working with Adam Aronow — and imagine what your celebration could be like.',
      },
      contactPage: {
        heroTitle: "Let's Connect",
        heroSubtitle: 'Ready to create magic? Tell us about your event and let\'s start planning something unforgettable.',
        formIntro:
          'Fill out the form below and Adam will personally respond within 24 hours to discuss your event, check availability, and provide a custom quote. Prefer to talk directly? Call or email anytime — we\'re here to help make your celebration extraordinary.',
        faqs: [
          { question: 'How far in advance should I book?', answer: 'We recommend booking 6-12 months in advance for weddings and popular dates (Saturdays in spring/fall). Sweet 16s and birthday parties typically need 2-4 months notice. However, we occasionally have last-minute availability — always reach out!' },
          { question: 'What areas do you serve?', answer: 'We primarily serve New Jersey but regularly travel throughout the Tri-State area including New York, Pennsylvania, and Connecticut. Travel fees may apply for events outside our primary service area.' },
          { question: 'Do you offer package discounts?', answer: 'Yes! We offer bundled packages when you combine DJ services with photo booth, photography, or videography. Ask about our current promotions for additional savings.' },
          { question: 'What is included in your DJ packages?', answer: 'All packages include professional sound equipment, wireless microphones, dance floor lighting, MC services, a custom playlist consultation, and unlimited communication leading up to your event.' },
          { question: 'Can we meet before booking?', answer: 'Absolutely! We offer complimentary consultations — in person, over the phone, or via video call. We want to make sure we\'re the perfect fit for your celebration.' },
          { question: 'What happens if you\'re sick on our event day?', answer: 'We have a network of equally qualified professional DJs who can step in if an emergency ever arises. In 10+ years, this has never been an issue — but your peace of mind is our priority.' },
        ],
      },
      videos: {
        title: 'See The Magic In Action',
        scriptAccent: 'Watch the Energy',
        subtitle:
          'Real event footage from weddings, Sweet 16s, and Bar & Bat Mitzvah celebrations across New Jersey.',
        items: [
          {
            title: 'Wedding Demo',
            category: 'Weddings',
            youtubeId: 'ntdPtc-SOTE',
            url: 'https://www.youtube.com/watch?v=ntdPtc-SOTE',
            description:
              'Watch Adam Aronow in action at a real wedding — packed dance floor, seamless transitions, and the perfect mix of romance and celebration.',
          },
          {
            title: 'Bar & Bat Mitzvah Demo',
            category: 'Bar/Bat Mitzvah',
            youtubeId: 'mRQQWw7fG8Y',
            url: 'https://www.youtube.com/watch?v=mRQQWw7fG8Y',
            description:
              'NJ\'s favorite DJ bringing high-energy entertainment to Bar and Bat Mitzvah celebrations.',
          },
          {
            title: 'Sweet 16 DJ Video',
            category: 'Sweet 16',
            youtubeId: 'jEjG_ehduc4',
            url: 'https://www.youtube.com/watch?v=jEjG_ehduc4',
            description:
              'Experience the energy of a Sweet 16 party with Adam Aronow — current hits and epic dance floor moments.',
          },
        ],
      },
    });

    await Settings.create({
      siteName: 'This Magic Moment',
      ownerName: 'Adam Aronow',
      sendCustomerConfirmation: true,
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
