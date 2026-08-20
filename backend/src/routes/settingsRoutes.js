import { Router } from 'express';
import { getSettings, updateSettings, getDashboardStats } from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getSettings);
router.put('/', protect, updateSettings);
router.get('/dashboard', protect, getDashboardStats);

export default router;
