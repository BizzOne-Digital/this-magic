import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    badge: { type: String, default: '' },
    icon: { type: String, default: 'tag' },
    discountAmount: { type: String, default: '' },
    terms: { type: String, default: '' },
    imageUrl: { type: String, default: '' },
    publicId: { type: String, default: '' },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Promotion = mongoose.model('Promotion', promotionSchema);
export default Promotion;
