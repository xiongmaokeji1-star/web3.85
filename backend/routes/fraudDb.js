const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const {
  listFraudEntries,
  getFraudEntry,
  createFraudEntry,
  updateFraudEntry,
  deleteFraudEntry
} = require('../controllers/fraudDbController');

// Public read
router.get('/', listFraudEntries);
router.get('/:id', getFraudEntry);

// Admin write
router.post('/', authMiddleware, adminOnly, createFraudEntry);
router.put('/:id', authMiddleware, adminOnly, updateFraudEntry);
router.delete('/:id', authMiddleware, adminOnly, deleteFraudEntry);

module.exports = router;
