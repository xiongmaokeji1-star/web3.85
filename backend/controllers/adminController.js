const db = require('../config/database');

async function getDashboardStats(req, res) {
  try {
    const [[{ total_reports }]] = await db.query('SELECT COUNT(*) AS total_reports FROM reports');
    const [[{ pending_reports }]] = await db.query('SELECT COUNT(*) AS pending_reports FROM reports WHERE status="pending"');
    const [[{ total_fraud }]] = await db.query('SELECT COUNT(*) AS total_fraud FROM fraud_entries');
    const [[{ total_users }]] = await db.query('SELECT COUNT(*) AS total_users FROM users');

    const [recent] = await db.query(
      'SELECT id, type, value, status, created_at FROM reports ORDER BY created_at DESC LIMIT 5'
    );

    res.json({
      success: true,
      data: {
        totalReports: total_reports,
        pendingReports: pending_reports,
        totalFraudEntries: total_fraud,
        totalUsers: total_users,
        recentReports: recent
      }
    });
  } catch (err) {
    console.error('[Admin] getDashboardStats error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
}

async function getUsers(req, res) {
  const { page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  try {
    const [rows] = await db.query(
      'SELECT id, email, role, created_at, last_login FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [parseInt(limit), offset]
    );
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM users');
    res.json({ success: true, data: rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
}

async function getUserById(req, res) {
  try {
    const [rows] = await db.query(
      'SELECT id, email, role, created_at, last_login FROM users WHERE id = ?',
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
}

async function updateUser(req, res) {
  const { role } = req.body;
  if (!['admin', 'moderator'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }
  try {
    await db.query('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
    res.json({ success: true, message: 'User updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update user' });
  }
}

async function deleteUser(req, res) {
  if (req.user.id === req.params.id) {
    return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
  }
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete user' });
  }
}

module.exports = { getDashboardStats, getUsers, getUserById, updateUser, deleteUser };
