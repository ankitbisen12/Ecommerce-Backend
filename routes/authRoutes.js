const express = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');
const router = express.Router();

// auth already added in base path
router.route('/signup').post(authController.createUser);

router
  .route('/login')
  .post(passport.authenticate('local'), authController.loginUser);
router.route('/logout').get(authController.logOut);

router.route('/check').get(passport.authenticate('jwt'),authController.checkAuth);
module.exports = router;

