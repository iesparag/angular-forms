import express from 'express';
import multer from 'multer';
import { sendEmail } from '../controllers/emailController.js';

const router = express.Router();

// Configure multer for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit per file
    files: 5, // Maximum 5 files
    fieldSize: 100 * 1024 * 1024 // 100MB field size limit
  }
});

// Route to send email with file attachments
router.post('/send-email', upload.array('attachments'), sendEmail);

export default router;
