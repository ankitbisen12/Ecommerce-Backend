const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// user already added in base path
router.route('/own').get(userController.fetchUserById);
router.route('/:id').patch(userController.updateUser);

module.exports = router;
