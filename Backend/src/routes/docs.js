const express = require("express");
const { protect } = require("../middlewares/auth.middlewares");
const docController = require("../controller/docController");

const router = express.Router();

router.post("/upload", protect, docController);
module.exports = router;
