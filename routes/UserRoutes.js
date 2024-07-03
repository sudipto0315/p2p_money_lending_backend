const express = require('express');
const router = express.Router();
const { getUserByID,getUserByEmailandRole,getUserRole,addUser } = require('../models/User');
const authenticate = require('../middleware/authenticate');

router.post('/add', authenticate, async (req, res) => {
  try {
    const newUser = await addUser(req);
    res.status(201).json({UserID: newUser});
  } catch (err) {
    console.error("Error adding User:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await getUserByID(req.params.id);
    res.json(user);
  } catch (err) {
    console.error("Error getting User:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/exists/:email/:role', authenticate, async (req, res) => {
  try {
    const user = await getUserByEmailandRole(req.params.email,req.params.role);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error("Error getting User:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getUserWithEmailAndRole/:email/:role', authenticate, async (req, res) => {
  try {
    const user = await getUserByEmailandRole(req.params.email,req.params.role);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error("Error getting User:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/getUserRole/:email', authenticate, async (req, res) => {
  try {
    const roles = await getUserRole(req.params.email);
    if (!roles) {
      return res.status(404).json({ error: 'Roles not found' });
    }
    res.json(roles);
  } catch (err) {
    console.error("Error getting User:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
