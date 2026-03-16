const express = require('express');
const router = express.Router();
const { checkWallet, checkContract, checkToken } = require('../controllers/web3Controller');

// POST /api/web3/wallet
router.post('/wallet', checkWallet);

// POST /api/web3/contract
router.post('/contract', checkContract);

// POST /api/web3/token
router.post('/token', checkToken);

module.exports = router;
