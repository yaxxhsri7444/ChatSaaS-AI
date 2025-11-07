const { getAnalytic } = require('../services/analyticsService');

const analytics = async (req, res) => {
  try {
    const businessId = req.params.businessId; // ya req.query.businessId (frontend ke hisaab se)
    const data = await getAnalytic(businessId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

module.exports = { analytics };
