const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// user already added in base path
router
  .route('/:id')
  .get(userController.fetchUserById)
  .patch(userController.updateUser);

module.exports = router;