import mongoose from 'mongoose';
import { getGalleryText } from '../data/galleryDescriptions.js';

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
  {
    timestamps: true,
    toJSON: { transform: (_document, item) => {
      const text = getGalleryText(item);
      item.title = text.caption;
      item.caption = text.alt;
      return item;
    } },
  }
);

const Gallery = mongoose.model('Gallery', gallerySchema);
export default Gallery;
