import '../config/env.js';
import connectDB from '../config/db.js';
import Testimonial from '../models/Testimonial.js';
import { realTestimonials } from '../data/realTestimonials.js';

const syncRealTestimonials = async () => {
  try {
    await connectDB();

    const removed = await Testimonial.deleteMany({});
    console.log(`Removed ${removed.deletedCount} old testimonials`);

    const docs = realTestimonials.map((t) => ({
      ...t,
      publicId: '',
      status: 'Approved',
      isUserSubmitted: false,
    }));

    await Testimonial.insertMany(docs);
    console.log(`Added ${docs.length} real client testimonials`);
    console.log('Tip: upload photos in Admin → Testimonials → Edit each review');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

syncRealTestimonials();
