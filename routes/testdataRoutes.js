const express = require('express');
const router = express.Router();
const { getTestData } = require('../models/testdata');

router.get('/', async (req, res) => {
    try {
        const data = await getTestData();
        res.json(data);
    } catch (err) {
        console.error("Error getting test data:", err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
