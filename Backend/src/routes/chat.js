const express = require('express');
const auth = require('../middlewares/auth.middlewares');
const chatController = require('../controller/chatController');

const router = express.Router();

router.post('/query', auth, chatController);

module.exports = router;
