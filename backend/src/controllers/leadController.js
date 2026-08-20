import Lead from '../models/Lead.js';
import Settings from '../models/Settings.js';
import { sendLeadNotification, sendCustomerConfirmation } from '../services/emailService.js';

export const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    try {
      await sendLeadNotification(lead);
      const settings = await Settings.findOne();
      if (settings?.sendCustomerConfirmation !== false) {
        await sendCustomerConfirmation(lead);
      }
    } catch (emailError) {
      console.error('Email error:', emailError.message);
    }

    res.status(201).json({ success: true, message: 'Thank you! We will contact you soon.', data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeads = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { eventType: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [leads, total] = await Promise.all([
      Lead.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Lead.countDocuments(query),
    ]);

    res.json({ success: true, data: leads, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, data: lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: 'Lead not found' });
    res.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getLeadStats = async (req, res) => {
  try {
    const [total, newLeads, contacted, followUp, booked, closed, recent] = await Promise.all([
      Lead.countDocuments(),
      Lead.countDocuments({ status: 'New' }),
      Lead.countDocuments({ status: 'Contacted' }),
      Lead.countDocuments({ status: 'Follow Up' }),
      Lead.countDocuments({ status: 'Booked' }),
      Lead.countDocuments({ status: 'Closed' }),
      Lead.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      success: true,
      data: { total, newLeads, contacted, followUp, booked, closed, recent },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
