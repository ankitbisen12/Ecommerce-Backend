const express = require('express');
const router = express.Router();
const mailController = require('../controllers/mailController');

// auth already added in base path
router.route('/').post(mailController.sendMailRequest);
router.route('/password-reset').post(mailController.resetPassword);

module.exports = router;
