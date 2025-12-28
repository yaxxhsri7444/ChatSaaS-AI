const express = require('express');
const { protect } = require('../middlewares/auth.middlewares');

const router = express.Router();

// GET /api/debug/whoami  (protected)
router.get('/whoami', protect, (req, res) => {
  try {
    const b = req.business;
    res.json({ id: b._id, ownerEmail: b.ownerEmail, businessName: b.businessName });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
