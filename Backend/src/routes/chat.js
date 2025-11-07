const express = require('express');
const {protect} = require( "../middlewares/auth.middlewares");
const chatController = require('../controller/chatController');

const router = express.Router();

router.post('/query', protect, chatController);

module.exports = router;
