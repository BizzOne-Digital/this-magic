import { Router } from 'express';
import {
  getGallery,
  bulkCreateGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  reorderGallery,
} from '../controllers/galleryController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', getGallery);
router.post('/bulk', protect, upload.array('images', 30), bulkCreateGalleryItems);
router.post('/', protect, upload.single('image'), createGalleryItem);
router.put('/reorder', protect, reorderGallery);
router.put('/:id', protect, upload.single('image'), updateGalleryItem);
router.delete('/:id', protect, deleteGalleryItem);

export default router;
