const express = require('express');
const router = express.Router();
const { auth, adminAuth } = require('../middleware/auth');
const Analysis = require('../models/Analysis');
const File = require('../models/File');

// Save a new analysis (chart config)
router.post('/save', auth, async (req, res) => {
  try {
    const { fileId, chartType, xAxis, yAxis, title, description, chartConfig, chartData, chartImage, aiInsights } = req.body;
    const file = await File.findById(fileId);
    if (!file || file.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'File not found or unauthorized' });
    }
    const analysis = new Analysis({
      file: fileId,
      user: req.user._id,
      chartType,
      xAxis,
      yAxis,
      title,
      description,
      chartConfig,
      chartData,
      chartImage,
      aiInsights
    });
    await analysis.save();
    file.analyses.push(analysis._id);
    await file.save();
    res.status(201).json({ message: 'Analysis saved', analysis });
  } catch (error) {
    res.status(500).json({ message: 'Error saving analysis' });
  }
});

// Get user's analysis history
router.get('/history', auth, async (req, res) => {
  try {
    const analyses = await Analysis.find({ user: req.user._id })
      .populate('file', 'originalName')
      .sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analysis history' });
  }
});

// Get a specific analysis
router.get('/:id', auth, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('file', 'originalName');
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analysis' });
  }
});

// Admin: Get all analyses
router.get('/', adminAuth, async (req, res) => {
  try {
    const analyses = await Analysis.find().populate('user', 'username email').populate('file', 'originalName');
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analyses' });
  }
});

module.exports = router; 