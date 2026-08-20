import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    eventType: { type: String, required: true, trim: true },
    eventDate: { type: Date },
    eventLocation: { type: String, trim: true },
    guestCount: { type: Number },
    interestedServices: [{ type: String }],
    hearAboutUs: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['New', 'Contacted', 'Follow Up', 'Booked', 'Closed'],
      default: 'New',
    },
    internalNotes: { type: String, default: '' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
