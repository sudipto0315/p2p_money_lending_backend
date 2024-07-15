const express = require('express');
const router = express.Router();
const { addLoanRequest, getLoanByID} = require('../models/Loan.js');
const authenticate = require('../middleware/authenticate');
router.post('/request', authenticate, async (req, res) => {
  try {
    const newLoan = await addLoanRequest(req, res);
    res.status(201).json({LoanRequestID: newLoan});
  } catch (err) {
    console.error("Error adding loan:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const loan = await getLoanByID(req.params.id);
    res.json(loan);
  } catch (err) {
    console.error("Error getting loan:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;