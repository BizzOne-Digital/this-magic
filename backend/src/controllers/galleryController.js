import Gallery from '../models/Gallery.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';

const fileNameToTitle = (filename) =>
  filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const getGallery = async (req, res) => {
  try {
    const query = req.query.all === 'true' ? {} : { isActive: true };
    if (req.query.category) query.category = req.query.category;
    const gallery = await Gallery.find(query).sort({ order: 1 });
    res.json({ success: true, data: gallery });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkCreateGalleryItems = async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ success: false, message: 'At least one image is required' });
    }

    let itemsMeta = [];
    if (req.body.items) {
      itemsMeta = typeof req.body.items === 'string' ? JSON.parse(req.body.items) : req.body.items;
    }

    const defaultCategory = req.body.defaultCategory || 'General';
    const startOrder = Number(req.body.startOrder) || 0;
    const created = [];
    const errors = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const meta = itemsMeta[i] || {};
      const title = meta.title?.trim() || fileNameToTitle(file.originalname) || `Gallery Image ${i + 1}`;
      const category = meta.category?.trim() || defaultCategory;
      const caption = meta.caption?.trim() || '';

      try {
        const result = await uploadToCloudinary(file, 'this-magic-moment/gallery');
        const item = await Gallery.create({
          title,
          caption,
          category,
          imageUrl: result.secure_url,
          publicId: result.public_id,
          order: startOrder + i,
          isActive: meta.isActive !== false,
        });
        created.push(item);
      } catch (err) {
        errors.push({ file: file.originalname, message: err.message });
      }
    }

    if (!created.length) {
      return res.status(500).json({
        success: false,
        message: 'Failed to upload images',
        errors,
      });
    }

    res.status(201).json({
      success: true,
      data: created,
      message: `Added ${created.length} image(s)${errors.length ? `, ${errors.length} failed` : ''}`,
      errors: errors.length ? errors : undefined,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createGalleryItem = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'Image is required' });
    const result = await uploadToCloudinary(req.file, 'this-magic-moment/gallery');
    const item = await Gallery.create({
      ...req.body,
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });

    const data = { ...req.body };
    if (req.file) {
      if (item.publicId) await deleteFromCloudinary(item.publicId);
      const result = await uploadToCloudinary(req.file, 'this-magic-moment/gallery');
      data.imageUrl = result.secure_url;
      data.publicId = result.public_id;
    }

    const updated = await Gallery.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Gallery item not found' });
    if (item.publicId) await deleteFromCloudinary(item.publicId);
    await item.deleteOne();
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const reorderGallery = async (req, res) => {
  try {
    const { items } = req.body;
    await Promise.all(items.map(({ id, order }) => Gallery.findByIdAndUpdate(id, { order })));
    res.json({ success: true, message: 'Gallery reordered' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
