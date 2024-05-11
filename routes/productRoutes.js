const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Products is already added in base path.
// router.route('/products').get(createProduct);
router
  .route('/')
  .get(productController.fetchAllProducts)
  .post(productController.createProduct);

router
  .route('/:id') //Here id is varibale in route
  .get(productController.fetchProductById)
  .patch(productController.updateProduct);

module.exports = router;
