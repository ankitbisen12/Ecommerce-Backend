const express = require('express');
const brandController = require('../controllers/brandController');

const router = express.Router();

// Products is already added in base path.
router
  .route('/')
  .get(brandController.fetchBrands)
  .post(brandController.createBrand);
module.exports = router;
