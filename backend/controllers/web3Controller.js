const db = require('../config/database');

// Known malicious wallet addresses (sample)
const BLACKLISTED_WALLETS = new Set([
  '0x00000000219ab540356cbb839cbe05303d7705fa',
  '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
]);

function isValidEthAddress(addr) {
  return /^0x[0-9a-fA-F]{40}$/.test(addr);
}

function isValidBtcAddress(addr) {
  return /^(1|3|bc1)[a-zA-HJ-NP-Z0-9]{25,62}$/.test(addr);
}

async function checkWallet(req, res) {
  const { address, chain } = req.body;
  if (!address) return res.status(400).json({ success: false, message: 'Wallet address is required' });

  const addr = address.trim().toLowerCase();
  const detectedChain = chain || (isValidEthAddress(addr) ? 'ETH' : isValidBtcAddress(addr) ? 'BTC' : 'UNKNOWN');

  // Check DB first
  let dbResult = null;
  try {
    const [rows] = await db.query(
      'SELECT * FROM fraud_entries WHERE type="wallet" AND LOWER(value)=? LIMIT 1',
      [addr]
    );
    dbResult = rows[0] || null;
  } catch { /* ignore */ }

  const isBlacklisted = BLACKLISTED_WALLETS.has(addr) || !!dbResult;
  const status = isBlacklisted ? 'DANGER' : 'UNKNOWN';

  res.json({
    success: true,
    data: {
      address: address.trim(),
      chain: detectedChain,
      status,
      isBlacklisted,
      details: dbResult || null,
      checkedAt: new Date().toISOString()
    }
  });
}

async function checkContract(req, res) {
  const { address, chain } = req.body;
  if (!address) return res.status(400).json({ success: false, message: 'Contract address is required' });

  const addr = address.trim().toLowerCase();
  if (!isValidEthAddress(addr)) {
    return res.status(400).json({ success: false, message: 'Invalid EVM contract address format' });
  }

  let dbResult = null;
  try {
    const [rows] = await db.query(
      'SELECT * FROM fraud_entries WHERE type="contract" AND LOWER(value)=? LIMIT 1',
      [addr]
    );
    dbResult = rows[0] || null;
  } catch { /* ignore */ }

  const status = dbResult ? 'DANGER' : 'UNKNOWN';

  res.json({
    success: true,
    data: {
      address: address.trim(),
      chain: chain || 'ETH',
      status,
      details: dbResult || null,
      checkedAt: new Date().toISOString()
    }
  });
}

async function checkToken(req, res) {
  const { symbol, contractAddress } = req.body;
  if (!symbol && !contractAddress) {
    return res.status(400).json({ success: false, message: 'Token symbol or contract address is required' });
  }

  let dbResult = null;
  try {
    const [rows] = await db.query(
      'SELECT * FROM fraud_entries WHERE type="token" AND (value=? OR value=?) LIMIT 1',
      [symbol || '', (contractAddress || '').toLowerCase()]
    );
    dbResult = rows[0] || null;
  } catch { /* ignore */ }

  const status = dbResult ? 'DANGER' : 'UNKNOWN';

  res.json({
    success: true,
    data: {
      symbol,
      contractAddress,
      status,
      details: dbResult || null,
      checkedAt: new Date().toISOString()
    }
  });
}

module.exports = { checkWallet, checkContract, checkToken };
