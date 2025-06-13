const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chartType: {
    type: String,
    required: true,
    enum: ['bar', 'line', 'pie', 'scatter', '3d-column']
  },
  xAxis: {
    type: String,
    required: true
  },
  yAxis: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  chartConfig: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  chartData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  chartImage: {
    type: String // URL or path to saved chart image
  },
  aiInsights: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis; 