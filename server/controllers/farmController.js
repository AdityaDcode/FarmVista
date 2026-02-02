const Farm = require('../models/Farm');

// Add farm
exports.addFarm = async (req, res) => {
  try {
    const { farmName, location, soilType, crop, cropStage, areaSqMeters } = req.body;

    // Validate input
    if (!farmName || !location || !soilType || !crop || !cropStage || !areaSqMeters) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const farm = new Farm({
      userId: req.user.userId,
      farmName,
      location,
      soilType,
      crop,
      cropStage,
      areaSqMeters,
    });

    await farm.save();
    res.status(201).json({ message: 'Farm added successfully', farm });
  } catch (error) {
    console.error('Add farm error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all farms for user
exports.getUserFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(farms);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single farm
exports.getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Check authorization
    if (farm.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(farm);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update farm
exports.updateFarm = async (req, res) => {
  try {
    let farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Check authorization
    if (farm.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    farm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({ message: 'Farm updated successfully', farm });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete farm
exports.deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (!farm) {
      return res.status(404).json({ message: 'Farm not found' });
    }

    // Check authorization
    if (farm.userId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Farm.findByIdAndDelete(req.params.id);

    res.json({ message: 'Farm deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
