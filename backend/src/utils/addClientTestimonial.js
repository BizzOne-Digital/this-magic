import '../config/env.js';
import connectDB from '../config/db.js';
import Testimonial from '../models/Testimonial.js';
import { realTestimonials } from '../data/realTestimonials.js';

/** @deprecated Use npm run sync-testimonials instead */
const addClientTestimonial = async () => {
  try {
    await connectDB();
    console.log('Use: npm run sync-testimonials');
    console.log('Running full real testimonials sync...');

    await Testimonial.deleteMany({});
    await Testimonial.insertMany(
      realTestimonials.map((t) => ({
        ...t,
        publicId: '',
        status: 'Approved',
        isUserSubmitted: false,
      }))
    );

    console.log(`Synced ${realTestimonials.length} real testimonials`);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

addClientTestimonial();
