const express = require('express');
const router = express.Router();
const { addBorrower } = require('../models/Borrower');
const authenticate = require('../middleware/authenticate');

router.post('/add', authenticate, async (req, res) => {
  try {
    const newBorrower = await addBorrower(req);
    res.status(201).json({BorrowerID: newBorrower});
  } catch (err) {
    console.error("Error adding borrower:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;