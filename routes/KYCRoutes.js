const express = require('express');
const router = express.Router();
const { addKYC } = require('../models/KYC');
const authenticate = require('../middleware/authenticate');

router.post('/add', authenticate, async (req, res) => {
  const BorrowerID = req.body.BorrowerID;

  if (!BorrowerID) {
    return res.status(400).json({ error: 'BorrowerID is required' });
  }

  try {
    const newKYC = await addKYC(req, BorrowerID);
    res.status(201).json(newKYC);
  } catch (err) {
    console.error("Error adding KYC:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
