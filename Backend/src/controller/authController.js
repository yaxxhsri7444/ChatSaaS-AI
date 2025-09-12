const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Business = require('../models/Business');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { businessName, ownerEmail, password } = req.body;
    if (!businessName || !ownerEmail || !password) return res.status(400).json({ error: 'Missing fields' });
    const existing = await Business.findOne({ ownerEmail });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const business = new Business({ businessName, ownerEmail, passwordHash: hash, tenantId: new Date().getTime().toString() });
    await business.save();
    const token = jwt.sign({ id: business._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });
    res.json({ token, business: { id: business._id, businessName: business.businessName, ownerEmail: business.ownerEmail } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { ownerEmail, password } = req.body;
    if (!ownerEmail || !password) return res.status(400).json({ error: 'Missing fields' });
    const business = await Business.findOne({ ownerEmail });
    if (!business) return res.status(400).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, business.passwordHash);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: business._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '30d' });
    res.json({ token, business: { id: business._id, businessName: business.businessName, ownerEmail: business.ownerEmail } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
