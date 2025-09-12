const express = require('express');
const auth = require('../middlewares/auth.middlewares');
const docController = require('../controller/docController');

const router = express.Router();

router.post('/upload', auth, docController); // docController is middleware function exported earlier

module.exports = router;
