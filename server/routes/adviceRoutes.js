const express = require('express');
const {
  generateAdvice,
  getAdviceHistory,
  getAllUserAdvice,
} = require('../controllers/adviceController');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth); // All routes require authentication

router.post('/generate/:farmId', generateAdvice);
router.get('/farm/:farmId', getAdviceHistory);
router.get('/', getAllUserAdvice);

module.exports = router;
