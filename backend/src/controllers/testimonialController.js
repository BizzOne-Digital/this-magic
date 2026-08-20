import Testimonial from '../models/Testimonial.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';
import { parseTestimonialBody } from '../utils/parseBody.js';

export const getTestimonials = async (req, res) => {
  try {
    const query =
      req.query.all === 'true'
        ? {}
        : {
            isActive: true,
            $or: [{ status: 'Approved' }, { status: { $exists: false } }],
          };
    const testimonials = await Testimonial.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const attachImage = async (req, data, existingPublicId) => {
  if (req.file) {
    if (existingPublicId) await deleteFromCloudinary(existingPublicId);
    const result = await uploadToCloudinary(req.file, 'this-magic-moment/testimonials');
    data.imageUrl = result.secure_url;
    data.publicId = result.public_id;
  }
  return data;
};

export const createTestimonial = async (req, res) => {
  try {
    let data = parseTestimonialBody(req.body);
    data.status = 'Approved';
    data.isUserSubmitted = false;
    data = await attachImage(req, data);
    const testimonial = await Testimonial.create(data);
    res.status(201).json({ success: true, data: testimonial });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitTestimonial = async (req, res) => {
  try {
    const { clientName, eventType, review, rating, location } = req.body;

    if (!clientName?.trim() || !eventType?.trim() || !review?.trim()) {
      return res.status(400).json({ success: false, message: 'Name, event type, and review are required' });
    }

    let data = {
      clientName: clientName.trim(),
      eventType: eventType.trim(),
      review: review.trim(),
      rating: Math.min(5, Math.max(1, Number(rating) || 5)),
      location: location?.trim() || '',
      isActive: false,
      isFeatured: false,
      isUserSubmitted: true,
      status: 'Pending',
      order: 999,
    };

    data = await attachImage(req, data);

    const testimonial = await Testimonial.create(data);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been submitted and will appear after approval.',
      data: testimonial,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });

    let data = parseTestimonialBody(req.body);
    data = await attachImage(req, data, testimonial.publicId);

    const updated = await Testimonial.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const approveTestimonial = async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isActive: true, status: 'Approved' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, data: updated, message: 'Testimonial approved' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const rejectTestimonial = async (req, res) => {
  try {
    const updated = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { isActive: false, status: 'Rejected' },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    res.json({ success: true, data: updated, message: 'Testimonial rejected' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ success: false, message: 'Testimonial not found' });
    if (testimonial.publicId) await deleteFromCloudinary(testimonial.publicId);
    await testimonial.deleteOne();
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
