/**
 * AI Controller — rule-based fraud/scam signal detection
 * (No external API key required; uses pattern matching + heuristics)
 */

// High-risk scam keywords mapped by language
const SCAM_PATTERNS = [
  // Investment / money doubling
  /double your (crypto|bitcoin|eth|money)/i,
  /guaranteed (profit|return|yield)/i,
  /risk.{0,5}free investment/i,
  /1000%|2000%|3000%|get rich quick/i,
  /send (BTC|ETH|USDT) and (get|receive) (back|double)/i,
  /passive income.{0,20}(crypto|web3|defi)/i,
  // Phishing / urgency
  /verify your wallet/i,
  /connect your wallet now/i,
  /your account (will be|is being) (suspended|closed|locked)/i,
  /click (here|this link) (immediately|now|urgently)/i,
  /limited time offer/i,
  /act now or lose/i,
  // Rug pull / fake token
  /presale (ends|closes) in/i,
  /exclusive (whitelist|airdrop)/i,
  /claim your (free|airdrop) tokens/i,
  /seed phrase|private key|mnemonic phrase/i,
  /send us your seed/i,
  /we need your private key/i,
  // Social engineering
  /i am (from|a) (binance|coinbase|metamask|trust wallet)/i,
  /customer support team/i,
  /(whatsapp|telegram).{0,10}(investment|profit|trader)/i,
  /high.?yield.?(investment|program)/i,
  /ponzi|pyramid scheme/i,
  /money mule/i,
];

const PHISHING_DOMAINS = [
  'binance-secure.com', 'metamask-support.io', 'coinbase-verify.net',
  'wallet-recovery.org', 'ethereum-airdrop.com', 'trustwallet-bonus.com',
  'uniswap-claim.net', 'opensea-verify.io', 'nft-free-mint.com'
];

function scoreText(text) {
  if (!text || typeof text !== 'string') return { score: 0, signals: [] };
  const signals = [];
  let score = 0;

  for (const pattern of SCAM_PATTERNS) {
    if (pattern.test(text)) {
      signals.push(pattern.source);
      score += 20;
    }
  }

  // Excessive punctuation / ALLCAPS
  if (/[!]{3,}/.test(text)) { score += 10; signals.push('excessive_exclamation'); }
  if (/[A-Z]{8,}/.test(text)) { score += 10; signals.push('excessive_caps'); }

  return { score: Math.min(score, 100), signals };
}

function getRiskLevel(score) {
  if (score >= 60) return 'HIGH';
  if (score >= 30) return 'MEDIUM';
  return 'LOW';
}

async function analyzeText(req, res) {
  const { text, lang } = req.body;
  if (!text || text.trim().length < 5) {
    return res.status(400).json({ success: false, message: 'Text is required (min 5 chars)' });
  }

  const { score, signals } = scoreText(text);
  const risk = getRiskLevel(score);

  const advice = {
    HIGH: '⚠️ High fraud risk detected. Do NOT click any links or share personal information.',
    MEDIUM: '🟡 Moderate risk. Proceed with caution and verify the source independently.',
    LOW: '✅ No significant fraud signals detected. Always stay vigilant.'
  };

  res.json({
    success: true,
    data: {
      risk,
      score,
      signals,
      advice: advice[risk],
      analyzedAt: new Date().toISOString()
    }
  });
}

async function analyzeUrl(req, res) {
  const { url } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  let hostname = '';
  try {
    hostname = new URL(url.startsWith('http') ? url : `https://${url}`).hostname.toLowerCase();
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid URL format' });
  }

  const signals = [];
  let score = 0;

  // Known phishing domain
  if (PHISHING_DOMAINS.includes(hostname)) {
    score += 80; signals.push('known_phishing_domain');
  }

  // Typo-squatting detection
  const trustedBrands = ['binance', 'coinbase', 'metamask', 'ethereum', 'uniswap', 'opensea', 'trustwallet'];
  for (const brand of trustedBrands) {
    if (hostname.includes(brand) && !hostname.endsWith(`${brand}.com`) && !hostname.endsWith(`${brand}.io`)) {
      score += 50; signals.push(`typosquat_${brand}`);
    }
  }

  // Excessive subdomains
  const parts = hostname.split('.');
  if (parts.length > 4) { score += 20; signals.push('excessive_subdomains'); }

  // Suspicious TLDs
  if (/\.(xyz|top|click|loan|gq|cf|tk|ml|ga)$/.test(hostname)) {
    score += 30; signals.push('suspicious_tld');
  }

  // IP address URL
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    score += 40; signals.push('ip_address_url');
  }

  const risk = getRiskLevel(Math.min(score, 100));

  res.json({
    success: true,
    data: {
      url,
      hostname,
      risk,
      score: Math.min(score, 100),
      signals,
      analyzedAt: new Date().toISOString()
    }
  });
}

module.exports = { analyzeText, analyzeUrl };
