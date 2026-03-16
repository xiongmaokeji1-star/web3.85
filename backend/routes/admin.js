const express = require('express');
const router = express.Router();
const { authMiddleware, adminOnly } = require('../middleware/auth');
const {
  getDashboardStats,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/adminController');

router.use(authMiddleware, adminOnly);

// GET  /api/admin/stats
router.get('/stats', getDashboardStats);

// GET  /api/admin/users
router.get('/users', getUsers);

// GET  /api/admin/users/:id
router.get('/users/:id', getUserById);

// PUT  /api/admin/users/:id
router.put('/users/:id', updateUser);

// DELETE /api/admin/users/:id
router.delete('/users/:id', deleteUser);

module.exports = router;
