import { Router } from 'express';
import { body } from 'express-validator';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
  getLeadStats,
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const leadValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('eventType').trim().notEmpty().withMessage('Event type is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
];

router.post('/', leadValidation, validate, createLead);
router.get('/stats', protect, getLeadStats);
router.get('/', protect, getLeads);
router.get('/:id', protect, getLead);
router.put('/:id', protect, updateLead);
router.delete('/:id', protect, deleteLead);

export default router;
