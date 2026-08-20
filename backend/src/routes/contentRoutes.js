import { Router } from 'express';
import {
  getContent,
  updateContent,
  uploadHeroImage,
  uploadLogo,
  uploadAboutImage,
  removeHeroImage,
  removeLogo,
  removeAboutImage,
  clearAboutImages,
  uploadAboutPageHero,
  uploadAboutPageStory,
  removeAboutPageHero,
  removeAboutPageStory,
} from '../controllers/contentController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.get('/', getContent);
router.put('/', protect, updateContent);
router.post('/hero-image', protect, upload.single('image'), uploadHeroImage);
router.delete('/hero-image', protect, removeHeroImage);
router.post('/logo', protect, upload.single('image'), uploadLogo);
router.delete('/logo', protect, removeLogo);
router.post('/about-image', protect, upload.single('image'), uploadAboutImage);
router.delete('/about-image/:index', protect, removeAboutImage);
router.delete('/about-images', protect, clearAboutImages);
router.post('/about-page/hero', protect, upload.single('image'), uploadAboutPageHero);
router.delete('/about-page/hero', protect, removeAboutPageHero);
router.post('/about-page/story', protect, upload.single('image'), uploadAboutPageStory);
router.delete('/about-page/story', protect, removeAboutPageStory);

export default router;
