const Cart = require('../models/cartModel');
const catchAsync = require('../utils/catchAsync');

exports.fetchCartByUser = catchAsync(async (req, res, next) => {
  const { user } = req.query;
  const cartItems = await Cart.find({ user: user })
    .populate('user')
    .populate('product');
  res.status(200).json(cartItems);
});

exports.addToCart = catchAsync(async (req, res, next) => {
  const newItem = await Cart.create(req.body);
  const result = await newItem.populate('product');
  res.status(201).json(result);
});

exports.deleteFromCart = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await Cart.findByIdAndDelete(id);
  res.status(200).json(doc);
});

exports.updateCart = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const cart = await Cart.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  const result = await cart.populate('product');
  res.status(200).json(result);
});
