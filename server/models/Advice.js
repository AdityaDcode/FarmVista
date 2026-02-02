const mongoose = require('mongoose');

const adviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  farmId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Farm',
    required: true,
  },
  farmData: {
    farmName: String,
    crop: String,
    soilType: String,
    cropStage: String,
  },
  weatherData: {
    temperature: Number,
    humidity: Number,
    windSpeed: Number,
    description: String,
    feelsLike: Number,
    pressure: Number,
    cloudiness: Number,
    rainfall: Number,
  },
  aiAdvice: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Advice', adviceSchema);
