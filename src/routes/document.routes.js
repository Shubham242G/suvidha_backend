import { Router } from 'express';
import {
  submitDocument,
  getMyDocument,
  getAllDocuments,
  getDocumentById,
} from '../controllers/document.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = Router();

// User routes
router.post('/', protect, submitDocument);
router.get('/me', protect, getMyDocument);

// Admin routes
router.get('/', protect, adminOnly, getAllDocuments);
router.get('/:id', protect, adminOnly, getDocumentById);

export default router;