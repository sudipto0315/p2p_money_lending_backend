const express = require('express');
const router = express.Router();
const { addLender, getLenderByID } = require('../models/Lender');
const authenticate = require('../middleware/authenticate');

router.post('/add', authenticate, async (req, res) => {
    try {
        const newLender = await addLender(req);
        res.status(201).json({LenderID: newLender});
    } catch (err) {
        console.error("Error adding lender:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', authenticate, async (req, res) => {
    try {
        const lender = await getLenderByID(req.params.id);
        res.json(lender);
    } catch (err) {
        console.error("Error getting lender:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;