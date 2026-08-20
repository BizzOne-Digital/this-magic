import Service from '../models/Service.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../services/cloudinaryService.js';

export const getServices = async (req, res) => {
  try {
    const query = req.query.all === 'true' ? {} : { isActive: true };
    const services = await Service.find(query).sort({ order: 1 });
    res.json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createService = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'this-magic-moment/services');
      data.imageUrl = result.secure_url;
      data.publicId = result.public_id;
    }
    const service = await Service.create(data);
    res.status(201).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });

    const data = { ...req.body };
    if (req.file) {
      if (service.publicId) await deleteFromCloudinary(service.publicId);
      const result = await uploadToCloudinary(req.file, 'this-magic-moment/services');
      data.imageUrl = result.secure_url;
      data.publicId = result.public_id;
    }

    const updated = await Service.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    if (service.publicId) await deleteFromCloudinary(service.publicId);
    await service.deleteOne();
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
