import { Router } from 'express';
import {
  updateProfile,
  changePassword,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.use(protect);

router.patch('/profile', updateProfile);
router.patch('/password', changePassword);

export default router;