import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    icon: { type: String, default: 'music' },
    imageUrl: { type: String, default: '' },
    publicId: { type: String, default: '' },
    ctaLabel: { type: String, default: 'Learn More' },
    ctaLink: { type: String, default: '/contact' },
    features: [{ type: String }],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
