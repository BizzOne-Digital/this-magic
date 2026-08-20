import { uploadToCloudinary } from '../services/cloudinaryService.js';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const folder = req.body.folder || 'this-magic-moment/uploads';
    const result = await uploadToCloudinary(req.file, folder);
    res.json({
      success: true,
      data: { imageUrl: result.secure_url, publicId: result.public_id },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
