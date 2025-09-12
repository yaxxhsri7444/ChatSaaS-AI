const router = require('express').Router();
const authController = require('../controller/authController');

router.post('/register', authController);
router.post('/login', authController);

module.exports = router;
