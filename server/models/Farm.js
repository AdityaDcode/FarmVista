const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  farmName: {
    type: String,
    required: [true, 'Please provide a farm name'],
    trim: true,
  },
  location: {
    latitude: {
      type: Number,
      required: [true, 'Please provide latitude'],
    },
    longitude: {
      type: Number,
      required: [true, 'Please provide longitude'],
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
  },
  soilType: {
    type: String,
    enum: [
      'Black Soil',
      'Red Soil',
      'Alluvial Soil',
      'Laterite Soil',
      'Desert Soil',
      'Mountain Soil',
      'Clay Loam',
      'Sandy Loam',
    ],
    required: [true, 'Please select a soil type'],
  },
  crop: {
    type: String,
    required: [true, 'Please provide a crop name'],
    trim: true,
  },
  cropStage: {
    type: String,
    enum: ['Seedling', 'Vegetative', 'Flowering', 'Maturity'],
    required: [true, 'Please select crop stage'],
  },
  areaSqMeters: {
    type: Number,
    required: [true, 'Please provide farm area'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Farm', farmSchema);
