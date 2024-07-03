const express = require('express');
const router = express.Router();
const { addKYC } = require('../models/KYC');
const authenticate = require('../middleware/authenticate');

router.post('/add', authenticate, async (req, res) => {
  const UserID = req.body.UserID;

  if (!UserID) {
    return res.status(400).json({ error: 'UserID is required' });
  }

  try {
    const newKYC = await addKYC(req, UserID);
    res.status(201).json(newKYC);
  } catch (err) {
    console.error("Error adding KYC:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
