const express = require('express');
const { protect } = require('../middlewares/auth.middlewares');
const chatController = require('../controller/chatController'); // this exports an express Router

const router = express.Router();

// Apply protect middleware to all chat routes, then delegate to the controller router
router.use(protect);
router.use('/', chatController);

module.exports = router;
