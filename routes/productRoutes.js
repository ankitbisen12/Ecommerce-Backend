const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

// Products is already added in base path.
// router.route('/products').get(createProduct);
router
  .route('/')
  .post(productController.createProduct)
  .get(productController.fetchProducts)
  .get(productController.fetchAllProducts);

router
  .route('/:id')
  .get(productController.fetchProductById)
  .patch(productController.updateProduct);

module.exports = router;
