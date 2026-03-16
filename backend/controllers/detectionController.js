const db = require('../config/database');

const KNOWN_FRAUD_URLS = new Set([
  'binance-secure.com', 'metamask-support.io', 'coinbase-verify.net',
  'wallet-recovery.org', 'nft-free-mint.com'
]);

async function checkUrl(req, res) {
  const { url } = req.body;
  if (!url) return res.status(400).json({ success: false, message: 'URL is required' });

  let hostname = '';
  try {
    hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.toLowerCase();
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid URL format' });
  }

  // Check fraud DB
  let dbResult = null;
  try {
    const [rows] = await db.query(
      'SELECT * FROM fraud_entries WHERE type="url" AND value=? LIMIT 1',
      [hostname]
    );
    dbResult = rows[0] || null;
  } catch { /* DB may not be available yet */ }

  const inKnownList = KNOWN_FRAUD_URLS.has(hostname);
  const status = (dbResult || inKnownList) ? 'DANGER' : 'SAFE';

  res.json({
    success: true,
    data: {
      url,
      hostname,
      status,
      source: dbResult ? 'database' : inKnownList ? 'local_list' : 'clean',
      details: dbResult || null,
      checkedAt: new Date().toISOString()
    }
  });
}

async function checkPhone(req, res) {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ success: false, message: 'Phone number is required' });

  const normalized = phone.replace(/[\s\-().+]/g, '');

  let dbResult = null;
  try {
    const [rows] = await db.query(
      'SELECT * FROM fraud_entries WHERE type="phone" AND value=? LIMIT 1',
      [normalized]
    );
    dbResult = rows[0] || null;
  } catch { /* ignore */ }

  res.json({
    success: true,
    data: {
      phone,
      normalized,
      status: dbResult ? 'DANGER' : 'UNKNOWN',
      details: dbResult || null,
      checkedAt: new Date().toISOString()
    }
  });
}

async function checkEmail(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  let dbResult = null;
  try {
    const [rows] = await db.query(
      'SELECT * FROM fraud_entries WHERE type="email" AND value=? LIMIT 1',
      [email.toLowerCase()]
    );
    dbResult = rows[0] || null;
  } catch { /* ignore */ }

  // Suspicious domain check
  const domain = email.split('@')[1] || '';
  const suspiciousDomains = ['tempmail.com', 'throwam.com', 'mailinator.com', 'guerrillamail.com'];
  const isSuspicious = suspiciousDomains.includes(domain.toLowerCase());

  res.json({
    success: true,
    data: {
      email,
      status: dbResult ? 'DANGER' : isSuspicious ? 'SUSPICIOUS' : 'UNKNOWN',
      suspicious: isSuspicious,
      details: dbResult || null,
      checkedAt: new Date().toISOString()
    }
  });
}

module.exports = { checkUrl, checkPhone, checkEmail };
