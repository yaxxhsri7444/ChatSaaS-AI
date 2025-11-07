const express = require("express");
const router = express.Router();
const { analytics } = require("../controller/analyticsController"); // ✅ yahi sahi hai

router.get("/:businessId", analytics);

module.exports = router;
