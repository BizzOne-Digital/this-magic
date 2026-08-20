import Settings from '../models/Settings.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) settings = await Settings.create({});
    const updated = await Settings.findByIdAndUpdate(settings._id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const Lead = (await import('../models/Lead.js')).default;
    const Service = (await import('../models/Service.js')).default;
    const Testimonial = (await import('../models/Testimonial.js')).default;
    const Promotion = (await import('../models/Promotion.js')).default;
    const Gallery = (await import('../models/Gallery.js')).default;

    const now = new Date();
    const [totalLeads, newLeads, totalServices, totalTestimonials, activePromotions, totalGallery, recentLeads] =
      await Promise.all([
        Lead.countDocuments(),
        Lead.countDocuments({ status: 'New' }),
        Service.countDocuments({ isActive: true }),
        Testimonial.countDocuments({ isActive: true }),
        Promotion.countDocuments({
          isActive: true,
          $or: [{ expiryDate: { $exists: false } }, { expiryDate: null }, { expiryDate: { $gte: now } }],
        }),
        Gallery.countDocuments({ isActive: true }),
        Lead.find().sort({ createdAt: -1 }).limit(8),
      ]);

    res.json({
      success: true,
      data: { totalLeads, newLeads, totalServices, totalTestimonials, activePromotions, totalGallery, recentLeads },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
