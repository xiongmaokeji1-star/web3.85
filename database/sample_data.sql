-- Web3 Security Platform — Sample Data
-- Run order: 02-sample.sql

USE web3security;

-- ── Default admin user (password: Admin@123456) ───────────────────────────
-- bcrypt hash for 'Admin@123456' with cost 12
INSERT IGNORE INTO users (id, email, password_hash, role, created_at) VALUES
('00000000-0000-0000-0000-000000000001',
 'admin@web3security.io',
 '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LwBhV5qQCjjDVc5Wy',
 'admin',
 NOW());

-- ── Sample fraud entries ───────────────────────────────────────────────────
INSERT IGNORE INTO fraud_entries (id, type, value, description, severity, source, created_at) VALUES
('fe000001-0000-0000-0000-000000000001', 'url',    'binance-secure.com',         'Fake Binance login page used in phishing campaign', 'critical', 'community', NOW()),
('fe000001-0000-0000-0000-000000000002', 'url',    'metamask-support.io',        'Impersonates MetaMask support to steal seed phrases', 'critical', 'community', NOW()),
('fe000001-0000-0000-0000-000000000003', 'url',    'coinbase-verify.net',        'Fake Coinbase KYC page', 'high', 'community', NOW()),
('fe000001-0000-0000-0000-000000000004', 'url',    'wallet-recovery.org',        'Wallet recovery scam harvesting private keys', 'critical', 'community', NOW()),
('fe000001-0000-0000-0000-000000000005', 'url',    'nft-free-mint.com',          'Fake NFT free mint draining wallets', 'high', 'community', NOW()),
('fe000001-0000-0000-0000-000000000006', 'wallet', '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef', 'Confirmed scammer wallet — multiple victim reports', 'critical', 'verified', NOW()),
('fe000001-0000-0000-0000-000000000007', 'wallet', '0xabcdef1234567890abcdef1234567890abcdef12', 'Rug pull deployer — TokenXYZ', 'high', 'on-chain', NOW()),
('fe000001-0000-0000-0000-000000000008', 'phone',  '+8613800138000',             'Fake customer support claiming to be Binance', 'medium', 'community', NOW()),
('fe000001-0000-0000-0000-000000000009', 'phone',  '+66812345678',               'Thai investment scam hotline', 'high', 'community', NOW()),
('fe000001-0000-0000-0000-000000000010', 'email',  'support@binance-help.com',   'Phishing email impersonating Binance support', 'high', 'community', NOW()),
('fe000001-0000-0000-0000-000000000011', 'email',  'admin@metamask-verify.io',   'Fake MetaMask account verification email', 'critical', 'community', NOW()),
('fe000001-0000-0000-0000-000000000012', 'token',  'SAFEMOON2',                  'Honeypot token — cannot sell after purchase', 'high', 'on-chain', NOW()),
('fe000001-0000-0000-0000-000000000013', 'token',  'SQUIDGAME2',                 'Rug pull — liquidity removed within 24 hours', 'critical', 'on-chain', NOW()),
('fe000001-0000-0000-0000-000000000014', 'contract','0x1234567890abcdef1234567890abcdef12345678','Honeypot contract — transferFrom disabled', 'critical', 'on-chain', NOW()),
('fe000001-0000-0000-0000-000000000015', 'url',    'ethereum-airdrop.com',       'Fake ETH airdrop — drains connected wallets', 'critical', 'community', NOW());

-- ── Sample pending reports ─────────────────────────────────────────────────
INSERT IGNORE INTO reports (id, type, value, description, contact_email, lang, status, created_at) VALUES
('rp000001-0000-0000-0000-000000000001', 'url',    'crypto-gains-daily.com', 'This site promised 200% daily returns and disappeared with my funds.', 'victim1@example.com', 'en', 'pending', DATE_SUB(NOW(), INTERVAL 2 DAY)),
('rp000001-0000-0000-0000-000000000002', 'wallet', '0x9999999999999999999999999999999999999999', 'Received a transaction from this wallet followed by a phishing attempt.', 'victim2@example.com', 'zh', 'pending', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('rp000001-0000-0000-0000-000000000003', 'phone',  '+855123456789', 'นี่คือหมายเลขโทรศัพท์ที่ใช้หลอกลวงในแคมเปญลงทุน', '', 'th', 'verified', DATE_SUB(NOW(), INTERVAL 3 DAY)),
('rp000001-0000-0000-0000-000000000004', 'token',  'MOONROCKET',   'Token disappeared from my wallet after approving the contract.', 'victim4@example.com', 'en', 'verified', DATE_SUB(NOW(), INTERVAL 5 DAY));
