const express = require("express");
const analytics = require("../controller/analyticsController.js"); 
const authMiddleware = require( "../middleware/authMiddleware.js");

const router = express.Router();
router.get("/", authMiddleware, analytics);

export default router;
