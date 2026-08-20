import mongoose from 'mongoose';

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
  { timestamps: true }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);
export default Testimonial;
