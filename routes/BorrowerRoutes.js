const express = require('express');
const router = express.Router();
const { addBorrower, getBorrowerByID} = require('../models/Borrower');
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

router.get('/getBorrowerIDWithUserID/:id', authenticate, async (req, res) => {
  try {
    const borrowerID = await getBorrowerByID(req.params.id);
    if(!borrowerID){
      return res.status(404).json({ error: 'Borrower not found' });
    }
    res.json(borrowerID);
  } catch (err) {
    console.error("Error getting borrowerID:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;