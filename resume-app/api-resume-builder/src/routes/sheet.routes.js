import express from 'express';
const router = express.Router();
import {
  getSheets,
  getSheetById,
  createSheet,
  updateSheet,
  deleteSheet
} from '../controllers/sheet.controller.js';

// Route: /api/sheets
router.route('/')
  .get(getSheets)
  .post(createSheet);

// Route: /api/sheets/:id
router.route('/:id')
  .get(getSheetById)
  .put(updateSheet)
  .delete(deleteSheet);

export default router;
