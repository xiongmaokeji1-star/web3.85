const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

async function submitReport(req, res) {
  const { type, value, description, contactEmail, lang } = req.body;
  if (!type || !value) {
    return res.status(400).json({ success: false, message: 'type and value are required' });
  }

  const id = uuidv4();
  try {
    await db.query(
      `INSERT INTO reports (id, type, value, description, contact_email, lang, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [id, type, value, description || '', contactEmail || '', lang || 'en']
    );
    res.status(201).json({ success: true, data: { id, status: 'pending' } });
  } catch (err) {
    console.error('[Reports] submitReport error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to submit report' });
  }
}

async function getReports(req, res) {
  const { status, type, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const conditions = [];
  const params = [];

  if (status) { conditions.push('status = ?'); params.push(status); }
  if (type)   { conditions.push('type = ?');   params.push(type); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const [rows] = await db.query(
      `SELECT * FROM reports ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM reports ${where}`, params);
    res.json({ success: true, data: rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('[Reports] getReports error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch reports' });
  }
}

async function getReportById(req, res) {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM reports WHERE id = ? LIMIT 1', [id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Report not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch report' });
  }
}

async function updateReportStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ['pending', 'verified', 'rejected', 'resolved'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ success: false, message: `status must be one of: ${allowed.join(', ')}` });
  }
  try {
    await db.query('UPDATE reports SET status = ?, updated_at = NOW() WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
}

module.exports = { submitReport, getReports, getReportById, updateReportStatus };
