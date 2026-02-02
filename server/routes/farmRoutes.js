const express = require('express');
const {
  addFarm,
  getUserFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
} = require('../controllers/farmController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // All routes require authentication

router.post('/', addFarm);
router.get('/', getUserFarms);
router.get('/:id', getFarmById);
router.put('/:id', updateFarm);
router.delete('/:id', deleteFarm);

module.exports = router;
