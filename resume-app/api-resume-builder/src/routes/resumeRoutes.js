import express from 'express';
import {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.use(protect); // All resume routes are protected

router.route('/')
  .post(upload.single('profilePicture'), createResume)
  .get(getResumes);

router.route('/:id')
  .get(getResumeById)
  .put(upload.single('profilePicture'), updateResume)
  .delete(deleteResume);

export default router;
