import mongoose from 'mongoose';
import { realTestimonials } from '../data/realTestimonials.js';

const emailReviews = new Set(realTestimonials.map((review) => review.review));

const testimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    eventType: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    review: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    publicId: { type: String, default: '' },
    location: { type: String, default: '' },
    eventDate: { type: Date },
    reviewDate: { type: Date },
    sourceLabel: { type: String, trim: true, default: '' },
    sourceUrl: {
      type: String, trim: true, default: '',
      validate: { validator: (value) => !value || /^https?:\/\/[^\s]+$/i.test(value), message: 'Review source must be an HTTP or HTTPS URL' },
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    isUserSubmitted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Approved',
    },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    toJSON: { transform: (_document, review) => {
      if (!review.sourceLabel && emailReviews.has(review.review)) review.sourceLabel = 'Client feedback shared by email';
      return review;
    } },
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
