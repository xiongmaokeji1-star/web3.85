const express = require('express');
const router = express.Router();
const { submitReport, getReports, getReportById, updateReportStatus } = require('../controllers/reportsController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// POST /api/reports          — anyone can submit
router.post('/', submitReport);

// GET /api/reports           — admin only
router.get('/', authMiddleware, adminOnly, getReports);

// GET /api/reports/:id       — admin only
router.get('/:id', authMiddleware, adminOnly, getReportById);

// PUT /api/reports/:id/status — admin only
router.put('/:id/status', authMiddleware, adminOnly, updateReportStatus);

module.exports = router;
