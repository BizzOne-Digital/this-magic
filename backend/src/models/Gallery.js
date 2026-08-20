import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    caption: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Weddings', 'Sweet 16s', 'Birthdays', 'DJ', 'Photo Booth', 'Photography', 'Videography', 'General'],
      default: 'General',
    },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
