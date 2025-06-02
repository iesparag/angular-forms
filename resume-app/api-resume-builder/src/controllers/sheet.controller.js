import Sheet from '../models/sheet.model.js';
import expressAsyncHandler from 'express-async-handler';

const asyncHandler = expressAsyncHandler;

// @desc    Get all sheets
// @route   GET /api/sheets
// @access  Public (for now, can be made Private later)
const getSheets = asyncHandler(async (req, res) => {
  const sheets = await Sheet.find({});
  res.json(sheets);
});

// @desc    Get sheet by ID
// @route   GET /api/sheets/:id
// @access  Public (for now, can be made Private later)
const getSheetById = asyncHandler(async (req, res) => {
  const sheet = await Sheet.findById(req.params.id);
  
  if (sheet) {
    res.json(sheet);
  } else {
    res.status(404);
    throw new Error('Sheet not found');
  }
});

// @desc    Create a new sheet
// @route   POST /api/sheets
// @access  Public (for now, can be made Private later)
const createSheet = asyncHandler(async (req, res) => {
  const { name, emails } = req.body;

  if (!name || !emails || emails.length === 0) {
    res.status(400);
    throw new Error('Please provide name and at least one email');
  }

  const sheet = await Sheet.create({
    name,
    emails,
    userId: req.user ? req.user._id : null
  });

  if (sheet) {
    res.status(201).json(sheet);
  } else {
    res.status(400);
    throw new Error('Invalid sheet data');
  }
});

// @desc    Update a sheet
// @route   PUT /api/sheets/:id
// @access  Public (for now, can be made Private later)
const updateSheet = asyncHandler(async (req, res) => {
  const { name, emails } = req.body;

  const sheet = await Sheet.findById(req.params.id);

  if (sheet) {
    sheet.name = name || sheet.name;
    sheet.emails = emails || sheet.emails;

    const updatedSheet = await sheet.save();
    res.json(updatedSheet);
  } else {
    res.status(404);
    throw new Error('Sheet not found');
  }
});

// @desc    Delete a sheet
// @route   DELETE /api/sheets/:id
// @access  Public (for now, can be made Private later)
const deleteSheet = asyncHandler(async (req, res) => {
  const sheet = await Sheet.findById(req.params.id);

  if (sheet) {
    await Sheet.deleteOne({ _id: req.params.id });
    res.json({ message: 'Sheet removed' });
  } else {
    res.status(404);
    throw new Error('Sheet not found');
  }
});

export {
  getSheets,
  getSheetById,
  createSheet,
  updateSheet,
  deleteSheet
};
