const express = require('express');
const router = express.Router();
const { login, register, me, changePassword } = require('../controllers/authController');
const { authMiddleware } = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register  (admin creates new accounts)
router.post('/register', authMiddleware, register);

// GET  /api/auth/me
router.get('/me', authMiddleware, me);

// PUT  /api/auth/change-password
router.put('/change-password', authMiddleware, changePassword);

module.exports = router;
