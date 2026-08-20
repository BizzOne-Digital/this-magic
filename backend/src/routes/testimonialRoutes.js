import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import {
  getTestimonials,
  createTestimonial,
  submitTestimonial,
  updateTestimonial,
  deleteTestimonial,
  approveTestimonial,
  rejectTestimonial,
} from '../controllers/testimonialController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

const submitLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many submissions. Please try again later.' },
});

router.get('/', getTestimonials);
router.post('/submit', submitLimiter, upload.single('image'), submitTestimonial);
router.post('/', protect, upload.single('image'), createTestimonial);
router.put('/:id/approve', protect, approveTestimonial);
router.put('/:id/reject', protect, rejectTestimonial);
router.put('/:id', protect, upload.single('image'), updateTestimonial);
router.delete('/:id', protect, deleteTestimonial);

export default router;
