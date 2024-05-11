const express = require('express');
const categoryController = require('../controllers/categoryController');

const router = express.Router();

// Products is already added in base path.
router
  .route('/')
  .get(categoryController.fetchCategories)
  .post(categoryController.createCategory);

module.exports = router;
