const express = require('express');
const router = express.Router();
const { checkUrl, checkPhone, checkEmail } = require('../controllers/detectionController');

// POST /api/detection/url
router.post('/url', checkUrl);

// POST /api/detection/phone
router.post('/phone', checkPhone);

// POST /api/detection/email
router.post('/email', checkEmail);

module.exports = router;
