const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const xlsx = require('xlsx');
const { auth } = require('../middleware/auth');
const File = require('../models/File');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.xlsx', '.xls'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Upload Excel file
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Read Excel file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    const columns = Object.keys(data[0] || {});

    // Create file record
    const file = new File({
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      size: req.file.size,
      mimetype: req.file.mimetype,
      columns,
      data,
      user: req.user._id
    });

    await file.save();

    // Add file to user's uploads
    req.user.uploads.push(file._id);
    await req.user.save();

    res.status(201).json({
      message: 'File uploaded successfully',
      file: {
        id: file._id,
        filename: file.filename,
        originalName: file.originalName,
        columns: file.columns,
        createdAt: file.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Get user's files
router.get('/my-files', auth, async (req, res) => {
  try {
    const files = await File.find({ user: req.user._id })
      .select('filename originalName columns createdAt')
      .sort({ createdAt: -1 });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching files' });
  }
});

// Get file details
router.get('/:id', auth, async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.json({
      id: file._id,
      filename: file.filename,
      originalName: file.originalName,
      columns: file.columns,
      data: file.data,
      createdAt: file.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching file' });
  }
});

// Delete file
router.delete('/:id', auth, async (req, res) => {
  try {
    const file = await File.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Remove file from user's uploads
    req.user.uploads = req.user.uploads.filter(
      upload => upload.toString() !== file._id.toString()
    );
    await req.user.save();

    // Delete file record
    await file.remove();

    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file' });
  }
});

module.exports = router; 