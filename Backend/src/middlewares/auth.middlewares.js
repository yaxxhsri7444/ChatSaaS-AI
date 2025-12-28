const jwt = require("jsonwebtoken");
const Business = require("../models/Business");

async function protect(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: "Authorization header missing" });
    }

    console.log('Auth header:', header);
    const token = header.split(" ")[1];
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token payload:', payload);

      if (!payload) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const business = await Business.findById(payload.id);
      if (!business) {
        return res.status(401).json({ message: "Business not found" });
      }

      req.business = business;
      return next();
    } catch (verifyErr) {
      console.error('JWT verify error:', verifyErr.message);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = { protect };
