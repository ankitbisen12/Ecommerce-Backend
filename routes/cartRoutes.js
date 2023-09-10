const express = require('express');
const cartController = require('../controllers/cartController');
const router = express.Router();

router
  .route('/')
  .post(cartController.addToCart).get(cartController.fetchCartByUser);

router
  .route('/:id')
  .delete(cartController.deleteFromCart)
  .patch(cartController.updateCart);

module.exports = router;
