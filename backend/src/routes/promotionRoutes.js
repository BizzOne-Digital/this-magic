import { Router } from 'express';
import {
  getPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
} from '../controllers/promotionController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', getPromotions);
router.post('/', protect, upload.single('image'), createPromotion);
router.put('/:id', protect, upload.single('image'), updatePromotion);
router.delete('/:id', protect, deletePromotion);

export default router;
