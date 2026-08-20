import Promotion from '../models/Promotion.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';

export const getPromotions = async (req, res) => {
  try {
    const now = new Date();
    let query = req.query.all === 'true' ? {} : { isActive: true };

    if (req.query.all !== 'true') {
      query = {
        ...query,
        $or: [{ expiryDate: { $exists: false } }, { expiryDate: null }, { expiryDate: { $gte: now } }],
      };
    }

    const promotions = await Promotion.find(query).sort({ order: 1 });
    res.json({ success: true, data: promotions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createPromotion = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'this-magic-moment/promotions');
      data.imageUrl = result.secure_url;
      data.publicId = result.public_id;
    }
    const promotion = await Promotion.create(data);
    res.status(201).json({ success: true, data: promotion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found' });

    const data = { ...req.body };
    if (req.file) {
      if (promotion.publicId) await deleteFromCloudinary(promotion.publicId);
      const result = await uploadToCloudinary(req.file, 'this-magic-moment/promotions');
      data.imageUrl = result.secure_url;
      data.publicId = result.public_id;
    }

    const updated = await Promotion.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deletePromotion = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) return res.status(404).json({ success: false, message: 'Promotion not found' });
    if (promotion.publicId) await deleteFromCloudinary(promotion.publicId);
    await promotion.deleteOne();
    res.json({ success: true, message: 'Promotion deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
