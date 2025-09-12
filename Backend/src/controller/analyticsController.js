const getAnalytics = require('../services/analyticsService');

export async function analytics(req, res) {
  try {
    const data = await getAnalytics(req.user.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
