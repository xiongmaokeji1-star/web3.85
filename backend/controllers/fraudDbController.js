const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

async function listFraudEntries(req, res) {
  const { type, keyword, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const conditions = [];
  const params = [];

  if (type)    { conditions.push('type = ?');   params.push(type); }
  if (keyword) { conditions.push('(value LIKE ? OR description LIKE ?)'); params.push(`%${keyword}%`, `%${keyword}%`); }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  try {
    const [rows] = await db.query(
      `SELECT * FROM fraud_entries ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), offset]
    );
    const [[{ total }]] = await db.query(`SELECT COUNT(*) AS total FROM fraud_entries ${where}`, params);
    res.json({ success: true, data: rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('[FraudDB] listFraudEntries error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch fraud entries' });
  }
}

async function getFraudEntry(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM fraud_entries WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: 'Entry not found' });
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch entry' });
  }
}

async function createFraudEntry(req, res) {
  const { type, value, description, severity, source } = req.body;
  if (!type || !value) {
    return res.status(400).json({ success: false, message: 'type and value are required' });
  }
  const id = uuidv4();
  try {
    await db.query(
      `INSERT INTO fraud_entries (id, type, value, description, severity, source, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [id, type, value, description || '', severity || 'medium', source || 'manual']
    );
    res.status(201).json({ success: true, data: { id } });
  } catch (err) {
    console.error('[FraudDB] createFraudEntry error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to create entry' });
  }
}

async function updateFraudEntry(req, res) {
  const { description, severity } = req.body;
  try {
    await db.query(
      'UPDATE fraud_entries SET description = ?, severity = ?, updated_at = NOW() WHERE id = ?',
      [description || '', severity || 'medium', req.params.id]
    );
    res.json({ success: true, message: 'Entry updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update entry' });
  }
}

async function deleteFraudEntry(req, res) {
  try {
    await db.query('DELETE FROM fraud_entries WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete entry' });
  }
}

module.exports = { listFraudEntries, getFraudEntry, createFraudEntry, updateFraudEntry, deleteFraudEntry };
